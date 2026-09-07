using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Features.Shift.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ShiftController : ControllerBase
{
    private readonly IMediator _mediator;

    public ShiftController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetShiftDashboardAnalyticsQuery());
        return Ok(result);
    }

    [HttpGet("master")]
    public async Task<IActionResult> GetAllShifts()
    {
        var result = await _mediator.Send(new GetAllShiftsQuery());
        return Ok(result);
    }
}
