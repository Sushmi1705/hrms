using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Moq;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;
using HRMS.Application.Features.Organization.Branch.Commands;

namespace HRMS.Tests;

public class OrganizationTests
{
    [Fact]
    public async Task DeleteBranch_WhenDepartmentsExist_ThrowsException()
    {
        // Setup mock repository
        var mockRepo = new Mock<IOrganizationRepository>();
        
        var branch = new Branch { Id = Guid.NewGuid(), Code = "B1", Name = "Branch 1" };
        mockRepo.Setup(r => r.GetByIdAsync<Branch>(branch.Id, It.IsAny<CancellationToken>()))
                .ReturnsAsync(branch);

        var handler = new DeleteBranchCommandHandler(mockRepo.Object);
        var result = await handler.Handle(new DeleteBranchCommand(branch.Id), CancellationToken.None);
        
        Assert.True(result);
        Assert.True(branch.IsDeleted);
        mockRepo.Verify(r => r.UpdateAsync(branch, It.IsAny<CancellationToken>()), Times.Once);
    }
}
