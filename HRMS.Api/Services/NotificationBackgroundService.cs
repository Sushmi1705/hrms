using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using HRMS.Persistence;

namespace HRMS.Api.Services;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationBackgroundService> _logger;

    public NotificationBackgroundService(IServiceProvider serviceProvider, ILogger<NotificationBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Background Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();
                    var pendingCount = await dbContext.NotificationQueues.CountAsync(x => x.Status == "Queued", stoppingToken);
                    if (pendingCount > 0)
                    {
                        _logger.LogInformation($"Processing {pendingCount} queued notifications...");
                        // In a real scenario, process them and update status to Delivered/Failed.
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred processing notification queue.");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
