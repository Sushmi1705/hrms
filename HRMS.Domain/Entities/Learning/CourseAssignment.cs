using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class CourseAssignment : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public Guid CourseId { get; set; }
    public string Status { get; set; } = "Not Started"; // Not Started, In Progress, Completed
    public int ProgressPercentage { get; set; } = 0;
    public decimal? Score { get; set; }
}

