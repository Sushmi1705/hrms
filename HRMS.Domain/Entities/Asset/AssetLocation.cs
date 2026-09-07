using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetLocation : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty; // E.g., HQ - 4th Floor IT Storage Room
    public string Code { get; set; } = string.Empty; // E.g., LOC-HQ-FL04-R402
    
    public Guid? CompanyId { get; set; }
    public Company? Company { get; set; }
    
    public Guid? BusinessUnitId { get; set; }
    public BusinessUnit? BusinessUnit { get; set; }
    
    public Guid? BranchId { get; set; }
    public Branch? Branch { get; set; }
    
    public string Building { get; set; } = string.Empty;
    public string Floor { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public string StorageArea { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
