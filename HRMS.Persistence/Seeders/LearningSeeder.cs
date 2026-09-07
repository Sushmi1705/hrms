using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using HRMS.Domain.Entities.Learning;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Persistence.Seeders;

public static class LearningSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.Courses.Any()) return;

        var employees = context.Employees.ToList();
        if (!employees.Any()) return;

        var categories = new[] { "Technical", "Soft Skills", "Leadership", "Compliance", "Security", "HR", "Finance", "Sales" };
        var difficulties = new[] { "Beginner", "Intermediate", "Advanced" };
        var statuses = new[] { "Not Started", "In Progress", "Completed" };

        // Generate 100 Courses
        var courseFaker = new Faker<Course>()
            .RuleFor(c => c.Id, f => Guid.NewGuid())
            .RuleFor(c => c.Title, f => f.Company.CatchPhrase())
            .RuleFor(c => c.Description, f => f.Lorem.Paragraph())
            .RuleFor(c => c.DurationMinutes, f => f.Random.Int(30, 600))
            .RuleFor(c => c.Difficulty, f => f.PickRandom(difficulties))
            .RuleFor(c => c.Language, f => "English")
            .RuleFor(c => c.ThumbnailUrl, f => f.Image.PicsumUrl())
            .RuleFor(c => c.PublishStatus, f => "Published")
            .RuleFor(c => c.Category, f => f.PickRandom(categories))
            .RuleFor(c => c.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(c => c.CreatedBy, f => "System")
            .RuleFor(c => c.UpdatedBy, f => "System")
            .RuleFor(c => c.DeletedBy, f => string.Empty);

        var courses = courseFaker.Generate(100);
        context.Courses.AddRange(courses);
        context.SaveChanges();

        // Generate 25 Trainers
        var trainerFaker = new Faker<Trainer>()
            .RuleFor(t => t.Id, f => Guid.NewGuid())
            .RuleFor(t => t.Type, f => f.PickRandom(new[] { "Internal", "External" }))
            .RuleFor(t => t.Name, f => f.Name.FullName())
            .RuleFor(t => t.Skills, f => string.Join(", ", f.Lorem.Words(3)))
            .RuleFor(t => t.Rating, f => f.Random.Decimal(3.0m, 5.0m))
            .RuleFor(t => t.CreatedAt, f => DateTime.UtcNow)
            .RuleFor(t => t.CreatedBy, f => "System")
            .RuleFor(t => t.UpdatedBy, f => "System")
            .RuleFor(t => t.DeletedBy, f => string.Empty);

        var trainers = trainerFaker.Generate(25);
        context.Trainers.AddRange(trainers);

        // Generate 1000 Course Enrollments (Assignments)
        var assignments = new List<CourseAssignment>();
        var random = new Random();

        for (int i = 0; i < 1000; i++)
        {
            var emp = employees[random.Next(employees.Count)];
            var course = courses[random.Next(courses.Count)];
            var status = statuses[random.Next(statuses.Length)];
            
            assignments.Add(new CourseAssignment
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                CourseId = course.Id,
                Status = status,
                ProgressPercentage = status == "Completed" ? 100 : (status == "In Progress" ? random.Next(1, 99) : 0),
                Score = status == "Completed" ? random.Next(60, 100) : null,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            });
        }
        context.CourseAssignments.AddRange(assignments);
        context.SaveChanges();
    }
}
