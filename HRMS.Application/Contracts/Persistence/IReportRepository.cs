using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Reports.DTOs;
using HRMS.Domain.Entities.Reports;

namespace HRMS.Application.Contracts.Persistence;

public interface IReportRepository
{
    Task<ExecutiveDashboardDto> GetExecutiveDashboardAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, ReportFilterParams? filters = null);
    
    Task<WorkforceAnalyticsDto> GetWorkforceAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, ReportFilterParams? filters = null);
    
    Task<AttendanceAnalyticsDto> GetAttendanceAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, DateTime? startDate, DateTime? endDate);
    
    Task<LeaveAnalyticsDto> GetLeaveAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, DateTime? startDate, DateTime? endDate);
    
    Task<PayrollAnalyticsDto> GetPayrollAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, bool hasPayrollPermission, DateTime? startDate, DateTime? endDate);
    
    Task<RecruitmentAnalyticsDto> GetRecruitmentAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin);
    
    Task<PerformanceAnalyticsDto> GetPerformanceAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin);
    
    Task<TrainingAnalyticsDto> GetTrainingAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin);

    Task<AssetAnalyticsDto> GetAssetAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, ReportFilterParams? filters = null);

    Task<BenefitsAnalyticsDto> GetBenefitsAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, ReportFilterParams? filters = null);

    Task<ExpenseAnalyticsDto> GetExpenseAnalyticsAsync(Guid tenantId, Guid? employeeId, Guid? managerId, bool isAdmin, ReportFilterParams? filters = null);

    Task<FilterOptionsDto> GetFilterOptionsAsync(Guid tenantId);
    
    // Custom Reports
    Task<CustomReportResultDto> ExecuteCustomReportAsync(Guid tenantId, CustomReportRequestDto request, Guid? employeeId, Guid? managerId, bool isAdmin, List<string> userPermissions);
    
    // Saved Reports Management
    Task<SavedReport> CreateSavedReportAsync(SavedReport report);
    Task<SavedReport?> GetSavedReportAsync(Guid id, Guid tenantId);
    Task<List<SavedReport>> GetSavedReportsAsync(Guid tenantId, Guid userId);
    Task UpdateSavedReportAsync(SavedReport report);
    Task DeleteSavedReportAsync(Guid id, Guid tenantId);
}

