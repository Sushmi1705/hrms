using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Workflow;

public class WorkflowStep : BaseAuditableEntity
{
    public Guid WorkflowDefinitionId { get; set; }
    public WorkflowDefinition? WorkflowDefinition { get; set; }

    public string StepKey { get; set; } = string.Empty; // e.g. "step_1", "hr_review"
    public string StepName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }

    // Approver resolution
    public string ApproverType { get; set; } = "EmployeeManager"; 
    // Types: EmployeeManager, DepartmentManager, HR, HRManager, Finance, Payroll, SpecificUser, SpecificRole, SpecificDepartment, WorkflowGroup
    public string ApproverSelection { get; set; } = string.Empty; // JSON or ID value for specific role/user/group/dept
    public string SpecificUserId { get; set; } = string.Empty;
    public string SpecificRoleName { get; set; } = string.Empty;
    public string SpecificDepartmentId { get; set; } = string.Empty;

    // Execution & Logic
    public string ApprovalMode { get; set; } = "AnyOne"; // AnyOne, All, Majority, Sequential
    public bool IsParallel { get; set; } = false;
    public string ParallelGroupId { get; set; } = string.Empty;
    public int MinimumApproversRequired { get; set; } = 1;

    // SLA & Timeout
    public int TimeoutHours { get; set; } = 24; // SLA in hours
    public bool EscalationEnabled { get; set; } = false;
    public int EscalateAfterHours { get; set; } = 24;
    public string EscalateToType { get; set; } = "Manager"; // Manager, HR, Role, SpecificUser
    public string EscalateToValue { get; set; } = string.Empty;

    // Actions & Permissions
    public string AllowedActionsJson { get; set; } = "[\"Approve\",\"Reject\",\"RequestChanges\",\"Delegate\"]";

    // Navigation
    public ICollection<WorkflowCondition> Conditions { get; set; } = new List<WorkflowCondition>();
}
