using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Shift.Queries;

public class ShiftMasterDto
{
    public Guid Id { get; set; }
    public string ShiftName { get; set; } = string.Empty;
    public string ShiftCode { get; set; } = string.Empty;
    public string ShiftType { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public decimal WorkingHours { get; set; }
    public string ColorCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class ShiftDashboardAnalyticsDto
{
    public int ActiveShifts { get; set; }
    public int EmployeesScheduledToday { get; set; }
    public int NightShiftEmployees { get; set; }
    public int MorningShiftEmployees { get; set; }
}
