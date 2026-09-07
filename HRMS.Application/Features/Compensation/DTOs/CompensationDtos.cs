using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Compensation.DTOs;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext => Page < TotalPages;
    public bool HasPrevious => Page > 1;
}

// ==========================================
// 1. DASHBOARD & ANALYTICS DTOS
// ==========================================
public class CompensationDashboardMetricsDto
{
    public int TotalEmployees { get; set; }
    public decimal TotalCompensationCost { get; set; }
    public decimal AverageBaseSalary { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalBonuses { get; set; }
    public decimal EmployerBenefitCost { get; set; }
    public decimal EmployeeBenefitCost { get; set; }
    public int ActiveBenefitPlans { get; set; }
    public int EmployeesEnrolledInBenefits { get; set; }
    public int PendingCompensationApprovals { get; set; }
    public int PendingBenefitEnrollments { get; set; }
    public int UpcomingCompensationReviews { get; set; }

    public List<DepartmentCostDto> DepartmentCostBreakdown { get; set; } = new();
    public List<SalaryDistributionBucketDto> SalaryDistribution { get; set; } = new();
    public List<PayGradeCompensationDto> PayGradeBreakdown { get; set; } = new();
    public List<MonthlyCostTrendDto> ContributionTrends { get; set; } = new();
}

public class DepartmentCostDto
{
    public string DepartmentName { get; set; } = string.Empty;
    public decimal TotalCost { get; set; }
    public decimal AverageSalary { get; set; }
    public int EmployeeCount { get; set; }
}

public class SalaryDistributionBucketDto
{
    public string RangeLabel { get; set; } = string.Empty; // e.g. "$40k - $60k", "$60k - $90k", etc.
    public int Count { get; set; }
}

public class PayGradeCompensationDto
{
    public string GradeCode { get; set; } = string.Empty;
    public string GradeName { get; set; } = string.Empty;
    public decimal MinimumSalary { get; set; }
    public decimal MidpointSalary { get; set; }
    public decimal MaximumSalary { get; set; }
    public decimal AverageActualSalary { get; set; }
    public int EmployeeCount { get; set; }
}

public class MonthlyCostTrendDto
{
    public string Month { get; set; } = string.Empty;
    public decimal EmployerCost { get; set; }
    public decimal EmployeeCost { get; set; }
}

// ==========================================
// 2. SALARY COMPONENTS DTOS
// ==========================================
public class CompensationComponentDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string CalculationType { get; set; } = string.Empty;
    public decimal DefaultValue { get; set; }
    public decimal Percentage { get; set; }
    public Guid? BasedOnComponentId { get; set; }
    public string BasedOnComponentName { get; set; } = string.Empty;
    public bool IsTaxable { get; set; }
    public bool IsPensionable { get; set; }
    public bool IsRecurring { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCompensationComponentDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "Earnings";
    public string CalculationType { get; set; } = "FixedAmount";
    public decimal DefaultValue { get; set; }
    public decimal Percentage { get; set; }
    public Guid? BasedOnComponentId { get; set; }
    public bool IsTaxable { get; set; } = true;
    public bool IsPensionable { get; set; } = false;
    public bool IsRecurring { get; set; } = true;
}

// ==========================================
// 3. PAY GRADES & SALARY BANDS DTOS
// ==========================================
public class PayGradeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Level { get; set; }
    public decimal MinimumSalary { get; set; }
    public decimal MidpointSalary { get; set; }
    public decimal MaximumSalary { get; set; }
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "Active";
    public int BandsCount { get; set; }
    public int EmployeeCount { get; set; }
}

public class CreatePayGradeDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Level { get; set; } = 1;
    public decimal MinimumSalary { get; set; }
    public decimal MidpointSalary { get; set; }
    public decimal MaximumSalary { get; set; }
    public string Currency { get; set; } = "USD";
}

public class SalaryBandDto
{
    public Guid Id { get; set; }
    public Guid PayGradeId { get; set; }
    public string GradeCode { get; set; } = string.Empty;
    public string BandName { get; set; } = string.Empty;
    public Guid? LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public decimal Minimum { get; set; }
    public decimal Midpoint { get; set; }
    public decimal Maximum { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; }
}

public class CreateSalaryBandDto
{
    public Guid PayGradeId { get; set; }
    public string BandName { get; set; } = string.Empty;
    public Guid? LocationId { get; set; }
    public string Country { get; set; } = "United States";
    public decimal Minimum { get; set; }
    public decimal Midpoint { get; set; }
    public decimal Maximum { get; set; }
    public string Currency { get; set; } = "USD";
}

// ==========================================
// 4. EMPLOYEE COMPENSATION DTOS
// ==========================================
public class EmployeeCompensationDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string DesignationTitle { get; set; } = string.Empty;
    
    public Guid? PayGradeId { get; set; }
    public string GradeCode { get; set; } = string.Empty;
    public string GradeName { get; set; } = string.Empty;
    
    public Guid? SalaryBandId { get; set; }
    public string BandName { get; set; } = string.Empty;
    public decimal BandMin { get; set; }
    public decimal BandMidpoint { get; set; }
    public decimal BandMax { get; set; }
    
    public decimal BaseSalary { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal AnnualTotalCompensation { get; set; }
    public decimal MonthlyTotalCompensation { get; set; }
    
    public decimal CompaRatio { get; set; } // BaseSalary / BandMidpoint
    public string CompaRatioStatus => CompaRatio switch
    {
        < 0.85m => "BelowRange",
        <= 1.15m => "WithinRange",
        _ => "AboveRange"
    };

    public DateTime EffectiveDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string Status { get; set; } = "Active";
}

public class EmployeeCompensationDetailDto : EmployeeCompensationDto
{
    public List<CompensationComponentAssignmentDto> Components { get; set; } = new();
    public List<CompensationHistoryDto> History { get; set; } = new();
    public List<EmployeeBonusDto> Bonuses { get; set; } = new();
    public List<BenefitEnrollmentDto> EnrolledBenefits { get; set; } = new();
}

public class CompensationComponentAssignmentDto
{
    public Guid Id { get; set; }
    public Guid ComponentId { get; set; }
    public string ComponentCode { get; set; } = string.Empty;
    public string ComponentName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
    public decimal CalculatedMonthlyAmount { get; set; }
    public decimal CalculatedAnnualAmount { get; set; }
}

public class UpsertEmployeeCompensationDto
{
    public Guid EmployeeId { get; set; }
    public Guid? PayGradeId { get; set; }
    public Guid? SalaryBandId { get; set; }
    public decimal BaseSalary { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime EffectiveDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public List<UpsertComponentAssignmentDto> Components { get; set; } = new();
}

public class UpsertComponentAssignmentDto
{
    public Guid ComponentId { get; set; }
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
}

// ==========================================
// 5. SALARY REVISIONS & WORKFLOW DTOS
// ==========================================
public class SalaryRevisionDto
{
    public Guid Id { get; set; }
    public string RevisionNumber { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public decimal CurrentSalary { get; set; }
    public decimal ProposedSalary { get; set; }
    public decimal IncreaseAmount { get; set; }
    public decimal PercentageIncrease { get; set; }
    public DateTime EffectiveDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid? WorkflowRequestId { get; set; }
    public string ApproverComments { get; set; } = string.Empty;
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateSalaryRevisionDto
{
    public Guid EmployeeId { get; set; }
    public decimal ProposedSalary { get; set; }
    public DateTime EffectiveDate { get; set; }
    public string Reason { get; set; } = "MeritIncrease";
    public string Comments { get; set; } = string.Empty;
}

public class ProcessSalaryRevisionActionDto
{
    public string Action { get; set; } = "Approve"; // Approve, Reject
    public string ApproverComments { get; set; } = string.Empty;
}

// ==========================================
// 6. COMPENSATION HISTORY DTOS
// ==========================================
public class CompensationHistoryDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public decimal PreviousSalary { get; set; }
    public decimal NewSalary { get; set; }
    public decimal IncreaseAmount { get; set; }
    public decimal PercentageIncrease { get; set; }
    public string PreviousGradeName { get; set; } = string.Empty;
    public string NewGradeName { get; set; } = string.Empty;
    public DateTime EffectiveDate { get; set; }
    public string ChangeType { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public DateTime? ApprovalDate { get; set; }
    public string Comments { get; set; } = string.Empty;
}

// ==========================================
// 7. BONUSES & INCENTIVES DTOS
// ==========================================
public class EmployeeBonusDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string BonusType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public decimal? AchievementPercentage { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime EffectiveDate { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Approved";
    public bool IsPayrollProcessed { get; set; }
    public string PayrollPeriod { get; set; } = string.Empty;
}

public class CreateEmployeeBonusDto
{
    public Guid EmployeeId { get; set; }
    public string BonusType { get; set; } = "PerformanceBonus";
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public decimal? AchievementPercentage { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime PaymentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}

// ==========================================
// 8. REVIEW CYCLES & BUDGETS DTOS
// ==========================================
public class CompensationReviewCycleDto
{
    public Guid Id { get; set; }
    public string CycleName { get; set; } = string.Empty;
    public int FiscalYear { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime EffectiveDate { get; set; }
    public decimal TotalBudget { get; set; }
    public decimal AllocatedBudget { get; set; }
    public decimal UsedBudget { get; set; }
    public decimal RemainingBudget => TotalBudget - UsedBudget;
    public decimal UtilizationPercentage => TotalBudget > 0 ? Math.Round((UsedBudget / TotalBudget) * 100, 1) : 0;
    public string Status { get; set; } = "Open";
    public string Guidelines { get; set; } = string.Empty;
    public int ItemsCount { get; set; }
}

public class CompensationReviewItemDto
{
    public Guid Id { get; set; }
    public Guid ReviewCycleId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string DesignationTitle { get; set; } = string.Empty;
    public decimal CurrentSalary { get; set; }
    public decimal CurrentCompaRatio { get; set; }
    public decimal ProposedSalary { get; set; }
    public decimal ProposedIncreasePercentage { get; set; }
    public decimal ProposedIncreaseAmount { get; set; }
    public decimal NewCompaRatio { get; set; }
    public string ManagerRecommendation { get; set; } = string.Empty;
    public string ManagerComments { get; set; } = string.Empty;
    public string Status { get; set; } = "InReview";
}

// ==========================================
// 9. BENEFIT PLANS & ENROLLMENTS DTOS
// ==========================================
public class BenefitPlanDto
{
    public Guid Id { get; set; }
    public string PlanCode { get; set; } = string.Empty;
    public string PlanName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public decimal CoverageAmount { get; set; }
    public decimal EmployeeMonthlyCost { get; set; }
    public decimal EmployerMonthlyCost { get; set; }
    public string ContributionType { get; set; } = "FixedAmount";
    public decimal? EmployerMatchPercentage { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = "Active";
    public bool AllowsDependents { get; set; }
    public int ActiveEnrollmentsCount { get; set; }
}

public class CreateBenefitPlanDto
{
    public string PlanCode { get; set; } = string.Empty;
    public string PlanName { get; set; } = string.Empty;
    public string Type { get; set; } = "MedicalInsurance";
    public string Provider { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public decimal CoverageAmount { get; set; }
    public decimal EmployeeMonthlyCost { get; set; }
    public decimal EmployerMonthlyCost { get; set; }
    public string ContributionType { get; set; } = "FixedAmount";
    public decimal? EmployerMatchPercentage { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool AllowsDependents { get; set; } = true;
}

public class BenefitEnrollmentDto
{
    public Guid Id { get; set; }
    public string EnrollmentNumber { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public Guid BenefitPlanId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string PlanType { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string CoverageTier { get; set; } = "EmployeeOnly";
    public decimal EmployeeMonthlyContribution { get; set; }
    public decimal EmployerMonthlyContribution { get; set; }
    public decimal TotalMonthlyPremium { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime? RenewalDate { get; set; }
    public string Status { get; set; } = "Active";
    public int DependentsCount { get; set; }
}

public class CreateBenefitEnrollmentDto
{
    public Guid EmployeeId { get; set; }
    public Guid BenefitPlanId { get; set; }
    public string CoverageTier { get; set; } = "EmployeeOnly"; // EmployeeOnly, EmployeeSpouse, EmployeeChildren, Family
    public DateTime EffectiveDate { get; set; }
    public List<Guid> CoveredDependentIds { get; set; } = new();
}

public class EmployeeDependentDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public int Age => DateTime.Today.Year - DateOfBirth.Year;
    public string Gender { get; set; } = string.Empty;
    public string VerificationStatus { get; set; } = "Verified";
}

public class CreateEmployeeDependentDto
{
    public Guid EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Relationship { get; set; } = "Spouse";
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = "Unspecified";
    public string ContactPhone { get; set; } = string.Empty;
}

// ==========================================
// 10. TOTAL REWARDS & STATEMENTS DTOS
// ==========================================
public class TotalRewardsDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string DesignationTitle { get; set; } = string.Empty;
    public string GradeName { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
    
    // Core Earnings
    public decimal BaseSalaryAnnual { get; set; }
    public decimal BaseSalaryMonthly { get; set; }
    public decimal TotalAllowancesAnnual { get; set; }
    public decimal TotalAllowancesMonthly { get; set; }
    public decimal TotalBonusesAnnual { get; set; }
    
    // Employer Investments (Benefits & Match)
    public decimal EmployerMedicalBenefitAnnual { get; set; }
    public decimal EmployerDentalVisionAnnual { get; set; }
    public decimal EmployerRetirementMatchAnnual { get; set; }
    public decimal EmployerOtherBenefitsAnnual { get; set; }
    public decimal TotalEmployerBenefitsAnnual { get; set; }
    
    // Grand Total
    public decimal TotalRewardsValueAnnual { get; set; }
    public decimal TotalRewardsValueMonthly { get; set; }
    
    public List<CompensationComponentAssignmentDto> AllowancesList { get; set; } = new();
    public List<BenefitEnrollmentDto> EnrolledBenefitsList { get; set; } = new();
}

// ==========================================
// 11. PAYROLL INTEGRATION DTO
// ==========================================
public class PayrollCompensationExportDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public decimal ApprovedBaseSalary { get; set; }
    public decimal RegularAllowances { get; set; }
    public decimal ApprovedBonusesPayable { get; set; }
    public decimal EmployeeBenefitDeductions { get; set; }
    public decimal EmployerBenefitContributions { get; set; }
    public decimal TotalMonthlyGross => ApprovedBaseSalary + RegularAllowances + ApprovedBonusesPayable;
    public DateTime AsOfDate { get; set; }
}

// ==========================================
// 12. FILTER QUERY PARAMETERS
// ==========================================
public class CompensationFilterParams
{
    public string? Search { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? PayGradeId { get; set; }
    public string? Status { get; set; }
    public string? CompaRatioFilter { get; set; } // BelowRange, WithinRange, AboveRange
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
