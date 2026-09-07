using HRMS.Application.Features.Notification.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics() => Ok(await _mediator.Send(new GetNotificationAnalyticsQuery()));

    [HttpGet("inbox")]
    public async Task<IActionResult> GetInbox([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "") 
        => Ok(await _mediator.Send(new GetNotificationsQuery { Page = page, PageSize = pageSize, Search = search ?? "" }));

    [HttpGet("templates")]
    public async Task<IActionResult> GetTemplates([FromQuery] int page = 1, [FromQuery] int pageSize = 10) 
        => Ok(await _mediator.Send(new GetTemplatesQuery { Page = page, PageSize = pageSize }));

    [HttpGet("announcements")]
    public async Task<IActionResult> GetAnnouncements() => Ok(await _mediator.Send(new GetAnnouncementsQuery()));

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 10) 
        => Ok(await _mediator.Send(new GetDeliveryLogsQuery { Page = page, PageSize = pageSize }));

    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue() => Ok(await _mediator.Send(new GetQueueQuery()));
}
