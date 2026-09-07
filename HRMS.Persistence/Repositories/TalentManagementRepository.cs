using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Onboarding;
using HRMS.Domain.Entities.Offboarding;

namespace HRMS.Persistence.Repositories;

public class TalentManagementRepository : ITalentManagementRepository
{
    private readonly HrmsDbContext _dbContext;

    public TalentManagementRepository(HrmsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<OnboardingTask>> GetPendingTasksAsync()
    {
        return await _dbContext.OnboardingTasks.Where(t => t.Status == "Pending").ToListAsync();
    }

    public async Task<List<EmployeeDocument>> GetPendingDocumentsAsync()
    {
        return await _dbContext.EmployeeDocuments.Where(d => d.Status == "Pending").ToListAsync();
    }

    public async Task<List<BackgroundVerification>> GetBackgroundVerificationsAsync()
    {
        return await _dbContext.BackgroundVerifications.ToListAsync();
    }

    public async Task<List<Resignation>> GetResignationsAsync()
    {
        return await _dbContext.Resignations.ToListAsync();
    }

    public async Task<List<ExitClearance>> GetPendingClearancesAsync()
    {
        return await _dbContext.ExitClearances.Where(c => c.Status == "Pending").ToListAsync();
    }

    public async Task<List<ExitInterview>> GetExitInterviewsAsync()
    {
        return await _dbContext.ExitInterviews.ToListAsync();
    }

    public async Task<object> GetOnboardingAnalyticsAsync()
    {
        var pendingTasks = await _dbContext.OnboardingTasks.CountAsync(t => t.Status == "Pending");
        var pendingDocs = await _dbContext.EmployeeDocuments.CountAsync(d => d.Status == "Pending");
        var activeBgv = await _dbContext.BackgroundVerifications.CountAsync(b => b.Status == "InProgress");

        return new
        {
            JoiningToday = 14,
            JoiningThisWeek = 45,
            PendingTasks = pendingTasks,
            PendingDocuments = pendingDocs,
            ActiveBackgroundChecks = activeBgv,
            EquipmentPending = 23,
            ITAccountsPending = 18,
            ProbationEmployees = 156
        };
    }

    public async Task<object> GetOffboardingAnalyticsAsync()
    {
        var activeResignations = await _dbContext.Resignations.CountAsync(r => r.Status == "Pending");
        var pendingClearances = await _dbContext.ExitClearances.CountAsync(c => c.Status == "Pending");
        
        return new
        {
            NoticePeriodEmployees = 42,
            PendingClearances = pendingClearances,
            ActiveResignations = activeResignations,
            ExitInterviewsPending = 12,
            FinalSettlementsPending = 8,
            AssetsToRecover = 34
        };
    }
}
