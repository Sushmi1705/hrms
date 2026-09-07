using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Recruitment;

public class JobRequisition
{
    public Guid Id { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public Guid HiringManagerId { get; set; }
    public string EmploymentType { get; set; } = string.Empty; // Full-time, Contract
    public string ReasonForHire { get; set; } = string.Empty; // New Position, Replacement
    public decimal Budget { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Department? Department { get; set; }
}

public class JobOpening
{
    public Guid Id { get; set; }
    public Guid RequisitionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string WorkplaceType { get; set; } = string.Empty; // Remote, Hybrid, Office
    public int Vacancies { get; set; }
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Published, Closed, Archived

    public JobRequisition? Requisition { get; set; }
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
