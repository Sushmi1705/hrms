using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Notification;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Persistence.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly HrmsDbContext _dbContext;

    public NotificationRepository(HrmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<object> GetNotificationDashboardAnalyticsAsync()
    {
        var unread = await _dbContext.Notifications.CountAsync(x => !x.IsRead);
        var today = await _dbContext.Notifications.CountAsync(x => x.CreatedAt >= DateTime.UtcNow.Date);
        var failed = await _dbContext.DeliveryLogs.CountAsync(x => x.Status == "Failed" && x.CreatedAt >= DateTime.UtcNow.Date);
        var pending = await _dbContext.NotificationQueues.CountAsync(x => x.Status == "Queued" || x.Status == "Processing");
        var emails = await _dbContext.DeliveryLogs.CountAsync(x => x.Channel == "Email");
        var sms = await _dbContext.DeliveryLogs.CountAsync(x => x.Channel == "SMS");
        var push = await _dbContext.DeliveryLogs.CountAsync(x => x.Channel == "Push");
        var announcements = await _dbContext.Announcements.CountAsync(x => x.IsPinned);

        return new
        {
            Unread = unread,
            Today = today,
            Failed = failed,
            Pending = pending,
            EmailsSent = emails,
            SmsSent = sms,
            PushSent = push,
            ActiveAnnouncements = announcements
        };
    }

    public async Task<object> GetInboxAsync(int page, int pageSize, string search)
    {
        var query = _dbContext.Notifications.AsQueryable();
        if (!string.IsNullOrEmpty(search)) {
            query = query.Where(x => x.Title.Contains(search) || x.Message.Contains(search));
        }
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();
        return new { Total = total, Items = items };
    }

    public async Task<object> GetTemplatesAsync(int page, int pageSize)
    {
        var total = await _dbContext.NotificationTemplates.CountAsync();
        var items = await _dbContext.NotificationTemplates.OrderBy(x => x.Name).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new { Total = total, Items = items };
    }

    public async Task<object> GetEmailTemplatesAsync() => await _dbContext.EmailTemplates.OrderBy(x => x.Name).ToListAsync();
    public async Task<object> GetSmsTemplatesAsync() => await _dbContext.SmsTemplates.OrderBy(x => x.Name).ToListAsync();
    public async Task<object> GetPushTemplatesAsync() => await _dbContext.PushTemplates.OrderBy(x => x.Name).ToListAsync();
    public async Task<object> GetAnnouncementsAsync() => await _dbContext.Announcements.OrderByDescending(x => x.CreatedAt).ToListAsync();
    public async Task<object> GetScheduledRemindersAsync() => await _dbContext.ScheduledNotifications.OrderBy(x => x.NextRunTime).ToListAsync();
    public async Task<object> GetQueueAsync() => await _dbContext.NotificationQueues.OrderByDescending(x => x.CreatedAt).Take(100).ToListAsync();
    
    public async Task<object> GetDeliveryLogsAsync(int page, int pageSize)
    {
        var total = await _dbContext.DeliveryLogs.CountAsync();
        var items = await _dbContext.DeliveryLogs.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new { Total = total, Items = items };
    }

    public async Task<object> GetSettingsAsync() => await _dbContext.NotificationSettings.OrderBy(x => x.Category).ToListAsync();
}
