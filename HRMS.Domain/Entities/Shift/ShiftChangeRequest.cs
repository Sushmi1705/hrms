using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Shift;

public class ShiftChangeRequest : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid CurrentShiftId { get; set; }
    public ShiftMaster? CurrentShift { get; set; }
    
    public Guid RequestedShiftId { get; set; }
    public ShiftMaster? RequestedShift { get; set; }
    
    public DateTime RequestFromDate { get; set; }
    public DateTime RequestToDate { get; set; }
    
    public string Reason { get; set; } = string.Empty;
    
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    
    public Guid? ApprovedById { get; set; }
    public EmployeeEntity? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ManagerComments { get; set; }
}


