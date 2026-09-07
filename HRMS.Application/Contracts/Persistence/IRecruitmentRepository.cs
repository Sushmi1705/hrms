using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Recruitment;

namespace HRMS.Application.Contracts.Persistence;

public interface IRecruitmentRepository
{
    Task<IEnumerable<JobOpening>> GetActiveJobOpeningsAsync();
    Task<int> GetTotalActiveCandidatesAsync();
    Task<int> GetTotalApplicationsInPipelineAsync();
    Task<int> GetInterviewsScheduledThisWeekAsync();
    
    // Analytics
    Task<int> GetOffersAcceptedCountAsync();
    Task<int> GetOffersSentCountAsync();
    Task<int> GetHiresThisMonthAsync();
    Task<decimal> GetAverageTimeToHireDaysAsync();
}
