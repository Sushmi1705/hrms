using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.SystemAdmin.DTOs;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public int LockedUsers { get; set; }
    public int AdminUsers { get; set; }
    public int HrUsers { get; set; }
    public int ManagerUsers { get; set; }
    public int EmployeeUsers { get; set; }
    public int ActiveRoles { get; set; }
    public int ActivePermissions { get; set; }
    public int PendingInvitations { get; set; }
    public int SecurityAlertsCount { get; set; }
    
    public List<UserGrowthPointDto> UserGrowth { get; set; } = new();
    public List<LoginActivityPointDto> LoginActivity { get; set; } = new();
    public List<DistributionItemDto> UsersByRole { get; set; } = new();
    public List<DistributionItemDto> UsersByDepartment { get; set; } = new();
    public List<DistributionItemDto> UsersByCompany { get; set; } = new();
    public List<FailedLoginTrendDto> FailedLoginTrends { get; set; } = new();
    public List<PermissionUsageItemDto> PermissionUsage { get; set; } = new();
    public List<AdminActivityLogDto> RecentAdminActivity { get; set; } = new();
}

public class UserGrowthPointDto
{
    public string Period { get; set; } = string.Empty;
    public int UsersCount { get; set; }
    public int ActiveCount { get; set; }
}

public class LoginActivityPointDto
{
    public string Day { get; set; } = string.Empty;
    public int SuccessLogins { get; set; }
    public int FailedLogins { get; set; }
}

public class DistributionItemDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class FailedLoginTrendDto
{
    public string Period { get; set; } = string.Empty;
    public int FailedCount { get; set; }
    public int LockedCount { get; set; }
}

public class PermissionUsageItemDto
{
    public string Module { get; set; } = string.Empty;
    public int TotalPermissions { get; set; }
    public int GrantedCount { get; set; }
}

public class AdminActivityLogDto
{
    public string Id { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string TargetName { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public string PerformedBy { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class UserSummaryDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public Guid? EmployeeEntityId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string BranchName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public bool IsActive { get; set; }
    public bool IsLocked { get; set; }
    public string LockReason { get; set; } = string.Empty;
    public bool RequireMfa { get; set; }
    public bool MfaEnabled { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string LastLoginIp { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UserDetailsDto : UserSummaryDto
{
    public string AvatarUrl { get; set; } = string.Empty;
    public Guid? CompanyId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? DepartmentId { get; set; }
    public string PasswordPolicy { get; set; } = "Standard";
    public bool MustChangePasswordOnNextLogin { get; set; }
    public bool AllowLogin { get; set; } = true;
    public List<RoleAssignmentDto> RoleAssignments { get; set; } = new();
    public List<EffectivePermissionDto> EffectivePermissions { get; set; } = new();
    public List<SessionSummaryDto> ActiveSessions { get; set; } = new();
    public List<UserLoginHistoryDto> LoginHistory { get; set; } = new();
    public List<UserSecurityEventDto> SecurityEvents { get; set; } = new();
    public List<AdminActivityLogDto> AuditActivity { get; set; } = new();
}

public class RoleAssignmentDto
{
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string RoleCode { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
    public DateTime AssignedAt { get; set; }
    public string AssignedBy { get; set; } = string.Empty;
}

public class EffectivePermissionDto
{
    public Guid PermissionId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsGranted { get; set; }
    public string Source { get; set; } = "Role"; // "Role" or "Direct"
    public string RoleSource { get; set; } = string.Empty;
}

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public Guid? EmployeeEntityId { get; set; }
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public List<Guid> RoleIds { get; set; } = new();
    public bool RequireMfa { get; set; }
    public bool MustChangePasswordOnNextLogin { get; set; } = true;
    public string PasswordPolicy { get; set; } = "Standard";
    public bool SendInvitationEmail { get; set; } = true;
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public bool RequireMfa { get; set; }
    public bool AllowLogin { get; set; }
    public string PasswordPolicy { get; set; } = "Standard";
}

public class RoleDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
    public bool IsActive { get; set; }
    public int UserCount { get; set; }
    public int PermissionCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<PermissionDto> Permissions { get; set; } = new();
}

public class CreateRoleDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<Guid> PermissionIds { get; set; } = new();
}

public class UpdateRoleDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public List<Guid> PermissionIds { get; set; } = new();
}

public class PermissionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Feature { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
}

public class PermissionMatrixModuleDto
{
    public string Module { get; set; } = string.Empty;
    public List<PermissionDto> Permissions { get; set; } = new();
}

public class RolePermissionMatrixDto
{
    public Guid RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public List<Guid> GrantedPermissionIds { get; set; } = new();
}

public class FullPermissionMatrixResponseDto
{
    public List<PermissionMatrixModuleDto> Modules { get; set; } = new();
    public List<RolePermissionMatrixDto> Roles { get; set; } = new();
}

public class SessionSummaryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string DeviceType { get; set; } = string.Empty;
    public string Browser { get; set; } = string.Empty;
    public string OperatingSystem { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime LoginAt { get; set; }
    public DateTime LastActivityAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public string RevocationReason { get; set; } = string.Empty;
}

public class UserLoginHistoryDto
{
    public Guid Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string Browser { get; set; } = string.Empty;
    public string Status { get; set; } = "Success"; // Success, Failed
    public string FailureReason { get; set; } = string.Empty;
}

public class UserSecurityEventDto
{
    public Guid Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string EventType { get; set; } = string.Empty; // PasswordChanged, MfaChallenged, AccountLocked, RoleAssigned
    public string Description { get; set; } = string.Empty;
    public string Severity { get; set; } = "Low"; // Low, Medium, High, Critical
    public string IpAddress { get; set; } = string.Empty;
}

public class SystemSettingDto
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string DataType { get; set; } = "string";
    public string Description { get; set; } = string.Empty;
    public string ScopeLevel { get; set; } = "Global";
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public bool IsEncrypted { get; set; }
    public bool IsSystem { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedByName { get; set; } = string.Empty;
}

public class UpdateSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string ScopeLevel { get; set; } = "Global";
    public Guid? CompanyId { get; set; }
    public Guid? BranchId { get; set; }
    public string ChangeReason { get; set; } = "Administrative update";
}

public class SecurityPolicyDto
{
    public Guid Id { get; set; }
    public string PolicyName { get; set; } = string.Empty;
    public int PasswordMinLength { get; set; }
    public bool RequireUppercase { get; set; }
    public bool RequireLowercase { get; set; }
    public bool RequireNumbers { get; set; }
    public bool RequireSpecialChars { get; set; }
    public int PasswordExpirationDays { get; set; }
    public int PasswordHistoryCount { get; set; }
    public int MaxFailedLoginAttempts { get; set; }
    public int AccountLockDurationMinutes { get; set; }
    public int SessionTimeoutMinutes { get; set; }
    public int IdleTimeoutMinutes { get; set; }
    public string MfaRequirement { get; set; } = string.Empty;
    public string ConcurrentSessionLimit { get; set; } = string.Empty;
    public int MaxConcurrentSessions { get; set; }
    public string IpWhitelist { get; set; } = string.Empty;
    public bool ForceLogoutOnPasswordChange { get; set; }
    public bool RememberDeviceAllowed { get; set; }
}

public class EmailConfigurationDto
{
    public Guid Id { get; set; }
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordEncrypted { get; set; } = "************";
    public string SecurityMode { get; set; } = "TLS";
    public string FromName { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string ReplyToEmail { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? LastTestedAt { get; set; }
}

public class SendTestEmailDto
{
    public string RecipientEmail { get; set; } = string.Empty;
}

public class FeatureFlagDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsEnabledGlobally { get; set; }
    public string CompanyOverridesJson { get; set; } = "{}";
}

public class HolidayCalendarDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Year { get; set; }
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public int DaysCount { get; set; }
    public List<HolidayCalendarDayDto> Days { get; set; } = new();
}

public class HolidayCalendarDayDto
{
    public Guid Id { get; set; }
    public Guid HolidayCalendarId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Type { get; set; } = "Public";
    public bool IsRecurring { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class SaveHolidayCalendarDto
{
    public Guid? Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Year { get; set; }
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public List<HolidayCalendarDayDto> Days { get; set; } = new();
}

public class BackgroundJobDto
{
    public Guid Id { get; set; }
    public string JobKey { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CronSchedule { get; set; } = string.Empty;
    public string Status { get; set; } = "Idle";
    public DateTime? LastRunAt { get; set; }
    public DateTime? NextRunAt { get; set; }
    public long LastDurationMs { get; set; }
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public string LastErrorMessage { get; set; } = string.Empty;
}

public class SystemHealthReportDto
{
    public string OverallStatus { get; set; } = "Healthy"; // Healthy, Warning, Critical
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
    public List<ComponentHealthDto> Components { get; set; } = new();
}

public class ComponentHealthDto
{
    public string Name { get; set; } = string.Empty;
    public string ComponentType { get; set; } = string.Empty;
    public string Status { get; set; } = "Healthy";
    public long ResponseTimeMs { get; set; }
    public int ErrorCount { get; set; }
    public string Message { get; set; } = "Operating normally";
    public DateTime LastCheckedAt { get; set; } = DateTime.UtcNow;
}

public class PagedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));
}
