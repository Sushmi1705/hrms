using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Reports.DTOs;

public class ExecutiveDashboardDto
{
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int NewHires { get; set; }
    public int Exits { get; set; }
    public double TurnoverRate { get; set; }
    
    public double AttendanceRate { get; set; }
    public double AbsenceRate { get; set; }
    public int LateCheckIns { get; set; }
    public int EarlyCheckOuts { get; set; }

    public int TotalLeaveRequests { get; set; }
    public int ApprovedLeaves { get; set; }
    public int PendingLeaves { get; set; }
    public double LeaveUtilizationRate { get; set; }
    
    public decimal PayrollCost { get; set; }
    public decimal GrossPayroll { get; set; }
    public decimal NetPayroll { get; set; }
    public decimal BenefitsCost { get; set; }
    
    public int OpenPositions { get; set; }
    public int Applicants { get; set; }
    public int Interviews { get; set; }
    public int Offers { get; set; }
    public int Hired { get; set; }
    
    public decimal TravelSpend { get; set; }
    
    // Charts
    public List<TrendDataPoint> HeadcountTrend { get; set; } = new();
    public List<CategoryDataPoint> DepartmentDistribution { get; set; } = new();
    public List<TrendDataPoint> PayrollTrend { get; set; } = new();
    public List<TrendDataPoint> AttendanceTrend { get; set; } = new();
    public List<CategoryDataPoint> RecruitmentFunnel { get; set; } = new();
    public List<CategoryDataPoint> LeaveTypeDistribution { get; set; } = new();

    // AI & Operational Insights
    public List<InsightItemDto> Insights { get; set; } = new();
    public List<ActionItemDto> ActionItems { get; set; } = new();
}

public class InsightItemDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Type { get; set; } = "info"; // positive, warning, negative, info
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Workforce, Attendance, Payroll, Recruitment, Leave
    public string Impact { get; set; } = "Medium"; // High, Medium, Low
    public string ActionText { get; set; } = string.Empty;
    public string? ActionUrl { get; set; }
}

public class ActionItemDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Approvals, Compliance, Recruitment, Payroll
    public string Priority { get; set; } = "Medium"; // High, Medium, Low
    public int Count { get; set; }
    public string ActionUrl { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
}

public class RecruitmentAnalyticsDto
{
    public int TotalRequisitions { get; set; }
    public int OpenPositions { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalApplications { get; set; }
    public int OffersExtended { get; set; }
    public int HiresCompleted { get; set; }
    public double OfferAcceptanceRate { get; set; }
    public double TimeToHireDays { get; set; }
    public List<CategoryDataPoint> FunnelByStage { get; set; } = new();
    public List<CategoryDataPoint> OpeningsByDepartment { get; set; } = new();
    public List<TrendDataPoint> ApplicationsTrend { get; set; } = new();
}

public class PerformanceAnalyticsDto
{
    public int TotalReviews { get; set; }
    public int CompletedReviews { get; set; }
    public int PendingReviews { get; set; }
    public double AverageCompanyRating { get; set; }
    public List<CategoryDataPoint> RatingDistribution { get; set; } = new();
    public List<CategoryDataPoint> PerformanceByDepartment { get; set; } = new();
    public List<CategoryDataPoint> GoalCompletionRates { get; set; } = new();
}

public class TrainingAnalyticsDto
{
    public int TotalCourses { get; set; }
    public int TotalEnrollments { get; set; }
    public int CompletedCourses { get; set; }
    public double CompletionRate { get; set; }
    public double AverageHoursPerEmployee { get; set; }
    public List<CategoryDataPoint> PopularCourses { get; set; } = new();
    public List<CategoryDataPoint> EnrollmentsByDepartment { get; set; } = new();
}

public class WorkforceAnalyticsDto
{
    public int Headcount { get; set; }
    public int ActiveEmployees { get; set; }
    public int InactiveEmployees { get; set; }
    public double AverageTenureYears { get; set; }
    public double TurnoverRate { get; set; }
    public double RetentionRate { get; set; }
    
    public List<CategoryDataPoint> EmploymentTypeDistribution { get; set; } = new();
    public List<CategoryDataPoint> DepartmentDistribution { get; set; } = new();
    public List<CategoryDataPoint> LocationDistribution { get; set; } = new();
    public List<TrendDataPoint> HiringTrend { get; set; } = new();
    public List<TrendDataPoint> TurnoverTrend { get; set; } = new();
}

public class AttendanceAnalyticsDto
{
    public double AttendanceRate { get; set; }
    public double AbsenceRate { get; set; }
    public double LateRate { get; set; }
    public double EarlyCheckoutRate { get; set; }
    public double TotalOvertimeHours { get; set; }
    
    public List<TrendDataPoint> AttendanceTrend { get; set; } = new();
    public List<CategoryDataPoint> DepartmentAttendance { get; set; } = new();
}

public class LeaveAnalyticsDto
{
    public int TotalLeaveRequests { get; set; }
    public int ApprovedLeaves { get; set; }
    public int PendingLeaves { get; set; }
    public int RejectedLeaves { get; set; }
    
    public List<CategoryDataPoint> LeaveByType { get; set; } = new();
    public List<CategoryDataPoint> LeaveByDepartment { get; set; } = new();
    public List<TrendDataPoint> LeaveTrend { get; set; } = new();
}

public class PayrollAnalyticsDto
{
    public decimal GrossPayroll { get; set; }
    public decimal NetPayroll { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal TotalTaxes { get; set; }
    
    public List<TrendDataPoint> PayrollTrend { get; set; } = new();
    public List<CategoryDataPoint> PayrollByDepartment { get; set; } = new();
    public List<CategoryDataPoint> PayrollByLocation { get; set; } = new();
}

public class AssetAnalyticsDto
{
    public int TotalAssets { get; set; }
    public int AssignedAssets { get; set; }
    public int AvailableAssets { get; set; }
    public int UnderMaintenance { get; set; }
    public int LostOrDamaged { get; set; }
    public decimal TotalAssetValue { get; set; }
    public int PendingReturns { get; set; }
    public List<CategoryDataPoint> AssetsByCategory { get; set; } = new();
    public List<CategoryDataPoint> AssetsByDepartment { get; set; } = new();
    public List<CategoryDataPoint> AssetsByStatus { get; set; } = new();
}

public class BenefitsAnalyticsDto
{
    public decimal TotalBenefitsCost { get; set; }
    public double EnrollmentRate { get; set; }
    public int EmployeesEnrolled { get; set; }
    public int TotalPlans { get; set; }
    public decimal AverageBenefitPerEmployee { get; set; }
    public List<CategoryDataPoint> CostByBenefitType { get; set; } = new();
    public List<CategoryDataPoint> EnrollmentsByPlan { get; set; } = new();
    public List<TrendDataPoint> BenefitsCostTrend { get; set; } = new();
}

public class ExpenseAnalyticsDto
{
    public decimal TotalSpend { get; set; }
    public decimal TravelSpend { get; set; }
    public decimal ExpenseSpend { get; set; }
    public int PendingClaims { get; set; }
    public int ApprovedClaims { get; set; }
    public int RejectedClaims { get; set; }
    public List<CategoryDataPoint> SpendByDepartment { get; set; } = new();
    public List<CategoryDataPoint> SpendByCategory { get; set; } = new();
    public List<TrendDataPoint> MonthlySpendTrend { get; set; } = new();
}

public class ReportFilterParams
{
    public string Period { get; set; } = "last-6-months";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? CompanyId { get; set; }
    public Guid? BusinessUnitId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? LocationId { get; set; }
    public string? EmploymentType { get; set; }
}

public class FilterOptionsDto
{
    public List<FilterOptionItem> Companies { get; set; } = new();
    public List<FilterOptionItem> BusinessUnits { get; set; } = new();
    public List<FilterOptionItem> Departments { get; set; } = new();
    public List<FilterOptionItem> Branches { get; set; } = new();
    public List<FilterOptionItem> Locations { get; set; } = new();
    public List<string> EmploymentTypes { get; set; } = new();
}

public class FilterOptionItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
}

public class SavedReportDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DataSource { get; set; } = string.Empty;
    public string Configuration { get; set; } = "{}";
    public string Visibility { get; set; } = "Private";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSavedReportDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DataSource { get; set; } = string.Empty;
    public string Configuration { get; set; } = "{}";
    public string Visibility { get; set; } = "Private";
}

public class CustomReportRequestDto
{
    public string DataSource { get; set; } = string.Empty;
    public List<string> Fields { get; set; } = new();
    public List<ReportFilterDto> Filters { get; set; } = new();
    public List<string> GroupBy { get; set; } = new();
    public List<ReportSortDto> SortBy { get; set; } = new();
    public string? AggregationType { get; set; } // Count, Sum, Average, Min, Max
    public string? AggregationField { get; set; }
    public string? VisualizationType { get; set; } // Table, KPI, Line, Bar, Pie
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class ReportFilterDto
{
    public string Field { get; set; } = string.Empty;
    public string Operator { get; set; } = string.Empty; // Equals, Contains, GreaterThan, etc.
    public string Value { get; set; } = string.Empty;
}

public class ReportSortDto
{
    public string Field { get; set; } = string.Empty;
    public bool IsDescending { get; set; }
}

public class CustomReportResultDto
{
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object>> Rows { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public double? AggregationResult { get; set; }
}

public class TrendDataPoint
{
    public string Period { get; set; } = string.Empty;
    public double Value { get; set; }
    public double? SecondaryValue { get; set; }
}

public class CategoryDataPoint
{
    public string Category { get; set; } = string.Empty;
    public double Value { get; set; }
}

