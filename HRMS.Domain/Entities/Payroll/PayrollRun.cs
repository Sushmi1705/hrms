using System;
using System.Collections.Generic;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Payroll;

public class PayrollRun : ITenantEntity
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; } = Guid.Empty;
    public string Month { get; set; } = string.Empty; // e.g. "August 2026"
    public DateTime ProcessDate { get; set; }
    public string Status { get; set; } = string.Empty; // Draft, Processing, Approved, Paid
    public decimal TotalNetSalary { get; set; }
    public decimal TotalGrossSalary { get; set; }
    public decimal TotalDeductions { get; set; }
    public string ProcessedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
}

public class Payslip
{
    public Guid Id { get; set; }
    public Guid PayrollRunId { get; set; }
    public Guid EmployeeId { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal NetSalary { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalDeductions { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Published, Paid
    
    public PayrollRun? PayrollRun { get; set; }
    public ICollection<PayslipComponent> Components { get; set; } = new List<PayslipComponent>();
}

public class PayslipComponent
{
    public Guid Id { get; set; }
    public Guid PayslipId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Allowance, Deduction, Tax, Bonus
    public decimal Amount { get; set; }
    
    public Payslip? Payslip { get; set; }
}
