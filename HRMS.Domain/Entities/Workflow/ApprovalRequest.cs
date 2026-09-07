using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class ApprovalRequest : BaseAuditableEntity
{
    public string RequestNumber { get; set; } = string.Empty; // E.g. REQ-2026-00104
    public Guid WorkflowDefinitionId { get; set; }
    public WorkflowDefinition? WorkflowDefinition { get; set; }
    public Guid? WorkflowVersionId { get; set; }

    public string RequesterId { get; set; } = string.Empty;
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;

    public string Module { get; set; } = string.Empty; // Leave, Attendance, Payroll, Recruitment, etc.
    public string EntityType { get; set; } = string.Empty; // LeaveRequest, AttendanceRegularization, ExpenseClaim, etc.
    public string ReferenceId { get; set; } = string.Empty; // Originating business entity ID

    public string Status { get; set; } = "Pending"; // Draft, Pending, Approved, Rejected, ChangesRequested, Escalated, Cancelled
    public string Priority { get; set; } = "Normal"; // Low, Normal, High, Urgent
    public int CurrentStepIndex { get; set; } = 0;
    public Guid? CurrentStepId { get; set; }
    public string CurrentStepName { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string PayloadJson { get; set; } = "{}"; // Serialized business request parameters (days, dates, comments, line items)

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string SlaStatus { get; set; } = "OnTime"; // OnTime, DueSoon, Overdue, Escalated

    // Collections
    public ICollection<ApprovalTask> Tasks { get; set; } = new List<ApprovalTask>();
    public ICollection<ApprovalHistory> Histories { get; set; } = new List<ApprovalHistory>();
    public ICollection<ApprovalComment> Comments { get; set; } = new List<ApprovalComment>();
}
