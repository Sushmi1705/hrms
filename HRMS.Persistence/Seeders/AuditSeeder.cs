using Bogus;
using System.Linq;
using HRMS.Domain.Entities.Audit;
using HRMS.Persistence;

namespace HRMS.Persistence.Seeders;

public class AuditSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.AuditLogs.Any()) return;

        var faker = new Faker();
        
        var modules = new[] { "Employees", "Payroll", "Leave", "Attendance", "Recruitment", "Settings", "Workflow" };
        var actions = new[] { "Create", "Update", "Delete", "View", "Export", "Approve", "Reject" };
        var categories = new[] { "System", "Security", "Data", "Configuration" };
        var severities = new[] { "Info", "Warning", "Critical" };
        
        var methods = new[] { "GET", "POST", "PUT", "DELETE" };
        var endpoints = new[] { "/api/v1/employees", "/api/v1/payroll/process", "/api/v1/leave/requests", "/api/v1/auth/login" };

        var browsers = new[] { "Chrome 114.0", "Safari 16.5", "Edge 113.0", "Firefox 112.0" };
        var osList = new[] { "Windows 11", "macOS Ventura", "iOS 16.5", "Android 13" };
        var devices = new[] { "Desktop", "Mobile", "Tablet" };

        var companies = new[] { "Acme Corp", "Globex", "Initech" };
        var departments = new[] { "Engineering", "HR", "Sales", "Finance", "Marketing" };
        var roles = new[] { "Super Admin", "HR Manager", "Employee", "Finance Admin" };

        var logs = new List<AuditLog>();
        for (int i = 0; i < 5000; i++)
        {
            var isError = faker.Random.Bool(0.1f);
            var log = new AuditLog
            {
                Id = Guid.NewGuid(),
                TenantId = "tenant-1",
                UserId = Guid.NewGuid(),
                UserName = faker.Name.FullName(),
                EmployeeId = faker.Random.Replace("EMP-####"),
                Role = faker.PickRandom(roles),
                Company = faker.PickRandom(companies),
                Branch = faker.Address.City(),
                Department = faker.PickRandom(departments),
                Module = faker.PickRandom(modules),
                Entity = faker.PickRandom(modules),
                Action = faker.PickRandom(actions),
                Category = faker.PickRandom(categories),
                Severity = isError ? "Critical" : faker.PickRandom(severities),
                IpAddress = faker.Internet.Ip(),
                UserAgent = faker.Internet.UserAgent(),
                Browser = faker.PickRandom(browsers),
                OperatingSystem = faker.PickRandom(osList),
                Device = faker.PickRandom(devices),
                Endpoint = faker.PickRandom(endpoints),
                HttpMethod = faker.PickRandom(methods),
                Status = isError ? "Failed" : "Success",
                FailureReason = isError ? "Validation Failed" : string.Empty,
                StatusCode = isError ? 400 : 200,
                ExecutionTimeMs = faker.Random.Number(10, 1500),
                CorrelationId = Guid.NewGuid().ToString(),
                RequestId = Guid.NewGuid().ToString(),
                SessionId = Guid.NewGuid().ToString(),
                Environment = "Production",
                RequestPayload = isError ? "{ \"error\": \"invalid data\" }" : "{ \"id\": 1 }",
                ResponsePayload = "{ \"status\": \"ok\" }",
                Headers = "{ \"Authorization\": \"Bearer ***\" }",
                CreatedAt = faker.Date.Past(1),
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            };
            logs.Add(log);
        }
        context.AuditLogs.AddRange(logs);

        var changes = new List<AuditChange>();
        foreach (var log in logs.Where(l => l.Action == "Update").Take(3000))
        {
            changes.Add(new AuditChange
            {
                Id = Guid.NewGuid(),
                TenantId = "tenant-1",
                AuditLogId = log.Id,
                EntityName = log.Entity,
                PrimaryKey = Guid.NewGuid().ToString(),
                PropertyName = "Status",
                OldValue = "Pending",
                NewValue = "Approved",
                Reason = "Manager approved request via workflow",
                CreatedAt = log.CreatedAt,
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            });
        }
        context.AuditChanges.AddRange(changes);

        var logins = new List<AuditLogin>();
        var loginMethods = new[] { "Password", "Azure AD", "Google Workspace", "Okta SSO" };
        for (int i = 0; i < 2000; i++)
        {
            var isFailed = faker.Random.Bool(0.15f);
            logins.Add(new AuditLogin
            {
                Id = Guid.NewGuid(),
                TenantId = "tenant-1",
                UserId = Guid.NewGuid(),
                UserName = faker.Name.FullName(),
                EmployeeId = faker.Random.Replace("EMP-####"),
                Role = faker.PickRandom(roles),
                Company = faker.PickRandom(companies),
                Branch = faker.Address.City(),
                IpAddress = faker.Internet.Ip(),
                Country = faker.Address.Country(),
                State = faker.Address.State(),
                City = faker.Address.City(),
                Latitude = faker.Address.Latitude().ToString(),
                Longitude = faker.Address.Longitude().ToString(),
                ISP = faker.Company.CompanyName(),
                Browser = faker.PickRandom(browsers),
                OperatingSystem = faker.PickRandom(osList),
                Device = faker.PickRandom(devices),
                LoginMethod = faker.PickRandom(loginMethods),
                Status = isFailed ? "Failed" : "Success",
                LogoutTime = isFailed ? null : faker.Date.Past(1),
                SessionDurationSeconds = isFailed ? 0 : faker.Random.Number(300, 28800),
                CreatedAt = faker.Date.Past(1),
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            });
        }
        context.AuditLogins.AddRange(logins);

        var secEvents = new List<AuditSecurityEvent>();
        var secTypes = new[] { "Unauthorized Access", "Password Reset", "Privilege Escalation", "Account Locked", "Mass Export Attempt" };
        for (int i = 0; i < 200; i++)
        {
            secEvents.Add(new AuditSecurityEvent
            {
                Id = Guid.NewGuid(),
                TenantId = "tenant-1",
                UserId = Guid.NewGuid(),
                EventType = faker.PickRandom(secTypes),
                Description = "System detected anomalous activity pattern.",
                IncidentDetails = "User attempted to access restricted /api/v1/payroll/export endpoint 15 times within 60 seconds.",
                IpAddress = faker.Internet.Ip(),
                Severity = faker.PickRandom(new[] { "High", "Critical" }),
                AssignedTo = "Security Team",
                ResolutionNotes = "",
                Status = "Open",
                CreatedAt = faker.Date.Past(1),
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            });
        }
        context.AuditSecurityEvents.AddRange(secEvents);
        
        var settings = new AuditSetting 
        { 
            Id = Guid.NewGuid(), 
            TenantId = "tenant-1", 
            SystemLogRetentionDays = 180,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System",
            UpdatedBy = "System",
            DeletedBy = string.Empty
        };
        context.AuditSettings.Add(settings);

        context.SaveChanges();
    }
}
