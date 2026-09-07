using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetPendingApprovalsQueryHandler : IRequestHandler<GetPendingApprovalsQuery, List<AttendanceApprovalDto>>
{
    private readonly IApprovalRepository _repository;

    public GetPendingApprovalsQueryHandler(IApprovalRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<AttendanceApprovalDto>> Handle(GetPendingApprovalsQuery request, CancellationToken cancellationToken)
    {
        var approvals = await _repository.GetPendingApprovalsAsync();

        return approvals.Select(a => new AttendanceApprovalDto
        {
            Id = a.Id,
            EmployeeId = a.EmployeeId,
            EmployeeName = a.Employee != null ? a.Employee.FirstName + " " + a.Employee.LastName : "Unknown",
            Department = a.Employee?.Department?.Name ?? "N/A",
            Type = a.Type,
            Date = a.Date,
            Reason = a.Reason,
            Status = a.Status,
            RequestedCheckIn = a.RequestedCheckIn?.ToString("hh\\:mm") ?? "--:--",
            RequestedCheckOut = a.RequestedCheckOut?.ToString("hh\\:mm") ?? "--:--"
        }).ToList();
    }
}
