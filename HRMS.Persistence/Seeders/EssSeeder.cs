using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Notification;
using HRMS.Domain.Entities.Attendance;

namespace HRMS.Persistence.Seeders;

public static class EssSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.EmployeeEmergencyContacts.Any()) return;

        var employees = context.Employees.Take(20).ToList();
        if (!employees.Any()) return;

        var faker = new Faker();
        var relationships = new[] { "Spouse", "Parent", "Sibling", "Partner", "Child" };

        // 1. Seed Emergency Contacts for employees
        var contacts = new List<EmployeeEmergencyContact>();
        foreach (var emp in employees)
        {
            contacts.Add(new EmployeeEmergencyContact
            {
                Id = Guid.NewGuid(),
                TenantId = emp.TenantId,
                EmployeeId = emp.Id,
                Name = $"{faker.Name.FirstName()} {emp.LastName}",
                Relationship = faker.PickRandom(relationships),
                PhoneNumber = faker.Phone.PhoneNumber("+1 (555) ###-####"),
                Email = faker.Internet.Email(),
                Address = faker.Address.StreetAddress() + ", " + faker.Address.City(),
                IsPrimary = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            });

            // Second emergency contact
            contacts.Add(new EmployeeEmergencyContact
            {
                Id = Guid.NewGuid(),
                TenantId = emp.TenantId,
                EmployeeId = emp.Id,
                Name = $"{faker.Name.FullName()}",
                Relationship = faker.PickRandom(relationships),
                PhoneNumber = faker.Phone.PhoneNumber("+1 (555) ###-####"),
                Email = faker.Internet.Email(),
                Address = faker.Address.StreetAddress() + ", " + faker.Address.City(),
                IsPrimary = false,
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            });
        }
        context.EmployeeEmergencyContacts.AddRange(contacts);

        // 2. Seed Centralized HR Service Requests
        var hrRequests = new List<EmployeeHRRequest>();
        var categories = new[] { "HR", "Payroll", "Attendance", "Leave", "Benefits", "Assets", "Documents", "IT_Support" };
        var priorities = new[] { "Low", "Medium", "High", "Urgent" };

        var sampleSubjects = new Dictionary<string, string>
        {
            { "Payroll", "Inquiry regarding tax withholding calculation for August pay stub" },
            { "Benefits", "Request to add dependent to dental & vision insurance" },
            { "Assets", "Requesting external 4K monitor and USB-C ergonomic dock" },
            { "Documents", "Need official Bonafide Employment Letter for bank mortgage" },
            { "Attendance", "Missed clock-out punch due to offsite client demonstration" },
            { "IT_Support", "Requesting GitHub Copilot enterprise seat license" }
        };

        var reqIdx = 1001;
        foreach (var emp in employees.Take(10))
        {
            var cat = faker.PickRandom(categories);
            var subject = sampleSubjects.ContainsKey(cat) ? sampleSubjects[cat] : $"General request regarding {cat} policies";
            var req = new EmployeeHRRequest
            {
                Id = Guid.NewGuid(),
                TenantId = emp.TenantId,
                EmployeeId = emp.Id,
                RequestNumber = $"HR-REQ-2026-{reqIdx++}",
                Category = cat,
                Subject = subject,
                Description = $"{subject}. Please let me know the standard processing timeline and next steps.",
                Priority = faker.PickRandom(priorities),
                Status = faker.PickRandom(new[] { "Submitted", "InProgress", "Resolved" }),
                AssignedTo = "HR People Operations",
                DueDate = DateTime.UtcNow.AddDays(4),
                CreatedAt = DateTime.UtcNow.AddDays(-faker.Random.Int(1, 14))
            };

            // Add comments
            req.Comments.Add(new EmployeeHRRequestComment
            {
                Id = Guid.NewGuid(),
                TenantId = emp.TenantId,
                EmployeeHRRequestId = req.Id,
                AuthorName = $"{emp.FirstName} {emp.LastName}",
                AuthorRole = "Employee",
                Message = req.Description,
                CreatedAt = req.CreatedAt
            });

            if (req.Status != "Submitted")
            {
                req.Comments.Add(new EmployeeHRRequestComment
                {
                    Id = Guid.NewGuid(),
                    TenantId = emp.TenantId,
                    EmployeeHRRequestId = req.Id,
                    AuthorName = "Jennifer Miller",
                    AuthorRole = "HR Administrator",
                    Message = "Thank you for reaching out. We have received your request and assigned it to the respective team specialist.",
                    CreatedAt = req.CreatedAt.AddHours(3)
                });
            }

            hrRequests.Add(req);
        }
        context.EmployeeHRRequests.AddRange(hrRequests);

        // 3. Seed Profile Change Requests
        var profileRequests = new List<EmployeeProfileChangeRequest>();
        foreach (var emp in employees.Take(5))
        {
            profileRequests.Add(new EmployeeProfileChangeRequest
            {
                Id = Guid.NewGuid(),
                TenantId = emp.TenantId,
                EmployeeId = emp.Id,
                FieldName = "Personal Legal Name / Marital Status",
                CurrentValue = $"{emp.FirstName} {emp.LastName} (Single)",
                ProposedValue = $"{emp.FirstName} {emp.LastName} (Married)",
                Reason = "Recent civil marriage ceremony. Marriage certificate available upon request.",
                Status = "Submitted",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            });
        }
        context.EmployeeProfileChangeRequests.AddRange(profileRequests);

        // 4. Seed Announcements if none
        if (!context.Announcements.Any())
        {
            context.Announcements.AddRange(new List<Announcement>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Open Enrollment Period for 2026-2027 Benefit Plans",
                    Message = "All full-time personnel may review, upgrade, or add dependents to healthcare, dental, vision, and wellness plans through the ESS Benefits portal until October 15.",
                    TargetAudience = "Company",
                    IsPinned = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Annual Enterprise All-Hands & Product Roadmap Townhall",
                    Message = "Join our executive leadership team this Thursday at 10:00 AM EST for our quarterly company performance update and Q4 strategic priorities.",
                    TargetAudience = "Company",
                    IsPinned = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Labor Day Holiday Observance Notice",
                    Message = "Please note that all corporate offices will be closed on the upcoming public holiday. Emergency IT operations remain on on-call rotation.",
                    TargetAudience = "Company",
                    IsPinned = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-7)
                }
            });
        }

        // 5. Ensure Holidays are seeded for 2026
        if (!context.Holidays.Any())
        {
            context.Holidays.AddRange(new List<Holiday>
            {
                new() { Id = Guid.NewGuid(), Name = "Labor Day", Date = new DateTime(2026, 9, 7), HolidayType = "Company", Description = "National Public Holiday" },
                new() { Id = Guid.NewGuid(), Name = "Columbus Day / Indigenous Peoples Day", Date = new DateTime(2026, 10, 12), HolidayType = "Company", Description = "Public Observance" },
                new() { Id = Guid.NewGuid(), Name = "Veterans Day", Date = new DateTime(2026, 11, 11), HolidayType = "National", Description = "Federal Holiday" },
                new() { Id = Guid.NewGuid(), Name = "Thanksgiving Day", Date = new DateTime(2026, 11, 26), HolidayType = "Company", Description = "Thanksgiving Holiday" },
                new() { Id = Guid.NewGuid(), Name = "Day After Thanksgiving", Date = new DateTime(2026, 11, 27), HolidayType = "Company", Description = "Corporate Extended Holiday" },
                new() { Id = Guid.NewGuid(), Name = "Christmas Day", Date = new DateTime(2026, 12, 25), HolidayType = "Company", Description = "Christmas Holiday Observance" }
            });
        }

        context.SaveChanges();
    }
}
