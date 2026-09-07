using HRMS.Application.Contracts.Persistence;
using MediatR;

namespace HRMS.Application.Features.Notification.Queries;

public class GetNotificationAnalyticsQuery : IRequest<object> { }

public class GetNotificationAnalyticsQueryHandler : IRequestHandler<GetNotificationAnalyticsQuery, object>
{
    private readonly INotificationRepository _notificationRepository;

    public GetNotificationAnalyticsQueryHandler(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<object> Handle(GetNotificationAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _notificationRepository.GetNotificationDashboardAnalyticsAsync();
    }
}
