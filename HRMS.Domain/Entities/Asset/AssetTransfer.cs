using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Asset;

public class AssetTransfer : BaseAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    // Custodians
    public Guid? FromEmployeeId { get; set; }
    public EmployeeEntity? FromEmployee { get; set; }
    
    public Guid? ToEmployeeId { get; set; }
    public EmployeeEntity? ToEmployee { get; set; }
    
    // Locations
    public Guid? FromLocationId { get; set; }
    public AssetLocation? FromLocation { get; set; }
    
    public Guid? ToLocationId { get; set; }
    public AssetLocation? ToLocation { get; set; }
    
    // Departments
    public Guid? FromDepartmentId { get; set; }
    public Department? FromDepartment { get; set; }
    
    public Guid? ToDepartmentId { get; set; }
    public Department? ToDepartment { get; set; }
    
    public DateTime TransferDate { get; set; } = DateTime.UtcNow;
    public DateTime? ReceivedDate { get; set; }
    
    public string InitiatedBy { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty; // Role Change, Office Relocation, Project Reassignment
    public string Condition { get; set; } = "Good";
    public string Status { get; set; } = "Received"; // Initiated, InTransit, Received, Cancelled
    public string Comments { get; set; } = string.Empty;
}
