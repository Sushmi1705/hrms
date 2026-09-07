using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Performance.Queries;

public class PerformanceDashboardDto
{
    public int ActivePips { get; set; }
    public int PendingReviews { get; set; }
    public int CompletedReviews { get; set; }
    public decimal AverageRating { get; set; }
    public string ActiveCycleName { get; set; } = string.Empty;
}

public class GetPerformanceDashboardAnalyticsQuery : IRequest<PerformanceDashboardDto>
{
}

public class GetPerformanceDashboardAnalyticsQueryHandler : IRequestHandler<GetPerformanceDashboardAnalyticsQuery, PerformanceDashboardDto>
{
    private readonly IPerformanceRepository _repository;

    public GetPerformanceDashboardAnalyticsQueryHandler(IPerformanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<PerformanceDashboardDto> Handle(GetPerformanceDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var cycle = await _repository.GetActiveReviewCycleAsync();
        
        return new PerformanceDashboardDto
        {
            ActivePips = await _repository.GetActivePipCountAsync(),
            PendingReviews = await _repository.GetPendingReviewsCountAsync(),
            CompletedReviews = await _repository.GetCompletedReviewsCountAsync(),
            AverageRating = await _repository.GetAverageCompanyRatingAsync(),
            ActiveCycleName = cycle?.Name ?? "No Active Cycle"
        };
    }
}
