using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class AssetAudit : BaseAuditableEntity
{
    public string AuditCode { get; set; } = string.Empty; // AUD-2026-Q1
    public string Name { get; set; } = string.Empty; // Q1 2026 Corporate Hardware Physical Audit
    
    public Guid? LocationId { get; set; }
    public AssetLocation? Location { get; set; }
    
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    
    public Guid? AssignedAuditorEmployeeId { get; set; }
    public EmployeeEntity? AssignedAuditor { get; set; }
    
    // Status: Planned, InProgress, Completed, Cancelled
    public string Status { get; set; } = "Completed";
    
    public int TotalAssetsCount { get; set; } = 0;
    public int VerifiedCount { get; set; } = 0;
    public int MissingCount { get; set; } = 0;
    public int DiscrepancyCount { get; set; } = 0;
    public string SummaryNotes { get; set; } = string.Empty;

    public ICollection<AssetAuditItem> Items { get; set; } = new List<AssetAuditItem>();
}

public class AssetAuditItem : BaseAuditableEntity
{
    public Guid AuditId { get; set; }
    public AssetAudit? Audit { get; set; }
    
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public Guid? ExpectedLocationId { get; set; }
    public Guid? ActualLocationId { get; set; }
    
    public Guid? ExpectedEmployeeId { get; set; }
    public Guid? ActualEmployeeId { get; set; }
    
    public string ExpectedCondition { get; set; } = "Good";
    public string ActualCondition { get; set; } = "Good";
    
    // Status: Verified, Missing, Moved, Damaged, Mismatch
    public string Status { get; set; } = "Verified";
    
    public DateTime? VerificationDate { get; set; }
    public string VerifiedBy { get; set; } = string.Empty;
    public string DiscrepancyNotes { get; set; } = string.Empty;
    public bool ScannedViaQr { get; set; } = true;
}
