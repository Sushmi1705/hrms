using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Recruitment;
using HRMS.Application.Contracts.Persistence;

namespace HRMS.Persistence.Repositories;

public class RecruitmentRepository : IRecruitmentRepository
{
    private readonly HrmsDbContext _context;

    public RecruitmentRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobOpening>> GetActiveJobOpeningsAsync()
    {
        return await _context.Set<JobOpening>()
            .Where(j => j.Status == "Published")
            .ToListAsync();
    }

    public async Task<int> GetTotalActiveCandidatesAsync()
    {
        return await _context.Set<Candidate>().CountAsync();
    }

    public async Task<int> GetTotalApplicationsInPipelineAsync()
    {
        return await _context.Set<JobApplication>()
            .CountAsync(a => a.PipelineStage != "Rejected" && a.PipelineStage != "Hired");
    }

    public async Task<int> GetInterviewsScheduledThisWeekAsync()
    {
        var now = DateTime.UtcNow;
        var endOfWeek = now.AddDays(7);
        return await _context.Set<Interview>()
            .CountAsync(i => i.ScheduledAt >= now && i.ScheduledAt <= endOfWeek && i.Status == "Scheduled");
    }

    public async Task<int> GetOffersAcceptedCountAsync()
    {
        return await _context.Set<JobOffer>()
            .CountAsync(o => o.Status == "Accepted");
    }

    public async Task<int> GetOffersSentCountAsync()
    {
        return await _context.Set<JobOffer>()
            .CountAsync(o => o.Status == "Pending" || o.Status == "Negotiating");
    }

    public async Task<int> GetHiresThisMonthAsync()
    {
        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        return await _context.Set<JobApplication>()
            .CountAsync(a => a.PipelineStage == "Hired" && a.ApplicationDate >= startOfMonth);
    }

    public async Task<decimal> GetAverageTimeToHireDaysAsync()
    {
        // Dummy complex calculation
        return await Task.FromResult(24.5m);
    }
}
