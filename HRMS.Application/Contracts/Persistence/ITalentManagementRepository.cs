using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Onboarding;
using HRMS.Domain.Entities.Offboarding;

namespace HRMS.Application.Contracts.Persistence;

public interface ITalentManagementRepository
{
    // Onboarding
    Task<List<OnboardingTask>> GetPendingTasksAsync();
    Task<List<EmployeeDocument>> GetPendingDocumentsAsync();
    Task<List<BackgroundVerification>> GetBackgroundVerificationsAsync();
    
    // Offboarding
    Task<List<Resignation>> GetResignationsAsync();
    Task<List<ExitClearance>> GetPendingClearancesAsync();
    Task<List<ExitInterview>> GetExitInterviewsAsync();
    
    // Analytics
    Task<object> GetOnboardingAnalyticsAsync();
    Task<object> GetOffboardingAnalyticsAsync();
}
