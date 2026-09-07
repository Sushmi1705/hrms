using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Attendance;
using HRMS.Application.Features.Attendance.Queries;

namespace HRMS.Application.Contracts.Persistence;

public interface IAttendanceAnalyticsRepository
{
    Task<(List<AttendanceLog> Items, int TotalCount)> GetAdvancedAttendanceRegisterAsync(GetAttendanceRegisterQuery query);
    Task<object> GetDashboardAnalyticsAsync(DateTime? startDate, DateTime? endDate);
    Task<object> GetEmployeeProfileWithLogsAsync(Guid employeeId, int month, int year);
}
