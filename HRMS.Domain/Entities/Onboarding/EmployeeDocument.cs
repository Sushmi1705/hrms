using System;

namespace HRMS.Domain.Entities.Onboarding;

public class EmployeeDocument
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string DocumentType { get; set; } = string.Empty; // Passport, NDA, Degree
    public string FileUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
}
