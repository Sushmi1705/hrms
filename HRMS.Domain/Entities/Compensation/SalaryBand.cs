using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class SalaryBand : BaseAuditableEntity
{
    public Guid PayGradeId { get; set; }
    public PayGrade? PayGrade { get; set; }
    
    public string BandName { get; set; } = string.Empty; // E.g., Band A - HQ, Band B - Regional
    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }
    public string Country { get; set; } = "United States";
    
    public decimal Minimum { get; set; }
    public decimal Midpoint { get; set; }
    public decimal Maximum { get; set; }
    public string Currency { get; set; } = "USD";
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
