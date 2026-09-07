using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class Delegation : BaseAuditableEntity
{
    public string DelegatorId { get; set; } = string.Empty;
    public string DelegatorName { get; set; } = string.Empty;
    public string DelegateeId { get; set; } = string.Empty;
    public string DelegateeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string Modules { get; set; } = "All"; // Comma separated modules or 'All'
}
