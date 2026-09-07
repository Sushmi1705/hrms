using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class EmployeeBonus : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    // AnnualBonus, PerformanceBonus, SpotBonus, JoiningBonus, RetentionBonus, ReferralBonus, ProjectBonus, SalesIncentive, Commission
    public string BonusType { get; set; } = "PerformanceBonus";
    
    public decimal Amount { get; set; }
    public decimal? TargetAmount { get; set; }
    public decimal? AchievementPercentage { get; set; }
    public string Currency { get; set; } = "USD";
    
    public DateTime EffectiveDate { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    
    // Draft, PendingApproval, Approved, Rejected, PaidInPayroll
    public string Status { get; set; } = "Approved";
    public string ApprovedBy { get; set; } = string.Empty;
    public DateTime? ApprovedAt { get; set; }
    
    public bool IsPayrollProcessed { get; set; } = false;
    public string PayrollPeriod { get; set; } = string.Empty; // E.g., "September 2026"
}
