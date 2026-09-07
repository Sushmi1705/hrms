using System;
namespace HRMS.Domain.Entities.Organization;

public class Designation : BaseAuditableEntity
{
    public Guid DepartmentId { get; set; }
    public Department Department { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
}
