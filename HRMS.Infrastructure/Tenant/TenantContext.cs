using System;
using HRMS.Application.Contracts.Tenant;

namespace HRMS.Infrastructure.Tenant;

public class TenantContext : ITenantContext
{
    public Guid? CurrentTenantId { get; private set; }
    public string? CurrentTenantCode { get; private set; }
    public string? CurrentTenantName { get; private set; }
    public bool IsPlatformAdmin { get; private set; }
    public bool IsImpersonated { get; private set; }
    public Guid? ImpersonatedByUserId { get; private set; }
    public string? ImpersonatedByEmail { get; private set; }

    public void SetTenant(Guid tenantId, string? tenantCode = null, string? tenantName = null, bool isImpersonated = false, Guid? impersonatorUserId = null, string? impersonatorEmail = null)
    {
        CurrentTenantId = tenantId;
        CurrentTenantCode = tenantCode;
        CurrentTenantName = tenantName;
        IsImpersonated = isImpersonated;
        ImpersonatedByUserId = impersonatorUserId;
        ImpersonatedByEmail = impersonatorEmail;
    }

    public void SetPlatformAdmin(bool isPlatformAdmin)
    {
        IsPlatformAdmin = isPlatformAdmin;
    }
}
