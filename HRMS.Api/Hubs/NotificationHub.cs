using Microsoft.AspNetCore.SignalR;

namespace HRMS.Api.Hubs;

public class NotificationHub : Hub
{
    public async Task SendNotificationToUser(string userId, string message)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", message);
    }
    
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
