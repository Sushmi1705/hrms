using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using DomainEntity = HRMS.Domain.Entities.Organization.Designation;

namespace HRMS.Application.Features.Organization.Designation.Commands;

public record CreateDesignationCommand(string Code, string Name, Guid? DepartmentId = null) : IRequest<Guid>;
public record UpdateDesignationCommand(Guid Id, string Code, string Name, Guid? DepartmentId = null) : IRequest<bool>;
public record DeleteDesignationCommand(Guid Id) : IRequest<bool>;

public class DesignationCommandHandlers : 
    IRequestHandler<CreateDesignationCommand, Guid>,
    IRequestHandler<UpdateDesignationCommand, bool>,
    IRequestHandler<DeleteDesignationCommand, bool>
{
    private readonly IOrganizationRepository _repo;
    public DesignationCommandHandlers(IOrganizationRepository repo) => _repo = repo;

    public async Task<Guid> Handle(CreateDesignationCommand request, CancellationToken ct)
    {
        var entity = new DomainEntity { 
            Id = Guid.NewGuid(),
            Code = request.Code, 
            Name = request.Name,
            DepartmentId = request.DepartmentId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(entity, ct);
        return entity.Id;
    }

    public async Task<bool> Handle(UpdateDesignationCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.Code = request.Code;
        entity.Name = request.Name;
        if (request.DepartmentId.HasValue && request.DepartmentId.Value != Guid.Empty)
        {
            entity.DepartmentId = request.DepartmentId.Value;
        }
        await _repo.UpdateAsync(entity, ct);
        return true;
    }

    public async Task<bool> Handle(DeleteDesignationCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.DeletedAt = DateTime.UtcNow;
        entity.IsDeleted = true;
        await _repo.UpdateAsync(entity, ct);
        return true;
    }
}
