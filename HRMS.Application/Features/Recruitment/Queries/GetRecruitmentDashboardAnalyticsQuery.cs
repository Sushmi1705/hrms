using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Recruitment.Queries;

public class RecruitmentDashboardAnalyticsDto
{
    public int ActiveJobOpenings { get; set; }
    public int TotalActiveCandidates { get; set; }
    public int ApplicationsInPipeline { get; set; }
    public int InterviewsScheduledThisWeek { get; set; }
    public int OffersAccepted { get; set; }
    public int OffersSent { get; set; }
    public int HiresThisMonth { get; set; }
    public decimal AverageTimeToHireDays { get; set; }
}

public class GetRecruitmentDashboardAnalyticsQuery : IRequest<RecruitmentDashboardAnalyticsDto>
{
}

public class GetRecruitmentDashboardAnalyticsQueryHandler : IRequestHandler<GetRecruitmentDashboardAnalyticsQuery, RecruitmentDashboardAnalyticsDto>
{
    private readonly IRecruitmentRepository _repository;

    public GetRecruitmentDashboardAnalyticsQueryHandler(IRecruitmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<RecruitmentDashboardAnalyticsDto> Handle(GetRecruitmentDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var openings = await _repository.GetActiveJobOpeningsAsync();
        
        return new RecruitmentDashboardAnalyticsDto
        {
            ActiveJobOpenings = System.Linq.Enumerable.Count(openings),
            TotalActiveCandidates = await _repository.GetTotalActiveCandidatesAsync(),
            ApplicationsInPipeline = await _repository.GetTotalApplicationsInPipelineAsync(),
            InterviewsScheduledThisWeek = await _repository.GetInterviewsScheduledThisWeekAsync(),
            OffersAccepted = await _repository.GetOffersAcceptedCountAsync(),
            OffersSent = await _repository.GetOffersSentCountAsync(),
            HiresThisMonth = await _repository.GetHiresThisMonthAsync(),
            AverageTimeToHireDays = await _repository.GetAverageTimeToHireDaysAsync()
        };
    }
}
