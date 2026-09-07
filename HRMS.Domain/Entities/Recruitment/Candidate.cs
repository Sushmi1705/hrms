using System;
using System.Collections.Generic;

namespace HRMS.Domain.Entities.Recruitment;

public class Candidate
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty; // e.g. "5 Years"
    public string Education { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty; // comma separated
    public string CurrentEmployer { get; set; } = string.Empty;
    public decimal CurrentSalary { get; set; }
    public decimal ExpectedSalary { get; set; }
    public int NoticePeriodDays { get; set; }
    public string Source { get; set; } = string.Empty; // LinkedIn, Referral, Career Site
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}
