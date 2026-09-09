using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using DomainEntity = HRMS.Domain.Entities.Organization.JobGrade;

namespace HRMS.Application.Features.Organization.JobGrade.Commands;

public record CreateJobGradeCommand(string Code, string Name, int Level = 1) : IRequest<Guid>;
public record UpdateJobGradeCommand(Guid Id, string Code, string Name, int Level = 1) : IRequest<bool>;
public record DeleteJobGradeCommand(Guid Id) : IRequest<bool>;

public class JobGradeCommandHandlers : 
    IRequestHandler<CreateJobGradeCommand, Guid>,
    IRequestHandler<UpdateJobGradeCommand, bool>,
    IRequestHandler<DeleteJobGradeCommand, bool>
{
    private readonly IOrganizationRepository _repo;
    public JobGradeCommandHandlers(IOrganizationRepository repo) => _repo = repo;

    public async Task<Guid> Handle(CreateJobGradeCommand request, CancellationToken ct)
    {
        var entity = new DomainEntity { 
            Id = Guid.NewGuid(),
            Code = request.Code, 
            Name = request.Name,
            Level = request.Level,
            CreatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(entity, ct);
        return entity.Id;
    }

    public async Task<bool> Handle(UpdateJobGradeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.Level = request.Level;
        await _repo.UpdateAsync(entity, ct);
        return true;
    }

    public async Task<bool> Handle(DeleteJobGradeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.DeletedAt = DateTime.UtcNow;
        entity.IsDeleted = true;
        await _repo.UpdateAsync(entity, ct);
        return true;
    }
}
