using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetModel : BaseAuditableEntity
{
    public Guid CategoryId { get; set; }
    public AssetCategory? Category { get; set; }
    
    public string Manufacturer { get; set; } = string.Empty; // Apple, Dell, HP, Lenovo, Cisco, Samsung
    public string ModelName { get; set; } = string.Empty;    // MacBook Pro 16", Latitude 5450, ThinkPad X1
    public string ModelNumber { get; set; } = string.Empty;  // A2991, 5450-G2, 21HM0004US
    public string Specifications { get; set; } = string.Empty; // CPU, RAM, Storage, Screen, etc.
    public int WarrantyPeriodMonths { get; set; } = 36;
    public int DefaultUsefulLifeMonths { get; set; } = 36;
    public bool IsActive { get; set; } = true;

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
