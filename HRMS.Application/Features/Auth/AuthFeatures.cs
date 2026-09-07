using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using HRMS.Domain.Entities.Auth;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Identity;

namespace HRMS.Application.Features.Auth;

// -- Login --
public record LoginCommand(string Email, string Password, string DeviceId, string UserAgent, string IpAddress) : IRequest<AuthResult>;
public record AuthResult(string Token, string RefreshToken);

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
{
    private readonly IUserRepository _repo;
    private readonly IJwtService _jwt;
    private readonly IPasswordHasher<User> _hasher;

    public LoginCommandHandler(IUserRepository repo, IJwtService jwt, IPasswordHasher<User> hasher)
    {
        _repo = repo; _jwt = jwt; _hasher = hasher;
    }

    public async Task<AuthResult> Handle(LoginCommand req, CancellationToken ct)
    {
        var user = await _repo.GetByEmailAsync(req.Email);
        if (user == null || !user.IsActive) throw new Exception("Invalid credentials");
        
        if (user.LockedUntil > DateTime.UtcNow) throw new Exception("Account is locked");

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            user.FailedAttempts++;
            if (user.FailedAttempts >= 5) user.LockedUntil = DateTime.UtcNow.AddMinutes(15);
            await _repo.UpdateAsync(user);
            throw new Exception("Invalid credentials");
        }

        user.FailedAttempts = 0;
        user.LastLoginAt = DateTime.UtcNow;

        var session = new Session
        {
            UserId = user.Id,
            DeviceId = req.DeviceId,
            UserAgent = req.UserAgent,
            IpAddress = req.IpAddress,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
        await _repo.AddSessionAsync(session);

        var token = _jwt.GenerateToken(user, session);
        var refresh = _jwt.GenerateRefreshToken();

        var rt = new RefreshToken { SessionId = session.Id, Token = refresh, ExpiresAt = DateTime.UtcNow.AddDays(7) };
        await _repo.AddRefreshTokenAsync(rt);
        await _repo.UpdateAsync(user);

        return new AuthResult(token, refresh);
    }
}

// -- Refresh Token --
public record RefreshTokenCommand(string Token) : IRequest<AuthResult>;
public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResult>
{
    private readonly IUserRepository _repo;
    private readonly IJwtService _jwt;

    public RefreshTokenCommandHandler(IUserRepository repo, IJwtService jwt)
    {
        _repo = repo; _jwt = jwt;
    }

    public async Task<AuthResult> Handle(RefreshTokenCommand req, CancellationToken ct)
    {
        var rt = await _repo.GetRefreshTokenAsync(req.Token);
        if (rt == null || rt.IsRevoked) throw new Exception("Invalid token");

        if (rt.IsUsed)
        {
            // REUSE DETECTION: Revoke entire session
            var compromisedSession = await _repo.GetSessionByIdAsync(rt.SessionId);
            if (compromisedSession != null)
            {
                compromisedSession.IsRevoked = true;
                await _repo.UpdateSessionAsync(compromisedSession);
            }
            throw new Exception("Token reuse detected, session revoked");
        }

        if (rt.ExpiresAt < DateTime.UtcNow) throw new Exception("Token expired");

        rt.IsUsed = true;
        await _repo.UpdateRefreshTokenAsync(rt);

        var session = await _repo.GetSessionByIdAsync(rt.SessionId);
        if (session == null || session.IsRevoked || session.ExpiresAt < DateTime.UtcNow) throw new Exception("Session invalid");
        
        var user = await _repo.GetByIdAsync(session.UserId);
        if (user == null || !user.IsActive) throw new Exception("User invalid");

        // Extend session
        session.ExpiresAt = DateTime.UtcNow.AddDays(7);
        await _repo.UpdateSessionAsync(session);

        var newToken = _jwt.GenerateToken(user, session);
        var newRefresh = _jwt.GenerateRefreshToken();

        var newRt = new RefreshToken { SessionId = session.Id, Token = newRefresh, ExpiresAt = DateTime.UtcNow.AddDays(7) };
        await _repo.AddRefreshTokenAsync(newRt);

        return new AuthResult(newToken, newRefresh);
    }
}

// -- Logout --
public record LogoutCommand(Guid SessionId) : IRequest<bool>;
public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IUserRepository _repo;
    public LogoutCommandHandler(IUserRepository repo) { _repo = repo; }
    public async Task<bool> Handle(LogoutCommand req, CancellationToken ct)
    {
        var session = await _repo.GetSessionByIdAsync(req.SessionId);
        if (session != null) { session.IsRevoked = true; await _repo.UpdateSessionAsync(session); }
        return true;
    }
}

// -- Forgot Password --
public record ForgotPasswordCommand(string Email) : IRequest<bool>;
public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
{
    private readonly IUserRepository _repo;
    public ForgotPasswordCommandHandler(IUserRepository repo) { _repo = repo; }
    public async Task<bool> Handle(ForgotPasswordCommand req, CancellationToken ct)
    {
        var user = await _repo.GetByEmailAsync(req.Email);
        // Fire email event here...
        return true; 
    }
}

// -- Reset Password --
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<bool>;
public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher<User> _hasher;
    public ResetPasswordCommandHandler(IUserRepository repo, IPasswordHasher<User> hasher) { _repo = repo; _hasher = hasher; }
    
    public async Task<bool> Handle(ResetPasswordCommand req, CancellationToken ct)
    {
        var user = await _repo.GetByEmailAsync(req.Email);
        if (user != null)
        {
            user.PasswordHash = _hasher.HashPassword(user, req.NewPassword);
            await _repo.UpdateAsync(user);
        }
        return true;
    }
}

// -- Change Password --
public record ChangePasswordCommand(Guid UserId, string OldPassword, string NewPassword) : IRequest<bool>;
public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher<User> _hasher;
    public ChangePasswordCommandHandler(IUserRepository repo, IPasswordHasher<User> hasher) { _repo = repo; _hasher = hasher; }
    
    public async Task<bool> Handle(ChangePasswordCommand req, CancellationToken ct)
    {
        var user = await _repo.GetByIdAsync(req.UserId);
        if (user == null) throw new Exception("User not found");

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.OldPassword);
        if (result == PasswordVerificationResult.Failed) throw new Exception("Invalid old password");

        user.PasswordHash = _hasher.HashPassword(user, req.NewPassword);
        await _repo.UpdateAsync(user);
        return true;
    }
}

// -- MFA / Email / Others --
public record VerifyEmailCommand(string Token) : IRequest<bool>;
public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, bool>
{
    public Task<bool> Handle(VerifyEmailCommand req, CancellationToken ct) => Task.FromResult(true);
}

public record SendOtpCommand(Guid UserId) : IRequest<bool>;
public class SendOtpCommandHandler : IRequestHandler<SendOtpCommand, bool>
{
    public Task<bool> Handle(SendOtpCommand req, CancellationToken ct) => Task.FromResult(true);
}

public record VerifyOtpCommand(Guid UserId, string Code) : IRequest<bool>;
public class VerifyOtpCommandHandler : IRequestHandler<VerifyOtpCommand, bool>
{
    public Task<bool> Handle(VerifyOtpCommand req, CancellationToken ct) => Task.FromResult(true);
}

public record GetMeQuery(Guid UserId) : IRequest<object>;
public class GetMeQueryHandler : IRequestHandler<GetMeQuery, object>
{
    private readonly IUserRepository _repo;
    public GetMeQueryHandler(IUserRepository repo) { _repo = repo; }
    
    public async Task<object> Handle(GetMeQuery req, CancellationToken ct)
    {
        var user = await _repo.GetByIdAsync(req.UserId);
        if (user == null) throw new Exception("User not found");
        return new { user.Id, user.Email, user.IsActive, user.LastLoginAt };
    }
}
