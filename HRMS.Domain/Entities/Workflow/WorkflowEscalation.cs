using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowEscalation : BaseAuditableEntity
{
    public Guid ApprovalRequestId { get; set; }
    public ApprovalRequest? ApprovalRequest { get; set; }

    public Guid ApprovalTaskId { get; set; }
    public ApprovalTask? ApprovalTask { get; set; }

    public string OriginalApproverId { get; set; } = string.Empty;
    public string OriginalApproverName { get; set; } = string.Empty;

    public string EscalatedToUserId { get; set; } = string.Empty;
    public string EscalatedToUserName { get; set; } = string.Empty;
    public string EscalatedToRole { get; set; } = string.Empty;

    public int EscalationLevel { get; set; } = 1; // 1, 2, 3
    public string Reason { get; set; } = string.Empty; // SLA breach, Manual escalation, Inactivity
    public DateTime EscalatedAt { get; set; } = DateTime.UtcNow;
    public int SlaBreachHours { get; set; } = 0;
    public bool IsResolved { get; set; } = false;
}
