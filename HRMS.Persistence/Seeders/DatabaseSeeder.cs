using Bogus;
using HRMS.Domain.Entities.Attendance;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRMS.Persistence.Seeders;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseSeeder");
        var passwordHasher = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.IPasswordHasher<HRMS.Domain.Entities.Auth.User>>();

        try
        {
            logger.LogInformation("Checking database seed status...");
            
            // Seed Multi-Tenant SaaS Data
            await MultiTenantSeeder.SeedMultiTenantDataAsync(context, passwordHasher);
            logger.LogInformation("Multi-Tenant SaaS Data Generated/Verified Successfully!");

            if (await context.Employees.AnyAsync())
            {
                logger.LogInformation("Database already seeded. Skipping massive generation.");
                
                // Sanitize any existing e-commerce department names to proper HR departments
                var existingDepts = await context.Departments.ToListAsync();
                var invalidKeywords = new[] { "Automotive", "Clothing", "Books", "Beauty", "Garden", "Jewelry", "Kids", "Tools", "Sports", "Toys", "Shoes", "Grocery", "Health", "Home", "Music", "Electronics", "Computers", "Games", "Movies", "Industrial", "Outdoors" };
                var cleanDeptNames = new[] { "Engineering", "Human Resources", "Product Management", "Finance & Accounting", "Sales & Marketing", "Customer Success", "Operations", "Information Technology", "Legal & Compliance", "Research & Development", "Quality Assurance", "Administration" };
                int cIdx = 0;
                bool deptsUpdated = false;
                foreach (var dept in existingDepts)
                {
                    if (invalidKeywords.Any(k => dept.Name.Contains(k, StringComparison.OrdinalIgnoreCase)))
                    {
                        dept.Name = cleanDeptNames[cIdx % cleanDeptNames.Length];
                        deptsUpdated = true;
                    }
                    cIdx++;
                }
                if (deptsUpdated)
                {
                    await context.SaveChangesAsync();
                    logger.LogInformation("Sanitized invalid e-commerce department names to proper HR departments.");
                }

                // Seed Leave Data if not already present
                await LeaveSeeder.SeedLeaveDataAsync(context);
                logger.LogInformation("Leave Data successfully verified/seeded for existing database.");

                AssetSeeder.Seed(context);
                CompensationSeeder.Seed(context);
                EssSeeder.Seed(context);
                await TravelSeeder.SeedAsync(context);
                PayrollSeeder.Seed(context);
                logger.LogInformation("ESS, Asset, Compensation, Travel and Payroll Data successfully verified/seeded for existing database.");
                
                return;
            }

            logger.LogInformation("Starting Perfect Relational Data Generation...");

            // Ensure Randomizer uses a constant seed for deterministic output during dev
            Randomizer.Seed = new Random(8675309);

            // 1. Seed Company
            var company = new Company
            {
                Id = Guid.NewGuid(),
                Code = "COMP-001",
                Name = "Acme Enterprise Corp",
                Description = "Global Enterprise Solutions",
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow,
                UpdatedBy = "System",
                DeletedBy = string.Empty
            };
            await context.Companies.AddAsync(company);
            await context.SaveChangesAsync();

            // 2. Seed Business Units
            var realBusinessUnitNames = new[] { "Enterprise Technology Division", "Corporate Operations Division", "Global Growth & Products Division" };
            var buIndex = 0;
            var buFaker = new Faker<BusinessUnit>()
                .RuleFor(b => b.Id, f => Guid.NewGuid())
                .RuleFor(b => b.CompanyId, f => company.Id)
                .RuleFor(b => b.Code, f => f.Commerce.Ean8())
                .RuleFor(b => b.Name, f => realBusinessUnitNames[buIndex++ % realBusinessUnitNames.Length])
                .RuleFor(b => b.CreatedBy, f => "System")
                .RuleFor(b => b.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(b => b.UpdatedBy, f => "System")
                .RuleFor(b => b.DeletedBy, f => string.Empty);
            
            var businessUnits = buFaker.Generate(2);
            await context.BusinessUnits.AddRangeAsync(businessUnits);
            await context.SaveChangesAsync();

            // 3. Seed Branches (5)
            var branchFaker = new Faker<Branch>()
                .RuleFor(b => b.Id, f => Guid.NewGuid())
                .RuleFor(b => b.BusinessUnitId, f => f.PickRandom(businessUnits).Id)
                .RuleFor(b => b.Code, f => "BR-" + f.Random.Number(100, 999))
                .RuleFor(b => b.Name, f => f.Address.City() + " Branch")
                .RuleFor(b => b.CreatedBy, f => "System")
                .RuleFor(b => b.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(b => b.UpdatedBy, f => "System")
                .RuleFor(b => b.DeletedBy, f => string.Empty);
            
            var branches = branchFaker.Generate(5);
            await context.Branches.AddRangeAsync(branches);
            await context.SaveChangesAsync();

            // 4. Seed Departments (12)
            var realHrDeptNames = new[]
            {
                "Engineering",
                "Human Resources",
                "Product Management",
                "Finance & Accounting",
                "Sales & Marketing",
                "Customer Success",
                "Operations",
                "Information Technology",
                "Legal & Compliance",
                "Research & Development",
                "Quality Assurance",
                "Administration"
            };
            var deptIndex = 0;
            var deptFaker = new Faker<Department>()
                .RuleFor(d => d.Id, f => Guid.NewGuid())
                .RuleFor(d => d.BranchId, f => f.PickRandom(branches).Id)
                .RuleFor(d => d.Code, f => "DEP-" + f.Random.Number(100, 999))
                .RuleFor(d => d.Name, f => realHrDeptNames[deptIndex++ % realHrDeptNames.Length])
                .RuleFor(d => d.CreatedBy, f => "System")
                .RuleFor(d => d.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(d => d.UpdatedBy, f => "System")
                .RuleFor(d => d.DeletedBy, f => string.Empty);

            var departments = deptFaker.Generate(12);
            await context.Departments.AddRangeAsync(departments);
            await context.SaveChangesAsync();

            // 5. Seed Designations (25)
            var jobTitles = new[] { "Software Engineer", "Senior Developer", "HR Manager", "Sales Executive", "QA Analyst", "Product Manager", "DevOps Engineer", "Marketing Specialist", "Customer Support Rep", "Data Scientist", "UI/UX Designer", "Scrum Master", "Project Manager", "Financial Analyst", "Operations Manager" };
            var desigFaker = new Faker<Designation>()
                .RuleFor(d => d.Id, f => Guid.NewGuid())
                .RuleFor(d => d.DepartmentId, f => f.PickRandom(departments).Id)
                .RuleFor(d => d.Code, f => "DSG-" + f.Random.Number(100, 999))
                .RuleFor(d => d.Name, f => f.PickRandom(jobTitles) + " " + f.Random.Word())
                .RuleFor(d => d.CreatedBy, f => "System")
                .RuleFor(d => d.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(d => d.UpdatedBy, f => "System")
                .RuleFor(d => d.DeletedBy, f => string.Empty);
            
            var designations = desigFaker.Generate(25);
            await context.Designations.AddRangeAsync(designations);
            await context.SaveChangesAsync();

            // 6. Seed Shifts
            var shifts = new List<Shift>
            {
                new Shift { Id = Guid.NewGuid(), Name = "Morning Shift", StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(17, 0, 0), Code = "MORN", CreatedBy = "System", CreatedAt = DateTime.UtcNow, UpdatedBy = "System", DeletedBy = string.Empty },
                new Shift { Id = Guid.NewGuid(), Name = "Night Shift", StartTime = new TimeSpan(21, 0, 0), EndTime = new TimeSpan(5, 0, 0), Code = "NIGHT", CreatedBy = "System", CreatedAt = DateTime.UtcNow, UpdatedBy = "System", DeletedBy = string.Empty },
                new Shift { Id = Guid.NewGuid(), Name = "General Shift", StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(19, 0, 0), Code = "GEN", CreatedBy = "System", CreatedAt = DateTime.UtcNow, UpdatedBy = "System", DeletedBy = string.Empty }
            };
            await context.Shifts.AddRangeAsync(shifts);
            await context.SaveChangesAsync();

            // 7. Seed Employees (200)
            var employeeFaker = new Faker<EmployeeEntity>()
                .RuleFor(e => e.Id, f => Guid.NewGuid())
                .RuleFor(e => e.FirstName, f => f.Name.FirstName())
                .RuleFor(e => e.LastName, f => f.Name.LastName())
                .RuleFor(e => e.Email, (f, e) => f.Internet.Email(e.FirstName, e.LastName))
                .RuleFor(e => e.EmployeeNumber, f => f.Random.Replace("EMP-####"))
                .RuleFor(e => e.DepartmentId, f => f.PickRandom(departments).Id)
                .RuleFor(e => e.DesignationId, f => f.PickRandom(designations).Id)
                .RuleFor(e => e.BranchId, f => f.PickRandom(branches).Id)
                .RuleFor(e => e.JoiningDate, f => f.Date.Past(3))
                .RuleFor(e => e.Status, f => "Active")
                .RuleFor(e => e.CreatedBy, f => "System")
                .RuleFor(e => e.CreatedAt, f => DateTime.UtcNow)
                .RuleFor(e => e.UpdatedBy, f => "System")
                .RuleFor(e => e.DeletedBy, f => string.Empty);

            var employees = employeeFaker.Generate(200);
            var managers = employees.Take(15).ToList();
            var f = new Faker();
            foreach(var emp in employees.Skip(15))
            {
                emp.ManagerId = f.PickRandom(managers).Id;
            }
            await context.Employees.AddRangeAsync(employees);
            await context.SaveChangesAsync();
            logger.LogInformation($"Seeded 200 Employees perfectly related to Organization Entities.");

            // 8. Seed Attendance History (Last 180 Days)
            var attendanceLogs = GenerateAttendanceLogs(employees, shifts, daysBack: 180);
            // Batch insert for performance
            int batchSize = 5000;
            for (int i = 0; i < attendanceLogs.Count; i += batchSize)
            {
                var batch = attendanceLogs.Skip(i).Take(batchSize).ToList();
                await context.AttendanceLogs.AddRangeAsync(batch);
                await context.SaveChangesAsync();
                logger.LogInformation($"Inserted {i + batch.Count} / {attendanceLogs.Count} Attendance Logs.");
            }

            
            // 9. Seed Attendance Approvals
            var approvals = GenerateApprovals(employees);
            await context.AttendanceApprovals.AddRangeAsync(approvals);
            await context.SaveChangesAsync();
            logger.LogInformation("Seeded {approvals.Count} Attendance Approvals.");
            
            // 10. Seed Shift & Roster Module
            ShiftSeeder.Seed(context);
            logger.LogInformation("Shift and Roster Data Generated Successfully!");
            
            await LeaveSeeder.SeedLeaveDataAsync(context);
            logger.LogInformation("Leave Data Generated Successfully!");
            
            // 11. Seed Performance Management Module
            PerformanceSeeder.Seed(context);
            RecruitmentSeeder.Seed(context);
            await OnboardingSeeder.SeedAsync(context);
            LearningSeeder.Seed(context);
            logger.LogInformation("Performance Data Generated Successfully!");
            
            // 12. Seed Enterprise Payroll Module
            PayrollSeeder.Seed(context);
            logger.LogInformation("Enterprise Payroll Data Generated Successfully!");
            
            // 13. Seed Enterprise ATS/Recruitment Module
            RecruitmentSeeder.Seed(context);
            logger.LogInformation("Enterprise Recruitment & ATS Data Generated Successfully!");
            new WorkflowSeeder(context).Seed();
            logger.LogInformation("Enterprise Workflow Data Generated Successfully!");
            new NotificationSeeder(context).Seed();
            logger.LogInformation("Enterprise Notification Data Generated Successfully!");
            AuditSeeder.Seed(context);
            logger.LogInformation("Enterprise Audit Logs Data Generated Successfully!");
            new SystemAdminSeeder(context).Seed();
            logger.LogInformation("Enterprise System Administration Data Generated Successfully!");
            AssetSeeder.Seed(context);
            logger.LogInformation("Enterprise Asset Management Data Generated Successfully!");
            CompensationSeeder.Seed(context);
            logger.LogInformation("Enterprise Benefits & Compensation Data Generated Successfully!");
            EssSeeder.Seed(context);
            logger.LogInformation("Enterprise Employee Self-Service (ESS) Data Generated Successfully!");
            await TravelSeeder.SeedAsync(context);
            logger.LogInformation("Enterprise Travel & Expense Data Generated Successfully!");
            logger.LogInformation("Perfect Relational Data Generation Completed Successfully!");

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private static List<AttendanceLog> GenerateAttendanceLogs(List<EmployeeEntity> employees, List<Shift> shifts, int daysBack)
    {
        var logs = new List<AttendanceLog>();
        var endDate = DateTime.UtcNow.Date; // Generate up to exactly Today
        var startDate = endDate.AddDays(-daysBack);

        var faker = new Faker();

        foreach (var employee in employees)
        {
            // Assign a random standard shift to the employee
            var assignedShift = faker.PickRandom(shifts);
            
            // Employee behavioral profile
            var isAlwaysLate = faker.Random.Bool(0.1f);
            var isPerfect = faker.Random.Bool(0.2f);

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                // Skip weekends mostly
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                {
                    if (faker.Random.Bool(0.02f)) // 2% chance of weekend work
                    {
                        logs.Add(GenerateLog(employee.Id, assignedShift, date, faker, false, false));
                    }
                    continue;
                }

                // Random absence (3% chance)
                if (faker.Random.Bool(0.03f))
                {
                    logs.Add(new AttendanceLog
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = employee.Id,
                        ShiftId = assignedShift.Id,
                        Date = date,
                        Status = "Absent",
                        CreatedBy = "System",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedBy = "System",
                        DeletedBy = string.Empty
                    });
                    continue;
                }

                logs.Add(GenerateLog(employee.Id, assignedShift, date, faker, isAlwaysLate, isPerfect));
            }
        }

        return logs;
    }

    private static AttendanceLog GenerateLog(Guid employeeId, Shift shift, DateTime date, Faker faker, bool isAlwaysLate, bool isPerfect)
    {
        var log = new AttendanceLog
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            ShiftId = shift.Id,
            Date = date,
            Status = "Present",
            ClockInLocation = faker.Address.City(),
            ClockOutLocation = faker.Address.City(),
            IsLate = false,
            IsEarlyOut = false,
            IsMissingPunch = false,
            CreatedBy = "System",
            CreatedAt = DateTime.UtcNow,
            UpdatedBy = "System",
            DeletedBy = string.Empty
        };

        // CheckIn Time
        var expectedIn = date.Add(shift.StartTime);
        if (isPerfect)
        {
            log.ClockInTime = expectedIn.AddMinutes(faker.Random.Int(-15, 0));
        }
        else if (isAlwaysLate || faker.Random.Bool(0.2f))
        {
            log.ClockInTime = expectedIn.AddMinutes(faker.Random.Int(10, 120)); // Late
            log.IsLate = true;
        }
        else
        {
            log.ClockInTime = expectedIn.AddMinutes(faker.Random.Int(-15, 5));
        }

        // CheckOut Time (Unless missing punch)
        if (faker.Random.Bool(0.02f))
        {
            // Missing Out Punch
            log.ClockOutTime = null;
            log.IsMissingPunch = true;
        }
        else
        {
            var expectedOut = date.Add(shift.EndTime);
            if (faker.Random.Bool(0.1f))
            {
                log.ClockOutTime = expectedOut.AddMinutes(faker.Random.Int(60, 180)); // Overtime
            }
            else if (faker.Random.Bool(0.05f))
            {
                log.ClockOutTime = expectedOut.AddMinutes(faker.Random.Int(-120, -10)); // Early checkout
                log.IsEarlyOut = true;
            }
            else
            {
                log.ClockOutTime = expectedOut.AddMinutes(faker.Random.Int(0, 30));
            }
        }

        // Calculate hours if both exist
        if (log.ClockInTime.HasValue && log.ClockOutTime.HasValue)
        {
            log.TotalWorkingHours = (decimal)(log.ClockOutTime.Value - log.ClockInTime.Value).TotalHours - 1m; // 1 hour break
            if (log.TotalWorkingHours < 0) log.TotalWorkingHours = 0;
            
            if (log.TotalWorkingHours < 4)
            {
                log.Status = "Half Day";
            }
        }

        return log;
    }

    private static List<AttendanceApproval> GenerateApprovals(List<EmployeeEntity> employees)
    {
        var approvals = new List<AttendanceApproval>();
        var faker = new Faker();
        var types = new[] { "Regularization", "Overtime", "Leave", "Permission" };

        foreach (var employee in employees)
        {
            // Only generate approvals for ~30% of employees
            if (faker.Random.Bool(0.3f))
            {
                var numApprovals = faker.Random.Int(1, 4);
                for (int i = 0; i < numApprovals; i++)
                {
                    approvals.Add(new AttendanceApproval
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = employee.Id,
                        Type = faker.PickRandom(types),
                        Date = faker.Date.Recent(30),
                        Reason = faker.Lorem.Sentence(),
                        Status = "Pending",
                        RequestedCheckIn = new TimeSpan(9, 0, 0),
                        RequestedCheckOut = new TimeSpan(18, 0, 0),
                        CreatedBy = "System",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedBy = "System",
                        DeletedBy = string.Empty
                    });
                }
            }
        }
        return approvals;
    }
}




