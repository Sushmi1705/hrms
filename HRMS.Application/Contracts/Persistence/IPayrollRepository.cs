using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Payroll;

namespace HRMS.Application.Contracts.Persistence;

public interface IPayrollRepository
{
    Task<IEnumerable<PayrollRun>> GetAllPayrollRunsAsync();
    Task<PayrollRun?> GetLatestPayrollRunAsync();
    Task<int> GetPendingPayrollCountAsync();
    Task<decimal> GetTotalPayrollCostAsync(Guid payrollRunId);
    
    // Analytics
    Task<decimal> GetAverageNetSalaryAsync();
    Task<int> GetActiveLoansCountAsync();
    Task<decimal> GetTotalTaxDeductedAsync(Guid payrollRunId);
    Task<decimal> GetTotalOvertimeCostAsync(Guid payrollRunId);
}
