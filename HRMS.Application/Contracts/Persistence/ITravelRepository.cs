using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Travel.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Application.Contracts.Persistence;

public interface ITravelRepository
{
    Task<EmployeeEntity?> ResolveEmployeeAsync(Guid? overrideId = null, string? overrideEmail = null);

    // Travel Requests
    Task<TravelDashboardDto> GetDashboardAsync(Guid tenantId, Guid? employeeId = null);
    Task<List<TravelRequestDto>> GetTravelRequestsAsync(Guid tenantId, TravelFilterDto filter);
    Task<TravelRequestDto?> GetTravelRequestAsync(Guid tenantId, Guid id);
    Task<TravelRequestDto> CreateTravelRequestAsync(Guid tenantId, Guid employeeId, CreateTravelRequestDto dto);
    Task<TravelRequestDto> UpdateTravelRequestAsync(Guid tenantId, Guid id, CreateTravelRequestDto dto);
    Task<bool> SubmitTravelRequestAsync(Guid tenantId, Guid id, Guid employeeId);
    Task<bool> ApproveTravelRequestAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments);
    Task<bool> CancelTravelRequestAsync(Guid tenantId, Guid id, Guid employeeId);

    // Trips
    Task<List<TripDto>> GetTripsAsync(Guid tenantId, Guid? employeeId = null);
    Task<TripDto?> GetTripAsync(Guid tenantId, Guid id);
    Task<List<ItineraryItemDto>> GetItineraryAsync(Guid tenantId, Guid tripId);
    Task<ItineraryItemDto> AddItineraryItemAsync(Guid tenantId, Guid tripId, CreateItineraryItemDto dto);

    // Advances
    Task<List<TravelAdvanceDto>> GetAdvancesAsync(Guid tenantId, Guid? employeeId = null);
    Task<TravelAdvanceDto> CreateAdvanceAsync(Guid tenantId, Guid employeeId, CreateTravelAdvanceDto dto);
    Task<bool> ApproveAdvanceAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments);

    // Expense Categories
    Task<List<ExpenseCategoryDto>> GetCategoriesAsync(Guid tenantId);
    Task<ExpenseCategoryDto> CreateCategoryAsync(Guid tenantId, CreateExpenseCategoryDto dto);

    // Expenses
    Task<List<ExpenseDto>> GetExpensesAsync(Guid tenantId, Guid? employeeId = null, Guid? tripId = null);
    Task<ExpenseDto?> GetExpenseAsync(Guid tenantId, Guid id);
    Task<ExpenseDto> CreateExpenseAsync(Guid tenantId, Guid employeeId, CreateExpenseDto dto);
    Task<ExpenseDto> UpdateExpenseAsync(Guid tenantId, Guid id, CreateExpenseDto dto);
    Task<bool> DeleteExpenseAsync(Guid tenantId, Guid id, Guid employeeId);

    // Expense Reports
    Task<List<ExpenseReportDto>> GetExpenseReportsAsync(Guid tenantId, Guid? employeeId = null, string? status = null);
    Task<ExpenseReportDto?> GetExpenseReportAsync(Guid tenantId, Guid id);
    Task<ExpenseReportDto> CreateExpenseReportAsync(Guid tenantId, Guid employeeId, CreateExpenseReportDto dto);
    Task<bool> SubmitExpenseReportAsync(Guid tenantId, Guid id, Guid employeeId);
    Task<bool> ApproveExpenseReportAsync(Guid tenantId, Guid id, Guid approverId, bool approved, string? comments);

    // Policy Rules
    Task<List<PolicyRuleDto>> GetPolicyRulesAsync(Guid tenantId);
    Task<PolicyRuleDto> CreatePolicyRuleAsync(Guid tenantId, CreatePolicyRuleDto dto);
    Task<PolicyCheckResult> EvaluatePolicyAsync(Guid tenantId, Guid categoryId, decimal amount, string currency);
}
