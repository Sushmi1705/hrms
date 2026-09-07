using HRMS.Application.Features.Audit.Queries;

namespace HRMS.Application.Contracts.Persistence;

public interface IAuditRepository
{
    Task<object> GetAuditLogsAsync(GetAuditLogsQuery query);
    Task<object> GetLoginHistoryAsync(int page, int pageSize, string search);
    Task<object> GetSecurityEventsAsync(int page, int pageSize, string search);
    Task<object> GetAuditDashboardAnalyticsAsync();
    Task<object> GetAuditChangesByAuditLogIdAsync(Guid auditLogId);
}
