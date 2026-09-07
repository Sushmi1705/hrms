using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Domain.Entities.Workflow;
using MediatR;

namespace HRMS.Application.Features.Workflow.Queries;

// 1. Dashboard Analytics Query
public record GetWorkflowDashboardAnalyticsQuery(string? Department = null, string? Module = null) : IRequest<WorkflowDashboardAnalyticsDto>;

public class GetWorkflowDashboardAnalyticsQueryHandler : IRequestHandler<GetWorkflowDashboardAnalyticsQuery, WorkflowDashboardAnalyticsDto>
{
    private readonly IWorkflowRepository _repository;
    public GetWorkflowDashboardAnalyticsQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDashboardAnalyticsDto> Handle(GetWorkflowDashboardAnalyticsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetWorkflowDashboardAnalyticsAsync(request.Department, request.Module);
    }
}

// 2. Get Workflow Definitions Query
public record GetWorkflowDefinitionsQuery(WorkflowFilterParams Filters) : IRequest<PagedResult<WorkflowDefinitionDto>>;

public class GetWorkflowDefinitionsQueryHandler : IRequestHandler<GetWorkflowDefinitionsQuery, PagedResult<WorkflowDefinitionDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetWorkflowDefinitionsQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<PagedResult<WorkflowDefinitionDto>> Handle(GetWorkflowDefinitionsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetWorkflowDefinitionsAsync(request.Filters);
    }
}

// 3. Get Workflow Definition By ID Query
public record GetWorkflowDefinitionByIdQuery(Guid Id) : IRequest<WorkflowDefinition?>;

public class GetWorkflowDefinitionByIdQueryHandler : IRequestHandler<GetWorkflowDefinitionByIdQuery, WorkflowDefinition?>
{
    private readonly IWorkflowRepository _repository;
    public GetWorkflowDefinitionByIdQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<WorkflowDefinition?> Handle(GetWorkflowDefinitionByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetWorkflowDefinitionByIdAsync(request.Id);
    }
}

// 4. Get Approval Inbox Query
public record GetApprovalInboxQuery(ApprovalInboxFilterParams Filters) : IRequest<PagedResult<ApprovalTaskDto>>;

public class GetApprovalInboxQueryHandler : IRequestHandler<GetApprovalInboxQuery, PagedResult<ApprovalTaskDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetApprovalInboxQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<PagedResult<ApprovalTaskDto>> Handle(GetApprovalInboxQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetApprovalInboxAsync(request.Filters);
    }
}

// 5. Get My Approvals Query
public record GetMyApprovalsQuery(string UserId, string Tab, ApprovalInboxFilterParams Filters) : IRequest<PagedResult<ApprovalTaskDto>>;

public class GetMyApprovalsQueryHandler : IRequestHandler<GetMyApprovalsQuery, PagedResult<ApprovalTaskDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetMyApprovalsQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<PagedResult<ApprovalTaskDto>> Handle(GetMyApprovalsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMyApprovalsAsync(request.UserId, request.Tab, request.Filters);
    }
}

// 6. Get Approval Details Query
public record GetApprovalDetailsQuery(Guid RequestId, string? ViewerUserId = null) : IRequest<ApprovalDetailsDto?>;

public class GetApprovalDetailsQueryHandler : IRequestHandler<GetApprovalDetailsQuery, ApprovalDetailsDto?>
{
    private readonly IWorkflowRepository _repository;
    public GetApprovalDetailsQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<ApprovalDetailsDto?> Handle(GetApprovalDetailsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetApprovalDetailsAsync(request.RequestId, request.ViewerUserId);
    }
}

// 7. Get Delegations Query
public record GetDelegationsQuery(string? DelegatorId = null, bool ActiveOnly = false) : IRequest<List<DelegationDto>>;

public class GetDelegationsQueryHandler : IRequestHandler<GetDelegationsQuery, List<DelegationDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetDelegationsQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<List<DelegationDto>> Handle(GetDelegationsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetDelegationsAsync(request.DelegatorId, request.ActiveOnly);
    }
}

// 8. Get Workflow Templates Query
public record GetWorkflowTemplatesQuery : IRequest<List<WorkflowTemplateDto>>;

public class GetWorkflowTemplatesQueryHandler : IRequestHandler<GetWorkflowTemplatesQuery, List<WorkflowTemplateDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetWorkflowTemplatesQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<List<WorkflowTemplateDto>> Handle(GetWorkflowTemplatesQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetWorkflowTemplatesAsync();
    }
}

// 9. Get Reports Queries
public record GetEscalationsReportQuery(string? Module = null) : IRequest<List<WorkflowEscalationDto>>;

public class GetEscalationsReportQueryHandler : IRequestHandler<GetEscalationsReportQuery, List<WorkflowEscalationDto>>
{
    private readonly IWorkflowRepository _repository;
    public GetEscalationsReportQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<List<WorkflowEscalationDto>> Handle(GetEscalationsReportQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetEscalationsReportAsync(request.Module);
    }
}

public record GetSlaReportQuery(string? Module = null) : IRequest<object>;

public class GetSlaReportQueryHandler : IRequestHandler<GetSlaReportQuery, object>
{
    private readonly IWorkflowRepository _repository;
    public GetSlaReportQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<object> Handle(GetSlaReportQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetSlaReportAsync(request.Module);
    }
}

public record GetWorkloadReportQuery : IRequest<object>;

public class GetWorkloadReportQueryHandler : IRequestHandler<GetWorkloadReportQuery, object>
{
    private readonly IWorkflowRepository _repository;
    public GetWorkloadReportQueryHandler(IWorkflowRepository repository) => _repository = repository;

    public async Task<object> Handle(GetWorkloadReportQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetWorkloadReportAsync();
    }
}
