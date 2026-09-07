using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Attendance.Queries;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Persistence.Repositories.Attendance;

public class AttendanceAnalyticsRepository : IAttendanceAnalyticsRepository
{
    private readonly HrmsDbContext _dbContext;

    public AttendanceAnalyticsRepository(HrmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(List<AttendanceLog> Items, int TotalCount)> GetAdvancedAttendanceRegisterAsync(GetAttendanceRegisterQuery query)
    {
        var q = _dbContext.AttendanceLogs
            .Include(l => l.Employee)
                .ThenInclude(e => e.Department)
            .Include(l => l.Employee)
                .ThenInclude(e => e.Designation)
            .Include(l => l.Employee)
                .ThenInclude(e => e.Branch)
            .Include(l => l.Shift)
            .AsQueryable();

        // Date Range (default to this month if nothing provided)
        if (query.StartDate.HasValue) q = q.Where(l => l.Date >= query.StartDate.Value.Date);
        if (query.EndDate.HasValue) q = q.Where(l => l.Date <= query.EndDate.Value.Date);

        // Search String
        if (!string.IsNullOrWhiteSpace(query.SearchQuery))
        {
            var sq = query.SearchQuery.ToLower();
            q = q.Where(l => 
                l.Employee.FirstName.ToLower().Contains(sq) || 
                l.Employee.LastName.ToLower().Contains(sq) ||
                l.Employee.EmployeeNumber.ToLower().Contains(sq));
        }

        // Dropdowns
        if (!string.IsNullOrWhiteSpace(query.Department)) q = q.Where(l => l.Employee.Department != null && l.Employee.Department.Name == query.Department);
        if (!string.IsNullOrWhiteSpace(query.Branch)) q = q.Where(l => l.Employee.Branch != null && l.Employee.Branch.Name == query.Branch);
        if (!string.IsNullOrWhiteSpace(query.Shift)) q = q.Where(l => l.Shift != null && l.Shift.Name == query.Shift);
        if (!string.IsNullOrWhiteSpace(query.Status)) q = q.Where(l => l.Status == query.Status);
        if (!string.IsNullOrWhiteSpace(query.EmployeeId)) 
        {
            if (Guid.TryParse(query.EmployeeId, out Guid empId))
                q = q.Where(l => l.EmployeeId == empId);
        }

        // Toggle Flags
        if (query.IsLateArrival == true) q = q.Where(l => l.IsLate);
        if (query.IsMissingPunch == true) q = q.Where(l => l.IsMissingPunch);
        if (query.IsHalfDay == true) q = q.Where(l => l.Status == "Half Day");
        if (query.IsLeave == true) q = q.Where(l => l.Status == "Leave");
        if (query.IsOvertime == true) q = q.Where(l => l.TotalOvertimeHours > 0);

        // Sorting
        q = query.SortBy switch
        {
            "Oldest" => q.OrderBy(l => l.Date),
            "EmployeeName" => q.OrderBy(l => l.Employee.FirstName).ThenBy(l => l.Employee.LastName),
            "Department" => q.OrderBy(l => l.Employee.Department.Name),
            "WorkHours" => q.OrderByDescending(l => l.TotalWorkingHours),
            "LateMinutes" => q.OrderByDescending(l => l.IsLate),
            _ => q.OrderByDescending(l => l.Date) // "Newest" or Default
        };

        var totalCount = await q.CountAsync();
        
        var items = await q
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<object> GetDashboardAnalyticsAsync(DateTime? startDate, DateTime? endDate)
    {
        var q = _dbContext.AttendanceLogs.AsQueryable();
        
        if (startDate.HasValue) q = q.Where(l => l.Date >= startDate.Value.Date);
        if (endDate.HasValue) q = q.Where(l => l.Date <= endDate.Value.Date);
        else if (!startDate.HasValue && !endDate.HasValue)
        {
            // Default to today
            var today = DateTime.UtcNow.Date;
            q = q.Where(l => l.Date == today);
        }

        var logs = await q.ToListAsync();
        var total = logs.Count;
        
        var present = logs.Count(l => l.Status == "Present");
        var absent = logs.Count(l => l.Status == "Absent");
        var halfDay = logs.Count(l => l.Status == "Half Day");
        var leave = logs.Count(l => l.Status == "Leave");
        var onDuty = logs.Count(l => l.Status == "On Duty");
        var late = logs.Count(l => l.IsLate);

        var presentPercentage = total > 0 ? (int)Math.Round((double)present / total * 100) : 0;
        var absentPercentage = total > 0 ? (int)Math.Round((double)absent / total * 100) : 0;
        var latePercentage = total > 0 ? (int)Math.Round((double)late / total * 100) : 0;
        
        return new 
        {
            totalEmployees = total,
            presentCount = present,
            absentCount = absent,
            halfDayCount = halfDay,
            leaveCount = leave,
            onDutyCount = onDuty,
            lateCount = late,
            presentPercentage,
            absentPercentage,
            latePercentage
        };
    }

    public async Task<object> GetEmployeeProfileWithLogsAsync(Guid employeeId, int month, int year)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var employee = await _dbContext.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null) return null;

        var logs = await _dbContext.AttendanceLogs
            .Where(l => l.EmployeeId == employeeId && l.Date >= startDate && l.Date <= endDate)
            .OrderByDescending(l => l.Date)
            .ToListAsync();

        var totalDays = logs.Count;
        var present = logs.Count(l => l.Status == "Present");
        var absent = logs.Count(l => l.Status == "Absent");
        var leaves = logs.Count(l => l.Status == "Leave");
        var halfDays = logs.Count(l => l.Status == "Half Day");
        var totalLate = logs.Count(l => l.IsLate);
        var earlyCheckouts = logs.Count(l => l.IsEarlyOut);
        var missingPunches = logs.Count(l => l.IsMissingPunch);
        var permissions = 0; // TBD via Approval table
        var regularizations = 0; // TBD via Approval table
        
        var totalOvertimeHours = logs.Sum(l => l.TotalOvertimeHours);
        var attendancePercentage = totalDays > 0 ? (int)Math.Round((double)present / totalDays * 100) : 0;

        return new
        {
            employeeId = employee.Id,
            employeeNumber = employee.EmployeeNumber,
            firstName = employee.FirstName,
            lastName = employee.LastName,
            photoUrl = $"https://ui-avatars.com/api/?name={employee.FirstName}+{employee.LastName}",
            department = employee.Department?.Name ?? "N/A",
            designation = employee.Designation?.Name ?? "N/A",
            branch = employee.Branch?.Name ?? "N/A",
            shiftName = "N/A",
            status = employee.Status,
            
            // 12 Requested Metrics
            attendancePercentage,
            totalPresent = present,
            totalAbsent = absent,
            totalLeaves = leaves,
            totalHalfDay = halfDays,
            totalOvertimeHours = Math.Round(totalOvertimeHours, 2),
            totalLate,
            totalEarlyCheckouts = earlyCheckouts,
            totalMissingPunches = missingPunches,
            totalPermissions = permissions,
            totalRegularizations = regularizations,
            
            monthlyLogs = logs
        };
    }
}



