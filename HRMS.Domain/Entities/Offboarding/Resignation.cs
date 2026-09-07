using System;

namespace HRMS.Domain.Entities.Offboarding;

public class Resignation
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime ExpectedLastDay { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Retained
    public string ManagerFeedback { get; set; } = string.Empty;
}
