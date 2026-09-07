using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Notification;

public class NotificationRecipient : BaseAuditableEntity
{
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}

public class NotificationVariable : BaseAuditableEntity
{
    public Guid TemplateId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string DefaultValue { get; set; } = string.Empty;
}

public class NotificationBroadcast : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty; // Departments, Roles, All
    public int SentCount { get; set; }
}

public class NotificationAuditLog : BaseAuditableEntity
{
    public Guid NotificationId { get; set; }
    public string Action { get; set; } = string.Empty; // Sent, Opened, Clicked, Failed
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
}

public class NotificationRule : BaseAuditableEntity
{
    public string TriggerEvent { get; set; } = string.Empty; // Leave Approved, Payroll Generated
    public string Condition { get; set; } = string.Empty;
    public string ActionTemplateId { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class ReminderJob : BaseAuditableEntity
{
    public string JobName { get; set; } = string.Empty;
    public string ReminderType { get; set; } = string.Empty; // Birthday, Probation End, Visa Expiry
    public string CronSchedule { get; set; } = string.Empty;
    public DateTime NextRunTime { get; set; }
    public bool IsActive { get; set; }
}
