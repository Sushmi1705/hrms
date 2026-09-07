using System;
using System.Security.Claims;
using System.Threading.Tasks;
using HRMS.Application.Features.Tenant.Commands;
using HRMS.Application.Features.Tenant.DTOs;
using HRMS.Application.Features.Tenant.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/platform")]
public class PlatformTenantController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlatformTenantController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private string GetCurrentUser() => User.Identity?.Name ?? "Platform Administrator";
    private Guid GetCurrentUserId()
    {
        var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        return Ok(await _mediator.Send(new GetPlatformDashboardQuery()));
    }

    [HttpGet("tenants")]
    public async Task<IActionResult> GetTenants(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? plan,
        [FromQuery] string? country,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        return Ok(await _mediator.Send(new GetTenantsPagedQuery(search, status, plan, country, page, pageSize)));
    }

    [HttpGet("tenants/{id}")]
    public async Task<IActionResult> GetTenantById(Guid id)
    {
        var result = await _mediator.Send(new GetTenantByIdQuery(id));
        if (result == null) return NotFound(new { message = $"Tenant {id} not found." });
        return Ok(result);
    }

    [HttpPost("tenants")]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantDto dto)
    {
        var result = await _mediator.Send(new CreateTenantCommand(dto, GetCurrentUser()));
        return CreatedAtAction(nameof(GetTenantById), new { id = result.Id }, result);
    }

    [HttpPut("tenants/{id}")]
    public async Task<IActionResult> UpdateTenant(Guid id, [FromBody] UpdateTenantDto dto)
    {
        return Ok(await _mediator.Send(new UpdateTenantCommand(id, dto, GetCurrentUser())));
    }

    [HttpPost("tenants/{id}/activate")]
    public async Task<IActionResult> ActivateTenant(Guid id)
    {
        return Ok(new { success = await _mediator.Send(new ActivateTenantCommand(id, GetCurrentUser())) });
    }

    [HttpPost("tenants/{id}/suspend")]
    public async Task<IActionResult> SuspendTenant(Guid id, [FromBody] SuspendTenantDto dto)
    {
        return Ok(new { success = await _mediator.Send(new SuspendTenantCommand(id, dto.Reason, GetCurrentUser())) });
    }

    [HttpPost("tenants/{id}/reactivate")]
    public async Task<IActionResult> ReactivateTenant(Guid id)
    {
        return Ok(new { success = await _mediator.Send(new ActivateTenantCommand(id, GetCurrentUser())) });
    }

    [HttpPost("tenants/{id}/change-plan")]
    public async Task<IActionResult> ChangePlan(Guid id, [FromBody] ChangeTenantPlanDto dto)
    {
        return Ok(new { success = await _mediator.Send(new ChangeTenantPlanCommand(id, dto, GetCurrentUser())) });
    }

    [HttpPut("tenants/{id}/feature-overrides")]
    public async Task<IActionResult> UpdateFeatureOverride(Guid id, [FromBody] UpdateFeatureOverrideDto dto)
    {
        return Ok(new { success = await _mediator.Send(new UpdateFeatureOverrideCommand(id, dto, GetCurrentUser())) });
    }

    [HttpGet("plans")]
    public async Task<IActionResult> GetPlans()
    {
        return Ok(await _mediator.Send(new GetSubscriptionPlansQuery()));
    }

    [HttpPost("plans")]
    public async Task<IActionResult> SavePlan([FromBody] SubscriptionPlanDto dto)
    {
        return Ok(await _mediator.Send(new SaveSubscriptionPlanCommand(dto, GetCurrentUser())));
    }

    [HttpPost("impersonation/start")]
    public async Task<IActionResult> StartImpersonation([FromBody] StartImpersonationDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var result = await _mediator.Send(new StartImpersonationCommand(dto, GetCurrentUserId(), GetCurrentUser(), ip));
        return Ok(result);
    }

    [HttpPost("impersonation/end")]
    public async Task<IActionResult> EndImpersonation([FromQuery] Guid logId, [FromQuery] string? actions)
    {
        return Ok(new { success = await _mediator.Send(new EndImpersonationCommand(logId, actions ?? "Session concluded")) });
    }

    [HttpPost("tenants/{id}/delete-request")]
    public async Task<IActionResult> RequestDeletion(Guid id, [FromBody] SuspendTenantDto dto)
    {
        return Ok(new { success = await _mediator.Send(new RequestTenantDeletionCommand(id, dto.Reason, GetCurrentUser())) });
    }

    [HttpPost("tenants/{id}/cancel-deletion")]
    public async Task<IActionResult> CancelDeletion(Guid id, [FromBody] SuspendTenantDto dto)
    {
        return Ok(new { success = await _mediator.Send(new CancelTenantDeletionCommand(id, dto.Reason, GetCurrentUser())) });
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportTenants()
    {
        var csvBytes = await _mediator.Send(new ExportTenantsCsvQuery());
        return File(csvBytes, "text/csv", $"tenants_export_{DateTime.UtcNow:yyyyMMddHHmmss}.csv");
    }
}
