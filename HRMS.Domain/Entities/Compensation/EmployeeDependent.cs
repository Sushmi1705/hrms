using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class EmployeeDependent : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    
    // Spouse, Child, DomesticPartner, Parent, Other
    public string Relationship { get; set; } = "Spouse";
    
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = "Unspecified";
    public string NationalId { get; set; } = string.Empty; // SSN / National Id masked
    public string ContactPhone { get; set; } = string.Empty;
    
    // Verified, PendingVerification, Rejected
    public string VerificationStatus { get; set; } = "Verified";
    public string VerifiedBy { get; set; } = string.Empty;
    public DateTime? VerifiedAt { get; set; }
}
