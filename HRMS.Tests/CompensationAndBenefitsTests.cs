using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Compensation.DTOs;
using HRMS.Domain.Entities.Compensation;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Tenant;
using HRMS.Persistence;
using HRMS.Persistence.Repositories;

namespace HRMS.Tests;

public class CompensationAndBenefitsTests
{
    private (HrmsDbContext context, Guid tenantA, Guid tenantB) CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<HrmsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var context = new HrmsDbContext(options);

        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();

        context.Tenants.AddRange(
            new Tenant { Id = tenantA, Name = "Acme Corp Tenant A" },
            new Tenant { Id = tenantB, Name = "Beta Corp Tenant B" }
        );

        context.SaveChanges();
        return (context, tenantA, tenantB);
    }

    [Fact]
    public async Task UpsertCompensation_CalculatesCompaRatio_AndPreservesHistoryOnRevision()
    {
        // Arrange
        var (context, tenantA, _) = CreateInMemoryDbContext();
        var mockTenant = new Mock<ITenantContext>();
        mockTenant.SetupGet(t => t.CurrentTenantId).Returns((Guid?)tenantA);

        var repo = new CompensationRepository(context, mockTenant.Object);

        var dept = new Department { Id = Guid.NewGuid(), TenantId = tenantA, Code = "ENG", Name = "Engineering" };
        var desig = new Designation { Id = Guid.NewGuid(), TenantId = tenantA, Code = "SE", Name = "Senior Engineer", DepartmentId = dept.Id };
        context.Departments.Add(dept);
        context.Designations.Add(desig);

        var grade = await repo.CreatePayGradeAsync(new CreatePayGradeDto
        {
            Code = "G3",
            Name = "Senior Engineer",
            Level = 3,
            MinimumSalary = 80000,
            MidpointSalary = 100000,
            MaximumSalary = 120000
        });

        var emp = new EmployeeEntity
        {
            Id = Guid.NewGuid(),
            TenantId = tenantA,
            EmployeeNumber = "EMP-TEST-01",
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@enterprise.com",
            DepartmentId = dept.Id,
            DesignationId = desig.Id,
            JoiningDate = DateTime.UtcNow.AddYears(-2)
        };
        context.Employees.Add(emp);
        await context.SaveChangesAsync();

        // Act: Initial compensation ($90,000 against $100,000 midpoint = 0.90 compa-ratio)
        var initial = await repo.UpsertEmployeeCompensationAsync(new UpsertEmployeeCompensationDto
        {
            EmployeeId = emp.Id,
            PayGradeId = grade.Id,
            BaseSalary = 90000,
            EffectiveDate = new DateTime(2025, 1, 1),
            Reason = "Initial Hire"
        }, "HR Admin");

        // Assert Initial
        Assert.Equal(90000, initial.BaseSalary);
        Assert.Equal(0.90m, initial.CompaRatio);
        Assert.Equal("WithinRange", initial.CompaRatioStatus);

        // Act 2: Salary Revision ($110,000)
        var revised = await repo.UpsertEmployeeCompensationAsync(new UpsertEmployeeCompensationDto
        {
            EmployeeId = emp.Id,
            PayGradeId = grade.Id,
            BaseSalary = 110000,
            EffectiveDate = new DateTime(2026, 1, 1),
            Reason = "Annual Merit Increase"
        }, "HR Director");

        // Assert Revision
        Assert.Equal(110000, revised.BaseSalary);
        Assert.Equal(1.10m, revised.CompaRatio);

        // Verify history preserved
        var detail = await repo.GetEmployeeCompensationDetailAsync(emp.Id);
        Assert.NotNull(detail);
        Assert.Single(detail.History);
        Assert.Equal(90000, detail.History[0].PreviousSalary);
        Assert.Equal(110000, detail.History[0].NewSalary);
        Assert.Equal(20000, detail.History[0].IncreaseAmount);
        Assert.Equal(22.22m, detail.History[0].PercentageIncrease);
    }

    [Fact]
    public async Task CreateBenefitEnrollment_CalculatesTierContributions_Accurately()
    {
        // Arrange
        var (context, tenantA, _) = CreateInMemoryDbContext();
        var mockTenant = new Mock<ITenantContext>();
        mockTenant.Setup(t => t.CurrentTenantId).Returns(tenantA);

        var repo = new CompensationRepository(context, mockTenant.Object);

        var plan = await repo.CreateBenefitPlanAsync(new CreateBenefitPlanDto
        {
            PlanCode = "MED-PPO",
            PlanName = "Enterprise PPO",
            Type = "MedicalInsurance",
            Provider = "HealthCare Inc",
            CoverageAmount = 1000000,
            EmployeeMonthlyCost = 200,
            EmployerMonthlyCost = 600,
            AllowsDependents = true
        });

        var emp = new EmployeeEntity
        {
            Id = Guid.NewGuid(),
            TenantId = tenantA,
            EmployeeNumber = "EMP-TEST-02",
            FirstName = "Jane",
            LastName = "Smith",
            Email = "jane.smith@enterprise.com",
            JoiningDate = DateTime.UtcNow
        };
        context.Employees.Add(emp);
        await context.SaveChangesAsync();

        // Act: Enroll in Family tier (2.20 multiplier: 200 * 2.20 = 440 employee, 600 * 2.20 = 1320 employer)
        var enrollment = await repo.CreateBenefitEnrollmentAsync(new CreateBenefitEnrollmentDto
        {
            EmployeeId = emp.Id,
            BenefitPlanId = plan.Id,
            CoverageTier = "Family",
            EffectiveDate = DateTime.UtcNow
        });

        // Assert
        Assert.Equal(440, enrollment.EmployeeMonthlyContribution);
        Assert.Equal(1320, enrollment.EmployerMonthlyContribution);
        Assert.Equal(1760, enrollment.TotalMonthlyPremium);
        Assert.Equal("Active", enrollment.Status);
    }

    [Fact]
    public async Task ProcessSalaryRevision_WhenApproved_UpdatesEmployeeCompensation()
    {
        // Arrange
        var (context, tenantA, _) = CreateInMemoryDbContext();
        var mockTenant = new Mock<ITenantContext>();
        mockTenant.SetupGet(t => t.CurrentTenantId).Returns((Guid?)tenantA);

        var repo = new CompensationRepository(context, mockTenant.Object);

        var dept = new Department { Id = Guid.NewGuid(), TenantId = tenantA, Code = "OPS", Name = "Operations" };
        var desig = new Designation { Id = Guid.NewGuid(), TenantId = tenantA, Code = "LE", Name = "Lead Engineer", DepartmentId = dept.Id };
        context.Departments.Add(dept);
        context.Designations.Add(desig);

        var emp = new EmployeeEntity
        {
            Id = Guid.NewGuid(),
            TenantId = tenantA,
            EmployeeNumber = "EMP-REV-01",
            FirstName = "Mark",
            LastName = "Taylor",
            Email = "mark.taylor@enterprise.com",
            DepartmentId = dept.Id,
            DesignationId = desig.Id,
            JoiningDate = DateTime.UtcNow
        };
        context.Employees.Add(emp);
        await context.SaveChangesAsync();

        await repo.UpsertEmployeeCompensationAsync(new UpsertEmployeeCompensationDto
        {
            EmployeeId = emp.Id,
            BaseSalary = 100000,
            EffectiveDate = new DateTime(2025, 1, 1),
            Reason = "Hire"
        }, "HR");

        // Act: Create Revision to $115,000
        var revision = await repo.CreateSalaryRevisionAsync(new CreateSalaryRevisionDto
        {
            EmployeeId = emp.Id,
            ProposedSalary = 115000,
            EffectiveDate = new DateTime(2026, 1, 1),
            Reason = "Promotion",
            Comments = "Promoted to Senior Team Lead"
        }, "Manager");

        Assert.Equal("Submitted", revision.Status);
        Assert.Equal(15000, revision.IncreaseAmount);
        Assert.Equal(15.0m, revision.PercentageIncrease);

        // Approve
        var approved = await repo.ProcessSalaryRevisionActionAsync(revision.Id, new ProcessSalaryRevisionActionDto
        {
            Action = "Approve",
            ApproverComments = "Merit budget approved by Director"
        }, "VP HR");

        // Assert
        Assert.Equal("Approved", approved.Status);

        var currentComp = (await repo.GetEmployeeCompensationsAsync(new CompensationFilterParams { Search = emp.Id.ToString() })).Items.First();
        Assert.Equal(115000, currentComp.BaseSalary);
    }

    [Fact]
    public async Task TenantIsolation_TenantACannotAccessTenantBCompensation()
    {
        // Arrange
        var (context, tenantA, tenantB) = CreateInMemoryDbContext();
        
        var mockTenantA = new Mock<ITenantContext>();
        mockTenantA.Setup(t => t.CurrentTenantId).Returns(tenantA);
        var repoA = new CompensationRepository(context, mockTenantA.Object);

        var mockTenantB = new Mock<ITenantContext>();
        mockTenantB.Setup(t => t.CurrentTenantId).Returns(tenantB);
        var repoB = new CompensationRepository(context, mockTenantB.Object);

        // Create component and employee in Tenant A
        var compA = await repoA.CreateComponentAsync(new CreateCompensationComponentDto
        {
            Code = "BONUS_A",
            Name = "Tenant A Bonus",
            Type = "Earnings"
        });

        // Act: Tenant B fetches components
        var componentsInB = await repoB.GetComponentsAsync();

        // Assert: Tenant B does NOT see Tenant A's component
        Assert.DoesNotContain(componentsInB, c => c.Code == "BONUS_A");
    }
}
