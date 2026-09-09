using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Company.Commands;
using HRMS.Application.Features.Organization.Company.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly IMediator _mediator;
    public CompanyController(IMediator mediator) { _mediator = mediator; }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompanyCommand command) => Ok(await _mediator.Send(command));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) 
    {
        var result = await _mediator.Send(new GetCompanyByIdQuery(id));
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediator.Send(new GetAllCompanyQuery()));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCompanyCommand command)
    {
        if (id != command.Id) command = command with { Id = id };
        var result = await _mediator.Send(command);
        return result ? Ok(new { success = true, message = "Company updated successfully." }) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id) => Ok(await _mediator.Send(new DeleteCompanyCommand(id)));
}
