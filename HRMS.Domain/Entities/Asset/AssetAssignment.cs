using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class AssetAssignment : BaseAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public Guid? LocationId { get; set; }
    public AssetLocation? Location { get; set; }
    
    public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedReturnDate { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    
    // Condition & accessories checklist
    public string ConditionAtHandover { get; set; } = "Good"; // New, Good, Fair
    public string AccessoriesJson { get; set; } = "[]"; // e.g. ["Power Adapter", "USB-C Cable", "Laptop Bag", "Mouse"]
    public string HandoverNotes { get; set; } = string.Empty;
    
    // Digital Handover & Acknowledgement
    public string AcknowledgementStatus { get; set; } = "Pending"; // Pending, Acknowledged, Disputed
    public DateTime? AcknowledgementDate { get; set; }
    public string DigitalSignature { get; set; } = string.Empty; // e.g. employee digital sign confirmation
    public string AcknowledgedComments { get; set; } = string.Empty;
    
    public string AssignedBy { get; set; } = string.Empty;
    // Status: Active, Returned, Transferred
    public string Status { get; set; } = "Active";
}
