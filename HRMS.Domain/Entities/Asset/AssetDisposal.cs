using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetDisposal : BaseAuditableEntity
{
    public string DisposalNumber { get; set; } = string.Empty; // DSP-2026-0008
    
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public DateTime DisposalDate { get; set; } = DateTime.UtcNow;
    
    // Reason: EndOfUsefulLife, Damaged, Obsolete, Lost, Sold, Donated, WrittenOff, Other
    public string DisposalReason { get; set; } = "Obsolete";
    
    // Method: Sale, Recycling, Scrap, Donation, Destruction
    public string DisposalMethod { get; set; } = "Recycling";
    
    public decimal SaleValue { get; set; } = 0;
    public string BuyerVendorName { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public DateTime? ApprovalDate { get; set; }
    
    // Status: PendingApproval, Approved, Completed, Cancelled
    public string Status { get; set; } = "Completed";
    public string Notes { get; set; } = string.Empty;
    public string CertificateUrl { get; set; } = string.Empty;
}
