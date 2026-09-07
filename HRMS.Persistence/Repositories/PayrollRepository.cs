using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Payroll;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Persistence.Repositories;

public class PayrollRepository : IPayrollRepository
{
    private readonly HrmsDbContext _context;

    public PayrollRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PayrollRun>> GetAllPayrollRunsAsync()
    {
        return await _context.Set<PayrollRun>()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<PayrollRun?> GetLatestPayrollRunAsync()
    {
        return await _context.Set<PayrollRun>()
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task<int> GetPendingPayrollCountAsync()
    {
        return await _context.Set<PayrollRun>()
            .CountAsync(p => p.Status == "Processing" || p.Status == "Draft");
    }

    public async Task<decimal> GetTotalPayrollCostAsync(Guid payrollRunId)
    {
        var run = await _context.Set<PayrollRun>().FirstOrDefaultAsync(p => p.Id == payrollRunId);
        return run?.TotalGrossSalary ?? 0;
    }

    public async Task<decimal> GetAverageNetSalaryAsync()
    {
        var latestRun = await GetLatestPayrollRunAsync();
        if (latestRun == null) return 0;
        
        var payslips = await _context.Set<Payslip>()
            .Where(p => p.PayrollRunId == latestRun.Id)
            .Select(p => p.NetSalary)
            .ToListAsync();
            
        return payslips.Any() ? Math.Round(payslips.Average(), 2) : 0;
    }

    public async Task<int> GetActiveLoansCountAsync()
    {
        return await _context.Set<Loan>()
            .CountAsync(l => l.Status == "Active");
    }

    public async Task<decimal> GetTotalTaxDeductedAsync(Guid payrollRunId)
    {
        return await _context.Set<PayslipComponent>()
            .Include(c => c.Payslip)
            .Where(c => c.Payslip!.PayrollRunId == payrollRunId && c.Type == "Tax")
            .SumAsync(c => c.Amount);
    }

    public async Task<decimal> GetTotalOvertimeCostAsync(Guid payrollRunId)
    {
        return await _context.Set<PayslipComponent>()
            .Include(c => c.Payslip)
            .Where(c => c.Payslip!.PayrollRunId == payrollRunId && c.Name.Contains("Overtime"))
            .SumAsync(c => c.Amount);
    }
}
