using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using HRMS.Application.Features.Reports.Queries;
using HRMS.Application.Contracts.Persistence;
using System.Security.Claims;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IReportRepository _repo;
    private readonly HRMS.Application.Contracts.Tenant.ITenantContext _tenantContext;

    public ReportsController(IMediator mediator, IReportRepository repo, HRMS.Application.Contracts.Tenant.ITenantContext tenantContext)
    {
        _mediator = mediator;
        _repo = repo;
        _tenantContext = tenantContext;
    }

    private Guid? GetEmployeeId()
    {
        if (Request.Headers.TryGetValue("X-Employee-Id", out var val) && Guid.TryParse(val, out var empId))
            return empId;
        return null;
    }

    private bool IsAdmin()
    {
        var email = User.FindFirstValue(ClaimTypes.Email);
        return Request.Headers.ContainsKey("X-Admin-Mode") || email == "admin@hrms.com";
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] string? period,
        [FromQuery] Guid? departmentId,
        [FromQuery] Guid? branchId,
        [FromQuery] Guid? locationId,
        [FromQuery] string? employmentType,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var filters = new HRMS.Application.Features.Reports.DTOs.ReportFilterParams
        {
            Period = period ?? "last-6-months",
            DepartmentId = departmentId,
            BranchId = branchId,
            LocationId = locationId,
            EmploymentType = employmentType,
            StartDate = startDate,
            EndDate = endDate
        };

        var query = new GetExecutiveDashboardQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin(),
            Filters = filters
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("workforce")]
    public async Task<IActionResult> GetWorkforceAnalytics([FromQuery] Guid? departmentId, [FromQuery] Guid? branchId)
    {
        var filters = new HRMS.Application.Features.Reports.DTOs.ReportFilterParams
        {
            DepartmentId = departmentId,
            BranchId = branchId
        };

        var query = new GetWorkforceAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("attendance")]
    public async Task<IActionResult> GetAttendanceAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = new GetAttendanceAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin(),
            StartDate = startDate,
            EndDate = endDate
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("leave")]
    public async Task<IActionResult> GetLeaveAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = new GetLeaveAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin(),
            StartDate = startDate,
            EndDate = endDate
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("payroll")]
    public async Task<IActionResult> GetPayrollAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = new GetPayrollAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin(),
            HasPayrollPermission = IsAdmin(),
            StartDate = startDate,
            EndDate = endDate
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("recruitment")]
    public async Task<IActionResult> GetRecruitmentAnalytics()
    {
        var query = new GetRecruitmentAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("performance")]
    public async Task<IActionResult> GetPerformanceAnalytics()
    {
        var query = new GetPerformanceAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("training")]
    public async Task<IActionResult> GetTrainingAnalytics()
    {
        var query = new GetTrainingAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("assets")]
    public async Task<IActionResult> GetAssetAnalytics([FromQuery] Guid? departmentId)
    {
        var query = new GetAssetAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin(),
            Filters = new HRMS.Application.Features.Reports.DTOs.ReportFilterParams { DepartmentId = departmentId }
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("benefits")]
    public async Task<IActionResult> GetBenefitsAnalytics()
    {
        var query = new GetBenefitsAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("expenses")]
    public async Task<IActionResult> GetExpenseAnalytics()
    {
        var query = new GetExpenseAnalyticsQuery
        {
            EmployeeId = GetEmployeeId(),
            ManagerId = IsAdmin() ? null : GetEmployeeId(),
            IsAdmin = IsAdmin()
        };
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("filter-options")]
    public async Task<IActionResult> GetFilterOptions()
    {
        return Ok(await _mediator.Send(new GetFilterOptionsQuery()));
    }

    [HttpPost("custom")]
    public async Task<IActionResult> ExecuteCustomReport([FromBody] HRMS.Application.Features.Reports.DTOs.CustomReportRequestDto request)
    {
        var tenantId = _tenantContext.CurrentTenantId ?? Guid.Empty;
        var result = await _repo.ExecuteCustomReportAsync(
            tenantId,
            request,
            GetEmployeeId(),
            IsAdmin() ? null : GetEmployeeId(),
            IsAdmin(),
            new System.Collections.Generic.List<string>()
        );
        return Ok(result);
    }

    [HttpGet("saved")]
    public async Task<IActionResult> GetSavedReports()
    {
        var tenantId = _tenantContext.CurrentTenantId ?? Guid.Empty;
        var userId = GetEmployeeId() ?? Guid.Empty;
        var reports = await _repo.GetSavedReportsAsync(tenantId, userId);
        return Ok(reports);
    }

    [HttpPost("saved")]
    public async Task<IActionResult> CreateSavedReport([FromBody] HRMS.Application.Features.Reports.DTOs.CreateSavedReportDto dto)
    {
        var tenantId = _tenantContext.CurrentTenantId ?? Guid.Empty;
        var report = new HRMS.Domain.Entities.Reports.SavedReport
        {
            TenantId = tenantId,
            OwnerId = GetEmployeeId() ?? Guid.Empty,
            Name = dto.Name,
            Description = dto.Description,
            DataSource = dto.DataSource,
            Configuration = dto.Configuration,
            Visibility = dto.Visibility,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        var created = await _repo.CreateSavedReportAsync(report);
        return Ok(created);
    }

    [HttpDelete("saved/{id}")]
    public async Task<IActionResult> DeleteSavedReport(Guid id)
    {
        var tenantId = _tenantContext.CurrentTenantId ?? Guid.Empty;
        await _repo.DeleteSavedReportAsync(id, tenantId);
        return Ok(new { success = true });
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportReport([FromQuery] string format = "csv")
    {
        var tenantId = _tenantContext.CurrentTenantId ?? Guid.Empty;
        var dashboard = await _repo.GetExecutiveDashboardAsync(tenantId, GetEmployeeId(), IsAdmin() ? null : GetEmployeeId(), IsAdmin());

        if (format.Equals("excel", StringComparison.OrdinalIgnoreCase) || format.Equals("csv", StringComparison.OrdinalIgnoreCase))
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("HRMS Enterprise BI & Executive Analytics Export");
            sb.AppendLine($"Generated At: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            sb.AppendLine($"Tenant ID: {tenantId}");
            sb.AppendLine();
            sb.AppendLine("Metric,Value");
            sb.AppendLine($"Total Employees,{dashboard.TotalEmployees}");
            sb.AppendLine($"Active Employees,{dashboard.ActiveEmployees}");
            sb.AppendLine($"New Hires,{dashboard.NewHires}");
            sb.AppendLine($"Exits,{dashboard.Exits}");
            sb.AppendLine($"Turnover Rate,{dashboard.TurnoverRate}%");
            sb.AppendLine($"Attendance Rate,{dashboard.AttendanceRate}%");
            sb.AppendLine($"Absence Rate,{dashboard.AbsenceRate}%");
            sb.AppendLine($"Late Check-ins,{dashboard.LateCheckIns}");
            sb.AppendLine($"Approved Leaves,{dashboard.ApprovedLeaves}");
            sb.AppendLine($"Pending Leaves,{dashboard.PendingLeaves}");
            sb.AppendLine($"Gross Payroll Cost,{dashboard.GrossPayroll}");
            sb.AppendLine($"Net Payroll,{dashboard.NetPayroll}");
            sb.AppendLine($"Benefits Spend,{dashboard.BenefitsCost}");
            sb.AppendLine($"Open Positions,{dashboard.OpenPositions}");
            sb.AppendLine($"Total Applicants,{dashboard.Applicants}");
            sb.AppendLine($"Offers Extended,{dashboard.Offers}");
            sb.AppendLine($"Hires Completed,{dashboard.Hired}");
            sb.AppendLine($"Travel & Expense Spend,{dashboard.TravelSpend}");
            sb.AppendLine();
            sb.AppendLine("Department,Headcount");
            foreach (var dept in dashboard.DepartmentDistribution)
            {
                sb.AppendLine($"{dept.Category},{dept.Value}");
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(sb.ToString());
            var mime = format == "excel" ? "application/vnd.ms-excel" : "text/csv";
            var ext = format == "excel" ? "csv" : "csv";
            return File(bytes, mime, $"HRMS_Executive_Report_{DateTime.UtcNow:yyyyMMdd}.{ext}");
        }

        return Ok(dashboard);
    }
}

