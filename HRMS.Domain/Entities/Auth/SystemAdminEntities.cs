using System;
using System.Collections.Generic;

namespace HRMS.Domain.Entities.Auth;

public class AppPermission : BaseEntity
{
    public string Code { get; set; } = null!; // e.g. Employees.View, Attendance.Approve, Payroll.Export
    public string Module { get; set; } = null!; // Employees, Attendance, Leave, Payroll, etc.
    public string Feature { get; set; } = string.Empty; // Profiles, Timesheet, SalarySlip, etc.
    public string Action { get; set; } = null!; // View, Create, Edit, Delete, Approve, Reject, Export, Configure, Manage
    public string Name { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public bool IsSystem { get; set; } = true;

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    public ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
}

public class RolePermission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public Guid PermissionId { get; set; }
    public AppPermission Permission { get; set; } = null!;
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public string GrantedBy { get; set; } = "System Administrator";
}

public class UserPermission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid PermissionId { get; set; }
    public AppPermission Permission { get; set; } = null!;
    public bool IsGranted { get; set; } = true; // true = Explicit Direct Grant, false = Explicit Revoke / Deny Override
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
    public string GrantedBy { get; set; } = "System Administrator";
    public string Reason { get; set; } = "Special delegated authority";
}

public class SystemSetting : BaseEntity
{
    public string Category { get; set; } = "General"; // General, Organization, Localization, Security, Authentication, Email, Notifications, Attendance, Leave, Payroll, Workflow, Documents, Audit, Integrations
    public string Key { get; set; } = null!;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "string"; // string, number, boolean, json, encrypted
    public string Description { get; set; } = string.Empty;
    public string ScopeLevel { get; set; } = "Global"; // Global, Company, BusinessUnit, Branch
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BusinessUnitId { get; set; }
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public bool IsEncrypted { get; set; }
    public bool IsSystem { get; set; }
}

public class SecurityPolicy : BaseEntity
{
    public string PolicyName { get; set; } = "Default Enterprise Security Policy";
    public int PasswordMinLength { get; set; } = 8;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireLowercase { get; set; } = true;
    public bool RequireNumbers { get; set; } = true;
    public bool RequireSpecialChars { get; set; } = true;
    public int PasswordExpirationDays { get; set; } = 90;
    public int PasswordHistoryCount { get; set; } = 5;
    public int MaxFailedLoginAttempts { get; set; } = 5;
    public int AccountLockDurationMinutes { get; set; } = 30;
    public int SessionTimeoutMinutes { get; set; } = 60;
    public int IdleTimeoutMinutes { get; set; } = 15;
    public string MfaRequirement { get; set; } = "Optional"; // None, Optional, AdminsOnly, AllUsers
    public string ConcurrentSessionLimit { get; set; } = "MultiLimit"; // Single, MultiLimit, Unlimited
    public int MaxConcurrentSessions { get; set; } = 3;
    public string IpWhitelist { get; set; } = string.Empty;
    public bool ForceLogoutOnPasswordChange { get; set; } = true;
    public bool RememberDeviceAllowed { get; set; } = true;
}

public class EmailConfiguration : BaseEntity
{
    public string SmtpHost { get; set; } = "smtp.office365.com";
    public int SmtpPort { get; set; } = 587;
    public string Username { get; set; } = "notifications@anraone.com";
    public string PasswordEncrypted { get; set; } = "ENC_SMTP_SECRET_KEY";
    public string SecurityMode { get; set; } = "TLS"; // None, SSL, TLS
    public string FromName { get; set; } = "AnraOne HRMS Enterprise";
    public string FromEmail { get; set; } = "notifications@anraone.com";
    public string ReplyToEmail { get; set; } = "support@anraone.com";
    public bool IsDefault { get; set; } = true;
    public string Status { get; set; } = "Verified"; // Configured, Unverified, Verified
    public DateTime? LastTestedAt { get; set; } = DateTime.UtcNow;
}

public class FeatureFlag : BaseEntity
{
    public string Key { get; set; } = null!; // Attendance, Leave, Payroll, Recruitment, Performance, Learning, Assets, Expenses, Documents, Notifications, Workflow, Reports, AIAssistant
    public string Name { get; set; } = null!;
    public string Module { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public bool IsEnabledGlobally { get; set; } = true;
    public string CompanyOverridesJson { get; set; } = "{}"; // JSON map of CompanyId => boolean
}

public class HolidayCalendar : BaseEntity
{
    public string Code { get; set; } = "CAL-GLOBAL";
    public string Name { get; set; } = "Global Corporate Holiday Calendar";
    public string Description { get; set; } = "Corporate standard public and federal holidays";
    public int Year { get; set; } = DateTime.UtcNow.Year;
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = "All Companies";
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = "All Branches";
    public bool IsDefault { get; set; } = true;

    public ICollection<HolidayCalendarDay> Days { get; set; } = new List<HolidayCalendarDay>();
}

public class HolidayCalendarDay
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HolidayCalendarId { get; set; }
    public HolidayCalendar HolidayCalendar { get; set; } = null!;
    public string Name { get; set; } = null!;
    public DateTime Date { get; set; }
    public string Type { get; set; } = "Public"; // Public, Company, Regional, Optional
    public bool IsRecurring { get; set; } = true;
    public string Description { get; set; } = string.Empty;
}

public class BackgroundJobInfo : BaseEntity
{
    public string JobKey { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Category { get; set; } = "System"; // Workflow, Notification, Audit, Payroll, Cleanup, Reports
    public string Description { get; set; } = string.Empty;
    public string CronSchedule { get; set; } = "0 * * * *"; // Every hour
    public string Status { get; set; } = "Idle"; // Idle, Running, Paused, Completed, Failed
    public DateTime? LastRunAt { get; set; }
    public DateTime? NextRunAt { get; set; }
    public long LastDurationMs { get; set; }
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public string LastErrorMessage { get; set; } = string.Empty;
}
