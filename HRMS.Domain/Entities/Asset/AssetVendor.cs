using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetVendor : BaseAuditableEntity
{
    public string VendorName { get; set; } = string.Empty; // Dell Technologies, Apple Direct, CDW Enterprise
    public string VendorCode { get; set; } = string.Empty; // VND-DELL-01
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // Active, Preferred, Inactive, Suspended
    public string Notes { get; set; } = string.Empty;

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
