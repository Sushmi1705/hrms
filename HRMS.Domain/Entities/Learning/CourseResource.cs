using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class CourseResource : BaseAuditableEntity
{
    public Guid CourseId { get; set; }
    public string Type { get; set; } = string.Empty; // Video, PDF, SCORM, Link
    public string ResourceUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}

