using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class EscalationRule : BaseAuditableEntity
{
    public Guid WorkflowStepId { get; set; }
    public int SlaHours { get; set; }
    public string EscalateToRoleId { get; set; } = string.Empty;
    public string EscalateToUserId { get; set; } = string.Empty;
    public int ReminderFrequencyHours { get; set; }
    public bool AutoApproveOnSlaBreach { get; set; } = false;
}
