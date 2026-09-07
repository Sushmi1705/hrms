using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Features.Leave.Queries;
using HRMS.Application.Features.Leave.DTOs;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class LeaveController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaveController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<LeaveDashboardAnalyticsDto>> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetLeaveDashboardAnalyticsQuery());
        return Ok(result);
    }

    [HttpGet("requests")]
    public async Task<ActionResult<List<LeaveRequestDto>>> GetAllRequests([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string? status)
    {
        var result = await _mediator.Send(new GetAllLeaveRequestsQuery(startDate, endDate, status));
        return Ok(result);
    }
}

