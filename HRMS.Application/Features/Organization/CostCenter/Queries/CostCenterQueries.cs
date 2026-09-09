using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.CostCenter.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.CostCenter.Queries;

public record GetCostCenterByIdQuery(Guid Id) : IRequest<CostCenterDto>;
public class GetCostCenterByIdQueryHandler : IRequestHandler<GetCostCenterByIdQuery, CostCenterDto>
{
    private readonly IOrganizationRepository _db;
    public GetCostCenterByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<CostCenterDto?> Handle(GetCostCenterByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.CostCenter>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new CostCenterDto { 
                Id = x.Id, 
                BusinessUnitId = x.BusinessUnitId,
                BusinessUnitName = x.BusinessUnit != null ? x.BusinessUnit.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllCostCenterQuery() : IRequest<List<CostCenterDto>>;
public class GetAllCostCenterQueryHandler : IRequestHandler<GetAllCostCenterQuery, List<CostCenterDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllCostCenterQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<CostCenterDto>> Handle(GetAllCostCenterQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.CostCenter>()
            .Where(x => !x.IsDeleted)
            .Select(x => new CostCenterDto { 
                Id = x.Id, 
                BusinessUnitId = x.BusinessUnitId,
                BusinessUnitName = x.BusinessUnit != null ? x.BusinessUnit.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
