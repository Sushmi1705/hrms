using System;
using System.Security.Claims;
using HRMS.Application.Interfaces.Auth;
using HRMS.Domain.Entities.Auth;
namespace HRMS.Infrastructure.Auth;
public class JwtService : IJwtService {
    public string GenerateToken(User user, Session session) => "token";
    public string GenerateToken(User user) => "token";
    public string GenerateRefreshToken() => "refresh";
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token) => new ClaimsPrincipal();
}
