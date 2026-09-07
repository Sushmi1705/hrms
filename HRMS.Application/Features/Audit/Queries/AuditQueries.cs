using HRMS.Application.Contracts.Persistence;
using MediatR;

namespace HRMS.Application.Features.Audit.Queries;

public class GetAuditDashboardAnalyticsQuery : IRequest<object> {}
public class GetAuditDashboardAnalyticsQueryHandler : IRequestHandler<GetAuditDashboardAnalyticsQuery, object> {
    private readonly IAuditRepository _repo;
    public GetAuditDashboardAnalyticsQueryHandler(IAuditRepository repo) => _repo = repo;
    public async Task<object> Handle(GetAuditDashboardAnalyticsQuery request, CancellationToken ct) => await _repo.GetAuditDashboardAnalyticsAsync();
}

public class GetAuditLogsQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string DateFrom { get; set; } = string.Empty;
    public string DateTo { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Entity { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Browser { get; set; } = string.Empty;
    public string Device { get; set; } = string.Empty;
    public string OperatingSystem { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, object> {
    private readonly IAuditRepository _repo;
    public GetAuditLogsQueryHandler(IAuditRepository repo) => _repo = repo;
    public async Task<object> Handle(GetAuditLogsQuery request, CancellationToken ct) => await _repo.GetAuditLogsAsync(request);
}

public class GetLoginHistoryQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
}
public class GetLoginHistoryQueryHandler : IRequestHandler<GetLoginHistoryQuery, object> {
    private readonly IAuditRepository _repo;
    public GetLoginHistoryQueryHandler(IAuditRepository repo) => _repo = repo;
    public async Task<object> Handle(GetLoginHistoryQuery request, CancellationToken ct) => await _repo.GetLoginHistoryAsync(request.Page, request.PageSize, request.Search);
}

public class GetSecurityEventsQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
}
public class GetSecurityEventsQueryHandler : IRequestHandler<GetSecurityEventsQuery, object> {
    private readonly IAuditRepository _repo;
    public GetSecurityEventsQueryHandler(IAuditRepository repo) => _repo = repo;
    public async Task<object> Handle(GetSecurityEventsQuery request, CancellationToken ct) => await _repo.GetSecurityEventsAsync(request.Page, request.PageSize, request.Search);
}

public class GetAuditChangesQuery : IRequest<object> {
    public Guid AuditLogId { get; set; }
}
public class GetAuditChangesQueryHandler : IRequestHandler<GetAuditChangesQuery, object> {
    private readonly IAuditRepository _repo;
    public GetAuditChangesQueryHandler(IAuditRepository repo) => _repo = repo;
    public async Task<object> Handle(GetAuditChangesQuery request, CancellationToken ct) => await _repo.GetAuditChangesByAuditLogIdAsync(request.AuditLogId);
}
