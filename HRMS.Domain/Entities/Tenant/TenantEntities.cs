using System;
using System.Collections.Generic;
using HRMS.Domain.Common;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Tenant;

public class Tenant : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Country { get; set; } = "United States";
    public string Currency { get; set; } = "USD";
    public string TimeZone { get; set; } = "UTC";
    public string Language { get; set; } = "en";
    
    // Status: Trial, Active, Suspended, Pending, Expired, Cancelled
    public string Status { get; set; } = "Active";
    public string? SuspensionReason { get; set; }
    public DateTime? SuspendedAt { get; set; }

    // Primary Contact
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;

    // Lifecycle
    public DateTime? TrialEndsAt { get; set; }
    public DateTime? SubscriptionEndsAt { get; set; }
    public DateTime? DeletionGracePeriodEndsAt { get; set; }

    // White-Label & Custom Domain
    public string? LogoUrl { get; set; }
    public string PrimaryColor { get; set; } = "#6366f1";
    public string? CustomDomain { get; set; }
    public bool DomainVerified { get; set; } = false;
    public string SslStatus { get; set; } = "Pending";

    // Quotas & Limits
    public int MaxUsers { get; set; } = 25;
    public int MaxEmployees { get; set; } = 100;
    public int StorageQuotaGb { get; set; } = 10;
    public double StorageUsedMb { get; set; } = 0;

    // Navigation Properties
    public ICollection<TenantSubscription> Subscriptions { get; set; } = new List<TenantSubscription>();
    public ICollection<TenantSetting> Settings { get; set; } = new List<TenantSetting>();
    public ICollection<TenantDomain> Domains { get; set; } = new List<TenantDomain>();
    public ICollection<TenantFeatureOverride> FeatureOverrides { get; set; } = new List<TenantFeatureOverride>();
    public ICollection<TenantUsageSnapshot> UsageSnapshots { get; set; } = new List<TenantUsageSnapshot>();
}

public class SubscriptionPlan : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty; // Free, Starter, Professional, Business, Enterprise, Custom
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; } = 0;
    public decimal AnnualPrice { get; set; } = 0;
    public string Currency { get; set; } = "USD";
    public int MaxUsers { get; set; } = 25;
    public int MaxEmployees { get; set; } = 100;
    public int StorageGb { get; set; } = 10;
    public string BillingCycle { get; set; } = "Monthly"; // Monthly, Annual, Custom
    public string FeaturesJson { get; set; } = "[]";
    public bool IsActive { get; set; } = true;
    public bool IsPopular { get; set; } = false;
    public string SupportTier { get; set; } = "Standard"; // Community, Standard, Priority, 24/7 Dedicated
    
    public ICollection<PlanFeature> PlanFeatures { get; set; } = new List<PlanFeature>();
    public ICollection<TenantSubscription> Subscriptions { get; set; } = new List<TenantSubscription>();
}

public class TenantSubscription : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public Guid PlanId { get; set; }
    public SubscriptionPlan? Plan { get; set; }

    // Status: Active, PastDue, Cancelled, Trialing, Expired
    public string Status { get; set; } = "Active";
    public string BillingCycle { get; set; } = "Monthly"; // Monthly, Annual
    public decimal Amount { get; set; } = 0;
    public string Currency { get; set; } = "USD";

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime CurrentPeriodStart { get; set; } = DateTime.UtcNow;
    public DateTime CurrentPeriodEnd { get; set; } = DateTime.UtcNow.AddMonths(1);
    public DateTime? TrialStart { get; set; }
    public DateTime? TrialEnd { get; set; }
    public bool AutoRenew { get; set; } = true;
    public string PaymentMethodStatus { get; set; } = "Active"; // Active, Failed, Expired, None
    public DateTime? NextBillingAt { get; set; }
}

public class PlanFeature : BaseAuditableEntity
{
    public Guid PlanId { get; set; }
    public SubscriptionPlan? Plan { get; set; }

    public string FeatureKey { get; set; } = string.Empty; // Employees, Attendance, Leave, Payroll, Recruitment, Onboarding, Offboarding, Performance, LMS, Workflow, Notifications, Documents, Assets, Expenses, Reports, ESS, MSS, AIAssistant
    public string FeatureName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string? QuotaValue { get; set; } // e.g. "Unlimited" or "100"
}

public class TenantFeatureOverride : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public string FeatureKey { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string Reason { get; set; } = string.Empty;
    public string? ChangedByAdmin { get; set; }
}

public class TenantSetting : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public string Category { get; set; } = "General"; // General, HR, Security, Notification, Branding
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "string"; // string, number, boolean, json
    public bool IsEncrypted { get; set; } = false;
    public string Description { get; set; } = string.Empty;
}

public class TenantDomain : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public string Domain { get; set; } = string.Empty; // e.g. "hr.techcorp.com" or "techcorp.anraone.com"
    public bool IsPrimary { get; set; } = false;
    public string VerificationStatus { get; set; } = "Pending"; // Verified, Pending, Failed
    public string VerificationToken { get; set; } = string.Empty;
    public string SslStatus { get; set; } = "Pending"; // Active, Pending, Failed
    public DateTime? VerifiedAt { get; set; }
}

public class TenantUsageSnapshot : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;
    public int UsersCount { get; set; } = 0;
    public int ActiveUsersCount { get; set; } = 0;
    public int EmployeesCount { get; set; } = 0;
    public double StorageUsedMb { get; set; } = 0;
    public int AttendanceRecordsCount { get; set; } = 0;
    public int LeaveRequestsCount { get; set; } = 0;
    public int PayrollRunsCount { get; set; } = 0;
    public int WorkflowsCount { get; set; } = 0;
    public int ApiRequestsCount { get; set; } = 0;
    public int NotificationsSent { get; set; } = 0;
}

public class TenantImpersonationLog : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public Guid PlatformAdminUserId { get; set; }
    public string PlatformAdminEmail { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string? ActionsPerformed { get; set; }
}

public class TenantDeletionRequest : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public string RequestedBy { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public int GracePeriodDays { get; set; } = 30;
    public DateTime ScheduledDeletionAt { get; set; } = DateTime.UtcNow.AddDays(30);
    public bool IsCancelled { get; set; } = false;
    public string? CancellationReason { get; set; }
    public bool IsExecuted { get; set; } = false;
    public DateTime? ExecutedAt { get; set; }
}

public class TenantSecurityPolicy : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public int PasswordMinLength { get; set; } = 8;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireNumbers { get; set; } = true;
    public bool RequireSpecialChars { get; set; } = true;
    public string MfaRequirement { get; set; } = "Optional"; // None, Optional, AdminsOnly, AllUsers
    public int SessionTimeoutMinutes { get; set; } = 60;
    public int MaxFailedAttempts { get; set; } = 5;
    public int LockoutMinutes { get; set; } = 30;
    public string? IpWhitelist { get; set; }
}

public class TenantBranding : BaseAuditableEntity
{
    public Tenant? Tenant { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string PrimaryColor { get; set; } = "#6366f1";
    public string SecondaryColor { get; set; } = "#8b5cf6";
    public string? LoginBannerUrl { get; set; }
    public string? CustomCss { get; set; }
}
