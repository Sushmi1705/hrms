using System;
using System.Collections.Generic;
using System.Linq;
using HRMS.Domain.Entities.Shift;
using HRMS.Domain.Entities.Employee;
using Microsoft.Extensions.DependencyInjection;

namespace HRMS.Persistence.Seeders;

public static class ShiftSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.ShiftMasters.Any()) return;

        var morningShift = new ShiftMaster
        {
            Id = Guid.NewGuid(),
            ShiftName = "Morning Shift",
            ShiftCode = "MORN01",
            ShiftType = "Morning",
            StartTime = new TimeSpan(6, 0, 0),
            EndTime = new TimeSpan(14, 0, 0),
            BreakStartTime = new TimeSpan(10, 0, 0),
            BreakEndTime = new TimeSpan(10, 30, 0),
            WorkingHours = 8m,
            GraceTimeInMinutes = 15,
            ColorCode = "#f59e0b",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System",
            UpdatedBy = "System",
            DeletedBy = string.Empty
        };

        var generalShift = new ShiftMaster
        {
            Id = Guid.NewGuid(),
            ShiftName = "General Shift",
            ShiftCode = "GEN01",
            ShiftType = "General",
            StartTime = new TimeSpan(9, 0, 0),
            EndTime = new TimeSpan(18, 0, 0),
            BreakStartTime = new TimeSpan(13, 0, 0),
            BreakEndTime = new TimeSpan(14, 0, 0),
            WorkingHours = 9m,
            GraceTimeInMinutes = 15,
            ColorCode = "#3b82f6",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System",
            UpdatedBy = "System",
            DeletedBy = string.Empty
        };
        
        var nightShift = new ShiftMaster
        {
            Id = Guid.NewGuid(),
            ShiftName = "Night Shift",
            ShiftCode = "NGT01",
            ShiftType = "Night",
            StartTime = new TimeSpan(22, 0, 0),
            EndTime = new TimeSpan(6, 0, 0),
            BreakStartTime = new TimeSpan(2, 0, 0),
            BreakEndTime = new TimeSpan(3, 0, 0),
            WorkingHours = 8m,
            GraceTimeInMinutes = 10,
            IsNightShift = true,
            ColorCode = "#6366f1",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System",
            UpdatedBy = "System",
            DeletedBy = string.Empty
        };

        var shifts = new List<ShiftMaster> { morningShift, generalShift, nightShift };
        context.ShiftMasters.AddRange(shifts);

        var employees = context.Employees.ToList();
        var assignments = new List<EmployeeShiftAssignment>();
        var random = new Random();

        foreach (var emp in employees)
        {
            // Assign a random default shift
            var shift = shifts[random.Next(shifts.Count)];
            emp.CurrentShiftId = shift.Id;
            
            assignments.Add(new EmployeeShiftAssignment
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                ShiftId = shift.Id,
                EffectiveFromDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsRotating = false,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            });
        }
        
        context.EmployeeShiftAssignments.AddRange(assignments);
        context.SaveChanges();
    }
}
