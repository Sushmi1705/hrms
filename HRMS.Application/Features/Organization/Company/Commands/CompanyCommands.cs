using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.Company.Commands;

public record CreateCompanyCommand(string Code, string Name, string? Description = null) : IRequest<Guid>;
public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateCompanyCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateCompanyCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.Company 
        { 
            Id = Guid.NewGuid(),
            Code = req.Code, 
            Name = req.Name,
            Description = req.Description ?? string.Empty
        };
        await _db.AddAsync(entity, ct);
        return entity.Id;
    }
}

public record UpdateCompanyCommand(Guid Id, string Code, string Name, string? Description = null) : IRequest<bool>;
public class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public UpdateCompanyCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(UpdateCompanyCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Company>(req.Id, ct);
        if (entity == null) return false;
        entity.Code = req.Code;
        entity.Name = req.Name;
        entity.Description = req.Description ?? string.Empty;
        await _db.UpdateAsync(entity, ct);
        return true;
    }
}

public record DeleteCompanyCommand(Guid Id) : IRequest<bool>;
public class DeleteCompanyCommandHandler : IRequestHandler<DeleteCompanyCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public DeleteCompanyCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(DeleteCompanyCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Company>(req.Id, ct);
        if (entity != null) { entity.IsDeleted = true; await _db.UpdateAsync(entity, ct); }
        return true;
    }
}
