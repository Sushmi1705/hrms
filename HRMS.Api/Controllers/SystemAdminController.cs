using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.SystemAdmin.Commands;
using HRMS.Application.Features.SystemAdmin.DTOs;
using HRMS.Application.Features.SystemAdmin.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/admin")]
public class SystemAdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public SystemAdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private string CurrentAdminName => User.Identity?.Name ?? "Administrator";
    private string CurrentAdminIp => HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

    // 1. Dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var result = await _mediator.Send(new GetAdminDashboardQuery());
        return Ok(result);
    }

    // 2. User Management
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] string? company,
        [FromQuery] string? department,
        [FromQuery] string? status,
        [FromQuery] bool? mfa,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetUsersPagedQuery(search, role, company, department, status, mfa, page, pageSize));
        return Ok(result);
    }

    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetUserDetails(Guid id)
    {
        var result = await _mediator.Send(new GetUserDetailsQuery(id));
        if (result == null) return NotFound(new { message = "User not found" });
        return Ok(result);
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var result = await _mediator.Send(new CreateUserCommand(dto, CurrentAdminName, CurrentAdminIp));
            return CreatedAtAction(nameof(GetUserDetails), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var result = await _mediator.Send(new UpdateUserCommand(id, dto, CurrentAdminName, CurrentAdminIp));
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new DeleteUserCommand(id, CurrentAdminName, CurrentAdminIp));
            if (!result) return NotFound(new { message = "User not found" });
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("users/{id:guid}/activate")]
    public async Task<IActionResult> ActivateUser(Guid id)
    {
        var result = await _mediator.Send(new ActivateUserCommand(id, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "User account activated." });
    }

    [HttpPost("users/{id:guid}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new DeactivateUserCommand(id, CurrentAdminName, CurrentAdminIp));
            if (!result) return NotFound();
            return Ok(new { success = true, message = "User account deactivated." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("users/{id:guid}/lock")]
    public async Task<IActionResult> LockUser(Guid id, [FromBody] Dictionary<string, string>? payload)
    {
        try
        {
            var reason = payload != null && payload.ContainsKey("reason") ? payload["reason"] : "Administrative security lock";
            var result = await _mediator.Send(new LockUserCommand(id, reason, CurrentAdminName, CurrentAdminIp));
            if (!result) return NotFound();
            return Ok(new { success = true, message = "User account locked." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("users/{id:guid}/unlock")]
    public async Task<IActionResult> UnlockUser(Guid id)
    {
        var result = await _mediator.Send(new UnlockUserCommand(id, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "User account unlocked." });
    }

    [HttpPost("users/{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] Dictionary<string, string>? payload)
    {
        try
        {
            var customPass = payload != null && payload.ContainsKey("password") ? payload["password"] : null;
            var newPass = await _mediator.Send(new ResetUserPasswordCommand(id, customPass, CurrentAdminName, CurrentAdminIp));
            return Ok(new { success = true, temporaryPassword = newPass, message = "Password reset successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("users/{id:guid}/force-logout")]
    public async Task<IActionResult> ForceLogout(Guid id)
    {
        var result = await _mediator.Send(new ForceLogoutUserCommand(id, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "User sessions terminated." });
    }

    [HttpGet("users/{id:guid}/roles")]
    public async Task<IActionResult> GetUserRoles(Guid id)
    {
        var result = await _mediator.Send(new GetUsersPagedQuery(null, null, null, null, null, null, 1, 1));
        var roles = await _mediator.Send(new GetRolesQuery());
        var userDetails = await _mediator.Send(new GetUserDetailsQuery(id));
        if (userDetails == null) return NotFound();
        return Ok(userDetails.RoleAssignments);
    }

    [HttpPut("users/{id:guid}/roles")]
    public async Task<IActionResult> UpdateUserRoles(Guid id, [FromBody] List<Guid> roleIds)
    {
        var result = await _mediator.Send(new UpdateUserRolesCommand(id, roleIds, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "User roles updated." });
    }

    [HttpGet("users/{id:guid}/permissions")]
    public async Task<IActionResult> GetUserPermissions(Guid id)
    {
        var result = await _mediator.Send(new GetUserPermissionsQuery(id));
        return Ok(result);
    }

    [HttpPut("users/{id:guid}/permissions")]
    public async Task<IActionResult> UpdateUserDirectPermission(Guid id, [FromBody] UpdateUserDirectPermissionRequest request)
    {
        var result = await _mediator.Send(new UpdateUserDirectPermissionCommand(id, request.PermissionId, request.IsGranted, request.Reason, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "Direct permission updated." });
    }

    // 3. Roles & Permissions
    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var result = await _mediator.Send(new GetRolesQuery());
        return Ok(result);
    }

    [HttpGet("roles/{id:guid}")]
    public async Task<IActionResult> GetRoleById(Guid id)
    {
        var result = await _mediator.Send(new GetRoleByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto dto)
    {
        try
        {
            var result = await _mediator.Send(new CreateRoleCommand(dto, CurrentAdminName, CurrentAdminIp));
            return CreatedAtAction(nameof(GetRoleById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("roles/{id:guid}")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleDto dto)
    {
        try
        {
            var result = await _mediator.Send(new UpdateRoleCommand(id, dto, CurrentAdminName, CurrentAdminIp));
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("roles/{id:guid}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new DeleteRoleCommand(id, CurrentAdminName, CurrentAdminIp));
            if (!result) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("roles/{id:guid}/duplicate")]
    public async Task<IActionResult> DuplicateRole(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new DuplicateRoleCommand(id, CurrentAdminName, CurrentAdminIp));
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> GetPermissionsCatalog()
    {
        var result = await _mediator.Send(new GetPermissionsCatalogQuery());
        return Ok(result);
    }

    [HttpGet("roles/{id:guid}/permissions")]
    public async Task<IActionResult> GetRolePermissions(Guid id)
    {
        var result = await _mediator.Send(new GetRolePermissionsQuery(id));
        return Ok(result);
    }

    [HttpPut("roles/{id:guid}/permissions")]
    public async Task<IActionResult> UpdateRolePermissions(Guid id, [FromBody] List<Guid> permissionIds)
    {
        var result = await _mediator.Send(new UpdateRolePermissionsCommand(id, permissionIds, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "Role permissions updated." });
    }

    [HttpGet("permissions/matrix")]
    public async Task<IActionResult> GetFullPermissionMatrix()
    {
        var result = await _mediator.Send(new GetFullPermissionMatrixQuery());
        return Ok(result);
    }

    // 4. Settings
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings([FromQuery] string? category, [FromQuery] Guid? companyId, [FromQuery] Guid? branchId)
    {
        var result = await _mediator.Send(new GetSettingsQuery(category, companyId, branchId));
        return Ok(result);
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettingDto dto)
    {
        var result = await _mediator.Send(new UpdateSettingCommand(dto, CurrentAdminName, CurrentAdminIp));
        return Ok(new { success = result });
    }

    [HttpGet("settings/security")]
    public async Task<IActionResult> GetSecurityPolicy()
    {
        var result = await _mediator.Send(new GetSecurityPolicyQuery());
        return Ok(result);
    }

    [HttpPut("settings/security")]
    public async Task<IActionResult> UpdateSecurityPolicy([FromBody] SecurityPolicyDto dto)
    {
        var result = await _mediator.Send(new UpdateSecurityPolicyCommand(dto, CurrentAdminName, CurrentAdminIp));
        return Ok(result);
    }

    [HttpGet("settings/email")]
    public async Task<IActionResult> GetEmailConfiguration()
    {
        var result = await _mediator.Send(new GetEmailConfigurationQuery());
        return Ok(result);
    }

    [HttpPut("settings/email")]
    public async Task<IActionResult> UpdateEmailConfiguration([FromBody] EmailConfigurationDto dto)
    {
        var result = await _mediator.Send(new UpdateEmailConfigurationCommand(dto, CurrentAdminName, CurrentAdminIp));
        return Ok(result);
    }

    [HttpPost("settings/email/test-connection")]
    public async Task<IActionResult> TestEmailConnection()
    {
        var result = await _mediator.Send(new TestEmailConnectionCommand());
        return Ok(new { success = result, message = "SMTP connection verified successfully." });
    }

    [HttpPost("settings/email/send-test")]
    public async Task<IActionResult> SendTestEmail([FromBody] SendTestEmailDto dto)
    {
        var result = await _mediator.Send(new SendTestEmailCommand(dto.RecipientEmail, CurrentAdminName, CurrentAdminIp));
        return Ok(new { success = result, message = $"Diagnostic test email dispatched to {dto.RecipientEmail}" });
    }

    // 5. Feature Flags
    [HttpGet("settings/feature-flags")]
    public async Task<IActionResult> GetFeatureFlags()
    {
        var result = await _mediator.Send(new GetFeatureFlagsQuery());
        return Ok(result);
    }

    [HttpPut("settings/feature-flags/{key}")]
    public async Task<IActionResult> UpdateFeatureFlag(string key, [FromBody] Dictionary<string, object> payload)
    {
        var enabled = payload.ContainsKey("isEnabledGlobally") && Convert.ToBoolean(payload["isEnabledGlobally"]);
        var overrides = payload.ContainsKey("companyOverridesJson") ? payload["companyOverridesJson"]?.ToString() : null;
        var result = await _mediator.Send(new UpdateFeatureFlagCommand(key, enabled, overrides, CurrentAdminName, CurrentAdminIp));
        return Ok(new { success = result });
    }

    // 6. Holiday Calendars
    [HttpGet("settings/holiday-calendars")]
    public async Task<IActionResult> GetHolidayCalendars([FromQuery] int? year, [FromQuery] Guid? companyId)
    {
        var result = await _mediator.Send(new GetHolidayCalendarsQuery(year, companyId));
        return Ok(result);
    }

    [HttpGet("settings/holiday-calendars/{id:guid}")]
    public async Task<IActionResult> GetHolidayCalendarById(Guid id)
    {
        var result = await _mediator.Send(new GetHolidayCalendarByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("settings/holiday-calendars")]
    public async Task<IActionResult> SaveHolidayCalendar([FromBody] SaveHolidayCalendarDto dto)
    {
        var result = await _mediator.Send(new SaveHolidayCalendarCommand(dto, CurrentAdminName, CurrentAdminIp));
        return Ok(result);
    }

    [HttpDelete("settings/holiday-calendars/{id:guid}")]
    public async Task<IActionResult> DeleteHolidayCalendar(Guid id)
    {
        var result = await _mediator.Send(new DeleteHolidayCalendarCommand(id, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return NoContent();
    }

    // 7. Sessions
    [HttpGet("sessions")]
    public async Task<IActionResult> GetActiveSessions([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _mediator.Send(new GetActiveSessionsQuery(search, page, pageSize));
        return Ok(result);
    }

    [HttpPost("sessions/{id:guid}/revoke")]
    public async Task<IActionResult> RevokeSession(Guid id, [FromBody] Dictionary<string, string>? payload)
    {
        var reason = payload != null && payload.ContainsKey("reason") ? payload["reason"] : "Revoked by admin";
        var result = await _mediator.Send(new RevokeSessionCommand(id, reason, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "Session revoked." });
    }

    [HttpPost("sessions/revoke-all")]
    public async Task<IActionResult> RevokeAllSessions([FromBody] Dictionary<string, string>? payload)
    {
        var reason = payload != null && payload.ContainsKey("reason") ? payload["reason"] : "Emergency session flush";
        var count = await _mediator.Send(new RevokeAllSessionsCommand(null, reason, CurrentAdminName, CurrentAdminIp));
        return Ok(new { success = true, revokedCount = count, message = $"Successfully revoked {count} active sessions." });
    }

    // 8. Background Jobs
    [HttpGet("background-jobs")]
    public async Task<IActionResult> GetBackgroundJobs()
    {
        var result = await _mediator.Send(new GetBackgroundJobsQuery());
        return Ok(result);
    }

    [HttpPost("background-jobs/{key}/run-now")]
    public async Task<IActionResult> TriggerJobNow(string key)
    {
        var result = await _mediator.Send(new TriggerJobNowCommand(key, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = $"Job '{key}' triggered." });
    }

    [HttpPost("background-jobs/{key}/toggle-pause")]
    public async Task<IActionResult> ToggleJobPause(string key)
    {
        var result = await _mediator.Send(new ToggleJobPauseCommand(key, CurrentAdminName, CurrentAdminIp));
        if (!result) return NotFound();
        return Ok(new { success = true, message = "Job schedule updated." });
    }

    // 9. System Health
    [HttpGet("system-health")]
    public async Task<IActionResult> GetSystemHealth()
    {
        var result = await _mediator.Send(new GetSystemHealthQuery());
        return Ok(result);
    }

    // 10. Data Export
    [HttpGet("export")]
    public async Task<IActionResult> ExportData([FromQuery] string type = "users", [FromQuery] string format = "csv")
    {
        var bytes = await _mediator.Send(new ExportAdminDataQuery(type, format, CurrentAdminName, CurrentAdminIp));
        return File(bytes, "text/csv", $"hrms_{type}_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv");
    }
}

public class UpdateUserDirectPermissionRequest
{
    public Guid PermissionId { get; set; }
    public bool IsGranted { get; set; }
    public string Reason { get; set; } = "Direct administrator grant";
}
