using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class BenefitPlan : BaseAuditableEntity
{
    public string PlanCode { get; set; } = string.Empty; // E.g., MED-PPO-01, DEN-PREM, RET-401K
    public string PlanName { get; set; } = string.Empty; // E.g., Comprehensive Medical PPO, 401(k) Retirement Match
    
    // MedicalInsurance, Dental, Vision, LifeInsurance, Accident, Retirement, Pension, ProvidentFund, Wellness, Meal, Transport, Phone, Education
    public string Type { get; set; } = "MedicalInsurance";
    
    public string Provider { get; set; } = string.Empty; // BlueCross, MetLife, Fidelity, Vanguard, Kaiser
    public string Description { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    
    public decimal CoverageAmount { get; set; } // Max insured or policy limit
    
    // Standard Monthly Contribution Rates
    public decimal EmployeeMonthlyCost { get; set; }
    public decimal EmployerMonthlyCost { get; set; }
    
    // Percentage or FlatAmount
    public string ContributionType { get; set; } = "FixedAmount";
    public decimal? EmployerMatchPercentage { get; set; } // E.g., 5% match for 401k
    public decimal? EmployerMatchLimit { get; set; }
    
    public string Currency { get; set; } = "USD";
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    // Active, OpenForEnrollment, Closed, Deprecated
    public string Status { get; set; } = "Active";
    
    public bool RequiresDependentsVerification { get; set; } = true;
    public bool AllowsDependents { get; set; } = true;

    public ICollection<BenefitEligibilityRule> EligibilityRules { get; set; } = new List<BenefitEligibilityRule>();
    public ICollection<BenefitEnrollment> Enrollments { get; set; } = new List<BenefitEnrollment>();
}
