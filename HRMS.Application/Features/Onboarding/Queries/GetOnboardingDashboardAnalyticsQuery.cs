using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Onboarding.Queries;

public class GetOnboardingDashboardAnalyticsQuery : IRequest<object>
{
}

public class GetOnboardingDashboardAnalyticsQueryHandler : IRequestHandler<GetOnboardingDashboardAnalyticsQuery, object>
{
    private readonly ITalentManagementRepository _repository;

    public GetOnboardingDashboardAnalyticsQueryHandler(ITalentManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> Handle(GetOnboardingDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetOnboardingAnalyticsAsync();
    }
}
