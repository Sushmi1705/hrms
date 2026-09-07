using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class Asset : BaseAuditableEntity
{
    public string AssetTag { get; set; } = string.Empty; // E.g., AST-2026-00101 (Unique per tenant)
    public string AssetName { get; set; } = string.Empty;
    
    public Guid CategoryId { get; set; }
    public AssetCategory? Category { get; set; }
    
    public Guid? ModelId { get; set; }
    public AssetModel? Model { get; set; }
    
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Purchase & Vendor Information
    public DateTime PurchaseDate { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = "USD";
    public Guid? VendorId { get; set; }
    public AssetVendor? Vendor { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string PoNumber { get; set; } = string.Empty;
    
    // Warranty Information
    public DateTime? WarrantyStartDate { get; set; }
    public DateTime? WarrantyEndDate { get; set; }
    
    // Status & Physical Condition
    // Status: Draft, Ordered, Received, Available, Reserved, Assigned, InTransit, UnderMaintenance, Lost, Damaged, Retired, Disposed
    public string Status { get; set; } = "Available"; 
    // Condition: New, Good, Fair, Poor, Damaged
    public string Condition { get; set; } = "Good";
    
    // Location & Custodian
    public Guid? LocationId { get; set; }
    public AssetLocation? Location { get; set; }
    
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public Guid? CurrentCustodianEmployeeId { get; set; }
    public EmployeeEntity? CurrentCustodianEmployee { get; set; }
    
    // Financial & Depreciation
    public int UsefulLifeMonths { get; set; } = 36;
    // DepreciationMethod: StraightLine, DecliningBalance
    public string DepreciationMethod { get; set; } = "StraightLine";
    public decimal SalvageValue { get; set; } = 0;
    public decimal CurrentBookValue { get; set; } = 0;
    
    // Physical Audit Dates
    public DateTime? LastAuditDate { get; set; }
    public DateTime? NextAuditDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    // Collections
    public ICollection<AssetAssignment> Assignments { get; set; } = new List<AssetAssignment>();
    public ICollection<AssetTransfer> Transfers { get; set; } = new List<AssetTransfer>();
    public ICollection<AssetMaintenance> MaintenanceRecords { get; set; } = new List<AssetMaintenance>();
    public ICollection<AssetReturn> Returns { get; set; } = new List<AssetReturn>();
    public ICollection<AssetIncident> Incidents { get; set; } = new List<AssetIncident>();
    public ICollection<AssetDepreciation> Depreciations { get; set; } = new List<AssetDepreciation>();
    public ICollection<AssetDocument> Documents { get; set; } = new List<AssetDocument>();
    public ICollection<AssetWarranty> Warranties { get; set; } = new List<AssetWarranty>();
}
