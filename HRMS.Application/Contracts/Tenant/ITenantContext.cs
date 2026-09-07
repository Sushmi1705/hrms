using System;

namespace HRMS.Application.Contracts.Tenant;

public interface ITenantContext
{
    Guid? CurrentTenantId { get; }
    string? CurrentTenantCode { get; }
    string? CurrentTenantName { get; }
    bool IsPlatformAdmin { get; }
    bool IsImpersonated { get; }
    Guid? ImpersonatedByUserId { get; }
    string? ImpersonatedByEmail { get; }

    void SetTenant(Guid tenantId, string? tenantCode = null, string? tenantName = null, bool isImpersonated = false, Guid? impersonatorUserId = null, string? impersonatorEmail = null);
    void SetPlatformAdmin(bool isPlatformAdmin);
}
