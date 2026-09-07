using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Services;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Domain.Entities.Workflow;
using MediatR;

namespace HRMS.Application.Features.Workflow.Commands;

// 1. Create Workflow Definition Command
public record CreateWorkflowDefinitionCommand(UpsertWorkflowDefinitionDto Dto, string CreatedBy) : IRequest<WorkflowDefinition>;

public class CreateWorkflowDefinitionCommandHandler : IRequestHandler<CreateWorkflowDefinitionCommand, WorkflowDefinition>
{
    private readonly IWorkflowRepository _repository;
    public CreateWorkflowDefinitionCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDefinition> Handle(CreateWorkflowDefinitionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;
        var definition = new WorkflowDefinition
        {
            Code = string.IsNullOrWhiteSpace(dto.Code) ? $"WF-{dto.Module.ToUpper()}-{new Random().Next(100, 999)}" : dto.Code,
            Name = dto.Name,
            Module = dto.Module,
            Category = dto.Category,
            Description = dto.Description,
            TriggerEvent = dto.TriggerEvent,
            Status = dto.Status ?? "Draft",
            Version = 1,
            CreatedBy = request.CreatedBy,
            Steps = dto.Steps.Select(s => new WorkflowStep
            {
                StepKey = string.IsNullOrWhiteSpace(s.StepKey) ? $"step_{s.OrderIndex}" : s.StepKey,
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
                CreatedBy = request.CreatedBy,
                Conditions = s.Conditions.Select(c => new WorkflowCondition
                {
                    Field = c.Field,
                    Operator = c.Operator,
                    Value = c.Value,
                    Logic = c.Logic,
                    OrderIndex = c.OrderIndex,
                    CreatedBy = request.CreatedBy
                }).ToList()
            }).ToList()
        };

        return await _repository.CreateWorkflowDefinitionAsync(definition);
    }
}

// 2. Update Workflow Definition Command
public record UpdateWorkflowDefinitionCommand(Guid Id, UpsertWorkflowDefinitionDto Dto, string UpdatedBy) : IRequest<WorkflowDefinition>;

public class UpdateWorkflowDefinitionCommandHandler : IRequestHandler<UpdateWorkflowDefinitionCommand, WorkflowDefinition>
{
    private readonly IWorkflowRepository _repository;
    public UpdateWorkflowDefinitionCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDefinition> Handle(UpdateWorkflowDefinitionCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetWorkflowDefinitionByIdAsync(request.Id);
        if (existing == null) throw new InvalidOperationException("Workflow definition not found");

        var dto = request.Dto;
        existing.Name = dto.Name;
        existing.Module = dto.Module;
        existing.Category = dto.Category;
        existing.Description = dto.Description;
        existing.TriggerEvent = dto.TriggerEvent;
        existing.Status = dto.Status ?? existing.Status;
        existing.UpdatedBy = request.UpdatedBy;
        existing.UpdatedAt = DateTime.UtcNow;

        // Replace steps
        existing.Steps.Clear();
        foreach (var s in dto.Steps)
        {
            existing.Steps.Add(new WorkflowStep
            {
                WorkflowDefinitionId = existing.Id,
                StepKey = string.IsNullOrWhiteSpace(s.StepKey) ? $"step_{s.OrderIndex}" : s.StepKey,
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
                CreatedBy = request.UpdatedBy,
                Conditions = s.Conditions.Select(c => new WorkflowCondition
                {
                    Field = c.Field,
                    Operator = c.Operator,
                    Value = c.Value,
                    Logic = c.Logic,
                    OrderIndex = c.OrderIndex,
                    CreatedBy = request.UpdatedBy
                }).ToList()
            });
        }

        return await _repository.UpdateWorkflowDefinitionAsync(existing);
    }
}

// 3. Publish Workflow Definition Command
public record PublishWorkflowDefinitionCommand(Guid Id, string PublishedBy) : IRequest<WorkflowDefinition>;

public class PublishWorkflowDefinitionCommandHandler : IRequestHandler<PublishWorkflowDefinitionCommand, WorkflowDefinition>
{
    private readonly IWorkflowEngineService _engineService;
    public PublishWorkflowDefinitionCommandHandler(IWorkflowEngineService engineService) => _engineService = engineService;

    public async Task<WorkflowDefinition> Handle(PublishWorkflowDefinitionCommand request, CancellationToken cancellationToken)
    {
        return await _engineService.PublishWorkflowDefinitionAsync(request.Id, request.PublishedBy);
    }
}

// 4. Duplicate Workflow Definition Command
public record DuplicateWorkflowDefinitionCommand(Guid Id, string CreatedBy) : IRequest<WorkflowDefinition>;

public class DuplicateWorkflowDefinitionCommandHandler : IRequestHandler<DuplicateWorkflowDefinitionCommand, WorkflowDefinition>
{
    private readonly IWorkflowEngineService _engineService;
    public DuplicateWorkflowDefinitionCommandHandler(IWorkflowEngineService engineService) => _engineService = engineService;

    public async Task<WorkflowDefinition> Handle(DuplicateWorkflowDefinitionCommand request, CancellationToken cancellationToken)
    {
        return await _engineService.DuplicateWorkflowDefinitionAsync(request.Id, request.CreatedBy);
    }
}

// 5. Delete Workflow Definition Command
public record DeleteWorkflowDefinitionCommand(Guid Id) : IRequest<bool>;

public class DeleteWorkflowDefinitionCommandHandler : IRequestHandler<DeleteWorkflowDefinitionCommand, bool>
{
    private readonly IWorkflowRepository _repository;
    public DeleteWorkflowDefinitionCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<bool> Handle(DeleteWorkflowDefinitionCommand request, CancellationToken cancellationToken)
    {
        return await _repository.DeleteWorkflowDefinitionAsync(request.Id);
    }
}

// 6. Process Approval Task Action Command
public record ProcessApprovalTaskActionCommand(
    Guid TaskId,
    string ActorId,
    string ActorName,
    string ActorRole,
    string Action,
    string Comments,
    string? DelegateToUserId = null,
    string? DelegateToUserName = null,
    string? ReassignToUserId = null,
    string? ReassignToUserName = null) : IRequest<ApprovalTaskDto>;

public class ProcessApprovalTaskActionCommandHandler : IRequestHandler<ProcessApprovalTaskActionCommand, ApprovalTaskDto>
{
    private readonly IWorkflowEngineService _engineService;
    public ProcessApprovalTaskActionCommandHandler(IWorkflowEngineService engineService) => _engineService = engineService;

    public async Task<ApprovalTaskDto> Handle(ProcessApprovalTaskActionCommand request, CancellationToken cancellationToken)
    {
        return await _engineService.ProcessActionAsync(
            request.TaskId,
            request.ActorId,
            request.ActorName,
            request.ActorRole,
            request.Action,
            request.Comments,
            request.DelegateToUserId,
            request.DelegateToUserName,
            request.ReassignToUserId,
            request.ReassignToUserName);
    }
}

// 7. Bulk Approval Action Command
public record BulkApprovalActionCommand(
    List<Guid> TaskIds,
    string ActorId,
    string ActorName,
    string ActorRole,
    string Action,
    string Comments) : IRequest<List<ApprovalTaskDto>>;

public class BulkApprovalActionCommandHandler : IRequestHandler<BulkApprovalActionCommand, List<ApprovalTaskDto>>
{
    private readonly IWorkflowEngineService _engineService;
    public BulkApprovalActionCommandHandler(IWorkflowEngineService engineService) => _engineService = engineService;

    public async Task<List<ApprovalTaskDto>> Handle(BulkApprovalActionCommand request, CancellationToken cancellationToken)
    {
        return await _engineService.BulkProcessActionAsync(
            request.TaskIds,
            request.ActorId,
            request.ActorName,
            request.ActorRole,
            request.Action,
            request.Comments);
    }
}

// 8. Start Workflow Instance Command
public record StartWorkflowInstanceCommand(
    string Module,
    string EntityType,
    string EntityId,
    string RequesterId,
    string RequesterName,
    string RequesterEmail,
    string Department,
    string Summary,
    decimal? Amount,
    Dictionary<string, object> Payload,
    string Priority = "Normal",
    string? SpecificWorkflowCode = null) : IRequest<ApprovalRequest>;

public class StartWorkflowInstanceCommandHandler : IRequestHandler<StartWorkflowInstanceCommand, ApprovalRequest>
{
    private readonly IWorkflowEngineService _engineService;
    public StartWorkflowInstanceCommandHandler(IWorkflowEngineService engineService) => _engineService = engineService;

    public async Task<ApprovalRequest> Handle(StartWorkflowInstanceCommand request, CancellationToken cancellationToken)
    {
        return await _engineService.StartWorkflowAsync(
            request.Module,
            request.EntityType,
            request.EntityId,
            request.RequesterId,
            request.RequesterName,
            request.RequesterEmail,
            request.Department,
            request.Summary,
            request.Amount,
            request.Payload,
            request.Priority,
            request.SpecificWorkflowCode);
    }
}

// 9. Delegation Commands
public record CreateDelegationCommand(CreateDelegationDto Dto) : IRequest<Delegation>;

public class CreateDelegationCommandHandler : IRequestHandler<CreateDelegationCommand, Delegation>
{
    private readonly IWorkflowRepository _repository;
    public CreateDelegationCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<Delegation> Handle(CreateDelegationCommand request, CancellationToken cancellationToken)
    {
        var d = request.Dto;
        var delegation = new Delegation
        {
            DelegatorId = d.DelegatorId,
            DelegatorName = d.DelegatorName,
            DelegateeId = d.DelegateeId,
            DelegateeName = d.DelegateeName,
            StartDate = d.StartDate,
            EndDate = d.EndDate,
            Reason = d.Reason,
            Modules = d.Modules,
            IsActive = true,
            CreatedBy = d.DelegatorName
        };

        return await _repository.CreateDelegationAsync(delegation);
    }
}

public record RevokeDelegationCommand(Guid Id) : IRequest<bool>;

public class RevokeDelegationCommandHandler : IRequestHandler<RevokeDelegationCommand, bool>
{
    private readonly IWorkflowRepository _repository;
    public RevokeDelegationCommandHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<bool> Handle(RevokeDelegationCommand request, CancellationToken cancellationToken)
    {
        return await _repository.RevokeDelegationAsync(request.Id);
    }
}
