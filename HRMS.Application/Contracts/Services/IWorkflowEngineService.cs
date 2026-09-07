using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Application.Contracts.Services;

public interface IWorkflowEngineService
{
    Task<ApprovalRequest> StartWorkflowAsync(
        string module,
        string entityType,
        string entityId,
        string requesterId,
        string requesterName,
        string requesterEmail,
        string department,
        string summary,
        decimal? amount,
        Dictionary<string, object> payload,
        string priority = "Normal",
        string? specificWorkflowCode = null);

    Task<ApprovalTaskDto> ProcessActionAsync(
        Guid taskId,
        string actorId,
        string actorName,
        string actorRole,
        string action,
        string comments,
        string? delegateToUserId = null,
        string? delegateToUserName = null,
        string? reassignToUserId = null,
        string? reassignToUserName = null);

    Task<List<ApprovalTaskDto>> BulkProcessActionAsync(
        List<Guid> taskIds,
        string actorId,
        string actorName,
        string actorRole,
        string action,
        string comments);

    Task<int> CheckAndProcessEscalationsAsync();
    Task<List<string>> ValidateWorkflowDefinitionAsync(WorkflowDefinition definition);
    Task<WorkflowDefinition> PublishWorkflowDefinitionAsync(Guid definitionId, string publishedBy);
    Task<WorkflowDefinition> DuplicateWorkflowDefinitionAsync(Guid definitionId, string createdBy);
}
