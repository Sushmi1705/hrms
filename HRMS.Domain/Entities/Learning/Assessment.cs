using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class Assessment : BaseAuditableEntity
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal PassingMarks { get; set; }
    public int DurationMinutes { get; set; }
}

