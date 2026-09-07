using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Leave;

namespace HRMS.Application.Interfaces.Repositories.Leave;

public interface ILeaveRepository
{
    Task<LeaveType?> GetLeaveTypeByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<LeaveType>> GetAllLeaveTypesAsync(CancellationToken cancellationToken = default);
    
    Task<LeaveBalance?> GetEmployeeLeaveBalanceAsync(Guid employeeId, Guid leaveTypeId, int year, CancellationToken cancellationToken = default);
    Task<List<LeaveBalance>> GetAllEmployeeBalancesAsync(Guid employeeId, int year, CancellationToken cancellationToken = default);
    
    Task<LeaveRequest?> GetLeaveRequestByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<LeaveRequest>> GetEmployeeLeaveRequestsAsync(Guid employeeId, CancellationToken cancellationToken = default);
    Task<List<LeaveRequest>> GetPendingApprovalsForManagerAsync(Guid managerId, CancellationToken cancellationToken = default);
    Task<List<LeaveRequest>> GetAllLeaveRequestsAsync(DateTime? startDate = null, DateTime? endDate = null, string? status = null, CancellationToken cancellationToken = default);
    
    Task<bool> HasOverlappingLeaveAsync(Guid employeeId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    
    Task<LeaveRequest> AddLeaveRequestAsync(LeaveRequest request, CancellationToken cancellationToken = default);
    Task UpdateLeaveRequestAsync(LeaveRequest request, CancellationToken cancellationToken = default);
    Task UpdateLeaveBalanceAsync(LeaveBalance balance, CancellationToken cancellationToken = default);
}
