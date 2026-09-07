using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetEmployeeAttendanceProfileQueryHandler : IRequestHandler<GetEmployeeAttendanceProfileQuery, object>
{
    private readonly IAttendanceAnalyticsRepository _repository;

    public GetEmployeeAttendanceProfileQueryHandler(IAttendanceAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> Handle(GetEmployeeAttendanceProfileQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetEmployeeProfileWithLogsAsync(request.EmployeeId, request.Month, request.Year);
    }
}
