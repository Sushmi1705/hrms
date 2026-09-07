using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.Department;
using HRMS.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HRMS.Application.Features.Organization.Department.Queries;

public record GetAllDepartmentQuery() : IRequest<IReadOnlyList<DomainEntity>>;

public class GetAllDepartmentQueryHandler : IRequestHandler<GetAllDepartmentQuery, IReadOnlyList<DomainEntity>>
{
    private readonly IOrganizationRepository _repo;
    public GetAllDepartmentQueryHandler(IOrganizationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<DomainEntity>> Handle(GetAllDepartmentQuery request, CancellationToken ct)
    {
        return await _repo.GetAllAsync<DomainEntity>(ct);
    }
}
