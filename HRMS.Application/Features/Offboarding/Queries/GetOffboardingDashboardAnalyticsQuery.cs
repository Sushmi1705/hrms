using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Offboarding.Queries;

public class GetOffboardingDashboardAnalyticsQuery : IRequest<object>
{
}

public class GetOffboardingDashboardAnalyticsQueryHandler : IRequestHandler<GetOffboardingDashboardAnalyticsQuery, object>
{
    private readonly ITalentManagementRepository _repository;

    public GetOffboardingDashboardAnalyticsQueryHandler(ITalentManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> Handle(GetOffboardingDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetOffboardingAnalyticsAsync();
    }
}
