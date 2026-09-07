using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Attendance;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

using HRMS.Application.Contracts.Persistence;
namespace HRMS.Application.Features.Attendance.Commands;

public class ClockInCommand : IRequest<Guid>
{
    public Guid EmployeeId { get; set; }
    public string? IpAddress { get; set; }
    public string? Location { get; set; }
    public string? Device { get; set; }
    public string? PhotoUrl { get; set; }
}

public class ClockInCommandHandler : IRequestHandler<ClockInCommand, Guid>
{
    private readonly IAttendanceRepository _repository;

    public ClockInCommandHandler(IAttendanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(ClockInCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var existingLog = await _repository.GetTodayLogAsync(request.EmployeeId, today);
        
        if (existingLog != null)
        {
            throw new InvalidOperationException("Employee has already clocked in for today.");
        }

        var shiftAssignment = await _repository.GetActiveShiftAssignmentAsync(request.EmployeeId, today);
        bool isLate = false;

        if (shiftAssignment != null)
        {
            var shift = await _repository.GetShiftByIdAsync(shiftAssignment.ShiftId);
            if (shift != null)
            {
                var expectedTime = today.Add(shift.StartTime);
                if (DateTime.UtcNow > expectedTime.AddMinutes(shift.GraceTimeMinutes))
                {
                    isLate = true;
                }
            }
        }

        var log = new AttendanceLog
        {
            EmployeeId = request.EmployeeId,
            Date = today,
            ClockInTime = DateTime.UtcNow,
            ClockInIpAddress = request.IpAddress,
            ClockInLocation = request.Location,
            ClockInDevice = request.Device,
            ClockInPhotoUrl = request.PhotoUrl,
            Status = "Present",
            IsLate = isLate
        };

        await _repository.AddLogAsync(log);
        return log.Id;
    }
}
