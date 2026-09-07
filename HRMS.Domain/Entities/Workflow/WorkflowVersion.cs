using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowVersion : BaseAuditableEntity
{
    public Guid WorkflowDefinitionId { get; set; }
    public WorkflowDefinition? WorkflowDefinition { get; set; }
    public int VersionNumber { get; set; }
    public string Status { get; set; } = "Published"; // Draft, Published, Superseded, Archived
    public string SchemaSnapshotJson { get; set; } = string.Empty; // Full JSON snapshot of stages, rules, and conditions
    public string ChangeSummary { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public string PublishedBy { get; set; } = string.Empty;
}
