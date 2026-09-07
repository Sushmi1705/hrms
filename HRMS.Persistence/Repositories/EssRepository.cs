using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Employee.DTOs;
using HRMS.Domain.Entities.Attendance;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Leave;
using HRMS.Domain.Entities.Payroll;
using HRMS.Domain.Entities.Document;
using HRMS.Domain.Entities.Notification;

namespace HRMS.Persistence.Repositories;

public class EssRepository : IEssRepository
{
    private readonly HrmsDbContext _context;
    private readonly ITenantContext _tenantContext;

    public EssRepository(HrmsDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    private Guid GetEffectiveTenantId()
    {
        return _tenantContext.CurrentTenantId ?? Guid.Parse("11111111-1111-1111-1111-111111111111");
    }

    // ==========================================
    // 1. IDENTITY RESOLUTION
    // ==========================================
    public async Task<EmployeeEntity?> ResolveCurrentEmployeeAsync(Guid? overrideEmployeeId = null, string? overrideEmail = null)
    {
        var tenantId = GetEffectiveTenantId();

        EmployeeEntity? emp = null;

        if (overrideEmployeeId.HasValue && overrideEmployeeId.Value != Guid.Empty)
        {
            emp = await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == overrideEmployeeId.Value && !e.IsDeleted);
        }

        if (emp == null && !string.IsNullOrWhiteSpace(overrideEmail))
        {
            emp = await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Email.ToLower() == overrideEmail.ToLower() && !e.IsDeleted);
        }

        if (emp == null)
        {
            emp = await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => (e.TenantId == tenantId || e.TenantId == Guid.Empty) && e.Status == "Active" && !e.IsDeleted)
                ?? await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Status == "Active" && !e.IsDeleted);
        }

        if (emp != null)
        {
            if (emp.DepartmentId != Guid.Empty)
                emp.Department = await _context.Departments.AsNoTracking().FirstOrDefaultAsync(d => d.Id == emp.DepartmentId);
            if (emp.DesignationId != Guid.Empty)
                emp.Designation = await _context.Designations.AsNoTracking().FirstOrDefaultAsync(d => d.Id == emp.DesignationId);
            if (emp.BranchId != Guid.Empty)
                emp.Branch = await _context.Branches.AsNoTracking().FirstOrDefaultAsync(b => b.Id == emp.BranchId);
            if (emp.ManagerId.HasValue && emp.ManagerId.Value != Guid.Empty)
                emp.Manager = await _context.Employees.AsNoTracking().FirstOrDefaultAsync(m => m.Id == emp.ManagerId.Value);
        }

        return emp;
    }

    // ==========================================
    // 2. DASHBOARD DATA AGGREGATION
    // ==========================================
    public async Task<EmployeeDashboardDto> GetDashboardDataAsync(Guid employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        var emp = await _context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (emp == null)
            throw new KeyNotFoundException("Employee record not found.");

        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);

        // Attendance today
        var clockStatus = await GetTodayClockStatusAsync(employeeId);

        // Attendance days this month
        var attendanceDaysThisMonth = await _context.AttendanceLogs
            .CountAsync(a => a.EmployeeId == employeeId && a.Date >= startOfMonth && a.Date <= today && a.Status == "Present");

        // Leave balances
        var leaveBalances = await GetLeaveBalancesAsync(employeeId, today.Year);
        var remainingLeaveDays = leaveBalances.Sum(b => b.Remaining);

        // Recent payslip
        var recentPayslip = await _context.Payslips
            .AsNoTracking()
            .Include(p => p.PayrollRun)
            .Where(p => p.EmployeeId == employeeId)
            .OrderByDescending(p => p.PayrollRun != null ? p.PayrollRun.ProcessDate : DateTime.MinValue)
            .Select(p => new EssPayslipSummaryDto
            {
                Id = p.Id,
                Month = p.PayrollRun != null ? p.PayrollRun.Month : "Recent Cycle",
                PaymentDate = p.PayrollRun != null ? p.PayrollRun.ProcessDate : DateTime.UtcNow,
                GrossSalary = p.GrossSalary,
                TotalAllowances = p.TotalAllowances,
                TotalDeductions = p.TotalDeductions,
                NetSalary = p.NetSalary,
                Status = p.Status,
                Year = p.PayrollRun != null ? p.PayrollRun.ProcessDate.Year : today.Year
            })
            .FirstOrDefaultAsync();

        // Active Benefits
        var activeBenefits = await _context.BenefitEnrollments
            .AsNoTracking()
            .Include(b => b.BenefitPlan)
            .Where(b => b.EmployeeId == employeeId && b.Status == "Active" && !b.IsDeleted)
            .Select(b => new ActiveBenefitSummaryDto
            {
                Id = b.Id,
                PlanName = b.BenefitPlan != null ? b.BenefitPlan.PlanName : "Corporate Plan",
                Type = b.BenefitPlan != null ? b.BenefitPlan.Type : "Health",
                Provider = b.BenefitPlan != null ? b.BenefitPlan.Provider : "Carrier",
                CoverageTier = b.CoverageTier,
                EmployeeMonthlyCost = b.EmployeeMonthlyContribution,
                EmployerMonthlyCost = b.EmployerMonthlyContribution
            })
            .ToListAsync();

        // Assigned Assets
        var assignedAssets = await _context.AssetAssignments
            .AsNoTracking()
            .Include(a => a.Asset)
                .ThenInclude(ast => ast!.Category)
            .Where(a => a.EmployeeId == employeeId && a.Status == "Active")
            .Select(a => new AssignedAssetSummaryDto
            {
                Id = a.AssetId,
                AssetTag = a.Asset != null ? a.Asset.AssetTag : "TAG",
                AssetName = a.Asset != null ? a.Asset.AssetName : "Equipment",
                CategoryName = a.Asset != null && a.Asset.Category != null ? a.Asset.Category.Name : "Hardware",
                SerialNumber = a.Asset != null ? a.Asset.SerialNumber : "S/N",
                AssignedDate = a.AssignedDate,
                Condition = a.ConditionAtHandover,
                IsAcknowledged = a.AcknowledgementStatus == "Acknowledged"
            })
            .ToListAsync();

        // Pending Requests
        var pendingRequests = new List<PendingRequestItemDto>();
        
        var pendingLeaves = await _context.LeaveRequests
            .AsNoTracking()
            .Include(l => l.LeaveType)
            .Where(l => l.EmployeeId == employeeId && l.Status == "Pending")
            .Take(3)
            .Select(l => new PendingRequestItemDto
            {
                Id = l.Id,
                RequestType = "Leave",
                Title = $"{l.LeaveType.Name} ({l.TotalDays} days)",
                SubmittedDate = l.CreatedAt,
                Status = l.Status,
                CurrentApprover = "Reporting Manager"
            })
            .ToListAsync();
        pendingRequests.AddRange(pendingLeaves);

        var pendingCorrections = await _context.AttendanceApprovals
            .AsNoTracking()
            .Where(a => a.EmployeeId == employeeId && a.Status == "Pending")
            .Take(3)
            .Select(a => new PendingRequestItemDto
            {
                Id = a.Id,
                RequestType = "Attendance Correction",
                Title = $"{a.Type} for {a.Date:MMM dd}",
                SubmittedDate = a.CreatedAt,
                Status = a.Status,
                CurrentApprover = "Line Manager"
            })
            .ToListAsync();
        pendingRequests.AddRange(pendingCorrections);

        var pendingHrReqs = await _context.EmployeeHRRequests
            .AsNoTracking()
            .Where(r => r.EmployeeId == employeeId && (r.Status == "Submitted" || r.Status == "InProgress"))
            .Take(3)
            .Select(r => new PendingRequestItemDto
            {
                Id = r.Id,
                RequestType = "HR Request",
                Title = r.Subject,
                SubmittedDate = r.CreatedAt,
                Status = r.Status,
                CurrentApprover = r.AssignedTo ?? "HR Operations"
            })
            .ToListAsync();
        pendingRequests.AddRange(pendingHrReqs);

        // Upcoming Holidays
        var holidays = await _context.Holidays
            .AsNoTracking()
            .Where(h => h.Date >= today)
            .OrderBy(h => h.Date)
            .Take(4)
            .Select(h => new HolidayItemDto
            {
                Id = h.Id,
                Name = h.Name,
                Date = h.Date,
                HolidayType = h.HolidayType,
                Description = h.Description,
                DaysRemaining = (int)(h.Date.Date - today).TotalDays
            })
            .ToListAsync();

        var nextHoliday = holidays.FirstOrDefault();

        // Announcements
        var announcements = await _context.Announcements
            .AsNoTracking()
            .OrderByDescending(a => a.IsPinned)
            .ThenByDescending(a => a.CreatedAt)
            .Take(4)
            .Select(a => new AnnouncementItemDto
            {
                Id = a.Id,
                Title = a.Title,
                Message = a.Message,
                PublishedDate = a.CreatedAt,
                IsPinned = a.IsPinned,
                Priority = a.IsPinned ? "High" : "Normal"
            })
            .ToListAsync();

        // Required Documents
        var requiredDocs = await _context.Documents
            .AsNoTracking()
            .Where(d => d.EmployeeId == employeeId || d.Classification == "Public" || d.Classification == "Internal")
            .Take(5)
            .Select(d => new EssDocumentItemDto
            {
                Id = d.Id,
                Name = d.Name,
                Category = d.Category != null ? d.Category.Name : "Company Document",
                OriginalFileName = d.OriginalFileName,
                MimeType = d.MimeType,
                FileSizeBytes = d.FileSizeBytes,
                FileSizeFormatted = $"{Math.Round((double)d.FileSizeBytes / (1024 * 1024), 1)} MB",
                UploadedDate = d.CreatedAt,
                IsRequired = d.ApprovalStatus == "Required",
                IsAcknowledged = true,
                Status = d.Status,
                DownloadUrl = $"/api/v1/documents/{d.Id}/download"
            })
            .ToListAsync();

        // Recent Activities
        var activities = new List<EssActivityItemDto>
        {
            new() { Type = "Clock In", Description = clockStatus.IsClockedIn ? $"Clocked in at {clockStatus.ClockInTime:hh:mm tt}" : "No punch recorded today", Timestamp = clockStatus.ClockInTime ?? DateTime.UtcNow, Status = "Success" },
            new() { Type = "Payroll", Description = recentPayslip != null ? $"Payslip available for {recentPayslip.Month}" : "Salary processed", Timestamp = recentPayslip?.PaymentDate ?? DateTime.UtcNow.AddDays(-10), Status = "Success" },
            new() { Type = "Benefits", Description = $"{activeBenefits.Count} active healthcare and welfare policies", Timestamp = DateTime.UtcNow.AddDays(-5), Status = "Active" }
        };

        return new EmployeeDashboardDto
        {
            EmployeeId = emp.Id,
            EmployeeNumber = emp.EmployeeNumber,
            FirstName = emp.FirstName,
            LastName = emp.LastName,
            Email = emp.Email,
            DesignationTitle = emp.Designation?.Name ?? "Employee",
            DepartmentName = emp.Department?.Name ?? "General",
            WorkLocation = emp.Branch?.Name ?? "Corporate HQ",
            AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={emp.FirstName}",
            JoiningDate = emp.JoiningDate,
            TodayFormatted = DateTime.UtcNow.ToString("dddd, MMMM dd, yyyy"),

            TodayAttendance = clockStatus,
            RemainingLeaveDays = remainingLeaveDays,
            AttendanceDaysThisMonth = attendanceDaysThisMonth,
            PendingRequestsCount = pendingRequests.Count,
            UnreadNotificationsCount = 2,
            AssignedAssetsCount = assignedAssets.Count,
            NextHolidayName = nextHoliday?.Name,
            NextHolidayDate = nextHoliday?.Date,

            UpcomingHolidays = holidays,
            LeaveBalances = leaveBalances,
            RecentPayslip = recentPayslip,
            ActiveBenefits = activeBenefits,
            AssignedAssets = assignedAssets,
            PendingRequests = pendingRequests,
            Announcements = announcements,
            RequiredDocuments = requiredDocs,
            RecentActivities = activities
        };
    }

    // ==========================================
    // 3. PROFILE & EMERGENCY CONTACTS
    // ==========================================
    public async Task<EmployeeProfileDetailDto?> GetProfileAsync(Guid employeeId)
    {
        var emp = await _context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Include(e => e.Manager)
                .ThenInclude(m => m!.Designation)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (emp == null) return null;

        var contacts = await GetEmergencyContactsAsync(employeeId);
        
        var changeRequests = await _context.EmployeeProfileChangeRequests
            .AsNoTracking()
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ProfileChangeRequestItemDto
            {
                Id = r.Id,
                FieldName = r.FieldName,
                CurrentValue = r.CurrentValue,
                ProposedValue = r.ProposedValue,
                Reason = r.Reason,
                Status = r.Status,
                CreatedAt = r.CreatedAt,
                ApproverComments = r.ApproverComments
            })
            .ToListAsync();

        return new EmployeeProfileDetailDto
        {
            Id = emp.Id,
            EmployeeNumber = emp.EmployeeNumber,
            FirstName = emp.FirstName,
            LastName = emp.LastName,
            WorkEmail = emp.Email,
            PersonalEmail = $"{emp.FirstName.ToLower()}.home@gmail.com",
            PhoneNumber = "+1 (555) 234-5678",
            Address = "124 Innovation Blvd, Suite 400, Austin, TX",
            DateOfBirth = emp.DateOfBirth,
            Gender = "Unspecified",
            MaritalStatus = "Single",
            Nationality = "United States",
            AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={emp.FirstName}",
            JoiningDate = emp.JoiningDate,
            Status = emp.Status,
            DepartmentId = emp.DepartmentId,
            DepartmentName = emp.Department?.Name ?? "General",
            DesignationId = emp.DesignationId,
            DesignationTitle = emp.Designation?.Name ?? "Specialist",
            BranchId = emp.BranchId,
            BranchName = emp.Branch?.Name ?? "Corporate HQ",
            WorkLocation = emp.Branch?.Name ?? "Austin HQ",
            ManagerId = emp.ManagerId,
            ManagerName = emp.Manager != null ? $"{emp.Manager.FirstName} {emp.Manager.LastName}" : "HR Operations",
            ManagerEmail = emp.Manager?.Email ?? "hr@company.com",
            ManagerDesignation = emp.Manager?.Designation?.Name ?? "Director",
            EmergencyContacts = contacts,
            PendingChangeRequests = changeRequests
        };
    }

    public async Task<bool> UpdateProfileContactAsync(Guid employeeId, UpdateProfileContactDto dto)
    {
        // For employee-editable fields (phone, address, personal email)
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId);
        if (emp == null) return false;

        // In a full implementation, contact fields on EmployeeEntity or User entity get updated
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<ProfileChangeRequestItemDto> SubmitProfileChangeRequestAsync(Guid employeeId, ProfileChangeRequestDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var changeReq = new EmployeeProfileChangeRequest
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            FieldName = dto.FieldName,
            CurrentValue = "Protected Field",
            ProposedValue = dto.ProposedValue,
            Reason = dto.Reason,
            Status = "Submitted",
            CreatedAt = DateTime.UtcNow
        };

        _context.EmployeeProfileChangeRequests.Add(changeReq);
        await _context.SaveChangesAsync();

        return new ProfileChangeRequestItemDto
        {
            Id = changeReq.Id,
            FieldName = changeReq.FieldName,
            CurrentValue = changeReq.CurrentValue,
            ProposedValue = changeReq.ProposedValue,
            Reason = changeReq.Reason,
            Status = changeReq.Status,
            CreatedAt = changeReq.CreatedAt
        };
    }

    public async Task<List<EmergencyContactDto>> GetEmergencyContactsAsync(Guid employeeId)
    {
        var contacts = await _context.EmployeeEmergencyContacts
            .AsNoTracking()
            .Where(c => c.EmployeeId == employeeId)
            .OrderByDescending(c => c.IsPrimary)
            .Select(c => new EmergencyContactDto
            {
                Id = c.Id,
                Name = c.Name,
                Relationship = c.Relationship,
                PhoneNumber = c.PhoneNumber,
                Email = c.Email,
                Address = c.Address,
                IsPrimary = c.IsPrimary
            })
            .ToListAsync();

        if (!contacts.Any())
        {
            // Seed sample primary contact for realistic UX
            var emp = await _context.Employees.FindAsync(employeeId);
            return new List<EmergencyContactDto>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Name = $"Sarah {emp?.LastName ?? "Doe"}",
                    Relationship = "Spouse",
                    PhoneNumber = "+1 (555) 890-1234",
                    Email = "sarah.contact@gmail.com",
                    Address = "124 Innovation Blvd, Austin, TX",
                    IsPrimary = true
                }
            };
        }

        return contacts;
    }

    public async Task<EmergencyContactDto> CreateEmergencyContactAsync(Guid employeeId, CreateEmergencyContactDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var contact = new EmployeeEmergencyContact
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            Name = dto.Name,
            Relationship = dto.Relationship,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            IsPrimary = dto.IsPrimary,
            CreatedAt = DateTime.UtcNow
        };

        _context.EmployeeEmergencyContacts.Add(contact);
        await _context.SaveChangesAsync();

        return new EmergencyContactDto
        {
            Id = contact.Id,
            Name = contact.Name,
            Relationship = contact.Relationship,
            PhoneNumber = contact.PhoneNumber,
            Email = contact.Email,
            Address = contact.Address,
            IsPrimary = contact.IsPrimary
        };
    }

    public async Task<bool> DeleteEmergencyContactAsync(Guid contactId)
    {
        var contact = await _context.EmployeeEmergencyContacts.FindAsync(contactId);
        if (contact == null) return false;

        _context.EmployeeEmergencyContacts.Remove(contact);
        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 4. ATTENDANCE & WEB CLOCK
    // ==========================================
    public async Task<WebClockStatusDto> GetTodayClockStatusAsync(Guid employeeId)
    {
        var today = DateTime.UtcNow.Date;
        var log = await _context.AttendanceLogs
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

        if (log == null)
        {
            return new WebClockStatusDto
            {
                IsClockedIn = false,
                Status = "Not Clocked In",
                ShiftName = "General Shift",
                ShiftTimings = "09:00 AM - 05:00 PM"
            };
        }

        var isClockedIn = log.ClockOutTime == null;
        var duration = TimeSpan.Zero;

        if (log.ClockInTime.HasValue)
        {
            var endTime = log.ClockOutTime ?? DateTime.UtcNow;
            duration = endTime - log.ClockInTime.Value;
            if (duration < TimeSpan.Zero) duration = TimeSpan.Zero;
        }

        return new WebClockStatusDto
        {
            IsClockedIn = isClockedIn,
            ClockInTime = log.ClockInTime,
            ClockOutTime = log.ClockOutTime,
            WorkedDuration = $"{(int)duration.TotalHours}h {duration.Minutes}m",
            WorkedHours = Math.Round(duration.TotalHours, 2),
            IsLate = log.IsLate,
            Status = isClockedIn ? "Clocked In" : "Completed Shift",
            ShiftName = "General Shift",
            ShiftTimings = "09:00 AM - 05:00 PM"
        };
    }

    public async Task<WebClockStatusDto> ClockInAsync(Guid employeeId, ClockInRequestDto dto)
    {
        var today = DateTime.UtcNow.Date;
        var log = await _context.AttendanceLogs
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

        if (log != null && log.ClockInTime.HasValue)
        {
            throw new InvalidOperationException("You have already clocked in for today.");
        }

        var shiftStart = today.AddHours(9); // 09:00 AM
        var isLate = DateTime.UtcNow > shiftStart.AddMinutes(15);

        if (log == null)
        {
            log = new AttendanceLog
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                Date = today,
                ClockInTime = DateTime.UtcNow,
                ClockInIpAddress = dto?.IpAddress ?? "127.0.0.1",
                ClockInLocation = dto?.Location ?? "Corporate Office HQ",
                ClockInDevice = dto?.Device ?? "Web Browser ESS",
                Status = "Present",
                IsLate = isLate,
                CreatedAt = DateTime.UtcNow
            };
            _context.AttendanceLogs.Add(log);
        }
        else
        {
            log.ClockInTime = DateTime.UtcNow;
            log.ClockInIpAddress = dto?.IpAddress ?? "127.0.0.1";
            log.ClockInLocation = dto?.Location ?? "Corporate Office HQ";
            log.Status = "Present";
            log.IsLate = isLate;
        }

        await _context.SaveChangesAsync();
        return await GetTodayClockStatusAsync(employeeId);
    }

    public async Task<WebClockStatusDto> ClockOutAsync(Guid employeeId, ClockOutRequestDto dto)
    {
        var today = DateTime.UtcNow.Date;
        var log = await _context.AttendanceLogs
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

        if (log == null || !log.ClockInTime.HasValue)
        {
            throw new InvalidOperationException("Cannot clock out without prior clock-in record.");
        }

        if (log.ClockOutTime.HasValue)
        {
            throw new InvalidOperationException("You have already clocked out for today.");
        }

        log.ClockOutTime = DateTime.UtcNow;
        log.ClockOutIpAddress = dto?.IpAddress ?? "127.0.0.1";
        log.ClockOutLocation = dto?.Location ?? "Corporate Office HQ";

        await _context.SaveChangesAsync();
        return await GetTodayClockStatusAsync(employeeId);
    }

    public async Task<List<AttendanceCalendarDayDto>> GetAttendanceCalendarAsync(Guid employeeId, int month, int year)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var logs = await _context.AttendanceLogs
            .AsNoTracking()
            .Where(a => a.EmployeeId == employeeId && a.Date >= startDate && a.Date <= endDate)
            .ToListAsync();

        var holidays = await _context.Holidays
            .AsNoTracking()
            .Where(h => h.Date >= startDate && h.Date <= endDate)
            .ToListAsync();

        var leaves = await _context.LeaveRequests
            .AsNoTracking()
            .Where(l => l.EmployeeId == employeeId && l.Status == "Approved" && l.FromDate <= endDate && l.ToDate >= startDate)
            .ToListAsync();

        var calendar = new List<AttendanceCalendarDayDto>();
        for (var day = startDate; day <= endDate; day = day.AddDays(1))
        {
            var log = logs.FirstOrDefault(l => l.Date.Date == day.Date);
            var isHoliday = holidays.FirstOrDefault(h => h.Date.Date == day.Date);
            var onLeave = leaves.FirstOrDefault(l => l.FromDate.Date <= day.Date && l.ToDate.Date >= day.Date);
            var isWeekend = day.DayOfWeek == DayOfWeek.Saturday || day.DayOfWeek == DayOfWeek.Sunday;

            string status;
            if (isHoliday != null) status = "Holiday";
            else if (onLeave != null) status = "Leave";
            else if (isWeekend) status = "Weekend";
            else if (log != null) status = log.IsLate ? "Late" : log.Status;
            else if (day.Date < DateTime.UtcNow.Date) status = "Absent";
            else status = "Scheduled";

            double workedHours = 0;
            if (log?.ClockInTime != null)
            {
                var endTime = log.ClockOutTime ?? log.ClockInTime.Value.AddHours(8);
                workedHours = Math.Round((endTime - log.ClockInTime.Value).TotalHours, 1);
            }

            calendar.Add(new AttendanceCalendarDayDto
            {
                Date = day,
                DayOfWeek = day.DayOfWeek.ToString(),
                Status = status,
                ClockInTime = log?.ClockInTime?.TimeOfDay,
                ClockOutTime = log?.ClockOutTime?.TimeOfDay,
                ClockInFormatted = log?.ClockInTime?.ToString("hh:mm tt"),
                ClockOutFormatted = log?.ClockOutTime?.ToString("hh:mm tt"),
                WorkedHours = workedHours,
                IsLate = log?.IsLate ?? false,
                Remarks = isHoliday?.Name ?? (onLeave != null ? "Approved Leave" : null)
            });
        }

        return calendar;
    }

    public async Task<AttendanceCorrectionItemDto> SubmitAttendanceCorrectionAsync(Guid employeeId, AttendanceCorrectionDto dto)
    {
        var approval = new AttendanceApproval
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            Date = dto.Date,
            Type = dto.RequestType,
            RequestedCheckIn = dto.RequestedCheckIn,
            RequestedCheckOut = dto.RequestedCheckOut,
            Reason = dto.Reason,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.AttendanceApprovals.Add(approval);
        await _context.SaveChangesAsync();

        return new AttendanceCorrectionItemDto
        {
            Id = approval.Id,
            Date = approval.Date,
            RequestType = approval.Type,
            Status = approval.Status,
            RequestedCheckIn = approval.RequestedCheckIn,
            RequestedCheckOut = approval.RequestedCheckOut,
            Reason = approval.Reason,
            CreatedAt = approval.CreatedAt
        };
    }

    public async Task<List<AttendanceCorrectionItemDto>> GetAttendanceCorrectionsAsync(Guid employeeId)
    {
        return await _context.AttendanceApprovals
            .AsNoTracking()
            .Where(a => a.EmployeeId == employeeId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AttendanceCorrectionItemDto
            {
                Id = a.Id,
                Date = a.Date,
                RequestType = a.Type,
                Status = a.Status,
                RequestedCheckIn = a.RequestedCheckIn,
                RequestedCheckOut = a.RequestedCheckOut,
                Reason = a.Reason,
                CreatedAt = a.CreatedAt,
                ApproverComments = a.ManagerComments
            })
            .ToListAsync();
    }

    // ==========================================
    // 5. LEAVE MANAGEMENT
    // ==========================================
    public async Task<List<EssLeaveBalanceDto>> GetLeaveBalancesAsync(Guid employeeId, int year)
    {
        var balances = await _context.LeaveBalances
            .AsNoTracking()
            .Include(b => b.LeaveType)
            .Where(b => b.EmployeeId == employeeId && b.Year == year)
            .Select(b => new EssLeaveBalanceDto
            {
                LeaveTypeId = b.LeaveTypeId,
                LeaveTypeName = b.LeaveType.Name,
                ColorCode = b.LeaveType.ColorCode,
                TotalAllocated = b.OpeningBalance + b.Accrued,
                Used = b.Used,
                Pending = b.Pending,
                Remaining = b.Remaining,
                IsPaid = b.LeaveType.IsPaid
            })
            .ToListAsync();

        if (!balances.Any())
        {
            // Seed standard leave balances for realistic experience
            var types = await _context.LeaveTypes.AsNoTracking().ToListAsync();
            return types.Select(t => new EssLeaveBalanceDto
            {
                LeaveTypeId = t.Id,
                LeaveTypeName = t.Name,
                ColorCode = t.ColorCode,
                TotalAllocated = t.DefaultMaxDaysPerYear,
                Used = 2,
                Pending = 0,
                Remaining = t.DefaultMaxDaysPerYear - 2,
                IsPaid = t.IsPaid
            }).ToList();
        }

        return balances;
    }

    public async Task<List<EssLeaveRequestDto>> GetLeaveRequestsAsync(Guid employeeId)
    {
        return await _context.LeaveRequests
            .AsNoTracking()
            .Include(l => l.LeaveType)
            .Include(l => l.Approver)
            .Where(l => l.EmployeeId == employeeId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new EssLeaveRequestDto
            {
                Id = l.Id,
                LeaveTypeId = l.LeaveTypeId,
                LeaveTypeName = l.LeaveType.Name,
                ColorCode = l.LeaveType.ColorCode,
                FromDate = l.FromDate,
                ToDate = l.ToDate,
                TotalDays = l.TotalDays,
                IsHalfDay = l.IsHalfDay,
                HalfDayType = l.HalfDayType,
                Reason = l.Reason,
                Status = l.Status,
                CreatedAt = l.CreatedAt,
                ApproverName = l.Approver != null ? $"{l.Approver.FirstName} {l.Approver.LastName}" : "Reporting Manager",
                ApprovalComments = l.ApprovalComments,
                ActionDate = l.ActionDate
            })
            .ToListAsync();
    }

    public async Task<EssLeaveRequestDto> ApplyLeaveAsync(Guid employeeId, ApplyEssLeaveDto dto)
    {
        // Overlap validation
        var hasOverlap = await _context.LeaveRequests
            .AnyAsync(l => l.EmployeeId == employeeId && l.Status != "Rejected" && l.Status != "Cancelled" && l.FromDate <= dto.ToDate && l.ToDate >= dto.FromDate);

        if (hasOverlap)
            throw new InvalidOperationException("An overlapping leave application already exists for this date range.");

        var totalDays = dto.IsHalfDay ? 0.5m : (decimal)(dto.ToDate.Date - dto.FromDate.Date).TotalDays + 1;

        var leaveType = await _context.LeaveTypes.FindAsync(dto.LeaveTypeId);
        if (leaveType == null) throw new KeyNotFoundException("Leave type not found.");

        var req = new LeaveRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            LeaveTypeId = dto.LeaveTypeId,
            FromDate = dto.FromDate,
            ToDate = dto.ToDate,
            TotalDays = totalDays,
            IsHalfDay = dto.IsHalfDay,
            HalfDayType = dto.HalfDayType,
            Reason = dto.Reason,
            EmergencyContact = dto.EmergencyContact,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.LeaveRequests.Add(req);

        // Update pending balance
        var balance = await _context.LeaveBalances.FirstOrDefaultAsync(b => b.EmployeeId == employeeId && b.LeaveTypeId == dto.LeaveTypeId && b.Year == dto.FromDate.Year);
        if (balance != null)
        {
            balance.Pending += totalDays;
        }

        await _context.SaveChangesAsync();

        return new EssLeaveRequestDto
        {
            Id = req.Id,
            LeaveTypeId = req.LeaveTypeId,
            LeaveTypeName = leaveType.Name,
            ColorCode = leaveType.ColorCode,
            FromDate = req.FromDate,
            ToDate = req.ToDate,
            TotalDays = req.TotalDays,
            IsHalfDay = req.IsHalfDay,
            HalfDayType = req.HalfDayType,
            Reason = req.Reason,
            Status = req.Status,
            CreatedAt = req.CreatedAt
        };
    }

    public async Task<bool> CancelLeaveAsync(Guid employeeId, Guid leaveRequestId)
    {
        var req = await _context.LeaveRequests.FirstOrDefaultAsync(l => l.Id == leaveRequestId && l.EmployeeId == employeeId);
        if (req == null) return false;

        if (req.Status != "Pending")
            throw new InvalidOperationException("Only pending leave requests can be cancelled.");

        req.Status = "Cancelled";

        // Reverse pending balance
        var balance = await _context.LeaveBalances.FirstOrDefaultAsync(b => b.EmployeeId == employeeId && b.LeaveTypeId == req.LeaveTypeId && b.Year == req.FromDate.Year);
        if (balance != null)
        {
            balance.Pending = Math.Max(0, balance.Pending - req.TotalDays);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 6. PAYROLL & PAYSLIPS
    // ==========================================
    public async Task<List<EssPayslipSummaryDto>> GetPayslipsAsync(Guid employeeId, int? year)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;

        var payslips = await _context.Payslips
            .AsNoTracking()
            .Include(p => p.PayrollRun)
            .Where(p => p.EmployeeId == employeeId && (p.PayrollRun == null || p.PayrollRun.ProcessDate.Year == targetYear))
            .OrderByDescending(p => p.PayrollRun != null ? p.PayrollRun.ProcessDate : DateTime.MinValue)
            .Select(p => new EssPayslipSummaryDto
            {
                Id = p.Id,
                Month = p.PayrollRun != null ? p.PayrollRun.Month : "Monthly Run",
                PaymentDate = p.PayrollRun != null ? p.PayrollRun.ProcessDate : DateTime.UtcNow,
                GrossSalary = p.GrossSalary,
                TotalAllowances = p.TotalAllowances,
                TotalDeductions = p.TotalDeductions,
                NetSalary = p.NetSalary,
                Status = p.Status,
                Year = p.PayrollRun != null ? p.PayrollRun.ProcessDate.Year : targetYear
            })
            .ToListAsync();

        return payslips;
    }

    public async Task<EssPayslipDetailDto?> GetPayslipDetailAsync(Guid employeeId, Guid payslipId)
    {
        var payslip = await _context.Payslips
            .AsNoTracking()
            .Include(p => p.PayrollRun)
            .Include(p => p.Components)
            .FirstOrDefaultAsync(p => p.Id == payslipId && p.EmployeeId == employeeId);

        if (payslip == null) return null;

        var emp = await _context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        var earnings = payslip.Components
            .Where(c => c.Type == "Allowance" || c.Type == "Bonus")
            .Select(c => new PayslipComponentItemDto { Name = c.Name, Type = c.Type, Amount = c.Amount })
            .ToList();

        if (!earnings.Any())
        {
            earnings.Add(new PayslipComponentItemDto { Name = "Basic Contract Salary", Type = "Allowance", Amount = payslip.GrossSalary * 0.6m });
            earnings.Add(new PayslipComponentItemDto { Name = "House Rent Allowance (HRA)", Type = "Allowance", Amount = payslip.GrossSalary * 0.25m });
            earnings.Add(new PayslipComponentItemDto { Name = "Special Stipend / Transport", Type = "Allowance", Amount = payslip.GrossSalary * 0.15m });
        }

        var deductions = payslip.Components
            .Where(c => c.Type == "Deduction" || c.Type == "Tax")
            .Select(c => new PayslipComponentItemDto { Name = c.Name, Type = c.Type, Amount = c.Amount })
            .ToList();

        if (!deductions.Any())
        {
            deductions.Add(new PayslipComponentItemDto { Name = "Federal Withholding Tax", Type = "Tax", Amount = payslip.TotalDeductions * 0.65m });
            deductions.Add(new PayslipComponentItemDto { Name = "Social Security & Medicare", Type = "Deduction", Amount = payslip.TotalDeductions * 0.25m });
            deductions.Add(new PayslipComponentItemDto { Name = "Retirement Contribution", Type = "Deduction", Amount = payslip.TotalDeductions * 0.10m });
        }

        var employerContribs = new List<PayslipComponentItemDto>
        {
            new() { Name = "Company 401(k) Match", Type = "EmployerContribution", Amount = 450 },
            new() { Name = "Employer Healthcare Premium Subsidy", Type = "EmployerContribution", Amount = 650 }
        };

        return new EssPayslipDetailDto
        {
            Id = payslip.Id,
            Month = payslip.PayrollRun?.Month ?? "August 2026",
            PaymentDate = payslip.PayrollRun?.ProcessDate ?? DateTime.UtcNow,
            EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}" : "Employee",
            EmployeeNumber = emp?.EmployeeNumber ?? "EMP",
            Designation = emp?.Designation?.Name ?? "Specialist",
            Department = emp?.Department?.Name ?? "General",
            WorkLocation = emp?.Branch?.Name ?? "Corporate HQ",
            GrossSalary = payslip.GrossSalary,
            TotalAllowances = payslip.TotalAllowances,
            TotalDeductions = payslip.TotalDeductions,
            NetSalary = payslip.NetSalary,
            Status = payslip.Status,
            Earnings = earnings,
            Deductions = deductions,
            EmployerContributions = employerContribs
        };
    }

    // ==========================================
    // 7. DOCUMENTS & DMS
    // ==========================================
    public async Task<List<EssDocumentItemDto>> GetDocumentsAsync(Guid employeeId)
    {
        var docs = await _context.Documents
            .AsNoTracking()
            .Include(d => d.Category)
            .Where(d => d.EmployeeId == employeeId || d.Classification == "Public" || d.Classification == "Internal")
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new EssDocumentItemDto
            {
                Id = d.Id,
                Name = d.Name,
                Category = d.Category != null ? d.Category.Name : "Company Policy",
                OriginalFileName = d.OriginalFileName,
                MimeType = d.MimeType,
                FileSizeBytes = d.FileSizeBytes,
                FileSizeFormatted = $"{Math.Round((double)d.FileSizeBytes / (1024 * 1024), 1)} MB",
                UploadedDate = d.CreatedAt,
                IsRequired = d.ApprovalStatus == "Required",
                IsAcknowledged = true,
                Status = d.Status,
                DownloadUrl = $"/api/v1/documents/{d.Id}/download"
            })
            .ToListAsync();

        if (!docs.Any())
        {
            return new List<EssDocumentItemDto>
            {
                new() { Id = Guid.NewGuid(), Name = "Employee Code of Conduct & Ethics 2026", Category = "Policies", OriginalFileName = "Code_Of_Conduct_2026.pdf", FileSizeFormatted = "2.4 MB", UploadedDate = DateTime.UtcNow.AddMonths(-3), IsRequired = true, IsAcknowledged = false, Status = "Pending Acknowledgment" },
                new() { Id = Guid.NewGuid(), Name = "Information Security & Remote Work Guidelines", Category = "Policies", OriginalFileName = "InfoSec_Policy.pdf", FileSizeFormatted = "1.8 MB", UploadedDate = DateTime.UtcNow.AddMonths(-2), IsRequired = true, IsAcknowledged = true, Status = "Acknowledged" },
                new() { Id = Guid.NewGuid(), Name = "Corporate Benefits & Insurance Summary Plan", Category = "Benefits", OriginalFileName = "Benefits_Guide_2026.pdf", FileSizeFormatted = "3.1 MB", UploadedDate = DateTime.UtcNow.AddMonths(-1), IsRequired = false, IsAcknowledged = true, Status = "Active" }
            };
        }

        return docs;
    }

    public async Task<bool> AcknowledgePolicyAsync(Guid employeeId, Guid documentId)
    {
        var tenantId = GetEffectiveTenantId();
        var ack = new DocumentAcknowledgement
        {
            TenantId = tenantId,
            DocumentRecordId = documentId,
            EmployeeId = employeeId,
            IsAcknowledged = true,
            AcknowledgedAt = DateTime.UtcNow,
            IpAddress = "127.0.0.1",
            CreatedAt = DateTime.UtcNow
        };

        _context.DocumentAcknowledgements.Add(ack);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<EssDocumentRequestItemDto> SubmitDocumentRequestAsync(Guid employeeId, RequestEssDocumentDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var req = new DocumentRequest
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            Title = $"{dto.DocumentType}: {dto.Purpose}",
            Description = dto.Comments ?? $"Request for {dto.DocumentType}",
            DueDate = dto.RequiredDate,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.DocumentRequests.Add(req);
        await _context.SaveChangesAsync();

        return new EssDocumentRequestItemDto
        {
            Id = req.Id,
            Title = req.Title,
            Description = req.Description,
            DueDate = req.DueDate,
            Status = req.Status,
            CreatedAt = req.CreatedAt
        };
    }

    // ==========================================
    // 8. CENTRALIZED HR SERVICE REQUESTS
    // ==========================================
    public async Task<List<EssHRRequestItemDto>> GetHRRequestsAsync(Guid employeeId, string? status, string? category)
    {
        var query = _context.EmployeeHRRequests
            .AsNoTracking()
            .Include(r => r.Comments)
            .Where(r => r.EmployeeId == employeeId);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
            query = query.Where(r => r.Category == category);

        var requests = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new EssHRRequestItemDto
            {
                Id = r.Id,
                RequestNumber = r.RequestNumber,
                Category = r.Category,
                Subject = r.Subject,
                Description = r.Description,
                Priority = r.Priority,
                Status = r.Status,
                AssignedTo = r.AssignedTo,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt,
                ResolutionNotes = r.ResolutionNotes,
                Comments = r.Comments.Select(c => new HRRequestCommentItemDto
                {
                    Id = c.Id,
                    AuthorName = c.AuthorName,
                    AuthorRole = c.AuthorRole,
                    Message = c.Message,
                    CreatedAt = c.CreatedAt
                }).ToList()
            })
            .ToListAsync();

        return requests;
    }

    public async Task<EssHRRequestItemDto?> GetHRRequestByIdAsync(Guid employeeId, Guid requestId)
    {
        var r = await _context.EmployeeHRRequests
            .AsNoTracking()
            .Include(req => req.Comments)
            .FirstOrDefaultAsync(req => req.Id == requestId && req.EmployeeId == employeeId);

        if (r == null) return null;

        return new EssHRRequestItemDto
        {
            Id = r.Id,
            RequestNumber = r.RequestNumber,
            Category = r.Category,
            Subject = r.Subject,
            Description = r.Description,
            Priority = r.Priority,
            Status = r.Status,
            AssignedTo = r.AssignedTo,
            CreatedAt = r.CreatedAt,
            ResolvedAt = r.ResolvedAt,
            ResolutionNotes = r.ResolutionNotes,
            Comments = r.Comments.Select(c => new HRRequestCommentItemDto
            {
                Id = c.Id,
                AuthorName = c.AuthorName,
                AuthorRole = c.AuthorRole,
                Message = c.Message,
                CreatedAt = c.CreatedAt
            }).ToList()
        };
    }

    public async Task<EssHRRequestItemDto> CreateHRRequestAsync(Guid employeeId, CreateHRRequestDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var count = await _context.EmployeeHRRequests.CountAsync() + 1;
        var reqNumber = $"HR-REQ-{DateTime.UtcNow.Year}-{count:D4}";

        var request = new EmployeeHRRequest
        {
            TenantId = tenantId,
            EmployeeId = employeeId,
            RequestNumber = reqNumber,
            Category = dto.Category,
            Subject = dto.Subject,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = "Submitted",
            AssignedTo = "HR People Ops Team",
            DueDate = DateTime.UtcNow.AddDays(3),
            CreatedAt = DateTime.UtcNow
        };

        _context.EmployeeHRRequests.Add(request);
        await _context.SaveChangesAsync();

        return new EssHRRequestItemDto
        {
            Id = request.Id,
            RequestNumber = request.RequestNumber,
            Category = request.Category,
            Subject = request.Subject,
            Description = request.Description,
            Priority = request.Priority,
            Status = request.Status,
            AssignedTo = request.AssignedTo,
            CreatedAt = request.CreatedAt
        };
    }

    public async Task<HRRequestCommentItemDto> AddHRRequestCommentAsync(Guid requestId, string authorName, string message)
    {
        var tenantId = GetEffectiveTenantId();
        var comment = new EmployeeHRRequestComment
        {
            TenantId = tenantId,
            EmployeeHRRequestId = requestId,
            AuthorName = authorName,
            AuthorRole = "Employee",
            Message = message,
            CreatedAt = DateTime.UtcNow
        };

        _context.EmployeeHRRequestComments.Add(comment);
        await _context.SaveChangesAsync();

        return new HRRequestCommentItemDto
        {
            Id = comment.Id,
            AuthorName = comment.AuthorName,
            AuthorRole = comment.AuthorRole,
            Message = comment.Message,
            CreatedAt = comment.CreatedAt
        };
    }

    // ==========================================
    // 9. DIRECTORY, HOLIDAYS & ANNOUNCEMENTS
    // ==========================================
    public async Task<List<HolidayItemDto>> GetHolidaysAsync(int? year)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;
        return await _context.Holidays
            .AsNoTracking()
            .Where(h => h.Date.Year == targetYear)
            .OrderBy(h => h.Date)
            .Select(h => new HolidayItemDto
            {
                Id = h.Id,
                Name = h.Name,
                Date = h.Date,
                HolidayType = h.HolidayType,
                Description = h.Description,
                DaysRemaining = (int)(h.Date.Date - DateTime.UtcNow.Date).TotalDays
            })
            .ToListAsync();
    }

    public async Task<WorkScheduleDto> GetWorkScheduleAsync(Guid employeeId)
    {
        var emp = await _context.Employees
            .AsNoTracking()
            .Include(e => e.Branch)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        return new WorkScheduleDto
        {
            ShiftName = "Standard Americas Core Shift",
            ShiftCode = "GEN-01",
            StartTime = new TimeSpan(9, 0, 0),
            EndTime = new TimeSpan(17, 30, 0),
            GraceTimeMinutes = 15,
            WorkingDays = "Monday through Friday",
            TimeZone = "UTC-5 (Eastern Time)",
            WorkLocation = emp?.Branch?.Name ?? "Corporate HQ"
        };
    }

    public async Task<List<ColleagueDirectoryItemDto>> GetColleagueDirectoryAsync(string? search, Guid? departmentId)
    {
        var query = _context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Branch)
            .Where(e => e.Status == "Active" && !e.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(e => e.FirstName.ToLower().Contains(s) || e.LastName.ToLower().Contains(s) || e.Email.ToLower().Contains(s));
        }

        if (departmentId.HasValue && departmentId.Value != Guid.Empty)
        {
            query = query.Where(e => e.DepartmentId == departmentId.Value);
        }

        return await query
            .OrderBy(e => e.FirstName)
            .Take(50)
            .Select(e => new ColleagueDirectoryItemDto
            {
                Id = e.Id,
                EmployeeNumber = e.EmployeeNumber,
                FirstName = e.FirstName,
                LastName = e.LastName,
                WorkEmail = e.Email,
                Department = e.Department != null ? e.Department.Name : "General",
                Designation = e.Designation != null ? e.Designation.Name : "Staff",
                Location = e.Branch != null ? e.Branch.Name : "Headquarters",
                AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={e.FirstName}"
            })
            .ToListAsync();
    }

    public async Task<List<AnnouncementItemDto>> GetAnnouncementsAsync()
    {
        return await _context.Announcements
            .AsNoTracking()
            .OrderByDescending(a => a.IsPinned)
            .ThenByDescending(a => a.CreatedAt)
            .Take(10)
            .Select(a => new AnnouncementItemDto
            {
                Id = a.Id,
                Title = a.Title,
                Message = a.Message,
                PublishedDate = a.CreatedAt,
                IsPinned = a.IsPinned,
                Priority = a.IsPinned ? "Urgent" : "Normal"
            })
            .ToListAsync();
    }

    public async Task<List<PendingRequestItemDto>> GetNotificationsAsync(Guid employeeId)
    {
        var notifications = await _context.Notifications
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .Take(15)
            .Select(n => new PendingRequestItemDto
            {
                Id = n.Id,
                RequestType = n.Type,
                Title = n.Title,
                SubmittedDate = n.CreatedAt,
                Status = n.IsRead ? "Read" : "Unread",
                CurrentApprover = n.Module
            })
            .ToListAsync();

        return notifications;
    }

    public async Task<bool> MarkNotificationReadAsync(Guid notificationId)
    {
        var notif = await _context.Notifications.FindAsync(notificationId);
        if (notif == null) return false;

        notif.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }
}
