using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Compensation.DTOs;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CompensationController : ControllerBase
{
    private readonly ICompensationRepository _compensationRepository;

    public CompensationController(ICompensationRepository compensationRepository)
    {
        _compensationRepository = compensationRepository;
    }

    // ==========================================
    // 1. DASHBOARD & ANALYTICS
    // ==========================================
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var metrics = await _compensationRepository.GetDashboardMetricsAsync();
        return Ok(metrics);
    }

    // ==========================================
    // 2. SALARY COMPONENTS
    // ==========================================
    [HttpGet("components")]
    public async Task<IActionResult> GetComponents()
    {
        var components = await _compensationRepository.GetComponentsAsync();
        return Ok(components);
    }

    [HttpPost("components")]
    public async Task<IActionResult> CreateComponent([FromBody] CreateCompensationComponentDto dto)
    {
        var comp = await _compensationRepository.CreateComponentAsync(dto);
        return CreatedAtAction(nameof(GetComponents), new { id = comp.Id }, comp);
    }

    [HttpPut("components/{id:guid}")]
    public async Task<IActionResult> UpdateComponent(Guid id, [FromBody] CreateCompensationComponentDto dto)
    {
        var comp = await _compensationRepository.UpdateComponentAsync(id, dto);
        return Ok(comp);
    }

    [HttpDelete("components/{id:guid}")]
    public async Task<IActionResult> DeleteComponent(Guid id)
    {
        var success = await _compensationRepository.DeleteComponentAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    // ==========================================
    // 3. PAY GRADES & SALARY BANDS
    // ==========================================
    [HttpGet("grades")]
    public async Task<IActionResult> GetPayGrades()
    {
        var grades = await _compensationRepository.GetPayGradesAsync();
        return Ok(grades);
    }

    [HttpPost("grades")]
    public async Task<IActionResult> CreatePayGrade([FromBody] CreatePayGradeDto dto)
    {
        var grade = await _compensationRepository.CreatePayGradeAsync(dto);
        return CreatedAtAction(nameof(GetPayGrades), new { id = grade.Id }, grade);
    }

    [HttpGet("bands")]
    public async Task<IActionResult> GetSalaryBands([FromQuery] Guid? payGradeId)
    {
        var bands = await _compensationRepository.GetSalaryBandsAsync(payGradeId);
        return Ok(bands);
    }

    [HttpPost("bands")]
    public async Task<IActionResult> CreateSalaryBand([FromBody] CreateSalaryBandDto dto)
    {
        var band = await _compensationRepository.CreateSalaryBandAsync(dto);
        return CreatedAtAction(nameof(GetSalaryBands), new { id = band.Id }, band);
    }

    // ==========================================
    // 4. EMPLOYEE COMPENSATION
    // ==========================================
    [HttpGet("employees")]
    public async Task<IActionResult> GetEmployeeCompensations([FromQuery] CompensationFilterParams filters)
    {
        var result = await _compensationRepository.GetEmployeeCompensationsAsync(filters);
        return Ok(result);
    }

    [HttpGet("employees/{id:guid}")]
    public async Task<IActionResult> GetEmployeeCompensationDetail(Guid id)
    {
        var detail = await _compensationRepository.GetEmployeeCompensationDetailAsync(id);
        if (detail == null) return NotFound("Employee compensation details not found.");
        return Ok(detail);
    }

    [HttpPost("employees")]
    public async Task<IActionResult> UpsertEmployeeCompensation([FromBody] UpsertEmployeeCompensationDto dto)
    {
        var result = await _compensationRepository.UpsertEmployeeCompensationAsync(dto, User.Identity?.Name ?? "HR Administrator");
        return Ok(result);
    }

    // ==========================================
    // 5. SALARY REVISIONS & WORKFLOW
    // ==========================================
    [HttpGet("revisions")]
    public async Task<IActionResult> GetSalaryRevisions([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _compensationRepository.GetSalaryRevisionsAsync(status, page, pageSize);
        return Ok(result);
    }

    [HttpPost("revisions")]
    public async Task<IActionResult> CreateSalaryRevision([FromBody] CreateSalaryRevisionDto dto)
    {
        var revision = await _compensationRepository.CreateSalaryRevisionAsync(dto, User.Identity?.Name ?? "HR Operations");
        return CreatedAtAction(nameof(GetSalaryRevisions), new { id = revision.Id }, revision);
    }

    [HttpPost("revisions/{id:guid}/action")]
    public async Task<IActionResult> ProcessSalaryRevisionAction(Guid id, [FromBody] ProcessSalaryRevisionActionDto dto)
    {
        var revision = await _compensationRepository.ProcessSalaryRevisionActionAsync(id, dto, User.Identity?.Name ?? "Compensation Manager");
        return Ok(revision);
    }

    // ==========================================
    // 6. BONUSES
    // ==========================================
    [HttpGet("bonuses")]
    public async Task<IActionResult> GetBonuses([FromQuery] Guid? employeeId)
    {
        var bonuses = await _compensationRepository.GetBonusesAsync(employeeId);
        return Ok(bonuses);
    }

    [HttpPost("bonuses")]
    public async Task<IActionResult> CreateBonus([FromBody] CreateEmployeeBonusDto dto)
    {
        var bonus = await _compensationRepository.CreateBonusAsync(dto, User.Identity?.Name ?? "Executive Committee");
        return CreatedAtAction(nameof(GetBonuses), new { id = bonus.Id }, bonus);
    }

    // ==========================================
    // 7. REVIEW CYCLES
    // ==========================================
    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviewCycles()
    {
        var cycles = await _compensationRepository.GetReviewCyclesAsync();
        return Ok(cycles);
    }

    [HttpPost("reviews")]
    public async Task<IActionResult> CreateReviewCycle([FromBody] CreateCompensationReviewCycleDto dto)
    {
        var cycle = await _compensationRepository.CreateReviewCycleAsync(dto.CycleName, dto.FiscalYear, dto.TotalBudget, dto.StartDate, dto.EndDate, dto.EffectiveDate);
        return CreatedAtAction(nameof(GetReviewCycles), new { id = cycle.Id }, cycle);
    }

    [HttpGet("reviews/{id:guid}/items")]
    public async Task<IActionResult> GetReviewItems(Guid id)
    {
        var items = await _compensationRepository.GetReviewItemsAsync(id);
        return Ok(items);
    }

    [HttpPut("reviews/items/{id:guid}")]
    public async Task<IActionResult> UpdateReviewItem(Guid id, [FromBody] UpdateCompensationReviewItemDto dto)
    {
        var item = await _compensationRepository.UpdateReviewItemAsync(id, dto.ProposedSalary, dto.ManagerRecommendation, dto.ManagerComments);
        return Ok(item);
    }

    // ==========================================
    // 8. SELF-SERVICE & TOTAL REWARDS
    // ==========================================
    [HttpGet("my-compensation")]
    public async Task<IActionResult> GetMyCompensation([FromQuery] Guid? employeeId)
    {
        // If employeeId passed or default to first employee in list
        var empList = (await _compensationRepository.GetEmployeeCompensationsAsync(new CompensationFilterParams { PageSize = 1 })).Items;
        var targetId = employeeId ?? empList.FirstOrDefault()?.EmployeeId ?? Guid.Empty;

        var rewards = await _compensationRepository.GetTotalRewardsAsync(targetId);
        if (rewards == null) return NotFound("Compensation record not found.");
        return Ok(rewards);
    }

    [HttpGet("team")]
    public async Task<IActionResult> GetTeamCompensation([FromQuery] Guid? managerEmployeeId)
    {
        var empList = (await _compensationRepository.GetEmployeeCompensationsAsync(new CompensationFilterParams { PageSize = 100 })).Items;
        var targetManager = managerEmployeeId ?? empList.FirstOrDefault()?.EmployeeId ?? Guid.Empty;

        var team = await _compensationRepository.GetTeamCompensationAsync(targetManager);
        if (!team.Any())
        {
            // For demo/sample display, return first 8 employees
            team = empList.Take(8).ToList();
        }
        return Ok(team);
    }

    // ==========================================
    // 9. PAYROLL CONSUMPTION INTEGRATION
    // ==========================================
    [HttpGet("payroll-export")]
    public async Task<IActionResult> GetPayrollExport([FromQuery] DateTime? asOfDate)
    {
        var export = await _compensationRepository.GetPayrollCompensationExportAsync(asOfDate ?? DateTime.UtcNow);
        return Ok(export);
    }

    // ==========================================
    // 10. CSV EXPORT
    // ==========================================
    [HttpGet("reports")]
    public async Task<IActionResult> ExportReport([FromQuery] string reportType = "EmployeeCompensation")
    {
        var bytes = await _compensationRepository.ExportCompensationCsvAsync(reportType);
        var filename = $"{reportType}_{DateTime.UtcNow:yyyyMMdd}.csv";
        return File(bytes, "text/csv", filename);
    }
}

public class CreateCompensationReviewCycleDto
{
    public string CycleName { get; set; } = string.Empty;
    public int FiscalYear { get; set; } = 2026;
    public decimal TotalBudget { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime EffectiveDate { get; set; }
}

public class UpdateCompensationReviewItemDto
{
    public decimal ProposedSalary { get; set; }
    public string ManagerRecommendation { get; set; } = string.Empty;
    public string ManagerComments { get; set; } = string.Empty;
}
