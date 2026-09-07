using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.CostCenter.Queries;
using HRMS.Application.Features.Organization.CostCenter.Commands;
using System.Threading.Tasks;
using System;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CostCenterController : ControllerBase
{
    private readonly IMediator _mediator;
    public CostCenterController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllCostCenterQuery()));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCostCenterCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteCostCenterCommand(id));
        return result ? NoContent() : NotFound();
    }
}
