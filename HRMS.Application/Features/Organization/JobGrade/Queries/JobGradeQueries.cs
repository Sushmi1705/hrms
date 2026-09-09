using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Features.Organization.JobGrade.DTOs;
using HRMS.Application.Interfaces.Repositories;

namespace HRMS.Application.Features.Organization.JobGrade.Queries;

public record GetJobGradeByIdQuery(Guid Id) : IRequest<JobGradeDto>;
public class GetJobGradeByIdQueryHandler : IRequestHandler<GetJobGradeByIdQuery, JobGradeDto>
{
    private readonly IOrganizationRepository _db;
    public GetJobGradeByIdQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<JobGradeDto?> Handle(GetJobGradeByIdQuery req, CancellationToken ct) {
        var res = _db.Query<HRMS.Domain.Entities.Organization.JobGrade>()
            .Where(x => !x.IsDeleted && x.Id == req.Id)
            .Select(x => new JobGradeDto { 
                Id = x.Id, 
                Code = x.Code, 
                Name = x.Name,
                Level = x.Level
            })
            .FirstOrDefault();
        return Task.FromResult(res);
    }
}

public record GetAllJobGradeQuery() : IRequest<List<JobGradeDto>>;
public class GetAllJobGradeQueryHandler : IRequestHandler<GetAllJobGradeQuery, List<JobGradeDto>>
{
    private readonly IOrganizationRepository _db;
    public GetAllJobGradeQueryHandler(IOrganizationRepository db) { _db = db; }
    public Task<List<JobGradeDto>> Handle(GetAllJobGradeQuery req, CancellationToken ct) {
        var list = _db.Query<HRMS.Domain.Entities.Organization.JobGrade>()
            .Where(x => !x.IsDeleted)
            .Select(x => new JobGradeDto { 
                Id = x.Id, 
                Code = x.Code, 
                Name = x.Name,
                Level = x.Level
            })
            .OrderBy(x => x.Level)
            .ThenBy(x => x.Name)
            .ToList();
        return Task.FromResult(list);
    }
}
