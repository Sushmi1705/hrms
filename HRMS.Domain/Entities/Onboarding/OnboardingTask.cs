using System;

namespace HRMS.Domain.Entities.Onboarding;

public class OnboardingTask
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string TaskName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // HR, IT, Admin, Manager
    public Guid AssignedToId { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed
}
