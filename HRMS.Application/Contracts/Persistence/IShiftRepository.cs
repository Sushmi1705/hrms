using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Shift;

namespace HRMS.Application.Contracts.Persistence;

public interface IShiftRepository
{
    Task<IEnumerable<ShiftMaster>> GetAllShiftsAsync();
    Task<ShiftMaster?> GetShiftByIdAsync(Guid id);
    Task<ShiftMaster> CreateShiftAsync(ShiftMaster shift);
    Task<ShiftMaster> UpdateShiftAsync(ShiftMaster shift);
    Task DeleteShiftAsync(Guid id);
    
    Task<IEnumerable<EmployeeShiftAssignment>> GetEmployeeAssignmentsAsync(Guid employeeId);
    Task<IEnumerable<EmployeeShiftAssignment>> GetAllAssignmentsAsync();
    Task<EmployeeShiftAssignment> CreateAssignmentAsync(EmployeeShiftAssignment assignment);
}
