using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Attendance.Queries;
using System;
using System.Threading.Tasks;

namespace HRMS.Api.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class AttendanceController : ControllerBase
{
    private readonly IMediator _mediator;

    public AttendanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await _mediator.Send(new GetHrDashboardAnalyticsQuery { StartDate = startDate, EndDate = endDate });
        return Ok(result);
    }

    [HttpGet("register")]
    public async Task<IActionResult> GetAttendanceRegister([FromQuery] GetAttendanceRegisterQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("employee/{id}")]
    public async Task<IActionResult> GetEmployeeProfile(Guid id, [FromQuery] int month, [FromQuery] int year)
    {
        var result = await _mediator.Send(new GetEmployeeAttendanceProfileQuery
        {
            EmployeeId = id,
            Month = month == 0 ? DateTime.UtcNow.Month : month,
            Year = year == 0 ? DateTime.UtcNow.Year : year
        });
        if (result == null) return NotFound();
        return Ok(result);
    }
}

