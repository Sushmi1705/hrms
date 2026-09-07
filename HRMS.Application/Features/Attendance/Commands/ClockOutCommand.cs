using HRMS.Application.Interfaces.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

using HRMS.Application.Contracts.Persistence;
namespace HRMS.Application.Features.Attendance.Commands;

public class ClockOutCommand : IRequest<bool>
{
    public Guid EmployeeId { get; set; }
    public string? IpAddress { get; set; }
    public string? Location { get; set; }
    public string? Device { get; set; }
    public string? PhotoUrl { get; set; }
}

public class ClockOutCommandHandler : IRequestHandler<ClockOutCommand, bool>
{
    private readonly IAttendanceRepository _repository;

    public ClockOutCommandHandler(IAttendanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(ClockOutCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var existingLog = await _repository.GetTodayLogAsync(request.EmployeeId, today);
        
        if (existingLog == null || existingLog.ClockInTime == null)
        {
            throw new InvalidOperationException("Cannot clock out without clocking in first.");
        }

        if (existingLog.ClockOutTime != null)
        {
            throw new InvalidOperationException("Employee has already clocked out for today.");
        }

        existingLog.ClockOutTime = DateTime.UtcNow;
        existingLog.ClockOutIpAddress = request.IpAddress;
        existingLog.ClockOutLocation = request.Location;
        existingLog.ClockOutDevice = request.Device;
        existingLog.ClockOutPhotoUrl = request.PhotoUrl;
        
        var duration = existingLog.ClockOutTime.Value - existingLog.ClockInTime.Value;
        existingLog.TotalWorkingHours = (decimal)duration.TotalHours;

        var shiftAssignment = await _repository.GetActiveShiftAssignmentAsync(request.EmployeeId, today);
        if (shiftAssignment != null)
        {
            var shift = await _repository.GetShiftByIdAsync(shiftAssignment.ShiftId);
            if (shift != null)
            {
                var expectedEndTime = today.Add(shift.EndTime);
                if (DateTime.UtcNow < expectedEndTime)
                {
                    existingLog.IsEarlyOut = true;
                }
            }
        }

        await _repository.UpdateLogAsync(existingLog);
        return true;
    }
}
