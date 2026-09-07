using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Application.Contracts.Persistence;

public interface IWorkflowRepository
{
    Task<WorkflowDashboardAnalyticsDto> GetWorkflowDashboardAnalyticsAsync(string? department = null, string? module = null);
    
    // Definitions
    Task<PagedResult<WorkflowDefinitionDto>> GetWorkflowDefinitionsAsync(WorkflowFilterParams filters);
    Task<WorkflowDefinition?> GetWorkflowDefinitionByIdAsync(Guid id);
    Task<WorkflowDefinition> CreateWorkflowDefinitionAsync(WorkflowDefinition definition);
    Task<WorkflowDefinition> UpdateWorkflowDefinitionAsync(WorkflowDefinition definition);
    Task<bool> DeleteWorkflowDefinitionAsync(Guid id);
    Task<WorkflowVersion?> CreateWorkflowVersionAsync(WorkflowVersion version);

    // Instances / Approval Requests
    Task<PagedResult<ApprovalTaskDto>> GetApprovalInboxAsync(ApprovalInboxFilterParams filters);
    Task<PagedResult<ApprovalTaskDto>> GetMyApprovalsAsync(string userId, string tab, ApprovalInboxFilterParams filters);
    Task<ApprovalDetailsDto?> GetApprovalDetailsAsync(Guid requestId, string? viewerUserId = null);
    Task<ApprovalRequest?> GetApprovalRequestByIdAsync(Guid id);
    Task<ApprovalTask?> GetApprovalTaskByIdAsync(Guid taskId);
    Task<ApprovalRequest> CreateApprovalRequestAsync(ApprovalRequest request);
    Task<bool> SaveChangesAsync();

    // Delegations
    Task<List<DelegationDto>> GetDelegationsAsync(string? delegatorId = null, bool activeOnly = false);
    Task<Delegation> CreateDelegationAsync(Delegation delegation);
    Task<bool> RevokeDelegationAsync(Guid id);
    Task<string?> ResolveDelegatedApproverAsync(string originalUserId, string module);

    // Escalations & Reports
    Task<List<WorkflowEscalationDto>> GetEscalationsReportAsync(string? module = null);
    Task<object> GetSlaReportAsync(string? module = null);
    Task<object> GetWorkloadReportAsync();
    Task<List<WorkflowTemplateDto>> GetWorkflowTemplatesAsync();
    Task<WorkflowTemplate?> GetWorkflowTemplateByIdAsync(Guid id);

    // Comments & History
    Task<ApprovalComment> AddCommentAsync(ApprovalComment comment);
    Task<ApprovalHistory> AddHistoryAsync(ApprovalHistory history);
}
