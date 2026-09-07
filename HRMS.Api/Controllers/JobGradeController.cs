using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.JobGrade.Queries;
using HRMS.Application.Features.Organization.JobGrade.Commands;
using System.Threading.Tasks;
using System;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class JobGradeController : ControllerBase
{
    private readonly IMediator _mediator;
    public JobGradeController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllJobGradeQuery()));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobGradeCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteJobGradeCommand(id));
        return result ? NoContent() : NotFound();
    }
}
