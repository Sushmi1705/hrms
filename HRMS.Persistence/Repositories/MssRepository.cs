using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Manager.DTOs;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Persistence.Repositories;

public class MssRepository : IMssRepository
{
    private readonly HrmsDbContext _context;
    private readonly ITenantContext _tenantContext;

    public MssRepository(HrmsDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    private Guid GetTenantId() =>
        _tenantContext.CurrentTenantId ?? Guid.Parse("11111111-1111-1111-1111-111111111111");

    public async Task<EmployeeEntity?> ResolveManagerAsync(Guid? overrideId = null, string? overrideEmail = null)
    {
        if (overrideId.HasValue)
            return await _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch)
                .FirstOrDefaultAsync(e => e.Id == overrideId.Value && e.Status == "Active");
        if (!string.IsNullOrEmpty(overrideEmail))
            return await _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch)
                .FirstOrDefaultAsync(e => e.Email == overrideEmail && e.Status == "Active");
        var managerIds = await _context.Employees.Where(e => e.ManagerId.HasValue).Select(e => e.ManagerId!.Value).Distinct().ToListAsync();
        var mgr = await _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch).FirstOrDefaultAsync(e => managerIds.Contains(e.Id) && e.Status == "Active"); if (mgr == null) mgr = await _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch).FirstOrDefaultAsync(e => e.Status == "Active"); return mgr;
    }

    private async Task<List<Guid>> GetAuthorizedTeamIdsAsync(Guid managerId) =>
        await _context.Employees.Where(e => e.ManagerId == managerId && e.Status == "Active").Select(e => e.Id).ToListAsync();

    private async Task<bool> IsTeamMemberAsync(Guid managerId, Guid employeeId) =>
        await _context.Employees.AnyAsync(e => e.Id == employeeId && e.ManagerId == managerId && e.Status == "Active");

    // ======================== DASHBOARD ========================
    public async Task<MssDashboardDto> GetDashboardAsync(Guid managerId)
    {
        var manager = await _context.Employees.Include(e => e.Department).Include(e => e.Designation).FirstOrDefaultAsync(e => e.Id == managerId);
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var today = DateTime.Today;
        var todayAtt = await _context.AttendanceLogs.Where(a => teamIds.Contains(a.EmployeeId) && a.Date == today).ToListAsync();
        var onLeaveToday = await _context.LeaveRequests.CountAsync(l => teamIds.Contains(l.EmployeeId) && l.Status == "Approved" && l.FromDate <= today && l.ToDate >= today);
        var presentToday = todayAtt.Count(a => a.ClockInTime.HasValue);
        var lateToday = todayAtt.Count(a => a.IsLate);
        var absentToday = Math.Max(0, teamIds.Count - presentToday - onLeaveToday);
        var pendingLeave = await _context.LeaveRequests.CountAsync(l => teamIds.Contains(l.EmployeeId) && l.Status == "Pending");
        var pendingAtt = await _context.AttendanceApprovals.CountAsync(a => teamIds.Contains(a.EmployeeId) && a.Status == "Pending");
        var pendingReviews = await _context.PerformanceReviews.CountAsync(r => teamIds.Contains(r.EmployeeId) && r.ManagerId == managerId && (r.Status == "Submitted" || r.Status == "Draft"));
        var openRequests = await _context.EmployeeHRRequests.CountAsync(r => teamIds.Contains(r.EmployeeId) && r.Status != "Resolved" && r.Status != "Closed");
        var assetsCount = await _context.AssetAssignments.CountAsync(a => teamIds.Contains(a.EmployeeId) && a.Status == "Active");
        var members = await _context.Employees.Where(e => teamIds.Contains(e.Id)).ToListAsync();
        var upcomingBirthdays = members.Count(emp => { try { var bd = new DateTime(today.Year, emp.DateOfBirth.Month, emp.DateOfBirth.Day); if (bd < today) bd = bd.AddYears(1); return (bd - today).TotalDays <= 30; } catch { return false; } });
        var trend = new List<AttendanceTrendPoint>();
        for (int i = 6; i >= 0; i--)
        {
            var d = today.AddDays(-i);
            var dl = await _context.AttendanceLogs.Where(a => teamIds.Contains(a.EmployeeId) && a.Date == d).ToListAsync();
            trend.Add(new AttendanceTrendPoint { Date = d.ToString("dd MMM"), Present = dl.Count(x => x.ClockInTime.HasValue), Late = dl.Count(x => x.IsLate), Absent = Math.Max(0, teamIds.Count - dl.Count(x => x.ClockInTime.HasValue)), OnLeave = dl.Count(x => x.Status == "Leave") });
        }
        var leaveTrend = new List<LeaveTrendPoint>();
        for (int i = 5; i >= 0; i--)
        {
            var m = today.AddMonths(-i); var ms = new DateTime(m.Year, m.Month, 1); var me = ms.AddMonths(1).AddDays(-1);
            var ml = await _context.LeaveRequests.Where(l => teamIds.Contains(l.EmployeeId) && l.FromDate >= ms && l.FromDate <= me).ToListAsync();
            leaveTrend.Add(new LeaveTrendPoint { Month = m.ToString("MMM yy"), Approved = ml.Count(l => l.Status == "Approved"), Pending = ml.Count(l => l.Status == "Pending"), Rejected = ml.Count(l => l.Status == "Rejected") });
        }
        var snapshot = new List<TeamMemberStatusDto>();
        var snapEmps = await _context.Employees.Include(e => e.Designation).Where(e => teamIds.Contains(e.Id)).Take(10).ToListAsync();
        foreach (var emp in snapEmps)
        {
            var att = todayAtt.FirstOrDefault(a => a.EmployeeId == emp.Id);
            var ls = await _context.LeaveRequests.Where(l => l.EmployeeId == emp.Id && l.Status == "Approved" && l.FromDate <= today && l.ToDate >= today).Include(l => l.LeaveType).Select(l => l.LeaveType.Name).FirstOrDefaultAsync();
            string ats = att == null ? (ls != null ? "On Leave" : "Absent") : att.IsLate ? "Late" : "Present";
            snapshot.Add(new TeamMemberStatusDto { EmployeeId = emp.Id, Name = $"{emp.FirstName} {emp.LastName}", Designation = emp.Designation?.Name ?? string.Empty, AttendanceStatus = ats, LeaveStatus = ls });
        }
        var calEvents = await GetTeamCalendarAsync(managerId, today.Month, today.Year);
        return new MssDashboardDto
        {
            ManagerName = manager != null ? $"{manager.FirstName} {manager.LastName}" : "Manager",
            Designation = manager?.Designation?.Name ?? string.Empty, Department = manager?.Department?.Name ?? string.Empty,
            TeamSize = teamIds.Count, Today = today,
            PresentToday = presentToday, AbsentToday = absentToday, OnLeaveToday = onLeaveToday, LateToday = lateToday,
            PendingLeaveApprovals = pendingLeave, PendingAttendanceApprovals = pendingAtt,
            PendingPerformanceReviews = pendingReviews, OpenHRRequests = openRequests,
            TeamAssetsCount = assetsCount, TrainingOverdue = 0, UpcomingBirthdays = upcomingBirthdays,
            AttendanceTrend = trend, LeaveTrend = leaveTrend, TeamStatusSnapshot = snapshot,
            UpcomingEvents = calEvents.Take(5).ToList()
        };
    }

    // ======================== TEAM ========================
    public async Task<MssTeamPagedDto> GetTeamAsync(Guid managerId, MssTeamFilterDto filter)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var today = DateTime.Today;
        var query = _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch).Where(e => teamIds.Contains(e.Id));
        if (!string.IsNullOrEmpty(filter.Search)) { var s = filter.Search.ToLower(); query = query.Where(e => (e.FirstName + " " + e.LastName).ToLower().Contains(s) || e.EmployeeNumber.ToLower().Contains(s) || e.Email.ToLower().Contains(s)); }
        if (!string.IsNullOrEmpty(filter.Status)) query = query.Where(e => e.Status == filter.Status);
        var total = await query.CountAsync();
        var employees = await query.Skip((filter.Page - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync();
        var items = new List<MssTeamMemberDto>();
        foreach (var emp in employees)
        {
            var att = await _context.AttendanceLogs.FirstOrDefaultAsync(a => a.EmployeeId == emp.Id && a.Date == today);
            var onLeave = await _context.LeaveRequests.AnyAsync(l => l.EmployeeId == emp.Id && l.Status == "Approved" && l.FromDate <= today && l.ToDate >= today);
            var assetCount = await _context.AssetAssignments.CountAsync(a => a.EmployeeId == emp.Id && a.Status == "Active");
            var review = await _context.PerformanceReviews.Where(r => r.EmployeeId == emp.Id).OrderByDescending(r => r.CreatedAt).FirstOrDefaultAsync();
            string ats = onLeave ? "On Leave" : att == null ? "Absent" : att.IsLate ? "Late" : "Present";
            items.Add(new MssTeamMemberDto { EmployeeId = emp.Id, EmployeeNumber = emp.EmployeeNumber, Name = $"{emp.FirstName} {emp.LastName}", Email = emp.Email, Designation = emp.Designation?.Name ?? string.Empty, Department = emp.Department?.Name ?? string.Empty, Branch = emp.Branch?.Name ?? string.Empty, JoiningDate = emp.JoiningDate, Status = emp.Status, AttendanceStatus = ats, LeaveStatus = onLeave ? "On Leave" : "In Office", PerformanceStatus = review?.Status ?? "N/A", AssetCount = assetCount });
        }
        return new MssTeamPagedDto { Items = items, TotalCount = total, Page = filter.Page, PageSize = filter.PageSize };
    }

    public async Task<MssTeamMemberDetailDto?> GetTeamMemberAsync(Guid managerId, Guid employeeId)
    {
        if (!await IsTeamMemberAsync(managerId, employeeId)) return null;
        var emp = await _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch).FirstOrDefaultAsync(e => e.Id == employeeId);
        if (emp == null) return null;
        var today = DateTime.Today;
        var att = await _context.AttendanceLogs.FirstOrDefaultAsync(a => a.EmployeeId == emp.Id && a.Date == today);
        var onLeave = await _context.LeaveRequests.AnyAsync(l => l.EmployeeId == emp.Id && l.Status == "Approved" && l.FromDate <= today && l.ToDate >= today);
        var assetCount = await _context.AssetAssignments.CountAsync(a => a.EmployeeId == emp.Id && a.Status == "Active");
        var review = await _context.PerformanceReviews.Where(r => r.EmployeeId == emp.Id).OrderByDescending(r => r.CreatedAt).FirstOrDefaultAsync();
        string ats = onLeave ? "On Leave" : att == null ? "Absent" : att.IsLate ? "Late" : "Present";
        var recentAtt = await _context.AttendanceLogs.Where(a => a.EmployeeId == employeeId && a.Date >= today.AddDays(-30)).OrderByDescending(a => a.Date).Select(a => new TeamAttendanceDayDto { EmployeeId = a.EmployeeId, EmployeeName = emp.FirstName + " " + emp.LastName, Date = a.Date, ClockIn = a.ClockInTime, ClockOut = a.ClockOutTime, WorkingHours = a.TotalWorkingHours, IsLate = a.IsLate, IsEarlyOut = a.IsEarlyOut, IsMissingPunch = a.IsMissingPunch, Status = a.Status, Remarks = a.Remarks }).ToListAsync();
        var recentLeave = await _context.LeaveRequests.Include(l => l.LeaveType).Where(l => l.EmployeeId == employeeId).OrderByDescending(l => l.CreatedAt).Take(5).Select(l => new MssLeaveRequestDto { LeaveRequestId = l.Id, EmployeeId = l.EmployeeId, EmployeeName = emp.FirstName + " " + emp.LastName, LeaveType = l.LeaveType.Name, FromDate = l.FromDate, ToDate = l.ToDate, TotalDays = l.TotalDays, Reason = l.Reason, Status = l.Status, SubmittedAt = l.CreatedAt, IsHalfDay = l.IsHalfDay }).ToListAsync();
        var goals = await _context.Goals.Where(g => g.EmployeeId == employeeId).OrderByDescending(g => g.CreatedAt).Take(5).Select(g => new MssGoalDto { GoalId = g.Id, EmployeeId = g.EmployeeId, EmployeeName = emp.FirstName + " " + emp.LastName, Title = g.Title, Description = g.Description, GoalType = g.GoalType, Priority = g.Priority, Weightage = g.Weightage, ProgressPercentage = g.ProgressPercentage, Deadline = g.Deadline, Status = g.Status }).ToListAsync();
        var assets = await _context.AssetAssignments.Include(a => a.Asset).ThenInclude(a => a.Category).Where(a => a.EmployeeId == employeeId && a.Status == "Active").Select(a => new MssTeamAssetDto { AssetId = a.Asset.Id, EmployeeId = a.EmployeeId, EmployeeName = emp.FirstName + " " + emp.LastName, AssetTag = a.Asset.AssetTag, AssetName = a.Asset.AssetName, Category = a.Asset.Category != null ? a.Asset.Category.Name : string.Empty, Status = a.Asset.Status, AssignedDate = a.AssignedDate }).ToListAsync();
        var trainingIds = await _context.CourseAssignments.Where(ca => ca.EmployeeId == employeeId).OrderByDescending(ca => ca.CreatedAt).Take(5).Select(ca => ca.Id).ToListAsync();
        var training = new List<MssTrainingDto>();
        foreach (var tid in trainingIds) { var ca = await _context.CourseAssignments.FirstOrDefaultAsync(x => x.Id == tid); if (ca == null) continue; var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == ca.CourseId); training.Add(new MssTrainingDto { AssignmentId = ca.Id, EmployeeId = ca.EmployeeId, EmployeeName = emp.FirstName + " " + emp.LastName, CourseName = course?.Title ?? "Course", Status = ca.Status, CompletionPercentage = ca.ProgressPercentage, IsOverdue = false }); }
        return new MssTeamMemberDetailDto { EmployeeId = emp.Id, EmployeeNumber = emp.EmployeeNumber, Name = $"{emp.FirstName} {emp.LastName}", Email = emp.Email, Designation = emp.Designation?.Name ?? string.Empty, Department = emp.Department?.Name ?? string.Empty, Branch = emp.Branch?.Name ?? string.Empty, JoiningDate = emp.JoiningDate, Status = emp.Status, AttendanceStatus = ats, LeaveStatus = onLeave ? "On Leave" : "In Office", PerformanceStatus = review?.Status ?? "N/A", AssetCount = assetCount, RecentAttendance = recentAtt, RecentLeave = recentLeave, Performance = new MssPerformanceSummaryDto { GoalsTotal = goals.Count, GoalsCompleted = goals.Count(g => g.Status == "Completed"), LastRating = review?.ManagerRating, ReviewStatus = review?.Status ?? "None" }, Goals = goals, Assets = assets, Training = training };
    }

    public async Task<List<TeamDirectoryItemDto>> GetTeamDirectoryAsync(Guid managerId, string? search)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var query = _context.Employees.Include(e => e.Department).Include(e => e.Designation).Include(e => e.Branch).Where(e => teamIds.Contains(e.Id));
        if (!string.IsNullOrEmpty(search)) { var s = search.ToLower(); query = query.Where(e => (e.FirstName + " " + e.LastName).ToLower().Contains(s) || e.Email.ToLower().Contains(s)); }
        return await query.Select(e => new TeamDirectoryItemDto { EmployeeId = e.Id, Name = e.FirstName + " " + e.LastName, Email = e.Email, Designation = e.Designation != null ? e.Designation.Name : string.Empty, Department = e.Department != null ? e.Department.Name : string.Empty, Branch = e.Branch != null ? e.Branch.Name : string.Empty, Status = e.Status, JoiningDate = e.JoiningDate }).ToListAsync();
    }

    // ======================== ATTENDANCE ========================
    public async Task<List<TeamAttendanceDayDto>> GetTeamAttendanceAsync(Guid managerId, int month, int year, Guid? employeeId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (employeeId.HasValue) { if (!teamIds.Contains(employeeId.Value)) return new(); teamIds = new List<Guid> { employeeId.Value }; }
        var start = new DateTime(year, month, 1); var end = start.AddMonths(1).AddDays(-1);
        var logs = await _context.AttendanceLogs.Include(a => a.Employee).Where(a => teamIds.Contains(a.EmployeeId) && a.Date >= start && a.Date <= end).ToListAsync();
        return logs.Select(a => new TeamAttendanceDayDto { EmployeeId = a.EmployeeId, EmployeeName = a.Employee != null ? $"{a.Employee.FirstName} {a.Employee.LastName}" : string.Empty, Date = a.Date, ClockIn = a.ClockInTime, ClockOut = a.ClockOutTime, WorkingHours = a.TotalWorkingHours, IsLate = a.IsLate, IsEarlyOut = a.IsEarlyOut, IsMissingPunch = a.IsMissingPunch, Status = a.Status, Remarks = a.Remarks }).ToList();
    }

    public async Task<List<MssAttendanceRequestDto>> GetAttendanceRequestsAsync(Guid managerId, string? status)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var query = _context.AttendanceApprovals.Include(a => a.Employee).Where(a => teamIds.Contains(a.EmployeeId));
        if (!string.IsNullOrEmpty(status)) query = query.Where(a => a.Status == status);
        return await query.OrderByDescending(a => a.CreatedAt).Select(a => new MssAttendanceRequestDto { RequestId = a.Id, EmployeeId = a.EmployeeId, EmployeeName = a.Employee != null ? a.Employee.FirstName + " " + a.Employee.LastName : string.Empty, AttendanceDate = a.Date, RequestType = a.Type, RequestedClockIn = a.RequestedCheckIn, RequestedClockOut = a.RequestedCheckOut, Reason = a.Reason, Status = a.Status, SubmittedAt = a.CreatedAt, ManagerComments = a.ManagerComments }).ToListAsync();
    }

    public async Task<bool> ApproveAttendanceRequestAsync(Guid managerId, Guid requestId, bool approved, string? comments)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var req = await _context.AttendanceApprovals.FirstOrDefaultAsync(a => a.Id == requestId);
        if (req == null || !teamIds.Contains(req.EmployeeId)) return false;
        req.Status = approved ? "Approved" : "Rejected"; req.ManagerComments = comments; req.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(); return true;
    }

    // ======================== LEAVE ========================
    public async Task<List<MssLeaveRequestDto>> GetTeamLeaveAsync(Guid managerId, string? status, Guid? employeeId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (employeeId.HasValue) { if (!teamIds.Contains(employeeId.Value)) return new(); teamIds = new List<Guid> { employeeId.Value }; }
        var query = _context.LeaveRequests.Include(l => l.Employee).Include(l => l.LeaveType).Where(l => teamIds.Contains(l.EmployeeId));
        if (!string.IsNullOrEmpty(status)) query = query.Where(l => l.Status == status);
        return await query.OrderByDescending(l => l.CreatedAt).Select(l => new MssLeaveRequestDto { LeaveRequestId = l.Id, EmployeeId = l.EmployeeId, EmployeeName = l.Employee != null ? l.Employee.FirstName + " " + l.Employee.LastName : string.Empty, LeaveType = l.LeaveType != null ? l.LeaveType.Name : string.Empty, FromDate = l.FromDate, ToDate = l.ToDate, TotalDays = l.TotalDays, Reason = l.Reason, Status = l.Status, SubmittedAt = l.CreatedAt, ApprovalComments = l.ApprovalComments, IsHalfDay = l.IsHalfDay }).ToListAsync();
    }

    public async Task<bool> ApproveLeaveAsync(Guid managerId, Guid leaveRequestId, bool approved, string? comments)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var leave = await _context.LeaveRequests.FirstOrDefaultAsync(l => l.Id == leaveRequestId);
        if (leave == null || !teamIds.Contains(leave.EmployeeId)) return false;
        leave.Status = approved ? "Approved" : "Rejected"; leave.ApprovalComments = comments; leave.ApproverId = managerId; leave.ActionDate = DateTime.UtcNow; leave.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(); return true;
    }

    // ======================== PERFORMANCE ========================
    public async Task<MssPerformanceOverviewDto> GetTeamPerformanceAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var reviews = await _context.PerformanceReviews.Include(r => r.Employee).Include(r => r.ReviewCycle).Where(r => teamIds.Contains(r.EmployeeId)).ToListAsync();
        var goals = await _context.Goals.Include(g => g.Employee).Where(g => teamIds.Contains(g.EmployeeId)).ToListAsync();
        var pending = reviews.Where(r => r.Status == "Submitted" || r.Status == "Draft").ToList();
        var completed = reviews.Where(r => r.Status == "Finalized" || r.Status == "Approved").ToList();
        var pendingDtos = pending.Select(r => new MssReviewItemDto { ReviewId = r.Id, EmployeeId = r.EmployeeId, EmployeeName = r.Employee != null ? $"{r.Employee.FirstName} {r.Employee.LastName}" : string.Empty, ReviewCycle = r.ReviewCycle?.Name ?? string.Empty, Status = r.Status, SelfRating = r.SelfRating, ManagerRating = r.ManagerRating, FinalRating = r.FinalRating, SubmittedAt = r.SubmittedAt, ManagerReviewedAt = r.ManagerReviewedAt, ManagerComments = r.ManagerComments }).ToList();
        var recentGoals = goals.OrderByDescending(g => g.CreatedAt).Take(10).Select(g => new MssGoalDto { GoalId = g.Id, EmployeeId = g.EmployeeId, EmployeeName = g.Employee != null ? $"{g.Employee.FirstName} {g.Employee.LastName}" : string.Empty, Title = g.Title, Description = g.Description, GoalType = g.GoalType, Priority = g.Priority, Weightage = g.Weightage, ProgressPercentage = g.ProgressPercentage, Deadline = g.Deadline, Status = g.Status }).ToList();
        var ratingDist = reviews.Where(r => !string.IsNullOrEmpty(r.FinalRating)).GroupBy(r => r.FinalRating!).Select(g => new RatingDistributionDto { Rating = g.Key, Count = g.Count() }).ToList();
        return new MssPerformanceOverviewDto { ReviewsPending = pending.Count, ReviewsCompleted = completed.Count, GoalsOnTrack = goals.Count(g => g.Status == "In Progress"), GoalsAtRisk = goals.Count(g => g.Status == "Overdue"), GoalsCompleted = goals.Count(g => g.Status == "Completed"), GoalsTotal = goals.Count, PendingReviews = pendingDtos, RecentGoals = recentGoals, RatingDistribution = ratingDist };
    }

    public async Task<List<MssGoalDto>> GetTeamGoalsAsync(Guid managerId, Guid? employeeId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (employeeId.HasValue && !teamIds.Contains(employeeId.Value)) return new();
        var query = _context.Goals.Include(g => g.Employee).Where(g => teamIds.Contains(g.EmployeeId));
        if (employeeId.HasValue) query = query.Where(g => g.EmployeeId == employeeId.Value);
        return await query.OrderByDescending(g => g.CreatedAt).Select(g => new MssGoalDto { GoalId = g.Id, EmployeeId = g.EmployeeId, EmployeeName = g.Employee != null ? g.Employee.FirstName + " " + g.Employee.LastName : string.Empty, Title = g.Title, Description = g.Description, GoalType = g.GoalType, Priority = g.Priority, Weightage = g.Weightage, ProgressPercentage = g.ProgressPercentage, Deadline = g.Deadline, Status = g.Status, Comments = g.Comments }).ToListAsync();
    }

    public async Task<MssGoalDto> CreateGoalAsync(Guid managerId, CreateMssGoalDto dto)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (!teamIds.Contains(dto.EmployeeId)) throw new UnauthorizedAccessException("Employee is not in your team.");
        var cycle = await _context.ReviewCycles.FirstOrDefaultAsync();
        var goal = new HRMS.Domain.Entities.Performance.Goal { Id = Guid.NewGuid(), EmployeeId = dto.EmployeeId, ReviewCycleId = cycle?.Id ?? Guid.NewGuid(), Title = dto.Title, Description = dto.Description, GoalType = dto.GoalType, Priority = dto.Priority, Weightage = dto.Weightage, ProgressPercentage = 0, Deadline = dto.Deadline, Status = "Not Started", TenantId = GetTenantId() };
        _context.Goals.Add(goal); await _context.SaveChangesAsync();
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        return new MssGoalDto { GoalId = goal.Id, EmployeeId = goal.EmployeeId, EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}" : string.Empty, Title = goal.Title, Description = goal.Description, GoalType = goal.GoalType, Priority = goal.Priority, Weightage = goal.Weightage, ProgressPercentage = goal.ProgressPercentage, Deadline = goal.Deadline, Status = goal.Status };
    }

    public async Task<bool> UpdateGoalProgressAsync(Guid managerId, Guid goalId, decimal progress, string? comments)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == goalId);
        if (goal == null || !teamIds.Contains(goal.EmployeeId)) return false;
        goal.ProgressPercentage = progress; if (!string.IsNullOrEmpty(comments)) goal.Comments = comments;
        goal.Status = progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : goal.Status; goal.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(); return true;
    }

    public async Task<bool> SubmitPerformanceReviewAsync(Guid managerId, Guid reviewId, SubmitReviewDto dto)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var review = await _context.PerformanceReviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null || !teamIds.Contains(review.EmployeeId)) return false;
        review.ManagerComments = dto.ManagerComments; review.ManagerRating = dto.ManagerRating; review.FinalRating = dto.FinalRating; review.ManagerId = managerId; review.Status = "Manager Reviewed"; review.ManagerReviewedAt = DateTime.UtcNow; review.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(); return true;
    }

    public async Task<bool> SubmitFeedbackAsync(Guid managerId, CreateMssFeedbackDto dto)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (!teamIds.Contains(dto.EmployeeId)) return false;
        var cycle = await _context.ReviewCycles.FirstOrDefaultAsync();
        _context.Feedbacks360.Add(new HRMS.Domain.Entities.Performance.Feedback360 { Id = Guid.NewGuid(), TargetEmployeeId = dto.EmployeeId, ReviewerEmployeeId = managerId, ReviewCycleId = cycle?.Id ?? Guid.NewGuid(), Relationship = "Manager", Rating = 4, FeedbackComments = dto.Comments, IsAnonymous = false, TenantId = GetTenantId() });
        await _context.SaveChangesAsync(); return true;
    }

    // ======================== TRAINING / ASSETS / COMP ========================
    public async Task<List<MssTrainingDto>> GetTeamTrainingAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var assignments = await _context.CourseAssignments.Where(ca => teamIds.Contains(ca.EmployeeId)).OrderByDescending(ca => ca.CreatedAt).ToListAsync();
        var result = new List<MssTrainingDto>();
        foreach (var ca in assignments)
        {
            var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == ca.EmployeeId);
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == ca.CourseId);
            result.Add(new MssTrainingDto { AssignmentId = ca.Id, EmployeeId = ca.EmployeeId, EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}" : string.Empty, CourseName = course?.Title ?? "Course", CourseType = course?.Category ?? string.Empty, Status = ca.Status, CompletionPercentage = ca.ProgressPercentage, IsOverdue = false });
        }
        return result;
    }

    public async Task<List<MssTeamAssetDto>> GetTeamAssetsAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var assignments = await _context.AssetAssignments.Include(a => a.Employee).Include(a => a.Asset).ThenInclude(a => a.Category).Where(a => teamIds.Contains(a.EmployeeId) && a.Status == "Active").ToListAsync();
        return assignments.Select(a => new MssTeamAssetDto { AssetId = a.Asset.Id, EmployeeId = a.EmployeeId, EmployeeName = a.Employee != null ? a.Employee.FirstName + " " + a.Employee.LastName : string.Empty, AssetTag = a.Asset.AssetTag, AssetName = a.Asset.AssetName, Category = a.Asset.Category != null ? a.Asset.Category.Name : string.Empty, Status = a.Asset.Status, Condition = a.ConditionAtHandover, AssignedDate = a.AssignedDate, ExpectedReturnDate = a.ExpectedReturnDate }).ToList();
    }

    public async Task<List<MssCompensationDto>> GetTeamCompensationAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var comps = await _context.EmployeeCompensations.Include(c => c.Employee).ThenInclude(e => e.Designation).Include(c => c.Employee).ThenInclude(e => e.Department).Include(c => c.PayGrade).Where(c => teamIds.Contains(c.EmployeeId) && c.IsCurrent).ToListAsync();
        return comps.Select(c => new MssCompensationDto { EmployeeId = c.EmployeeId, EmployeeName = c.Employee != null ? $"{c.Employee.FirstName} {c.Employee.LastName}" : string.Empty, Designation = c.Employee?.Designation?.Name ?? string.Empty, Department = c.Employee?.Department?.Name ?? string.Empty, PayGrade = c.PayGrade?.Name, CurrentCtc = c.AnnualTotalCompensation, Currency = c.Currency, Status = c.Status, LastRevisionDate = c.EffectiveDate }).ToList();
    }

    public async Task<MssCompRecommendationDto> SubmitCompRecommendationAsync(Guid managerId, CreateCompRecommendationDto dto)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        if (!teamIds.Contains(dto.EmployeeId)) throw new UnauthorizedAccessException("Employee is not in your team.");
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        var revision = new HRMS.Domain.Entities.Compensation.SalaryRevision { Id = Guid.NewGuid(), EmployeeId = dto.EmployeeId, EffectiveDate = DateTime.Today.AddMonths(1), ProposedSalary = dto.ProposedCtc, PercentageIncrease = dto.IncreasePercentage, Reason = dto.Reason, Comments = dto.Comments, Status = "Submitted", TenantId = GetTenantId() };
        _context.SalaryRevisions.Add(revision); await _context.SaveChangesAsync();
        return new MssCompRecommendationDto { RecommendationId = revision.Id, EmployeeId = dto.EmployeeId, EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}" : string.Empty, ProposedCtc = dto.ProposedCtc, IncreasePercentage = dto.IncreasePercentage, Reason = dto.Reason, Status = "Submitted", SubmittedAt = DateTime.UtcNow };
    }

    // ======================== APPROVALS / HR REQUESTS ========================
    public async Task<List<MssApprovalItemDto>> GetManagerApprovalsAsync(Guid managerId, string? category)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var result = new List<MssApprovalItemDto>();
        if (string.IsNullOrEmpty(category) || category == "Leave")
        {
            var pl = await _context.LeaveRequests.Include(l => l.Employee).Include(l => l.LeaveType).Where(l => teamIds.Contains(l.EmployeeId) && l.Status == "Pending").OrderByDescending(l => l.CreatedAt).ToListAsync();
            result.AddRange(pl.Select(l => new MssApprovalItemDto { ApprovalId = l.Id, Category = "Leave", EmployeeId = l.EmployeeId, EmployeeName = l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}" : string.Empty, Description = $"{l.LeaveType?.Name ?? "Leave"}: {l.FromDate:dd MMM} - {l.ToDate:dd MMM} ({l.TotalDays}d)", Status = l.Status, Priority = "Medium", SubmittedAt = l.CreatedAt }));
        }
        if (string.IsNullOrEmpty(category) || category == "Attendance")
        {
            var pa = await _context.AttendanceApprovals.Include(a => a.Employee).Where(a => teamIds.Contains(a.EmployeeId) && a.Status == "Pending").OrderByDescending(a => a.CreatedAt).ToListAsync();
            result.AddRange(pa.Select(a => new MssApprovalItemDto { ApprovalId = a.Id, Category = "Attendance", EmployeeId = a.EmployeeId, EmployeeName = a.Employee != null ? $"{a.Employee.FirstName} {a.Employee.LastName}" : string.Empty, Description = $"Correction for {a.Date:dd MMM}: {a.Type}", Status = a.Status, Priority = "Low", SubmittedAt = a.CreatedAt }));
        }
        return result.OrderByDescending(r => r.SubmittedAt).ToList();
    }

    public async Task<List<MssHRRequestDto>> GetManagerRequestsAsync(Guid managerId, string? status)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var query = _context.EmployeeHRRequests.Include(r => r.Employee).Where(r => r.EmployeeId == managerId || teamIds.Contains(r.EmployeeId));
        if (!string.IsNullOrEmpty(status)) query = query.Where(r => r.Status == status);
        return await query.OrderByDescending(r => r.CreatedAt).Select(r => new MssHRRequestDto { RequestId = r.Id, RequestNumber = "MSS-" + r.Id.ToString().Substring(0, 8).ToUpper(), Category = r.Category, Subject = r.Subject, Description = r.Description, Priority = r.Priority, Status = r.Status, SubmittedAt = r.CreatedAt, ResolvedAt = r.ResolvedAt, TargetEmployeeId = r.EmployeeId, TargetEmployeeName = r.Employee != null ? r.Employee.FirstName + " " + r.Employee.LastName : null }).ToListAsync();
    }

    public async Task<MssHRRequestDto> CreateManagerRequestAsync(Guid managerId, CreateMssHRRequestDto dto)
    {
        var req = new HRMS.Domain.Entities.Employee.EmployeeHRRequest { Id = Guid.NewGuid(), EmployeeId = dto.TargetEmployeeId ?? managerId, Category = dto.Category, Subject = dto.Subject, Description = dto.Description, Priority = dto.Priority, Status = "Open", TenantId = GetTenantId() };
        _context.EmployeeHRRequests.Add(req); await _context.SaveChangesAsync();
        return new MssHRRequestDto { RequestId = req.Id, RequestNumber = "MSS-" + req.Id.ToString().Substring(0, 8).ToUpper(), Category = req.Category, Subject = req.Subject, Description = req.Description, Priority = req.Priority, Status = req.Status, SubmittedAt = req.CreatedAt };
    }

    // ======================== CALENDAR / ANALYTICS / NOTIFICATIONS ========================
    public async Task<List<MssCalendarEventDto>> GetTeamCalendarAsync(Guid managerId, int month, int year)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var start = new DateTime(year, month, 1); var end = start.AddMonths(1).AddDays(-1);
        var events = new List<MssCalendarEventDto>();
        var leaves = await _context.LeaveRequests.Include(l => l.Employee).Include(l => l.LeaveType).Where(l => teamIds.Contains(l.EmployeeId) && l.Status == "Approved" && l.FromDate <= end && l.ToDate >= start).ToListAsync();
        foreach (var l in leaves) events.Add(new MssCalendarEventDto { Type = "Leave", Title = $"{l.Employee?.FirstName} - {l.LeaveType?.Name ?? "Leave"}", Date = l.FromDate, EndDate = l.ToDate, EmployeeId = l.EmployeeId, EmployeeName = l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}" : string.Empty, Color = "#f59e0b", NavigateTo = "/manager/leave" });
        var holidays = await _context.Holidays.Where(h => h.Date >= start && h.Date <= end).ToListAsync();
        foreach (var h in holidays) events.Add(new MssCalendarEventDto { Type = "Holiday", Title = h.Name, Date = h.Date, Color = "#10b981" });
        var members = await _context.Employees.Where(e => teamIds.Contains(e.Id)).ToListAsync();
        foreach (var emp in members) { try { var bd = new DateTime(year, emp.DateOfBirth.Month, emp.DateOfBirth.Day); if (bd >= start && bd <= end) events.Add(new MssCalendarEventDto { Type = "Birthday", Title = $"{emp.FirstName}'s Birthday", Date = bd, EmployeeId = emp.Id, EmployeeName = $"{emp.FirstName} {emp.LastName}", Color = "#ec4899" }); } catch { } }
        return events.OrderBy(e => e.Date).ToList();
    }

    public async Task<MssAnalyticsDto> GetTeamAnalyticsAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var today = DateTime.Today; var last30 = today.AddDays(-30);
        var recentAtt = await _context.AttendanceLogs.Where(a => teamIds.Contains(a.EmployeeId) && a.Date >= last30).ToListAsync();
        var total = recentAtt.Count; var present = recentAtt.Count(a => a.ClockInTime.HasValue); var late = recentAtt.Count(a => a.IsLate);
        decimal attRate = total > 0 ? (decimal)present / total * 100 : 0;
        decimal absRate = total > 0 ? (decimal)(total - present) / total * 100 : 0;
        decimal lateRate = total > 0 ? (decimal)late / total * 100 : 0;
        var leaveUsed = await _context.LeaveBalances.Where(lb => teamIds.Contains(lb.EmployeeId) && lb.Year == today.Year).SumAsync(lb => lb.Used);
        var leaveTotal = await _context.LeaveBalances.Where(lb => teamIds.Contains(lb.EmployeeId) && lb.Year == today.Year).SumAsync(lb => lb.OpeningBalance + lb.Accrued);
        decimal leaveUtil = leaveTotal > 0 ? leaveUsed / leaveTotal * 100 : 0;
        var goals = await _context.Goals.Where(g => teamIds.Contains(g.EmployeeId)).ToListAsync();
        decimal goalComp = goals.Count > 0 ? (decimal)goals.Count(g => g.Status == "Completed") / goals.Count * 100 : 0;
        var training = await _context.CourseAssignments.Where(ca => teamIds.Contains(ca.EmployeeId)).ToListAsync();
        decimal trainComp = training.Count > 0 ? (decimal)training.Count(t => t.Status == "Completed") / training.Count * 100 : 0;
        var reviews = await _context.PerformanceReviews.Where(r => teamIds.Contains(r.EmployeeId)).ToListAsync();
        decimal reviewComp = reviews.Count > 0 ? (decimal)reviews.Count(r => r.Status == "Finalized" || r.Status == "Approved") / reviews.Count * 100 : 0;
        var trend = new List<AttendanceTrendPoint>();
        for (int i = 6; i >= 0; i--) { var d = today.AddDays(-i); var dl = recentAtt.Where(a => a.Date == d).ToList(); trend.Add(new AttendanceTrendPoint { Date = d.ToString("dd MMM"), Present = dl.Count(x => x.ClockInTime.HasValue), Late = dl.Count(x => x.IsLate), Absent = Math.Max(0, teamIds.Count - dl.Count(x => x.ClockInTime.HasValue)), OnLeave = dl.Count(x => x.Status == "Leave") }); }
        var deptBreak = await _context.Employees.Include(e => e.Department).Where(e => teamIds.Contains(e.Id)).GroupBy(e => e.Department != null ? e.Department.Name : "Unknown").Select(g => new HeadcountBreakdownDto { Label = g.Key, Count = g.Count() }).ToListAsync();
        return new MssAnalyticsDto { AttendanceRate = Math.Round(attRate, 1), AbsenceRate = Math.Round(absRate, 1), LateRate = Math.Round(lateRate, 1), LeaveUtilization = Math.Round(leaveUtil, 1), GoalCompletionRate = Math.Round(goalComp, 1), TrainingCompletionRate = Math.Round(trainComp, 1), ReviewCompletionRate = Math.Round(reviewComp, 1), AttendanceTrend = trend, ByDepartment = deptBreak };
    }

    public async Task<List<MssNotificationDto>> GetManagerNotificationsAsync(Guid managerId)
    {
        var teamIds = await GetAuthorizedTeamIdsAsync(managerId);
        var result = new List<MssNotificationDto>();
        var pl = await _context.LeaveRequests.Include(l => l.Employee).Include(l => l.LeaveType).Where(l => teamIds.Contains(l.EmployeeId) && l.Status == "Pending").OrderByDescending(l => l.CreatedAt).Take(10).ToListAsync();
        foreach (var l in pl) { var n = l.Employee != null ? $"{l.Employee.FirstName} {l.Employee.LastName}" : "Employee"; result.Add(new MssNotificationDto { NotificationId = l.Id, Type = "LeaveApproval", Category = "Leave", Title = "Leave Approval Required", Message = $"{n} applied for {l.LeaveType?.Name ?? "leave"} ({l.TotalDays}d): {l.FromDate:dd MMM} - {l.ToDate:dd MMM}", IsRead = false, CreatedAt = l.CreatedAt, ActionUrl = "/manager/approvals" }); }
        var pa = await _context.AttendanceApprovals.Include(a => a.Employee).Where(a => teamIds.Contains(a.EmployeeId) && a.Status == "Pending").Take(5).ToListAsync();
        foreach (var a in pa) { var n = a.Employee != null ? $"{a.Employee.FirstName} {a.Employee.LastName}" : "Employee"; result.Add(new MssNotificationDto { NotificationId = a.Id, Type = "AttendanceApproval", Category = "Attendance", Title = "Attendance Correction Pending", Message = $"{n} requested attendance correction for {a.Date:dd MMM}", IsRead = false, CreatedAt = a.CreatedAt, ActionUrl = "/manager/attendance-requests" }); }
        return result.OrderByDescending(n => n.CreatedAt).ToList();
    }
}

