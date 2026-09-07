using System;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Tenant.DTOs;
using MediatR;

namespace HRMS.Application.Features.Tenant.Commands;

// 1. Create Tenant
public record CreateTenantCommand(CreateTenantDto Dto, string CreatedBy) : IRequest<TenantDetailsDto>;
public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, TenantDetailsDto>
{
    private readonly ITenantRepository _repo;
    public CreateTenantCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<TenantDetailsDto> Handle(CreateTenantCommand req, CancellationToken ct) => _repo.CreateTenantAsync(req.Dto, req.CreatedBy);
}

// 2. Update Tenant
public record UpdateTenantCommand(Guid Id, UpdateTenantDto Dto, string UpdatedBy) : IRequest<TenantDetailsDto>;
public class UpdateTenantCommandHandler : IRequestHandler<UpdateTenantCommand, TenantDetailsDto>
{
    private readonly ITenantRepository _repo;
    public UpdateTenantCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<TenantDetailsDto> Handle(UpdateTenantCommand req, CancellationToken ct) => _repo.UpdateTenantAsync(req.Id, req.Dto, req.UpdatedBy);
}

// 3. Activate Tenant
public record ActivateTenantCommand(Guid Id, string ActivatedBy) : IRequest<bool>;
public class ActivateTenantCommandHandler : IRequestHandler<ActivateTenantCommand, bool>
{
    private readonly ITenantRepository _repo;
    public ActivateTenantCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(ActivateTenantCommand req, CancellationToken ct) => _repo.ActivateTenantAsync(req.Id, req.ActivatedBy);
}

// 4. Suspend Tenant
public record SuspendTenantCommand(Guid Id, string Reason, string SuspendedBy) : IRequest<bool>;
public class SuspendTenantCommandHandler : IRequestHandler<SuspendTenantCommand, bool>
{
    private readonly ITenantRepository _repo;
    public SuspendTenantCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(SuspendTenantCommand req, CancellationToken ct) => _repo.SuspendTenantAsync(req.Id, req.Reason, req.SuspendedBy);
}

// 5. Change Plan
public record ChangeTenantPlanCommand(Guid Id, ChangeTenantPlanDto Dto, string ChangedBy) : IRequest<bool>;
public class ChangeTenantPlanCommandHandler : IRequestHandler<ChangeTenantPlanCommand, bool>
{
    private readonly ITenantRepository _repo;
    public ChangeTenantPlanCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(ChangeTenantPlanCommand req, CancellationToken ct) => _repo.ChangeTenantPlanAsync(req.Id, req.Dto, req.ChangedBy);
}

// 6. Update Feature Override
public record UpdateFeatureOverrideCommand(Guid Id, UpdateFeatureOverrideDto Dto, string UpdatedBy) : IRequest<bool>;
public class UpdateFeatureOverrideCommandHandler : IRequestHandler<UpdateFeatureOverrideCommand, bool>
{
    private readonly ITenantRepository _repo;
    public UpdateFeatureOverrideCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(UpdateFeatureOverrideCommand req, CancellationToken ct) => _repo.UpdateFeatureOverrideAsync(req.Id, req.Dto, req.UpdatedBy);
}

// 7. Save Subscription Plan
public record SaveSubscriptionPlanCommand(SubscriptionPlanDto Dto, string SavedBy) : IRequest<SubscriptionPlanDto>;
public class SaveSubscriptionPlanCommandHandler : IRequestHandler<SaveSubscriptionPlanCommand, SubscriptionPlanDto>
{
    private readonly ITenantRepository _repo;
    public SaveSubscriptionPlanCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<SubscriptionPlanDto> Handle(SaveSubscriptionPlanCommand req, CancellationToken ct) => _repo.SaveSubscriptionPlanAsync(req.Dto, req.SavedBy);
}

// 8. Start Impersonation
public record StartImpersonationCommand(StartImpersonationDto Dto, Guid AdminUserId, string AdminEmail, string IpAddress) : IRequest<ImpersonationSessionDto>;
public class StartImpersonationCommandHandler : IRequestHandler<StartImpersonationCommand, ImpersonationSessionDto>
{
    private readonly ITenantRepository _repo;
    public StartImpersonationCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<ImpersonationSessionDto> Handle(StartImpersonationCommand req, CancellationToken ct)
        => _repo.StartImpersonationAsync(req.Dto, req.AdminUserId, req.AdminEmail, req.IpAddress);
}

// 9. End Impersonation
public record EndImpersonationCommand(Guid LogId, string ActionsPerformed) : IRequest<bool>;
public class EndImpersonationCommandHandler : IRequestHandler<EndImpersonationCommand, bool>
{
    private readonly ITenantRepository _repo;
    public EndImpersonationCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(EndImpersonationCommand req, CancellationToken ct) => _repo.EndImpersonationAsync(req.LogId, req.ActionsPerformed);
}

// 10. Request Deletion
public record RequestTenantDeletionCommand(Guid Id, string Reason, string RequestedBy) : IRequest<bool>;
public class RequestTenantDeletionCommandHandler : IRequestHandler<RequestTenantDeletionCommand, bool>
{
    private readonly ITenantRepository _repo;
    public RequestTenantDeletionCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(RequestTenantDeletionCommand req, CancellationToken ct) => _repo.RequestTenantDeletionAsync(req.Id, req.Reason, req.RequestedBy);
}

// 11. Cancel Deletion
public record CancelTenantDeletionCommand(Guid Id, string Reason, string CancelledBy) : IRequest<bool>;
public class CancelTenantDeletionCommandHandler : IRequestHandler<CancelTenantDeletionCommand, bool>
{
    private readonly ITenantRepository _repo;
    public CancelTenantDeletionCommandHandler(ITenantRepository repo) => _repo = repo;
    public Task<bool> Handle(CancelTenantDeletionCommand req, CancellationToken ct) => _repo.CancelTenantDeletionAsync(req.Id, req.Reason, req.CancelledBy);
}
