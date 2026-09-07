using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowLog : BaseAuditableEntity
{
    public Guid? ApprovalRequestId { get; set; }
    public string LogLevel { get; set; } = "Info"; // Info, Warning, Error
    public string Message { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = string.Empty;
}
