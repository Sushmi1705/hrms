using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using HRMS.Domain.Entities.Auth;

namespace HRMS.Persistence.Seeders;

public class SystemAdminSeeder
{
    private readonly HrmsDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public SystemAdminSeeder(HrmsDbContext context)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
    }

    public void Seed()
    {
        if (_context.AppPermissions.Any() && _context.Users.Count() >= 50)
        {
            return; // Already seeded
        }

        // ==========================================
        // 1. SEED 160+ GRANULAR PERMISSIONS
        // ==========================================
        var modules = new Dictionary<string, (string feature, string[] actions)>
        {
            { "Employees", ("Directory", new[] { "View", "Create", "Edit", "Delete", "Export", "Import", "Manage" }) },
            { "Attendance", ("TimeTracking", new[] { "View", "Create", "Edit", "Delete", "Approve", "Reject", "Export", "Configure" }) },
            { "Leave", ("LeaveRequests", new[] { "View", "Create", "Edit", "Delete", "Approve", "Reject", "Export", "Configure" }) },
            { "Shift", ("Roster", new[] { "View", "Create", "Edit", "Delete", "Approve", "Export", "Configure" }) },
            { "Payroll", ("Compensation", new[] { "View", "Create", "Edit", "Delete", "Approve", "Reject", "Export", "Configure", "Manage" }) },
            { "Performance", ("Appraisals", new[] { "View", "Create", "Edit", "Delete", "Approve", "Export", "Configure" }) },
            { "Recruitment", ("ATS", new[] { "View", "Create", "Edit", "Delete", "Approve", "Reject", "Export", "Manage" }) },
            { "Onboarding", ("Workflows", new[] { "View", "Create", "Edit", "Delete", "Approve", "Export", "Manage" }) },
            { "Offboarding", ("ExitClearance", new[] { "View", "Create", "Edit", "Delete", "Approve", "Export", "Manage" }) },
            { "Learning", ("LMS", new[] { "View", "Create", "Edit", "Delete", "Export", "Manage" }) },
            { "Workflow", ("Orchestration", new[] { "View", "Create", "Edit", "Delete", "Approve", "Reject", "Configure", "Export", "Manage" }) },
            { "Notifications", ("Alerts", new[] { "View", "Create", "Edit", "Delete", "Configure", "Export", "Manage" }) },
            { "Audit", ("Logs", new[] { "View", "Export", "Configure", "Manage" }) },
            { "Organization", ("Structure", new[] { "View", "Create", "Edit", "Delete", "Configure", "Export", "Manage" }) },
            { "SystemAdmin", ("Security", new[] { "View", "Create", "Edit", "Delete", "Configure", "Export", "Manage" }) },
            { "Assets", ("AssetManagement", new[] { "View", "Create", "Edit", "Delete", "Assign", "Transfer", "Return", "Request", "Approve", "Maintenance", "Audit", "Incident", "Depreciation", "Retire", "Dispose", "Export", "Manage" }) },
            { "Compensation", ("SalaryAndRewards", new[] { "View", "Create", "Edit", "Delete", "Approve", "Review", "ManageGrades", "ManageBands", "ManageComponents", "ManageBonuses", "Export", "Manage" }) },
            { "Benefits", ("HealthAndWelfare", new[] { "View", "Create", "Edit", "Delete", "Enroll", "Approve", "ManagePlans", "ManageEligibility", "Export", "Manage" }) },
            { "ESS", ("EmployeeSelfService", new[] { "View", "UpdateProfile", "ClockInOut", "ApplyLeave", "ViewPayslip", "ViewCompensation", "ViewBenefits", "ManageDependents", "RequestAsset", "AcknowledgePolicy", "RequestDocument", "CreateRequest" }) }
        };

        var allPermissions = new List<AppPermission>();
        foreach (var (mod, (feat, acts)) in modules)
        {
            foreach (var act in acts)
            {
                allPermissions.Add(new AppPermission
                {
                    Code = $"{mod}.{act}",
                    Module = mod,
                    Feature = feat,
                    Action = act,
                    Name = $"{act} {mod}",
                    Description = $"Allows user to {act.ToLower()} records in {mod} module.",
                    IsSystem = true,
                    CreatedByName = "System Initializer"
                });
            }
        }

        _context.AppPermissions.AddRange(allPermissions);
        _context.SaveChanges();

        // ==========================================
        // 2. SEED 12 ROLES
        // ==========================================
        var roles = new List<Role>
        {
            new() { Code = "SUPER_ADMIN", Name = "Super Admin", Description = "Full unrestricted platform administrator with root security privileges", IsSystem = true },
            new() { Code = "SYSTEM_ADMIN", Name = "System Admin", Description = "IT & Infrastructure administrator for settings, sessions, and security", IsSystem = true },
            new() { Code = "HR_ADMIN", Name = "HR Admin", Description = "Human Resources Director & Enterprise HR Operations Admin", IsSystem = true },
            new() { Code = "HR_MANAGER", Name = "HR Manager", Description = "HR Business Partner and Department HR reviewer", IsSystem = true },
            new() { Code = "FINANCE_ADMIN", Name = "Finance Admin", Description = "Finance Controller & Reimbursement Authority", IsSystem = true },
            new() { Code = "PAYROLL_ADMIN", Name = "Payroll Admin", Description = "Payroll Specialist & Tax Administrator", IsSystem = true },
            new() { Code = "MANAGER", Name = "Manager", Description = "Reporting Line Manager & Team Approval Authority", IsSystem = true },
            new() { Code = "EMPLOYEE", Name = "Employee", Description = "Standard Self-Service Portal Employee", IsSystem = true },
            new() { Code = "RECRUITER", Name = "Recruiter", Description = "Talent Acquisition & ATS Hiring Specialist", IsSystem = false },
            new() { Code = "AUDITOR", Name = "Auditor", Description = "Compliance & Security Audit Reviewer (Read-Only Global)", IsSystem = false },
            new() { Code = "COMPLIANCE_OFFICER", Name = "Compliance Officer", Description = "Policy & Regulatory Compliance Inspector", IsSystem = false },
            new() { Code = "IT_ADMIN", Name = "IT Administrator", Description = "IT Hardware & Access Control Administrator", IsSystem = false }
        };

        _context.Roles.AddRange(roles);
        _context.SaveChanges();

        // Role-Permission Assignments
        var rolePerms = new List<RolePermission>();
        var superAdminRole = roles.First(r => r.Code == "SUPER_ADMIN");
        var sysAdminRole = roles.First(r => r.Code == "SYSTEM_ADMIN");
        var hrAdminRole = roles.First(r => r.Code == "HR_ADMIN");
        var managerRole = roles.First(r => r.Code == "MANAGER");
        var employeeRole = roles.First(r => r.Code == "EMPLOYEE");
        var financeRole = roles.First(r => r.Code == "FINANCE_ADMIN");
        var payrollRole = roles.First(r => r.Code == "PAYROLL_ADMIN");
        var auditorRole = roles.First(r => r.Code == "AUDITOR");

        // Super Admin gets ALL permissions
        foreach (var p in allPermissions)
        {
            rolePerms.Add(new RolePermission { RoleId = superAdminRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // Sys Admin gets SystemAdmin, Audit, Notifications, Org, Workflow
        foreach (var p in allPermissions.Where(p => p.Module is "SystemAdmin" or "Audit" or "Notifications" or "Organization" or "Workflow"))
        {
            rolePerms.Add(new RolePermission { RoleId = sysAdminRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // HR Admin gets HR modules + Workflows + Assets
        foreach (var p in allPermissions.Where(p => p.Module is "Employees" or "Attendance" or "Leave" or "Shift" or "Performance" or "Recruitment" or "Onboarding" or "Offboarding" or "Learning" or "Workflow" or "Notifications" or "Assets"))
        {
            rolePerms.Add(new RolePermission { RoleId = hrAdminRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // Finance & Payroll
        foreach (var p in allPermissions.Where(p => p.Module is "Payroll" or "Workflow" or "Notifications"))
        {
            rolePerms.Add(new RolePermission { RoleId = financeRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
            rolePerms.Add(new RolePermission { RoleId = payrollRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // Manager gets View, Approve, Reject, Export for team modules
        foreach (var p in allPermissions.Where(p => p.Action is "View" or "Approve" or "Reject" or "Export" && p.Module is not "SystemAdmin"))
        {
            rolePerms.Add(new RolePermission { RoleId = managerRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // Employee gets View and Create for self-service
        foreach (var p in allPermissions.Where(p => (p.Action is "View" or "Create" or "Request" or "Return" or "Enroll") && (p.Module is "Attendance" or "Leave" or "Performance" or "Learning" or "Notifications" or "Assets" or "Compensation" or "Benefits")))
        {
            rolePerms.Add(new RolePermission { RoleId = employeeRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        // Auditor gets all View and Export
        foreach (var p in allPermissions.Where(p => p.Action is "View" or "Export"))
        {
            rolePerms.Add(new RolePermission { RoleId = auditorRole.Id, PermissionId = p.Id, GrantedBy = "System Initializer" });
        }

        _context.RolePermissions.AddRange(rolePerms);
        _context.SaveChanges();

        // ==========================================
        // 3. SEED 65+ USERS & SESSIONS
        // ==========================================
        var userSeeds = new (string username, string name, string email, string phone, string empId, string company, string branch, string dept, string roleCode)[]
        {
            ("superadmin", "Alexander Wright", "superadmin@anraone.com", "+1-555-0100", "EMP001", "Acme Global Technologies", "San Francisco HQ", "Executive", "SUPER_ADMIN"),
            ("sysadmin", "Sarah Jenkins", "sysadmin@anraone.com", "+1-555-0101", "EMP002", "Acme Global Technologies", "San Francisco HQ", "Information Technology", "SYSTEM_ADMIN"),
            ("hradmin", "Victoria Morgan", "victoria.morgan@anraone.com", "+1-555-0102", "EMP003", "Acme Global Technologies", "San Francisco HQ", "Human Resources", "HR_ADMIN"),
            ("hrmanager", "David Ross", "david.ross@anraone.com", "+1-555-0103", "EMP004", "Acme Global Technologies", "Austin Branch", "Human Resources", "HR_MANAGER"),
            ("financeadmin", "Robert Chang", "robert.chang@anraone.com", "+1-555-0104", "EMP005", "Acme Global Technologies", "New York Branch", "Finance", "FINANCE_ADMIN"),
            ("payrolladmin", "Elena Rostova", "elena.rostova@anraone.com", "+1-555-0105", "EMP006", "Acme Global Technologies", "San Francisco HQ", "Finance", "PAYROLL_ADMIN"),
            ("leadmanager", "Marcus Vance", "marcus.vance@anraone.com", "+1-555-0106", "EMP007", "Acme Global Technologies", "Austin Branch", "Engineering", "MANAGER"),
            ("auditor_lead", "Rachel Green", "rachel.green@anraone.com", "+1-555-0107", "EMP008", "Acme Global Technologies", "London Office", "Audit & Compliance", "AUDITOR"),
            ("recruiter_lead", "Daniel Craig", "daniel.craig@anraone.com", "+1-555-0108", "EMP009", "Acme Global Technologies", "San Francisco HQ", "Human Resources", "RECRUITER"),
            ("itadmin_lead", "Kevin Flynn", "kevin.flynn@anraone.com", "+1-555-0109", "EMP010", "Acme Global Technologies", "San Francisco HQ", "Information Technology", "IT_ADMIN")
        };

        var usersList = new List<User>();
        var userRoleList = new List<UserRole>();
        var sessionList = new List<Session>();

        foreach (var u in userSeeds)
        {
            var user = new User
            {
                Username = u.username,
                FullName = u.name,
                Email = u.email,
                PhoneNumber = u.phone,
                EmployeeId = u.empId,
                CompanyName = u.company,
                BranchName = u.branch,
                DepartmentName = u.dept,
                RequireMfa = u.roleCode is "SUPER_ADMIN" or "SYSTEM_ADMIN",
                MfaEnabled = u.roleCode is "SUPER_ADMIN",
                IsActive = true,
                AllowLogin = true,
                PasswordPolicy = "Enterprise",
                CreatedByName = "System Initializer",
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                LastLoginAt = DateTime.UtcNow.AddMinutes(-new Random().Next(5, 180)),
                LastLoginIp = "192.168.1." + new Random().Next(10, 99)
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, "Admin@123!");

            usersList.Add(user);

            var matchedRole = roles.First(r => r.Code == u.roleCode);
            userRoleList.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = matchedRole.Id,
                AssignedBy = "System Initializer"
            });

            // Create active session
            sessionList.Add(new Session
            {
                UserId = user.Id,
                DeviceId = $"DEV-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
                DeviceType = "Desktop",
                Browser = "Chrome 128",
                OperatingSystem = "Windows 11",
                IpAddress = user.LastLoginIp,
                Location = "San Francisco, US",
                LoginAt = DateTime.UtcNow.AddHours(-2),
                LastActivityAt = DateTime.UtcNow.AddMinutes(-5),
                ExpiresAt = DateTime.UtcNow.AddHours(10),
                IsRevoked = false
            });
        }

        // Generate additional 55 standard enterprise users
        var firstNames = new[] { "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra" };
        var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris" };
        var depts = new[] { "Engineering", "Sales", "Marketing", "Customer Support", "Operations", "Finance", "Legal", "Product" };
        var companies = new[] { "Acme Global Technologies", "Acme Innovations Ltd", "Acme Logistics Group" };
        var branches = new[] { "San Francisco HQ", "Austin Branch", "New York Branch", "London Office", "Singapore Hub" };

        for (int i = 11; i <= 65; i++)
        {
            var fn = firstNames[i % firstNames.Length];
            var ln = lastNames[i % lastNames.Length];
            var uname = $"{fn.ToLower()}.{ln.ToLower()}{i}";
            var email = $"{fn.ToLower()}.{ln.ToLower()}{i}@anraone.com";
            var dept = depts[i % depts.Length];
            var comp = companies[i % companies.Length];
            var branch = branches[i % branches.Length];
            var isLocked = i % 18 == 0;
            var isInactive = i % 22 == 0;

            var user = new User
            {
                Username = uname,
                FullName = $"{fn} {ln}",
                Email = email,
                PhoneNumber = $"+1-555-0{100 + i}",
                EmployeeId = $"EMP{i:D3}",
                CompanyName = comp,
                BranchName = branch,
                DepartmentName = dept,
                IsActive = !isInactive,
                IsLocked = isLocked,
                LockReason = isLocked ? "Exceeded maximum failed login attempts (5)" : string.Empty,
                AllowLogin = !isInactive,
                CreatedByName = "System Initializer",
                CreatedAt = DateTime.UtcNow.AddDays(-i * 3),
                LastLoginAt = isInactive ? null : DateTime.UtcNow.AddHours(-i),
                LastLoginIp = $"10.0.4.{i}"
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, "Pass@123!");

            usersList.Add(user);

            var assignRole = (i % 7 == 0) ? managerRole : employeeRole;
            userRoleList.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = assignRole.Id,
                AssignedBy = "System Initializer"
            });

            if (!isInactive && !isLocked && i % 2 == 0)
            {
                sessionList.Add(new Session
                {
                    UserId = user.Id,
                    DeviceId = $"DEV-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
                    DeviceType = (i % 3 == 0) ? "Mobile" : "Desktop",
                    Browser = (i % 4 == 0) ? "Safari 17" : "Chrome 128",
                    OperatingSystem = (i % 3 == 0) ? "iOS 17" : "macOS Sonoma",
                    IpAddress = user.LastLoginIp,
                    Location = "San Francisco, US",
                    LoginAt = DateTime.UtcNow.AddHours(-3),
                    LastActivityAt = DateTime.UtcNow.AddMinutes(-12),
                    ExpiresAt = DateTime.UtcNow.AddHours(9),
                    IsRevoked = false
                });
            }
        }

        _context.Users.AddRange(usersList);
        _context.UserRoles.AddRange(userRoleList);
        _context.Sessions.AddRange(sessionList);
        _context.SaveChanges();

        // ==========================================
        // 4. SEED 100+ SYSTEM SETTINGS & HIERARCHY
        // ==========================================
        var settings = new List<SystemSetting>
        {
            // General
            new() { Category = "General", Key = "General.OrganizationName", Value = "AnraOne Enterprise HRMS", DataType = "string", Description = "Global organization title", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.SupportEmail", Value = "support@anraone.com", DataType = "string", Description = "Primary support contact", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.DefaultLanguage", Value = "en-US", DataType = "string", Description = "Default interface language", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.DefaultCurrency", Value = "USD ($)", DataType = "string", Description = "Base accounting currency", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.TimeZone", Value = "America/Los_Angeles (PST)", DataType = "string", Description = "Primary corporate timezone", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.DateFormat", Value = "YYYY-MM-DD", DataType = "string", Description = "Standard date representation", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.TimeFormat", Value = "12-hour (AM/PM)", DataType = "string", Description = "Standard time representation", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "General", Key = "General.FiscalYearStart", Value = "January 1", DataType = "string", Description = "Financial calendar cycle start", ScopeLevel = "Global", IsSystem = true },

            // Security
            new() { Category = "Security", Key = "Security.PasswordMinLength", Value = "8", DataType = "number", Description = "Minimum required password characters", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Security", Key = "Security.RequireSpecialChar", Value = "true", DataType = "boolean", Description = "Must contain symbol character", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Security", Key = "Security.MaxFailedLogins", Value = "5", DataType = "number", Description = "Threshold before account lock", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Security", Key = "Security.LockoutDurationMinutes", Value = "30", DataType = "number", Description = "Duration of temporary account lock", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Security", Key = "Security.SessionTimeoutMinutes", Value = "60", DataType = "number", Description = "Automatic session expiry window", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Security", Key = "Security.IdleTimeoutMinutes", Value = "15", DataType = "number", Description = "Screen lock inactivity trigger", ScopeLevel = "Global", IsSystem = true },

            // Business Rules: Attendance
            new() { Category = "Attendance", Key = "Attendance.GracePeriodMinutes", Value = "15", DataType = "number", Description = "Allowed late check-in grace period", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Attendance", Key = "Attendance.LateThresholdMinutes", Value = "30", DataType = "number", Description = "Late mark threshold", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Attendance", Key = "Attendance.EarlyCheckoutThresholdMinutes", Value = "30", DataType = "number", Description = "Early departure mark threshold", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Attendance", Key = "Attendance.HalfDayHours", Value = "4.0", DataType = "number", Description = "Minimum work duration for half day", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Attendance", Key = "Attendance.FullDayHours", Value = "8.0", DataType = "number", Description = "Required work duration for full day", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Attendance", Key = "Attendance.OvertimeThresholdHours", Value = "1.0", DataType = "number", Description = "Overtime calculation start buffer", ScopeLevel = "Global", IsSystem = true },

            // Business Rules: Leave
            new() { Category = "Leave", Key = "Leave.MinNoticeDays", Value = "2", DataType = "number", Description = "Advance notice required for planned leave", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Leave", Key = "Leave.MaxConsecutiveDays", Value = "14", DataType = "number", Description = "Maximum continuous leave without executive sign-off", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Leave", Key = "Leave.AllowCarryForward", Value = "true", DataType = "boolean", Description = "Unused leave carry forward into next calendar year", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Leave", Key = "Leave.MaxCarryForwardDays", Value = "10", DataType = "number", Description = "Cap on annual carry forward balance", ScopeLevel = "Global", IsSystem = true },

            // Business Rules: Payroll
            new() { Category = "Payroll", Key = "Payroll.Frequency", Value = "Monthly", DataType = "string", Description = "Salary disbursement cycle", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Payroll", Key = "Payroll.CutoffDay", Value = "25", DataType = "number", Description = "Monthly payroll cut-off day", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "Payroll", Key = "Payroll.TaxDeductionScheme", Value = "Standard Federal + State", DataType = "string", Description = "Statutory compliance tax calculator", ScopeLevel = "Global", IsSystem = true },

            // Data Import/Export
            new() { Category = "DataPolicy", Key = "Data.AllowedUploadFileTypes", Value = ".pdf,.docx,.xlsx,.csv,.png,.jpg", DataType = "string", Description = "Allowed upload extensions", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "DataPolicy", Key = "Data.MaxUploadSizeBytes", Value = "26214400", DataType = "number", Description = "Max file size (25MB)", ScopeLevel = "Global", IsSystem = true },
            new() { Category = "DataPolicy", Key = "Data.AuditRetentionDays", Value = "365", DataType = "number", Description = "Immutable audit log retention period", ScopeLevel = "Global", IsSystem = true }
        };

        _context.SystemSettings.AddRange(settings);

        // Security Policy Record
        var secPolicy = new SecurityPolicy
        {
            PolicyName = "Enterprise Standard Security Policy",
            PasswordMinLength = 8,
            RequireUppercase = true,
            RequireLowercase = true,
            RequireNumbers = true,
            RequireSpecialChars = true,
            PasswordExpirationDays = 90,
            PasswordHistoryCount = 5,
            MaxFailedLoginAttempts = 5,
            AccountLockDurationMinutes = 30,
            SessionTimeoutMinutes = 60,
            IdleTimeoutMinutes = 15,
            MfaRequirement = "Optional",
            ConcurrentSessionLimit = "MultiLimit",
            MaxConcurrentSessions = 3
        };
        _context.SecurityPolicies.Add(secPolicy);

        // Email Configuration Record
        var emailConfig = new EmailConfiguration
        {
            SmtpHost = "smtp.office365.com",
            SmtpPort = 587,
            Username = "notifications@anraone.com",
            PasswordEncrypted = "ENC_SMTP_SECRET_KEY",
            SecurityMode = "TLS",
            FromName = "AnraOne HRMS Enterprise",
            FromEmail = "notifications@anraone.com",
            ReplyToEmail = "support@anraone.com",
            IsDefault = true,
            Status = "Verified",
            LastTestedAt = DateTime.UtcNow
        };
        _context.EmailConfigurations.Add(emailConfig);

        // ==========================================
        // 5. SEED 14 FEATURE FLAGS
        // ==========================================
        var flags = new List<FeatureFlag>
        {
            new() { Key = "Attendance", Name = "Attendance & Geofencing", Module = "Attendance", Description = "Biometric check-ins, timesheets, and shift tracking", IsEnabledGlobally = true },
            new() { Key = "Leave", Name = "Leave Management", Module = "Leave", Description = "Leave applications, balances, and carry-forwards", IsEnabledGlobally = true },
            new() { Key = "Shift", Name = "Shift & Roster Planning", Module = "Shift", Description = "Multi-shift rosters, rotations, and swap requests", IsEnabledGlobally = true },
            new() { Key = "Payroll", Name = "Payroll & Reimbursements", Module = "Payroll", Description = "Salary runs, payslips, tax deductions, and expenses", IsEnabledGlobally = true },
            new() { Key = "Recruitment", Name = "Recruitment & ATS", Module = "Recruitment", Description = "Job requisitions, candidate pipelines, and offers", IsEnabledGlobally = true },
            new() { Key = "Performance", Name = "Performance & Appraisals", Module = "Performance", Description = "Goal management, 360 feedback, and review cycles", IsEnabledGlobally = true },
            new() { Key = "Onboarding", Name = "Employee Onboarding", Module = "Onboarding", Description = "New hire document upload and orientation workflows", IsEnabledGlobally = true },
            new() { Key = "Offboarding", Name = "Exit & Offboarding", Module = "Offboarding", Description = "Resignations, asset clearance, and exit interviews", IsEnabledGlobally = true },
            new() { Key = "Learning", Name = "Learning Management (LMS)", Module = "Learning", Description = "Course catalogs, classroom sessions, and certifications", IsEnabledGlobally = true },
            new() { Key = "Workflow", Name = "Workflow Orchestration Engine", Module = "Workflow", Description = "Multi-level approval engines and SLA escalations", IsEnabledGlobally = true },
            new() { Key = "Notifications", Name = "Multi-Channel Notifications", Module = "Notifications", Description = "Email, SMS, in-app bell, and push broadcasts", IsEnabledGlobally = true },
            new() { Key = "Audit", Name = "Immutable Security Audit Logs", Module = "Audit", Description = "Compliance logging and forensic change tracking", IsEnabledGlobally = true },
            new() { Key = "Reports", Name = "Advanced BI & Analytics", Module = "Reports", Description = "Organizational telemetry and executive reporting", IsEnabledGlobally = true },
            new() { Key = "AIAssistant", Name = "HR Generative AI Co-Pilot", Module = "AI", Description = "AI-assisted policy queries and resume matching", IsEnabledGlobally = true }
        };
        _context.FeatureFlags.AddRange(flags);

        // ==========================================
        // 6. SEED 10 HOLIDAY CALENDARS
        // ==========================================
        var calGlobal = new HolidayCalendar
        {
            Code = "CAL-US-2026",
            Name = "United States Federal Holidays 2026",
            Description = "US Corporate Standard Calendar",
            Year = 2026,
            CompanyName = "All Companies",
            BranchName = "All Branches",
            IsDefault = true
        };
        _context.HolidayCalendars.Add(calGlobal);

        var usHolidays = new (string name, string date, string type)[]
        {
            ("New Year's Day", "2026-01-01", "Public"),
            ("Martin Luther King Jr. Day", "2026-01-19", "Public"),
            ("Washington's Birthday", "2026-02-16", "Public"),
            ("Memorial Day", "2026-05-25", "Public"),
            ("Juneteenth National Independence Day", "2026-06-19", "Public"),
            ("Independence Day", "2026-07-04", "Public"),
            ("Labor Day", "2026-09-07", "Public"),
            ("Columbus / Indigenous Peoples' Day", "2026-10-12", "Public"),
            ("Veterans Day", "2026-11-11", "Public"),
            ("Thanksgiving Day", "2026-11-26", "Public"),
            ("Day after Thanksgiving", "2026-11-27", "Company"),
            ("Christmas Eve", "2026-12-24", "Company"),
            ("Christmas Day", "2026-12-25", "Public"),
            ("New Year's Eve", "2026-12-31", "Company")
        };

        foreach (var h in usHolidays)
        {
            _context.HolidayCalendarDays.Add(new HolidayCalendarDay
            {
                HolidayCalendarId = calGlobal.Id,
                Name = h.name,
                Date = DateTime.Parse(h.date).ToUniversalTime(),
                Type = h.type,
                IsRecurring = true,
                Description = $"{h.name} recognized holiday"
            });
        }

        // Additional Regional Calendars
        var regionalCals = new[]
        {
            ("CAL-UK-2026", "UK Bank Holidays 2026", "London Office"),
            ("CAL-IN-2026", "India Public Holidays 2026", "India Tech Hub"),
            ("CAL-SG-2026", "Singapore Public Holidays 2026", "Singapore Branch"),
            ("CAL-AU-2026", "Australia National Holidays 2026", "Sydney Office"),
            ("CAL-DE-2026", "Germany Federal Holidays 2026", "Berlin Office"),
            ("CAL-JP-2026", "Japan National Holidays 2026", "Tokyo Office"),
            ("CAL-CA-2026", "Canada Statutory Holidays 2026", "Toronto Branch"),
            ("CAL-AE-2026", "UAE National Holidays 2026", "Dubai Branch"),
            ("CAL-FR-2026", "France Public Holidays 2026", "Paris Office")
        };

        foreach (var (code, name, branch) in regionalCals)
        {
            var regCal = new HolidayCalendar
            {
                Code = code,
                Name = name,
                Description = $"{name} for {branch}",
                Year = 2026,
                CompanyName = "Acme Global Technologies",
                BranchName = branch,
                IsDefault = false
            };
            _context.HolidayCalendars.Add(regCal);

            _context.HolidayCalendarDays.Add(new HolidayCalendarDay
            {
                HolidayCalendarId = regCal.Id,
                Name = "New Year's Day",
                Date = DateTime.Parse("2026-01-01").ToUniversalTime(),
                Type = "Public",
                IsRecurring = true
            });
            _context.HolidayCalendarDays.Add(new HolidayCalendarDay
            {
                HolidayCalendarId = regCal.Id,
                Name = "National Foundation / Spring Holiday",
                Date = DateTime.Parse("2026-05-01").ToUniversalTime(),
                Type = "Public",
                IsRecurring = true
            });
            _context.HolidayCalendarDays.Add(new HolidayCalendarDay
            {
                HolidayCalendarId = regCal.Id,
                Name = "End of Year Corporate Holiday",
                Date = DateTime.Parse("2026-12-25").ToUniversalTime(),
                Type = "Public",
                IsRecurring = true
            });
        }

        // ==========================================
        // 7. SEED 8 BACKGROUND SCHEDULED JOBS
        // ==========================================
        var jobs = new List<BackgroundJobInfo>
        {
            new() { JobKey = "JOB_WF_ESCALATION", Name = "Workflow SLA Escalation Engine", Category = "Workflow", Description = "Evaluates pending approval SLAs and triggers automated tier escalation", CronSchedule = "*/5 * * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddMinutes(-4), NextRunAt = DateTime.UtcNow.AddMinutes(1), LastDurationMs = 240, SuccessCount = 1420, FailureCount = 0 },
            new() { JobKey = "JOB_NOTIF_DISPATCHER", Name = "Notification Queue Dispatcher", Category = "Notification", Description = "Flushes queued email, SMS, and in-app bell notifications", CronSchedule = "* * * * *", Status = "Running", LastRunAt = DateTime.UtcNow.AddSeconds(-30), NextRunAt = DateTime.UtcNow.AddSeconds(30), LastDurationMs = 180, SuccessCount = 4890, FailureCount = 2 },
            new() { JobKey = "JOB_AUDIT_ARCHIVE", Name = "Security Audit Archiving Service", Category = "Audit", Description = "Compacts and archives historical immutable security audit logs", CronSchedule = "0 0 * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddHours(-12), NextRunAt = DateTime.UtcNow.AddHours(12), LastDurationMs = 1200, SuccessCount = 180, FailureCount = 0 },
            new() { JobKey = "JOB_PAYROLL_SYNC", Name = "Payroll Cut-off Verification Service", Category = "Payroll", Description = "Validates time logs and tax brackets prior to monthly payroll disbursement", CronSchedule = "0 2 * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddDays(-1), NextRunAt = DateTime.UtcNow.AddHours(18), LastDurationMs = 3400, SuccessCount = 48, FailureCount = 0 },
            new() { JobKey = "JOB_ATT_AGGREGATOR", Name = "Attendance Daily Summary Aggregator", Category = "Attendance", Description = "Calculates daily shift hours, overtime, and late marks across biometric devices", CronSchedule = "0 23 * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddHours(-11), NextRunAt = DateTime.UtcNow.AddHours(13), LastDurationMs = 2100, SuccessCount = 365, FailureCount = 0 },
            new() { JobKey = "JOB_SESSION_CLEANUP", Name = "Expired Session & Token Cleanup", Category = "Cleanup", Description = "Purges expired user sessions and invalidated refresh tokens", CronSchedule = "0 */6 * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddHours(-2), NextRunAt = DateTime.UtcNow.AddHours(4), LastDurationMs = 450, SuccessCount = 720, FailureCount = 0 },
            new() { JobKey = "JOB_HEALTH_MONITOR", Name = "System Health & Telemetry Prober", Category = "System", Description = "Pings database, API services, and message queues for real-time diagnostics", CronSchedule = "*/2 * * * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddMinutes(-1), NextRunAt = DateTime.UtcNow.AddMinutes(1), LastDurationMs = 85, SuccessCount = 8920, FailureCount = 0 },
            new() { JobKey = "JOB_LEAVE_ACCRUAL", Name = "Monthly Leave Accrual Calculator", Category = "Leave", Description = "Calculates and credits monthly earned leave entitlements to employees", CronSchedule = "0 0 1 * *", Status = "Idle", LastRunAt = DateTime.UtcNow.AddDays(-2), NextRunAt = DateTime.UtcNow.AddDays(28), LastDurationMs = 1850, SuccessCount = 24, FailureCount = 0 }
        };

        _context.BackgroundJobInfos.AddRange(jobs);

        _context.SaveChanges();
        Console.WriteLine($"Enterprise System Administration Data Generated Successfully! Created {usersList.Count} Users, {roles.Count} Roles, {allPermissions.Count} Permissions, {settings.Count} Settings, {flags.Count} Flags, and {jobs.Count} Background Jobs.");
    }
}
