using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.Department.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.Department.Queries;

public record GetDepartmentByIdQuery(Guid Id) : IRequest<DepartmentDto>;
public class GetDepartmentByIdQueryHandler : IRequestHandler<GetDepartmentByIdQuery, DepartmentDto>
{
    private readonly IOrganizationRepository _db;
    public GetDepartmentByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<DepartmentDto?> Handle(GetDepartmentByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.Department>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new DepartmentDto { 
                Id = x.Id, 
                BranchId = x.BranchId,
                BranchName = x.Branch != null ? x.Branch.Name : string.Empty,
                BusinessUnitName = x.Branch != null && x.Branch.BusinessUnit != null ? x.Branch.BusinessUnit.Name : string.Empty,
                CompanyName = x.Branch != null && x.Branch.BusinessUnit != null && x.Branch.BusinessUnit.Company != null ? x.Branch.BusinessUnit.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                DesignationsCount = x.Designations.Count(d => !d.IsDeleted)
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllDepartmentQuery() : IRequest<List<DepartmentDto>>;
public class GetAllDepartmentQueryHandler : IRequestHandler<GetAllDepartmentQuery, List<DepartmentDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllDepartmentQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<DepartmentDto>> Handle(GetAllDepartmentQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.Department>()
            .Where(x => !x.IsDeleted)
            .Select(x => new DepartmentDto { 
                Id = x.Id, 
                BranchId = x.BranchId,
                BranchName = x.Branch != null ? x.Branch.Name : string.Empty,
                BusinessUnitName = x.Branch != null && x.Branch.BusinessUnit != null ? x.Branch.BusinessUnit.Name : string.Empty,
                CompanyName = x.Branch != null && x.Branch.BusinessUnit != null && x.Branch.BusinessUnit.Company != null ? x.Branch.BusinessUnit.Company.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                DesignationsCount = x.Designations.Count(d => !d.IsDeleted)
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
