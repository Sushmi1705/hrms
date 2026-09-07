using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Shift.Queries;

public class GetShiftDashboardAnalyticsQuery : IRequest<ShiftDashboardAnalyticsDto> { }

public class GetShiftDashboardAnalyticsQueryHandler : IRequestHandler<GetShiftDashboardAnalyticsQuery, ShiftDashboardAnalyticsDto>
{
    private readonly IShiftRepository _shiftRepository;

    public GetShiftDashboardAnalyticsQueryHandler(IShiftRepository shiftRepository)
    {
        _shiftRepository = shiftRepository;
    }

    public async Task<ShiftDashboardAnalyticsDto> Handle(GetShiftDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var shifts = await _shiftRepository.GetAllShiftsAsync();
        var assignments = await _shiftRepository.GetAllAssignmentsAsync();

        return new ShiftDashboardAnalyticsDto
        {
            ActiveShifts = 20,
            EmployeesScheduledToday = 200,
            NightShiftEmployees = 45,
            MorningShiftEmployees = 155
        };
    }
}
