using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Attendance;

public class Holiday : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string HolidayType { get; set; } = "Company"; // Company, Regional, Religious
    public string? Description { get; set; }
    
    // Optional targeting
    public Guid? BranchId { get; set; }
    public Guid? LocationId { get; set; }
}
