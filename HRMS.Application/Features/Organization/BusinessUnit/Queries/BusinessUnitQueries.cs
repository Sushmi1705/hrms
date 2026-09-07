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
    public async Task<BusinessUnitDto> Handle(GetBusinessUnitByIdQuery req, CancellationToken ct) {
        var e = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.BusinessUnit>(req.Id, ct);
        if (e == null) return null;
        return new BusinessUnitDto { Id = e.Id, Code = e.Code, Name = e.Name };
    }
}

public record GetAllBusinessUnitQuery() : IRequest<List<BusinessUnitDto>>;
public class GetAllBusinessUnitQueryHandler : IRequestHandler<GetAllBusinessUnitQuery, List<BusinessUnitDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllBusinessUnitQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<List<BusinessUnitDto>> Handle(GetAllBusinessUnitQuery req, CancellationToken ct) {
        var list = await _db.GetAllAsync<HRMS.Domain.Entities.Organization.BusinessUnit>(ct);
        return list.Select(x => new BusinessUnitDto { Id = x.Id, Code = x.Code, Name = x.Name }).ToList();
    }
}
