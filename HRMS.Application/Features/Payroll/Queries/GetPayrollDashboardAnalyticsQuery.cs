using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Payroll.Queries;

public class PayrollDashboardDto
{
    public int ActiveLoansCount { get; set; }
    public int PendingPayrollCount { get; set; }
    public decimal AverageNetSalary { get; set; }
    public decimal TotalPayrollCost { get; set; }
    public decimal TotalTaxDeducted { get; set; }
    public decimal TotalOvertimeCost { get; set; }
    public string LatestRunMonth { get; set; } = string.Empty;
}

public class GetPayrollDashboardAnalyticsQuery : IRequest<PayrollDashboardDto>
{
}

public class GetPayrollDashboardAnalyticsQueryHandler : IRequestHandler<GetPayrollDashboardAnalyticsQuery, PayrollDashboardDto>
{
    private readonly IPayrollRepository _repository;

    public GetPayrollDashboardAnalyticsQueryHandler(IPayrollRepository repository)
    {
        _repository = repository;
    }

    public async Task<PayrollDashboardDto> Handle(GetPayrollDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var latestRun = await _repository.GetLatestPayrollRunAsync();
        if (latestRun == null) return new PayrollDashboardDto();

        return new PayrollDashboardDto
        {
            ActiveLoansCount = await _repository.GetActiveLoansCountAsync(),
            PendingPayrollCount = await _repository.GetPendingPayrollCountAsync(),
            AverageNetSalary = await _repository.GetAverageNetSalaryAsync(),
            TotalPayrollCost = await _repository.GetTotalPayrollCostAsync(latestRun.Id),
            TotalTaxDeducted = await _repository.GetTotalTaxDeductedAsync(latestRun.Id),
            TotalOvertimeCost = await _repository.GetTotalOvertimeCostAsync(latestRun.Id),
            LatestRunMonth = latestRun.Month
        };
    }
}
