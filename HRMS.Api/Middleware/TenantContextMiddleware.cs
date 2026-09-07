using System;
using System.Security.Claims;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Tenant;
using HRMS.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HRMS.Api.Middleware;

public class TenantContextMiddleware
{
    private readonly RequestDelegate _next;

    public TenantContextMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ITenantContext tenantContext, IServiceProvider serviceProvider)
    {
        var path = context.Request.Path.Value?.ToLower() ?? string.Empty;

        // Skip static files or public swagger / health endpoints
        if (path.StartsWith("/swagger") || path.StartsWith("/health") || path.StartsWith("/index.html"))
        {
            await _next(context);
            return;
        }

        var user = context.User;
        bool isPlatformAdmin = user.IsInRole("Super Admin") || user.IsInRole("System Admin");
        tenantContext.SetPlatformAdmin(isPlatformAdmin);

        // Check X-Tenant-Id header first (e.g. for Platform Admin selecting tenant context or testing)
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantHeader) &&
            Guid.TryParse(tenantHeader, out var headerTenantId))
        {
            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();
            var tenant = await db.Tenants.AsNoTracking().FirstOrDefaultAsync(t => t.Id == headerTenantId && !t.IsDeleted);
            if (tenant != null)
            {
                if (tenant.Status == "Suspended" && !isPlatformAdmin)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"error\":\"Tenant Suspended\",\"message\":\"Your organization account has been suspended. Please contact enterprise support.\"}");
                    return;
                }

                tenantContext.SetTenant(tenant.Id, tenant.Code, tenant.Name);
            }
        }
        else if (user.Identity?.IsAuthenticated == true)
        {
            // Resolve from JWT claim
            var tenantIdClaim = user.FindFirst("tenant_id")?.Value ?? user.FindFirst("tid")?.Value;
            if (Guid.TryParse(tenantIdClaim, out var claimTenantId))
            {
                using var scope = serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();
                var tenant = await db.Tenants.AsNoTracking().FirstOrDefaultAsync(t => t.Id == claimTenantId && !t.IsDeleted);
                if (tenant != null)
                {
                    if (tenant.Status == "Suspended" && !isPlatformAdmin)
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync("{\"error\":\"Tenant Suspended\",\"message\":\"Your organization account has been suspended. Please contact enterprise support.\"}");
                        return;
                    }

                    tenantContext.SetTenant(tenant.Id, tenant.Code, tenant.Name);
                }
            }
        }

        await _next(context);
    }
}
