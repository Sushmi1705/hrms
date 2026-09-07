using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class Feedback360 : BaseAuditableEntity
{
    public Guid TargetEmployeeId { get; set; }
    public EmployeeEntity? TargetEmployee { get; set; }
    
    public Guid ReviewerEmployeeId { get; set; }
    public EmployeeEntity? ReviewerEmployee { get; set; }
    
    public Guid ReviewCycleId { get; set; }
    public ReviewCycle? ReviewCycle { get; set; }

    public string Relationship { get; set; } = "Peer"; // Peer, Subordinate, External
    public decimal Rating { get; set; }
    public string? FeedbackComments { get; set; }
    public string? Strengths { get; set; }
    public string? AreasForImprovement { get; set; }
    public bool IsAnonymous { get; set; }
}


