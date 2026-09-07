using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Features.Organization.Company.DTOs;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.Company.Commands;

public record CreateCompanyCommand(string Code, string Name) : IRequest<Guid>;
public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateCompanyCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateCompanyCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.Company { Code = req.Code, Name = req.Name };
        await _db.AddAsync(entity, ct);
        return entity.Id;
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

