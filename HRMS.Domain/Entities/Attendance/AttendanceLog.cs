using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Attendance;

public class AttendanceLog : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public virtual EmployeeEntity Employee { get; set; }
    
    public DateTime Date { get; set; }
    
    public DateTime? ClockInTime { get; set; }
    public DateTime? ClockOutTime { get; set; }
    
    public string Status { get; set; } = string.Empty; // Present, Absent, HalfDay, Leave, Holiday
    
    public decimal TotalWorkingHours { get; set; }
    public decimal TotalOvertimeHours { get; set; }
    public decimal TotalBreakHours { get; set; }
    
    public bool IsLate { get; set; }
    public bool IsEarlyOut { get; set; }
    public bool IsMissingPunch { get; set; }
    
    public Guid? ShiftId { get; set; }
    public virtual Shift Shift { get; set; }
    
    public string? Remarks { get; set; }
    
    // IP and Geo-location tracking for Clock In/Out
    public string? ClockInIpAddress { get; set; }
    public string? ClockOutIpAddress { get; set; }
    public string? ClockInLocation { get; set; }
    public string? ClockOutLocation { get; set; }
    public string? ClockInDevice { get; set; } // Web, Mobile, Biometric
    public string? ClockOutDevice { get; set; } // Web, Mobile, Biometric
    public string? ClockInPhotoUrl { get; set; }
    public string? ClockOutPhotoUrl { get; set; }
}
