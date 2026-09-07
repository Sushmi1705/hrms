using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Features.Learning.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class LearningController : ControllerBase
{
    private readonly IMediator _mediator;

    public LearningController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<LearningAnalyticsDto>> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetLearningDashboardAnalyticsQuery());
        return Ok(result);
    }
}
