using MediatR;
using System;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetEmployeeAttendanceProfileQuery : IRequest<object>
{
    public Guid EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
}
