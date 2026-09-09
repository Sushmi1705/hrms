using System;

namespace HRMS.Application.Features.Organization.CostCenter.DTOs;

public class CostCenterDto
{
    public Guid Id { get; set; }
    public Guid BusinessUnitId { get; set; }
    public string BusinessUnitName { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
