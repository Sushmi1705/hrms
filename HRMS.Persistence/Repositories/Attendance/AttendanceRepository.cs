using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Persistence.Repositories.Attendance;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly HrmsDbContext _dbContext;

    public AttendanceRepository(HrmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AttendanceLog?> GetTodayLogAsync(Guid employeeId, DateTime date)
    {
        return await _dbContext.AttendanceLogs
            .FirstOrDefaultAsync(l => l.EmployeeId == employeeId && l.Date.Date == date.Date);
    }

    public async Task<AttendanceLog> AddLogAsync(AttendanceLog log)
    {
        await _dbContext.AttendanceLogs.AddAsync(log);
        await _dbContext.SaveChangesAsync();
        return log;
    }

    public async Task UpdateLogAsync(AttendanceLog log)
    {
        _dbContext.Entry(log).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<AttendanceLog>> GetLogsByEmployeeAsync(Guid employeeId, DateTime startDate, DateTime endDate)
    {
        return await _dbContext.AttendanceLogs
            .Where(l => l.EmployeeId == employeeId && l.Date.Date >= startDate.Date && l.Date.Date <= endDate.Date)
            .OrderByDescending(l => l.Date)
            .ToListAsync();
    }

    public async Task<dynamic?> GetActiveShiftAssignmentAsync(Guid employeeId, DateTime date)
    {
        // Mock shift assignment for now to pass compilation
        return null;
    }

    public async Task<Shift?> GetShiftByIdAsync(Guid shiftId)
    {
        return await _dbContext.Shifts.FindAsync(shiftId);
    }
}
