using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Audit;

public class AuditLog : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    
    public string Module { get; set; } = string.Empty;
    public string Entity { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Create, Update, Delete, View, Login, Export
    public string Category { get; set; } = string.Empty; // Security, System, Data
    public string Severity { get; set; } = string.Empty; // Info, Warning, Critical
    
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string Browser { get; set; } = string.Empty;
    public string OperatingSystem { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    
    public string Endpoint { get; set; } = string.Empty;
    public string HttpMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Success, Failed
    public string FailureReason { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public long ExecutionTimeMs { get; set; }
    
    public string CorrelationId { get; set; } = string.Empty;
    public string RequestId { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    
    public string RequestPayload { get; set; } = string.Empty; // Masked JSON
    public string ResponsePayload { get; set; } = string.Empty; // Masked JSON
    public string Headers { get; set; } = string.Empty; // Masked JSON
}

public class AuditChange : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public Guid AuditLogId { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string PrimaryKey { get; set; } = string.Empty;
    public string PropertyName { get; set; } = string.Empty;
    public string OldValue { get; set; } = string.Empty;
    public string NewValue { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class AuditLogin : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;

    public string IpAddress { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Latitude { get; set; } = string.Empty;
    public string Longitude { get; set; } = string.Empty;
    public string ISP { get; set; } = string.Empty;

    public string Browser { get; set; } = string.Empty;
    public string OperatingSystem { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    
    public string LoginMethod { get; set; } = string.Empty; // Password, Google, Azure AD, SSO, MFA
    
    public string Status { get; set; } = string.Empty; // Success, Failed, Locked
    public DateTime? LogoutTime { get; set; }
    public long SessionDurationSeconds { get; set; }
}

public class AuditSecurityEvent : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string EventType { get; set; } = string.Empty; // Unauthorized Access, Password Reset, Privilege Escalation
    public string Description { get; set; } = string.Empty;
    public string IncidentDetails { get; set; } = string.Empty; // Deep trace
    public string IpAddress { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty; // High, Critical
    
    public string AssignedTo { get; set; } = string.Empty;
    public string ResolutionNotes { get; set; } = string.Empty;
    public string Status { get; set; } = "Open"; // Open, Resolved
}

public class AuditExport : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Module { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty; // CSV, PDF, Excel
    public int RecordCount { get; set; }
}

public class AuditSetting : BaseAuditableEntity
{
    public string TenantId { get; set; } = string.Empty;
    public int SystemLogRetentionDays { get; set; } = 180;
    public int SecurityEventRetentionDays { get; set; } = 365;
    public int DataDiffRetentionDays { get; set; } = 90;
    public bool MaskSensitiveData { get; set; } = true;
    public string IgnoredFields { get; set; } = "Password,Token,Secret";
}

