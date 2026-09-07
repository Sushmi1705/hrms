using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class AssetReturn : BaseAuditableEntity
{
    public string ReturnNumber { get; set; } = string.Empty; // E.g., RET-2026-0012
    
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
    // Condition: Good, Fair, Poor, Damaged
    public string Condition { get; set; } = "Good";
    
    public string AccessoriesReturnedJson { get; set; } = "[]";
    public string MissingAccessoriesJson { get; set; } = "[]";
    public string DamageDetails { get; set; } = string.Empty;
    public decimal? DamageChargeAmount { get; set; }
    
    // Status: Requested, Approved, PendingInspection, Completed, Damaged, Lost
    public string Status { get; set; } = "Completed";
    
    public string InspectionNotes { get; set; } = string.Empty;
    public string InspectedBy { get; set; } = string.Empty;
    public DateTime? InspectedAt { get; set; }
    
    public string ProcessedBy { get; set; } = string.Empty;
    // After return, resulting status of the asset (Available or UnderMaintenance)
    public string ResultingAssetStatus { get; set; } = "Available";
}
