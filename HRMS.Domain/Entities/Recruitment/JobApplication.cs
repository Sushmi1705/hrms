using System;
using System.Collections.Generic;

namespace HRMS.Domain.Entities.Recruitment;

public class JobApplication
{
    public Guid Id { get; set; }
    public Guid JobOpeningId { get; set; }
    public Guid CandidateId { get; set; }
    public string PipelineStage { get; set; } = "Applied"; // Applied, Screening, Technical, HR, Manager, Offered, Hired, Rejected
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
    public string Notes { get; set; } = string.Empty;
    public decimal Rating { get; set; }

    public JobOpening? JobOpening { get; set; }
    public Candidate? Candidate { get; set; }
    public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
}

public class Interview
{
    public Guid Id { get; set; }
    public Guid JobApplicationId { get; set; }
    public string Title { get; set; } = string.Empty; // e.g. "Technical Round 1"
    public DateTime ScheduledAt { get; set; }
    public int DurationMinutes { get; set; }
    public string MeetingLink { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled, Rescheduled
    public string Feedback { get; set; } = string.Empty;
    public decimal Score { get; set; }

    public JobApplication? Application { get; set; }
}

public class JobOffer
{
    public Guid Id { get; set; }
    public Guid JobApplicationId { get; set; }
    public decimal OfferedSalary { get; set; }
    public DateTime JoiningDate { get; set; }
    public DateTime OfferExpiryDate { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Negotiating
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public JobApplication? Application { get; set; }
}
