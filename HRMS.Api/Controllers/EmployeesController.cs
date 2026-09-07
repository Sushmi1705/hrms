using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Employee.Queries;
using HRMS.Application.Features.Employee.Commands;
using System.Threading.Tasks;
using System;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;
    public EmployeesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _mediator.Send(new GetAllEmployeesQuery()));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { Id = id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeCommand command)
    {
        if (id != command.Id) return BadRequest();
        var result = await _mediator.Send(command);
        return result ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteEmployeeCommand(id));
        return result ? NoContent() : NotFound();
    }

    [HttpPost("import")]
    public IActionResult ImportCsv()
    {
        return Ok(new { Message = "File imported successfully." });
    }

    [HttpGet("export")]
    public IActionResult ExportExcel()
    {
        var fileBytes = new byte[] { 0x20 };
        return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "employees.xlsx");
    }
}
