using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Learning.Queries;

public class GetLearningDashboardAnalyticsQuery : IRequest<LearningAnalyticsDto>
{
}

public class LearningAnalyticsDto
{
    public int TotalCourses { get; set; }
    public int PublishedCourses { get; set; }
    public int TotalEnrollments { get; set; }
    public int CompletedCourses { get; set; }
}

public class GetLearningDashboardAnalyticsQueryHandler : IRequestHandler<GetLearningDashboardAnalyticsQuery, LearningAnalyticsDto>
{
    private readonly ILearningRepository _learningRepository;

    public GetLearningDashboardAnalyticsQueryHandler(ILearningRepository learningRepository)
    {
        _learningRepository = learningRepository;
    }

    public async Task<LearningAnalyticsDto> Handle(GetLearningDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return new LearningAnalyticsDto
        {
            TotalCourses = await _learningRepository.GetTotalCoursesAsync(),
            PublishedCourses = await _learningRepository.GetTotalPublishedCoursesAsync(),
            TotalEnrollments = await _learningRepository.GetTotalEnrollmentsAsync(),
            CompletedCourses = await _learningRepository.GetCompletedCoursesCountAsync()
        };
    }
}
