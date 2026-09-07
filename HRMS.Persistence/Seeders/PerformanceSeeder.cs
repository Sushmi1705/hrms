using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using HRMS.Domain.Entities.Performance;
using Microsoft.Extensions.DependencyInjection;

namespace HRMS.Persistence.Seeders;

public static class PerformanceSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.ReviewCycles.Any()) return;

        var employees = context.Employees.ToList();
        if (!employees.Any()) return;

        var faker = new Faker();

        // 1. Seed Review Cycle
        var cycle = new ReviewCycle
        {
            Id = Guid.NewGuid(),
            Name = "Annual Performance Review 2026",
            Type = "Yearly",
            StartDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2026, 12, 31, 23, 59, 59, DateTimeKind.Utc),
            Status = "Active",
            Description = "Organization wide annual performance appraisal.",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty
        };
        context.ReviewCycles.Add(cycle);

        var goals = new List<Goal>();
        var reviews = new List<PerformanceReview>();
        var pips = new List<PerformanceImprovementPlan>();

        foreach (var emp in employees)
        {
            // Seed 2-4 Goals per employee
            var numGoals = faker.Random.Int(2, 4);
            for (int i = 0; i < numGoals; i++)
            {
                goals.Add(new Goal
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = emp.Id,
                    ReviewCycleId = cycle.Id,
                    Title = faker.Company.CatchPhrase(),
                    Description = faker.Lorem.Paragraph(),
                    GoalType = faker.PickRandom("Individual", "Department", "Company"),
                    Priority = faker.PickRandom("High", "Medium", "Low"),
                    Weightage = 100m / numGoals,
                    ProgressPercentage = faker.Random.Int(10, 100),
                    Deadline = faker.Date.Future(),
                    Status = faker.PickRandom("In Progress", "Completed", "Overdue"),
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty
                });
            }

            // Seed Performance Review
            reviews.Add(new PerformanceReview
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                ReviewCycleId = cycle.Id,
                ManagerId = emp.ManagerId,
                Status = faker.PickRandom("Draft", "Submitted", "Manager Reviewed", "Finalized"),
                SelfRating = faker.Random.Decimal(2m, 5m),
                ManagerRating = faker.Random.Decimal(2m, 5m),
                SelfAssessmentComments = faker.Lorem.Sentence(),
                ManagerComments = faker.Lorem.Sentence(),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty
            });

            // Seed PIP for 5% of employees
            if (faker.Random.Bool(0.05f))
            {
                pips.Add(new PerformanceImprovementPlan
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = emp.Id,
                    CoachId = employees.First(e => e.Id != emp.Id).Id,
                    Title = "Performance Improvement Workflow",
                    Reason = "Consistently missing quarterly targets.",
                    ImprovementGoals = "Increase throughput by 20%.",
                    StartDate = DateTime.UtcNow.AddDays(-30),
                    EndDate = DateTime.UtcNow.AddDays(60),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System", UpdatedBy = "System", DeletedBy = string.Empty
                });
            }
        }

        context.Goals.AddRange(goals);
        context.PerformanceReviews.AddRange(reviews);
        context.PerformanceImprovementPlans.AddRange(pips);
        
        context.SaveChanges();
    }
}

