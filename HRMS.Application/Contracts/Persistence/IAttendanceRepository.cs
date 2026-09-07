using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Application.Contracts.Persistence;

public interface IAttendanceRepository
{
    Task<AttendanceLog?> GetTodayLogAsync(Guid employeeId, DateTime date);
    Task<AttendanceLog> AddLogAsync(AttendanceLog log);
    Task UpdateLogAsync(AttendanceLog log);
    Task<IReadOnlyList<AttendanceLog>> GetLogsByEmployeeAsync(Guid employeeId, DateTime startDate, DateTime endDate);
    Task<dynamic?> GetActiveShiftAssignmentAsync(Guid employeeId, DateTime date);
    Task<Shift?> GetShiftByIdAsync(Guid shiftId);
}
