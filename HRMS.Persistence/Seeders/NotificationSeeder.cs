using Bogus;
using HRMS.Domain.Entities.Notification;

namespace HRMS.Persistence.Seeders;

public class NotificationSeeder
{
    private readonly HrmsDbContext _context;

    public NotificationSeeder(HrmsDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        if (_context.Notifications.Any()) return;

        var employees = _context.Employees.Select(e => e.Id).Take(100).ToList();
        if (!employees.Any()) return;

        // Announcements
        var announcements = new Faker<Announcement>()
            .RuleFor(x => x.Title, f => f.Lorem.Sentence(4))
            .RuleFor(x => x.Message, f => f.Lorem.Paragraph())
            .RuleFor(x => x.TargetAudience, f => f.PickRandom(new[] { "Company-Wide", "Engineering", "HR", "All Users" }))
            .RuleFor(x => x.IsPinned, f => f.Random.Bool(0.1f))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.DeletedBy, f => string.Empty)
            .Generate(50);
        _context.Announcements.AddRange(announcements);

        // Notifications
        var faker = new Faker<Notification>()
            .RuleFor(x => x.UserId, f => f.PickRandom(employees))
            .RuleFor(x => x.Title, f => f.Lorem.Sentence(3))
            .RuleFor(x => x.Message, f => f.Lorem.Sentence(10))
            .RuleFor(x => x.Type, f => f.PickRandom(new[] { "Information", "Success", "Warning", "Error", "Approval" }))
            .RuleFor(x => x.Module, f => f.PickRandom(new[] { "Leave", "Payroll", "Recruitment", "Performance", "System" }))
            .RuleFor(x => x.IsRead, f => f.Random.Bool(0.7f))
            .RuleFor(x => x.IsStarred, f => f.Random.Bool(0.1f))
            .RuleFor(x => x.IsArchived, f => f.Random.Bool(0.2f))
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(60))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.DeletedBy, f => string.Empty);
        
        var notifs = faker.Generate(5000); // 5000 records
        _context.Notifications.AddRange(notifs);

        // Delivery Logs
        var logFaker = new Faker<DeliveryLog>()
            .RuleFor(x => x.NotificationQueueId, f => Guid.NewGuid())
            .RuleFor(x => x.Channel, f => f.PickRandom(new[] { "Email", "SMS", "Push", "InApp" }))
            .RuleFor(x => x.Recipient, f => f.Internet.Email())
            .RuleFor(x => x.Status, f => f.PickRandom(new[] { "Delivered", "Failed", "Delivered", "Delivered" })) // 75% success
            .RuleFor(x => x.CreatedAt, f => f.Date.Recent(60))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.DeletedBy, f => string.Empty);

        _context.DeliveryLogs.AddRange(logFaker.Generate(1000));
        
        // Queues
        var queueFaker = new Faker<NotificationQueue>()
            .RuleFor(x => x.UserId, f => f.PickRandom(employees))
            .RuleFor(x => x.Channel, f => f.PickRandom(new[] { "Email", "SMS" }))
            .RuleFor(x => x.Payload, f => "{}")
            .RuleFor(x => x.Status, f => f.PickRandom(new[] { "Queued", "Processing" }))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.DeletedBy, f => string.Empty);

        _context.NotificationQueues.AddRange(queueFaker.Generate(150));
        
        // Notification Templates
        var templateFaker = new Faker<NotificationTemplate>()
            .RuleFor(x => x.Name, f => f.Commerce.ProductName() + " Template")
            .RuleFor(x => x.Category, f => f.PickRandom(new[] { "Approval", "Payroll", "Leave", "Onboarding" }))
            .RuleFor(x => x.Variables, f => "{ \"var\": \"value\" }")
            .RuleFor(x => x.IsActive, f => f.Random.Bool(0.9f))
            .RuleFor(x => x.CreatedBy, f => "System")
            .RuleFor(x => x.UpdatedBy, f => "System")
            .RuleFor(x => x.DeletedBy, f => string.Empty);

        _context.NotificationTemplates.AddRange(templateFaker.Generate(50));

        _context.SaveChanges();
        Console.WriteLine("Redesigned Enterprise Notification Data Generated Successfully!");
    }
}
