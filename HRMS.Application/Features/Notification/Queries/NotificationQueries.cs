using HRMS.Application.Contracts.Persistence;
using MediatR;

namespace HRMS.Application.Features.Notification.Queries;

public class GetNotificationsQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string Search { get; set; } = string.Empty;
}
public class GetNotificationsQueryHandler : IRequestHandler<GetNotificationsQuery, object> {
    private readonly INotificationRepository _repo;
    public GetNotificationsQueryHandler(INotificationRepository repo) => _repo = repo;
    public async Task<object> Handle(GetNotificationsQuery request, CancellationToken ct) => await _repo.GetInboxAsync(request.Page, request.PageSize, request.Search);
}

public class GetTemplatesQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
public class GetTemplatesQueryHandler : IRequestHandler<GetTemplatesQuery, object> {
    private readonly INotificationRepository _repo;
    public GetTemplatesQueryHandler(INotificationRepository repo) => _repo = repo;
    public async Task<object> Handle(GetTemplatesQuery request, CancellationToken ct) => await _repo.GetTemplatesAsync(request.Page, request.PageSize);
}

public class GetAnnouncementsQuery : IRequest<object> {}
public class GetAnnouncementsQueryHandler : IRequestHandler<GetAnnouncementsQuery, object> {
    private readonly INotificationRepository _repo;
    public GetAnnouncementsQueryHandler(INotificationRepository repo) => _repo = repo;
    public async Task<object> Handle(GetAnnouncementsQuery request, CancellationToken ct) => await _repo.GetAnnouncementsAsync();
}

public class GetDeliveryLogsQuery : IRequest<object> {
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
public class GetDeliveryLogsQueryHandler : IRequestHandler<GetDeliveryLogsQuery, object> {
    private readonly INotificationRepository _repo;
    public GetDeliveryLogsQueryHandler(INotificationRepository repo) => _repo = repo;
    public async Task<object> Handle(GetDeliveryLogsQuery request, CancellationToken ct) => await _repo.GetDeliveryLogsAsync(request.Page, request.PageSize);
}

public class GetQueueQuery : IRequest<object> {}
public class GetQueueQueryHandler : IRequestHandler<GetQueueQuery, object> {
    private readonly INotificationRepository _repo;
    public GetQueueQueryHandler(INotificationRepository repo) => _repo = repo;
    public async Task<object> Handle(GetQueueQuery request, CancellationToken ct) => await _repo.GetQueueAsync();
}
