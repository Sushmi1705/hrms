using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using HRMS.Application.Features.Offboarding.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OffboardingController : ControllerBase
{
    private readonly IMediator _mediator;

    public OffboardingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var result = await _mediator.Send(new GetOffboardingDashboardAnalyticsQuery());
        return Ok(result);
    }
}
