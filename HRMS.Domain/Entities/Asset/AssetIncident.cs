using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class AssetIncident : BaseAuditableEntity
{
    public string IncidentNumber { get; set; } = string.Empty; // INC-2026-0031
    
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public Guid? EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    // Type: Lost, Theft, Damage, Missing, Misuse, SecurityIncident, Other
    public string IncidentType { get; set; } = "Damage";
    
    public DateTime IncidentDate { get; set; } = DateTime.UtcNow;
    public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
    
    // Severity: Low, Medium, High, Critical
    public string Severity { get; set; } = "Medium";
    public decimal EstimatedLoss { get; set; } = 0;
    
    public string Description { get; set; } = string.Empty;
    public string Resolution { get; set; } = string.Empty;
    
    // Status: Reported, Investigating, Resolved, Closed
    public string Status { get; set; } = "Resolved";
    public string ResolvedBy { get; set; } = string.Empty;
    public DateTime? ResolvedAt { get; set; }
}
