using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Commands;

public class RejectAttendanceCommand : IRequest<bool>
{
    public Guid ApprovalId { get; set; }
    public Guid HRManagerId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class RejectAttendanceCommandHandler : IRequestHandler<RejectAttendanceCommand, bool>
{
    private readonly IApprovalRepository _repository;

    public RejectAttendanceCommandHandler(IApprovalRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(RejectAttendanceCommand request, CancellationToken cancellationToken)
    {
        return await _repository.RejectAsync(request.ApprovalId, request.HRManagerId, request.Reason);
    }
}
