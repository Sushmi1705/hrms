using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Travel.DTOs;
using HRMS.Domain.Entities.Travel;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Persistence.Repositories;

public class TravelRepository : ITravelRepository
{
    private readonly HrmsDbContext _db;
    private readonly ITenantContext _tenantContext;
    private Guid TenantId => _tenantContext.CurrentTenantId ?? Guid.Parse("11111111-1111-1111-1111-111111111111");

    public TravelRepository(HrmsDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<EmployeeEntity?> ResolveEmployeeAsync(Guid? overrideId = null, string? overrideEmail = null)
    {
        if (overrideId.HasValue)
        {
            var emp = await _db.Employees.Include(e => e.Department).Include(e => e.Designation)
                .FirstOrDefaultAsync(e => e.Id == overrideId.Value && e.Status == "Active");
            if (emp != null) return emp;
        }
        if (!string.IsNullOrEmpty(overrideEmail))
        {
            var emp = await _db.Employees.Include(e => e.Department).Include(e => e.Designation)
                .FirstOrDefaultAsync(e => e.Email == overrideEmail && e.Status == "Active");
            if (emp != null) return emp;
        }
        return await _db.Employees.Include(e => e.Department).Include(e => e.Designation)
            .FirstOrDefaultAsync(e => e.Status == "Active");
    }

    public async Task<TravelDashboardDto> GetDashboardAsync(Guid tenantId, Guid? employeeId = null)
    {
        var requestsQ = _db.TravelRequests.Where(r => r.TenantId == tenantId);
        if (employeeId.HasValue) requestsQ = requestsQ.Where(r => r.EmployeeId == employeeId.Value);

        var reportsQ = _db.ExpenseReports.Where(r => r.TenantId == tenantId);
        if (employeeId.HasValue) reportsQ = reportsQ.Where(r => r.EmployeeId == employeeId.Value);

        var tripsQ = _db.Trips.Where(t => t.TenantId == tenantId);
        if (employeeId.HasValue) tripsQ = tripsQ.Where(t => t.EmployeeId == employeeId.Value);

        var advancesQ = _db.TravelAdvances.Where(a => a.TenantId == tenantId && a.Status != "Settled" && a.Status != "Cancelled");
        if (employeeId.HasValue) advancesQ = advancesQ.Where(a => a.EmployeeId == employeeId.Value);

        var expensesQ = _db.Expenses.Where(e => e.TenantId == tenantId);
        if (employeeId.HasValue) expensesQ = expensesQ.Where(e => e.EmployeeId == employeeId.Value);

        var totalRequests = await requestsQ.CountAsync();
        var pendingApprovals = await requestsQ.CountAsync(r => r.Status == "Submitted");
        var activeTrips = await tripsQ.CountAsync(t => t.Status == "InProgress");
        var completedTrips = await tripsQ.CountAsync(t => t.Status == "Completed");
        var totalSpend = await expensesQ.Where(e => e.Status == "Approved").SumAsync(e => (decimal?)e.ConvertedAmount) ?? 0;
        var pendingExpenseReports = await reportsQ.CountAsync(r => r.Status == "Submitted" || r.Status == "ManagerReview");
        var pendingFinanceReview = await reportsQ.CountAsync(r => r.Status == "FinanceReview");
        var pendingReimbursements = await reportsQ.CountAsync(r => r.Status == "Approved" || r.Status == "ReimbursementPending");
        var outstandingAdvances = await advancesQ.SumAsync(a => (decimal?)a.RequestedAmount) ?? 0;
        var violations = await expensesQ.CountAsync(e => e.PolicyStatus == "Violation");

        var spendByMonth = await expensesQ
            .Where(e => e.Status == "Approved" && e.ExpenseDate >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(e => new { e.ExpenseDate.Year, e.ExpenseDate.Month })
            .Select(g => new SpendByMonthDto { Month = g.Key.Year + "-" + g.Key.Month, Amount = g.Sum(e => e.ConvertedAmount) })
            .ToListAsync();

        var spendByCategory = await expensesQ
            .Where(e => e.Status == "Approved")
            .GroupBy(e => e.Category.Name)
            .Select(g => new SpendByCategoryDto { Category = g.Key, Amount = g.Sum(e => e.ConvertedAmount) })
            .ToListAsync();

        var recentRequests = await requestsQ.Include(r => r.Employee).ThenInclude(e => e.Department)
            .OrderByDescending(r => r.CreatedAt).Take(5)
            .Select(r => new TravelRequestDto
            {
                Id = r.Id, Purpose = r.Purpose, TravelType = r.TravelType,
                Origin = r.Origin, Destination = r.Destination,
                DepartureDate = r.DepartureDate, ReturnDate = r.ReturnDate,
                EstimatedCost = r.EstimatedCost, Currency = r.Currency, Status = r.Status,
                EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
                Department = r.Employee.Department != null ? r.Employee.Department.Name : "",
                CreatedAt = r.CreatedAt
            }).ToListAsync();

        return new TravelDashboardDto
        {
            TotalTravelRequests = totalRequests, PendingApprovals = pendingApprovals,
            ActiveTrips = activeTrips, CompletedTrips = completedTrips, TotalTravelSpend = totalSpend,
            PendingExpenseReports = pendingExpenseReports, PendingFinanceReview = pendingFinanceReview,
            PendingReimbursements = pendingReimbursements, OutstandingAdvances = outstandingAdvances,
            PolicyViolations = violations, SpendByMonth = spendByMonth, SpendByCategory = spendByCategory,
            RecentRequests = recentRequests
        };
    }

    public async Task<List<TravelRequestDto>> GetTravelRequestsAsync(Guid tenantId, TravelFilterDto filter)
    {
        var q = _db.TravelRequests.Where(r => r.TenantId == tenantId)
            .Include(r => r.Employee).ThenInclude(e => e.Department).AsNoTracking();
        if (!string.IsNullOrEmpty(filter.Status)) q = q.Where(r => r.Status == filter.Status);
        if (!string.IsNullOrEmpty(filter.TravelType)) q = q.Where(r => r.TravelType == filter.TravelType);
        if (filter.EmployeeId.HasValue) q = q.Where(r => r.EmployeeId == filter.EmployeeId.Value);
        if (!string.IsNullOrEmpty(filter.Search))
            q = q.Where(r => r.Destination.Contains(filter.Search) || r.Purpose.Contains(filter.Search));
        return await q.OrderByDescending(r => r.CreatedAt).Skip((filter.Page - 1) * filter.PageSize).Take(filter.PageSize)
            .Select(r => new TravelRequestDto
            {
                Id = r.Id, Purpose = r.Purpose, BusinessJustification = r.BusinessJustification,
                TravelType = r.TravelType, Origin = r.Origin, Destination = r.Destination,
                DepartureDate = r.DepartureDate, ReturnDate = r.ReturnDate,
                EstimatedCost = r.EstimatedCost, Currency = r.Currency, Status = r.Status,
                AdvanceRequired = r.AdvanceRequired, AdvanceAmount = r.AdvanceAmount, Notes = r.Notes,
                EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
                EmployeeCode = r.Employee.EmployeeNumber,
                Department = r.Employee.Department != null ? r.Employee.Department.Name : "",
                CreatedAt = r.CreatedAt
            }).ToListAsync();
    }

    public async Task<TravelRequestDto?> GetTravelRequestAsync(Guid tenantId, Guid id)
    {
        return await _db.TravelRequests.Include(r => r.Employee).ThenInclude(e => e.Department).AsNoTracking()
            .Where(r => r.TenantId == tenantId && r.Id == id)
            .Select(r => new TravelRequestDto
            {
                Id = r.Id, Purpose = r.Purpose, BusinessJustification = r.BusinessJustification,
                TravelType = r.TravelType, Origin = r.Origin, Destination = r.Destination,
                DepartureDate = r.DepartureDate, ReturnDate = r.ReturnDate,
                EstimatedCost = r.EstimatedCost, Currency = r.Currency, Status = r.Status,
                AdvanceRequired = r.AdvanceRequired, AdvanceAmount = r.AdvanceAmount, Notes = r.Notes,
                EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
                EmployeeCode = r.Employee.EmployeeNumber,
                Department = r.Employee.Department != null ? r.Employee.Department.Name : "",
                CreatedAt = r.CreatedAt
            }).FirstOrDefaultAsync();
    }

    public async Task<TravelRequestDto> CreateTravelRequestAsync(Guid tenantId, Guid employeeId, CreateTravelRequestDto dto)
    {
        var entity = new TravelRequest
        {
            TenantId = tenantId, EmployeeId = employeeId, Purpose = dto.Purpose,
            BusinessJustification = dto.BusinessJustification, TravelType = dto.TravelType,
            Origin = dto.Origin, Destination = dto.Destination, DepartureDate = dto.DepartureDate,
            ReturnDate = dto.ReturnDate, EstimatedCost = dto.EstimatedCost, Currency = dto.Currency,
            CostCenterId = dto.CostCenterId, AdvanceRequired = dto.AdvanceRequired,
            AdvanceAmount = dto.AdvanceAmount, Notes = dto.Notes, Status = "Draft"
        };
        _db.TravelRequests.Add(entity);
        await _db.SaveChangesAsync();
        return (await GetTravelRequestAsync(tenantId, entity.Id))!;
    }

    public async Task<TravelRequestDto> UpdateTravelRequestAsync(Guid tenantId, Guid id, CreateTravelRequestDto dto)
    {
        var entity = await _db.TravelRequests.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id);
        if (entity == null) throw new KeyNotFoundException("Travel request not found.");
        entity.Purpose = dto.Purpose; entity.BusinessJustification = dto.BusinessJustification;
        entity.TravelType = dto.TravelType; entity.Origin = dto.Origin; entity.Destination = dto.Destination;
        entity.DepartureDate = dto.DepartureDate; entity.ReturnDate = dto.ReturnDate;
        entity.EstimatedCost = dto.EstimatedCost; entity.Currency = dto.Currency;
        entity.CostCenterId = dto.CostCenterId; entity.AdvanceRequired = dto.AdvanceRequired;
        entity.AdvanceAmount = dto.AdvanceAmount; entity.Notes = dto.Notes;
        entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return (await GetTravelRequestAsync(tenantId, id))!;
    }

    public async Task<bool> SubmitTravelRequestAsync(Guid tenantId, Guid id, Guid employeeId)
    {
        var entity = await _db.TravelRequests.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id && r.EmployeeId == employeeId);
        if (entity == null || entity.Status != "Draft") return false;
        entity.Status = "Submitted"; entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ApproveTravelRequestAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments)
    {
        var entity = await _db.TravelRequests.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id);
        if (entity == null) return false;
        entity.Status = approved ? "Approved" : "Rejected";
        entity.UpdatedAt = DateTime.UtcNow;
        if (approved)
        {
            var trip = new Trip
            {
                TenantId = tenantId, TravelRequestId = entity.Id,
                EmployeeId = entity.EmployeeId, Status = "Upcoming"
            };
            _db.Trips.Add(trip);
        }
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelTravelRequestAsync(Guid tenantId, Guid id, Guid employeeId)
    {
        var entity = await _db.TravelRequests.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id && r.EmployeeId == employeeId);
        if (entity == null) return false;
        entity.Status = "Cancelled"; entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<TripDto>> GetTripsAsync(Guid tenantId, Guid? employeeId = null)
    {
        var q = _db.Trips.Where(t => t.TenantId == tenantId)
            .Include(t => t.Employee).ThenInclude(e => e.Department)
            .Include(t => t.TravelRequest).Include(t => t.Expenses).AsNoTracking();
        if (employeeId.HasValue) q = q.Where(t => t.EmployeeId == employeeId.Value);
        return await q.OrderByDescending(t => t.TravelRequest.DepartureDate).Select(t => new TripDto
        {
            Id = t.Id, TravelRequestId = t.TravelRequestId, Status = t.Status,
            EmployeeName = t.Employee.FirstName + " " + t.Employee.LastName,
            Department = t.Employee.Department != null ? t.Employee.Department.Name : "",
            Destination = t.TravelRequest.Destination, DepartureDate = t.TravelRequest.DepartureDate,
            ReturnDate = t.TravelRequest.ReturnDate, TravelType = t.TravelRequest.TravelType,
            EstimatedCost = t.TravelRequest.EstimatedCost, Currency = t.TravelRequest.Currency,
            ActualCost = t.Expenses.Where(e => e.Status == "Approved").Sum(e => e.ConvertedAmount)
        }).ToListAsync();
    }

    public async Task<TripDto?> GetTripAsync(Guid tenantId, Guid id)
    {
        var t = await _db.Trips.Include(t => t.Employee).ThenInclude(e => e.Department)
            .Include(t => t.TravelRequest).Include(t => t.ItineraryItems)
            .Include(t => t.Expenses).ThenInclude(e => e.Category)
            .AsNoTracking().FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id);
        if (t == null) return null;
        return new TripDto
        {
            Id = t.Id, TravelRequestId = t.TravelRequestId, Status = t.Status,
            EmployeeName = t.Employee.FirstName + " " + t.Employee.LastName,
            Department = t.Employee.Department != null ? t.Employee.Department.Name : "",
            Destination = t.TravelRequest.Destination, DepartureDate = t.TravelRequest.DepartureDate,
            ReturnDate = t.TravelRequest.ReturnDate, TravelType = t.TravelRequest.TravelType,
            EstimatedCost = t.TravelRequest.EstimatedCost, Currency = t.TravelRequest.Currency,
            ActualCost = t.Expenses.Where(e => e.Status == "Approved").Sum(e => e.ConvertedAmount),
            ItineraryItems = t.ItineraryItems.Select(i => new ItineraryItemDto
            {
                Id = i.Id, Type = i.Type, Provider = i.Provider, BookingReference = i.BookingReference,
                Origin = i.Origin, Destination = i.Destination, StartDateTime = i.StartDateTime,
                EndDateTime = i.EndDateTime, Cost = i.Cost, Currency = i.Currency, Notes = i.Notes
            }).ToList()
        };
    }

    public async Task<List<ItineraryItemDto>> GetItineraryAsync(Guid tenantId, Guid tripId)
    {
        return await _db.TravelItineraryItems.Where(i => i.TenantId == tenantId && i.TripId == tripId)
            .AsNoTracking().Select(i => new ItineraryItemDto
            {
                Id = i.Id, Type = i.Type, Provider = i.Provider, BookingReference = i.BookingReference,
                Origin = i.Origin, Destination = i.Destination, StartDateTime = i.StartDateTime,
                EndDateTime = i.EndDateTime, Cost = i.Cost, Currency = i.Currency, Notes = i.Notes
            }).ToListAsync();
    }

    public async Task<ItineraryItemDto> AddItineraryItemAsync(Guid tenantId, Guid tripId, CreateItineraryItemDto dto)
    {
        var item = new TravelItineraryItem
        {
            TenantId = tenantId, TripId = tripId, Type = dto.Type, Provider = dto.Provider,
            BookingReference = dto.BookingReference, Origin = dto.Origin, Destination = dto.Destination,
            StartDateTime = dto.StartDateTime, EndDateTime = dto.EndDateTime,
            Cost = dto.Cost, Currency = dto.Currency, Notes = dto.Notes
        };
        _db.TravelItineraryItems.Add(item);
        await _db.SaveChangesAsync();
        return new ItineraryItemDto
        {
            Id = item.Id, Type = item.Type, Provider = item.Provider,
            BookingReference = item.BookingReference, Origin = item.Origin, Destination = item.Destination,
            StartDateTime = item.StartDateTime, EndDateTime = item.EndDateTime,
            Cost = item.Cost, Currency = item.Currency, Notes = item.Notes
        };
    }

    public async Task<List<TravelAdvanceDto>> GetAdvancesAsync(Guid tenantId, Guid? employeeId = null)
    {
        var q = _db.TravelAdvances.Where(a => a.TenantId == tenantId)
            .Include(a => a.Employee).Include(a => a.TravelRequest).AsNoTracking();
        if (employeeId.HasValue) q = q.Where(a => a.EmployeeId == employeeId.Value);
        return await q.OrderByDescending(a => a.CreatedAt).Select(a => new TravelAdvanceDto
        {
            Id = a.Id, RequestedAmount = a.RequestedAmount, Currency = a.Currency,
            Purpose = a.Purpose, RequiredDate = a.RequiredDate, Status = a.Status,
            SettledAmount = a.SettledAmount, Notes = a.Notes, CreatedAt = a.CreatedAt,
            EmployeeName = a.Employee.FirstName + " " + a.Employee.LastName,
            EmployeeCode = a.Employee.EmployeeNumber, TravelRequestId = a.TravelRequestId,
            TravelDestination = a.TravelRequest != null ? a.TravelRequest.Destination : ""
        }).ToListAsync();
    }

    public async Task<TravelAdvanceDto> CreateAdvanceAsync(Guid tenantId, Guid employeeId, CreateTravelAdvanceDto dto)
    {
        var entity = new TravelAdvance
        {
            TenantId = tenantId, EmployeeId = employeeId, TravelRequestId = dto.TravelRequestId,
            RequestedAmount = dto.RequestedAmount, Currency = dto.Currency, Purpose = dto.Purpose,
            RequiredDate = dto.RequiredDate, PaymentMethod = dto.PaymentMethod, Notes = dto.Notes, Status = "Submitted"
        };
        _db.TravelAdvances.Add(entity);
        await _db.SaveChangesAsync();
        return (await GetAdvancesAsync(tenantId, employeeId)).First(a => a.Id == entity.Id);
    }

    public async Task<bool> ApproveAdvanceAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments)
    {
        var entity = await _db.TravelAdvances.FirstOrDefaultAsync(a => a.TenantId == tenantId && a.Id == id);
        if (entity == null) return false;
        entity.Status = approved ? "Approved" : "Rejected"; entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ExpenseCategoryDto>> GetCategoriesAsync(Guid tenantId)
    {
        return await _db.ExpenseCategories.Where(c => c.TenantId == tenantId && c.IsActive).AsNoTracking()
            .Select(c => new ExpenseCategoryDto
            {
                Id = c.Id, Code = c.Code, Name = c.Name, Description = c.Description,
                ReceiptRequired = c.ReceiptRequired, TaxApplicable = c.TaxApplicable,
                PolicyControlled = c.PolicyControlled, IsActive = c.IsActive
            }).ToListAsync();
    }

    public async Task<ExpenseCategoryDto> CreateCategoryAsync(Guid tenantId, CreateExpenseCategoryDto dto)
    {
        var entity = new ExpenseCategory
        {
            TenantId = tenantId, Code = dto.Code, Name = dto.Name, Description = dto.Description,
            ReceiptRequired = dto.ReceiptRequired, TaxApplicable = dto.TaxApplicable,
            PolicyControlled = dto.PolicyControlled, IsActive = true
        };
        _db.ExpenseCategories.Add(entity);
        await _db.SaveChangesAsync();
        return new ExpenseCategoryDto
        {
            Id = entity.Id, Code = entity.Code, Name = entity.Name, Description = entity.Description,
            ReceiptRequired = entity.ReceiptRequired, TaxApplicable = entity.TaxApplicable,
            PolicyControlled = entity.PolicyControlled, IsActive = entity.IsActive
        };
    }

    public async Task<List<ExpenseDto>> GetExpensesAsync(Guid tenantId, Guid? employeeId = null, Guid? tripId = null)
    {
        var q = _db.Expenses.Where(e => e.TenantId == tenantId)
            .Include(e => e.Employee).Include(e => e.Category).AsNoTracking();
        if (employeeId.HasValue) q = q.Where(e => e.EmployeeId == employeeId.Value);
        if (tripId.HasValue) q = q.Where(e => e.TripId == tripId.Value);
        return await q.OrderByDescending(e => e.ExpenseDate).Select(e => new ExpenseDto
        {
            Id = e.Id, EmployeeName = e.Employee.FirstName + " " + e.Employee.LastName,
            CategoryName = e.Category.Name, CategoryId = e.CategoryId, TripId = e.TripId,
            ExpenseReportId = e.ExpenseReportId, ExpenseDate = e.ExpenseDate, Merchant = e.Merchant,
            Description = e.Description, Amount = e.Amount, Currency = e.Currency,
            ExchangeRate = e.ExchangeRate, ConvertedAmount = e.ConvertedAmount,
            PaymentMethod = e.PaymentMethod, ReceiptDocumentId = e.ReceiptDocumentId,
            Status = e.Status, PolicyStatus = e.PolicyStatus, Notes = e.Notes, CreatedAt = e.CreatedAt
        }).ToListAsync();
    }

    public async Task<ExpenseDto?> GetExpenseAsync(Guid tenantId, Guid id)
    {
        return await _db.Expenses.Include(e => e.Employee).Include(e => e.Category).AsNoTracking()
            .Where(e => e.TenantId == tenantId && e.Id == id)
            .Select(e => new ExpenseDto
            {
                Id = e.Id, EmployeeName = e.Employee.FirstName + " " + e.Employee.LastName,
                CategoryName = e.Category.Name, CategoryId = e.CategoryId, TripId = e.TripId,
                ExpenseReportId = e.ExpenseReportId, ExpenseDate = e.ExpenseDate, Merchant = e.Merchant,
                Description = e.Description, Amount = e.Amount, Currency = e.Currency,
                ExchangeRate = e.ExchangeRate, ConvertedAmount = e.ConvertedAmount,
                PaymentMethod = e.PaymentMethod, ReceiptDocumentId = e.ReceiptDocumentId,
                Status = e.Status, PolicyStatus = e.PolicyStatus, Notes = e.Notes, CreatedAt = e.CreatedAt
            }).FirstOrDefaultAsync();
    }

    public async Task<ExpenseDto> CreateExpenseAsync(Guid tenantId, Guid employeeId, CreateExpenseDto dto)
    {
        var policyCheck = await EvaluatePolicyAsync(tenantId, dto.CategoryId, dto.Amount, dto.Currency);
        var entity = new Expense
        {
            TenantId = tenantId, EmployeeId = employeeId, CategoryId = dto.CategoryId,
            TripId = dto.TripId, ExpenseDate = dto.ExpenseDate, Merchant = dto.Merchant,
            Description = dto.Description, Amount = dto.Amount, Currency = dto.Currency,
            ExchangeRate = dto.ExchangeRate, ConvertedAmount = dto.Amount * dto.ExchangeRate,
            PaymentMethod = dto.PaymentMethod, ReceiptDocumentId = dto.ReceiptDocumentId,
            Notes = dto.Notes, Status = "Draft", PolicyStatus = policyCheck.Status
        };
        _db.Expenses.Add(entity);
        await _db.SaveChangesAsync();
        return (await GetExpenseAsync(tenantId, entity.Id))!;
    }

    public async Task<ExpenseDto> UpdateExpenseAsync(Guid tenantId, Guid id, CreateExpenseDto dto)
    {
        var entity = await _db.Expenses.FirstOrDefaultAsync(e => e.TenantId == tenantId && e.Id == id);
        if (entity == null) throw new KeyNotFoundException("Expense not found.");
        var policyCheck = await EvaluatePolicyAsync(tenantId, dto.CategoryId, dto.Amount, dto.Currency);
        entity.CategoryId = dto.CategoryId; entity.TripId = dto.TripId; entity.ExpenseDate = dto.ExpenseDate;
        entity.Merchant = dto.Merchant; entity.Description = dto.Description; entity.Amount = dto.Amount;
        entity.Currency = dto.Currency; entity.ExchangeRate = dto.ExchangeRate;
        entity.ConvertedAmount = dto.Amount * dto.ExchangeRate;
        entity.PaymentMethod = dto.PaymentMethod; entity.ReceiptDocumentId = dto.ReceiptDocumentId;
        entity.Notes = dto.Notes; entity.PolicyStatus = policyCheck.Status; entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return (await GetExpenseAsync(tenantId, id))!;
    }

    public async Task<bool> DeleteExpenseAsync(Guid tenantId, Guid id, Guid employeeId)
    {
        var entity = await _db.Expenses.FirstOrDefaultAsync(e => e.TenantId == tenantId && e.Id == id && e.EmployeeId == employeeId);
        if (entity == null || entity.Status != "Draft") return false;
        entity.IsDeleted = true; entity.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ExpenseReportDto>> GetExpenseReportsAsync(Guid tenantId, Guid? employeeId = null, string? status = null)
    {
        var q = _db.ExpenseReports.Where(r => r.TenantId == tenantId)
            .Include(r => r.Employee).ThenInclude(e => e.Department)
            .Include(r => r.Expenses).AsNoTracking();
        if (employeeId.HasValue) q = q.Where(r => r.EmployeeId == employeeId.Value);
        if (!string.IsNullOrEmpty(status)) q = q.Where(r => r.Status == status);
        return await q.OrderByDescending(r => r.CreatedAt).Select(r => new ExpenseReportDto
        {
            Id = r.Id, ReportNumber = r.ReportNumber, Title = r.Title,
            EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
            EmployeeCode = r.Employee.EmployeeNumber,
            Department = r.Employee.Department != null ? r.Employee.Department.Name : "",
            TripId = r.TripId, PeriodStart = r.PeriodStart, PeriodEnd = r.PeriodEnd,
            TotalAmount = r.TotalAmount, Currency = r.Currency,
            AdvanceApplied = r.AdvanceApplied, ReimbursableAmount = r.ReimbursableAmount,
            Status = r.Status, Notes = r.Notes, CreatedAt = r.CreatedAt,
            ViolationCount = r.Expenses.Count(e => e.PolicyStatus == "Violation")
        }).ToListAsync();
    }

    public async Task<ExpenseReportDto?> GetExpenseReportAsync(Guid tenantId, Guid id)
    {
        var r = await _db.ExpenseReports.Include(r => r.Employee).ThenInclude(e => e.Department)
            .Include(r => r.Trip).Include(r => r.Expenses).ThenInclude(e => e.Category)
            .AsNoTracking().FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id);
        if (r == null) return null;
        return new ExpenseReportDto
        {
            Id = r.Id, ReportNumber = r.ReportNumber, Title = r.Title,
            EmployeeName = r.Employee.FirstName + " " + r.Employee.LastName,
            EmployeeCode = r.Employee.EmployeeNumber,
            Department = r.Employee.Department != null ? r.Employee.Department.Name : "",
            TripId = r.TripId, PeriodStart = r.PeriodStart, PeriodEnd = r.PeriodEnd,
            TotalAmount = r.TotalAmount, Currency = r.Currency,
            AdvanceApplied = r.AdvanceApplied, ReimbursableAmount = r.ReimbursableAmount,
            Status = r.Status, Notes = r.Notes, CreatedAt = r.CreatedAt,
            ViolationCount = r.Expenses.Count(e => e.PolicyStatus == "Violation"),
            Expenses = r.Expenses.Select(e => new ExpenseDto
            {
                Id = e.Id, CategoryName = e.Category.Name, CategoryId = e.CategoryId,
                ExpenseDate = e.ExpenseDate, Merchant = e.Merchant, Description = e.Description,
                Amount = e.Amount, Currency = e.Currency, ConvertedAmount = e.ConvertedAmount,
                PaymentMethod = e.PaymentMethod, Status = e.Status, PolicyStatus = e.PolicyStatus,
                ReceiptDocumentId = e.ReceiptDocumentId, Notes = e.Notes
            }).ToList()
        };
    }

    public async Task<ExpenseReportDto> CreateExpenseReportAsync(Guid tenantId, Guid employeeId, CreateExpenseReportDto dto)
    {
        var expenses = await _db.Expenses.Where(e => e.TenantId == tenantId && e.EmployeeId == employeeId && dto.ExpenseIds.Contains(e.Id)).ToListAsync();
        var total = expenses.Sum(e => e.ConvertedAmount);
        var reportNumber = $"EXP-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";
        var entity = new ExpenseReport
        {
            TenantId = tenantId, EmployeeId = employeeId, TripId = dto.TripId,
            ReportNumber = reportNumber, Title = dto.Title,
            PeriodStart = dto.PeriodStart, PeriodEnd = dto.PeriodEnd,
            TotalAmount = total, Currency = dto.Currency,
            AdvanceApplied = dto.AdvanceApplied, ReimbursableAmount = total - dto.AdvanceApplied,
            Notes = dto.Notes, Status = "Draft"
        };
        _db.ExpenseReports.Add(entity);
        await _db.SaveChangesAsync();
        foreach (var exp in expenses)
        {
            exp.ExpenseReportId = entity.Id;
            exp.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return (await GetExpenseReportAsync(tenantId, entity.Id))!;
    }

    public async Task<bool> SubmitExpenseReportAsync(Guid tenantId, Guid id, Guid employeeId)
    {
        var entity = await _db.ExpenseReports.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id && r.EmployeeId == employeeId);
        if (entity == null || entity.Status != "Draft") return false;
        entity.Status = "Submitted"; entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ApproveExpenseReportAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments)
    {
        var entity = await _db.ExpenseReports.FirstOrDefaultAsync(r => r.TenantId == tenantId && r.Id == id);
        if (entity == null) return false;
        if (approved) entity.Status = entity.Status == "Submitted" ? "FinanceReview" : "Approved";
        else entity.Status = "Rejected";
        entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<PolicyRuleDto>> GetPolicyRulesAsync(Guid tenantId)
    {
        return await _db.ExpensePolicyRules.Where(r => r.TenantId == tenantId)
            .Include(r => r.Category).AsNoTracking()
            .Select(r => new PolicyRuleDto
            {
                Id = r.Id, CategoryId = r.CategoryId,
                CategoryName = r.Category != null ? r.Category.Name : "All",
                RuleType = r.RuleType, MaxAmount = r.MaxAmount, Currency = r.Currency,
                ConditionValue = r.ConditionValue, ViolationSeverity = r.ViolationSeverity, IsActive = r.IsActive
            }).ToListAsync();
    }

    public async Task<PolicyRuleDto> CreatePolicyRuleAsync(Guid tenantId, CreatePolicyRuleDto dto)
    {
        var entity = new ExpensePolicyRule
        {
            TenantId = tenantId, CategoryId = dto.CategoryId, RuleType = dto.RuleType,
            MaxAmount = dto.MaxAmount, Currency = dto.Currency, ConditionValue = dto.ConditionValue,
            ViolationSeverity = dto.ViolationSeverity, IsActive = true
        };
        _db.ExpensePolicyRules.Add(entity);
        await _db.SaveChangesAsync();
        return new PolicyRuleDto
        {
            Id = entity.Id, CategoryId = entity.CategoryId, RuleType = entity.RuleType,
            MaxAmount = entity.MaxAmount, Currency = entity.Currency,
            ConditionValue = entity.ConditionValue, ViolationSeverity = entity.ViolationSeverity, IsActive = entity.IsActive
        };
    }

    public async Task<PolicyCheckResult> EvaluatePolicyAsync(Guid tenantId, Guid categoryId, decimal amount, string currency)
    {
        var rules = await _db.ExpensePolicyRules
            .Where(r => r.TenantId == tenantId && r.IsActive && (r.CategoryId == null || r.CategoryId == categoryId))
            .ToListAsync();
        foreach (var rule in rules)
        {
            if (rule.RuleType == "MaxAmount" && rule.MaxAmount.HasValue && amount > rule.MaxAmount.Value)
            {
                return new PolicyCheckResult
                {
                    Status = rule.ViolationSeverity == "Warning" ? "Warning" : "Violation",
                    PolicyLimit = rule.MaxAmount, SubmittedAmount = amount,
                    Variance = amount - rule.MaxAmount.Value, Severity = rule.ViolationSeverity,
                    Message = $"Amount exceeds policy limit of {rule.MaxAmount:N2} {rule.Currency}"
                };
            }
        }
        return new PolicyCheckResult { Status = "Compliant", Message = "Expense is within policy." };
    }
}
