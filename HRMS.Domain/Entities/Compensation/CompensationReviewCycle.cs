using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Compensation;

public class CompensationReviewCycle : BaseAuditableEntity
{
    public string CycleName { get; set; } = string.Empty; // E.g., "FY2026 Annual Merit & Compensation Review"
    public int FiscalYear { get; set; } = 2026;
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime EffectiveDate { get; set; }
    
    public decimal TotalBudget { get; set; }
    public decimal AllocatedBudget { get; set; }
    public decimal UsedBudget { get; set; }
    public string Currency { get; set; } = "USD";
    
    // Draft, Open, InReview, PendingApproval, Approved, Completed, Cancelled
    public string Status { get; set; } = "Open";
    public string Guidelines { get; set; } = string.Empty;

    public ICollection<CompensationReviewItem> ReviewItems { get; set; } = new List<CompensationReviewItem>();
}
