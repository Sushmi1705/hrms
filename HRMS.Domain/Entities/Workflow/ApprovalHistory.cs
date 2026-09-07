using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class ApprovalHistory : BaseAuditableEntity
{
    public Guid ApprovalRequestId { get; set; }
    public ApprovalRequest? ApprovalRequest { get; set; }

    public Guid? ApprovalTaskId { get; set; }
    public Guid? WorkflowStepId { get; set; }
    public string StepName { get; set; } = string.Empty;

    public string ActorId { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty; // Submitted, Approved, Rejected, ChangesRequested, Delegated, Reassigned, Escalated, Skipped, Completed, Cancelled
    public string PreviousStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public DateTime ActionDate { get; set; } = DateTime.UtcNow;
    public string MetadataJson { get; set; } = "{}";
}
