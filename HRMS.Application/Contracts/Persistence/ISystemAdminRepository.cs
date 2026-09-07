using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.SystemAdmin.DTOs;
using HRMS.Domain.Entities.Auth;

namespace HRMS.Application.Contracts.Persistence;

public interface ISystemAdminRepository
{
    // 1. Dashboard
    Task<AdminDashboardDto> GetDashboardAnalyticsAsync();

    // 2. User Management
    Task<PagedResultDto<UserSummaryDto>> GetUsersPagedAsync(string? search, string? role, string? company, string? department, string? status, bool? mfa, int page, int pageSize);
    Task<UserDetailsDto?> GetUserDetailsAsync(Guid userId);
    Task<UserSummaryDto> CreateUserAsync(CreateUserDto dto, string currentAdminName, string currentAdminIp);
    Task<UserSummaryDto> UpdateUserAsync(Guid userId, UpdateUserDto dto, string currentAdminName, string currentAdminIp);
    Task<bool> DeleteUserAsync(Guid userId, string currentAdminName, string currentAdminIp);
    Task<bool> ActivateUserAsync(Guid userId, string currentAdminName, string currentAdminIp);
    Task<bool> DeactivateUserAsync(Guid userId, string currentAdminName, string currentAdminIp);
    Task<bool> LockUserAsync(Guid userId, string reason, string currentAdminName, string currentAdminIp);
    Task<bool> UnlockUserAsync(Guid userId, string currentAdminName, string currentAdminIp);
    Task<string> ResetUserPasswordAsync(Guid userId, string? customPassword, string currentAdminName, string currentAdminIp);
    Task<bool> ForceLogoutUserAsync(Guid userId, string currentAdminName, string currentAdminIp);
    Task<List<RoleAssignmentDto>> GetUserRolesAsync(Guid userId);
    Task<bool> UpdateUserRolesAsync(Guid userId, List<Guid> roleIds, string currentAdminName, string currentAdminIp);
    Task<List<EffectivePermissionDto>> GetUserPermissionsAsync(Guid userId);
    Task<bool> UpdateUserDirectPermissionAsync(Guid userId, Guid permissionId, bool isGranted, string reason, string currentAdminName, string currentAdminIp);

    // 3. Roles & Permissions
    Task<List<RoleDto>> GetRolesAsync();
    Task<RoleDto?> GetRoleByIdAsync(Guid roleId);
    Task<RoleDto> CreateRoleAsync(CreateRoleDto dto, string currentAdminName, string currentAdminIp);
    Task<RoleDto> UpdateRoleAsync(Guid roleId, UpdateRoleDto dto, string currentAdminName, string currentAdminIp);
    Task<bool> DeleteRoleAsync(Guid roleId, string currentAdminName, string currentAdminIp);
    Task<RoleDto> DuplicateRoleAsync(Guid roleId, string currentAdminName, string currentAdminIp);
    Task<List<PermissionDto>> GetPermissionsCatalogAsync();
    Task<List<Guid>> GetRolePermissionsAsync(Guid roleId);
    Task<bool> UpdateRolePermissionsAsync(Guid roleId, List<Guid> permissionIds, string currentAdminName, string currentAdminIp);
    Task<FullPermissionMatrixResponseDto> GetFullPermissionMatrixAsync();

    // 4. Settings & Hierarchy
    Task<List<SystemSettingDto>> GetSettingsAsync(string? category, Guid? companyId, Guid? branchId);
    Task<bool> UpdateSettingAsync(UpdateSettingDto dto, string currentAdminName, string currentAdminIp);
    Task<SecurityPolicyDto> GetSecurityPolicyAsync();
    Task<SecurityPolicyDto> UpdateSecurityPolicyAsync(SecurityPolicyDto dto, string currentAdminName, string currentAdminIp);
    Task<EmailConfigurationDto> GetEmailConfigurationAsync();
    Task<EmailConfigurationDto> UpdateEmailConfigurationAsync(EmailConfigurationDto dto, string currentAdminName, string currentAdminIp);
    Task<bool> TestEmailConnectionAsync();
    Task<bool> SendTestEmailAsync(string recipientEmail, string currentAdminName, string currentAdminIp);

    // 5. Feature Flags
    Task<List<FeatureFlagDto>> GetFeatureFlagsAsync();
    Task<bool> UpdateFeatureFlagAsync(string key, bool isEnabledGlobally, string? companyOverridesJson, string currentAdminName, string currentAdminIp);

    // 6. Holiday Calendars
    Task<List<HolidayCalendarDto>> GetHolidayCalendarsAsync(int? year, Guid? companyId);
    Task<HolidayCalendarDto?> GetHolidayCalendarByIdAsync(Guid id);
    Task<HolidayCalendarDto> SaveHolidayCalendarAsync(SaveHolidayCalendarDto dto, string currentAdminName, string currentAdminIp);
    Task<bool> DeleteHolidayCalendarAsync(Guid id, string currentAdminName, string currentAdminIp);

    // 7. Sessions
    Task<PagedResultDto<SessionSummaryDto>> GetActiveSessionsAsync(string? search, int page, int pageSize);
    Task<bool> RevokeSessionAsync(Guid sessionId, string reason, string currentAdminName, string currentAdminIp);
    Task<int> RevokeAllSessionsAsync(Guid? userIdExcept, string reason, string currentAdminName, string currentAdminIp);

    // 8. Background Jobs
    Task<List<BackgroundJobDto>> GetBackgroundJobsAsync();
    Task<bool> TriggerJobNowAsync(string jobKey, string currentAdminName, string currentAdminIp);
    Task<bool> ToggleJobPauseAsync(string jobKey, string currentAdminName, string currentAdminIp);

    // 9. System Health
    Task<SystemHealthReportDto> GetSystemHealthAsync();

    // 10. Data Export
    Task<byte[]> ExportDataAsync(string exportType, string format, string currentAdminName, string currentAdminIp);
}
