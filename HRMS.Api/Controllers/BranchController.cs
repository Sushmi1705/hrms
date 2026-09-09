using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Branch.Commands;
using HRMS.Application.Features.Organization.Branch.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class BranchController : ControllerBase
{
    private readonly IMediator _mediator;
    public BranchController(IMediator mediator) { _mediator = mediator; }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBranchCommand command) => Ok(await _mediator.Send(command));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        var result = await _mediator.Send(new GetBranchByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetAllBranchQuery()));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBranchCommand command)
    {
        if (id != command.Id) command = command with { Id = id };
        var result = await _mediator.Send(command);
        return result ? Ok(new { success = true, message = "Branch updated successfully." }) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) => Ok(await _mediator.Send(new DeleteBranchCommand(id)));
}
