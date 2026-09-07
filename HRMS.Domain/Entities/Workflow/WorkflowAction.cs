using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowAction : BaseAuditableEntity
{
    public Guid WorkflowStepId { get; set; }
    public string ActionType { get; set; } = string.Empty; // Email, SystemUpdate, Webhook, Notification
    public string Template { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = string.Empty;
}
