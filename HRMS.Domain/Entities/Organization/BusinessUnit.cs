using System;
using System.Collections.Generic;
namespace HRMS.Domain.Entities.Organization;

public class BusinessUnit : BaseAuditableEntity
{
    public Guid CompanyId { get; set; }
    public Company Company { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }

    public ICollection<Branch> Branches { get; set; } = new List<Branch>();
    public ICollection<CostCenter> CostCenters { get; set; } = new List<CostCenter>();
}
