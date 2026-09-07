using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Interfaces.Repositories.Leave;
using HRMS.Domain.Entities.Leave;

namespace HRMS.Persistence.Repositories.Leave;

public class LeaveRepository : ILeaveRepository
{
    private readonly HrmsDbContext _context;

    public LeaveRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<LeaveType?> GetLeaveTypeByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveTypes.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
    }

    public async Task<List<LeaveType>> GetAllLeaveTypesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.LeaveTypes.ToListAsync(cancellationToken);
    }

    public async Task<LeaveBalance?> GetEmployeeLeaveBalanceAsync(Guid employeeId, Guid leaveTypeId, int year, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveBalances
            .Include(lb => lb.LeaveType)
            .FirstOrDefaultAsync(lb => lb.EmployeeId == employeeId && lb.LeaveTypeId == leaveTypeId && lb.Year == year, cancellationToken);
    }

    public async Task<List<LeaveBalance>> GetAllEmployeeBalancesAsync(Guid employeeId, int year, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveBalances
            .Include(lb => lb.LeaveType)
            .Where(lb => lb.EmployeeId == employeeId && lb.Year == year)
            .ToListAsync(cancellationToken);
    }

    public async Task<LeaveRequest?> GetLeaveRequestByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.Employee)
            .FirstOrDefaultAsync(lr => lr.Id == id, cancellationToken);
    }

    public async Task<List<LeaveRequest>> GetEmployeeLeaveRequestsAsync(Guid employeeId, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Where(lr => lr.EmployeeId == employeeId)
            .OrderByDescending(lr => lr.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<LeaveRequest>> GetPendingApprovalsForManagerAsync(Guid managerId, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.Employee)
            .Where(lr => lr.ApproverId == managerId && lr.Status == "Pending")
            .OrderBy(lr => lr.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<LeaveRequest>> GetAllLeaveRequestsAsync(DateTime? startDate = null, DateTime? endDate = null, string? status = null, CancellationToken cancellationToken = default)
    {
        var query = _context.LeaveRequests
            .Include(lr => lr.LeaveType)
            .Include(lr => lr.Employee)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(lr => lr.FromDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(lr => lr.ToDate <= endDate.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(lr => lr.Status == status);

        return await query.OrderByDescending(lr => lr.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<bool> HasOverlappingLeaveAsync(Guid employeeId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.LeaveRequests
            .AnyAsync(lr => lr.EmployeeId == employeeId 
                && lr.Status != "Rejected" 
                && lr.Status != "Cancelled" 
                && lr.FromDate <= endDate 
                && lr.ToDate >= startDate, cancellationToken);
    }

    public async Task<LeaveRequest> AddLeaveRequestAsync(LeaveRequest request, CancellationToken cancellationToken = default)
    {
        _context.LeaveRequests.Add(request);
        await _context.SaveChangesAsync(cancellationToken);
        return request;
    }

    public async Task UpdateLeaveRequestAsync(LeaveRequest request, CancellationToken cancellationToken = default)
    {
        _context.LeaveRequests.Update(request);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateLeaveBalanceAsync(LeaveBalance balance, CancellationToken cancellationToken = default)
    {
        _context.LeaveBalances.Update(balance);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
