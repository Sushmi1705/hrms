using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Interfaces.Repositories.Leave;
using HRMS.Domain.Entities.Leave;

namespace HRMS.Application.Features.Leave.Commands;

public record ApplyLeaveCommand : IRequest<Guid>
{
    public Guid EmployeeId { get; init; }
    public Guid LeaveTypeId { get; init; }
    public DateTime FromDate { get; init; }
    public DateTime ToDate { get; init; }
    public bool IsHalfDay { get; init; }
    public string Reason { get; init; } = null!;
}

public class ApplyLeaveCommandHandler : IRequestHandler<ApplyLeaveCommand, Guid>
{
    private readonly ILeaveRepository _leaveRepository;

    public ApplyLeaveCommandHandler(ILeaveRepository leaveRepository)
    {
        _leaveRepository = leaveRepository;
    }

    public async Task<Guid> Handle(ApplyLeaveCommand request, CancellationToken cancellationToken)
    {
        // Validation for overlapping leave
        if (await _leaveRepository.HasOverlappingLeaveAsync(request.EmployeeId, request.FromDate, request.ToDate, cancellationToken))
        {
            throw new Exception("Overlapping leave exists for this period.");
        }

        var totalDays = request.IsHalfDay ? 0.5m : (decimal)(request.ToDate - request.FromDate).TotalDays + 1;

        var leaveRequest = new LeaveRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = request.EmployeeId,
            LeaveTypeId = request.LeaveTypeId,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            TotalDays = totalDays,
            IsHalfDay = request.IsHalfDay,
            Reason = request.Reason,
            Status = "Pending",
            CreatedBy = request.EmployeeId.ToString(),
            UpdatedBy = request.EmployeeId.ToString(),
            DeletedBy = string.Empty
        };

        var saved = await _leaveRepository.AddLeaveRequestAsync(leaveRequest, cancellationToken);
        return saved.Id;
    }
}

public record ProcessLeaveApprovalCommand(Guid LeaveRequestId, Guid ApproverId, string Status, string Comments) : IRequest<bool>;

public class ProcessLeaveApprovalCommandHandler : IRequestHandler<ProcessLeaveApprovalCommand, bool>
{
    private readonly ILeaveRepository _leaveRepository;

    public ProcessLeaveApprovalCommandHandler(ILeaveRepository leaveRepository)
    {
        _leaveRepository = leaveRepository;
    }

    public async Task<bool> Handle(ProcessLeaveApprovalCommand request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _leaveRepository.GetLeaveRequestByIdAsync(request.LeaveRequestId, cancellationToken);
        if (leaveRequest == null) throw new Exception("Leave request not found");

        leaveRequest.Status = request.Status;
        leaveRequest.ApproverId = request.ApproverId;
        leaveRequest.ApprovalComments = request.Comments;
        leaveRequest.ActionDate = DateTime.UtcNow;
        leaveRequest.UpdatedBy = request.ApproverId.ToString();

        await _leaveRepository.UpdateLeaveRequestAsync(leaveRequest, cancellationToken);

        if (request.Status == "Approved")
        {
            // Deduct balance
            var balance = await _leaveRepository.GetEmployeeLeaveBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveTypeId, leaveRequest.FromDate.Year, cancellationToken);
            if (balance != null)
            {
                balance.Used += leaveRequest.TotalDays;
                balance.Pending -= leaveRequest.TotalDays; // Assuming applying adds to pending
                balance.Remaining = balance.OpeningBalance - balance.Used;
                balance.UpdatedBy = request.ApproverId.ToString();
                await _leaveRepository.UpdateLeaveBalanceAsync(balance, cancellationToken);
            }
        }
        else if (request.Status == "Rejected")
        {
            var balance = await _leaveRepository.GetEmployeeLeaveBalanceAsync(leaveRequest.EmployeeId, leaveRequest.LeaveTypeId, leaveRequest.FromDate.Year, cancellationToken);
            if (balance != null)
            {
                balance.Pending -= leaveRequest.TotalDays;
                balance.UpdatedBy = request.ApproverId.ToString();
                await _leaveRepository.UpdateLeaveBalanceAsync(balance, cancellationToken);
            }
        }

        return true;
    }
}
