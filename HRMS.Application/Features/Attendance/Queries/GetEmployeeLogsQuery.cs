using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Attendance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using HRMS.Application.Contracts.Persistence;
namespace HRMS.Application.Features.Attendance.Queries;

public class GetEmployeeLogsQuery : IRequest<IEnumerable<AttendanceLog>>
{
    public Guid EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class GetEmployeeLogsQueryHandler : IRequestHandler<GetEmployeeLogsQuery, IEnumerable<AttendanceLog>>
{
    private readonly IAttendanceRepository _repository;

    public GetEmployeeLogsQueryHandler(IAttendanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AttendanceLog>> Handle(GetEmployeeLogsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetLogsByEmployeeAsync(request.EmployeeId, request.StartDate, request.EndDate);
    }
}
