using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Compensation.DTOs;

namespace HRMS.Application.Contracts.Persistence;

public interface ICompensationRepository
{
    // 1. Dashboard Metrics
    Task<CompensationDashboardMetricsDto> GetDashboardMetricsAsync();

    // 2. Salary Components
    Task<List<CompensationComponentDto>> GetComponentsAsync();
    Task<CompensationComponentDto> CreateComponentAsync(CreateCompensationComponentDto dto);
    Task<CompensationComponentDto> UpdateComponentAsync(Guid id, CreateCompensationComponentDto dto);
    Task<bool> DeleteComponentAsync(Guid id);

    // 3. Pay Grades & Bands
    Task<List<PayGradeDto>> GetPayGradesAsync();
    Task<PayGradeDto> CreatePayGradeAsync(CreatePayGradeDto dto);
    Task<List<SalaryBandDto>> GetSalaryBandsAsync(Guid? payGradeId);
    Task<SalaryBandDto> CreateSalaryBandAsync(CreateSalaryBandDto dto);

    // 4. Employee Compensation & Packages
    Task<PagedResult<EmployeeCompensationDto>> GetEmployeeCompensationsAsync(CompensationFilterParams filters);
    Task<EmployeeCompensationDetailDto?> GetEmployeeCompensationDetailAsync(Guid employeeId);
    Task<EmployeeCompensationDto> UpsertEmployeeCompensationAsync(UpsertEmployeeCompensationDto dto, string initiatedBy);

    // 5. Salary Revisions & Workflow
    Task<PagedResult<SalaryRevisionDto>> GetSalaryRevisionsAsync(string? status, int page, int pageSize);
    Task<SalaryRevisionDto> CreateSalaryRevisionAsync(CreateSalaryRevisionDto dto, string initiatedBy);
    Task<SalaryRevisionDto> ProcessSalaryRevisionActionAsync(Guid revisionId, ProcessSalaryRevisionActionDto dto, string approver);

    // 6. Bonuses & Variable Pay
    Task<List<EmployeeBonusDto>> GetBonusesAsync(Guid? employeeId);
    Task<EmployeeBonusDto> CreateBonusAsync(CreateEmployeeBonusDto dto, string approvedBy);

    // 7. Review Cycles & Budgets
    Task<List<CompensationReviewCycleDto>> GetReviewCyclesAsync();
    Task<CompensationReviewCycleDto> CreateReviewCycleAsync(string cycleName, int fiscalYear, decimal totalBudget, DateTime startDate, DateTime endDate, DateTime effectiveDate);
    Task<List<CompensationReviewItemDto>> GetReviewItemsAsync(Guid cycleId);
    Task<CompensationReviewItemDto> UpdateReviewItemAsync(Guid itemId, decimal proposedSalary, string recommendation, string comments);

    // 8. Benefit Plans & Enrollments
    Task<List<BenefitPlanDto>> GetBenefitPlansAsync();
    Task<BenefitPlanDto> CreateBenefitPlanAsync(CreateBenefitPlanDto dto);
    Task<List<BenefitEnrollmentDto>> GetBenefitEnrollmentsAsync(Guid? employeeId);
    Task<BenefitEnrollmentDto> CreateBenefitEnrollmentAsync(CreateBenefitEnrollmentDto dto);
    Task<List<EmployeeDependentDto>> GetDependentsAsync(Guid employeeId);
    Task<EmployeeDependentDto> CreateDependentAsync(CreateEmployeeDependentDto dto);

    // 9. Total Rewards & Self-Service
    Task<TotalRewardsDto?> GetTotalRewardsAsync(Guid employeeId);
    Task<List<EmployeeCompensationDto>> GetTeamCompensationAsync(Guid managerEmployeeId);

    // 10. Payroll Consumption Integration
    Task<List<PayrollCompensationExportDto>> GetPayrollCompensationExportAsync(DateTime asOfDate);

    // 11. Reports & Exports
    Task<byte[]> ExportCompensationCsvAsync(string reportType);
}
