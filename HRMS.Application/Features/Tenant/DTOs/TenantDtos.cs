using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Tenant.DTOs;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));
}

public class PlatformDashboardDto
{
    // Metric Cards
    public int TotalTenants { get; set; }
    public int ActiveTenants { get; set; }
    public int TrialTenants { get; set; }
    public int SuspendedTenants { get; set; }
    public int PendingTenants { get; set; }
    public int ExpiredTenants { get; set; }
    public int TotalPlatformUsers { get; set; }
    public int ActivePlatformUsers { get; set; }
    public double TotalStorageUsedGb { get; set; }
    public decimal MonthlyRecurringRevenue { get; set; }
    public decimal AnnualRunRate { get; set; }
    public int FailedPaymentsCount { get; set; }
    public double TrialConversionRate { get; set; }
    public double ChurnRate { get; set; }

    // Chart Series
    public List<TenantGrowthPointDto> TenantGrowth { get; set; } = new();
    public List<RevenueTrendPointDto> RevenueTrend { get; set; } = new();
    public List<PlanDistributionDto> TenantsByPlan { get; set; } = new();
    public List<IndustryDistributionDto> TenantsByIndustry { get; set; } = new();
    public List<StorageUsagePointDto> StorageByTenant { get; set; } = new();
    public List<SaaSActivityFeedItemDto> RecentActivity { get; set; } = new();
}

public class TenantGrowthPointDto
{
    public string Period { get; set; } = string.Empty;
    public int TotalTenants { get; set; }
    public int ActiveTenants { get; set; }
    public int NewTenants { get; set; }
}

public class RevenueTrendPointDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Mrr { get; set; }
    public decimal Subscriptions { get; set; }
}

public class PlanDistributionDto
{
    public string PlanName { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
    public decimal MonthlyRevenue { get; set; }
}

public class IndustryDistributionDto
{
    public string Industry { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class StorageUsagePointDto
{
    public string TenantName { get; set; } = string.Empty;
    public double UsedMb { get; set; }
    public double QuotaMb { get; set; }
    public double Percentage { get; set; }
}

public class SaaSActivityFeedItemDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Severity { get; set; } = "Info"; // Info, Warning, Success, Danger
}

public class TenantSummaryDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string? SuspensionReason { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
    public bool DomainVerified { get; set; }
    public string PlanName { get; set; } = "Starter";
    public string PlanCode { get; set; } = "Starter";
    public string BillingCycle { get; set; } = "Monthly";
    public decimal PlanPrice { get; set; }
    public int CurrentUsersCount { get; set; }
    public int MaxUsers { get; set; }
    public int CurrentEmployeesCount { get; set; }
    public int MaxEmployees { get; set; }
    public double StorageUsedMb { get; set; }
    public int StorageQuotaGb { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? TrialEndsAt { get; set; }
    public DateTime? SubscriptionEndsAt { get; set; }
}

public class TenantDetailsDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string? SuspensionReason { get; set; }
    public DateTime? SuspendedAt { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string PrimaryColor { get; set; } = "#6366f1";
    public string? CustomDomain { get; set; }
    public bool DomainVerified { get; set; }
    public string SslStatus { get; set; } = "Pending";
    public int MaxUsers { get; set; }
    public int MaxEmployees { get; set; }
    public int StorageQuotaGb { get; set; }
    public double StorageUsedMb { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? TrialEndsAt { get; set; }
    public DateTime? SubscriptionEndsAt { get; set; }
    public DateTime? DeletionGracePeriodEndsAt { get; set; }

    // Active Subscription
    public TenantSubscriptionDto? CurrentSubscription { get; set; }
    
    // Limits & Usage
    public TenantUsageDto Usage { get; set; } = new();

    // Module Overrides
    public List<TenantFeatureOverrideDto> FeatureOverrides { get; set; } = new();

    // Settings
    public List<TenantSettingDto> Settings { get; set; } = new();

    // Domains
    public List<TenantDomainDto> Domains { get; set; } = new();

    // Users
    public List<TenantUserItemDto> Users { get; set; } = new();

    // Security Policy
    public TenantSecurityPolicyDto? SecurityPolicy { get; set; }
}

public class TenantSubscriptionDto
{
    public Guid Id { get; set; }
    public Guid PlanId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string PlanCode { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string BillingCycle { get; set; } = "Monthly";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public DateTime StartedAt { get; set; }
    public DateTime CurrentPeriodStart { get; set; }
    public DateTime CurrentPeriodEnd { get; set; }
    public DateTime? TrialStart { get; set; }
    public DateTime? TrialEnd { get; set; }
    public bool AutoRenew { get; set; }
    public string PaymentMethodStatus { get; set; } = "Active";
    public DateTime? NextBillingAt { get; set; }
}

public class TenantUsageDto
{
    public int UsersCount { get; set; }
    public int MaxUsers { get; set; }
    public double UsersPercentage => MaxUsers > 0 ? Math.Round((double)UsersCount / MaxUsers * 100, 1) : 0;

    public int EmployeesCount { get; set; }
    public int MaxEmployees { get; set; }
    public double EmployeesPercentage => MaxEmployees > 0 ? Math.Round((double)EmployeesCount / MaxEmployees * 100, 1) : 0;

    public double StorageUsedMb { get; set; }
    public int StorageQuotaGb { get; set; }
    public double StoragePercentage => StorageQuotaGb > 0 ? Math.Round((StorageUsedMb / (StorageQuotaGb * 1024)) * 100, 1) : 0;

    public int AttendanceRecordsCount { get; set; }
    public int LeaveRequestsCount { get; set; }
    public int PayrollRunsCount { get; set; }
    public int WorkflowsCount { get; set; }
    public int NotificationsSent { get; set; }
    public int ApiRequestsCount { get; set; }
    public string HealthStatus { get; set; } = "Healthy"; // Healthy, Warning, NearLimit, LimitExceeded
}

public class TenantFeatureOverrideDto
{
    public Guid Id { get; set; }
    public string FeatureKey { get; set; } = string.Empty;
    public string FeatureName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? ChangedByAdmin { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class TenantSettingDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "string";
    public bool IsEncrypted { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class TenantDomainDto
{
    public Guid Id { get; set; }
    public string Domain { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public string VerificationStatus { get; set; } = "Pending";
    public string VerificationToken { get; set; } = string.Empty;
    public string SslStatus { get; set; } = "Pending";
    public DateTime? VerifiedAt { get; set; }
}

public class TenantUserItemDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsLocked { get; set; }
    public bool MfaEnabled { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TenantSecurityPolicyDto
{
    public int PasswordMinLength { get; set; } = 8;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireNumbers { get; set; } = true;
    public bool RequireSpecialChars { get; set; } = true;
    public string MfaRequirement { get; set; } = "Optional";
    public int SessionTimeoutMinutes { get; set; } = 60;
    public int MaxFailedAttempts { get; set; } = 5;
    public int LockoutMinutes { get; set; } = 30;
    public string? IpWhitelist { get; set; }
}

public class SubscriptionPlanDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public decimal AnnualPrice { get; set; }
    public string Currency { get; set; } = "USD";
    public int MaxUsers { get; set; }
    public int MaxEmployees { get; set; }
    public int StorageGb { get; set; }
    public string BillingCycle { get; set; } = "Monthly";
    public List<string> Features { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public bool IsPopular { get; set; } = false;
    public string SupportTier { get; set; } = "Standard";
    public int ActiveSubscribersCount { get; set; }
}

public class CreateTenantDto
{
    public string OrganizationName { get; set; } = string.Empty;
    public string TenantCode { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = "Technology";
    public string Country { get; set; } = "United States";
    public string Currency { get; set; } = "USD";
    public string TimeZone { get; set; } = "America/New_York";
    public string Language { get; set; } = "en";
    
    // Contact
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;

    // Subscription & Plan
    public string SubscriptionPlanCode { get; set; } = "Starter";
    public string BillingCycle { get; set; } = "Monthly";
    public int TrialDays { get; set; } = 14;

    // Initial Admin Account
    public string AdminFullName { get; set; } = string.Empty;
    public string AdminUsername { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminPassword { get; set; } = string.Empty;
}

public class UpdateTenantDto
{
    public string Name { get; set; } = string.Empty;
    public string LegalName { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? CustomDomain { get; set; }
    public string PrimaryColor { get; set; } = "#6366f1";
    public int MaxUsers { get; set; }
    public int MaxEmployees { get; set; }
    public int StorageQuotaGb { get; set; }
}

public class SuspendTenantDto
{
    public string Reason { get; set; } = string.Empty;
}

public class ChangeTenantPlanDto
{
    public string NewPlanCode { get; set; } = string.Empty;
    public string BillingCycle { get; set; } = "Monthly";
    public string ChangeReason { get; set; } = string.Empty;
}

public class UpdateFeatureOverrideDto
{
    public string FeatureKey { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class StartImpersonationDto
{
    public Guid TenantId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class ImpersonationSessionDto
{
    public Guid LogId { get; set; }
    public Guid TenantId { get; set; }
    public string TenantCode { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public string ImpersonatedToken { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
