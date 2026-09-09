using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.BusinessUnit.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.BusinessUnit.Queries;

public record GetBusinessUnitByIdQuery(Guid Id) : IRequest<BusinessUnitDto>;
public class GetBusinessUnitByIdQueryHandler : IRequestHandler<GetBusinessUnitByIdQuery, BusinessUnitDto>
{
    private readonly IOrganizationRepository _db;
    public GetBusinessUnitByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<BusinessUnitDto?> Handle(GetBusinessUnitByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.BusinessUnit>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new BusinessUnitDto { 
                Id = x.Id, 
                CompanyId = x.CompanyId,
                CompanyName = x.Company != null ? x.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                BranchesCount = x.Branches.Count(b => !b.IsDeleted)
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllBusinessUnitQuery() : IRequest<List<BusinessUnitDto>>;
public class GetAllBusinessUnitQueryHandler : IRequestHandler<GetAllBusinessUnitQuery, List<BusinessUnitDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllBusinessUnitQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<BusinessUnitDto>> Handle(GetAllBusinessUnitQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.BusinessUnit>()
            .Where(x => !x.IsDeleted)
            .Select(x => new BusinessUnitDto { 
                Id = x.Id, 
                CompanyId = x.CompanyId,
                CompanyName = x.Company != null ? x.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                BranchesCount = x.Branches.Count(b => !b.IsDeleted)
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
