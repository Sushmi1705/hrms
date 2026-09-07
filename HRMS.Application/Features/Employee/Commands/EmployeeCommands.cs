using MediatR;
using HRMS.Domain.Entities.Employee;
using HRMS.Application.Interfaces.Repositories;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace HRMS.Application.Features.Employee.Commands;

public record CreateEmployeeCommand(string FirstName, string LastName, string Email, DateTime JoiningDate, Guid DepartmentId, Guid DesignationId, Guid BranchId) : IRequest<Guid>;
public record UpdateEmployeeCommand(Guid Id, string FirstName, string LastName, string Email, DateTime JoiningDate, Guid DepartmentId, Guid DesignationId, Guid BranchId, string Status) : IRequest<bool>;
public record DeleteEmployeeCommand(Guid Id) : IRequest<bool>;

public class EmployeeCommandHandlers : 
    IRequestHandler<CreateEmployeeCommand, Guid>,
    IRequestHandler<UpdateEmployeeCommand, bool>,
    IRequestHandler<DeleteEmployeeCommand, bool>
{
    private readonly IOrganizationRepository _repo;
    public EmployeeCommandHandlers(IOrganizationRepository repo) => _repo = repo;

    public async Task<Guid> Handle(CreateEmployeeCommand request, CancellationToken ct)
    {
        var entity = new EmployeeEntity { 
            Id = Guid.NewGuid(),
            EmployeeNumber = "EMP" + new Random().Next(1000, 9999),
            FirstName = request.FirstName, 
            LastName = request.LastName, 
            Email = request.Email,
            JoiningDate = request.JoiningDate,
            DepartmentId = request.DepartmentId,
            DesignationId = request.DesignationId,
            BranchId = request.BranchId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System",
            UpdatedBy = "",
            DeletedBy = ""
        };
        await _repo.AddAsync(entity, ct);
        return entity.Id;
    }

    public async Task<bool> Handle(UpdateEmployeeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<EmployeeEntity>(request.Id, ct);
        if (entity == null) return false;

        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.Email = request.Email;
        entity.JoiningDate = request.JoiningDate;
        entity.DepartmentId = request.DepartmentId;
        entity.DesignationId = request.DesignationId;
        entity.BranchId = request.BranchId;
        entity.Status = request.Status;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = "System";
        entity.CreatedBy = string.IsNullOrEmpty(entity.CreatedBy) ? "System" : entity.CreatedBy;
        entity.DeletedBy = string.IsNullOrEmpty(entity.DeletedBy) ? "" : entity.DeletedBy;

        await _repo.UpdateAsync(entity, ct);
        return true;
    }

    public async Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken ct)
    {
        var entity = await _repo.GetByIdAsync<EmployeeEntity>(request.Id, ct);
        if (entity == null) return false;
        entity.DeletedAt = DateTime.UtcNow;
        entity.DeletedBy = "System";
        entity.IsDeleted = true;
        
        // Ensure other non-nullables are populated to avoid EF in-memory errors on update
        entity.CreatedBy = string.IsNullOrEmpty(entity.CreatedBy) ? "System" : entity.CreatedBy;
        entity.UpdatedBy = string.IsNullOrEmpty(entity.UpdatedBy) ? "System" : entity.UpdatedBy;

        await _repo.UpdateAsync(entity, ct);
        return true;
    }
}
