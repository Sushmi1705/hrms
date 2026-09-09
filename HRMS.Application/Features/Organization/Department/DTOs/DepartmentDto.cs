using System;

namespace HRMS.Application.Features.Organization.Department.DTOs;

public class DepartmentDto
{
    public Guid Id { get; set; }
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string BusinessUnitName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DesignationsCount { get; set; }
}
