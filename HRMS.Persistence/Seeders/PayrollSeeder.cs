using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using HRMS.Domain.Entities.Payroll;
using Microsoft.Extensions.DependencyInjection;

namespace HRMS.Persistence.Seeders;

public static class PayrollSeeder
{
    public static void Seed(HrmsDbContext context)
    {
        var employees = context.Employees.ToList();
        if (!employees.Any()) return;

        var tenantId = employees.FirstOrDefault()?.TenantId ?? Guid.Empty;

        if (context.SalaryStructures.Any())
        {
            // If already seeded, ensure 6 months of historical PayrollRuns exist with TenantId
            if (context.PayrollRuns.Count() < 6)
            {
                var existingMonths = context.PayrollRuns.Select(p => p.Month).ToHashSet();
                var histMonths = new[]
                {
                    ("March 2026", new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc), 0.91m),
                    ("April 2026", new DateTime(2026, 4, 28, 0, 0, 0, DateTimeKind.Utc), 0.93m),
                    ("May 2026", new DateTime(2026, 5, 28, 0, 0, 0, DateTimeKind.Utc), 0.95m),
                    ("June 2026", new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc), 0.97m),
                    ("July 2026", new DateTime(2026, 7, 28, 0, 0, 0, DateTimeKind.Utc), 0.98m),
                    ("August 2026", new DateTime(2026, 8, 28, 0, 0, 0, DateTimeKind.Utc), 1.00m)
                };
                var existingSalaries = context.EmployeeSalaries.ToList();
                var baseGross = existingSalaries.Any() ? existingSalaries.Sum(s => s.GrossSalary) : 580000m;
                foreach (var (mName, pDate, factor) in histMonths)
                {
                    if (!existingMonths.Contains(mName))
                    {
                        var gross = Math.Round(baseGross * factor, 2);
                        var deductions = Math.Round(gross * 0.20m, 2);
                        context.PayrollRuns.Add(new PayrollRun
                        {
                            Id = Guid.NewGuid(),
                            TenantId = tenantId,
                            Month = mName,
                            ProcessDate = pDate,
                            Status = "Processed",
                            ProcessedBy = "System",
                            TotalGrossSalary = gross,
                            TotalDeductions = deductions,
                            TotalNetSalary = gross - deductions
                        });
                    }
                }
                context.SaveChanges();
            }
            return;
        }

        var faker = new Faker();

        // 1. Seed Salary Structures
        var structures = new List<SalaryStructure>
        {
            new SalaryStructure { Id = Guid.NewGuid(), Name = "Executive Band (Level 1)", BaseAmount = 150000, Description = "CXO and VP Level" },
            new SalaryStructure { Id = Guid.NewGuid(), Name = "Management Band (Level 2)", BaseAmount = 90000, Description = "Directors and Managers" },
            new SalaryStructure { Id = Guid.NewGuid(), Name = "Professional Band (Level 3)", BaseAmount = 50000, Description = "Senior Engineers and Analysts" },
            new SalaryStructure { Id = Guid.NewGuid(), Name = "Associate Band (Level 4)", BaseAmount = 30000, Description = "Entry level staff" }
        };
        context.SalaryStructures.AddRange(structures);
        context.SaveChanges();

        // 2. Seed Employee Salaries
        var salaries = new List<EmployeeSalary>();
        foreach (var emp in employees)
        {
            var structure = faker.PickRandom(structures);
            salaries.Add(new EmployeeSalary
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                SalaryStructureId = structure.Id,
                GrossSalary = structure.BaseAmount + faker.Random.Decimal(5000, 20000),
                EffectiveDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }
        context.EmployeeSalaries.AddRange(salaries);

        // 3. Seed Payroll Runs (Last 6 Months: March 2026 to August 2026)
        var months = new[]
        {
            ("March 2026", new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc), 0.91m),
            ("April 2026", new DateTime(2026, 4, 28, 0, 0, 0, DateTimeKind.Utc), 0.93m),
            ("May 2026", new DateTime(2026, 5, 28, 0, 0, 0, DateTimeKind.Utc), 0.95m),
            ("June 2026", new DateTime(2026, 6, 28, 0, 0, 0, DateTimeKind.Utc), 0.97m),
            ("July 2026", new DateTime(2026, 7, 28, 0, 0, 0, DateTimeKind.Utc), 0.98m),
            ("August 2026", new DateTime(2026, 8, 28, 0, 0, 0, DateTimeKind.Utc), 1.00m)
        };

        var baseTotalGross = salaries.Sum(s => s.GrossSalary);
        var runs = new List<PayrollRun>();
        PayrollRun? augustRun = null;

        foreach (var (monthName, pDate, factor) in months)
        {
            var gross = Math.Round(baseTotalGross * factor, 2);
            var deductions = Math.Round(gross * 0.20m, 2);
            var net = gross - deductions;

            var r = new PayrollRun
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Month = monthName,
                ProcessDate = pDate,
                Status = "Processed",
                ProcessedBy = "System",
                TotalGrossSalary = gross,
                TotalDeductions = deductions,
                TotalNetSalary = net
            };
            runs.Add(r);
            if (monthName == "August 2026") augustRun = r;
        }
        context.PayrollRuns.AddRange(runs);
        var run = augustRun ?? runs.Last();

        // 4. Seed Payslips
        var payslips = new List<Payslip>();
        var components = new List<PayslipComponent>();
        
        foreach (var sal in salaries)
        {
            var p = new Payslip
            {
                Id = Guid.NewGuid(),
                PayrollRunId = run.Id,
                EmployeeId = sal.EmployeeId,
                GrossSalary = sal.GrossSalary,
                TotalAllowances = sal.GrossSalary * 0.3m,
                TotalDeductions = sal.GrossSalary * 0.2m,
                NetSalary = sal.GrossSalary - (sal.GrossSalary * 0.2m),
                Status = "Paid"
            };
            payslips.Add(p);

            components.Add(new PayslipComponent { Id = Guid.NewGuid(), PayslipId = p.Id, Name = "Basic", Type = "Allowance", Amount = sal.GrossSalary * 0.5m });
            components.Add(new PayslipComponent { Id = Guid.NewGuid(), PayslipId = p.Id, Name = "HRA", Type = "Allowance", Amount = sal.GrossSalary * 0.2m });
            components.Add(new PayslipComponent { Id = Guid.NewGuid(), PayslipId = p.Id, Name = "Tax", Type = "Tax", Amount = sal.GrossSalary * 0.15m });
            components.Add(new PayslipComponent { Id = Guid.NewGuid(), PayslipId = p.Id, Name = "Provident Fund", Type = "Deduction", Amount = sal.GrossSalary * 0.05m });
        }
        context.Payslips.AddRange(payslips);
        context.PayslipComponents.AddRange(components);

        // 5. Seed Loans (5% of employees)
        var loans = new List<Loan>();
        foreach (var emp in employees.Where(e => faker.Random.Bool(0.05f)))
        {
            loans.Add(new Loan
            {
                Id = Guid.NewGuid(),
                EmployeeId = emp.Id,
                LoanType = "Personal",
                PrincipalAmount = 50000,
                InterestRate = 5.0m,
                TenureMonths = 12,
                EmiAmount = 4300,
                OutstandingAmount = 30000,
                Status = "Active"
            });
        }
        context.Loans.AddRange(loans);

        context.SaveChanges();
    }
}

