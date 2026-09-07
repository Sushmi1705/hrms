using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class PromotionRecommendation : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid ManagerId { get; set; }
    public EmployeeEntity? Manager { get; set; }
    
    public string CurrentRole { get; set; } = string.Empty;
    public string RecommendedRole { get; set; } = string.Empty;
    public decimal CurrentSalary { get; set; }
    public decimal RecommendedSalary { get; set; }
    
    public DateTime EffectiveDate { get; set; }
    public string Justification { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
}


