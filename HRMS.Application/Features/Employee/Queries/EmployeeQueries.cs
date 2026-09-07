using MediatR;
using HRMS.Domain.Entities.Employee;
using HRMS.Application.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Features.Employee.DTOs;
using System.Linq;

namespace HRMS.Application.Features.Employee.Queries;

public record GetAllEmployeesQuery() : IRequest<IReadOnlyList<EmployeeDto>>;

public class GetAllEmployeesQueryHandler : IRequestHandler<GetAllEmployeesQuery, IReadOnlyList<EmployeeDto>>
{
    private readonly IOrganizationRepository _repo; // Reusing generic repo interface
    public GetAllEmployeesQueryHandler(IOrganizationRepository repo) => _repo = repo;

    public async Task<IReadOnlyList<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken ct)
    {
        var entities = await _repo.GetAllAsync<EmployeeEntity>(ct);
        return entities.Select(e => new EmployeeDto {
            Id = e.Id,
            EmployeeNumber = e.EmployeeNumber,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Status = e.Status,
            JoiningDate = e.JoiningDate
        }).ToList();
    }
}
