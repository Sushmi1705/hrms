using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Shift;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Persistence.Repositories;

public class ShiftRepository : IShiftRepository
{
    private readonly HrmsDbContext _context;

    public ShiftRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ShiftMaster>> GetAllShiftsAsync()
    {
        return await _context.Set<ShiftMaster>().ToListAsync();
    }

    public async Task<ShiftMaster?> GetShiftByIdAsync(Guid id)
    {
        return await _context.Set<ShiftMaster>().FindAsync(id);
    }

    public async Task<ShiftMaster> CreateShiftAsync(ShiftMaster shift)
    {
        _context.Set<ShiftMaster>().Add(shift);
        await _context.SaveChangesAsync();
        return shift;
    }

    public async Task<ShiftMaster> UpdateShiftAsync(ShiftMaster shift)
    {
        _context.Entry(shift).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return shift;
    }

    public async Task DeleteShiftAsync(Guid id)
    {
        var shift = await GetShiftByIdAsync(id);
        if (shift != null)
        {
            _context.Set<ShiftMaster>().Remove(shift);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<EmployeeShiftAssignment>> GetEmployeeAssignmentsAsync(Guid employeeId)
    {
        return await _context.Set<EmployeeShiftAssignment>()
            .Include(a => a.Shift)
            .Where(a => a.EmployeeId == employeeId)
            .ToListAsync();
    }

    public async Task<IEnumerable<EmployeeShiftAssignment>> GetAllAssignmentsAsync()
    {
        return await _context.Set<EmployeeShiftAssignment>()
            .Include(a => a.Shift)
            .Include(a => a.Employee)
            .ToListAsync();
    }

    public async Task<EmployeeShiftAssignment> CreateAssignmentAsync(EmployeeShiftAssignment assignment)
    {
        _context.Set<EmployeeShiftAssignment>().Add(assignment);
        await _context.SaveChangesAsync();
        return assignment;
    }
}
