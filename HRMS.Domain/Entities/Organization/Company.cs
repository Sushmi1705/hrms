using System.Collections.Generic;
namespace HRMS.Domain.Entities.Organization;

public class Company : BaseAuditableEntity
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    public ICollection<BusinessUnit> BusinessUnits { get; set; } = new List<BusinessUnit>();
}
