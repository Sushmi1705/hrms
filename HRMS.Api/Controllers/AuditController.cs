using HRMS.Application.Features.Audit.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuditController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuditController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics() => Ok(await _mediator.Send(new GetAuditDashboardAnalyticsQuery()));

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs([FromQuery] GetAuditLogsQuery query) 
        => Ok(await _mediator.Send(query));

    [HttpGet("login-history")]
    public async Task<IActionResult> GetLoginHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "") 
        => Ok(await _mediator.Send(new GetLoginHistoryQuery { Page = page, PageSize = pageSize, Search = search ?? "" }));

    [HttpGet("security-events")]
    public async Task<IActionResult> GetSecurityEvents([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "") 
        => Ok(await _mediator.Send(new GetSecurityEventsQuery { Page = page, PageSize = pageSize, Search = search ?? "" }));

    [HttpGet("changes/{auditLogId}")]
    public async Task<IActionResult> GetChanges(Guid auditLogId) 
        => Ok(await _mediator.Send(new GetAuditChangesQuery { AuditLogId = auditLogId }));
}
