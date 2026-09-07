using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Workflow.DTOs;

public class WorkflowDashboardAnalyticsDto
{
    public int TotalWorkflows { get; set; }
    public int ActiveWorkflows { get; set; }
    public int DraftWorkflows { get; set; }
    public int PendingApprovals { get; set; }
    public int ApprovedToday { get; set; }
    public int RejectedToday { get; set; }
    public int EscalatedApprovals { get; set; }
    public int OverdueApprovals { get; set; }
    public int FailedWorkflows { get; set; }
    public double AverageApprovalTimeHours { get; set; }
    public double SlaSuccessRatePercentage { get; set; }

    // Chart Data
    public List<TrendPointDto> ApprovalTrend { get; set; } = new();
    public List<StatusCountDto> StatusDistribution { get; set; } = new();
    public List<ModuleVolumeDto> VolumeByModule { get; set; } = new();
    public List<SlaTrendDto> SlaTrends { get; set; } = new();
    public List<DepartmentDistributionDto> DepartmentDistribution { get; set; } = new();
    public List<ApproverWorkloadDto> ApproverWorkload { get; set; } = new();
    public List<EscalationTrendDto> EscalationTrends { get; set; } = new();

    // Live Activity
    public List<WorkflowActivityDto> RecentActivities { get; set; } = new();
}

public class TrendPointDto
{
    public string Period { get; set; } = string.Empty;
    public int Approved { get; set; }
    public int Rejected { get; set; }
    public int Pending { get; set; }
    public int Escalated { get; set; }
}

public class StatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class ModuleVolumeDto
{
    public string Module { get; set; } = string.Empty;
    public int Count { get; set; }
    public int ActiveWorkflows { get; set; }
}

public class SlaTrendDto
{
    public string Month { get; set; } = string.Empty;
    public double AvgSlaHours { get; set; }
    public double MaxSlaHours { get; set; }
    public int BreachedCount { get; set; }
}

public class DepartmentDistributionDto
{
    public string Department { get; set; } = string.Empty;
    public int RequestCount { get; set; }
    public int PendingCount { get; set; }
}

public class ApproverWorkloadDto
{
    public string ApproverName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int PendingTasks { get; set; }
    public int CompletedTasks { get; set; }
    public double AvgResolutionHours { get; set; }
}

public class EscalationTrendDto
{
    public string Period { get; set; } = string.Empty;
    public int EscalatedCount { get; set; }
    public int ResolvedCount { get; set; }
}

public class WorkflowActivityDto
{
    public Guid Id { get; set; }
    public string EventType { get; set; } = string.Empty; // Started, Approved, Rejected, Delegated, Escalated, Completed
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

// Definition DTOs
public class WorkflowDefinitionDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Version { get; set; }
    public string Status { get; set; } = string.Empty;
    public string TriggerEvent { get; set; } = string.Empty;
    public int StepsCount { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? LastUsedAt { get; set; }
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }

    public List<WorkflowStepDto> Steps { get; set; } = new();
}

public class WorkflowStepDto
{
    public Guid Id { get; set; }
    public Guid WorkflowDefinitionId { get; set; }
    public string StepKey { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string ApproverType { get; set; } = string.Empty;
    public string ApproverSelection { get; set; } = string.Empty;
    public string SpecificUserId { get; set; } = string.Empty;
    public string SpecificRoleName { get; set; } = string.Empty;
    public string SpecificDepartmentId { get; set; } = string.Empty;
    public string ApprovalMode { get; set; } = string.Empty;
    public bool IsParallel { get; set; }
    public string ParallelGroupId { get; set; } = string.Empty;
    public int MinimumApproversRequired { get; set; }
    public int TimeoutHours { get; set; }
    public bool EscalationEnabled { get; set; }
    public int EscalateAfterHours { get; set; }
    public string EscalateToType { get; set; } = string.Empty;
    public string EscalateToValue { get; set; } = string.Empty;
    public string AllowedActionsJson { get; set; } = string.Empty;

    public List<WorkflowConditionDto> Conditions { get; set; } = new();
}

public class WorkflowConditionDto
{
    public Guid Id { get; set; }
    public Guid WorkflowStepId { get; set; }
    public string Field { get; set; } = string.Empty;
    public string Operator { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Logic { get; set; } = "AND";
    public int OrderIndex { get; set; }
}

public class UpsertWorkflowDefinitionDto
{
    public Guid? Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public string Description { get; set; } = string.Empty;
    public string TriggerEvent { get; set; } = "OnSubmit";
    public string Status { get; set; } = "Draft";
    public List<UpsertWorkflowStepDto> Steps { get; set; } = new();
}

public class UpsertWorkflowStepDto
{
    public Guid? Id { get; set; }
    public string StepKey { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string ApproverType { get; set; } = "EmployeeManager";
    public string ApproverSelection { get; set; } = string.Empty;
    public string SpecificUserId { get; set; } = string.Empty;
    public string SpecificRoleName { get; set; } = string.Empty;
    public string SpecificDepartmentId { get; set; } = string.Empty;
    public string ApprovalMode { get; set; } = "AnyOne";
    public bool IsParallel { get; set; } = false;
    public string ParallelGroupId { get; set; } = string.Empty;
    public int MinimumApproversRequired { get; set; } = 1;
    public int TimeoutHours { get; set; } = 24;
    public bool EscalationEnabled { get; set; } = false;
    public int EscalateAfterHours { get; set; } = 24;
    public string EscalateToType { get; set; } = "Manager";
    public string EscalateToValue { get; set; } = string.Empty;
    public string AllowedActionsJson { get; set; } = "[\"Approve\",\"Reject\",\"RequestChanges\",\"Delegate\"]";

    public List<UpsertWorkflowConditionDto> Conditions { get; set; } = new();
}

public class UpsertWorkflowConditionDto
{
    public Guid? Id { get; set; }
    public string Field { get; set; } = string.Empty;
    public string Operator { get; set; } = "Equals";
    public string Value { get; set; } = string.Empty;
    public string Logic { get; set; } = "AND";
    public int OrderIndex { get; set; } = 0;
}

// Approval Task & Inbox DTOs
public class ApprovalTaskDto
{
    public Guid Id { get; set; }
    public Guid ApprovalRequestId { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string RequesterId { get; set; } = string.Empty;
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string ReferenceId { get; set; } = string.Empty;
    public string WorkflowName { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Pending";
    public decimal? Amount { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public DateTime SubmittedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public string SlaStatus { get; set; } = "OnTime";
    public string AssignedUserId { get; set; } = string.Empty;
    public string AssignedUserName { get; set; } = string.Empty;
    public string AssignedRoleName { get; set; } = string.Empty;
    public bool IsDelegated { get; set; }
    public string OriginalApproverName { get; set; } = string.Empty;
    public int EscalationCount { get; set; }
}

public class ApprovalDetailsDto
{
    public Guid RequestId { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string WorkflowName { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string ReferenceId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public decimal? Amount { get; set; }
    public string PayloadJson { get; set; } = "{}";
    public DateTime SubmittedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string SlaStatus { get; set; } = string.Empty;

    // Requester info
    public string RequesterId { get; set; } = string.Empty;
    public string RequesterName { get; set; } = string.Empty;
    public string RequesterEmail { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;

    // Timeline Steps
    public List<ApprovalTimelineStepDto> TimelineSteps { get; set; } = new();

    // Active Task for current viewer if applicable
    public ApprovalTaskDto? ActiveTask { get; set; }

    // History Log
    public List<ApprovalHistoryDto> History { get; set; } = new();
    public List<ApprovalCommentDto> Comments { get; set; } = new();
}

public class ApprovalTimelineStepDto
{
    public Guid StepId { get; set; }
    public string StepName { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public string ApproverType { get; set; } = string.Empty;
    public string AssignedToName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected, Skipped, Waiting
    public DateTime? ActionDate { get; set; }
    public string Comments { get; set; } = string.Empty;
}

public class ApprovalHistoryDto
{
    public Guid Id { get; set; }
    public string StepName { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string PreviousStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public DateTime ActionDate { get; set; }
}

public class ApprovalCommentDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
    public string CommentText { get; set; } = string.Empty;
    public string AttachmentUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

// Action Commands
public class ProcessApprovalActionDto
{
    public Guid TaskId { get; set; }
    public string Action { get; set; } = "Approved"; // Approved, Rejected, ChangesRequested, Delegated, Reassigned
    public string Comments { get; set; } = string.Empty;
    public string? DelegateToUserId { get; set; }
    public string? DelegateToUserName { get; set; }
    public string? ReassignToUserId { get; set; }
    public string? ReassignToUserName { get; set; }
}

public class BulkApprovalActionDto
{
    public List<Guid> TaskIds { get; set; } = new();
    public string Action { get; set; } = "Approved"; // Approved, Rejected
    public string Comments { get; set; } = string.Empty;
}

// Delegation DTOs
public class DelegationDto
{
    public Guid Id { get; set; }
    public string DelegatorId { get; set; } = string.Empty;
    public string DelegatorName { get; set; } = string.Empty;
    public string DelegateeId { get; set; } = string.Empty;
    public string DelegateeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Modules { get; set; } = "All";
    public bool IsActive { get; set; }
    public bool IsCurrentlyActive => IsActive && DateTime.UtcNow >= StartDate && DateTime.UtcNow <= EndDate;
}

public class CreateDelegationDto
{
    public string DelegatorId { get; set; } = string.Empty;
    public string DelegatorName { get; set; } = string.Empty;
    public string DelegateeId { get; set; } = string.Empty;
    public string DelegateeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Modules { get; set; } = "All";
}

// Template DTOs
public class WorkflowTemplateDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "FileText";
    public string StructureJson { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }
}

// Escalation DTO
public class WorkflowEscalationDto
{
    public Guid Id { get; set; }
    public Guid ApprovalRequestId { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string OriginalApproverName { get; set; } = string.Empty;
    public string EscalatedToUserName { get; set; } = string.Empty;
    public string EscalatedToRole { get; set; } = string.Empty;
    public int EscalationLevel { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime EscalatedAt { get; set; }
    public int SlaBreachHours { get; set; }
    public bool IsResolved { get; set; }
}

// Pagination & Filter Params
public class WorkflowFilterParams
{
    public string? Search { get; set; }
    public string? Module { get; set; }
    public string? Status { get; set; }
    public string? Category { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDesc { get; set; } = true;
}

public class ApprovalInboxFilterParams
{
    public string? Search { get; set; }
    public string? Module { get; set; }
    public string? Priority { get; set; }
    public string? SlaStatus { get; set; }
    public string? Status { get; set; }
    public string? AssignedUserId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));
}
