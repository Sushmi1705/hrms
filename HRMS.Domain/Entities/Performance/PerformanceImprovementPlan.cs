using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class PerformanceImprovementPlan : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid CoachId { get; set; }
    public EmployeeEntity? Coach { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string ImprovementGoals { get; set; } = string.Empty;
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public string Status { get; set; } = "Active"; // Active, Extended, Passed, Failed
    public string? FinalOutcomeComments { get; set; }
}


