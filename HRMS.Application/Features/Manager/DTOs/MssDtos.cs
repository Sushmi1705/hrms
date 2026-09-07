using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Manager.DTOs;

// ========================
// DASHBOARD
// ========================
public class MssDashboardDto
{
    public string ManagerName { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int TeamSize { get; set; }
    public DateTime Today { get; set; } = DateTime.Today;

    // KPI Metrics
    public int PresentToday { get; set; }
    public int AbsentToday { get; set; }
    public int OnLeaveToday { get; set; }
    public int LateToday { get; set; }
    public int PendingLeaveApprovals { get; set; }
    public int PendingAttendanceApprovals { get; set; }
    public int PendingPerformanceReviews { get; set; }
    public int OpenHRRequests { get; set; }
    public int TeamAssetsCount { get; set; }
    public int TrainingOverdue { get; set; }
    public int UpcomingBirthdays { get; set; }

    // Charts
    public List<AttendanceTrendPoint> AttendanceTrend { get; set; } = new();
    public List<LeaveTrendPoint> LeaveTrend { get; set; } = new();
    public List<TeamMemberStatusDto> TeamStatusSnapshot { get; set; } = new();
    public List<MssCalendarEventDto> UpcomingEvents { get; set; } = new();
}

public class AttendanceTrendPoint
{
    public string Date { get; set; } = string.Empty;
    public int Present { get; set; }
    public int Absent { get; set; }
    public int Late { get; set; }
    public int OnLeave { get; set; }
}

public class LeaveTrendPoint
{
    public string Month { get; set; } = string.Empty;
    public int Approved { get; set; }
    public int Pending { get; set; }
    public int Rejected { get; set; }
}

public class TeamMemberStatusDto
{
    public Guid EmployeeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string AttendanceStatus { get; set; } = string.Empty; // Present, Absent, Late, On Leave
    public string? LeaveStatus { get; set; }
}

// ========================
// TEAM
// ========================
public class MssTeamFilterDto
{
    public string? Search { get; set; }
    public string? Department { get; set; }
    public string? Status { get; set; }
    public string? AttendanceStatus { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class MssTeamPagedDto
{
    public List<MssTeamMemberDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

public class MssTeamMemberDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AttendanceStatus { get; set; } = "Unknown";
    public string LeaveStatus { get; set; } = "None";
    public string PerformanceStatus { get; set; } = "N/A";
    public int AssetCount { get; set; }
    public string? ShiftName { get; set; }
}

public class MssTeamMemberDetailDto : MssTeamMemberDto
{
    public List<TeamAttendanceDayDto> RecentAttendance { get; set; } = new();
    public List<MssLeaveRequestDto> RecentLeave { get; set; } = new();
    public MssPerformanceSummaryDto? Performance { get; set; }
    public List<MssGoalDto> Goals { get; set; } = new();
    public List<MssTeamAssetDto> Assets { get; set; } = new();
    public List<MssTrainingDto> Training { get; set; } = new();
}

public class TeamDirectoryItemDto
{
    public Guid EmployeeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Branch { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
}

// ========================
// ATTENDANCE
// ========================
public class TeamAttendanceDayDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime? ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public decimal WorkingHours { get; set; }
    public bool IsLate { get; set; }
    public bool IsEarlyOut { get; set; }
    public bool IsMissingPunch { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}

public class MssAttendanceRequestDto
{
    public Guid RequestId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime AttendanceDate { get; set; }
    public string RequestType { get; set; } = string.Empty;
    public TimeSpan? OriginalClockIn { get; set; }
    public TimeSpan? OriginalClockOut { get; set; }
    public TimeSpan? RequestedClockIn { get; set; }
    public TimeSpan? RequestedClockOut { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public string? ManagerComments { get; set; }
}

// ========================
// LEAVE
// ========================
public class MssLeaveRequestDto
{
    public Guid LeaveRequestId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string LeaveType { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public string? ApprovalComments { get; set; }
    public bool IsHalfDay { get; set; }
}

public class ApproveLeaveDto
{
    public bool Approved { get; set; }
    public string? Comments { get; set; }
}

public class ApproveAttendanceRequestDto
{
    public bool Approved { get; set; }
    public string? Comments { get; set; }
}

// ========================
// PERFORMANCE
// ========================
public class MssPerformanceOverviewDto
{
    public int ReviewsPending { get; set; }
    public int ReviewsCompleted { get; set; }
    public int GoalsOnTrack { get; set; }
    public int GoalsAtRisk { get; set; }
    public int GoalsCompleted { get; set; }
    public int GoalsTotal { get; set; }
    public List<MssReviewItemDto> PendingReviews { get; set; } = new();
    public List<MssGoalDto> RecentGoals { get; set; } = new();
    public List<RatingDistributionDto> RatingDistribution { get; set; } = new();
}

public class MssPerformanceSummaryDto
{
    public int GoalsTotal { get; set; }
    public int GoalsCompleted { get; set; }
    public decimal? LastRating { get; set; }
    public string ReviewStatus { get; set; } = string.Empty;
}

public class MssReviewItemDto
{
    public Guid ReviewId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string ReviewCycle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? SelfRating { get; set; }
    public decimal? ManagerRating { get; set; }
    public string? FinalRating { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public DateTime? ManagerReviewedAt { get; set; }
    public string? ManagerComments { get; set; }
}

public class RatingDistributionDto
{
    public string Rating { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class MssGoalDto
{
    public Guid GoalId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GoalType { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public decimal Weightage { get; set; }
    public decimal ProgressPercentage { get; set; }
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Comments { get; set; }
}

public class CreateMssGoalDto
{
    public Guid EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GoalType { get; set; } = "Individual";
    public string Priority { get; set; } = "Medium";
    public decimal Weightage { get; set; } = 10;
    public DateTime Deadline { get; set; }
}

public class UpdateGoalProgressDto
{
    public decimal Progress { get; set; }
    public string? Comments { get; set; }
}

public class SubmitReviewDto
{
    public string ManagerComments { get; set; } = string.Empty;
    public decimal ManagerRating { get; set; }
    public string? FinalRating { get; set; }
}

public class CreateMssFeedbackDto
{
    public Guid EmployeeId { get; set; }
    public string FeedbackType { get; set; } = "General"; // Recognition, Coaching, Development, Performance, General
    public string Comments { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false;
}

// ========================
// TRAINING
// ========================
public class MssTrainingDto
{
    public Guid AssignmentId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string CourseType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal? CompletionPercentage { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsOverdue { get; set; }
}

// ========================
// ASSETS
// ========================
public class MssTeamAssetDto
{
    public Guid AssetId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Condition { get; set; }
    public DateTime AssignedDate { get; set; }
    public DateTime? ExpectedReturnDate { get; set; }
}

// ========================
// COMPENSATION
// ========================
public class MssCompensationDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string? PayGrade { get; set; }
    public decimal CurrentCtc { get; set; }
    public string Currency { get; set; } = "INR";
    public string Status { get; set; } = string.Empty;
    public DateTime? LastRevisionDate { get; set; }
    public string? RecommendationStatus { get; set; }
}

public class CreateCompRecommendationDto
{
    public Guid EmployeeId { get; set; }
    public decimal ProposedCtc { get; set; }
    public decimal IncreasePercentage { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
}

public class MssCompRecommendationDto
{
    public Guid RecommendationId { get; set; }
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public decimal ProposedCtc { get; set; }
    public decimal IncreasePercentage { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Submitted";
    public DateTime SubmittedAt { get; set; }
}

// ========================
// APPROVALS
// ========================
public class MssApprovalItemDto
{
    public Guid ApprovalId { get; set; }
    public string Category { get; set; } = string.Empty; // Leave, Attendance, Performance, Compensation, Asset
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public DateTime SubmittedAt { get; set; }
    public string? Comments { get; set; }
}

// ========================
// HR REQUESTS
// ========================
public class MssHRRequestDto
{
    public Guid RequestId { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Guid? TargetEmployeeId { get; set; }
    public string? TargetEmployeeName { get; set; }
}

public class CreateMssHRRequestDto
{
    public string Category { get; set; } = string.Empty; // Transfer, Promotion, Headcount, Schedule Change
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public Guid? TargetEmployeeId { get; set; }
}

// ========================
// CALENDAR
// ========================
public class MssCalendarEventDto
{
    public string Type { get; set; } = string.Empty; // Leave, Holiday, Birthday, Anniversary, Review, Training
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? Color { get; set; }
    public string? NavigateTo { get; set; }
}

// ========================
// ANALYTICS
// ========================
public class MssAnalyticsDto
{
    public decimal AttendanceRate { get; set; }
    public decimal AbsenceRate { get; set; }
    public decimal LateRate { get; set; }
    public decimal LeaveUtilization { get; set; }
    public decimal GoalCompletionRate { get; set; }
    public decimal TrainingCompletionRate { get; set; }
    public decimal ReviewCompletionRate { get; set; }
    public List<AttendanceTrendPoint> AttendanceTrend { get; set; } = new();
    public List<LeaveTrendPoint> LeaveTrend { get; set; } = new();
    public List<HeadcountBreakdownDto> ByDepartment { get; set; } = new();
    public List<HeadcountBreakdownDto> ByEmploymentType { get; set; } = new();
}

public class HeadcountBreakdownDto
{
    public string Label { get; set; } = string.Empty;
    public int Count { get; set; }
}

// ========================
// NOTIFICATIONS
// ========================
public class MssNotificationDto
{
    public Guid NotificationId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? ActionUrl { get; set; }
    public string? Category { get; set; }
}
