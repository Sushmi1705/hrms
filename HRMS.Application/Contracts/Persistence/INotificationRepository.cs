namespace HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Notification;

public interface INotificationRepository
{
    Task<object> GetNotificationDashboardAnalyticsAsync();
    Task<object> GetInboxAsync(int page, int pageSize, string search);
    Task<object> GetTemplatesAsync(int page, int pageSize);
    Task<object> GetEmailTemplatesAsync();
    Task<object> GetSmsTemplatesAsync();
    Task<object> GetPushTemplatesAsync();
    Task<object> GetAnnouncementsAsync();
    Task<object> GetScheduledRemindersAsync();
    Task<object> GetQueueAsync();
    Task<object> GetDeliveryLogsAsync(int page, int pageSize);
    Task<object> GetSettingsAsync();
}
