using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationComponentAssignment : BaseAuditableEntity
{
    public Guid EmployeeCompensationId { get; set; }
    public EmployeeCompensation? EmployeeCompensation { get; set; }
    
    public Guid ComponentId { get; set; }
    public CompensationComponent? Component { get; set; }
    
    public decimal Amount { get; set; }
    public decimal Percentage { get; set; }
    public decimal CalculatedMonthlyAmount { get; set; }
    public decimal CalculatedAnnualAmount { get; set; }
    public string Notes { get; set; } = string.Empty;
}
