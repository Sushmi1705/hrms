using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Features.Organization.Department.Commands;

public record CreateDepartmentCommand(string Code, string Name, Guid? BranchId = null) : IRequest<Guid>;
public class CreateDepartmentCommandHandler : IRequestHandler<CreateDepartmentCommand, Guid>
{
    private readonly IOrganizationRepository _db;
    public CreateDepartmentCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<Guid> Handle(CreateDepartmentCommand req, CancellationToken ct) {
        var entity = new HRMS.Domain.Entities.Organization.Department 
        { 
            Id = Guid.NewGuid(),
            Code = req.Code, 
            Name = req.Name,
            BranchId = req.BranchId ?? Guid.Empty
        };
        await _db.AddAsync(entity, ct);
        return entity.Id;
    }
}

public record UpdateDepartmentCommand(Guid Id, string Code, string Name, Guid? BranchId = null) : IRequest<bool>;
public class UpdateDepartmentCommandHandler : IRequestHandler<UpdateDepartmentCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public UpdateDepartmentCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(UpdateDepartmentCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Department>(req.Id, ct);
        if (entity == null) return false;
        entity.Code = req.Code;
        entity.Name = req.Name;
        if (req.BranchId.HasValue && req.BranchId.Value != Guid.Empty)
        {
            entity.BranchId = req.BranchId.Value;
        }
        await _db.UpdateAsync(entity, ct);
        return true;
    }
}

public record DeleteDepartmentCommand(Guid Id) : IRequest<bool>;
public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand, bool>
{
    private readonly IOrganizationRepository _db;
    public DeleteDepartmentCommandHandler(IOrganizationRepository db) { _db = db; }
    public async Task<bool> Handle(DeleteDepartmentCommand req, CancellationToken ct) {
        var entity = await _db.GetByIdAsync<HRMS.Domain.Entities.Organization.Department>(req.Id, ct);
        if (entity != null) { entity.IsDeleted = true; await _db.UpdateAsync(entity, ct); }
        return true;
    }
}
