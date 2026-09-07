using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using HRMS.Domain.Entities.Recruitment;
using Microsoft.Extensions.DependencyInjection;

namespace HRMS.Persistence.Seeders;

public static class RecruitmentSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.Candidates.Any()) return;

        var faker = new Faker();
        var departments = context.Departments.ToList();
        var managers = context.Employees.Take(10).ToList();

        if (!departments.Any() || !managers.Any()) return;

        // 1. Seed Requisitions & Openings (100)
        var requisitions = new List<JobRequisition>();
        var openings = new List<JobOpening>();
        
        var titles = new[] { "Senior Backend Engineer", "Frontend Developer", "Product Manager", "HR Specialist", "Sales Executive", "DevOps Engineer", "Marketing Lead", "Data Scientist" };

        for (int i = 0; i < 100; i++)
        {
            var req = new JobRequisition
            {
                Id = Guid.NewGuid(),
                JobTitle = faker.PickRandom(titles),
                DepartmentId = faker.PickRandom(departments).Id,
                HiringManagerId = faker.PickRandom(managers).Id,
                EmploymentType = "Full-time",
                ReasonForHire = "Expansion",
                Budget = faker.Random.Decimal(60000, 150000),
                Status = "Approved"
            };
            requisitions.Add(req);

            var open = new JobOpening
            {
                Id = Guid.NewGuid(),
                RequisitionId = req.Id,
                Title = req.JobTitle,
                WorkplaceType = faker.PickRandom(new[] { "Remote", "Hybrid", "Office" }),
                Vacancies = faker.Random.Int(1, 5),
                SalaryMin = req.Budget * 0.8m,
                SalaryMax = req.Budget * 1.2m,
                ExpiryDate = DateTime.UtcNow.AddDays(faker.Random.Int(30, 90)),
                Status = faker.PickRandom(new[] { "Published", "Published", "Published", "Draft", "Closed" })
            };
            openings.Add(open);
        }
        context.JobRequisitions.AddRange(requisitions);
        context.JobOpenings.AddRange(openings);
        context.SaveChanges();

        // 2. Seed Candidates (500)
        var candidates = new List<Candidate>();
        for (int i = 0; i < 500; i++)
        {
            candidates.Add(new Candidate
            {
                Id = Guid.NewGuid(),
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                Email = faker.Internet.Email(),
                Phone = faker.Phone.PhoneNumber(),
                Experience = $"{faker.Random.Int(1, 15)} Years",
                Education = "Bachelor's Degree",
                ExpectedSalary = faker.Random.Decimal(60000, 180000),
                NoticePeriodDays = faker.PickRandom(new[] { 15, 30, 60, 90 })
            });
        }
        context.Candidates.AddRange(candidates);
        context.SaveChanges();

        // 3. Seed Applications (1000)
        var applications = new List<JobApplication>();
        var activeOpenings = openings.Where(o => o.Status == "Published").ToList();
        var stages = new[] { "Applied", "Screening", "Technical", "HR", "Manager", "Offered", "Hired", "Rejected" };

        for (int i = 0; i < 1000; i++)
        {
            var app = new JobApplication
            {
                Id = Guid.NewGuid(),
                JobOpeningId = faker.PickRandom(activeOpenings).Id,
                CandidateId = faker.PickRandom(candidates).Id,
                PipelineStage = faker.PickRandom(stages),
                ApplicationDate = DateTime.UtcNow.AddDays(-faker.Random.Int(1, 60)),
                Rating = faker.Random.Decimal(2.0m, 5.0m)
            };
            applications.Add(app);
        }
        context.JobApplications.AddRange(applications);
        context.SaveChanges();
    }
}
