using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowDefinition : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty; // E.g., WF-LEAVE-01
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty; // Leave, Attendance, Payroll, Recruitment, Performance, etc.
    public string Category { get; set; } = "General"; // HR, Finance, Operations, Core
    public string Description { get; set; } = string.Empty;
    public int Version { get; set; } = 1;
    public string Status { get; set; } = "Draft"; // Draft, Active, Inactive, Archived
    public string TriggerEvent { get; set; } = "OnSubmit"; // OnSubmit, OnStatusChange, Scheduled, Manual
    public DateTime? PublishedAt { get; set; }
    public string PublishedBy { get; set; } = string.Empty;
    public DateTime? LastUsedAt { get; set; }
    public int UsageCount { get; set; } = 0;
    public string OwnerId { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation Collections
    public ICollection<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    public ICollection<WorkflowVersion> Versions { get; set; } = new List<WorkflowVersion>();
}
