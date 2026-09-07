using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Reports.DTOs;
using HRMS.Application.Contracts.Tenant;

namespace HRMS.Application.Features.Reports.Queries;

public class GetExecutiveDashboardQuery : IRequest<ExecutiveDashboardDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public ReportFilterParams? Filters { get; set; }
}

public class GetExecutiveDashboardQueryHandler : IRequestHandler<GetExecutiveDashboardQuery, ExecutiveDashboardDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetExecutiveDashboardQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<ExecutiveDashboardDto> Handle(GetExecutiveDashboardQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetExecutiveDashboardAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.Filters);
    }
}


public class GetWorkforceAnalyticsQuery : IRequest<WorkforceAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
}

public class GetWorkforceAnalyticsQueryHandler : IRequestHandler<GetWorkforceAnalyticsQuery, WorkforceAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetWorkforceAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<WorkforceAnalyticsDto> Handle(GetWorkforceAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetWorkforceAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin);
    }
}

public class GetAttendanceAnalyticsQuery : IRequest<AttendanceAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetAttendanceAnalyticsQueryHandler : IRequestHandler<GetAttendanceAnalyticsQuery, AttendanceAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetAttendanceAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<AttendanceAnalyticsDto> Handle(GetAttendanceAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetAttendanceAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.StartDate, request.EndDate);
    }
}

public class GetLeaveAnalyticsQuery : IRequest<LeaveAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetLeaveAnalyticsQueryHandler : IRequestHandler<GetLeaveAnalyticsQuery, LeaveAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetLeaveAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<LeaveAnalyticsDto> Handle(GetLeaveAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetLeaveAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.StartDate, request.EndDate);
    }
}

public class GetPayrollAnalyticsQuery : IRequest<PayrollAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public bool HasPayrollPermission { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetPayrollAnalyticsQueryHandler : IRequestHandler<GetPayrollAnalyticsQuery, PayrollAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetPayrollAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<PayrollAnalyticsDto> Handle(GetPayrollAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetPayrollAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.HasPayrollPermission, request.StartDate, request.EndDate);
    }
}

public class GetRecruitmentAnalyticsQuery : IRequest<RecruitmentAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
}

public class GetRecruitmentAnalyticsQueryHandler : IRequestHandler<GetRecruitmentAnalyticsQuery, RecruitmentAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetRecruitmentAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<RecruitmentAnalyticsDto> Handle(GetRecruitmentAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetRecruitmentAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin);
    }
}

public class GetPerformanceAnalyticsQuery : IRequest<PerformanceAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
}

public class GetPerformanceAnalyticsQueryHandler : IRequestHandler<GetPerformanceAnalyticsQuery, PerformanceAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetPerformanceAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<PerformanceAnalyticsDto> Handle(GetPerformanceAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetPerformanceAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin);
    }
}

public class GetTrainingAnalyticsQuery : IRequest<TrainingAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
}

public class GetTrainingAnalyticsQueryHandler : IRequestHandler<GetTrainingAnalyticsQuery, TrainingAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetTrainingAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<TrainingAnalyticsDto> Handle(GetTrainingAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetTrainingAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin);
    }
}

public class GetAssetAnalyticsQuery : IRequest<AssetAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public ReportFilterParams? Filters { get; set; }
}

public class GetAssetAnalyticsQueryHandler : IRequestHandler<GetAssetAnalyticsQuery, AssetAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetAssetAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<AssetAnalyticsDto> Handle(GetAssetAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetAssetAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.Filters);
    }
}

public class GetBenefitsAnalyticsQuery : IRequest<BenefitsAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public ReportFilterParams? Filters { get; set; }
}

public class GetBenefitsAnalyticsQueryHandler : IRequestHandler<GetBenefitsAnalyticsQuery, BenefitsAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetBenefitsAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<BenefitsAnalyticsDto> Handle(GetBenefitsAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetBenefitsAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.Filters);
    }
}

public class GetExpenseAnalyticsQuery : IRequest<ExpenseAnalyticsDto>
{
    public Guid? EmployeeId { get; set; }
    public Guid? ManagerId { get; set; }
    public bool IsAdmin { get; set; }
    public ReportFilterParams? Filters { get; set; }
}

public class GetExpenseAnalyticsQueryHandler : IRequestHandler<GetExpenseAnalyticsQuery, ExpenseAnalyticsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetExpenseAnalyticsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<ExpenseAnalyticsDto> Handle(GetExpenseAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetExpenseAnalyticsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty, request.EmployeeId, request.ManagerId, request.IsAdmin, request.Filters);
    }
}

public class GetFilterOptionsQuery : IRequest<FilterOptionsDto>
{
}

public class GetFilterOptionsQueryHandler : IRequestHandler<GetFilterOptionsQuery, FilterOptionsDto>
{
    private readonly IReportRepository _repo;
    private readonly ITenantContext _tenantContext;

    public GetFilterOptionsQueryHandler(IReportRepository repo, ITenantContext tenantContext)
    {
        _repo = repo;
        _tenantContext = tenantContext;
    }

    public async Task<FilterOptionsDto> Handle(GetFilterOptionsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetFilterOptionsAsync(_tenantContext.CurrentTenantId ?? Guid.Empty);
    }
}

