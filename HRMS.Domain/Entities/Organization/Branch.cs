using System;
using System.Collections.Generic;
namespace HRMS.Domain.Entities.Organization;

public class Branch : BaseAuditableEntity
{
    public Guid BusinessUnitId { get; set; }
    public BusinessUnit BusinessUnit { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }

    public ICollection<Location> Locations { get; set; } = new List<Location>();
    public ICollection<Department> Departments { get; set; } = new List<Department>();
}
