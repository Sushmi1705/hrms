using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Domain.Entities.Performance;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Application.Features.Performance.Queries;

public class GetEmployeeReviewsQuery : IRequest<IEnumerable<PerformanceReview>>
{
    public Guid EmployeeId { get; set; }
}

public class GetEmployeeReviewsQueryHandler : IRequestHandler<GetEmployeeReviewsQuery, IEnumerable<PerformanceReview>>
{
    private readonly IPerformanceRepository _repository;

    public GetEmployeeReviewsQueryHandler(IPerformanceRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PerformanceReview>> Handle(GetEmployeeReviewsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetEmployeeReviewsAsync(request.EmployeeId);
    }
}
