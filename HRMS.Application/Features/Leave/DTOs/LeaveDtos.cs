using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Leave.DTOs;

public class LeaveTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public bool IsPaid { get; set; }
    public bool RequiresAttachment { get; set; }
    public int DefaultMaxDaysPerYear { get; set; }
    public string ColorCode { get; set; } = null!;
}

public class LeaveBalanceDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public LeaveTypeDto LeaveType { get; set; } = null!;
    public int Year { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal Accrued { get; set; }
    public decimal Used { get; set; }
    public decimal Pending { get; set; }
    public decimal Remaining { get; set; }
}

public class LeaveRequestDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public string? EmployeePhotoUrl { get; set; }
    public string? DepartmentName { get; set; }
    
    public LeaveTypeDto LeaveType { get; set; } = null!;
    
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalDays { get; set; }
    public bool IsHalfDay { get; set; }
    
    public string Reason { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class LeaveDashboardAnalyticsDto
{
    public int EmployeesOnLeaveToday { get; set; }
    public int PendingApprovals { get; set; }
    public int TotalLeaveRequestsThisMonth { get; set; }
    public int LOPDaysThisMonth { get; set; }
}
