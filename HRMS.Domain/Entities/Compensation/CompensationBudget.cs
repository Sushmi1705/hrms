using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationBudget : BaseAuditableEntity
{
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public Guid? BusinessUnitId { get; set; }
    public BusinessUnit? BusinessUnit { get; set; }
    
    public Guid? ReviewCycleId { get; set; }
    public CompensationReviewCycle? ReviewCycle { get; set; }
    
    public int FiscalYear { get; set; } = 2026;
    public decimal AllocatedBudget { get; set; }
    public decimal UsedBudget { get; set; }
    public decimal ProposedBudget { get; set; }
    public decimal RemainingBudget => AllocatedBudget - UsedBudget - ProposedBudget;
    public string Currency { get; set; } = "USD";
}
