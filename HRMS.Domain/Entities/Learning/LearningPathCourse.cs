using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class LearningPathCourse : BaseAuditableEntity
{
    public Guid LearningPathId { get; set; }
    public Guid CourseId { get; set; }
    public int OrderIndex { get; set; }
}

