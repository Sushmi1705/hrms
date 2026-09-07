using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Compensation.DTOs;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class BenefitsController : ControllerBase
{
    private readonly ICompensationRepository _compensationRepository;

    public BenefitsController(ICompensationRepository compensationRepository)
    {
        _compensationRepository = compensationRepository;
    }

    [HttpGet("plans")]
    public async Task<IActionResult> GetPlans()
    {
        var plans = await _compensationRepository.GetBenefitPlansAsync();
        return Ok(plans);
    }

    [HttpPost("plans")]
    public async Task<IActionResult> CreatePlan([FromBody] CreateBenefitPlanDto dto)
    {
        var plan = await _compensationRepository.CreateBenefitPlanAsync(dto);
        return CreatedAtAction(nameof(GetPlans), new { id = plan.Id }, plan);
    }

    [HttpGet("enrollments")]
    public async Task<IActionResult> GetEnrollments([FromQuery] Guid? employeeId)
    {
        var enrollments = await _compensationRepository.GetBenefitEnrollmentsAsync(employeeId);
        return Ok(enrollments);
    }

    [HttpPost("enrollments")]
    public async Task<IActionResult> CreateEnrollment([FromBody] CreateBenefitEnrollmentDto dto)
    {
        var enrollment = await _compensationRepository.CreateBenefitEnrollmentAsync(dto);
        return CreatedAtAction(nameof(GetEnrollments), new { id = enrollment.Id }, enrollment);
    }

    [HttpGet("dependents")]
    public async Task<IActionResult> GetDependents([FromQuery] Guid employeeId)
    {
        var deps = await _compensationRepository.GetDependentsAsync(employeeId);
        return Ok(deps);
    }

    [HttpPost("dependents")]
    public async Task<IActionResult> CreateDependent([FromBody] CreateEmployeeDependentDto dto)
    {
        var dep = await _compensationRepository.CreateDependentAsync(dto);
        return CreatedAtAction(nameof(GetDependents), new { employeeId = dep.EmployeeId }, dep);
    }

    [HttpGet("my-benefits")]
    public async Task<IActionResult> GetMyBenefits([FromQuery] Guid? employeeId)
    {
        var compList = (await _compensationRepository.GetEmployeeCompensationsAsync(new CompensationFilterParams { PageSize = 1 })).Items;
        var targetId = employeeId ?? compList.FirstOrDefault()?.EmployeeId ?? Guid.Empty;

        var enrollments = await _compensationRepository.GetBenefitEnrollmentsAsync(targetId);
        var plans = await _compensationRepository.GetBenefitPlansAsync();
        var dependents = await _compensationRepository.GetDependentsAsync(targetId);

        return Ok(new
        {
            employeeId = targetId,
            enrolledBenefits = enrollments,
            eligiblePlans = plans,
            dependents = dependents
        });
    }
}
