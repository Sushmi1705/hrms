using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Services;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Domain.Entities.Audit;
using HRMS.Domain.Entities.Notification;
using HRMS.Domain.Entities.Workflow;
using HRMS.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HRMS.Persistence.Services;

public class WorkflowEngineService : IWorkflowEngineService
{
    private readonly HrmsDbContext _dbContext;
    private readonly IWorkflowRepository _workflowRepo;
    private readonly ILogger<WorkflowEngineService> _logger;

    public WorkflowEngineService(
        HrmsDbContext dbContext,
        IWorkflowRepository workflowRepo,
        ILogger<WorkflowEngineService> logger)
    {
        _dbContext = dbContext;
        _workflowRepo = workflowRepo;
        _logger = logger;
    }

    public async Task<ApprovalRequest> StartWorkflowAsync(
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
        string? specificWorkflowCode = null)
    {
        // 1. Locate Workflow Definition
        WorkflowDefinition? workflow = null;
        if (!string.IsNullOrEmpty(specificWorkflowCode))
        {
            workflow = await _dbContext.WorkflowDefinitions
                .Include(w => w.Steps)
                    .ThenInclude(s => s.Conditions)
                .FirstOrDefaultAsync(w => w.Code == specificWorkflowCode && w.Status == "Active");
        }

        if (workflow == null)
        {
            workflow = await _dbContext.WorkflowDefinitions
                .Include(w => w.Steps)
                    .ThenInclude(s => s.Conditions)
                .FirstOrDefaultAsync(w => w.Module == module && w.Status == "Active");
        }

        if (workflow == null)
        {
            workflow = new WorkflowDefinition
            {
                Code = $"WF-{module.ToUpper()}-DEF",
                Name = $"{module} Standard Approval",
                Module = module,
                Category = "General",
                Description = $"Standard multi-tier approval workflow for {module}",
                Status = "Active",
                TriggerEvent = "OnSubmit",
                Version = 1,
                CreatedBy = "System",
                Steps = new List<WorkflowStep>
                {
                    new WorkflowStep
                    {
                        StepKey = "step_manager",
                        StepName = "Direct Manager Approval",
                        OrderIndex = 1,
                        ApproverType = "EmployeeManager",
                        ApprovalMode = "AnyOne",
                        TimeoutHours = 24,
                        EscalationEnabled = true,
                        EscalateAfterHours = 24,
                        EscalateToType = "HR",
                        CreatedBy = "System"
                    },
                    new WorkflowStep
                    {
                        StepKey = "step_hr",
                        StepName = "HR Head Approval",
                        OrderIndex = 2,
                        ApproverType = "HR",
                        ApprovalMode = "AnyOne",
                        TimeoutHours = 48,
                        EscalationEnabled = false,
                        CreatedBy = "System"
                    }
                }
            };
            await _dbContext.WorkflowDefinitions.AddAsync(workflow);
            await _dbContext.SaveChangesAsync();
        }

        workflow.UsageCount++;
        workflow.LastUsedAt = DateTime.UtcNow;

        var randSeq = new Random().Next(1000, 9999);
        var requestNumber = $"REQ-{DateTime.UtcNow.Year}-{randSeq:D4}";

        var payloadStr = JsonSerializer.Serialize(payload);

        var request = new ApprovalRequest
        {
            RequestNumber = requestNumber,
            WorkflowDefinitionId = workflow.Id,
            WorkflowVersionId = null,
            RequesterId = requesterId,
            RequesterName = requesterName,
            RequesterEmail = requesterEmail,
            Department = department,
            Module = module,
            EntityType = entityType,
            ReferenceId = entityId,
            Status = "Pending",
            Priority = priority,
            CurrentStepIndex = 1,
            Summary = summary,
            Amount = amount,
            PayloadJson = payloadStr,
            SubmittedAt = DateTime.UtcNow,
            SlaStatus = "OnTime",
            CreatedBy = requesterName
        };

        await _dbContext.ApprovalRequests.AddAsync(request);
        await _dbContext.SaveChangesAsync();

        var orderedSteps = workflow.Steps.OrderBy(s => s.OrderIndex).ToList();
        var currentStep = orderedSteps.FirstOrDefault(s => s.OrderIndex == 1);

        if (currentStep != null)
        {
            request.CurrentStepId = currentStep.Id;
            request.CurrentStepName = currentStep.StepName;
            request.DueDate = DateTime.UtcNow.AddHours(currentStep.TimeoutHours > 0 ? currentStep.TimeoutHours : 24);

            var resolvedApprover = await ResolveApproverAsync(currentStep, requesterId, department);
            var activeDelegationTarget = await _workflowRepo.ResolveDelegatedApproverAsync(resolvedApprover.UserId, module);

            bool isDelegated = !string.IsNullOrEmpty(activeDelegationTarget);
            string assignedUserId = isDelegated ? activeDelegationTarget! : resolvedApprover.UserId;
            string assignedUserName = isDelegated ? $"Delegated ({resolvedApprover.UserName})" : resolvedApprover.UserName;

            var task = new ApprovalTask
            {
                ApprovalRequestId = request.Id,
                WorkflowStepId = currentStep.Id,
                StepKey = currentStep.StepKey,
                StepName = currentStep.StepName,
                OrderIndex = currentStep.OrderIndex,
                ApproverType = currentStep.ApproverType,
                AssignedUserId = assignedUserId,
                AssignedUserName = assignedUserName,
                AssignedRoleName = resolvedApprover.RoleName,
                AssignedDepartmentId = resolvedApprover.DepartmentId,
                Status = "Pending",
                DueDate = request.DueDate,
                SlaStatus = "OnTime",
                StartedAt = DateTime.UtcNow,
                IsDelegated = isDelegated,
                OriginalApproverName = isDelegated ? resolvedApprover.UserName : string.Empty,
                CreatedBy = "WorkflowEngine"
            };

            await _dbContext.ApprovalTasks.AddAsync(task);

            await SendNotificationAsync(
                userId: assignedUserId,
                title: $"New Approval Required: {request.RequestNumber}",
                message: $"{requesterName} submitted a {module} request: {summary}",
                type: "Approval",
                module: module,
                actionUrl: $"/admin/workflow?tab=inbox&requestId={request.Id}");

            var history = new ApprovalHistory
            {
                ApprovalRequestId = request.Id,
                ApprovalTaskId = task.Id,
                WorkflowStepId = currentStep.Id,
                StepName = currentStep.StepName,
                ActorId = requesterId,
                ActorName = requesterName,
                ActorRole = "Requester",
                Action = "Submitted",
                PreviousStatus = "Draft",
                NewStatus = "Pending",
                Comments = $"Request submitted: {summary}",
                ActionDate = DateTime.UtcNow,
                CreatedBy = requesterName
            };
            await _dbContext.ApprovalHistories.AddAsync(history);
        }

        await AddAuditLogAsync(
            action: "WorkflowStarted",
            entity: "ApprovalRequest",
            entityId: request.Id.ToString(),
            module: module,
            userName: requesterName,
            status: "Success",
            details: $"Workflow instance {request.RequestNumber} initiated for {requesterName}");

        await _dbContext.SaveChangesAsync();
        return request;
    }

    public async Task<ApprovalTaskDto> ProcessActionAsync(
        Guid taskId,
        string actorId,
        string actorName,
        string actorRole,
        string action,
        string comments,
        string? delegateToUserId = null,
        string? delegateToUserName = null,
        string? reassignToUserId = null,
        string? reassignToUserName = null)
    {
        var task = await _dbContext.ApprovalTasks
            .Include(t => t.ApprovalRequest)
                .ThenInclude(r => r!.WorkflowDefinition)
                    .ThenInclude(w => w!.Steps)
                        .ThenInclude(s => s.Conditions)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
        {
            throw new InvalidOperationException($"Approval task with ID {taskId} was not found.");
        }

        if (task.Status != "Pending" && task.Status != "Escalated")
        {
            throw new InvalidOperationException($"Task is already marked as {task.Status} and cannot be modified.");
        }

        var request = task.ApprovalRequest;
        if (request == null)
        {
            throw new InvalidOperationException("Associated approval request was not found.");
        }

        var now = DateTime.UtcNow;

        if (action == "Approved")
        {
            task.Status = "Approved";
            task.CompletedAt = now;
            task.ActionTaken = "Approved";
            task.ActionTakenByUserId = actorId;
            task.ActionTakenByName = actorName;
            task.Comments = comments;

            var steps = request.WorkflowDefinition?.Steps.OrderBy(s => s.OrderIndex).ToList() ?? new List<WorkflowStep>();
            var nextStep = steps.FirstOrDefault(s => s.OrderIndex > task.OrderIndex);

            if (nextStep != null)
            {
                request.CurrentStepIndex = nextStep.OrderIndex;
                request.CurrentStepId = nextStep.Id;
                request.CurrentStepName = nextStep.StepName;
                request.DueDate = now.AddHours(nextStep.TimeoutHours > 0 ? nextStep.TimeoutHours : 24);
                request.UpdatedAt = now;

                var resolvedNextApprover = await ResolveApproverAsync(nextStep, request.RequesterId, request.Department);
                var delegationTarget = await _workflowRepo.ResolveDelegatedApproverAsync(resolvedNextApprover.UserId, request.Module);

                bool isDelegated = !string.IsNullOrEmpty(delegationTarget);
                string assignedUserId = isDelegated ? delegationTarget! : resolvedNextApprover.UserId;
                string assignedUserName = isDelegated ? $"Delegated ({resolvedNextApprover.UserName})" : resolvedNextApprover.UserName;

                var nextTask = new ApprovalTask
                {
                    ApprovalRequestId = request.Id,
                    WorkflowStepId = nextStep.Id,
                    StepKey = nextStep.StepKey,
                    StepName = nextStep.StepName,
                    OrderIndex = nextStep.OrderIndex,
                    ApproverType = nextStep.ApproverType,
                    AssignedUserId = assignedUserId,
                    AssignedUserName = assignedUserName,
                    AssignedRoleName = resolvedNextApprover.RoleName,
                    AssignedDepartmentId = resolvedNextApprover.DepartmentId,
                    Status = "Pending",
                    DueDate = request.DueDate,
                    SlaStatus = "OnTime",
                    StartedAt = now,
                    IsDelegated = isDelegated,
                    OriginalApproverName = isDelegated ? resolvedNextApprover.UserName : string.Empty,
                    CreatedBy = actorName
                };

                await _dbContext.ApprovalTasks.AddAsync(nextTask);

                await SendNotificationAsync(
                    userId: assignedUserId,
                    title: $"Action Required: {request.RequestNumber} - Step {nextStep.OrderIndex}",
                    message: $"{request.RequesterName}'s {request.Module} request moved to {nextStep.StepName}",
                    type: "Approval",
                    module: request.Module,
                    actionUrl: $"/admin/workflow?tab=inbox&requestId={request.Id}");
            }
            else
            {
                request.Status = "Approved";
                request.CompletedAt = now;
                request.UpdatedAt = now;

                await SendNotificationAsync(
                    userId: request.RequesterId,
                    title: $"Request Approved: {request.RequestNumber}",
                    message: $"Your {request.Module} request has been fully approved by {actorName}.",
                    type: "Success",
                    module: request.Module,
                    actionUrl: $"/admin/workflow?tab=history&requestId={request.Id}");
            }

            await _dbContext.ApprovalHistories.AddAsync(new ApprovalHistory
            {
                ApprovalRequestId = request.Id,
                ApprovalTaskId = task.Id,
                WorkflowStepId = task.WorkflowStepId,
                StepName = task.StepName,
                ActorId = actorId,
                ActorName = actorName,
                ActorRole = actorRole,
                Action = "Approved",
                PreviousStatus = "Pending",
                NewStatus = request.Status,
                Comments = comments,
                ActionDate = now,
                CreatedBy = actorName
            });

            await AddAuditLogAsync("ApprovalAction", "ApprovalTask", task.Id.ToString(), request.Module, actorName, "Success", $"Approved step {task.StepName} for {request.RequestNumber}");
        }
        else if (action == "Rejected")
        {
            if (string.IsNullOrWhiteSpace(comments))
            {
                throw new InvalidOperationException("Rejection reason is required.");
            }

            task.Status = "Rejected";
            task.CompletedAt = now;
            task.ActionTaken = "Rejected";
            task.ActionTakenByUserId = actorId;
            task.ActionTakenByName = actorName;
            task.Comments = comments;

            request.Status = "Rejected";
            request.CompletedAt = now;
            request.UpdatedAt = now;

            await SendNotificationAsync(
                userId: request.RequesterId,
                title: $"Request Rejected: {request.RequestNumber}",
                message: $"Your {request.Module} request was rejected by {actorName}. Reason: {comments}",
                type: "Warning",
                module: request.Module,
                actionUrl: $"/admin/workflow?tab=history&requestId={request.Id}");

            await _dbContext.ApprovalHistories.AddAsync(new ApprovalHistory
            {
                ApprovalRequestId = request.Id,
                ApprovalTaskId = task.Id,
                WorkflowStepId = task.WorkflowStepId,
                StepName = task.StepName,
                ActorId = actorId,
                ActorName = actorName,
                ActorRole = actorRole,
                Action = "Rejected",
                PreviousStatus = "Pending",
                NewStatus = "Rejected",
                Comments = comments,
                ActionDate = now,
                CreatedBy = actorName
            });

            await AddAuditLogAsync("ApprovalAction", "ApprovalTask", task.Id.ToString(), request.Module, actorName, "Success", $"Rejected {request.RequestNumber}. Reason: {comments}");
        }
        else if (action == "RequestChanges")
        {
            task.Status = "ChangesRequested";
            task.CompletedAt = now;
            task.ActionTaken = "ChangesRequested";
            task.ActionTakenByName = actorName;
            task.Comments = comments;

            request.Status = "ChangesRequested";
            request.UpdatedAt = now;

            await SendNotificationAsync(
                userId: request.RequesterId,
                title: $"Changes Requested: {request.RequestNumber}",
                message: $"{actorName} requested changes for your {request.Module} request: {comments}",
                type: "Warning",
                module: request.Module,
                actionUrl: $"/admin/workflow?tab=inbox&requestId={request.Id}");

            await _dbContext.ApprovalHistories.AddAsync(new ApprovalHistory
            {
                ApprovalRequestId = request.Id,
                ApprovalTaskId = task.Id,
                WorkflowStepId = task.WorkflowStepId,
                StepName = task.StepName,
                ActorId = actorId,
                ActorName = actorName,
                ActorRole = actorRole,
                Action = "ChangesRequested",
                PreviousStatus = "Pending",
                NewStatus = "ChangesRequested",
                Comments = comments,
                ActionDate = now,
                CreatedBy = actorName
            });

            await AddAuditLogAsync("ApprovalAction", "ApprovalTask", task.Id.ToString(), request.Module, actorName, "Success", $"Requested changes for {request.RequestNumber}");
        }
        else if (action == "Delegate" || action == "Reassign")
        {
            string targetUserId = action == "Delegate" ? (delegateToUserId ?? "") : (reassignToUserId ?? "");
            string targetUserName = action == "Delegate" ? (delegateToUserName ?? "Delegatee") : (reassignToUserName ?? "Assignee");

            if (string.IsNullOrEmpty(targetUserId))
            {
                throw new InvalidOperationException("Target user for delegation/reassignment must be provided.");
            }

            task.IsDelegated = true;
            task.OriginalApproverName = task.AssignedUserName;
            task.AssignedUserId = targetUserId;
            task.AssignedUserName = targetUserName;
            task.Comments = comments;
            task.UpdatedAt = now;

            await SendNotificationAsync(
                userId: targetUserId,
                title: $"Approval Delegated to You: {request.RequestNumber}",
                message: $"{actorName} delegated a {request.Module} approval request to you.",
                type: "Information",
                module: request.Module,
                actionUrl: $"/admin/workflow?tab=inbox&requestId={request.Id}");

            await _dbContext.ApprovalHistories.AddAsync(new ApprovalHistory
            {
                ApprovalRequestId = request.Id,
                ApprovalTaskId = task.Id,
                WorkflowStepId = task.WorkflowStepId,
                StepName = task.StepName,
                ActorId = actorId,
                ActorName = actorName,
                ActorRole = actorRole,
                Action = action,
                PreviousStatus = "Pending",
                NewStatus = "Pending",
                Comments = $"Assigned to {targetUserName}. Note: {comments}",
                ActionDate = now,
                CreatedBy = actorName
            });

            await AddAuditLogAsync("ApprovalAction", "ApprovalTask", task.Id.ToString(), request.Module, actorName, "Success", $"{action} task {task.StepName} to {targetUserName}");
        }

        await _dbContext.SaveChangesAsync();

        return new ApprovalTaskDto
        {
            Id = task.Id,
            ApprovalRequestId = request.Id,
            RequestNumber = request.RequestNumber,
            RequesterName = request.RequesterName,
            Department = request.Department,
            Module = request.Module,
            StepName = task.StepName,
            Status = task.Status,
            SlaStatus = task.SlaStatus,
            AssignedUserName = task.AssignedUserName
        };
    }

    public async Task<List<ApprovalTaskDto>> BulkProcessActionAsync(
        List<Guid> taskIds,
        string actorId,
        string actorName,
        string actorRole,
        string action,
        string comments)
    {
        var results = new List<ApprovalTaskDto>();
        foreach (var taskId in taskIds)
        {
            try
            {
                var res = await ProcessActionAsync(taskId, actorId, actorName, actorRole, action, comments);
                results.Add(res);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Failed bulk action on taskId {taskId}");
            }
        }
        return results;
    }

    public async Task<int> CheckAndProcessEscalationsAsync()
    {
        var now = DateTime.UtcNow;
        var overdueTasks = await _dbContext.ApprovalTasks
            .Include(t => t.ApprovalRequest)
            .Where(t => t.Status == "Pending" && t.DueDate.HasValue && t.DueDate.Value < now)
            .ToListAsync();

        int escalatedCount = 0;
        foreach (var task in overdueTasks)
        {
            task.SlaStatus = "Overdue";
            task.EscalationCount++;

            var escalation = new WorkflowEscalation
            {
                ApprovalRequestId = task.ApprovalRequestId,
                ApprovalTaskId = task.Id,
                OriginalApproverId = task.AssignedUserId,
                OriginalApproverName = task.AssignedUserName,
                EscalatedToUserName = "HR Department Head",
                EscalatedToRole = "HR_Director",
                EscalationLevel = task.EscalationCount,
                Reason = "SLA Breach - Automated System Escalation",
                EscalatedAt = now,
                SlaBreachHours = (int)(now - task.DueDate!.Value).TotalHours,
                IsResolved = false,
                CreatedBy = "SystemSlaEngine"
            };

            await _dbContext.WorkflowEscalations.AddAsync(escalation);

            if (task.ApprovalRequest != null)
            {
                task.ApprovalRequest.SlaStatus = "Escalated";
            }

            await SendNotificationAsync(
                userId: task.AssignedUserId,
                title: $"Escalation Warning: {task.ApprovalRequest?.RequestNumber}",
                message: $"Task '{task.StepName}' has breached its SLA and has been escalated.",
                type: "Error",
                module: task.ApprovalRequest?.Module ?? "General",
                actionUrl: $"/admin/workflow?tab=inbox&requestId={task.ApprovalRequestId}");

            escalatedCount++;
        }

        if (escalatedCount > 0)
        {
            await _dbContext.SaveChangesAsync();
        }

        return escalatedCount;
    }

    public async Task<List<string>> ValidateWorkflowDefinitionAsync(WorkflowDefinition definition)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(definition.Name))
            errors.Add("Workflow Name is required.");

        if (string.IsNullOrWhiteSpace(definition.Module))
            errors.Add("Workflow Module is required.");

        if (definition.Steps == null || !definition.Steps.Any())
        {
            errors.Add("Workflow must contain at least one approval stage.");
        }
        else
        {
            var stepKeys = new HashSet<string>();
            foreach (var step in definition.Steps)
            {
                if (string.IsNullOrWhiteSpace(step.StepName))
                    errors.Add($"Step index {step.OrderIndex} is missing a step name.");

                if (string.IsNullOrWhiteSpace(step.ApproverType))
                    errors.Add($"Step '{step.StepName}' requires an Approver Type.");

                if (!string.IsNullOrEmpty(step.StepKey))
                {
                    if (stepKeys.Contains(step.StepKey))
                        errors.Add($"Duplicate Step Key detected: {step.StepKey}");
                    stepKeys.Add(step.StepKey);
                }
            }
        }

        return await Task.FromResult(errors);
    }

    public async Task<WorkflowDefinition> PublishWorkflowDefinitionAsync(Guid definitionId, string publishedBy)
    {
        var wf = await _dbContext.WorkflowDefinitions
            .Include(w => w.Steps)
                .ThenInclude(s => s.Conditions)
            .FirstOrDefaultAsync(w => w.Id == definitionId);

        if (wf == null)
            throw new InvalidOperationException("Workflow definition not found.");

        var errors = await ValidateWorkflowDefinitionAsync(wf);
        if (errors.Any())
        {
            throw new InvalidOperationException($"Validation failed: {string.Join("; ", errors)}");
        }

        var snapshot = JsonSerializer.Serialize(new { wf.Code, wf.Name, wf.Module, wf.Category, wf.Description, Steps = wf.Steps.Select(s => new { s.StepKey, s.StepName, s.ApproverType, s.TimeoutHours }) });
        var version = new WorkflowVersion
        {
            WorkflowDefinitionId = wf.Id,
            VersionNumber = wf.Version,
            Status = "Published",
            SchemaSnapshotJson = snapshot,
            ChangeSummary = $"Published version {wf.Version} by {publishedBy}",
            PublishedAt = DateTime.UtcNow,
            PublishedBy = publishedBy,
            CreatedBy = publishedBy
        };

        await _dbContext.WorkflowVersions.AddAsync(version);

        wf.Status = "Active";
        wf.PublishedAt = DateTime.UtcNow;
        wf.PublishedBy = publishedBy;
        wf.Version += 1;
        wf.UpdatedAt = DateTime.UtcNow;

        await AddAuditLogAsync("WorkflowPublished", "WorkflowDefinition", wf.Id.ToString(), wf.Module, publishedBy, "Success", $"Published workflow {wf.Name} (v{version.VersionNumber})");
        await _dbContext.SaveChangesAsync();

        return wf;
    }

    public async Task<WorkflowDefinition> DuplicateWorkflowDefinitionAsync(Guid definitionId, string createdBy)
    {
        var original = await _dbContext.WorkflowDefinitions
            .Include(w => w.Steps)
                .ThenInclude(s => s.Conditions)
            .FirstOrDefaultAsync(w => w.Id == definitionId);

        if (original == null)
            throw new InvalidOperationException("Original workflow definition not found.");

        var copy = new WorkflowDefinition
        {
            Code = $"{original.Code}-COPY-{new Random().Next(100, 999)}",
            Name = $"{original.Name} (Copy)",
            Module = original.Module,
            Category = original.Category,
            Description = original.Description,
            TriggerEvent = original.TriggerEvent,
            Status = "Draft",
            Version = 1,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            Steps = original.Steps.Select(s => new WorkflowStep
            {
                StepKey = $"{s.StepKey}_copy",
                StepName = s.StepName,
                Description = s.Description,
                OrderIndex = s.OrderIndex,
                ApproverType = s.ApproverType,
                ApproverSelection = s.ApproverSelection,
                SpecificUserId = s.SpecificUserId,
                SpecificRoleName = s.SpecificRoleName,
                SpecificDepartmentId = s.SpecificDepartmentId,
                ApprovalMode = s.ApprovalMode,
                IsParallel = s.IsParallel,
                ParallelGroupId = s.ParallelGroupId,
                MinimumApproversRequired = s.MinimumApproversRequired,
                TimeoutHours = s.TimeoutHours,
                EscalationEnabled = s.EscalationEnabled,
                EscalateAfterHours = s.EscalateAfterHours,
                EscalateToType = s.EscalateToType,
                EscalateToValue = s.EscalateToValue,
                AllowedActionsJson = s.AllowedActionsJson,
                CreatedBy = createdBy,
                Conditions = s.Conditions.Select(c => new WorkflowCondition
                {
                    Field = c.Field,
                    Operator = c.Operator,
                    Value = c.Value,
                    Logic = c.Logic,
                    OrderIndex = c.OrderIndex,
                    CreatedBy = createdBy
                }).ToList()
            }).ToList()
        };

        await _dbContext.WorkflowDefinitions.AddAsync(copy);
        await AddAuditLogAsync("WorkflowDuplicated", "WorkflowDefinition", copy.Id.ToString(), copy.Module, createdBy, "Success", $"Duplicated {original.Name} into {copy.Name}");
        await _dbContext.SaveChangesAsync();

        return copy;
    }

    private async Task<(string UserId, string UserName, string RoleName, string DepartmentId)> ResolveApproverAsync(
        WorkflowStep step,
        string requesterId,
        string department)
    {
        switch (step.ApproverType)
        {
            case "EmployeeManager":
                var emp = await _dbContext.Employees
                    .Include(e => e.Manager)
                    .FirstOrDefaultAsync(e => e.Id.ToString() == requesterId || e.EmployeeNumber == requesterId);

                if (emp?.Manager != null)
                {
                    return (emp.Manager.Id.ToString(), $"{emp.Manager.FirstName} {emp.Manager.LastName}", "Manager", emp.Manager.DepartmentId.ToString());
                }
                return ("mgr-general-01", "David Ross (Direct Manager)", "Manager", department);

            case "DepartmentManager":
                return ("dept-head-01", $"{department} Head (Alexander Wright)", "DepartmentHead", department);

            case "HR":
            case "HRManager":
                return ("hr-admin-01", "Jennifer Vance (HR Business Partner)", "HR_Manager", "HR-Dept");

            case "Finance":
            case "Payroll":
                return ("fin-controller-01", "Marcus Sterling (Finance Controller)", "Finance_Head", "FIN-Dept");

            case "SpecificUser":
                if (!string.IsNullOrEmpty(step.SpecificUserId))
                {
                    var user = await _dbContext.Employees.FirstOrDefaultAsync(e => e.Id.ToString() == step.SpecificUserId);
                    if (user != null)
                    {
                        return (user.Id.ToString(), $"{user.FirstName} {user.LastName}", "Approver", user.DepartmentId.ToString());
                    }
                    return (step.SpecificUserId, "Designated Specialist", "Approver", department);
                }
                return ("spec-user-01", "Assigned Workflow Lead", "Approver", department);

            case "SpecificRole":
                return ("role-approver-01", $"{step.SpecificRoleName ?? "Role"} Authority", step.SpecificRoleName ?? "Authority", department);

            default:
                return ("hr-admin-01", "HR Approval Desk", "HR", department);
        }
    }

    private async Task SendNotificationAsync(
        string userId,
        string title,
        string message,
        string type,
        string module,
        string actionUrl)
    {
        try
        {
            Guid userGuid = Guid.TryParse(userId, out var g) ? g : Guid.NewGuid();
            var notif = new Domain.Entities.Notification.Notification
            {
                UserId = userGuid,
                Title = title,
                Message = message,
                Type = type,
                Module = module,
                ActionUrl = actionUrl,
                IsRead = false,
                CreatedBy = "WorkflowEngine",
                CreatedAt = DateTime.UtcNow
            };

            await _dbContext.Notifications.AddAsync(notif);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to enqueue notification.");
        }
    }

    private async Task AddAuditLogAsync(
        string action,
        string entity,
        string entityId,
        string module,
        string userName,
        string status,
        string details)
    {
        try
        {
            var audit = new AuditLog
            {
                Action = action,
                Entity = entity,
                Module = module,
                Category = "System",
                Severity = "Info",
                Status = status,
                UserName = userName,
                Endpoint = "/api/v1/workflow",
                HttpMethod = "POST",
                RequestPayload = details,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userName
            };

            await _dbContext.AuditLogs.AddAsync(audit);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to log audit record.");
        }
    }
}
