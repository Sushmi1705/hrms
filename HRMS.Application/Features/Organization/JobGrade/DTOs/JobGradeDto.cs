using System;

namespace HRMS.Application.Features.Organization.JobGrade.DTOs;

public class JobGradeDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
}
