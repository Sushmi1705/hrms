using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class QualifyingLifeEvent : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    // Marriage, BirthAdoption, Divorce, LossOfCoverage, StatusChange, Other
    public string EventType { get; set; } = "Marriage";
    public DateTime EventDate { get; set; }
    public string Description { get; set; } = string.Empty;
    
    public string SupportingDocumentName { get; set; } = string.Empty;
    public string SupportingDocumentUrl { get; set; } = string.Empty;
    
    // Submitted, UnderReview, Approved, Rejected
    public string Status { get; set; } = "Submitted";
    public string ReviewComments { get; set; } = string.Empty;
    public string ReviewedBy { get; set; } = string.Empty;
    public DateTime? ReviewedAt { get; set; }
}
