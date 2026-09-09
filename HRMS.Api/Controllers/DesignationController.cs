using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Designation.Commands;
using HRMS.Application.Features.Organization.Designation.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DesignationController : ControllerBase
{
    private readonly IMediator _mediator;
    public DesignationController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDesignationCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetDesignationByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllDesignationQuery()));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDesignationCommand command)
    {
        if (id != command.Id) command = command with { Id = id };
        var result = await _mediator.Send(command);
        return result ? Ok(new { success = true, message = "Designation updated successfully." }) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteDesignationCommand(id));
        return result ? NoContent() : NotFound();
    }
}
