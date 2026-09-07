using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetAttendanceRegisterQueryHandler : IRequestHandler<GetAttendanceRegisterQuery, PaginatedResultDto<AttendanceRegisterDto>>
{
    private readonly IAttendanceAnalyticsRepository _repository;
    
    public GetAttendanceRegisterQueryHandler(IAttendanceAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedResultDto<AttendanceRegisterDto>> Handle(GetAttendanceRegisterQuery request, CancellationToken cancellationToken)
    {
        var (logs, totalCount) = await _repository.GetAdvancedAttendanceRegisterAsync(request);

        var results = logs
            .Select(l => new AttendanceRegisterDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee.FirstName + " " + l.Employee.LastName,
                Department = l.Employee.Department?.Name ?? "N/A",
                Designation = l.Employee.Designation?.Name ?? "N/A",
                Shift = l.Shift?.Name ?? "N/A",
                CheckIn = l.ClockInTime.HasValue ? l.ClockInTime.Value.ToString("hh\\:mm") : "--:--",
                CheckOut = l.ClockOutTime.HasValue ? l.ClockOutTime.Value.ToString("hh\\:mm") : "--:--",
                WorkingHours = Math.Round((decimal)l.TotalWorkingHours, 2),
                OvertimeHours = Math.Round((decimal)l.TotalOvertimeHours, 2),
                Status = l.Status,
                IsLate = l.IsLate,
                IsEarlyOut = l.IsEarlyOut,
                IsMissingPunch = l.IsMissingPunch,
                LateMinutes = 0
            })
            .ToList();

        return new PaginatedResultDto<AttendanceRegisterDto>
        {
            Items = results,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}

