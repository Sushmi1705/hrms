using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowCondition : BaseAuditableEntity
{
    public Guid WorkflowStepId { get; set; }
    public WorkflowStep? WorkflowStep { get; set; }

    public string Field { get; set; } = string.Empty; // e.g. "days", "amount", "department", "salary_increase_pct", "request_type"
    public string Operator { get; set; } = "Equals"; 
    // Operators: Equals, NotEquals, GreaterThan, LessThan, GreaterThanOrEqual, LessThanOrEqual, Contains, DoesNotContain, InList, NotInList
    public string Value { get; set; } = string.Empty;
    public string Logic { get; set; } = "AND"; // AND / OR
    public int OrderIndex { get; set; } = 0;
}
