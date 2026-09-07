using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class PerformanceReview : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid ReviewCycleId { get; set; }
    public ReviewCycle? ReviewCycle { get; set; }
    
    public Guid? ManagerId { get; set; }
    public EmployeeEntity? Manager { get; set; }

    public string Status { get; set; } = "Draft"; // Draft, Submitted, Manager Reviewed, Approved, Finalized
    
    // Self Assessment
    public string? SelfAssessmentComments { get; set; }
    public decimal? SelfRating { get; set; } // Out of 5.0
    
    // Manager Assessment
    public string? ManagerComments { get; set; }
    public decimal? ManagerRating { get; set; } // Out of 5.0
    
    public string? FinalRating { get; set; } // e.g. "Exceeds Expectations", "Meets Expectations"
    
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ManagerReviewedAt { get; set; }
}


