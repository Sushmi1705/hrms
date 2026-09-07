using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Features.Organization.Location.DTOs;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.Location.Commands;

public record CreateLocationCommand(string Code, string Name) : IRequest<Guid>;
public class CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateLocationCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateLocationCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.Location { Code = req.Code, Name = req.Name };
        await _db.AddAsync(entity, ct);
        return entity.Id;
    }
}

public record DeleteLocationCommand(Guid Id) : IRequest<bool>;
public class DeleteLocationCommandHandler : IRequestHandler<DeleteLocationCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public DeleteLocationCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(DeleteLocationCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Location>(req.Id, ct);
        if (entity != null) { entity.IsDeleted = true; await _db.UpdateAsync(entity, ct); }
        return true;
    }
}

