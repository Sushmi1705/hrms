using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class BenefitEligibilityRule : BaseAuditableEntity
{
    public Guid BenefitPlanId { get; set; }
    public BenefitPlan? BenefitPlan { get; set; }
    
    // FullTime, PartTime, Contractor, All
    public string EmploymentType { get; set; } = "FullTime";
    
    public Guid? MinimumJobGradeId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }
    
    public int MinTenureMonths { get; set; } = 0; // Wait period before eligible
    public string RuleDescription { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
