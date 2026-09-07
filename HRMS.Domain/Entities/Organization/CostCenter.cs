using System;
namespace HRMS.Domain.Entities.Organization;

public class CostCenter : BaseAuditableEntity
{
    public Guid BusinessUnitId { get; set; }
    public BusinessUnit BusinessUnit { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
}
