using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Recruitment.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RecruitmentController : ControllerBase
{
    private readonly IMediator _mediator;

    public RecruitmentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<ActionResult<RecruitmentDashboardAnalyticsDto>> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetRecruitmentDashboardAnalyticsQuery());
        return Ok(result);
    }
}
