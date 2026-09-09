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
    public Task<LocationDto?> Handle(GetLocationByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.Location>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new LocationDto { 
                Id = x.Id, 
                BranchId = x.BranchId,
                BranchName = x.Branch != null ? x.Branch.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                Address = x.Address
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllLocationQuery() : IRequest<List<LocationDto>>;
public class GetAllLocationQueryHandler : IRequestHandler<GetAllLocationQuery, List<LocationDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllLocationQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<LocationDto>> Handle(GetAllLocationQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.Location>()
            .Where(x => !x.IsDeleted)
            .Select(x => new LocationDto { 
                Id = x.Id, 
                BranchId = x.BranchId,
                BranchName = x.Branch != null ? x.Branch.Name : string.Empty,
                Code = x.Code, 
                Name = x.Name,
                Address = x.Address
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
