using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationHistory : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public decimal PreviousSalary { get; set; }
    public decimal NewSalary { get; set; }
    public decimal IncreaseAmount { get; set; }
    public decimal PercentageIncrease { get; set; }
    
    public Guid? PreviousGradeId { get; set; }
    public PayGrade? PreviousGrade { get; set; }
    public Guid? NewGradeId { get; set; }
    public PayGrade? NewGrade { get; set; }
    
    public DateTime EffectiveDate { get; set; }
    
    // AnnualReview, Promotion, MarketAdjustment, MeritIncrease, InternalTransfer, Demotion, Correction, Other
    public string ChangeType { get; set; } = "MeritIncrease";
    public string Reason { get; set; } = string.Empty;
    
    public string InitiatedBy { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public DateTime? ApprovalDate { get; set; }
    public string Comments { get; set; } = string.Empty;
}
