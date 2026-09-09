using System;

namespace HRMS.Application.Features.Organization.BusinessUnit.DTOs;

public class BusinessUnitDto
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int BranchesCount { get; set; }
}
