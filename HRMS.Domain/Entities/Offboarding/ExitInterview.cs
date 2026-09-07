using System;

namespace HRMS.Domain.Entities.Offboarding;

public class ExitInterview
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public Guid HrInterviewerId { get; set; }
    public DateTime ConductedAt { get; set; }
    public int Rating { get; set; } // 1 to 5
    public string PrimaryReasonForLeaving { get; set; } = string.Empty;
    public string FeedbackNotes { get; set; } = string.Empty;
}
