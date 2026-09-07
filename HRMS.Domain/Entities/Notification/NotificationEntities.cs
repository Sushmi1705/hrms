using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Notification;

public class Notification : BaseAuditableEntity
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Information, Success, Warning, Error, Approval, etc.
    public string Module { get; set; } = string.Empty; // Leave, Payroll, etc.
    public bool IsRead { get; set; }
    public bool IsStarred { get; set; }
    public bool IsArchived { get; set; }
    public bool IsPinned { get; set; }
    public string ActionUrl { get; set; } = string.Empty;
}

public class NotificationTemplate : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Variables { get; set; } = string.Empty; // JSON
    public bool IsActive { get; set; }
}

public class EmailTemplate : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string HtmlBody { get; set; } = string.Empty;
    public string TextBody { get; set; } = string.Empty;
}

public class SmsTemplate : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}

public class PushTemplate : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
}

public class NotificationQueue : BaseAuditableEntity
{
    public Guid UserId { get; set; }
    public string Channel { get; set; } = string.Empty; // Email, SMS, Push
    public string Payload { get; set; } = string.Empty; // JSON
    public string Status { get; set; } = string.Empty; // Queued, Processing, Failed
    public int RetryCount { get; set; }
}

public class DeliveryLog : BaseAuditableEntity
{
    public Guid NotificationQueueId { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string Recipient { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Delivered, Failed
    public string ProviderResponse { get; set; } = string.Empty;
    public DateTime? DeliveryTime { get; set; }
}

public class Announcement : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = string.Empty; // Company, Department, Role
    public DateTime? ExpiryDate { get; set; }
    public bool IsPinned { get; set; }
}

public class UserNotificationPreference : BaseAuditableEntity
{
    public Guid UserId { get; set; }
    public bool EmailEnabled { get; set; }
    public bool SmsEnabled { get; set; }
    public bool PushEnabled { get; set; }
    public bool InAppEnabled { get; set; }
    public bool DoNotDisturb { get; set; }
}

public class ScheduledNotification : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string CronExpression { get; set; } = string.Empty;
    public DateTime NextRunTime { get; set; }
    public bool IsActive { get; set; }
}

public class NotificationChannel : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string ProviderUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class NotificationSetting : BaseAuditableEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
