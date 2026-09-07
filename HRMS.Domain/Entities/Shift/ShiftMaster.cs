using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;

namespace HRMS.Domain.Entities.Shift;

public class ShiftMaster : BaseAuditableEntity
{
    public string ShiftName { get; set; } = string.Empty;
    public string ShiftCode { get; set; } = string.Empty;
    public string ShiftType { get; set; } = "General"; // Morning, General, Evening, Night, Flexible, Split
    
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    public TimeSpan BreakStartTime { get; set; }
    public TimeSpan BreakEndTime { get; set; }
    
    public decimal WorkingHours { get; set; }
    public decimal MinimumHoursForHalfDay { get; set; }
    public decimal MinimumHoursForFullDay { get; set; }
    
    public int GraceTimeInMinutes { get; set; }
    public string LateMarkRule { get; set; } = "Standard";
    public string EarlyCheckoutRule { get; set; } = "Standard";
    
    public bool IsRotationalShift { get; set; }
    public bool IsNightShift { get; set; }
    public bool AllowOvertime { get; set; }
    
    public bool IsGeoFenceRequired { get; set; }
    public bool IsGpsRequired { get; set; }
    public bool IsFaceRecognitionRequired { get; set; }
    public bool IsBiometricRequired { get; set; }
    
    public string ColorCode { get; set; } = "#3b82f6";
    public string Status { get; set; } = "Active";
    public string? Description { get; set; }
}


