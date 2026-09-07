using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.SystemAdmin.DTOs;

namespace HRMS.Application.Features.SystemAdmin.Queries;

public record GetAdminDashboardQuery() : IRequest<AdminDashboardDto>;

public record GetUsersPagedQuery(
    string? Search,
    string? Role,
    string? Company,
    string? Department,
    string? Status,
    bool? Mfa,
    int Page = 1,
    int PageSize = 10
) : IRequest<PagedResultDto<UserSummaryDto>>;

public record GetUserDetailsQuery(Guid UserId) : IRequest<UserDetailsDto?>;

public record GetRolesQuery() : IRequest<List<RoleDto>>;

public record GetRoleByIdQuery(Guid RoleId) : IRequest<RoleDto?>;

public record GetPermissionsCatalogQuery() : IRequest<List<PermissionDto>>;

public record GetRolePermissionsQuery(Guid RoleId) : IRequest<List<Guid>>;

public record GetFullPermissionMatrixQuery() : IRequest<FullPermissionMatrixResponseDto>;

public record GetUserPermissionsQuery(Guid UserId) : IRequest<List<EffectivePermissionDto>>;

public record GetSettingsQuery(string? Category, Guid? CompanyId, Guid? BranchId) : IRequest<List<SystemSettingDto>>;

public record GetSecurityPolicyQuery() : IRequest<SecurityPolicyDto>;

public record GetEmailConfigurationQuery() : IRequest<EmailConfigurationDto>;

public record GetFeatureFlagsQuery() : IRequest<List<FeatureFlagDto>>;

public record GetHolidayCalendarsQuery(int? Year, Guid? CompanyId) : IRequest<List<HolidayCalendarDto>>;

public record GetHolidayCalendarByIdQuery(Guid Id) : IRequest<HolidayCalendarDto?>;

public record GetActiveSessionsQuery(string? Search, int Page = 1, int PageSize = 10) : IRequest<PagedResultDto<SessionSummaryDto>>;

public record GetBackgroundJobsQuery() : IRequest<List<BackgroundJobDto>>;

public record GetSystemHealthQuery() : IRequest<SystemHealthReportDto>;

public record ExportAdminDataQuery(string ExportType, string Format, string CurrentAdminName, string CurrentAdminIp) : IRequest<byte[]>;

// Query Handlers
public class SystemAdminQueryHandlers :
    IRequestHandler<GetAdminDashboardQuery, AdminDashboardDto>,
    IRequestHandler<GetUsersPagedQuery, PagedResultDto<UserSummaryDto>>,
    IRequestHandler<GetUserDetailsQuery, UserDetailsDto?>,
    IRequestHandler<GetRolesQuery, List<RoleDto>>,
    IRequestHandler<GetRoleByIdQuery, RoleDto?>,
    IRequestHandler<GetPermissionsCatalogQuery, List<PermissionDto>>,
    IRequestHandler<GetRolePermissionsQuery, List<Guid>>,
    IRequestHandler<GetFullPermissionMatrixQuery, FullPermissionMatrixResponseDto>,
    IRequestHandler<GetUserPermissionsQuery, List<EffectivePermissionDto>>,
    IRequestHandler<GetSettingsQuery, List<SystemSettingDto>>,
    IRequestHandler<GetSecurityPolicyQuery, SecurityPolicyDto>,
    IRequestHandler<GetEmailConfigurationQuery, EmailConfigurationDto>,
    IRequestHandler<GetFeatureFlagsQuery, List<FeatureFlagDto>>,
    IRequestHandler<GetHolidayCalendarsQuery, List<HolidayCalendarDto>>,
    IRequestHandler<GetHolidayCalendarByIdQuery, HolidayCalendarDto?>,
    IRequestHandler<GetActiveSessionsQuery, PagedResultDto<SessionSummaryDto>>,
    IRequestHandler<GetBackgroundJobsQuery, List<BackgroundJobDto>>,
    IRequestHandler<GetSystemHealthQuery, SystemHealthReportDto>,
    IRequestHandler<ExportAdminDataQuery, byte[]>
{
    private readonly ISystemAdminRepository _repository;

    public SystemAdminQueryHandlers(ISystemAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<AdminDashboardDto> Handle(GetAdminDashboardQuery request, CancellationToken cancellationToken)
        => _repository.GetDashboardAnalyticsAsync();

    public Task<PagedResultDto<UserSummaryDto>> Handle(GetUsersPagedQuery request, CancellationToken cancellationToken)
        => _repository.GetUsersPagedAsync(request.Search, request.Role, request.Company, request.Department, request.Status, request.Mfa, request.Page, request.PageSize);

    public Task<UserDetailsDto?> Handle(GetUserDetailsQuery request, CancellationToken cancellationToken)
        => _repository.GetUserDetailsAsync(request.UserId);

    public Task<List<RoleDto>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
        => _repository.GetRolesAsync();

    public Task<RoleDto?> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
        => _repository.GetRoleByIdAsync(request.RoleId);

    public Task<List<PermissionDto>> Handle(GetPermissionsCatalogQuery request, CancellationToken cancellationToken)
        => _repository.GetPermissionsCatalogAsync();

    public Task<List<Guid>> Handle(GetRolePermissionsQuery request, CancellationToken cancellationToken)
        => _repository.GetRolePermissionsAsync(request.RoleId);

    public Task<FullPermissionMatrixResponseDto> Handle(GetFullPermissionMatrixQuery request, CancellationToken cancellationToken)
        => _repository.GetFullPermissionMatrixAsync();

    public Task<List<EffectivePermissionDto>> Handle(GetUserPermissionsQuery request, CancellationToken cancellationToken)
        => _repository.GetUserPermissionsAsync(request.UserId);

    public Task<List<SystemSettingDto>> Handle(GetSettingsQuery request, CancellationToken cancellationToken)
        => _repository.GetSettingsAsync(request.Category, request.CompanyId, request.BranchId);

    public Task<SecurityPolicyDto> Handle(GetSecurityPolicyQuery request, CancellationToken cancellationToken)
        => _repository.GetSecurityPolicyAsync();

    public Task<EmailConfigurationDto> Handle(GetEmailConfigurationQuery request, CancellationToken cancellationToken)
        => _repository.GetEmailConfigurationAsync();

    public Task<List<FeatureFlagDto>> Handle(GetFeatureFlagsQuery request, CancellationToken cancellationToken)
        => _repository.GetFeatureFlagsAsync();

    public Task<List<HolidayCalendarDto>> Handle(GetHolidayCalendarsQuery request, CancellationToken cancellationToken)
        => _repository.GetHolidayCalendarsAsync(request.Year, request.CompanyId);

    public Task<HolidayCalendarDto?> Handle(GetHolidayCalendarByIdQuery request, CancellationToken cancellationToken)
        => _repository.GetHolidayCalendarByIdAsync(request.Id);

    public Task<PagedResultDto<SessionSummaryDto>> Handle(GetActiveSessionsQuery request, CancellationToken cancellationToken)
        => _repository.GetActiveSessionsAsync(request.Search, request.Page, request.PageSize);

    public Task<List<BackgroundJobDto>> Handle(GetBackgroundJobsQuery request, CancellationToken cancellationToken)
        => _repository.GetBackgroundJobsAsync();

    public Task<SystemHealthReportDto> Handle(GetSystemHealthQuery request, CancellationToken cancellationToken)
        => _repository.GetSystemHealthAsync();

    public Task<byte[]> Handle(ExportAdminDataQuery request, CancellationToken cancellationToken)
        => _repository.ExportDataAsync(request.ExportType, request.Format, request.CurrentAdminName, request.CurrentAdminIp);
}
