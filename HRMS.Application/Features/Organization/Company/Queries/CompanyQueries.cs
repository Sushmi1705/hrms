using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.Company.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.Company.Queries;

public record GetCompanyByIdQuery(Guid Id) : IRequest<CompanyDto>;
public class GetCompanyByIdQueryHandler : IRequestHandler<GetCompanyByIdQuery, CompanyDto>
{
    private readonly IOrganizationRepository _db;
    public GetCompanyByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<CompanyDto> Handle(GetCompanyByIdQuery req, CancellationToken ct) {
        var e = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Company>(req.Id, ct);
        if (e == null) return null;
        return new CompanyDto { Id = e.Id, Code = e.Code, Name = e.Name };
    }
}

public record GetAllCompanyQuery() : IRequest<List<CompanyDto>>;
public class GetAllCompanyQueryHandler : IRequestHandler<GetAllCompanyQuery, List<CompanyDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllCompanyQueryHandler(IOrganizationRepository db) { _db = db; }
    public async Task<List<CompanyDto>> Handle(GetAllCompanyQuery req, CancellationToken ct) {
        var list = await _db.GetAllAsync<HRMS.Domain.Entities.Organization.Company>(ct);
        return list.Select(x => new CompanyDto { Id = x.Id, Code = x.Code, Name = x.Name }).ToList();
    }
}
