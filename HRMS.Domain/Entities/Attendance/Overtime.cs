using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Attendance;

public class Overtime : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public decimal Hours { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, PayrollProcessed
    public Guid? ApprovedById { get; set; }
}
