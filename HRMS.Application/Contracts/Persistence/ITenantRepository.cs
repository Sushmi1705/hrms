using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Tenant.DTOs;

namespace HRMS.Application.Contracts.Persistence;

public interface ITenantRepository
{
    Task<PlatformDashboardDto> GetPlatformDashboardAsync();
    Task<PagedResult<TenantSummaryDto>> GetTenantsPagedAsync(string? search, string? status, string? plan, string? country, int page, int pageSize);
    Task<TenantDetailsDto?> GetTenantByIdAsync(Guid id);
    Task<TenantDetailsDto> CreateTenantAsync(CreateTenantDto dto, string createdBy);
    Task<TenantDetailsDto> UpdateTenantAsync(Guid id, UpdateTenantDto dto, string updatedBy);
    Task<bool> ActivateTenantAsync(Guid id, string activatedBy);
    Task<bool> SuspendTenantAsync(Guid id, string reason, string suspendedBy);
    Task<bool> ReactivateTenantAsync(Guid id, string reactivatedBy);
    Task<bool> ChangeTenantPlanAsync(Guid id, ChangeTenantPlanDto dto, string changedBy);
    Task<bool> UpdateFeatureOverrideAsync(Guid id, UpdateFeatureOverrideDto dto, string updatedBy);
    Task<List<SubscriptionPlanDto>> GetSubscriptionPlansAsync();
    Task<SubscriptionPlanDto> SaveSubscriptionPlanAsync(SubscriptionPlanDto dto, string savedBy);
    Task<ImpersonationSessionDto> StartImpersonationAsync(StartImpersonationDto dto, Guid adminUserId, string adminEmail, string ipAddress);
    Task<bool> EndImpersonationAsync(Guid logId, string actionsPerformed);
    Task<bool> RequestTenantDeletionAsync(Guid id, string reason, string requestedBy);
    Task<bool> CancelTenantDeletionAsync(Guid id, string reason, string cancelledBy);
    Task<byte[]> ExportTenantsCsvAsync();
}
