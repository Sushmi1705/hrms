using System;
using HRMS.Domain.Entities.Auth;

namespace HRMS.Application.Interfaces.Auth;

public interface IJwtService
{
    string GenerateToken(User user, Session session);
    string GenerateRefreshToken();
}
