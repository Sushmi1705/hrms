using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class Certification : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public Guid CourseId { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
}

