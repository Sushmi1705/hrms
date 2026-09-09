using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using DomainEntity = HRMS.Domain.Entities.Organization.CostCenter;

namespace HRMS.Application.Features.Organization.CostCenter.Commands;

public record CreateCostCenterCommand(string Code, string Name, Guid? BusinessUnitId = null) : IRequest<Guid>;
public record UpdateCostCenterCommand(Guid Id, string Code, string Name, Guid? BusinessUnitId = null) : IRequest<bool>;
public record DeleteCostCenterCommand(Guid Id) : IRequest<bool>;

public class CostCenterCommandHandlers : 
    IRequestHandler<CreateCostCenterCommand, Guid>,
    IRequestHandler<UpdateCostCenterCommand, bool>,
    IRequestHandler<DeleteCostCenterCommand, bool>
{
    private readonly IOrganizationRepository _repo;
    public CostCenterCommandHandlers(IOrganizationRepository repo) => _repo = repo;

    public async Task<Guid> Handle(CreateCostCenterCommand request, CancellationToken ct)
    {
        var entity = new DomainEntity { 
            Id = Guid.NewGuid(),
            Code = request.Code, 
            Name = request.Name,
            BusinessUnitId = request.BusinessUnitId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow
        };
        await _repo.AddAsync(entity, ct);
        return entity.Id;
    }

    public async Task<bool> Handle(UpdateCostCenterCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.Code = request.Code;
        entity.Name = request.Name;
        if (request.BusinessUnitId.HasValue && request.BusinessUnitId.Value != Guid.Empty)
        {
            entity.BusinessUnitId = request.BusinessUnitId.Value;
        }
        await _repo.UpdateAsync(entity, ct);
        return true;
    }

    public async Task<bool> Handle(DeleteCostCenterCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<DomainEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.DeletedAt = DateTime.UtcNow;
        entity.IsDeleted = true;
        await _repo.UpdateAsync(entity, ct);
        return true;
    }
}
