using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.CostCenter;
using HRMS.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HRMS.Application.Features.Organization.CostCenter.Queries;

public record GetAllCostCenterQuery() : IRequest<IReadOnlyList<DomainEntity>>;

public class GetAllCostCenterQueryHandler : IRequestHandler<GetAllCostCenterQuery, IReadOnlyList<DomainEntity>>
{
    private readonly IOrganizationRepository _repo;
    public GetAllCostCenterQueryHandler(IOrganizationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<DomainEntity>> Handle(GetAllCostCenterQuery request, CancellationToken ct)
    {
        return await _repo.GetAllAsync<DomainEntity>(ct);
    }
}
