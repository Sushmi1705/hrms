using System;

namespace HRMS.Application.Features.Organization.Company.DTOs;

public class CompanyDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int BusinessUnitsCount { get; set; }
}
