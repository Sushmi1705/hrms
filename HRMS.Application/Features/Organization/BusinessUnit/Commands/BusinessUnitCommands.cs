using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Features.Organization.BusinessUnit.DTOs;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.BusinessUnit.Commands;

public record CreateBusinessUnitCommand(string Code, string Name) : IRequest<Guid>;
public class CreateBusinessUnitCommandHandler : IRequestHandler<CreateBusinessUnitCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateBusinessUnitCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateBusinessUnitCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.BusinessUnit { Code = req.Code, Name = req.Name };
        await _db.AddAsync(entity, ct);
        return entity.Id;
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

