using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Features.Organization.Branch.DTOs;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.Branch.Commands;

public record CreateBranchCommand(string Code, string Name) : IRequest<Guid>;
public class CreateBranchCommandHandler : IRequestHandler<CreateBranchCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateBranchCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateBranchCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.Branch { Code = req.Code, Name = req.Name };
        await _db.AddAsync(entity, ct);
        return entity.Id;
    }
}

public record DeleteBranchCommand(Guid Id) : IRequest<bool>;
public class DeleteBranchCommandHandler : IRequestHandler<DeleteBranchCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public DeleteBranchCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(DeleteBranchCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Branch>(req.Id, ct);
        if (entity != null) { entity.IsDeleted = true; await _db.UpdateAsync(entity, ct); }
        return true;
    }
}

