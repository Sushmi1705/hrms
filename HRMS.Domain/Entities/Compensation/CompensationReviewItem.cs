using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationReviewItem : BaseAuditableEntity
{
    public Guid ReviewCycleId { get; set; }
    public CompensationReviewCycle? ReviewCycle { get; set; }
    
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public decimal CurrentSalary { get; set; }
    public decimal CurrentCompaRatio { get; set; }
    
    public decimal ProposedSalary { get; set; }
    public decimal ProposedIncreasePercentage { get; set; }
    public decimal ProposedIncreaseAmount { get; set; }
    public decimal NewCompaRatio { get; set; }
    
    public string ManagerRecommendation { get; set; } = string.Empty;
    public string ManagerComments { get; set; } = string.Empty;
    
    // Eligible, InReview, Submitted, Approved, Rejected
    public string Status { get; set; } = "InReview";
    public string HrComments { get; set; } = string.Empty;
}
