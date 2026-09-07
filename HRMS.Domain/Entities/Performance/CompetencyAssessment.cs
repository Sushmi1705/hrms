using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class CompetencyAssessment : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid ReviewCycleId { get; set; }
    public ReviewCycle? ReviewCycle { get; set; }
    
    public decimal LeadershipScore { get; set; }
    public decimal CommunicationScore { get; set; }
    public decimal TechnicalScore { get; set; }
    public decimal ProblemSolvingScore { get; set; }
    public decimal InnovationScore { get; set; }
    public decimal TeamworkScore { get; set; }
    
    public string? OverallFeedback { get; set; }
}


