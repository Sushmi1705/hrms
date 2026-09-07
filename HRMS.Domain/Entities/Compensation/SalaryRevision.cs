using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Domain.Entities.Compensation;

public class SalaryRevision : BaseAuditableEntity
{
    public string RevisionNumber { get; set; } = string.Empty; // E.g., REV-2026-00101
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public decimal CurrentSalary { get; set; }
    public decimal ProposedSalary { get; set; }
    public decimal IncreaseAmount { get; set; }
    public decimal PercentageIncrease { get; set; }
    
    public DateTime EffectiveDate { get; set; }
    public string Reason { get; set; } = string.Empty; // AnnualReview, Promotion, MarketAdjustment, Merit
    public string Comments { get; set; } = string.Empty;
    
    // Draft, Submitted, ManagerApproved, HRApproved, Approved, Rejected, Effective
    public string Status { get; set; } = "Draft";
    
    // Workflow Integration
    public Guid? WorkflowRequestId { get; set; }
    public ApprovalRequest? WorkflowRequest { get; set; }
    
    public string ApproverComments { get; set; } = string.Empty;
    public DateTime? ApprovedAt { get; set; }
}
