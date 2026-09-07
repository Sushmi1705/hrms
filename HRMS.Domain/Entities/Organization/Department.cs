using System;
using System.Collections.Generic;
namespace HRMS.Domain.Entities.Organization;

public class Department : BaseAuditableEntity
{
    public Guid BranchId { get; set; }
    public Branch Branch { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }

    public ICollection<Designation> Designations { get; set; } = new List<Designation>();
}
