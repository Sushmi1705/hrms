using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using HRMS.Application.Features.Onboarding.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OnboardingController : ControllerBase
{
    private readonly IMediator _mediator;

    public OnboardingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var result = await _mediator.Send(new GetOnboardingDashboardAnalyticsQuery());
        return Ok(result);
    }
}
