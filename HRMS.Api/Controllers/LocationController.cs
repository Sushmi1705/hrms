using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Location.Commands;
using HRMS.Application.Features.Organization.Location.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class LocationController : ControllerBase
{
    private readonly IMediator _mediator;
    public LocationController(IMediator mediator) { _mediator = mediator; }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLocationCommand command) => Ok(await _mediator.Send(command));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        var result = await _mediator.Send(new GetLocationByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetAllLocationQuery()));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLocationCommand command)
    {
        if (id != command.Id) command = command with { Id = id };
        var result = await _mediator.Send(command);
        return result ? Ok(new { success = true, message = "Location updated successfully." }) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) => Ok(await _mediator.Send(new DeleteLocationCommand(id)));
}
