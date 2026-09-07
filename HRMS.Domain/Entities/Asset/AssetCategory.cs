using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetCategory : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty; // Laptop, Desktop, Mobile Phone, Server, Vehicle, Furniture, etc.
    public string Code { get; set; } = string.Empty; // LAP, DSK, MOB, SRV, VEH, FUR
    public string Description { get; set; } = string.Empty;
    public string AssetType { get; set; } = "Hardware"; // Hardware, Software, Facility, Vehicle, Furniture, Equipment
    public string DepreciationMethod { get; set; } = "StraightLine"; // StraightLine, DecliningBalance
    public int UsefulLifeMonths { get; set; } = 36;
    public bool RequiresSerialNumber { get; set; } = true;
    public bool RequiresAssignment { get; set; } = true;
    public bool RequiresApproval { get; set; } = true;
    public bool IsActive { get; set; } = true;

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public ICollection<AssetModel> Models { get; set; } = new List<AssetModel>();
}
