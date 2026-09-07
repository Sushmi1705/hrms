using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationPackage : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty; // E.g., Senior Software Engineer Package, Executive Package
    public string Description { get; set; } = string.Empty;
    
    public Guid? PayGradeId { get; set; }
    public PayGrade? PayGrade { get; set; }
    
    public decimal BaseSalary { get; set; }
    public string Currency { get; set; } = "USD";
    public bool IsActive { get; set; } = true;
}
