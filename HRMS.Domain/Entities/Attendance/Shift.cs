using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Attendance;

public class Shift : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string ShiftType { get; set; } = "General"; // General, Morning, Night, Flexible
    
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    // Policy settings
    public int GraceTimeInMinutes { get; set; }
    public int HalfDayLateThresholdMinutes { get; set; }
    
    // Break settings
    public bool HasFixedBreaks { get; set; }
    public int MaxBreakDurationMinutes { get; set; }
    
    // OT settings
    public bool IsOvertimeAllowed { get; set; }
    public int MinOvertimeMinutes { get; set; }
    
    public bool IsActive { get; set; } = true;
}
