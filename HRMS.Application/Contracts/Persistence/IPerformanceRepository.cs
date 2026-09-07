using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Performance;

namespace HRMS.Application.Contracts.Persistence;

public interface IPerformanceRepository
{
    Task<ReviewCycle?> GetActiveReviewCycleAsync();
    Task<IEnumerable<Goal>> GetEmployeeGoalsAsync(Guid employeeId);
    Task<IEnumerable<PerformanceReview>> GetEmployeeReviewsAsync(Guid employeeId);
    Task<PerformanceReview?> GetReviewByIdAsync(Guid id);
    Task<PerformanceReview> CreateReviewAsync(PerformanceReview review);
    Task<PerformanceReview> UpdateReviewAsync(PerformanceReview review);
    
    // Analytics
    Task<int> GetActivePipCountAsync();
    Task<int> GetPendingReviewsCountAsync();
    Task<int> GetCompletedReviewsCountAsync();
    Task<decimal> GetAverageCompanyRatingAsync();
}
