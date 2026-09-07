using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Features.Performance.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class PerformanceController : ControllerBase
{
    private readonly IMediator _mediator;

    public PerformanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetPerformanceDashboardAnalyticsQuery());
        return Ok(result);
    }

    [HttpGet("goals/{employeeId}")]
    public async Task<IActionResult> GetGoals(Guid employeeId)
    {
        var result = await _mediator.Send(new GetAllGoalsQuery { EmployeeId = employeeId });
        return Ok(result);
    }

    [HttpGet("reviews/{employeeId}")]
    public async Task<IActionResult> GetReviews(Guid employeeId)
    {
        var result = await _mediator.Send(new GetEmployeeReviewsQuery { EmployeeId = employeeId });
        return Ok(result);
    }
}
