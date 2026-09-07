using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.Designation;
using HRMS.Application.Interfaces.Repositories;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace HRMS.Application.Features.Organization.Designation.Commands;

public record CreateDesignationCommand(string Code, string Name) : IRequest<Guid>;
public record DeleteDesignationCommand(Guid Id) : IRequest<bool>;

public class DesignationCommandHandlers : 
    IRequestHandler<CreateDesignationCommand, Guid>,
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
            CreatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(entity, ct);
        return entity.Id;
    }

    public async Task<bool> Handle(DeleteDesignationCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        // Soft delete assuming BaseAuditableEntity has IsDeleted. Otherwise just ignore deletion logic for now
        entity.DeletedAt = DateTime.UtcNow;
        entity.IsDeleted = true;
        await _repo.UpdateAsync(entity, ct);
        return true;
    }
}
