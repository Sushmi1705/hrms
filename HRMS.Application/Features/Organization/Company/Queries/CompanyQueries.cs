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
    public Task<CompanyDto?> Handle(GetCompanyByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.Company>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new CompanyDto { 
                Id = x.Id, 
                Code = x.Code, 
                Name = x.Name,
                Description = x.Description,
                BusinessUnitsCount = x.BusinessUnits.Count(bu => !bu.IsDeleted)
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllCompanyQuery() : IRequest<List<CompanyDto>>;
public class GetAllCompanyQueryHandler : IRequestHandler<GetAllCompanyQuery, List<CompanyDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllCompanyQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<CompanyDto>> Handle(GetAllCompanyQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.Company>()
            .Where(x => !x.IsDeleted)
            .Select(x => new CompanyDto { 
                Id = x.Id, 
                Code = x.Code, 
                Name = x.Name,
                Description = x.Description,
                BusinessUnitsCount = x.BusinessUnits.Count(bu => !bu.IsDeleted)
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
