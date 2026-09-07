using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Bogus;
using HRMS.Domain.Entities.Compensation;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Persistence.Seeders;

public static class CompensationSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        if (context.CompensationComponents.Any()) return;

        var tenant = context.Tenants.FirstOrDefault(t => !t.IsDeleted);
        var tenantId = tenant?.Id ?? Guid.Parse("11111111-1111-1111-1111-111111111111");

        var employees = context.Employees
            .Where(e => e.TenantId == tenantId && !e.IsDeleted)
            .ToList();

        if (!employees.Any())
            employees = context.Employees.ToList();

        if (!employees.Any()) return;

        var locations = context.Locations.ToList();
        var departments = context.Departments.ToList();
        var faker = new Faker();

        // ==========================================
        // 1. SALARY COMPONENTS
        // ==========================================
        var compBasic = new CompensationComponent
        {
            TenantId = tenantId,
            Code = "BASIC",
            Name = "Basic Salary",
            Description = "Base contracted compensation",
            Type = "Earnings",
            CalculationType = "FixedAmount",
            IsTaxable = true,
            IsPensionable = true,
            IsRecurring = true,
            IsActive = true
        };
        context.CompensationComponents.Add(compBasic);
        context.SaveChanges();

        var components = new List<CompensationComponent>
        {
            new()
            {
                TenantId = tenantId,
                Code = "HRA",
                Name = "Housing Allowance",
                Description = "Residential accommodation assistance",
                Type = "Earnings",
                CalculationType = "Percentage",
                Percentage = 30,
                BasedOnComponentId = compBasic.Id,
                IsTaxable = true,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "TRANS",
                Name = "Transport Allowance",
                Description = "Commute and transit subsidy",
                Type = "Earnings",
                CalculationType = "FixedAmount",
                DefaultValue = 400,
                IsTaxable = false,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "MEAL",
                Name = "Meal Subsidy",
                Description = "Daily food and beverage stipend",
                Type = "Earnings",
                CalculationType = "FixedAmount",
                DefaultValue = 250,
                IsTaxable = false,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "MED",
                Name = "Medical Allowance",
                Description = "Out-of-pocket medical reimbursement stipend",
                Type = "Earnings",
                CalculationType = "FixedAmount",
                DefaultValue = 300,
                IsTaxable = false,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "SHIFT",
                Name = "Shift Differential",
                Description = "Night or weekend roster allowance",
                Type = "Earnings",
                CalculationType = "FixedAmount",
                DefaultValue = 200,
                IsTaxable = true,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "PERF_BONUS",
                Name = "Quarterly Performance Incentive",
                Description = "Target achievement variable pay",
                Type = "Earnings",
                CalculationType = "FixedAmount",
                DefaultValue = 1500,
                IsTaxable = true,
                IsPensionable = false,
                IsRecurring = false,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "PENSION_ER",
                Name = "401(k) Employer Match",
                Description = "Company retirement contribution matching",
                Type = "EmployerContribution",
                CalculationType = "Percentage",
                Percentage = 5,
                BasedOnComponentId = compBasic.Id,
                IsTaxable = false,
                IsPensionable = true,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "HEALTH_EE",
                Name = "Health Insurance Premium (Employee)",
                Description = "Pre-tax healthcare payroll deduction",
                Type = "EmployeeContribution",
                CalculationType = "FixedAmount",
                DefaultValue = 180,
                IsTaxable = false,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            },
            new()
            {
                TenantId = tenantId,
                Code = "DENTAL_EE",
                Name = "Dental Insurance Premium (Employee)",
                Description = "Pre-tax dental payroll deduction",
                Type = "EmployeeContribution",
                CalculationType = "FixedAmount",
                DefaultValue = 45,
                IsTaxable = false,
                IsPensionable = false,
                IsRecurring = true,
                IsActive = true
            }
        };
        context.CompensationComponents.AddRange(components);
        context.SaveChanges();

        var allComponents = context.CompensationComponents.ToList();

        // ==========================================
        // 2. PAY GRADES & SALARY BANDS
        // ==========================================
        var grades = new List<PayGrade>
        {
            new() { TenantId = tenantId, Code = "G1", Name = "Associate / Junior Staff", Level = 1, MinimumSalary = 35000, MidpointSalary = 45000, MaximumSalary = 55000 },
            new() { TenantId = tenantId, Code = "G2", Name = "Specialist / Staff Engineer", Level = 2, MinimumSalary = 50000, MidpointSalary = 62500, MaximumSalary = 75000 },
            new() { TenantId = tenantId, Code = "G3", Name = "Senior Specialist / Senior Engineer", Level = 3, MinimumSalary = 70000, MidpointSalary = 82500, MaximumSalary = 95000 },
            new() { TenantId = tenantId, Code = "G4", Name = "Lead / Staff II", Level = 4, MinimumSalary = 90000, MidpointSalary = 107500, MaximumSalary = 125000 },
            new() { TenantId = tenantId, Code = "G5", Name = "Principal / Senior Lead", Level = 5, MinimumSalary = 120000, MidpointSalary = 140000, MaximumSalary = 160000 },
            new() { TenantId = tenantId, Code = "G6", Name = "Engineering Manager / Team Lead", Level = 6, MinimumSalary = 110000, MidpointSalary = 132500, MaximumSalary = 155000 },
            new() { TenantId = tenantId, Code = "G7", Name = "Director / Senior Manager", Level = 7, MinimumSalary = 150000, MidpointSalary = 180000, MaximumSalary = 210000 },
            new() { TenantId = tenantId, Code = "G8", Name = "Vice President / Executive", Level = 8, MinimumSalary = 200000, MidpointSalary = 260000, MaximumSalary = 320000 }
        };
        context.PayGrades.AddRange(grades);
        context.SaveChanges();

        // Salary Bands per Grade
        var bands = new List<SalaryBand>();
        foreach (var g in grades)
        {
            bands.Add(new SalaryBand
            {
                TenantId = tenantId,
                PayGradeId = g.Id,
                BandName = $"{g.Code} Standard Global Band",
                Minimum = g.MinimumSalary,
                Midpoint = g.MidpointSalary,
                Maximum = g.MaximumSalary,
                Country = "United States",
                IsActive = true
            });
            bands.Add(new SalaryBand
            {
                TenantId = tenantId,
                PayGradeId = g.Id,
                BandName = $"{g.Code} Tier-1 Metro Band (+15%)",
                Minimum = Math.Round(g.MinimumSalary * 1.15m),
                Midpoint = Math.Round(g.MidpointSalary * 1.15m),
                Maximum = Math.Round(g.MaximumSalary * 1.15m),
                Country = "United States",
                LocationId = locations.FirstOrDefault()?.Id,
                IsActive = true
            });
        }
        context.SalaryBands.AddRange(bands);
        context.SaveChanges();

        // ==========================================
        // 3. BENEFIT PLANS
        // ==========================================
        var benefitPlans = new List<BenefitPlan>
        {
            new()
            {
                TenantId = tenantId,
                PlanCode = "MED-PPO-PREM",
                PlanName = "BlueCross BlueShield Premier PPO",
                Type = "MedicalInsurance",
                Provider = "BlueCross BlueShield",
                PolicyNumber = "BCBS-2026-9921",
                CoverageAmount = 2000000,
                EmployeeMonthlyCost = 180,
                EmployerMonthlyCost = 650,
                ContributionType = "FixedAmount",
                AllowsDependents = true
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "MED-HDHP-HSA",
                PlanName = "Aetna Choice High-Deductible Health Plan + HSA",
                Type = "MedicalInsurance",
                Provider = "Aetna Health",
                PolicyNumber = "AET-2026-4412",
                CoverageAmount = 1500000,
                EmployeeMonthlyCost = 95,
                EmployerMonthlyCost = 550,
                ContributionType = "FixedAmount",
                AllowsDependents = true
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "DEN-COMP",
                PlanName = "Delta Dental Comprehensive Network",
                Type = "Dental",
                Provider = "Delta Dental",
                PolicyNumber = "DD-2026-3390",
                CoverageAmount = 3000,
                EmployeeMonthlyCost = 35,
                EmployerMonthlyCost = 80,
                ContributionType = "FixedAmount",
                AllowsDependents = true
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "VIS-PREM",
                PlanName = "VSP Vision Care Premium Copay",
                Type = "Vision",
                Provider = "VSP Vision Care",
                PolicyNumber = "VSP-2026-1184",
                CoverageAmount = 1500,
                EmployeeMonthlyCost = 15,
                EmployerMonthlyCost = 35,
                ContributionType = "FixedAmount",
                AllowsDependents = true
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "RET-401K",
                PlanName = "Fidelity 401(k) Retirement Plan & Match",
                Type = "Retirement",
                Provider = "Fidelity Investments",
                PolicyNumber = "FID-401K-092",
                CoverageAmount = 0,
                EmployeeMonthlyCost = 0,
                EmployerMonthlyCost = 0,
                ContributionType = "Percentage",
                EmployerMatchPercentage = 5.0m,
                EmployerMatchLimit = 10000,
                AllowsDependents = false
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "LIFE-GRP",
                PlanName = "MetLife 2x Salary Group Term Life Insurance",
                Type = "LifeInsurance",
                Provider = "MetLife Enterprise",
                PolicyNumber = "MET-LIFE-774",
                CoverageAmount = 500000,
                EmployeeMonthlyCost = 0,
                EmployerMonthlyCost = 45,
                ContributionType = "FixedAmount",
                AllowsDependents = false
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "WELL-SUBS",
                PlanName = "Gympass / Corporate Health & Wellness Subsidy",
                Type = "Wellness",
                Provider = "Gympass Corporate",
                PolicyNumber = "WELL-2026-004",
                CoverageAmount = 1200,
                EmployeeMonthlyCost = 10,
                EmployerMonthlyCost = 75,
                ContributionType = "FixedAmount",
                AllowsDependents = false
            },
            new()
            {
                TenantId = tenantId,
                PlanCode = "COMMUTER",
                PlanName = "WageWorks Pre-Tax Commuter Transit Plan",
                Type = "Transport",
                Provider = "HealthEquity / WageWorks",
                PolicyNumber = "WW-TRANS-881",
                CoverageAmount = 3600,
                EmployeeMonthlyCost = 50,
                EmployerMonthlyCost = 150,
                ContributionType = "FixedAmount",
                AllowsDependents = false
            }
        };
        context.BenefitPlans.AddRange(benefitPlans);
        context.SaveChanges();

        // ==========================================
        // 4. EMPLOYEE COMPENSATION & ASSIGNMENTS (60+ Employees)
        // ==========================================
        var comps = new List<EmployeeCompensation>();
        var seededCount = 0;

        foreach (var emp in employees)
        {
            var grade = faker.PickRandom(grades);
            var band = bands.FirstOrDefault(b => b.PayGradeId == grade.Id) ?? bands.First();

            // Random salary within band (+/- variance)
            var baseSalary = Math.Round(faker.Random.Decimal(band.Minimum * 0.95m, band.Maximum * 1.05m), 0);
            var midpoint = band.Midpoint > 0 ? band.Midpoint : grade.MidpointSalary;
            var compaRatio = Math.Round(baseSalary / midpoint, 2);

            var monthlyBase = baseSalary / 12;
            var trans = 400m;
            var meal = 250m;
            var med = 300m;
            var hra = Math.Round(monthlyBase * 0.30m, 2);
            var monthlyTotal = monthlyBase + trans + meal + med + hra;
            var annualTotal = (monthlyTotal * 12);

            var comp = new EmployeeCompensation
            {
                TenantId = tenantId,
                EmployeeId = emp.Id,
                PayGradeId = grade.Id,
                SalaryBandId = band.Id,
                BaseSalary = baseSalary,
                Currency = "USD",
                AnnualTotalCompensation = Math.Round(annualTotal, 2),
                MonthlyTotalCompensation = Math.Round(monthlyTotal, 2),
                CompaRatio = compaRatio,
                EffectiveDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                IsCurrent = true,
                Status = "Active",
                Assignments = new List<CompensationComponentAssignment>
                {
                    new()
                    {
                        TenantId = tenantId,
                        ComponentId = compBasic.Id,
                        Amount = Math.Round(monthlyBase, 2),
                        CalculatedMonthlyAmount = Math.Round(monthlyBase, 2),
                        CalculatedAnnualAmount = baseSalary
                    },
                    new()
                    {
                        TenantId = tenantId,
                        ComponentId = allComponents.First(c => c.Code == "HRA").Id,
                        Percentage = 30,
                        Amount = hra,
                        CalculatedMonthlyAmount = hra,
                        CalculatedAnnualAmount = hra * 12
                    },
                    new()
                    {
                        TenantId = tenantId,
                        ComponentId = allComponents.First(c => c.Code == "TRANS").Id,
                        Amount = trans,
                        CalculatedMonthlyAmount = trans,
                        CalculatedAnnualAmount = trans * 12
                    },
                    new()
                    {
                        TenantId = tenantId,
                        ComponentId = allComponents.First(c => c.Code == "MEAL").Id,
                        Amount = meal,
                        CalculatedMonthlyAmount = meal,
                        CalculatedAnnualAmount = meal * 12
                    },
                    new()
                    {
                        TenantId = tenantId,
                        ComponentId = allComponents.First(c => c.Code == "MED").Id,
                        Amount = med,
                        CalculatedMonthlyAmount = med,
                        CalculatedAnnualAmount = med * 12
                    }
                }
            };
            comps.Add(comp);
            seededCount++;
        }
        context.EmployeeCompensations.AddRange(comps);
        context.SaveChanges();

        // ==========================================
        // 5. COMPENSATION HISTORIES (Revisions & Promotions)
        // ==========================================
        var histories = new List<CompensationHistory>();
        foreach (var c in comps.Take(25))
        {
            var oldSalary = Math.Round(c.BaseSalary * 0.92m, 0);
            histories.Add(new CompensationHistory
            {
                TenantId = tenantId,
                EmployeeId = c.EmployeeId,
                PreviousSalary = oldSalary,
                NewSalary = c.BaseSalary,
                IncreaseAmount = c.BaseSalary - oldSalary,
                PercentageIncrease = Math.Round(((c.BaseSalary - oldSalary) / oldSalary) * 100, 2),
                PreviousGradeId = c.PayGradeId,
                NewGradeId = c.PayGradeId,
                EffectiveDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                ChangeType = faker.PickRandom("AnnualReview", "MeritIncrease", "Promotion", "MarketAdjustment"),
                Reason = "FY2026 Annual Merit & Performance Increase",
                InitiatedBy = "HR Operations",
                ApprovedBy = "CFO & Compensation Committee",
                ApprovalDate = new DateTime(2025, 12, 18, 0, 0, 0, DateTimeKind.Utc),
                Comments = "Approved per corporate merit guidance."
            });
        }
        context.CompensationHistories.AddRange(histories);
        context.SaveChanges();

        // ==========================================
        // 6. BONUSES & INCENTIVES
        // ==========================================
        var bonuses = new List<EmployeeBonus>();
        foreach (var c in comps.Take(30))
        {
            var bonusAmt = Math.Round(c.BaseSalary * faker.Random.Decimal(0.08m, 0.20m), 0);
            bonuses.Add(new EmployeeBonus
            {
                TenantId = tenantId,
                EmployeeId = c.EmployeeId,
                BonusType = faker.PickRandom("PerformanceBonus", "SpotBonus", "AnnualBonus", "RetentionBonus", "ProjectBonus"),
                Amount = bonusAmt,
                TargetAmount = bonusAmt,
                AchievementPercentage = faker.Random.Decimal(95, 120),
                Currency = "USD",
                EffectiveDate = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc),
                PaymentDate = new DateTime(2026, 9, 15, 0, 0, 0, DateTimeKind.Utc),
                Reason = "Q2 Executive Performance & Milestone Delivery Award",
                Status = "Approved",
                ApprovedBy = "Executive Compensation Committee",
                ApprovedAt = new DateTime(2026, 8, 15, 0, 0, 0, DateTimeKind.Utc),
                IsPayrollProcessed = false
            });
        }
        context.EmployeeBonuses.AddRange(bonuses);
        context.SaveChanges();

        // ==========================================
        // 7. SALARY REVISIONS (Pending & Active)
        // ==========================================
        var revisions = new List<SalaryRevision>();
        var revIdx = 1;
        foreach (var c in comps.Take(8))
        {
            var propSalary = Math.Round(c.BaseSalary * 1.08m, 0);
            revisions.Add(new SalaryRevision
            {
                TenantId = tenantId,
                RevisionNumber = $"REV-2026-{revIdx++:D5}",
                EmployeeId = c.EmployeeId,
                CurrentSalary = c.BaseSalary,
                ProposedSalary = propSalary,
                IncreaseAmount = propSalary - c.BaseSalary,
                PercentageIncrease = 8.0m,
                EffectiveDate = new DateTime(2026, 10, 1, 0, 0, 0, DateTimeKind.Utc),
                Reason = "Promotion",
                Comments = "Proposed elevation to senior level with expanded team mentorship responsibilities.",
                Status = revIdx <= 4 ? "Submitted" : "Approved"
            });
        }
        context.SalaryRevisions.AddRange(revisions);
        context.SaveChanges();

        // ==========================================
        // 8. DEPENDENTS & BENEFIT ENROLLMENTS
        // ==========================================
        var medPlan = benefitPlans.First(b => b.PlanCode == "MED-PPO-PREM");
        var denPlan = benefitPlans.First(b => b.PlanCode == "DEN-COMP");
        var visPlan = benefitPlans.First(b => b.PlanCode == "VIS-PREM");
        var retPlan = benefitPlans.First(b => b.PlanCode == "RET-401K");

        var enrollments = new List<BenefitEnrollment>();
        var dependents = new List<EmployeeDependent>();
        var enrIdx = 1;

        foreach (var c in comps.Take(45))
        {
            // Add Dependent
            var dep = new EmployeeDependent
            {
                TenantId = tenantId,
                EmployeeId = c.EmployeeId,
                FirstName = faker.Name.FirstName(),
                LastName = faker.Name.LastName(),
                Relationship = faker.PickRandom("Spouse", "Child", "DomesticPartner"),
                DateOfBirth = DateTime.UtcNow.AddYears(-faker.Random.Int(5, 45)),
                Gender = faker.PickRandom("Male", "Female"),
                NationalId = $"***-**-{faker.Random.Int(1000, 9999)}",
                ContactPhone = faker.Phone.PhoneNumber(),
                VerificationStatus = "Verified"
            };
            dependents.Add(dep);

            // Enroll in Medical
            enrollments.Add(new BenefitEnrollment
            {
                TenantId = tenantId,
                EnrollmentNumber = $"BEN-2026-{enrIdx++:D5}",
                EmployeeId = c.EmployeeId,
                BenefitPlanId = medPlan.Id,
                CoverageTier = faker.PickRandom("EmployeeOnly", "EmployeeSpouse", "Family"),
                EmployeeMonthlyContribution = medPlan.EmployeeMonthlyCost,
                EmployerMonthlyContribution = medPlan.EmployerMonthlyCost,
                EnrollmentDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EffectiveDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                RenewalDate = new DateTime(2027, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active"
            });

            // Enroll in Dental
            enrollments.Add(new BenefitEnrollment
            {
                TenantId = tenantId,
                EnrollmentNumber = $"BEN-2026-{enrIdx++:D5}",
                EmployeeId = c.EmployeeId,
                BenefitPlanId = denPlan.Id,
                CoverageTier = "EmployeeOnly",
                EmployeeMonthlyContribution = denPlan.EmployeeMonthlyCost,
                EmployerMonthlyContribution = denPlan.EmployerMonthlyCost,
                EnrollmentDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EffectiveDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                RenewalDate = new DateTime(2027, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active"
            });

            // Enroll in 401(k)
            enrollments.Add(new BenefitEnrollment
            {
                TenantId = tenantId,
                EnrollmentNumber = $"BEN-2026-{enrIdx++:D5}",
                EmployeeId = c.EmployeeId,
                BenefitPlanId = retPlan.Id,
                CoverageTier = "EmployeeOnly",
                EmployeeMonthlyContribution = Math.Round((c.BaseSalary / 12) * 0.05m, 2),
                EmployerMonthlyContribution = Math.Round((c.BaseSalary / 12) * 0.05m, 2),
                EnrollmentDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EffectiveDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                RenewalDate = new DateTime(2027, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Status = "Active"
            });
        }
        context.EmployeeDependents.AddRange(dependents);
        context.BenefitEnrollments.AddRange(enrollments);
        context.SaveChanges();

        // ==========================================
        // 9. COMPENSATION REVIEW CYCLES & BUDGETS
        // ==========================================
        var cycle = new CompensationReviewCycle
        {
            TenantId = tenantId,
            CycleName = "FY2026 Annual Merit & Compensation Review",
            FiscalYear = 2026,
            StartDate = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc),
            EffectiveDate = new DateTime(2027, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            TotalBudget = 350000,
            AllocatedBudget = 350000,
            UsedBudget = 98400,
            Status = "Open",
            Guidelines = "Target average merit increase: 3.5%. Top 15% tier eligible for up to 7.5%."
        };
        context.CompensationReviewCycles.Add(cycle);
        context.SaveChanges();

        var reviewItems = new List<CompensationReviewItem>();
        foreach (var c in comps.Take(25))
        {
            var increasePct = faker.Random.Decimal(2.5m, 6.0m);
            var increaseAmt = Math.Round(c.BaseSalary * (increasePct / 100), 0);
            var propSalary = c.BaseSalary + increaseAmt;

            reviewItems.Add(new CompensationReviewItem
            {
                TenantId = tenantId,
                ReviewCycleId = cycle.Id,
                EmployeeId = c.EmployeeId,
                CurrentSalary = c.BaseSalary,
                CurrentCompaRatio = c.CompaRatio,
                ProposedSalary = propSalary,
                ProposedIncreasePercentage = Math.Round(increasePct, 2),
                ProposedIncreaseAmount = increaseAmt,
                NewCompaRatio = Math.Round(c.CompaRatio * (1 + (increasePct / 100)), 2),
                ManagerRecommendation = "Meets and frequently exceeds milestone deliverables. Recommended for merit award.",
                ManagerComments = "Demonstrates strong technical leadership.",
                Status = "InReview"
            });
        }
        context.CompensationReviewItems.AddRange(reviewItems);
        context.SaveChanges();
    }
}
