using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Department.Queries;
using HRMS.Application.Features.Organization.Department.Commands;
using System.Threading.Tasks;
using System;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly IMediator _mediator;
    public DepartmentController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllDepartmentQuery()));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteDepartmentCommand(id));
        return result ? NoContent() : NotFound();
    }
}
