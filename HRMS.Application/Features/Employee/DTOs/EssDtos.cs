using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Employee.DTOs;

// ==========================================
// 1. DASHBOARD DTOS
// ==========================================
public class EmployeeDashboardDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string Email { get; set; } = string.Empty;
    public string DesignationTitle { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string WorkLocation { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
    public string TodayFormatted { get; set; } = string.Empty;

    // Web Clock Status
    public WebClockStatusDto TodayAttendance { get; set; } = new();

    // 6 Primary KPIs
    public decimal RemainingLeaveDays { get; set; }
    public int AttendanceDaysThisMonth { get; set; }
    public int PendingRequestsCount { get; set; }
    public int UnreadNotificationsCount { get; set; }
    public int AssignedAssetsCount { get; set; }
    public string? NextHolidayName { get; set; }
    public DateTime? NextHolidayDate { get; set; }

    // Widgets Data
    public List<HolidayItemDto> UpcomingHolidays { get; set; } = new();
    public List<EssLeaveBalanceDto> LeaveBalances { get; set; } = new();
    public EssPayslipSummaryDto? RecentPayslip { get; set; }
    public List<ActiveBenefitSummaryDto> ActiveBenefits { get; set; } = new();
    public List<AssignedAssetSummaryDto> AssignedAssets { get; set; } = new();
    public List<PendingRequestItemDto> PendingRequests { get; set; } = new();
    public List<AnnouncementItemDto> Announcements { get; set; } = new();
    public List<EssDocumentItemDto> RequiredDocuments { get; set; } = new();
    public List<EssActivityItemDto> RecentActivities { get; set; } = new();
}

public class WebClockStatusDto
{
    public bool IsClockedIn { get; set; }
    public DateTime? ClockInTime { get; set; }
    public DateTime? ClockOutTime { get; set; }
    public string WorkedDuration { get; set; } = "0h 0m";
    public double WorkedHours { get; set; }
    public bool IsLate { get; set; }
    public string ShiftName { get; set; } = "General Shift";
    public string ShiftTimings { get; set; } = "09:00 AM - 06:00 PM";
    public string Status { get; set; } = "Not Clocked In";
}

public class HolidayItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string HolidayType { get; set; } = "Company";
    public string? Description { get; set; }
    public int DaysRemaining { get; set; }
}

public class ActiveBenefitSummaryDto
{
    public Guid Id { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string CoverageTier { get; set; } = string.Empty;
    public decimal EmployeeMonthlyCost { get; set; }
    public decimal EmployerMonthlyCost { get; set; }
}

public class AssignedAssetSummaryDto
{
    public Guid Id { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public string Condition { get; set; } = "Good";
    public bool IsAcknowledged { get; set; }
}

public class PendingRequestItemDto
{
    public Guid Id { get; set; }
    public string RequestType { get; set; } = string.Empty; // Leave, AttendanceCorrection, ProfileChange, AssetRequisition, HRService
    public string Title { get; set; } = string.Empty;
    public DateTime SubmittedDate { get; set; }
    public string Status { get; set; } = "Pending";
    public string CurrentApprover { get; set; } = string.Empty;
}

public class AnnouncementItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime PublishedDate { get; set; }
    public bool IsPinned { get; set; }
    public string Priority { get; set; } = "Normal";
}

public class EssActivityItemDto
{
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Status { get; set; } = "Completed";
}

// ==========================================
// 2. PROFILE & EMERGENCY CONTACT DTOS
// ==========================================
public class EmployeeProfileDetailDto
{
    public Guid Id { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string WorkEmail { get; set; } = string.Empty;
    public string PersonalEmail { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = "Unspecified";
    public string MaritalStatus { get; set; } = "Single";
    public string Nationality { get; set; } = "Standard";
    public string AvatarUrl { get; set; } = string.Empty;

    // Employment Info
    public DateTime JoiningDate { get; set; }
    public string Status { get; set; } = "Active";
    public string EmploymentType { get; set; } = "Full-Time Permanent";
    
    // Organization
    public Guid DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public Guid DesignationId { get; set; }
    public string DesignationTitle { get; set; } = string.Empty;
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string WorkLocation { get; set; } = string.Empty;
    
    // Reporting Manager
    public Guid? ManagerId { get; set; }
    public string ManagerName { get; set; } = string.Empty;
    public string ManagerEmail { get; set; } = string.Empty;
    public string ManagerDesignation { get; set; } = string.Empty;

    public List<EmergencyContactDto> EmergencyContacts { get; set; } = new();
    public List<ProfileChangeRequestItemDto> PendingChangeRequests { get; set; } = new();
}

public class UpdateProfileContactDto
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string PersonalEmail { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class ProfileChangeRequestDto
{
    public string FieldName { get; set; } = string.Empty;
    public string ProposedValue { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class ProfileChangeRequestItemDto
{
    public Guid Id { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public string CurrentValue { get; set; } = string.Empty;
    public string ProposedValue { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Submitted";
    public DateTime CreatedAt { get; set; }
    public string? ApproverComments { get; set; }
}

public class EmergencyContactDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsPrimary { get; set; }
}

public class CreateEmergencyContactDto
{
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsPrimary { get; set; }
}

// ==========================================
// 3. ATTENDANCE & WEB CLOCK DTOS
// ==========================================
public class ClockInRequestDto
{
    public string? IpAddress { get; set; }
    public string? Location { get; set; }
    public string? Device { get; set; }
    public string? Notes { get; set; }
}

public class ClockOutRequestDto
{
    public string? IpAddress { get; set; }
    public string? Location { get; set; }
    public string? Device { get; set; }
    public string? Notes { get; set; }
}

public class AttendanceCalendarDayDto
{
    public DateTime Date { get; set; }
    public string DayOfWeek { get; set; } = string.Empty;
    public string Status { get; set; } = "Present"; // Present, Absent, Late, HalfDay, Leave, Weekend, Holiday, WorkFromHome
    public TimeSpan? ClockInTime { get; set; }
    public TimeSpan? ClockOutTime { get; set; }
    public string? ClockInFormatted { get; set; }
    public string? ClockOutFormatted { get; set; }
    public double WorkedHours { get; set; }
    public bool IsLate { get; set; }
    public string? Remarks { get; set; }
}

public class AttendanceCorrectionDto
{
    public DateTime Date { get; set; }
    public string RequestType { get; set; } = "Regularization"; // Regularization, MissedPunch, WorkFromHome, Overtime
    public TimeSpan? RequestedCheckIn { get; set; }
    public TimeSpan? RequestedCheckOut { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class AttendanceCorrectionItemDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string RequestType { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public TimeSpan? RequestedCheckIn { get; set; }
    public TimeSpan? RequestedCheckOut { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? ApproverComments { get; set; }
}

// ==========================================
// 4. LEAVE DTOS
// ==========================================
public class EssLeaveBalanceDto
{
    public Guid LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public string ColorCode { get; set; } = "#6366f1";
    public decimal TotalAllocated { get; set; }
    public decimal Used { get; set; }
    public decimal Pending { get; set; }
    public decimal Remaining { get; set; }
    public bool IsPaid { get; set; }
}

public class EssLeaveRequestDto
{
    public Guid Id { get; set; }
    public Guid LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public string ColorCode { get; set; } = "#6366f1";
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalDays { get; set; }
    public bool IsHalfDay { get; set; }
    public string? HalfDayType { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Cancelled
    public DateTime CreatedAt { get; set; }
    public string? ApproverName { get; set; }
    public string? ApprovalComments { get; set; }
    public DateTime? ActionDate { get; set; }
}

public class ApplyEssLeaveDto
{
    public Guid LeaveTypeId { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public bool IsHalfDay { get; set; }
    public string? HalfDayType { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? EmergencyContact { get; set; }
}

// ==========================================
// 5. PAYROLL & PAYSLIP DTOS
// ==========================================
public class EssPayslipSummaryDto
{
    public Guid Id { get; set; }
    public string Month { get; set; } = string.Empty; // e.g. "August 2026"
    public DateTime PaymentDate { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal NetSalary { get; set; }
    public string Status { get; set; } = "Paid";
    public int Year { get; set; }
}

public class EssPayslipDetailDto
{
    public Guid Id { get; set; }
    public string Month { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeNumber { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string WorkLocation { get; set; } = string.Empty;
    public string BankAccountNumber { get; set; } = "••••••••4892";
    public string BankName { get; set; } = "JPMorgan Chase Bank";

    public decimal GrossSalary { get; set; }
    public decimal TotalAllowances { get; set; }
    public decimal TotalDeductions { get; set; }
    public decimal NetSalary { get; set; }
    public string Status { get; set; } = "Paid";

    public List<PayslipComponentItemDto> Earnings { get; set; } = new();
    public List<PayslipComponentItemDto> Deductions { get; set; } = new();
    public List<PayslipComponentItemDto> EmployerContributions { get; set; } = new();
}

public class PayslipComponentItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

// ==========================================
// 6. DMS & DOCUMENTS DTOS
// ==========================================
public class EssDocumentItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // Employment, Policy, Tax, Benefit, Asset
    public string OriginalFileName { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string FileSizeFormatted { get; set; } = "1.2 MB";
    public DateTime UploadedDate { get; set; }
    public bool IsRequired { get; set; }
    public bool IsAcknowledged { get; set; }
    public DateTime? AcknowledgedAt { get; set; }
    public string Status { get; set; } = "Approved"; // Missing, Uploaded, UnderReview, Approved, Rejected
    public string DownloadUrl { get; set; } = string.Empty;
}

public class RequestEssDocumentDto
{
    public string DocumentType { get; set; } = string.Empty; // SalaryCertificate, ExperienceLetter, EmploymentProof, VisaNoc
    public string Purpose { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string? Comments { get; set; }
}

public class EssDocumentRequestItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; }
}

// ==========================================
// 7. HR SERVICE REQUESTS DTOS
// ==========================================
public class EssHRRequestItemDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // HR, Payroll, Attendance, Leave, Benefits, Assets, Documents, IT_Support
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Submitted";
    public string? AssignedTo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; set; }
    public List<HRRequestCommentItemDto> Comments { get; set; } = new();
}

public class CreateHRRequestDto
{
    public string Category { get; set; } = "General";
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium";
}

public class HRRequestCommentItemDto
{
    public Guid Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AddHRRequestCommentDto
{
    public string Message { get; set; } = string.Empty;
}

// ==========================================
// 8. DIRECTORY & SCHEDULE DTOS
// ==========================================
public class ColleagueDirectoryItemDto
{
    public Guid Id { get; set; }
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string WorkEmail { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}

public class WorkScheduleDto
{
    public string ShiftName { get; set; } = "Morning General Shift";
    public string ShiftCode { get; set; } = "MORN";
    public TimeSpan StartTime { get; set; } = new TimeSpan(9, 0, 0);
    public TimeSpan EndTime { get; set; } = new TimeSpan(17, 0, 0);
    public string StartTimeFormatted => "09:00 AM";
    public string EndTimeFormatted => "05:00 PM";
    public int GraceTimeMinutes { get; set; } = 15;
    public string WorkingDays { get; set; } = "Monday - Friday";
    public string TimeZone { get; set; } = "UTC-5 (Eastern Time)";
    public string WorkLocation { get; set; } = "Corporate HQ - Tower B";
}
