using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class PayGrade : BaseAuditableEntity
{
    public string Code { get; set; } = string.Empty; // E.g., G1, G2, G3, MGR, DIR, EXEC
    public string Name { get; set; } = string.Empty; // E.g., Associate Level 1, Director, Executive VP
    public string Description { get; set; } = string.Empty;
    public int Level { get; set; } = 1;
    
    public decimal MinimumSalary { get; set; }
    public decimal MidpointSalary { get; set; }
    public decimal MaximumSalary { get; set; }
    public string Currency { get; set; } = "USD";
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Active"; // Active, Inactive, Deprecated

    public ICollection<SalaryBand> SalaryBands { get; set; } = new List<SalaryBand>();
}
