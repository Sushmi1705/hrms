using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Organization.Company.Queries;
using HRMS.Application.Features.Organization.Branch.Queries;
using HRMS.Application.Features.Organization.Department.Queries;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/lookups")]
public class OrganizationLookupsController : ControllerBase
{
    private readonly IMediator _mediator;
    public OrganizationLookupsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies() => Ok(await _mediator.Send(new GetAllCompanyQuery()));

    [HttpGet("branches")]
    public async Task<IActionResult> GetBranches() => Ok(await _mediator.Send(new GetAllBranchQuery()));

    [HttpGet("departments")]
    public async Task<IActionResult> GetDepartments() => Ok(await _mediator.Send(new GetAllDepartmentQuery()));
}
