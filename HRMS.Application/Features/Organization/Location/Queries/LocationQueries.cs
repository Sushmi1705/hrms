using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.Location.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.Location.Queries;

public record GetLocationByIdQuery(Guid Id) : IRequest<LocationDto>;
public class GetLocationByIdQueryHandler : IRequestHandler<GetLocationByIdQuery, LocationDto>
{
    private readonly IOrganizationRepository _db;
    public GetLocationByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<LocationDto> Handle(GetLocationByIdQuery req, CancellationToken ct) {
        var e = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Location>(req.Id, ct);
        if (e == null) return null;
        return new LocationDto { Id = e.Id, Code = e.Code, Name = e.Name };
    }
}

public record GetAllLocationQuery() : IRequest<List<LocationDto>>;
public class GetAllLocationQueryHandler : IRequestHandler<GetAllLocationQuery, List<LocationDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllLocationQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<List<LocationDto>> Handle(GetAllLocationQuery req, CancellationToken ct) {
        var list = await _db.GetAllAsync<HRMS.Domain.Entities.Organization.Location>(ct);
        return list.Select(x => new LocationDto { Id = x.Id, Code = x.Code, Name = x.Name }).ToList();
    }
}
