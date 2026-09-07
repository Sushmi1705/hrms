using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Interfaces.Repositories.Leave;
using HRMS.Application.Features.Leave.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Leave.Queries;

public record GetLeaveDashboardAnalyticsQuery() : IRequest<LeaveDashboardAnalyticsDto>;

public class GetLeaveDashboardAnalyticsQueryHandler : IRequestHandler<GetLeaveDashboardAnalyticsQuery, LeaveDashboardAnalyticsDto>
{
    private readonly ILeaveRepository _leaveRepository;

    public GetLeaveDashboardAnalyticsQueryHandler(ILeaveRepository leaveRepository)
    {
        _leaveRepository = leaveRepository;
    }

    public async Task<LeaveDashboardAnalyticsDto> Handle(GetLeaveDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        
        var allRequests = await _leaveRepository.GetAllLeaveRequestsAsync(startOfMonth, null, null, cancellationToken);
        
        return new LeaveDashboardAnalyticsDto
        {
            EmployeesOnLeaveToday = allRequests.Count(r => r.FromDate <= today && r.ToDate >= today && r.Status == "Approved"),
            PendingApprovals = allRequests.Count(r => r.Status == "Pending"),
            TotalLeaveRequestsThisMonth = allRequests.Count,
            LOPDaysThisMonth = (int)allRequests.Where(r => r.LeaveType.Name.Contains("LOP") && r.Status == "Approved").Sum(r => r.TotalDays)
        };
    }
}

public record GetAllLeaveRequestsQuery(DateTime? StartDate, DateTime? EndDate, string? Status) : IRequest<List<LeaveRequestDto>>;

public class GetAllLeaveRequestsQueryHandler : IRequestHandler<GetAllLeaveRequestsQuery, List<LeaveRequestDto>>
{
    private readonly ILeaveRepository _leaveRepository;

    public GetAllLeaveRequestsQueryHandler(ILeaveRepository leaveRepository)
    {
        _leaveRepository = leaveRepository;
    }

    public async Task<List<LeaveRequestDto>> Handle(GetAllLeaveRequestsQuery request, CancellationToken cancellationToken)
    {
        var requests = await _leaveRepository.GetAllLeaveRequestsAsync(request.StartDate, request.EndDate, request.Status, cancellationToken);
        
        return requests.Select(r => new LeaveRequestDto
        {
            Id = r.Id,
            EmployeeId = r.EmployeeId,
            EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
            EmployeePhotoUrl = null,
            DepartmentName = r.Employee.Department?.Name,
            LeaveType = new LeaveTypeDto
            {
                Id = r.LeaveType.Id,
                Name = r.LeaveType.Name,
                ColorCode = r.LeaveType.ColorCode
            },
            FromDate = r.FromDate,
            ToDate = r.ToDate,
            TotalDays = r.TotalDays,
            IsHalfDay = r.IsHalfDay,
            Reason = r.Reason,
            Status = r.Status,
            CreatedAt = r.CreatedAt
        }).ToList();
    }
}


public record GetEmployeeLeaveBalancesQuery(Guid EmployeeId, int Year) : IRequest<List<LeaveBalanceDto>>;

public class GetEmployeeLeaveBalancesQueryHandler : IRequestHandler<GetEmployeeLeaveBalancesQuery, List<LeaveBalanceDto>>
{
    private readonly ILeaveRepository _leaveRepository;

    public GetEmployeeLeaveBalancesQueryHandler(ILeaveRepository leaveRepository)
    {
        _leaveRepository = leaveRepository;
    }

    public async Task<List<LeaveBalanceDto>> Handle(GetEmployeeLeaveBalancesQuery request, CancellationToken cancellationToken)
    {
        var balances = await _leaveRepository.GetAllEmployeeBalancesAsync(request.EmployeeId, request.Year, cancellationToken);
        
        return balances.Select(b => new LeaveBalanceDto
        {
            Id = b.Id,
            EmployeeId = b.EmployeeId,
            Year = b.Year,
            OpeningBalance = b.OpeningBalance,
            Accrued = b.Accrued,
            Used = b.Used,
            Pending = b.Pending,
            Remaining = b.Remaining,
            LeaveType = new LeaveTypeDto
            {
                Id = b.LeaveType.Id,
                Name = b.LeaveType.Name,
                ColorCode = b.LeaveType.ColorCode
            }
        }).ToList();
    }
}

