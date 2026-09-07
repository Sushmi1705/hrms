using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Manager.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Application.Contracts.Persistence;

public interface IMssRepository
{
    // Identity Resolution
    Task<EmployeeEntity?> ResolveManagerAsync(Guid? overrideId = null, string? overrideEmail = null);

    // Dashboard
    Task<MssDashboardDto> GetDashboardAsync(Guid managerId);

    // Team
    Task<MssTeamPagedDto> GetTeamAsync(Guid managerId, MssTeamFilterDto filter);
    Task<MssTeamMemberDetailDto?> GetTeamMemberAsync(Guid managerId, Guid employeeId);
    Task<List<TeamDirectoryItemDto>> GetTeamDirectoryAsync(Guid managerId, string? search);

    // Attendance
    Task<List<TeamAttendanceDayDto>> GetTeamAttendanceAsync(Guid managerId, int month, int year, Guid? employeeId);
    Task<List<MssAttendanceRequestDto>> GetAttendanceRequestsAsync(Guid managerId, string? status);
    Task<bool> ApproveAttendanceRequestAsync(Guid managerId, Guid requestId, bool approved, string? comments);

    // Leave
    Task<List<MssLeaveRequestDto>> GetTeamLeaveAsync(Guid managerId, string? status, Guid? employeeId);
    Task<bool> ApproveLeaveAsync(Guid managerId, Guid leaveRequestId, bool approved, string? comments);

    // Performance
    Task<MssPerformanceOverviewDto> GetTeamPerformanceAsync(Guid managerId);
    Task<List<MssGoalDto>> GetTeamGoalsAsync(Guid managerId, Guid? employeeId);
    Task<MssGoalDto> CreateGoalAsync(Guid managerId, CreateMssGoalDto dto);
    Task<bool> UpdateGoalProgressAsync(Guid managerId, Guid goalId, decimal progress, string? comments);
    Task<bool> SubmitPerformanceReviewAsync(Guid managerId, Guid reviewId, SubmitReviewDto dto);
    Task<bool> SubmitFeedbackAsync(Guid managerId, CreateMssFeedbackDto dto);

    // Training
    Task<List<MssTrainingDto>> GetTeamTrainingAsync(Guid managerId);

    // Assets
    Task<List<MssTeamAssetDto>> GetTeamAssetsAsync(Guid managerId);

    // Compensation
    Task<List<MssCompensationDto>> GetTeamCompensationAsync(Guid managerId);
    Task<MssCompRecommendationDto> SubmitCompRecommendationAsync(Guid managerId, CreateCompRecommendationDto dto);

    // Approvals
    Task<List<MssApprovalItemDto>> GetManagerApprovalsAsync(Guid managerId, string? category);

    // HR Requests
    Task<List<MssHRRequestDto>> GetManagerRequestsAsync(Guid managerId, string? status);
    Task<MssHRRequestDto> CreateManagerRequestAsync(Guid managerId, CreateMssHRRequestDto dto);

    // Calendar & Analytics & Notifications
    Task<List<MssCalendarEventDto>> GetTeamCalendarAsync(Guid managerId, int month, int year);
    Task<MssAnalyticsDto> GetTeamAnalyticsAsync(Guid managerId);
    Task<List<MssNotificationDto>> GetManagerNotificationsAsync(Guid managerId);
}
