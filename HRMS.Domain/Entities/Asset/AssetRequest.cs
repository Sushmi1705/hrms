using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Domain.Entities.Asset;

public class AssetRequest : BaseAuditableEntity
{
    public string RequestNumber { get; set; } = string.Empty; // E.g., ARQ-2026-0045
    
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid CategoryId { get; set; }
    public AssetCategory? Category { get; set; }
    
    public Guid? ModelId { get; set; }
    public AssetModel? Model { get; set; }
    
    public int Quantity { get; set; } = 1;
    public string Reason { get; set; } = string.Empty; // New Hire, Hardware Upgrade, Replacement for Damaged
    public DateTime RequiredDate { get; set; }
    public string Priority { get; set; } = "Normal"; // Low, Normal, High, Urgent
    
    // Status: Draft, Submitted, PendingApproval, Approved, Rejected, Fulfilled, Cancelled
    public string Status { get; set; } = "PendingApproval";
    
    // Integration with Workflow Engine
    public Guid? ApprovalRequestId { get; set; }
    public ApprovalRequest? WorkflowApprovalRequest { get; set; }
    public string ApproverComments { get; set; } = string.Empty;
    public string ReviewedBy { get; set; } = string.Empty;
    public DateTime? ReviewedAt { get; set; }
    
    // Fulfillment
    public Guid? FulfilledAssetId { get; set; }
    public Asset? FulfilledAsset { get; set; }
    public DateTime? FulfilledDate { get; set; }
    public string Notes { get; set; } = string.Empty;
}
