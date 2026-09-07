using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Domain.Entities.Travel;
using Bogus;

namespace HRMS.Persistence.Seeders;

public static class TravelSeeder
{
    public static async Task SeedAsync(HrmsDbContext db)
    {
        var tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        // Seed Expense Categories if none exist
        if (!await db.ExpenseCategories.AnyAsync(c => c.TenantId == tenantId))
        {
            var categories = new[]
            {
                new ExpenseCategory { TenantId = tenantId, Code = "AIRFARE", Name = "Airfare", Description = "Flights and air travel", ReceiptRequired = true, TaxApplicable = false, PolicyControlled = true, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "HOTEL", Name = "Hotel / Accommodation", Description = "Hotel stays and short-term rentals", ReceiptRequired = true, TaxApplicable = true, PolicyControlled = true, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "MEALS", Name = "Meals & Entertainment", Description = "Business meals and dining", ReceiptRequired = true, TaxApplicable = true, PolicyControlled = true, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "GROUND_TRANS", Name = "Ground Transportation", Description = "Taxi, rideshare, car rental", ReceiptRequired = false, TaxApplicable = false, PolicyControlled = false, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "INTERNET", Name = "Internet & Phone", Description = "Mobile data and internet charges", ReceiptRequired = false, TaxApplicable = false, PolicyControlled = false, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "PARKING", Name = "Parking & Tolls", Description = "Parking fees and road tolls", ReceiptRequired = false, TaxApplicable = false, PolicyControlled = false, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "OFFICE_SUPPLIES", Name = "Office Supplies", Description = "Stationery, printing, work materials", ReceiptRequired = true, TaxApplicable = true, PolicyControlled = false, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "TRAINING", Name = "Training & Conferences", Description = "Registration fees, training materials", ReceiptRequired = true, TaxApplicable = false, PolicyControlled = true, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "CLIENT_ENT", Name = "Client Entertainment", Description = "Client meals, gifts, entertainment", ReceiptRequired = true, TaxApplicable = true, PolicyControlled = true, IsActive = true },
                new ExpenseCategory { TenantId = tenantId, Code = "MISC", Name = "Miscellaneous", Description = "Other business expenses", ReceiptRequired = false, TaxApplicable = false, PolicyControlled = false, IsActive = true },
            };
            db.ExpenseCategories.AddRange(categories);
            await db.SaveChangesAsync();
        }

        // Seed Policy Rules if none exist
        if (!await db.ExpensePolicyRules.AnyAsync(r => r.TenantId == tenantId))
        {
            var airfareCategory = await db.ExpenseCategories.FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Code == "AIRFARE");
            var hotelCategory = await db.ExpenseCategories.FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Code == "HOTEL");
            var mealsCategory = await db.ExpenseCategories.FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Code == "MEALS");
            var clientEntCategory = await db.ExpenseCategories.FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Code == "CLIENT_ENT");

            var rules = new List<ExpensePolicyRule>();

            if (airfareCategory != null)
                rules.Add(new ExpensePolicyRule { TenantId = tenantId, CategoryId = airfareCategory.Id, RuleType = "MaxAmount", MaxAmount = 1500, Currency = "USD", ConditionValue = "", ViolationSeverity = "Warning", IsActive = true });
            if (hotelCategory != null)
                rules.Add(new ExpensePolicyRule { TenantId = tenantId, CategoryId = hotelCategory.Id, RuleType = "MaxAmount", MaxAmount = 250, Currency = "USD", ConditionValue = "per_night", ViolationSeverity = "Warning", IsActive = true });
            if (mealsCategory != null)
                rules.Add(new ExpensePolicyRule { TenantId = tenantId, CategoryId = mealsCategory.Id, RuleType = "MaxAmount", MaxAmount = 100, Currency = "USD", ConditionValue = "per_day", ViolationSeverity = "Warning", IsActive = true });
            if (clientEntCategory != null)
                rules.Add(new ExpensePolicyRule { TenantId = tenantId, CategoryId = clientEntCategory.Id, RuleType = "MaxAmount", MaxAmount = 500, Currency = "USD", ConditionValue = "", ViolationSeverity = "Violation", IsActive = true });

            if (rules.Count > 0)
            {
                db.ExpensePolicyRules.AddRange(rules);
                await db.SaveChangesAsync();
            }
        }

        if (!await db.Trips.AnyAsync(t => t.TenantId == tenantId))
        {
            var employees = await db.Employees.Where(e => !e.IsDeleted).Take(50).ToListAsync();
            if (!employees.Any()) return;

            var categoriesList = await db.ExpenseCategories.Where(c => c.TenantId == tenantId).ToListAsync();
            var faker = new Faker();
            var destinations = new[] { "New York", "London", "Tokyo", "Singapore", "Berlin", "San Francisco" };

            var requests = new List<TravelRequest>();
            var trips = new List<Trip>();
            var allExpenses = new List<Expense>();
            var allItineraries = new List<TravelItineraryItem>();
            var reports = new List<ExpenseReport>();

            foreach (var employee in employees.Take(20))
            {
                var numTrips = faker.Random.Int(1, 3);
                for (int i = 0; i < numTrips; i++)
                {
                    var destination = faker.PickRandom(destinations);
                    var departure = faker.Date.Recent(60);
                    var returnDate = departure.AddDays(faker.Random.Int(2, 7));

                    var req = new TravelRequest
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        EmployeeId = employee.Id,
                        Purpose = "Client Meeting",
                        BusinessJustification = "Discussing Q3 roadmaps with the client.",
                        TravelType = "International",
                        Origin = "Headquarters",
                        Destination = destination,
                        DepartureDate = departure,
                        ReturnDate = returnDate,
                        EstimatedCost = faker.Random.Int(1000, 5000),
                        Currency = "USD",
                        Status = "Approved",
                        CreatedAt = departure.AddDays(-14)
                    };
                    requests.Add(req);

                    var trip = new Trip
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        TravelRequestId = req.Id,
                        EmployeeId = employee.Id,
                        Status = returnDate < DateTime.UtcNow ? "Completed" : "Upcoming",
                        CreatedAt = req.CreatedAt.AddDays(1)
                    };
                    trips.Add(trip);

                    // Flight
                    allItineraries.Add(new TravelItineraryItem
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        TripId = trip.Id,
                        Type = "Flight",
                        Provider = faker.Company.CompanyName() + " Airlines",
                        BookingReference = faker.Random.AlphaNumeric(6).ToUpper(),
                        Origin = "Headquarters",
                        Destination = destination,
                        StartDateTime = departure,
                        EndDateTime = departure.AddHours(faker.Random.Int(2, 14)),
                        Cost = faker.Random.Int(400, 1500),
                        Currency = "USD",
                        CreatedAt = trip.CreatedAt
                    });

                    // Hotel
                    allItineraries.Add(new TravelItineraryItem
                    {
                        Id = Guid.NewGuid(),
                        TenantId = tenantId,
                        TripId = trip.Id,
                        Type = "Hotel",
                        Provider = faker.Company.CompanyName() + " Hotels",
                        BookingReference = faker.Random.AlphaNumeric(8).ToUpper(),
                        Origin = destination,
                        Destination = destination,
                        StartDateTime = departure.AddHours(16),
                        EndDateTime = returnDate.AddHours(10),
                        Cost = faker.Random.Int(500, 2000),
                        Currency = "USD",
                        CreatedAt = trip.CreatedAt
                    });

                    // Expenses for this trip
                    var empExpenses = new List<Expense>();
                    int numExpenses = faker.Random.Int(2, 5);
                    for (int e = 0; e < numExpenses; e++)
                    {
                        var cat = faker.PickRandom(categoriesList);
                        empExpenses.Add(new Expense
                        {
                            Id = Guid.NewGuid(),
                            TenantId = tenantId,
                            EmployeeId = employee.Id,
                            TripId = trip.Id,
                            CategoryId = cat.Id,
                            ExpenseDate = faker.Date.Between(departure, returnDate),
                            Merchant = faker.Company.CompanyName(),
                            Description = $"{cat.Name} expense",
                            Amount = faker.Random.Decimal(20, 300),
                            Currency = "USD",
                            ExchangeRate = 1.0m,
                            ConvertedAmount = faker.Random.Decimal(20, 300),
                            PaymentMethod = "Corporate Card",
                            Status = "Draft",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    allExpenses.AddRange(empExpenses);

                    if (trip.Status == "Completed" && empExpenses.Any())
                    {
                        var total = empExpenses.Sum(e => e.ConvertedAmount);
                        var report = new ExpenseReport
                        {
                            Id = Guid.NewGuid(),
                            TenantId = tenantId,
                            EmployeeId = employee.Id,
                            TripId = trip.Id,
                            ReportNumber = $"EXP-{faker.Random.Number(1000, 9999)}",
                            Title = $"Travel to {destination}",
                            PeriodStart = empExpenses.Min(e => e.ExpenseDate),
                            PeriodEnd = empExpenses.Max(e => e.ExpenseDate),
                            TotalAmount = total,
                            Currency = "USD",
                            ReimbursableAmount = total,
                            Status = faker.PickRandom(new[] { "Submitted", "ManagerReview", "Approved", "Reimbursed" }),
                            CreatedAt = DateTime.UtcNow
                        };
                        reports.Add(report);

                        foreach (var ex in empExpenses)
                        {
                            ex.ExpenseReportId = report.Id;
                            ex.Status = report.Status;
                        }
                    }
                }
            }

            db.TravelRequests.AddRange(requests);
            db.Trips.AddRange(trips);
            db.TravelItineraryItems.AddRange(allItineraries);
            db.Expenses.AddRange(allExpenses);
            db.ExpenseReports.AddRange(reports);

            await db.SaveChangesAsync();
        }
    }
}
