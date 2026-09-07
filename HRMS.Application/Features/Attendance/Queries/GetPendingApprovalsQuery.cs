using MediatR;
using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetPendingApprovalsQuery : IRequest<List<AttendanceApprovalDto>>
{
}

public class AttendanceApprovalDto
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    
    public string RequestedCheckIn { get; set; } = string.Empty;
    public string RequestedCheckOut { get; set; } = string.Empty;
}
