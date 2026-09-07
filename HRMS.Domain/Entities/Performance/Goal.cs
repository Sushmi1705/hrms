using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Performance;

public class Goal : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid ReviewCycleId { get; set; }
    public ReviewCycle? ReviewCycle { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GoalType { get; set; } = "Individual"; // Individual, Department, Company
    public string Priority { get; set; } = "Medium"; // High, Medium, Low
    public decimal Weightage { get; set; } // Out of 100%
    public decimal ProgressPercentage { get; set; }
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = "In Progress"; // Not Started, In Progress, Completed, Overdue
    public string? Comments { get; set; }
}


