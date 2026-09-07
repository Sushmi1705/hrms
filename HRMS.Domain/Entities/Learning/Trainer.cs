using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class Trainer : BaseAuditableEntity
{
    public Guid? EmployeeId { get; set; }
    public string Type { get; set; } = "Internal"; // Internal, External
    public string Name { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public decimal Rating { get; set; }
}

