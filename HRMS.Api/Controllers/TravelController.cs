using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Travel.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/travel")]
public class TravelController : ControllerBase
{
    private readonly ITravelRepository _travel;

    public TravelController(ITravelRepository travel) => _travel = travel;

    private async Task<EmployeeEntity> GetEmployeeAsync()
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
        var employee = await _travel.ResolveEmployeeAsync(overrideId, email);
        if (employee == null) throw new UnauthorizedAccessException("Unable to resolve employee profile.");
        return employee;
    }

    private Guid GetTenantId() => Guid.Parse("11111111-1111-1111-1111-111111111111");

    // ─── Dashboard ────────────────────────────────────────────────────────────
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var employee = await GetEmployeeAsync();
        var email = User.FindFirstValue(System.Security.Claims.ClaimTypes.Email);
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
        var data = await _travel.GetDashboardAsync(GetTenantId(), isAdmin ? null : employee.Id);
        return Ok(data);
    }

    // ─── Travel Requests ──────────────────────────────────────────────────────
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests([FromQuery] TravelFilterDto filter)
    {
        var employee = await GetEmployeeAsync();
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode");
        if (!isAdmin) filter.EmployeeId = employee.Id;
        return Ok(await _travel.GetTravelRequestsAsync(GetTenantId(), filter));
    }

    [HttpGet("requests/{id:guid}")]
    public async Task<IActionResult> GetRequest(Guid id)
    {
        var result = await _travel.GetTravelRequestAsync(GetTenantId(), id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateTravelRequestDto dto)
    {
        var employee = await GetEmployeeAsync();
        var result = await _travel.CreateTravelRequestAsync(GetTenantId(), employee.Id, dto);
        return CreatedAtAction(nameof(GetRequest), new { id = result.Id }, result);
    }

    [HttpPut("requests/{id:guid}")]
    public async Task<IActionResult> UpdateRequest(Guid id, [FromBody] CreateTravelRequestDto dto)
    {
        try { return Ok(await _travel.UpdateTravelRequestAsync(GetTenantId(), id, dto)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpPost("requests/{id:guid}/submit")]
    public async Task<IActionResult> SubmitRequest(Guid id)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.SubmitTravelRequestAsync(GetTenantId(), id, employee.Id);
        return ok ? Ok(new { message = "Travel request submitted." }) : BadRequest(new { message = "Cannot submit request." });
    }

    [HttpPost("requests/{id:guid}/approve")]
    public async Task<IActionResult> ApproveRequest(Guid id, [FromBody] ApprovalActionDto dto)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.ApproveTravelRequestAsync(GetTenantId(), id, employee.Id, dto.Approved, dto.Comments);
        return ok ? Ok(new { message = dto.Approved ? "Request approved." : "Request rejected." }) : NotFound();
    }

    [HttpPost("requests/{id:guid}/cancel")]
    public async Task<IActionResult> CancelRequest(Guid id)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.CancelTravelRequestAsync(GetTenantId(), id, employee.Id);
        return ok ? Ok(new { message = "Request cancelled." }) : BadRequest();
    }

    // ─── Trips ────────────────────────────────────────────────────────────────
    [HttpGet("trips")]
    public async Task<IActionResult> GetTrips()
    {
        var employee = await GetEmployeeAsync();
        var email = User.FindFirstValue(System.Security.Claims.ClaimTypes.Email);
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
        return Ok(await _travel.GetTripsAsync(GetTenantId(), isAdmin ? null : employee.Id));
    }

    [HttpGet("trips/{id:guid}")]
    public async Task<IActionResult> GetTrip(Guid id)
    {
        var result = await _travel.GetTripAsync(GetTenantId(), id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("trips/{id:guid}/itinerary")]
    public async Task<IActionResult> GetItinerary(Guid id)
    {
        return Ok(await _travel.GetItineraryAsync(GetTenantId(), id));
    }

    [HttpPost("trips/{id:guid}/itinerary")]
    public async Task<IActionResult> AddItinerary(Guid id, [FromBody] CreateItineraryItemDto dto)
    {
        return Ok(await _travel.AddItineraryItemAsync(GetTenantId(), id, dto));
    }

    // ─── Advances ────────────────────────────────────────────────────────────
    [HttpGet("advances")]
    public async Task<IActionResult> GetAdvances()
    {
        var employee = await GetEmployeeAsync();
        var email = User.FindFirstValue(System.Security.Claims.ClaimTypes.Email);
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
        return Ok(await _travel.GetAdvancesAsync(GetTenantId(), isAdmin ? null : employee.Id));
    }

    [HttpPost("advances")]
    public async Task<IActionResult> CreateAdvance([FromBody] CreateTravelAdvanceDto dto)
    {
        var employee = await GetEmployeeAsync();
        return Ok(await _travel.CreateAdvanceAsync(GetTenantId(), employee.Id, dto));
    }

    [HttpPost("advances/{id:guid}/approve")]
    public async Task<IActionResult> ApproveAdvance(Guid id, [FromBody] ApprovalActionDto dto)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.ApproveAdvanceAsync(GetTenantId(), id, employee.Id, dto.Approved, dto.Comments);
        return ok ? Ok(new { message = dto.Approved ? "Advance approved." : "Advance rejected." }) : NotFound();
    }
}

[ApiController]
[Route("api/v1/expenses")]
public class ExpenseController : ControllerBase
{
    private readonly ITravelRepository _travel;
    public ExpenseController(ITravelRepository travel) => _travel = travel;

    private async Task<EmployeeEntity> GetEmployeeAsync()
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
        var employee = await _travel.ResolveEmployeeAsync(overrideId, email);
        if (employee == null) throw new UnauthorizedAccessException("Unable to resolve employee profile.");
        return employee;
    }

    private Guid GetTenantId() => Guid.Parse("11111111-1111-1111-1111-111111111111");

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(await _travel.GetCategoriesAsync(GetTenantId()));

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateExpenseCategoryDto dto)
        => Ok(await _travel.CreateCategoryAsync(GetTenantId(), dto));

    [HttpGet]
    public async Task<IActionResult> GetExpenses([FromQuery] Guid? tripId)
    {
        var employee = await GetEmployeeAsync();
        var email = User.FindFirstValue(System.Security.Claims.ClaimTypes.Email);
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
        return Ok(await _travel.GetExpensesAsync(GetTenantId(), isAdmin ? null : employee.Id, tripId));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetExpense(Guid id)
    {
        var result = await _travel.GetExpenseAsync(GetTenantId(), id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseDto dto)
    {
        var employee = await GetEmployeeAsync();
        return Ok(await _travel.CreateExpenseAsync(GetTenantId(), employee.Id, dto));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] CreateExpenseDto dto)
    {
        try { return Ok(await _travel.UpdateExpenseAsync(GetTenantId(), id, dto)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteExpense(Guid id)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.DeleteExpenseAsync(GetTenantId(), id, employee.Id);
        return ok ? Ok(new { message = "Expense deleted." }) : BadRequest(new { message = "Cannot delete." });
    }

    [HttpGet("policy/check")]
    public async Task<IActionResult> CheckPolicy([FromQuery] Guid categoryId, [FromQuery] decimal amount, [FromQuery] string currency = "USD")
        => Ok(await _travel.EvaluatePolicyAsync(GetTenantId(), categoryId, amount, currency));

    [HttpGet("policy/rules")]
    public async Task<IActionResult> GetPolicyRules() => Ok(await _travel.GetPolicyRulesAsync(GetTenantId()));

    [HttpPost("policy/rules")]
    public async Task<IActionResult> CreatePolicyRule([FromBody] CreatePolicyRuleDto dto)
        => Ok(await _travel.CreatePolicyRuleAsync(GetTenantId(), dto));

    // ─── Expense Reports ─────────────────────────────────────────────────────
    [HttpGet("reports")]
    public async Task<IActionResult> GetReports([FromQuery] string? status)
    {
        var employee = await GetEmployeeAsync();
        var email = User.FindFirstValue(System.Security.Claims.ClaimTypes.Email);
        var isAdmin = Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
        return Ok(await _travel.GetExpenseReportsAsync(GetTenantId(), isAdmin ? null : employee.Id, status));
    }

    [HttpGet("reports/{id:guid}")]
    public async Task<IActionResult> GetReport(Guid id)
    {
        var result = await _travel.GetExpenseReportAsync(GetTenantId(), id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost("reports")]
    public async Task<IActionResult> CreateReport([FromBody] CreateExpenseReportDto dto)
    {
        var employee = await GetEmployeeAsync();
        return Ok(await _travel.CreateExpenseReportAsync(GetTenantId(), employee.Id, dto));
    }

    [HttpPost("reports/{id:guid}/submit")]
    public async Task<IActionResult> SubmitReport(Guid id)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.SubmitExpenseReportAsync(GetTenantId(), id, employee.Id);
        return ok ? Ok(new { message = "Report submitted." }) : BadRequest(new { message = "Cannot submit." });
    }

    [HttpPost("reports/{id:guid}/approve")]
    public async Task<IActionResult> ApproveReport(Guid id, [FromBody] ApprovalActionDto dto)
    {
        var employee = await GetEmployeeAsync();
        var ok = await _travel.ApproveExpenseReportAsync(GetTenantId(), id, employee.Id, dto.Approved, dto.Comments);
        return ok ? Ok(new { message = dto.Approved ? "Report approved." : "Report rejected." }) : NotFound();
    }
}

public class ApprovalActionDto
{
    public bool Approved { get; set; }
    public string? Comments { get; set; }
}
