using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetHrDashboardAnalyticsQueryHandler : IRequestHandler<GetHrDashboardAnalyticsQuery, object>
{
    private readonly IAttendanceAnalyticsRepository _repository;

    public GetHrDashboardAnalyticsQueryHandler(IAttendanceAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> Handle(GetHrDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetDashboardAnalyticsAsync(request.StartDate, request.EndDate);
    }
}
