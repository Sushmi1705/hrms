using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Travel;

public class TravelRequest : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;
    public string Purpose { get; set; } = string.Empty;
    public string BusinessJustification { get; set; } = string.Empty;
    public string TravelType { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime DepartureDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public decimal EstimatedCost { get; set; }
    public string Currency { get; set; } = "USD";
    public Guid? CostCenterId { get; set; }
    public CostCenter? CostCenter { get; set; }
    public Guid? ProjectId { get; set; }
    public string Status { get; set; } = "Draft";
    public bool AdvanceRequired { get; set; }
    public decimal? AdvanceAmount { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class Trip : BaseAuditableEntity
{
    public Guid TravelRequestId { get; set; }
    public TravelRequest TravelRequest { get; set; } = null!;
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;
    public string Status { get; set; } = "Upcoming";
    public ICollection<TravelItineraryItem> ItineraryItems { get; set; } = new List<TravelItineraryItem>();
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}

public class TravelItineraryItem : BaseAuditableEntity
{
    public Guid TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public string Type { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string BookingReference { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public decimal Cost { get; set; }
    public string Currency { get; set; } = "USD";
    public string Notes { get; set; } = string.Empty;
}

public class TravelAdvance : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;
    public Guid? TravelRequestId { get; set; }
    public TravelRequest? TravelRequest { get; set; }
    public decimal RequestedAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Purpose { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string Status { get; set; } = "Draft";
    public decimal SettledAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class ExpenseCategory : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool ReceiptRequired { get; set; }
    public bool TaxApplicable { get; set; }
    public bool PolicyControlled { get; set; }
    public bool IsActive { get; set; } = true;
}

public class Expense : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;
    public Guid? TripId { get; set; }
    public Trip? Trip { get; set; }
    public Guid? ExpenseReportId { get; set; }
    public ExpenseReport? ExpenseReport { get; set; }
    public Guid CategoryId { get; set; }
    public ExpenseCategory Category { get; set; } = null!;
    public DateTime ExpenseDate { get; set; }
    public string Merchant { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal ExchangeRate { get; set; } = 1.0m;
    public decimal ConvertedAmount { get; set; }
    public string PaymentMethod { get; set; } = "Personal";
    public Guid? ReceiptDocumentId { get; set; }
    public string Status { get; set; } = "Draft";
    public string PolicyStatus { get; set; } = "Compliant";
    public string Notes { get; set; } = string.Empty;
}

public class ExpenseReport : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;
    public Guid? TripId { get; set; }
    public Trip? Trip { get; set; }
    public string ReportNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public decimal AdvanceApplied { get; set; }
    public decimal ReimbursableAmount { get; set; }
    public string Status { get; set; } = "Draft";
    public string Notes { get; set; } = string.Empty;
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}

public class ExpensePolicyRule : BaseAuditableEntity
{
    public Guid? CategoryId { get; set; }
    public ExpenseCategory? Category { get; set; }
    public string RuleType { get; set; } = string.Empty;
    public decimal? MaxAmount { get; set; }
    public string Currency { get; set; } = "USD";
    public string ConditionValue { get; set; } = string.Empty;
    public string ViolationSeverity { get; set; } = "Warning";
    public bool IsActive { get; set; } = true;
}
