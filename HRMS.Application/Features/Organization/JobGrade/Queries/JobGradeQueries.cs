using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.JobGrade;
using HRMS.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HRMS.Application.Features.Organization.JobGrade.Queries;

public record GetAllJobGradeQuery() : IRequest<IReadOnlyList<DomainEntity>>;

public class GetAllJobGradeQueryHandler : IRequestHandler<GetAllJobGradeQuery, IReadOnlyList<DomainEntity>>
{
    private readonly IOrganizationRepository _repo;
    public GetAllJobGradeQueryHandler(IOrganizationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<DomainEntity>> Handle(GetAllJobGradeQuery request, CancellationToken ct)
    {
        return await _repo.GetAllAsync<DomainEntity>(ct);
    }
}
