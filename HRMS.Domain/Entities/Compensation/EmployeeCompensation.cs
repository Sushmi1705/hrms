using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class EmployeeCompensation : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid? PayGradeId { get; set; }
    public PayGrade? PayGrade { get; set; }
    
    public Guid? SalaryBandId { get; set; }
    public SalaryBand? SalaryBand { get; set; }
    
    public decimal BaseSalary { get; set; }
    public string Currency { get; set; } = "USD";
    
    public decimal AnnualTotalCompensation { get; set; }
    public decimal MonthlyTotalCompensation { get; set; }
    public decimal CompaRatio { get; set; } = 1.0m; // BaseSalary / Band Midpoint
    
    // Effective Dating
    public DateTime EffectiveDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; } = true;
    
    // Draft, PendingApproval, Active, Superseded
    public string Status { get; set; } = "Active";
    public string Notes { get; set; } = string.Empty;

    public ICollection<CompensationComponentAssignment> Assignments { get; set; } = new List<CompensationComponentAssignment>();
}
