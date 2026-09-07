using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class SkillMatrix : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string Level { get; set; } = "Beginner"; // Beginner, Intermediate, Advanced, Expert
}

