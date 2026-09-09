using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.Designation.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.Designation.Queries;

public record GetDesignationByIdQuery(Guid Id) : IRequest<DesignationDto>;
public class GetDesignationByIdQueryHandler : IRequestHandler<GetDesignationByIdQuery, DesignationDto>
{
    private readonly IOrganizationRepository _db;
    public GetDesignationByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<DesignationDto?> Handle(GetDesignationByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.Designation>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new DesignationDto { 
                Id = x.Id, 
                DepartmentId = x.DepartmentId,
                DepartmentName = x.Department != null ? x.Department.Name : string.Empty,
                BranchName = x.Department != null && x.Department.Branch != null ? x.Department.Branch.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllDesignationQuery() : IRequest<List<DesignationDto>>;
public class GetAllDesignationQueryHandler : IRequestHandler<GetAllDesignationQuery, List<DesignationDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllDesignationQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<DesignationDto>> Handle(GetAllDesignationQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.Designation>()
            .Where(x => !x.IsDeleted)
            .Select(x => new DesignationDto { 
                Id = x.Id, 
                DepartmentId = x.DepartmentId,
                DepartmentName = x.Department != null ? x.Department.Name : string.Empty,
                BranchName = x.Department != null && x.Department.Branch != null ? x.Department.Branch.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
