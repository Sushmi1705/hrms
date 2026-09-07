using MediatR;
using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Attendance.Queries;

public class PaginatedResultDto<T>
{
    public List<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class GetAttendanceRegisterQuery : IRequest<PaginatedResultDto<AttendanceRegisterDto>>
{
    // Pagination
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;

    // Date Range
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // Dropdown Lists (Comma separated or just single selection for now)
    public string? Department { get; set; }
    public string? Branch { get; set; }
    public string? Location { get; set; }
    public string? ManagerId { get; set; }
    public string? Shift { get; set; }
    public string? Status { get; set; }
    public string? EmployeeId { get; set; }

    // Toggle Flags
    public bool? IsLateArrival { get; set; }
    public bool? IsMissingPunch { get; set; }
    public bool? IsHalfDay { get; set; }
    public bool? IsLeave { get; set; }
    public bool? IsPermission { get; set; }
    public bool? IsRegularization { get; set; }
    public bool? IsOvertime { get; set; }
    public bool? IsWorkFromHome { get; set; }

    // Sorting
    public string? SortBy { get; set; } // "Newest", "Oldest", "EmployeeName", "Department", "WorkHours", "LateMinutes"
    public string? SearchQuery { get; set; }
}

public class AttendanceRegisterDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Shift { get; set; } = string.Empty;
    public string? CheckIn { get; set; }
    public string? CheckOut { get; set; }
    public decimal WorkingHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public string Status { get; set; } = string.Empty;
    
    // Flags
    public bool IsLate { get; set; }
    public bool IsEarlyOut { get; set; }
    public bool IsMissingPunch { get; set; }
    public int LateMinutes { get; set; }
}

