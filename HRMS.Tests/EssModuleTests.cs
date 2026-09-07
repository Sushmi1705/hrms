using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Employee.DTOs;
using HRMS.Domain.Entities.Attendance;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Leave;
using HRMS.Domain.Entities.Payroll;
using HRMS.Persistence;
using HRMS.Persistence.Repositories;
using Moq;

namespace HRMS.Tests;

public class EssModuleTests
{
    private (HrmsDbContext context, EssRepository repo, Guid tenantId, EmployeeEntity emp1, EmployeeEntity emp2) CreateTestContext()
    {
        var options = new DbContextOptionsBuilder<HrmsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new HrmsDbContext(options);
        var tenantId = Guid.NewGuid();

        var tenantContextMock = new Mock<ITenantContext>();
        tenantContextMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var emp1 = new EmployeeEntity
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            EmployeeNumber = "EMP-TEST-001",
            FirstName = "Alice",
            LastName = "Johnson",
            Email = "alice.johnson@acme.com",
            JoiningDate = new DateTime(2024, 1, 15),
            Status = "Active"
        };

        var emp2 = new EmployeeEntity
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            EmployeeNumber = "EMP-TEST-002",
            FirstName = "Bob",
            LastName = "Smith",
            Email = "bob.smith@acme.com",
            JoiningDate = new DateTime(2024, 3, 1),
            Status = "Active"
        };

        context.Employees.AddRange(emp1, emp2);

        // Leave Types & Balances
        var leaveType = new LeaveType
        {
            Id = Guid.NewGuid(),
            Name = "Annual Paid Leave",
            Description = "Standard annual leave",
            IsPaid = true,
            DefaultMaxDaysPerYear = 20,
            ColorCode = "#3b82f6"
        };
        context.LeaveTypes.Add(leaveType);

        var balance1 = new LeaveBalance
        {
            Id = Guid.NewGuid(),
            EmployeeId = emp1.Id,
            LeaveTypeId = leaveType.Id,
            Year = DateTime.UtcNow.Year,
            OpeningBalance = 20,
            Accrued = 0,
            Used = 2,
            Pending = 0,
            Remaining = 18
        };
        context.LeaveBalances.Add(balance1);

        // Payslips
        var run = new PayrollRun
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            Month = "August 2026",
            ProcessDate = DateTime.UtcNow,
            Status = "Paid"
        };
        context.PayrollRuns.Add(run);

        var payslip1 = new Payslip
        {
            Id = Guid.NewGuid(),
            PayrollRunId = run.Id,
            EmployeeId = emp1.Id,
            GrossSalary = 8000,
            TotalAllowances = 2000,
            TotalDeductions = 1600,
            NetSalary = 6400,
            Status = "Paid"
        };
        var payslip2 = new Payslip
        {
            Id = Guid.NewGuid(),
            PayrollRunId = run.Id,
            EmployeeId = emp2.Id,
            GrossSalary = 9500,
            TotalAllowances = 2500,
            TotalDeductions = 2000,
            NetSalary = 7500,
            Status = "Paid"
        };
        context.Payslips.AddRange(payslip1, payslip2);

        context.SaveChanges();

        var repo = new EssRepository(context, tenantContextMock.Object);
        return (context, repo, tenantId, emp1, emp2);
    }

    [Fact]
    public async Task ResolveCurrentEmployee_ShouldRespectIdOrEmailWithoutIdor()
    {
        var (context, repo, tenantId, emp1, emp2) = CreateTestContext();

        // 1. Resolve by explicit ID
        var resolvedById = await repo.ResolveCurrentEmployeeAsync(emp1.Id);
        Assert.NotNull(resolvedById);
        Assert.Equal("Alice", resolvedById.FirstName);

        // 2. Resolve by email
        var resolvedByEmail = await repo.ResolveCurrentEmployeeAsync(null, "bob.smith@acme.com");
        Assert.NotNull(resolvedByEmail);
        Assert.Equal("Bob", resolvedByEmail.FirstName);

        // 3. Fallback when neither provided
        var fallback = await repo.ResolveCurrentEmployeeAsync(null, null);
        Assert.NotNull(fallback);
        Assert.Equal("Active", fallback.Status);
    }

    [Fact]
    public async Task WebClock_ClockInAndClockOut_ShouldUpdateWorkedDurationAndPreventDuplicate()
    {
        var (context, repo, tenantId, emp1, _) = CreateTestContext();

        // 1. Clock In
        var statusAfterIn = await repo.ClockInAsync(emp1.Id, new ClockInRequestDto
        {
            Location = "Austin HQ",
            Device = "Web Browser"
        });

        Assert.True(statusAfterIn.IsClockedIn);
        Assert.NotNull(statusAfterIn.ClockInTime);
        Assert.Null(statusAfterIn.ClockOutTime);

        // 2. Duplicate Clock In should fail with InvalidOperationException
        await Assert.ThrowsAsync<InvalidOperationException>(() => repo.ClockInAsync(emp1.Id, new ClockInRequestDto()));

        // 3. Clock Out
        var statusAfterOut = await repo.ClockOutAsync(emp1.Id, new ClockOutRequestDto
        {
            Location = "Austin HQ",
            Device = "Web Browser"
        });

        Assert.False(statusAfterOut.IsClockedIn);
        Assert.NotNull(statusAfterOut.ClockOutTime);
        Assert.Equal("Completed Shift", statusAfterOut.Status);
    }

    [Fact]
    public async Task Leave_ApplyLeave_ShouldUpdatePendingBalanceAndPreventOverlap()
    {
        var (context, repo, tenantId, emp1, _) = CreateTestContext();
        var leaveType = await context.LeaveTypes.FirstAsync();

        var applyDto = new ApplyEssLeaveDto
        {
            LeaveTypeId = leaveType.Id,
            FromDate = DateTime.UtcNow.Date.AddDays(5),
            ToDate = DateTime.UtcNow.Date.AddDays(7),
            IsHalfDay = false,
            Reason = "Vacation with family"
        };

        // 1. Apply Leave
        var req = await repo.ApplyLeaveAsync(emp1.Id, applyDto);
        Assert.NotNull(req);
        Assert.Equal("Pending", req.Status);
        Assert.Equal(3, req.TotalDays);

        // Verify balance updated
        var balances = await repo.GetLeaveBalancesAsync(emp1.Id, DateTime.UtcNow.Year);
        var annualBal = balances.First(b => b.LeaveTypeId == leaveType.Id);
        Assert.Equal(3, annualBal.Pending);

        // 2. Overlap application should be rejected
        var overlappingDto = new ApplyEssLeaveDto
        {
            LeaveTypeId = leaveType.Id,
            FromDate = DateTime.UtcNow.Date.AddDays(6),
            ToDate = DateTime.UtcNow.Date.AddDays(9),
            Reason = "Overlapping leave attempt"
        };

        await Assert.ThrowsAsync<InvalidOperationException>(() => repo.ApplyLeaveAsync(emp1.Id, overlappingDto));

        // 3. Cancel Leave
        var cancelSuccess = await repo.CancelLeaveAsync(emp1.Id, req.Id);
        Assert.True(cancelSuccess);

        var reqAfterCancel = await context.LeaveRequests.FindAsync(req.Id);
        Assert.Equal("Cancelled", reqAfterCancel!.Status);
    }

    [Fact]
    public async Task Payslips_IdorProtection_EmployeeCannotAccessOthersPayslip()
    {
        var (context, repo, tenantId, emp1, emp2) = CreateTestContext();

        var emp1Payslip = await context.Payslips.FirstAsync(p => p.EmployeeId == emp1.Id);
        var emp2Payslip = await context.Payslips.FirstAsync(p => p.EmployeeId == emp2.Id);

        // 1. Alice views her own payslip -> Success
        var aliceDetail = await repo.GetPayslipDetailAsync(emp1.Id, emp1Payslip.Id);
        Assert.NotNull(aliceDetail);
        Assert.Equal(8000, aliceDetail.GrossSalary);
        Assert.Equal(6400, aliceDetail.NetSalary);

        // 2. Alice tries to view Bob's payslip -> Null / Access Denied (IDOR Protected)
        var idorAttempt = await repo.GetPayslipDetailAsync(emp1.Id, emp2Payslip.Id);
        Assert.Null(idorAttempt);
    }

    [Fact]
    public async Task CentralizedHRRequests_CreateAndAddComments_ShouldPersistThread()
    {
        var (context, repo, tenantId, emp1, _) = CreateTestContext();

        // 1. Create HR service request
        var created = await repo.CreateHRRequestAsync(emp1.Id, new CreateHRRequestDto
        {
            Category = "IT_Support",
            Subject = "Need second external monitor for development",
            Description = "Requesting 27-inch 4K monitor for Austin office desk",
            Priority = "Medium"
        });

        Assert.NotNull(created);
        Assert.StartsWith("HR-REQ-", created.RequestNumber);
        Assert.Equal("Submitted", created.Status);

        // 2. Add Comment
        var comment = await repo.AddHRRequestCommentAsync(created.Id, "Alice Johnson", "Also requesting a DisplayPort cable if available.");
        Assert.NotNull(comment);
        Assert.Equal("Alice Johnson", comment.AuthorName);

        // 3. Retrieve request
        var fetched = await repo.GetHRRequestByIdAsync(emp1.Id, created.Id);
        Assert.NotNull(fetched);
        Assert.Single(fetched.Comments);
        Assert.Equal("Also requesting a DisplayPort cable if available.", fetched.Comments[0].Message);
    }
}
