using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Persistence.Repositories;

public class ApprovalRepository : IApprovalRepository
{
    private readonly HrmsDbContext _dbContext;

    public ApprovalRepository(HrmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<AttendanceApproval>> GetPendingApprovalsAsync()
    {
        return await _dbContext.AttendanceApprovals
            .Include(a => a.Employee)
                .ThenInclude(e => e.Department)
            .Where(a => a.Status == "Pending")
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ApproveAsync(Guid approvalId, Guid managerId, string? comments)
    {
        var approval = await _dbContext.AttendanceApprovals.FirstOrDefaultAsync(a => a.Id == approvalId);
        if (approval == null || approval.Status != "Pending") return false;

        approval.Status = "Approved";
        approval.ManagerComments = comments;
        approval.ApprovedById = managerId;
        approval.UpdatedBy = managerId.ToString();
        approval.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectAsync(Guid approvalId, Guid managerId, string reason)
    {
        var approval = await _dbContext.AttendanceApprovals.FirstOrDefaultAsync(a => a.Id == approvalId);
        if (approval == null || approval.Status != "Pending") return false;

        approval.Status = "Rejected";
        approval.ManagerComments = reason;
        approval.UpdatedBy = managerId.ToString();
        approval.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return true;
    }
}
