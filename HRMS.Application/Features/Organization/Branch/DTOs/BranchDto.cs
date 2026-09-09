using System;

namespace HRMS.Application.Features.Organization.Branch.DTOs;

public class BranchDto
{
    public Guid Id { get; set; }
    public Guid BusinessUnitId { get; set; }
    public string BusinessUnitName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int LocationsCount { get; set; }
    public int DepartmentsCount { get; set; }
}
