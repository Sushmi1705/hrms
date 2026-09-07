using System;

namespace HRMS.Domain.Entities.Offboarding;

public class ExitClearance
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string Department { get; set; } = string.Empty; // IT, Finance, HR
    public Guid ClearedById { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Cleared
    public string Comments { get; set; } = string.Empty;
}
