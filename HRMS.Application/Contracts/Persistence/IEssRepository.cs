using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Employee.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Application.Contracts.Persistence;

public interface IEssRepository
{
    // Identity Resolution
    Task<EmployeeEntity?> ResolveCurrentEmployeeAsync(Guid? overrideEmployeeId = null, string? overrideEmail = null);

    // Dashboard
    Task<EmployeeDashboardDto> GetDashboardDataAsync(Guid employeeId);

    // Profile & Emergency Contacts
    Task<EmployeeProfileDetailDto?> GetProfileAsync(Guid employeeId);
    Task<bool> UpdateProfileContactAsync(Guid employeeId, UpdateProfileContactDto dto);
    Task<ProfileChangeRequestItemDto> SubmitProfileChangeRequestAsync(Guid employeeId, ProfileChangeRequestDto dto);
    Task<List<EmergencyContactDto>> GetEmergencyContactsAsync(Guid employeeId);
    Task<EmergencyContactDto> CreateEmergencyContactAsync(Guid employeeId, CreateEmergencyContactDto dto);
    Task<bool> DeleteEmergencyContactAsync(Guid contactId);

    // Attendance & Web Clock
    Task<WebClockStatusDto> GetTodayClockStatusAsync(Guid employeeId);
    Task<WebClockStatusDto> ClockInAsync(Guid employeeId, ClockInRequestDto dto);
    Task<WebClockStatusDto> ClockOutAsync(Guid employeeId, ClockOutRequestDto dto);
    Task<List<AttendanceCalendarDayDto>> GetAttendanceCalendarAsync(Guid employeeId, int month, int year);
    Task<AttendanceCorrectionItemDto> SubmitAttendanceCorrectionAsync(Guid employeeId, AttendanceCorrectionDto dto);
    Task<List<AttendanceCorrectionItemDto>> GetAttendanceCorrectionsAsync(Guid employeeId);

    // Leave
    Task<List<EssLeaveBalanceDto>> GetLeaveBalancesAsync(Guid employeeId, int year);
    Task<List<EssLeaveRequestDto>> GetLeaveRequestsAsync(Guid employeeId);
    Task<EssLeaveRequestDto> ApplyLeaveAsync(Guid employeeId, ApplyEssLeaveDto dto);
    Task<bool> CancelLeaveAsync(Guid employeeId, Guid leaveRequestId);

    // Payroll & Payslips
    Task<List<EssPayslipSummaryDto>> GetPayslipsAsync(Guid employeeId, int? year);
    Task<EssPayslipDetailDto?> GetPayslipDetailAsync(Guid employeeId, Guid payslipId);

    // Documents & Policies
    Task<List<EssDocumentItemDto>> GetDocumentsAsync(Guid employeeId);
    Task<bool> AcknowledgePolicyAsync(Guid employeeId, Guid documentId);
    Task<EssDocumentRequestItemDto> SubmitDocumentRequestAsync(Guid employeeId, RequestEssDocumentDto dto);

    // Centralized HR Service Desk Requests
    Task<List<EssHRRequestItemDto>> GetHRRequestsAsync(Guid employeeId, string? status, string? category);
    Task<EssHRRequestItemDto?> GetHRRequestByIdAsync(Guid employeeId, Guid requestId);
    Task<EssHRRequestItemDto> CreateHRRequestAsync(Guid employeeId, CreateHRRequestDto dto);
    Task<HRRequestCommentItemDto> AddHRRequestCommentAsync(Guid requestId, string authorName, string message);

    // Company Directory, Calendar, Announcements
    Task<List<HolidayItemDto>> GetHolidaysAsync(int? year);
    Task<WorkScheduleDto> GetWorkScheduleAsync(Guid employeeId);
    Task<List<ColleagueDirectoryItemDto>> GetColleagueDirectoryAsync(string? search, Guid? departmentId);
    Task<List<AnnouncementItemDto>> GetAnnouncementsAsync();
    Task<List<PendingRequestItemDto>> GetNotificationsAsync(Guid employeeId);
    Task<bool> MarkNotificationReadAsync(Guid notificationId);
}
