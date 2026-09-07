using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Performance;

public class ReviewCycle : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Yearly"; // Quarterly, Half-Yearly, Yearly, Custom
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Active"; // Active, Closed, Archived
    public string? Description { get; set; }
}
