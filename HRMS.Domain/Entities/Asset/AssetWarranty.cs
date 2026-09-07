using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetWarranty : BaseAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public string WarrantyProvider { get; set; } = string.Empty; // Dell ProSupport Plus, AppleCare+ Enterprise
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Type: Manufacturer, Extended, OnSite, AccidentalDamage
    public string WarrantyType { get; set; } = "Manufacturer";
    public string CoverageDetails { get; set; } = string.Empty;
    public string ContractNumber { get; set; } = string.Empty;
    
    public string SupportPhone { get; set; } = string.Empty;
    public string SupportEmail { get; set; } = string.Empty;
    
    // Status: Active, ExpiringSoon, Expired
    public string Status { get; set; } = "Active";
}
