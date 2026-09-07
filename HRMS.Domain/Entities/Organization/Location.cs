using System;
namespace HRMS.Domain.Entities.Organization;

public class Location : BaseAuditableEntity
{
    public Guid BranchId { get; set; }
    public Branch Branch { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
}
