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
    public async Task<BranchDto> Handle(GetBranchByIdQuery req, CancellationToken ct) {
        var e = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Branch>(req.Id, ct);
        if (e == null) return null;
        return new BranchDto { Id = e.Id, Code = e.Code, Name = e.Name };
    }
}

public record GetAllBranchQuery() : IRequest<List<BranchDto>>;
public class GetAllBranchQueryHandler : IRequestHandler<GetAllBranchQuery, List<BranchDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllBranchQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<List<BranchDto>> Handle(GetAllBranchQuery req, CancellationToken ct) {
        var list = await _db.GetAllAsync<HRMS.Domain.Entities.Organization.Branch>(ct);
        return list.Select(x => new BranchDto { Id = x.Id, Code = x.Code, Name = x.Name }).ToList();
    }
}
