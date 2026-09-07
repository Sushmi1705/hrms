using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Tenant.DTOs;
using MediatR;

namespace HRMS.Application.Features.Tenant.Queries;

// 1. Platform Dashboard Query
public record GetPlatformDashboardQuery : IRequest<PlatformDashboardDto>;
public class GetPlatformDashboardQueryHandler : IRequestHandler<GetPlatformDashboardQuery, PlatformDashboardDto>
{
    private readonly ITenantRepository _repo;
    public GetPlatformDashboardQueryHandler(ITenantRepository repo) => _repo = repo;
    public Task<PlatformDashboardDto> Handle(GetPlatformDashboardQuery request, CancellationToken ct) => _repo.GetPlatformDashboardAsync();
}

// 2. Tenants Paged Query
public record GetTenantsPagedQuery(string? Search, string? Status, string? Plan, string? Country, int Page, int PageSize) : IRequest<PagedResult<TenantSummaryDto>>;
public class GetTenantsPagedQueryHandler : IRequestHandler<GetTenantsPagedQuery, PagedResult<TenantSummaryDto>>
{
    private readonly ITenantRepository _repo;
    public GetTenantsPagedQueryHandler(ITenantRepository repo) => _repo = repo;
    public Task<PagedResult<TenantSummaryDto>> Handle(GetTenantsPagedQuery req, CancellationToken ct)
        => _repo.GetTenantsPagedAsync(req.Search, req.Status, req.Plan, req.Country, req.Page, req.PageSize);
}

// 3. Tenant Details by ID Query
public record GetTenantByIdQuery(Guid Id) : IRequest<TenantDetailsDto?>;
public class GetTenantByIdQueryHandler : IRequestHandler<GetTenantByIdQuery, TenantDetailsDto?>
{
    private readonly ITenantRepository _repo;
    public GetTenantByIdQueryHandler(ITenantRepository repo) => _repo = repo;
    public Task<TenantDetailsDto?> Handle(GetTenantByIdQuery req, CancellationToken ct) => _repo.GetTenantByIdAsync(req.Id);
}

// 4. Subscription Plans Query
public record GetSubscriptionPlansQuery : IRequest<List<SubscriptionPlanDto>>;
public class GetSubscriptionPlansQueryHandler : IRequestHandler<GetSubscriptionPlansQuery, List<SubscriptionPlanDto>>
{
    private readonly ITenantRepository _repo;
    public GetSubscriptionPlansQueryHandler(ITenantRepository repo) => _repo = repo;
    public Task<List<SubscriptionPlanDto>> Handle(GetSubscriptionPlansQuery req, CancellationToken ct) => _repo.GetSubscriptionPlansAsync();
}

// 5. Export Tenants CSV Query
public record ExportTenantsCsvQuery : IRequest<byte[]>;
public class ExportTenantsCsvQueryHandler : IRequestHandler<ExportTenantsCsvQuery, byte[]>
{
    private readonly ITenantRepository _repo;
    public ExportTenantsCsvQueryHandler(ITenantRepository repo) => _repo = repo;
    public Task<byte[]> Handle(ExportTenantsCsvQuery req, CancellationToken ct) => _repo.ExportTenantsCsvAsync();
}
