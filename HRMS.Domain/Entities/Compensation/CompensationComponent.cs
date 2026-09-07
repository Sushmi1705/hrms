using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationComponent : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty; // E.g., BASIC, HRA, TRANS, MED, PERF_BONUS
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Earnings, Deduction, EmployerContribution, EmployeeContribution, Benefit
    public string Type { get; set; } = "Earnings";
    
    // FixedAmount, Percentage, Formula, Manual
    public string CalculationType { get; set; } = "FixedAmount";
    
    public decimal DefaultValue { get; set; }
    public decimal Percentage { get; set; }
    public Guid? BasedOnComponentId { get; set; } // E.g. HRA based on 40% of Basic Salary
    public CompensationComponent? BasedOnComponent { get; set; }
    
    public bool IsTaxable { get; set; } = true;
    public bool IsPensionable { get; set; } = false;
    public bool IsRecurring { get; set; } = true;
    public bool IsActive { get; set; } = true;
    
    public DateTime? EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
}
