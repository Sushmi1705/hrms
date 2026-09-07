using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Performance;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Persistence.Repositories;

public class PerformanceRepository : IPerformanceRepository
{
    private readonly HrmsDbContext _context;

    public PerformanceRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<ReviewCycle?> GetActiveReviewCycleAsync()
    {
        return await _context.Set<ReviewCycle>()
            .Where(r => r.Status == "Active")
            .OrderByDescending(r => r.StartDate)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Goal>> GetEmployeeGoalsAsync(Guid employeeId)
    {
        return await _context.Set<Goal>()
            .Where(g => g.EmployeeId == employeeId)
            .OrderBy(g => g.Deadline)
            .ToListAsync();
    }

    public async Task<IEnumerable<PerformanceReview>> GetEmployeeReviewsAsync(Guid employeeId)
    {
        return await _context.Set<PerformanceReview>()
            .Include(r => r.ReviewCycle)
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<PerformanceReview?> GetReviewByIdAsync(Guid id)
    {
        return await _context.Set<PerformanceReview>()
            .Include(r => r.Employee)
            .Include(r => r.Manager)
            .Include(r => r.ReviewCycle)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<PerformanceReview> CreateReviewAsync(PerformanceReview review)
    {
        _context.Set<PerformanceReview>().Add(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<PerformanceReview> UpdateReviewAsync(PerformanceReview review)
    {
        _context.Entry(review).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<int> GetActivePipCountAsync()
    {
        return await _context.Set<PerformanceImprovementPlan>()
            .CountAsync(p => p.Status == "Active" || p.Status == "Extended");
    }

    public async Task<int> GetPendingReviewsCountAsync()
    {
        return await _context.Set<PerformanceReview>()
            .CountAsync(r => r.Status != "Finalized" && r.Status != "Approved");
    }

    public async Task<int> GetCompletedReviewsCountAsync()
    {
        return await _context.Set<PerformanceReview>()
            .CountAsync(r => r.Status == "Finalized" || r.Status == "Approved");
    }

    public async Task<decimal> GetAverageCompanyRatingAsync()
    {
        var ratings = await _context.Set<PerformanceReview>()
            .Where(r => r.ManagerRating.HasValue)
            .Select(r => r.ManagerRating!.Value)
            .ToListAsync();
            
        return ratings.Any() ? Math.Round(ratings.Average(), 1) : 0;
    }
}
