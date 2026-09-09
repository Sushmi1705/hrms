using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.Branch.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.Branch.Queries;

public record GetBranchByIdQuery(Guid Id) : IRequest<BranchDto>;
public class GetBranchByIdQueryHandler : IRequestHandler<GetBranchByIdQuery, BranchDto>
{
    private readonly IOrganizationRepository _db;
    public GetBranchByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<BranchDto?> Handle(GetBranchByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.Branch>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new BranchDto { 
                Id = x.Id, 
                BusinessUnitId = x.BusinessUnitId,
                BusinessUnitName = x.BusinessUnit != null ? x.BusinessUnit.Name : string.Empty,
                CompanyName = x.BusinessUnit != null && x.BusinessUnit.Company != null ? x.BusinessUnit.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                LocationsCount = x.Locations.Count(l => !l.IsDeleted),
                DepartmentsCount = x.Departments.Count(d => !d.IsDeleted)
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllBranchQuery() : IRequest<List<BranchDto>>;
public class GetAllBranchQueryHandler : IRequestHandler<GetAllBranchQuery, List<BranchDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllBranchQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<BranchDto>> Handle(GetAllBranchQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.Branch>()
            .Where(x => !x.IsDeleted)
            .Select(x => new BranchDto { 
                Id = x.Id, 
                BusinessUnitId = x.BusinessUnitId,
                BusinessUnitName = x.BusinessUnit != null ? x.BusinessUnit.Name : string.Empty,
                CompanyName = x.BusinessUnit != null && x.BusinessUnit.Company != null ? x.BusinessUnit.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                LocationsCount = x.Locations.Count(l => !l.IsDeleted),
                DepartmentsCount = x.Departments.Count(d => !d.IsDeleted)
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
