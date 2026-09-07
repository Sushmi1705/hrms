using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Manager.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MssController : ControllerBase
{
    private readonly IMssRepository _mss;

    public MssController(IMssRepository mss) => _mss = mss;

    private async Task<EmployeeEntity> GetManagerAsync()
    {
        Guid? overrideId = null;
        string? email = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            email = User.FindFirst(ClaimTypes.Email)?.Value;
            var claim = User.FindFirst("employee_id")?.Value ?? User.FindFirst("EmployeeId")?.Value;
            if (Guid.TryParse(claim, out var pid)) overrideId = pid;
        }
        if (Request.Headers.TryGetValue("X-Employee-Id", out var hv) && Guid.TryParse(hv, out var hid)) overrideId = hid;
        var manager = await _mss.ResolveManagerAsync(overrideId, email);
        if (manager == null) throw new UnauthorizedAccessException("Unable to resolve manager profile.");
        return manager;
    }

    // ─── Dashboard ────────────────────────────────────────────────
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var manager = await GetManagerAsync();
        var data = await _mss.GetDashboardAsync(manager.Id);
        return Ok(data);
    }

    // ─── Team ─────────────────────────────────────────────────────
    [HttpGet("team")]
    public async Task<IActionResult> GetTeam([FromQuery] MssTeamFilterDto filter)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamAsync(manager.Id, filter));
    }

    [HttpGet("team/directory")]
    public async Task<IActionResult> GetTeamDirectory([FromQuery] string? search)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamDirectoryAsync(manager.Id, search));
    }

    [HttpGet("team/{employeeId:guid}")]
    public async Task<IActionResult> GetTeamMember(Guid employeeId)
    {
        var manager = await GetManagerAsync();
        var member = await _mss.GetTeamMemberAsync(manager.Id, employeeId);
        return member == null ? NotFound(new { message = "Employee not found in your team." }) : Ok(member);
    }

    // ─── Attendance ───────────────────────────────────────────────
    [HttpGet("team/attendance")]
    public async Task<IActionResult> GetTeamAttendance([FromQuery] int? month, [FromQuery] int? year, [FromQuery] Guid? employeeId)
    {
        var manager = await GetManagerAsync();
        var today = DateTime.Today;
        return Ok(await _mss.GetTeamAttendanceAsync(manager.Id, month ?? today.Month, year ?? today.Year, employeeId));
    }

    [HttpGet("attendance-requests")]
    public async Task<IActionResult> GetAttendanceRequests([FromQuery] string? status)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetAttendanceRequestsAsync(manager.Id, status));
    }

    [HttpPost("attendance-requests/{requestId:guid}/approve")]
    public async Task<IActionResult> ApproveAttendanceRequest(Guid requestId, [FromBody] ApproveAttendanceRequestDto dto)
    {
        var manager = await GetManagerAsync();
        dto.Approved = true;
        var ok = await _mss.ApproveAttendanceRequestAsync(manager.Id, requestId, true, dto.Comments);
        return ok ? Ok(new { message = "Approved." }) : NotFound(new { message = "Request not found in your team." });
    }

    [HttpPost("attendance-requests/{requestId:guid}/reject")]
    public async Task<IActionResult> RejectAttendanceRequest(Guid requestId, [FromBody] ApproveAttendanceRequestDto dto)
    {
        var manager = await GetManagerAsync();
        var ok = await _mss.ApproveAttendanceRequestAsync(manager.Id, requestId, false, dto.Comments);
        return ok ? Ok(new { message = "Rejected." }) : NotFound(new { message = "Request not found in your team." });
    }

    // ─── Leave ────────────────────────────────────────────────────
    [HttpGet("team/leave")]
    public async Task<IActionResult> GetTeamLeave([FromQuery] string? status, [FromQuery] Guid? employeeId)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamLeaveAsync(manager.Id, status, employeeId));
    }

    [HttpPost("leave-requests/{leaveId:guid}/approve")]
    public async Task<IActionResult> ApproveLeave(Guid leaveId, [FromBody] ApproveLeaveDto dto)
    {
        var manager = await GetManagerAsync();
        dto.Approved = true;
        var ok = await _mss.ApproveLeaveAsync(manager.Id, leaveId, true, dto.Comments);
        return ok ? Ok(new { message = "Leave approved." }) : NotFound(new { message = "Leave request not found in your team." });
    }

    [HttpPost("leave-requests/{leaveId:guid}/reject")]
    public async Task<IActionResult> RejectLeave(Guid leaveId, [FromBody] ApproveLeaveDto dto)
    {
        var manager = await GetManagerAsync();
        var ok = await _mss.ApproveLeaveAsync(manager.Id, leaveId, false, dto.Comments);
        return ok ? Ok(new { message = "Leave rejected." }) : NotFound(new { message = "Leave request not found in your team." });
    }

    // ─── Performance ──────────────────────────────────────────────
    [HttpGet("performance")]
    public async Task<IActionResult> GetPerformance()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamPerformanceAsync(manager.Id));
    }

    [HttpGet("goals")]
    public async Task<IActionResult> GetGoals([FromQuery] Guid? employeeId)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamGoalsAsync(manager.Id, employeeId));
    }

    [HttpPost("goals")]
    public async Task<IActionResult> CreateGoal([FromBody] CreateMssGoalDto dto)
    {
        var manager = await GetManagerAsync();
        try { return Ok(await _mss.CreateGoalAsync(manager.Id, dto)); }
        catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    }

    [HttpPut("goals/{goalId:guid}/progress")]
    public async Task<IActionResult> UpdateGoalProgress(Guid goalId, [FromBody] UpdateGoalProgressDto dto)
    {
        var manager = await GetManagerAsync();
        var ok = await _mss.UpdateGoalProgressAsync(manager.Id, goalId, dto.Progress, dto.Comments);
        return ok ? Ok(new { message = "Progress updated." }) : NotFound(new { message = "Goal not found in your team." });
    }

    [HttpPost("reviews/{reviewId:guid}/submit")]
    public async Task<IActionResult> SubmitReview(Guid reviewId, [FromBody] SubmitReviewDto dto)
    {
        var manager = await GetManagerAsync();
        var ok = await _mss.SubmitPerformanceReviewAsync(manager.Id, reviewId, dto);
        return ok ? Ok(new { message = "Review submitted." }) : NotFound(new { message = "Review not found in your team." });
    }

    [HttpPost("feedback")]
    public async Task<IActionResult> SubmitFeedback([FromBody] CreateMssFeedbackDto dto)
    {
        var manager = await GetManagerAsync();
        try { var ok = await _mss.SubmitFeedbackAsync(manager.Id, dto); return ok ? Ok(new { message = "Feedback submitted." }) : Forbid("Employee not in your team."); }
        catch { return BadRequest(new { message = "Failed to submit feedback." }); }
    }

    // ─── Training ─────────────────────────────────────────────────
    [HttpGet("training")]
    public async Task<IActionResult> GetTraining()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamTrainingAsync(manager.Id));
    }

    // ─── Assets ───────────────────────────────────────────────────
    [HttpGet("assets")]
    public async Task<IActionResult> GetAssets()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamAssetsAsync(manager.Id));
    }

    // ─── Compensation ─────────────────────────────────────────────
    [HttpGet("compensation")]
    public async Task<IActionResult> GetCompensation()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamCompensationAsync(manager.Id));
    }

    [HttpPost("compensation/recommendations")]
    public async Task<IActionResult> SubmitCompRecommendation([FromBody] CreateCompRecommendationDto dto)
    {
        var manager = await GetManagerAsync();
        try { return Ok(await _mss.SubmitCompRecommendationAsync(manager.Id, dto)); }
        catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
    }

    // ─── Approvals ────────────────────────────────────────────────
    [HttpGet("approvals")]
    public async Task<IActionResult> GetApprovals([FromQuery] string? category)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetManagerApprovalsAsync(manager.Id, category));
    }

    // ─── HR Requests ──────────────────────────────────────────────
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests([FromQuery] string? status)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetManagerRequestsAsync(manager.Id, status));
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateMssHRRequestDto dto)
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.CreateManagerRequestAsync(manager.Id, dto));
    }

    // ─── Calendar / Analytics / Notifications ─────────────────────
    [HttpGet("team/calendar")]
    public async Task<IActionResult> GetCalendar([FromQuery] int? month, [FromQuery] int? year)
    {
        var manager = await GetManagerAsync();
        var today = DateTime.Today;
        return Ok(await _mss.GetTeamCalendarAsync(manager.Id, month ?? today.Month, year ?? today.Year));
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetTeamAnalyticsAsync(manager.Id));
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var manager = await GetManagerAsync();
        return Ok(await _mss.GetManagerNotificationsAsync(manager.Id));
    }
}
