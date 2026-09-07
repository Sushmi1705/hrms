using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class LearningPath : BaseAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? TargetDepartmentId { get; set; }
    public Guid? TargetDesignationId { get; set; }
}

