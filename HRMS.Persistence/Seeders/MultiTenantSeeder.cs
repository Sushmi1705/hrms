using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Audit;
using HRMS.Domain.Entities.Auth;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Tenant;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Persistence.Seeders;

public static class MultiTenantSeeder
{
    public static async Task SeedMultiTenantDataAsync(HrmsDbContext db, IPasswordHasher<User> passwordHasher)
    {
        if (await db.Tenants.AnyAsync()) return;

        // 1. Seed 5 Standard Subscription Plans
        var plans = new List<SubscriptionPlan>
        {
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Code = "Free",
                Name = "Free Community Tier",
                Description = "Essential HR toolkit for small teams and startups exploring HRMS capabilities.",
                MonthlyPrice = 0,
                AnnualPrice = 0,
                Currency = "USD",
                MaxUsers = 5,
                MaxEmployees = 15,
                StorageGb = 2,
                BillingCycle = "Monthly",
                IsActive = true,
                IsPopular = false,
                SupportTier = "Community",
                FeaturesJson = JsonSerializer.Serialize(new[] { "Employees", "Attendance", "Leave", "ESS" })
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Code = "Starter",
                Name = "Starter Tier",
                Description = "Core personnel management, shift scheduling, and standard leave approvals.",
                MonthlyPrice = 99,
                AnnualPrice = 990,
                Currency = "USD",
                MaxUsers = 25,
                MaxEmployees = 100,
                StorageGb = 10,
                BillingCycle = "Monthly",
                IsActive = true,
                IsPopular = false,
                SupportTier = "Standard",
                FeaturesJson = JsonSerializer.Serialize(new[] { "Employees", "Attendance", "Leave", "Shift", "ESS", "MSS", "Notifications" })
            },
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Code = "Professional",
                Name = "Professional Tier",
                Description = "Complete HR operations with full payroll automation, performance appraisals, and onboarding workflows.",
                MonthlyPrice = 249,
                AnnualPrice = 2490,
                Currency = "USD",
                MaxUsers = 100,
                MaxEmployees = 500,
                StorageGb = 50,
                BillingCycle = "Monthly",
                IsActive = true,
                IsPopular = true,
                SupportTier = "Priority",
                FeaturesJson = JsonSerializer.Serialize(new[] { "Employees", "Attendance", "Leave", "Shift", "Payroll", "Performance", "Onboarding", "Offboarding", "Workflow", "Notifications", "Documents", "ESS", "MSS" })
            },
            new()
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Code = "Business",
                Name = "Business Enterprise",
                Description = "Multi-branch workforce orchestration with recruitment ATS, LMS, compliance audits, and custom domains.",
                MonthlyPrice = 599,
                AnnualPrice = 5990,
                Currency = "USD",
                MaxUsers = 500,
                MaxEmployees = 2500,
                StorageGb = 250,
                BillingCycle = "Monthly",
                IsActive = true,
                IsPopular = false,
                SupportTier = "Priority 24/7",
                FeaturesJson = JsonSerializer.Serialize(new[] { "Employees", "Attendance", "Leave", "Shift", "Payroll", "Performance", "Recruitment", "Onboarding", "Offboarding", "Learning", "Workflow", "Notifications", "Audit", "Documents", "Assets", "Expenses", "Reports", "ESS", "MSS" })
            },
            new()
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Code = "Enterprise",
                Name = "Global Titan Suite",
                Description = "Unlimited multi-tenant sovereignty, dedicated account manager, custom SLAs, and Generative AI HR Co-Pilot.",
                MonthlyPrice = 1499,
                AnnualPrice = 14990,
                Currency = "USD",
                MaxUsers = 2000,
                MaxEmployees = 10000,
                StorageGb = 1000,
                BillingCycle = "Annual",
                IsActive = true,
                IsPopular = false,
                SupportTier = "Dedicated Account Exec",
                FeaturesJson = JsonSerializer.Serialize(new[] { "Employees", "Attendance", "Leave", "Shift", "Payroll", "Performance", "Recruitment", "Onboarding", "Offboarding", "Learning", "Workflow", "Notifications", "Audit", "Documents", "Assets", "Expenses", "Reports", "ESS", "MSS", "AIAssistant" })
            }
        };

        await db.SubscriptionPlans.AddRangeAsync(plans);
        await db.SaveChangesAsync();

        // 2. Seed 21 Diverse Enterprise Tenants
        var tenantData = new (string Code, string Name, string LegalName, string Industry, string Country, string Currency, string TimeZone, string ContactName, string ContactEmail, string PlanCode, string Status, int Users, int Employees, double StorageMb, string Domain)[]
        {
            ("ANRAONE", "AnraOne Technologies", "AnraOne Global Technologies Inc.", "Technology", "United States", "USD", "America/New_York", "Alexander Wright", "alexander.wright@anraone.com", "Enterprise", "Active", 65, 520, 4820, "hr.anraone.com"),
            ("NEXORA", "Nexora Innovations", "Nexora AI & Robotics Corp", "Technology", "United States", "USD", "America/Los_Angeles", "Sarah Connor", "sarah.connor@nexora.ai", "Business", "Active", 42, 380, 2450, "people.nexora.ai"),
            ("APEXHLTH", "Apex Global Health", "Apex Hospital Networks LLC", "Healthcare", "United Kingdom", "GBP", "Europe/London", "Dr. David Thorne", "d.thorne@apexhealth.org.uk", "Business", "Active", 85, 890, 6800, "staff.apexhealth.org.uk"),
            ("VANGUARD", "Vanguard Financial", "Vanguard Wealth Management Ltd", "Finance", "United States", "USD", "America/New_York", "Eleanor Vance", "e.vance@vanguardfin.com", "Enterprise", "Active", 92, 1140, 9200, "hr.vanguardfin.com"),
            ("TITANLOG", "Titan Logistics Global", "Titan Freight & Supply Chain Inc", "Logistics", "Germany", "EUR", "Europe/Berlin", "Klaus Schneider", "k.schneider@titanlogistics.de", "Professional", "Active", 34, 290, 1850, "workplace.titanlog.de"),
            ("STARLIGHT", "Starlight Media", "Starlight Entertainment Group", "Media", "United States", "USD", "America/Los_Angeles", "Chloe Bennett", "c.bennett@starlightmedia.com", "Professional", "Active", 28, 210, 3100, "crew.starlightmedia.com"),
            ("SUMMIT", "Summit Engineering", "Summit Construction & Civil Ltd", "Construction", "Australia", "AUD", "Australia/Sydney", "Liam O'Connor", "liam@summitcivil.com.au", "Starter", "Active", 18, 95, 820, "hrms.summitcivil.com.au"),
            ("HORIZON", "Horizon Retail Brands", "Horizon Global Merchandising S.A.", "Retail", "France", "EUR", "Europe/Paris", "Camille Dubois", "c.dubois@horizonretail.fr", "Business", "Active", 68, 740, 5200, "equipe.horizonretail.fr"),
            ("QUANTUM", "Quantum BioPharm", "Quantum Therapeutics & Lab Inc", "Pharmaceuticals", "Switzerland", "CHF", "Europe/Zurich", "Dr. Beatrix Meier", "b.meier@quantumbiopharm.ch", "Enterprise", "Active", 74, 620, 4900, "portal.quantumbiopharm.ch"),
            ("AURAHOSP", "Aura Hospitality Group", "Aura Luxury Resorts & Suites", "Hospitality", "United Arab Emirates", "AED", "Asia/Dubai", "Tariq Al-Mansoor", "tariq@aurahospitality.ae", "Professional", "Active", 45, 480, 2900, "staff.aurahospitality.ae"),
            ("PINNACLE", "Pinnacle Legal Advisory", "Pinnacle International Law LLP", "Legal", "United States", "USD", "America/Chicago", "Arthur Pendelton", "apendelton@pinnaclelaw.com", "Starter", "Active", 15, 60, 640, "internal.pinnaclelaw.com"),
            ("BEACONEDU", "Beacon University System", "Beacon Academic & Research Foundation", "Education", "Canada", "CAD", "America/Toronto", "Prof. Robert Sterling", "r.sterling@beacon.edu", "Business", "Active", 110, 1400, 8400, "faculty.beacon.edu"),
            ("MATRIXNRG", "Matrix Clean Energy", "Matrix Renewable Power Corp", "Energy", "Norway", "NOK", "Europe/Oslo", "Astrid Lindholm", "astrid@matrixenergy.no", "Professional", "Active", 31, 230, 1600, "people.matrixenergy.no"),
            ("IRONCLAD", "Ironclad Security", "Ironclad CyberDefense Technologies", "Security", "Israel", "ILS", "Asia/Jerusalem", "Avi Ben-David", "avi@ironcladsec.io", "Professional", "Active", 22, 160, 1100, "team.ironcladsec.io"),
            ("OMNICARE", "OmniCare MedTech", "OmniCare Surgical Instruments Inc", "Healthcare", "Japan", "JPY", "Asia/Tokyo", "Kenji Sato", "k.sato@omnicare.jp", "Starter", "Trial", 12, 45, 340, "staff.omnicare.jp"),
            ("BLUESKY", "BlueSky Aerospace", "BlueSky Avionics & Defense Ltd", "Aerospace", "United States", "USD", "America/Denver", "Col. Mark Hallowell", "m.hallowell@blueskyav.com", "Enterprise", "Active", 88, 850, 7200, "corp.blueskyav.com"),
            ("VELOCITY", "Velocity Motors", "Velocity EV Manufacturing Co.", "Automotive", "Germany", "EUR", "Europe/Frankfurt", "Hannah Weber", "h.weber@velocitymotors.de", "Business", "Active", 54, 510, 3900, "mitarbeiter.velocitymotors.de"),
            ("GREENFIELD", "GreenField AgriTech", "GreenField Sustainable Farming Corp", "Agriculture", "Netherlands", "EUR", "Europe/Amsterdam", "Lars van Dijk", "lars@greenfieldagri.nl", "Starter", "Trial", 8, 30, 190, "app.greenfieldagri.nl"),
            ("ZENITH", "Zenith Insurance", "Zenith Underwriting & Risk Partners", "Insurance", "Singapore", "SGD", "Asia/Singapore", "Mei-Ling Tan", "mltan@zenithinsure.sg", "Business", "Active", 62, 610, 4400, "portal.zenithinsure.sg"),
            ("ATLASCONS", "Atlas Strategy Partners", "Atlas Global Strategy Group", "Consulting", "United States", "USD", "America/New_York", "Victoria Stirling", "victoria.stirling@anraone.com", "Starter", "Suspended", 14, 80, 540, "work.atlasstrategy.com"),
            ("CYBERPULSE", "CyberPulse Telecom", "CyberPulse Communications PLC", "Telecommunications", "United Kingdom", "GBP", "Europe/London", "Oliver Twistleton", "o.twistleton@cyberpulse.co.uk", "Starter", "Pending", 6, 25, 120, "hr.cyberpulse.co.uk")
        };

        var seededTenants = new List<Tenant>();

        foreach (var t in tenantData)
        {
            var selectedPlan = plans.FirstOrDefault(p => p.Code == t.PlanCode) ?? plans[1];
            var tenantId = Guid.NewGuid();

            // Make primary tenant match existing default if needed
            if (t.Code == "ANRAONE")
            {
                tenantId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            }

            var tenant = new Tenant
            {
                Id = tenantId,
                TenantId = tenantId,
                Code = t.Code,
                Name = t.Name,
                LegalName = t.LegalName,
                Industry = t.Industry,
                Country = t.Country,
                Currency = t.Currency,
                TimeZone = t.TimeZone,
                Language = "en",
                Status = t.Status,
                SuspensionReason = t.Status == "Suspended" ? "Payment method expired & past due threshold exceeded" : null,
                SuspendedAt = t.Status == "Suspended" ? DateTime.UtcNow.AddDays(-5) : null,
                ContactName = t.ContactName,
                ContactEmail = t.ContactEmail,
                ContactPhone = "+1 (555) 019-2834",
                MaxUsers = selectedPlan.MaxUsers,
                MaxEmployees = selectedPlan.MaxEmployees,
                StorageQuotaGb = selectedPlan.StorageGb,
                StorageUsedMb = t.StorageMb,
                CustomDomain = t.Domain,
                DomainVerified = t.Status == "Active",
                SslStatus = t.Status == "Active" ? "Active" : "Pending",
                TrialEndsAt = t.Status == "Trial" ? DateTime.UtcNow.AddDays(10) : DateTime.UtcNow.AddMonths(12),
                SubscriptionEndsAt = DateTime.UtcNow.AddMonths(12),
                CreatedAt = DateTime.UtcNow.AddMonths(-new Random().Next(1, 10)),
                CreatedBy = "System Administrator"
            };

            seededTenants.Add(tenant);
            await db.Tenants.AddAsync(tenant);

            // Create primary Company
            var company = new Company
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Code = tenant.Code,
                Name = tenant.Name,
                Description = $"{tenant.Name} Headquarters",
                CreatedAt = tenant.CreatedAt,
                CreatedBy = "System Administrator"
            };
            await db.Companies.AddAsync(company);

            // Create Tenant Subscription
            var sub = new TenantSubscription
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                PlanId = selectedPlan.Id,
                Status = tenant.Status == "Suspended" ? "PastDue" : (tenant.Status == "Trial" ? "Trialing" : "Active"),
                BillingCycle = selectedPlan.BillingCycle,
                Amount = selectedPlan.BillingCycle == "Annual" ? selectedPlan.AnnualPrice : selectedPlan.MonthlyPrice,
                Currency = selectedPlan.Currency,
                StartedAt = tenant.CreatedAt,
                CurrentPeriodStart = DateTime.UtcNow.AddDays(-15),
                CurrentPeriodEnd = DateTime.UtcNow.AddDays(15),
                TrialStart = tenant.Status == "Trial" ? tenant.CreatedAt : null,
                TrialEnd = tenant.Status == "Trial" ? tenant.TrialEndsAt : null,
                AutoRenew = true,
                PaymentMethodStatus = tenant.Status == "Suspended" ? "Failed" : "Active",
                NextBillingAt = DateTime.UtcNow.AddDays(15),
                CreatedAt = tenant.CreatedAt,
                CreatedBy = "System Administrator"
            };
            await db.TenantSubscriptions.AddAsync(sub);

            // Tenant Settings
            var settings = new List<TenantSetting>
            {
                new() { TenantId = tenantId, Category = "General", Key = "General.OrganizationName", Value = tenant.Name, DataType = "string", Description = "Display Organization Name" },
                new() { TenantId = tenantId, Category = "General", Key = "General.Currency", Value = tenant.Currency, DataType = "string", Description = "Default Billing Currency" },
                new() { TenantId = tenantId, Category = "General", Key = "General.TimeZone", Value = tenant.TimeZone, DataType = "string", Description = "Corporate Timezone" },
                new() { TenantId = tenantId, Category = "HR", Key = "Attendance.RequireGeofence", Value = "false", DataType = "boolean", Description = "Geofencing enforcement" },
                new() { TenantId = tenantId, Category = "HR", Key = "Payroll.PayCycle", Value = "Monthly", DataType = "string", Description = "Salary disbursement cycle" },
                new() { TenantId = tenantId, Category = "Security", Key = "Security.MfaPolicy", Value = "Optional", DataType = "string", Description = "MFA Requirement" }
            };
            await db.TenantSettings.AddRangeAsync(settings);

            // Tenant Security Policy
            var secPolicy = new TenantSecurityPolicy
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                PasswordMinLength = 8,
                RequireUppercase = true,
                RequireNumbers = true,
                RequireSpecialChars = true,
                MfaRequirement = "Optional",
                SessionTimeoutMinutes = 60,
                MaxFailedAttempts = 5,
                LockoutMinutes = 30,
                CreatedAt = tenant.CreatedAt,
                CreatedBy = "System Administrator"
            };
            await db.TenantSecurityPolicies.AddAsync(secPolicy);

            // Tenant Custom Domain
            var domain = new TenantDomain
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Domain = t.Domain,
                IsPrimary = true,
                VerificationStatus = t.Status == "Active" ? "Verified" : "Pending",
                VerificationToken = Guid.NewGuid().ToString("N")[..16],
                SslStatus = t.Status == "Active" ? "Active" : "Pending",
                VerifiedAt = t.Status == "Active" ? tenant.CreatedAt : null,
                CreatedAt = tenant.CreatedAt,
                CreatedBy = "System Administrator"
            };
            await db.TenantDomains.AddAsync(domain);

            // Create initial Tenant Admin User
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                CompanyId = company.Id,
                CompanyName = company.Name,
                FullName = t.ContactName,
                Username = t.ContactEmail.Split('@')[0].ToLower(),
                Email = t.ContactEmail.ToLower(),
                PhoneNumber = "+1 555-0199",
                IsActive = t.Status != "Suspended",
                AllowLogin = t.Status != "Suspended",
                CreatedAt = tenant.CreatedAt
            };
            adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "TenantAdmin@12345");
            await db.Users.AddAsync(adminUser);

            // Audit log
            await db.AuditLogs.AddAsync(new AuditLog
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId.ToString(),
                UserId = adminUser.Id,
                UserName = "Platform Provisioner",
                Module = "SaaS",
                Entity = tenant.Name,
                Action = "Tenant Provisioned",
                Category = "TenantManagement",
                Severity = "Success",
                RequestPayload = $"Enterprise workspace created for {tenant.Name} under {selectedPlan.Name}",
                Status = "Success",
                CreatedAt = tenant.CreatedAt
            });
        }

        // Link existing entities to ANRAONE primary tenant
        var primaryTenantId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var unlinkedUsers = await db.Users.Where(u => u.TenantId == Guid.Empty).ToListAsync();
        foreach (var u in unlinkedUsers) u.TenantId = primaryTenantId;

        var unlinkedCompanies = await db.Companies.Where(c => c.TenantId == Guid.Empty).ToListAsync();
        foreach (var c in unlinkedCompanies) c.TenantId = primaryTenantId;

        var unlinkedEmployees = await db.Employees.Where(e => e.TenantId == Guid.Empty).ToListAsync();
        foreach (var e in unlinkedEmployees) e.TenantId = primaryTenantId;

        var unlinkedAttendance = await db.AttendanceLogs.Where(a => a.TenantId == Guid.Empty).ToListAsync();
        foreach (var a in unlinkedAttendance) a.TenantId = primaryTenantId;

        var unlinkedWorkflows = await db.WorkflowDefinitions.Where(w => w.TenantId == Guid.Empty).ToListAsync();
        foreach (var w in unlinkedWorkflows) w.TenantId = primaryTenantId;

        var unlinkedNotifications = await db.Notifications.Where(n => n.TenantId == Guid.Empty).ToListAsync();
        foreach (var n in unlinkedNotifications) n.TenantId = primaryTenantId;

        var unlinkedAudit = await db.AuditLogs.Where(a => string.IsNullOrEmpty(a.TenantId) || a.TenantId == Guid.Empty.ToString()).ToListAsync();
        foreach (var a in unlinkedAudit) a.TenantId = primaryTenantId.ToString();

        await db.SaveChangesAsync();
    }
}
