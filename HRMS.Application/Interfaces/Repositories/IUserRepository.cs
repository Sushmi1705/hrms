using System;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Auth;

namespace HRMS.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task UpdateAsync(User user);
    Task AddSessionAsync(Session session);
    Task AddRefreshTokenAsync(RefreshToken refreshToken);
    Task<Session?> GetSessionByIdAsync(Guid sessionId);
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    Task UpdateSessionAsync(Session session);
    Task UpdateRefreshTokenAsync(RefreshToken refreshToken);
}
