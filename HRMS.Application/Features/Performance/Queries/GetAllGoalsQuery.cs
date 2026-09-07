using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Domain.Entities.Performance;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Performance.Queries;

public class GetAllGoalsQuery : IRequest<IEnumerable<Goal>>
{
    public Guid EmployeeId { get; set; }
}

public class GetAllGoalsQueryHandler : IRequestHandler<GetAllGoalsQuery, IEnumerable<Goal>>
{
    private readonly IPerformanceRepository _repository;

    public GetAllGoalsQueryHandler(IPerformanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Goal>> Handle(GetAllGoalsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetEmployeeGoalsAsync(request.EmployeeId);
    }
}
