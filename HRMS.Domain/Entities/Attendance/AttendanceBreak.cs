using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Attendance;

public class AttendanceBreak : BaseAuditableEntity
{
    public Guid AttendanceLogId { get; set; }
    public virtual AttendanceLog AttendanceLog { get; set; }
    
    public DateTime BreakStartTime { get; set; }
    public DateTime? BreakEndTime { get; set; }
    
    public string BreakType { get; set; } = "Lunch"; // Lunch, Tea, Short
    public decimal DurationMinutes { get; set; }
}
