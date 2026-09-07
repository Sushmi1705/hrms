using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Compensation;

public class BenefitEnrollment : BaseAuditableEntity
{
    public string EnrollmentNumber { get; set; } = string.Empty; // E.g., BEN-2026-00101
    
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid BenefitPlanId { get; set; }
    public BenefitPlan? BenefitPlan { get; set; }
    
    // EmployeeOnly, EmployeeSpouse, EmployeeChildren, Family
    public string CoverageTier { get; set; } = "EmployeeOnly";
    
    public decimal EmployeeMonthlyContribution { get; set; }
    public decimal EmployerMonthlyContribution { get; set; }
    public decimal TotalMonthlyPremium => EmployeeMonthlyContribution + EmployerMonthlyContribution;
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    public DateTime EffectiveDate { get; set; }
    public DateTime? RenewalDate { get; set; }
    public DateTime? TerminationDate { get; set; }
    
    // Draft, Submitted, PendingApproval, Active, Cancelled, Terminated
    public string Status { get; set; } = "Active";
    
    // OpenEnrollment, NewHire, QualifyingLifeEvent, Special
    public string EnrollmentType { get; set; } = "OpenEnrollment";
    public string Notes { get; set; } = string.Empty;

    public string CoveredDependentIds { get; set; } = "[]"; // Serialized JSON array of Guid dependent IDs
}
