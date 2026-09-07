using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using HRMS.Domain.Entities.Leave;
using HRMS.Domain.Entities.Employee;
using Microsoft.EntityFrameworkCore;
using HRMS.Persistence;

namespace HRMS.Persistence.Seeders;

public static class LeaveSeeder
{
    public static async Task SeedLeaveDataAsync(HrmsDbContext context)
    {
        if (await context.LeaveTypes.AnyAsync())
        {
            return;
        }

        var types = new List<LeaveType>
        {
            new LeaveType { Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty, Name = "Annual Leave", Description = "Standard paid time off", IsPaid = true, RequiresAttachment = false, DefaultMaxDaysPerYear = 20, ColorCode = "#3b82f6" },
            new LeaveType { Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty, Name = "Sick Leave", Description = "Paid sick leave", IsPaid = true, RequiresAttachment = true, DefaultMaxDaysPerYear = 10, ColorCode = "#ef4444" },
            new LeaveType { Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty, Name = "Casual Leave", Description = "Short unplanned leave", IsPaid = true, RequiresAttachment = false, DefaultMaxDaysPerYear = 7, ColorCode = "#f59e0b" },
            new LeaveType { Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty, Name = "Loss of Pay (LOP)", Description = "Unpaid leave when balance exhausted", IsPaid = false, RequiresAttachment = false, DefaultMaxDaysPerYear = 365, ColorCode = "#64748b" }
        };

        context.LeaveTypes.AddRange(types);

        var policies = types.Select(t => new LeavePolicy
        {
            Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty,
            LeaveTypeId = t.Id,
            CanCarryForward = t.Name == "Annual Leave",
            MaxCarryForwardDays = t.Name == "Annual Leave" ? 10 : 0,
            AllowNegativeBalance = false,
            MaxNegativeBalance = 0,
            ApplySandwichRule = t.Name == "Annual Leave",
            IncludeHolidays = false,
            IncludeWeekends = false,
            IsEncashable = t.Name == "Annual Leave",
            AvailableOnProbation = t.Name == "Loss of Pay (LOP)"
        }).ToList();

        context.LeavePolicies.AddRange(policies);
        await context.SaveChangesAsync();

        var employees = await context.Employees.ToListAsync();
        var currentYear = DateTime.UtcNow.Year;
        var random = new Random();

        var balances = new List<LeaveBalance>();
        var requests = new List<LeaveRequest>();

        foreach (var emp in employees)
        {
            foreach (var type in types)
            {
                var used = random.Next(0, type.DefaultMaxDaysPerYear / 2);
                var pending = random.Next(0, 2);
                var remaining = type.DefaultMaxDaysPerYear - used - pending;

                balances.Add(new LeaveBalance
                {
                    Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty,
                    EmployeeId = emp.Id,
                    LeaveTypeId = type.Id,
                    Year = currentYear,
                    OpeningBalance = type.DefaultMaxDaysPerYear,
                    Accrued = type.DefaultMaxDaysPerYear,
                    Used = used,
                    Pending = pending,
                    Remaining = remaining,
                    Expired = 0,
                    CarryForward = 0,
                    Encashed = 0
                });

                // Generate 1-2 random leave requests per employee
                if (used > 0)
                {
                    var pastDate = DateTime.UtcNow.AddDays(-random.Next(10, 200));
                    requests.Add(new LeaveRequest
                    {
                        Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty,
                        EmployeeId = emp.Id,
                        LeaveTypeId = type.Id,
                        FromDate = pastDate,
                        ToDate = pastDate.AddDays(used - 1),
                        TotalDays = used,
                        IsHalfDay = false,
                        Reason = "Family visit / Personal reasons",
                        Status = "Approved",
                        ApproverId = emp.ManagerId,
                        ActionDate = pastDate.AddDays(-2)
                    });
                }
                
                if (pending > 0)
                {
                    var futureDate = DateTime.UtcNow.AddDays(random.Next(5, 30));
                    requests.Add(new LeaveRequest
                    {
                        Id = Guid.NewGuid(), CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty,
                        EmployeeId = emp.Id,
                        LeaveTypeId = type.Id,
                        FromDate = futureDate,
                        ToDate = futureDate.AddDays(pending - 1),
                        TotalDays = pending,
                        IsHalfDay = false,
                        Reason = "Upcoming vacation",
                        Status = "Pending"
                    });
                }
            }
        }

        context.LeaveBalances.AddRange(balances);
        
        // Batch save requests to avoid memory issues
        for (int i = 0; i < requests.Count; i += 1000)
        {
            var batch = requests.Skip(i).Take(1000).ToList();
            context.LeaveRequests.AddRange(batch);
            await context.SaveChangesAsync();
        }
        
        await context.SaveChangesAsync();
    }
}


