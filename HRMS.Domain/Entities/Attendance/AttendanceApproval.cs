using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Attendance;

public class AttendanceApproval : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public string Type { get; set; } = string.Empty; // "Regularization", "Overtime", "Leave", "Permission"
    public DateTime Date { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected"
    
    // For Regularization specifically
    public TimeSpan? RequestedCheckIn { get; set; }
    public TimeSpan? RequestedCheckOut { get; set; }
    
    public string? ManagerComments { get; set; }
    public Guid? ApprovedById { get; set; }
}
