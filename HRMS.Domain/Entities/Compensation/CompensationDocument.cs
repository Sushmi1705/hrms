using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationDocument : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public string Title { get; set; } = string.Empty;
    
    // CompensationLetter, SalaryRevisionLetter, BonusAwardLetter, BenefitEnrollmentSummary, TotalRewardsStatement, InsurancePolicy
    public string DocumentType { get; set; } = "CompensationLetter";
    
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string MimeType { get; set; } = "application/pdf";
    public Guid? DmsDocumentRecordId { get; set; }
    public string Description { get; set; } = string.Empty;
}
