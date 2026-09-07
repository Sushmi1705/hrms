using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using HRMS.Persistence;
using HRMS.Persistence.Repositories;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Asset.DTOs;
using HRMS.Domain.Entities.Asset;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Tenant;

namespace HRMS.Tests;

public class AssetManagementTests
{
    private HrmsDbContext CreateInMemoryDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<HrmsDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        var context = new HrmsDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task CreateAsset_AssignsTagAndSaves()
    {
        var db = CreateInMemoryDbContext(nameof(CreateAsset_AssignsTagAndSaves));
        var tenantMock = new Mock<ITenantContext>();
        var tenantId = Guid.NewGuid();
        tenantMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var repo = new AssetRepository(db, tenantMock.Object);

        var asset = new Asset
        {
            Id = Guid.NewGuid(),
            AssetName = "Developer MacBook Pro",
            CategoryId = Guid.NewGuid(),
            PurchasePrice = 2499m,
            UsefulLifeMonths = 36,
            DepreciationMethod = "StraightLine"
        };

        var created = await repo.CreateAssetAsync(asset);

        Assert.NotNull(created);
        Assert.StartsWith("AST-2026-", created.AssetTag);
        Assert.Equal(2499m, created.CurrentBookValue);
        Assert.Equal("Available", created.Status);
    }

    [Fact]
    public async Task AssignAsset_WhenAssetAlreadyAssigned_ThrowsConflictException()
    {
        var db = CreateInMemoryDbContext(nameof(AssignAsset_WhenAssetAlreadyAssigned_ThrowsConflictException));
        var tenantMock = new Mock<ITenantContext>();
        var tenantId = Guid.NewGuid();
        tenantMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var emp1 = new EmployeeEntity { Id = Guid.NewGuid(), TenantId = tenantId, FirstName = "Jane", LastName = "Doe", Email = "jane@example.com" };
        var emp2 = new EmployeeEntity { Id = Guid.NewGuid(), TenantId = tenantId, FirstName = "John", LastName = "Smith", Email = "john@example.com" };
        db.Employees.AddRange(emp1, emp2);

        var asset = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetTag = "AST-TEST-001",
            AssetName = "Dell Laptop",
            Status = "Available",
            PurchasePrice = 1200m
        };
        db.Assets.Add(asset);
        await db.SaveChangesAsync();

        var repo = new AssetRepository(db, tenantMock.Object);

        // First assignment succeeds
        await repo.AssignAssetAsync(asset.Id, new AssignAssetDto
        {
            EmployeeId = emp1.Id,
            ConditionAtHandover = "New"
        }, "HR Admin");

        var updated = await db.Assets.FindAsync(asset.Id);
        Assert.Equal("Assigned", updated!.Status);
        Assert.Equal(emp1.Id, updated.CurrentCustodianEmployeeId);

        // Second simultaneous assignment must throw InvalidOperationException
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await repo.AssignAssetAsync(asset.Id, new AssignAssetDto
            {
                EmployeeId = emp2.Id,
                ConditionAtHandover = "Good"
            }, "HR Admin 2");
        });

        Assert.Contains("already assigned", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ReturnAsset_UpdatesAssetStatusToAvailableAndClosesAssignment()
    {
        var db = CreateInMemoryDbContext(nameof(ReturnAsset_UpdatesAssetStatusToAvailableAndClosesAssignment));
        var tenantMock = new Mock<ITenantContext>();
        var tenantId = Guid.NewGuid();
        tenantMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var emp = new EmployeeEntity { Id = Guid.NewGuid(), TenantId = tenantId, FirstName = "Alice", LastName = "Wong" };
        db.Employees.Add(emp);

        var asset = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetTag = "AST-RET-01",
            AssetName = "Monitor",
            Status = "Assigned",
            CurrentCustodianEmployeeId = emp.Id
        };
        db.Assets.Add(asset);

        var assignment = new AssetAssignment
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetId = asset.Id,
            EmployeeId = emp.Id,
            Status = "Active"
        };
        db.AssetAssignments.Add(assignment);
        await db.SaveChangesAsync();

        var repo = new AssetRepository(db, tenantMock.Object);

        var returnResult = await repo.ReturnAssetAsync(asset.Id, new ProcessReturnDto
        {
            Condition = "Good",
            ResultingAssetStatus = "Available",
            InspectionNotes = "Clean condition"
        }, "Inspector Dave");

        var updatedAsset = await db.Assets.FindAsync(asset.Id);
        var updatedAssignment = await db.AssetAssignments.FindAsync(assignment.Id);

        Assert.Equal("Available", updatedAsset!.Status);
        Assert.Null(updatedAsset.CurrentCustodianEmployeeId);
        Assert.Equal("Returned", updatedAssignment!.Status);
        Assert.NotNull(updatedAssignment.ActualReturnDate);
    }

    [Fact]
    public async Task DisposeAsset_MarksAssetDisposed_AndPreventsFutureAssignment()
    {
        var db = CreateInMemoryDbContext(nameof(DisposeAsset_MarksAssetDisposed_AndPreventsFutureAssignment));
        var tenantMock = new Mock<ITenantContext>();
        var tenantId = Guid.NewGuid();
        tenantMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var emp = new EmployeeEntity { Id = Guid.NewGuid(), TenantId = tenantId, FirstName = "Bob", LastName = "Builder" };
        db.Employees.Add(emp);

        var asset = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetTag = "AST-OLD-99",
            AssetName = "Old 2018 Desktop",
            Status = "Available",
            PurchasePrice = 800m
        };
        db.Assets.Add(asset);
        await db.SaveChangesAsync();

        var repo = new AssetRepository(db, tenantMock.Object);

        await repo.DisposeAssetAsync(asset.Id, new DisposeAssetDto
        {
            DisposalReason = "Obsolete",
            DisposalMethod = "Recycling",
            SaleValue = 50m,
            BuyerVendorName = "EcoRecycle"
        }, "Director");

        var updatedAsset = await db.Assets.FindAsync(asset.Id);
        Assert.Equal("Disposed", updatedAsset!.Status);

        // Attempting to assign a disposed asset must fail
        await Assert.ThrowsAsync<InvalidOperationException>(async () =>
        {
            await repo.AssignAssetAsync(asset.Id, new AssignAssetDto
            {
                EmployeeId = emp.Id
            }, "HR Admin");
        });
    }

    [Fact]
    public async Task DepreciationCalculation_StraightLine_CalculatesAccurateSchedule()
    {
        var db = CreateInMemoryDbContext(nameof(DepreciationCalculation_StraightLine_CalculatesAccurateSchedule));
        var tenantMock = new Mock<ITenantContext>();
        var tenantId = Guid.NewGuid();
        tenantMock.Setup(t => t.CurrentTenantId).Returns(tenantId);

        var asset = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetTag = "AST-DEP-01",
            AssetName = "High End Server",
            PurchasePrice = 3600m,
            SalvageValue = 0m,
            UsefulLifeMonths = 36,
            DepreciationMethod = "StraightLine",
            PurchaseDate = DateTime.UtcNow.AddMonths(-12)
        };
        db.Assets.Add(asset);
        await db.SaveChangesAsync();

        var repo = new AssetRepository(db, tenantMock.Object);

        var result = await repo.CalculateDepreciationAsync(asset.Id);

        Assert.NotNull(result);
        Assert.Equal(100m, result.MonthlyDepreciation); // 3600 / 36 = 100/month
        Assert.Equal(1200m, result.AnnualDepreciation); // 100 * 12
        Assert.True(result.CurrentBookValue <= 2500m); // 12 months depreciated
        Assert.NotEmpty(result.Schedule);
        Assert.Equal(36, result.Schedule.Count);
    }

    [Fact]
    public async Task TenantIsolation_TenantACannotAccessTenantBAssets()
    {
        var db = CreateInMemoryDbContext(nameof(TenantIsolation_TenantACannotAccessTenantBAssets));
        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();

        var cat = new AssetCategory { Id = Guid.NewGuid(), TenantId = tenantA, Name = "Laptops", Code = "LAP" };
        db.AssetCategories.Add(cat);

        var assetTenantA = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantA,
            CategoryId = cat.Id,
            AssetTag = "AST-TENANT-A",
            AssetName = "Company A Asset",
            PurchasePrice = 1500m
        };

        var assetTenantB = new Asset
        {
            Id = Guid.NewGuid(),
            TenantId = tenantB,
            CategoryId = cat.Id,
            AssetTag = "AST-TENANT-B",
            AssetName = "Company B Confidential Asset",
            PurchasePrice = 3500m
        };

        db.Assets.AddRange(assetTenantA, assetTenantB);
        await db.SaveChangesAsync();

        // Verify directly in db
        var countInDb = await db.Assets.CountAsync(a => a.TenantId == tenantA);
        Assert.Equal(1, countInDb);

        // Query using Tenant A context
        var tenantAMock = new Mock<ITenantContext>();
        tenantAMock.SetupGet(t => t.CurrentTenantId).Returns(tenantA);
        var repoTenantA = new AssetRepository(db, tenantAMock.Object);

        var listA = await repoTenantA.GetAssetsAsync(new AssetFilterParams());
        var assetBDetailFromTenantA = await repoTenantA.GetAssetByIdAsync(assetTenantB.Id);

        Assert.Single(listA.Items);
        Assert.Equal("AST-TENANT-A", listA.Items[0].AssetTag);
        Assert.Null(assetBDetailFromTenantA); // Strictly isolated: Tenant A gets null for Tenant B's asset!
    }
}
