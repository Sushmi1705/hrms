using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Attendance.Commands;

public class ApproveAttendanceCommand : IRequest<bool>
{
    public Guid ApprovalId { get; set; }
    public Guid HRManagerId { get; set; }
    public string? Comments { get; set; }
}

public class ApproveAttendanceCommandHandler : IRequestHandler<ApproveAttendanceCommand, bool>
{
    private readonly IApprovalRepository _repository;

    public ApproveAttendanceCommandHandler(IApprovalRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(ApproveAttendanceCommand request, CancellationToken cancellationToken)
    {
        return await _repository.ApproveAsync(request.ApprovalId, request.HRManagerId, request.Comments);
    }
}
