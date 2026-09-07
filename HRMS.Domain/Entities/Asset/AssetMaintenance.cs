using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetMaintenance : BaseAuditableEntity
{
    public string MaintenanceNumber { get; set; } = string.Empty; // E.g., MNT-2026-0089
    
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    // Type: Preventive, Corrective, Warranty, Upgrade
    public string MaintenanceType { get; set; } = "Preventive";
    public string ServiceProvider { get; set; } = string.Empty; // In-House IT, Dell ProSupport, AppleCare Genius
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? CompletionDate { get; set; }
    
    public string Issue { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string WorkPerformed { get; set; } = string.Empty;
    
    public decimal Cost { get; set; } = 0;
    public bool WarrantyCovered { get; set; } = false;
    public string InvoiceNumber { get; set; } = string.Empty;
    public string TechnicianName { get; set; } = string.Empty;
    
    // Status: Scheduled, InProgress, Completed, Cancelled
    public string Status { get; set; } = "Completed";
    public string Notes { get; set; } = string.Empty;
}
