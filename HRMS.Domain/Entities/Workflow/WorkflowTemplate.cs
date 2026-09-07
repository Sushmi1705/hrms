using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowTemplate : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "FileText";
    public string StructureJson { get; set; } = string.Empty; // Serialized template stages, rules & conditions
    public int UsageCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
