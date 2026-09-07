using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.SystemAdmin.DTOs;

namespace HRMS.Application.Features.SystemAdmin.Commands;

public record CreateUserCommand(CreateUserDto Dto, string AdminName, string AdminIp) : IRequest<UserSummaryDto>;
public record UpdateUserCommand(Guid UserId, UpdateUserDto Dto, string AdminName, string AdminIp) : IRequest<UserSummaryDto>;
public record DeleteUserCommand(Guid UserId, string AdminName, string AdminIp) : IRequest<bool>;
public record ActivateUserCommand(Guid UserId, string AdminName, string AdminIp) : IRequest<bool>;
public record DeactivateUserCommand(Guid UserId, string AdminName, string AdminIp) : IRequest<bool>;
public record LockUserCommand(Guid UserId, string Reason, string AdminName, string AdminIp) : IRequest<bool>;
public record UnlockUserCommand(Guid UserId, string AdminName, string AdminIp) : IRequest<bool>;
public record ResetUserPasswordCommand(Guid UserId, string? CustomPassword, string AdminName, string AdminIp) : IRequest<string>;
public record ForceLogoutUserCommand(Guid UserId, string AdminName, string AdminIp) : IRequest<bool>;
public record UpdateUserRolesCommand(Guid UserId, List<Guid> RoleIds, string AdminName, string AdminIp) : IRequest<bool>;
public record UpdateUserDirectPermissionCommand(Guid UserId, Guid PermissionId, bool IsGranted, string Reason, string AdminName, string AdminIp) : IRequest<bool>;

public record CreateRoleCommand(CreateRoleDto Dto, string AdminName, string AdminIp) : IRequest<RoleDto>;
public record UpdateRoleCommand(Guid RoleId, UpdateRoleDto Dto, string AdminName, string AdminIp) : IRequest<RoleDto>;
public record DeleteRoleCommand(Guid RoleId, string AdminName, string AdminIp) : IRequest<bool>;
public record DuplicateRoleCommand(Guid RoleId, string AdminName, string AdminIp) : IRequest<RoleDto>;
public record UpdateRolePermissionsCommand(Guid RoleId, List<Guid> PermissionIds, string AdminName, string AdminIp) : IRequest<bool>;

public record UpdateSettingCommand(UpdateSettingDto Dto, string AdminName, string AdminIp) : IRequest<bool>;
public record UpdateSecurityPolicyCommand(SecurityPolicyDto Dto, string AdminName, string AdminIp) : IRequest<SecurityPolicyDto>;
public record UpdateEmailConfigurationCommand(EmailConfigurationDto Dto, string AdminName, string AdminIp) : IRequest<EmailConfigurationDto>;
public record TestEmailConnectionCommand() : IRequest<bool>;
public record SendTestEmailCommand(string RecipientEmail, string AdminName, string AdminIp) : IRequest<bool>;

public record UpdateFeatureFlagCommand(string Key, bool IsEnabledGlobally, string? CompanyOverridesJson, string AdminName, string AdminIp) : IRequest<bool>;

public record SaveHolidayCalendarCommand(SaveHolidayCalendarDto Dto, string AdminName, string AdminIp) : IRequest<HolidayCalendarDto>;
public record DeleteHolidayCalendarCommand(Guid Id, string AdminName, string AdminIp) : IRequest<bool>;

public record RevokeSessionCommand(Guid SessionId, string Reason, string AdminName, string AdminIp) : IRequest<bool>;
public record RevokeAllSessionsCommand(Guid? UserIdExcept, string Reason, string AdminName, string AdminIp) : IRequest<int>;

public record TriggerJobNowCommand(string JobKey, string AdminName, string AdminIp) : IRequest<bool>;
public record ToggleJobPauseCommand(string JobKey, string AdminName, string AdminIp) : IRequest<bool>;

// Command Handlers
public class SystemAdminCommandHandlers :
    IRequestHandler<CreateUserCommand, UserSummaryDto>,
    IRequestHandler<UpdateUserCommand, UserSummaryDto>,
    IRequestHandler<DeleteUserCommand, bool>,
    IRequestHandler<ActivateUserCommand, bool>,
    IRequestHandler<DeactivateUserCommand, bool>,
    IRequestHandler<LockUserCommand, bool>,
    IRequestHandler<UnlockUserCommand, bool>,
    IRequestHandler<ResetUserPasswordCommand, string>,
    IRequestHandler<ForceLogoutUserCommand, bool>,
    IRequestHandler<UpdateUserRolesCommand, bool>,
    IRequestHandler<UpdateUserDirectPermissionCommand, bool>,
    IRequestHandler<CreateRoleCommand, RoleDto>,
    IRequestHandler<UpdateRoleCommand, RoleDto>,
    IRequestHandler<DeleteRoleCommand, bool>,
    IRequestHandler<DuplicateRoleCommand, RoleDto>,
    IRequestHandler<UpdateRolePermissionsCommand, bool>,
    IRequestHandler<UpdateSettingCommand, bool>,
    IRequestHandler<UpdateSecurityPolicyCommand, SecurityPolicyDto>,
    IRequestHandler<UpdateEmailConfigurationCommand, EmailConfigurationDto>,
    IRequestHandler<TestEmailConnectionCommand, bool>,
    IRequestHandler<SendTestEmailCommand, bool>,
    IRequestHandler<UpdateFeatureFlagCommand, bool>,
    IRequestHandler<SaveHolidayCalendarCommand, HolidayCalendarDto>,
    IRequestHandler<DeleteHolidayCalendarCommand, bool>,
    IRequestHandler<RevokeSessionCommand, bool>,
    IRequestHandler<RevokeAllSessionsCommand, int>,
    IRequestHandler<TriggerJobNowCommand, bool>,
    IRequestHandler<ToggleJobPauseCommand, bool>
{
    private readonly ISystemAdminRepository _repository;

    public SystemAdminCommandHandlers(ISystemAdminRepository repository)
    {
        _repository = repository;
    }

    public Task<UserSummaryDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        => _repository.CreateUserAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<UserSummaryDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        => _repository.UpdateUserAsync(request.UserId, request.Dto, request.AdminName, request.AdminIp);

    public Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        => _repository.DeleteUserAsync(request.UserId, request.AdminName, request.AdminIp);

    public Task<bool> Handle(ActivateUserCommand request, CancellationToken cancellationToken)
        => _repository.ActivateUserAsync(request.UserId, request.AdminName, request.AdminIp);

    public Task<bool> Handle(DeactivateUserCommand request, CancellationToken cancellationToken)
        => _repository.DeactivateUserAsync(request.UserId, request.AdminName, request.AdminIp);

    public Task<bool> Handle(LockUserCommand request, CancellationToken cancellationToken)
        => _repository.LockUserAsync(request.UserId, request.Reason, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UnlockUserCommand request, CancellationToken cancellationToken)
        => _repository.UnlockUserAsync(request.UserId, request.AdminName, request.AdminIp);

    public Task<string> Handle(ResetUserPasswordCommand request, CancellationToken cancellationToken)
        => _repository.ResetUserPasswordAsync(request.UserId, request.CustomPassword, request.AdminName, request.AdminIp);

    public Task<bool> Handle(ForceLogoutUserCommand request, CancellationToken cancellationToken)
        => _repository.ForceLogoutUserAsync(request.UserId, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UpdateUserRolesCommand request, CancellationToken cancellationToken)
        => _repository.UpdateUserRolesAsync(request.UserId, request.RoleIds, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UpdateUserDirectPermissionCommand request, CancellationToken cancellationToken)
        => _repository.UpdateUserDirectPermissionAsync(request.UserId, request.PermissionId, request.IsGranted, request.Reason, request.AdminName, request.AdminIp);

    public Task<RoleDto> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        => _repository.CreateRoleAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<RoleDto> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
        => _repository.UpdateRoleAsync(request.RoleId, request.Dto, request.AdminName, request.AdminIp);

    public Task<bool> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
        => _repository.DeleteRoleAsync(request.RoleId, request.AdminName, request.AdminIp);

    public Task<RoleDto> Handle(DuplicateRoleCommand request, CancellationToken cancellationToken)
        => _repository.DuplicateRoleAsync(request.RoleId, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UpdateRolePermissionsCommand request, CancellationToken cancellationToken)
        => _repository.UpdateRolePermissionsAsync(request.RoleId, request.PermissionIds, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UpdateSettingCommand request, CancellationToken cancellationToken)
        => _repository.UpdateSettingAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<SecurityPolicyDto> Handle(UpdateSecurityPolicyCommand request, CancellationToken cancellationToken)
        => _repository.UpdateSecurityPolicyAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<EmailConfigurationDto> Handle(UpdateEmailConfigurationCommand request, CancellationToken cancellationToken)
        => _repository.UpdateEmailConfigurationAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<bool> Handle(TestEmailConnectionCommand request, CancellationToken cancellationToken)
        => _repository.TestEmailConnectionAsync();

    public Task<bool> Handle(SendTestEmailCommand request, CancellationToken cancellationToken)
        => _repository.SendTestEmailAsync(request.RecipientEmail, request.AdminName, request.AdminIp);

    public Task<bool> Handle(UpdateFeatureFlagCommand request, CancellationToken cancellationToken)
        => _repository.UpdateFeatureFlagAsync(request.Key, request.IsEnabledGlobally, request.CompanyOverridesJson, request.AdminName, request.AdminIp);

    public Task<HolidayCalendarDto> Handle(SaveHolidayCalendarCommand request, CancellationToken cancellationToken)
        => _repository.SaveHolidayCalendarAsync(request.Dto, request.AdminName, request.AdminIp);

    public Task<bool> Handle(DeleteHolidayCalendarCommand request, CancellationToken cancellationToken)
        => _repository.DeleteHolidayCalendarAsync(request.Id, request.AdminName, request.AdminIp);

    public Task<bool> Handle(RevokeSessionCommand request, CancellationToken cancellationToken)
        => _repository.RevokeSessionAsync(request.SessionId, request.Reason, request.AdminName, request.AdminIp);

    public Task<int> Handle(RevokeAllSessionsCommand request, CancellationToken cancellationToken)
        => _repository.RevokeAllSessionsAsync(request.UserIdExcept, request.Reason, request.AdminName, request.AdminIp);

    public Task<bool> Handle(TriggerJobNowCommand request, CancellationToken cancellationToken)
        => _repository.TriggerJobNowAsync(request.JobKey, request.AdminName, request.AdminIp);

    public Task<bool> Handle(ToggleJobPauseCommand request, CancellationToken cancellationToken)
        => _repository.ToggleJobPauseAsync(request.JobKey, request.AdminName, request.AdminIp);
}
