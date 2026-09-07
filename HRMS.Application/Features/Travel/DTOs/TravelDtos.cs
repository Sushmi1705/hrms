using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Travel.DTOs;

// ─── Dashboard ───────────────────────────────────────────────────────────────
public class TravelDashboardDto
{
    public int TotalTravelRequests { get; set; }
    public int PendingApprovals { get; set; }
    public int ActiveTrips { get; set; }
    public int CompletedTrips { get; set; }
    public decimal TotalTravelSpend { get; set; }
    public int PendingExpenseReports { get; set; }
    public int PendingFinanceReview { get; set; }
    public int PendingReimbursements { get; set; }
    public decimal OutstandingAdvances { get; set; }
    public int PolicyViolations { get; set; }
    public List<SpendByMonthDto> SpendByMonth { get; set; } = new();
    public List<SpendByCategoryDto> SpendByCategory { get; set; } = new();
    public List<TravelRequestDto> RecentRequests { get; set; } = new();
}

public class SpendByMonthDto { public string Month { get; set; } = ""; public decimal Amount { get; set; } }
public class SpendByCategoryDto { public string Category { get; set; } = ""; public decimal Amount { get; set; } }

// ─── Travel Requests ─────────────────────────────────────────────────────────
public class TravelRequestDto
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; } = "";
    public string EmployeeCode { get; set; } = "";
    public string Department { get; set; } = "";
    public string Purpose { get; set; } = "";
    public string BusinessJustification { get; set; } = "";
    public string TravelType { get; set; } = "";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public decimal EstimatedCost { get; set; }
    public string Currency { get; set; } = "USD";
    public string CostCenter { get; set; } = "";
    public string Status { get; set; } = "";
    public bool AdvanceRequired { get; set; }
    public decimal? AdvanceAmount { get; set; }
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class CreateTravelRequestDto
{
    public string Purpose { get; set; } = "";
    public string BusinessJustification { get; set; } = "";
    public string TravelType { get; set; } = "Domestic";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public decimal EstimatedCost { get; set; }
    public string Currency { get; set; } = "USD";
    public Guid? CostCenterId { get; set; }
    public bool AdvanceRequired { get; set; }
    public decimal? AdvanceAmount { get; set; }
    public string Notes { get; set; } = "";
}

public class TravelFilterDto
{
    public string? Status { get; set; }
    public string? TravelType { get; set; }
    public Guid? EmployeeId { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

// ─── Trips ───────────────────────────────────────────────────────────────────
public class TripDto
{
    public Guid Id { get; set; }
    public Guid TravelRequestId { get; set; }
    public string EmployeeName { get; set; } = "";
    public string Department { get; set; } = "";
    public string Destination { get; set; } = "";
    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public string TravelType { get; set; } = "";
    public string Status { get; set; } = "";
    public decimal EstimatedCost { get; set; }
    public decimal ActualCost { get; set; }
    public string Currency { get; set; } = "USD";
    public List<ItineraryItemDto> ItineraryItems { get; set; } = new();
}

public class ItineraryItemDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "";
    public string Provider { get; set; } = "";
    public string BookingReference { get; set; } = "";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public decimal Cost { get; set; }
    public string Currency { get; set; } = "USD";
    public string Notes { get; set; } = "";
}

public class CreateItineraryItemDto
{
    public string Type { get; set; } = "";
    public string Provider { get; set; } = "";
    public string BookingReference { get; set; } = "";
    public string Origin { get; set; } = "";
    public string Destination { get; set; } = "";
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public decimal Cost { get; set; }
    public string Currency { get; set; } = "USD";
    public string Notes { get; set; } = "";
}

// ─── Advances ────────────────────────────────────────────────────────────────
public class TravelAdvanceDto
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; } = "";
    public string EmployeeCode { get; set; } = "";
    public Guid? TravelRequestId { get; set; }
    public string TravelDestination { get; set; } = "";
    public decimal RequestedAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Purpose { get; set; } = "";
    public DateTime RequiredDate { get; set; }
    public string Status { get; set; } = "";
    public decimal SettledAmount { get; set; }
    public decimal Balance => RequestedAmount - SettledAmount;
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class CreateTravelAdvanceDto
{
    public Guid? TravelRequestId { get; set; }
    public decimal RequestedAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Purpose { get; set; } = "";
    public DateTime RequiredDate { get; set; }
    public string PaymentMethod { get; set; } = "";
    public string Notes { get; set; } = "";
}

// ─── Expense Categories ──────────────────────────────────────────────────────
public class ExpenseCategoryDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public bool ReceiptRequired { get; set; }
    public bool TaxApplicable { get; set; }
    public bool PolicyControlled { get; set; }
    public bool IsActive { get; set; }
}

public class CreateExpenseCategoryDto
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public bool ReceiptRequired { get; set; }
    public bool TaxApplicable { get; set; }
    public bool PolicyControlled { get; set; }
}

// ─── Expenses ─────────────────────────────────────────────────────────────────
public class ExpenseDto
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; } = "";
    public string CategoryName { get; set; } = "";
    public Guid CategoryId { get; set; }
    public Guid? TripId { get; set; }
    public Guid? ExpenseReportId { get; set; }
    public DateTime ExpenseDate { get; set; }
    public string Merchant { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ExchangeRate { get; set; } = 1.0m;
    public decimal ConvertedAmount { get; set; }
    public string PaymentMethod { get; set; } = "";
    public Guid? ReceiptDocumentId { get; set; }
    public string Status { get; set; } = "";
    public string PolicyStatus { get; set; } = "";
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class CreateExpenseDto
{
    public Guid CategoryId { get; set; }
    public Guid? TripId { get; set; }
    public DateTime ExpenseDate { get; set; }
    public string Merchant { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ExchangeRate { get; set; } = 1.0m;
    public string PaymentMethod { get; set; } = "Personal";
    public Guid? ReceiptDocumentId { get; set; }
    public string Notes { get; set; } = "";
}

// ─── Expense Reports ──────────────────────────────────────────────────────────
public class ExpenseReportDto
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; } = "";
    public string EmployeeCode { get; set; } = "";
    public string Department { get; set; } = "";
    public Guid? TripId { get; set; }
    public string TripDestination { get; set; } = "";
    public string ReportNumber { get; set; } = "";
    public string Title { get; set; } = "";
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal AdvanceApplied { get; set; }
    public decimal ReimbursableAmount { get; set; }
    public string Status { get; set; } = "";
    public string Notes { get; set; } = "";
    public List<ExpenseDto> Expenses { get; set; } = new();
    public int ViolationCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateExpenseReportDto
{
    public Guid? TripId { get; set; }
    public string Title { get; set; } = "";
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal AdvanceApplied { get; set; }
    public List<Guid> ExpenseIds { get; set; } = new();
    public string Notes { get; set; } = "";
}

// ─── Policy ───────────────────────────────────────────────────────────────────
public class PolicyRuleDto
{
    public Guid Id { get; set; }
    public string CategoryName { get; set; } = "";
    public Guid? CategoryId { get; set; }
    public string RuleType { get; set; } = "";
    public decimal? MaxAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string ConditionValue { get; set; } = "";
    public string ViolationSeverity { get; set; } = "";
    public bool IsActive { get; set; }
}

public class CreatePolicyRuleDto
{
    public Guid? CategoryId { get; set; }
    public string RuleType { get; set; } = "";
    public decimal? MaxAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string ConditionValue { get; set; } = "";
    public string ViolationSeverity { get; set; } = "Warning";
}

public class PolicyCheckResult
{
    public string Status { get; set; } = "Compliant"; // Compliant, Warning, Violation
    public decimal? PolicyLimit { get; set; }
    public decimal? SubmittedAmount { get; set; }
    public decimal? Variance { get; set; }
    public string Severity { get; set; } = "";
    public string Message { get; set; } = "";
}
