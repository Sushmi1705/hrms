using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Moq;
using HRMS.Application.Features.Auth;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Identity;
using HRMS.Domain.Entities.Auth;

namespace HRMS.Tests;

public class AuthTests
{
    [Fact]
    public async Task Login_ValidCredentials_ReturnsTokens()
    {
        var mockRepo = new Mock<IUserRepository>();
        var mockJwt = new Mock<IJwtService>();
        var mockHasher = new Mock<IPasswordHasher<User>>();

        var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", PasswordHash = "hash", IsActive = true };
        mockRepo.Setup(x => x.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);
        mockHasher.Setup(x => x.VerifyHashedPassword(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                  .Returns(PasswordVerificationResult.Success);
        
        mockJwt.Setup(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<Session>())).Returns("token");
        mockJwt.Setup(x => x.GenerateRefreshToken()).Returns("refresh");

        var handler = new LoginCommandHandler(mockRepo.Object, mockJwt.Object, mockHasher.Object);
        var result = await handler.Handle(new LoginCommand("test@test.com", "pass", "devId", "agent", "ip"), CancellationToken.None);

        Assert.Equal("token", result.Token);
        Assert.Equal("refresh", result.RefreshToken);
    }
}
