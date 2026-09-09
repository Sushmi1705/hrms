using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.BusinessUnit.Commands;

public record CreateBusinessUnitCommand(string Code, string Name, Guid? CompanyId = null) : IRequest<Guid>;
public class CreateBusinessUnitCommandHandler : IRequestHandler<CreateBusinessUnitCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateBusinessUnitCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateBusinessUnitCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.BusinessUnit 
        { 
            Id = Guid.NewGuid(),
            Code = req.Code, 
            Name = req.Name,
            CompanyId = req.CompanyId ?? Guid.Empty
        };
        await _db.AddAsync(entity, ct);
        return entity.Id;
    }
}

public record UpdateBusinessUnitCommand(Guid Id, string Code, string Name, Guid? CompanyId = null) : IRequest<bool>;
public class UpdateBusinessUnitCommandHandler : IRequestHandler<UpdateBusinessUnitCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public UpdateBusinessUnitCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(UpdateBusinessUnitCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.BusinessUnit>(req.Id, ct);
        if (entity == null) return false;
        entity.Code = req.Code;
        entity.Name = req.Name;
        if (req.CompanyId.HasValue && req.CompanyId.Value != Guid.Empty)
        {
            entity.CompanyId = req.CompanyId.Value;
        }
        await _db.UpdateAsync(entity, ct);
        return true;
    }
}

public record DeleteBusinessUnitCommand(Guid Id) : IRequest<bool>;
public class DeleteBusinessUnitCommandHandler : IRequestHandler<DeleteBusinessUnitCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public DeleteBusinessUnitCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(DeleteBusinessUnitCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.BusinessUnit>(req.Id, ct);
        if (entity != null) { entity.IsDeleted = true; await _db.UpdateAsync(entity, ct); }
        return true;
    }
}
