using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Audit.Queries;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Persistence.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly HrmsDbContext _context;

    public AuditRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetAuditLogsAsync(GetAuditLogsQuery query)
    {
        var q = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();
            q = q.Where(l => 
                l.UserName.ToLower().Contains(search) || 
                l.Action.ToLower().Contains(search) || 
                l.Module.ToLower().Contains(search) ||
                l.Entity.ToLower().Contains(search) ||
                l.EmployeeId.ToLower().Contains(search) ||
                l.Role.ToLower().Contains(search) ||
                l.Company.ToLower().Contains(search) ||
                l.Department.ToLower().Contains(search) ||
                l.Endpoint.ToLower().Contains(search) ||
                l.IpAddress.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Module) && query.Module != "All") q = q.Where(l => l.Module == query.Module);
        if (!string.IsNullOrWhiteSpace(query.Company) && query.Company != "All") q = q.Where(l => l.Company == query.Company);
        if (!string.IsNullOrWhiteSpace(query.Branch) && query.Branch != "All") q = q.Where(l => l.Branch == query.Branch);
        if (!string.IsNullOrWhiteSpace(query.Department) && query.Department != "All") q = q.Where(l => l.Department == query.Department);
        if (!string.IsNullOrWhiteSpace(query.Action) && query.Action != "All") q = q.Where(l => l.Action == query.Action);
        if (!string.IsNullOrWhiteSpace(query.Category) && query.Category != "All") q = q.Where(l => l.Category == query.Category);
        if (!string.IsNullOrWhiteSpace(query.Severity) && query.Severity != "All") q = q.Where(l => l.Severity == query.Severity);
        if (!string.IsNullOrWhiteSpace(query.Status) && query.Status != "All") q = q.Where(l => l.Status == query.Status);
        
        var totalItems = await q.CountAsync();
        var items = await q.OrderByDescending(l => l.CreatedAt)
                           .Skip((query.Page - 1) * query.PageSize)
                           .Take(query.PageSize)
                           .ToListAsync();

        return new { totalItems, items };
    }

    public async Task<object> GetLoginHistoryAsync(int page, int pageSize, string search)
    {
        var query = _context.AuditLogins.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            query = query.Where(l => l.UserName.ToLower().Contains(search) || l.IpAddress.ToLower().Contains(search));
        }
        
        var totalItems = await query.CountAsync();
        var items = await query.OrderByDescending(l => l.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return new { totalItems, items };
    }

    public async Task<object> GetSecurityEventsAsync(int page, int pageSize, string search)
    {
        var query = _context.AuditSecurityEvents.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            query = query.Where(e => e.EventType.ToLower().Contains(search) || e.IpAddress.ToLower().Contains(search));
        }
        
        var totalItems = await query.CountAsync();
        var items = await query.OrderByDescending(e => e.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return new { totalItems, items };
    }

    public async Task<object> GetAuditDashboardAnalyticsAsync()
    {
        var now = DateTime.UtcNow;
        var today = now.Date;

        var logsToday = await _context.AuditLogs.CountAsync(l => l.CreatedAt >= today);
        var failedLogins = await _context.AuditLogins.CountAsync(l => l.Status == "Failed" && l.CreatedAt >= today);
        var criticalEvents = await _context.AuditSecurityEvents.CountAsync(e => e.Severity == "Critical" && e.CreatedAt >= today);
        var activeUsers = await _context.AuditLogins.Where(l => l.LogoutTime == null && l.CreatedAt >= today).Select(l => l.UserId).Distinct().CountAsync();
        var dataChanges = await _context.AuditChanges.CountAsync(c => c.CreatedAt >= today);

        var topModules = await _context.AuditLogs
            .Where(l => l.CreatedAt >= today)
            .GroupBy(l => l.Module)
            .Select(g => new { Module = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToListAsync();

        // 7 Day Trend
        var sevenDaysAgo = today.AddDays(-7);
        var trendData = await _context.AuditLogs
            .Where(l => l.CreatedAt >= sevenDaysAgo)
            .GroupBy(l => l.CreatedAt.Date)
            .Select(g => new { Date = g.Key.ToString("MM/dd"), Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return new
        {
            todayActivities = logsToday,
            failedLogins,
            criticalEvents,
            activeUsers,
            dataChanges,
            topModules,
            trend = trendData
        };
    }

    public async Task<object> GetAuditChangesByAuditLogIdAsync(Guid auditLogId)
    {
        return await _context.AuditChanges.Where(c => c.AuditLogId == auditLogId).ToListAsync();
    }
}
