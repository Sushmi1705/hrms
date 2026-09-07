using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Application.Contracts.Persistence;

public interface IApprovalRepository
{
    Task<List<AttendanceApproval>> GetPendingApprovalsAsync();
    Task<bool> ApproveAsync(Guid approvalId, Guid managerId, string? comments);
    Task<bool> RejectAsync(Guid approvalId, Guid managerId, string reason);
}
