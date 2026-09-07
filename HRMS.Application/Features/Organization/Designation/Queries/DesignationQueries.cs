using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.Designation;
using HRMS.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HRMS.Application.Features.Organization.Designation.Queries;

public record GetAllDesignationQuery() : IRequest<IReadOnlyList<DomainEntity>>;

public class GetAllDesignationQueryHandler : IRequestHandler<GetAllDesignationQuery, IReadOnlyList<DomainEntity>>
{
    private readonly IOrganizationRepository _repo;
    public GetAllDesignationQueryHandler(IOrganizationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<DomainEntity>> Handle(GetAllDesignationQuery request, CancellationToken ct)
    {
        return await _repo.GetAllAsync<DomainEntity>(ct);
    }
}
