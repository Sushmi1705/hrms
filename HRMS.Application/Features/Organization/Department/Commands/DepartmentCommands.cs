using MediatR;
using DomainEntity = HRMS.Domain.Entities.Organization.Department;
using HRMS.Application.Interfaces.Repositories;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace HRMS.Application.Features.Organization.Department.Commands;

public record CreateDepartmentCommand(string Code, string Name) : IRequest<Guid>;
public record DeleteDepartmentCommand(Guid Id) : IRequest<bool>;

public class DepartmentCommandHandlers : 
    IRequestHandler<CreateDepartmentCommand, Guid>,
    IRequestHandler<DeleteDepartmentCommand, bool>
{
    private readonly IOrganizationRepository _repo;
    public DepartmentCommandHandlers(IOrganizationRepository repo) => _repo = repo;

    public async Task<Guid> Handle(CreateDepartmentCommand request, CancellationToken ct)
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

    public async Task<bool> Handle(DeleteDepartmentCommand request, CancellationToken ct)
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
