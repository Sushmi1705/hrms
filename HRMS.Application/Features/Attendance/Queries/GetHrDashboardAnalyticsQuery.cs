using MediatR;
using System;

namespace HRMS.Application.Features.Attendance.Queries;

public class GetHrDashboardAnalyticsQuery : IRequest<object>
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
