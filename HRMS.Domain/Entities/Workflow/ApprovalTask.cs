using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class ApprovalTask : BaseAuditableEntity
{
    public Guid ApprovalRequestId { get; set; }
    public ApprovalRequest? ApprovalRequest { get; set; }

    public Guid WorkflowStepId { get; set; }
    public string StepKey { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public int OrderIndex { get; set; }

    public string ApproverType { get; set; } = string.Empty; // Manager, HR, Finance, Role, User
    public string AssignedUserId { get; set; } = string.Empty;
    public string AssignedUserName { get; set; } = string.Empty;
    public string AssignedUserEmail { get; set; } = string.Empty;
    public string AssignedRoleId { get; set; } = string.Empty;
    public string AssignedRoleName { get; set; } = string.Empty;
    public string AssignedDepartmentId { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, ChangesRequested, Delegated, Reassigned, Escalated, Skipped
    public DateTime? DueDate { get; set; }
    public string SlaStatus { get; set; } = "OnTime"; // OnTime, DueSoon, Overdue, Escalated
    public int EscalationCount { get; set; } = 0;

    public DateTime? StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string ActionTaken { get; set; } = string.Empty;
    public string ActionTakenByUserId { get; set; } = string.Empty;
    public string ActionTakenByName { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;

    public bool IsDelegated { get; set; } = false;
    public string OriginalApproverId { get; set; } = string.Empty;
    public string OriginalApproverName { get; set; } = string.Empty;
}
