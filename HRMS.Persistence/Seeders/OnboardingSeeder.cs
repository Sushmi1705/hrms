using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Onboarding;
using HRMS.Domain.Entities.Offboarding;

namespace HRMS.Persistence.Seeders;

public class OnboardingSeeder
{
    public static async Task SeedAsync(HrmsDbContext context)
    {
        if (!context.OnboardingTasks.Any())
        {
            // Dummy Employee ID to use for all relations to avoid complex lookups in seeder
            var defaultEmployeeId = Guid.NewGuid();
            var hrManagerId = Guid.NewGuid();
            
            var tasks = new List<OnboardingTask>();
            var docs = new List<EmployeeDocument>();
            var bgvs = new List<BackgroundVerification>();
            var resignations = new List<Resignation>();
            var clearances = new List<ExitClearance>();

            // Generate 200 Tasks
            for(int i = 1; i <= 200; i++)
            {
                tasks.Add(new OnboardingTask
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = defaultEmployeeId,
                    TaskName = $"Setup Workstation for Hire #{i}",
                    Category = i % 2 == 0 ? "IT" : "HR",
                    AssignedToId = hrManagerId,
                    DueDate = DateTime.UtcNow.AddDays(7),
                    Status = i % 3 == 0 ? "Completed" : "Pending"
                });

                docs.Add(new EmployeeDocument
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = defaultEmployeeId,
                    DocumentType = i % 2 == 0 ? "Passport" : "NDA",
                    FileUrl = $"/docs/emp_{i}.pdf",
                    UploadedAt = DateTime.UtcNow.AddDays(-2),
                    Status = i % 4 == 0 ? "Approved" : "Pending"
                });

                if(i <= 50)
                {
                    bgvs.Add(new BackgroundVerification
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = defaultEmployeeId,
                        VerificationType = "Police Clearance",
                        VendorName = "Checkr",
                        InitiatedAt = DateTime.UtcNow.AddDays(-10),
                        Status = i % 2 == 0 ? "Cleared" : "InProgress"
                    });
                }
            }

            // Generate 100 Resignations & Clearances
            for(int i = 1; i <= 100; i++)
            {
                resignations.Add(new Resignation
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = defaultEmployeeId,
                    SubmittedAt = DateTime.UtcNow.AddDays(-30),
                    ExpectedLastDay = DateTime.UtcNow.AddDays(15),
                    Reason = "Better Opportunity",
                    Status = i % 5 == 0 ? "Approved" : "Pending"
                });

                clearances.Add(new ExitClearance
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = defaultEmployeeId,
                    Department = i % 2 == 0 ? "IT" : "Finance",
                    ClearedById = hrManagerId,
                    Status = i % 3 == 0 ? "Cleared" : "Pending"
                });
            }

            await context.OnboardingTasks.AddRangeAsync(tasks);
            await context.EmployeeDocuments.AddRangeAsync(docs);
            await context.BackgroundVerifications.AddRangeAsync(bgvs);
            await context.Resignations.AddRangeAsync(resignations);
            await context.ExitClearances.AddRangeAsync(clearances);

            await context.SaveChangesAsync();
        }
    }
}
