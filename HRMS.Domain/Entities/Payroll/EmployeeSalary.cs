using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Payroll;

public class EmployeeSalary
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public Guid SalaryStructureId { get; set; }
    public decimal GrossSalary { get; set; }
    public DateTime EffectiveDate { get; set; }
    public bool IsActive { get; set; } = true;

    public EmployeeEntity? Employee { get; set; }
    public SalaryStructure? SalaryStructure { get; set; }
}


