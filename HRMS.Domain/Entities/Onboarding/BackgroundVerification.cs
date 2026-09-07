using System;

namespace HRMS.Domain.Entities.Onboarding;

public class BackgroundVerification
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string VerificationType { get; set; } = string.Empty; // Identity, Police, Education
    public string VendorName { get; set; } = string.Empty;
    public DateTime InitiatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string Status { get; set; } = "InProgress"; // InProgress, Cleared, Failed
    public string Remarks { get; set; } = string.Empty;
}
