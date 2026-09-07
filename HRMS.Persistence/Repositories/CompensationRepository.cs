using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Compensation.DTOs;
using HRMS.Domain.Entities.Compensation;
using HRMS.Domain.Entities.Workflow;
using HRMS.Domain.Entities.Notification;
using HRMS.Domain.Entities.Audit;
using HRMS.Domain.Common;

namespace HRMS.Persistence.Repositories;

public class CompensationRepository : ICompensationRepository
{
    private readonly HrmsDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CompensationRepository(HrmsDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    private Guid GetEffectiveTenantId()
    {
        if (_tenantContext.CurrentTenantId.HasValue && _tenantContext.CurrentTenantId.Value != Guid.Empty)
            return _tenantContext.CurrentTenantId.Value;

        var firstTenant = _context.Tenants.FirstOrDefault(t => !t.IsDeleted);
        return firstTenant?.Id ?? Guid.Parse("11111111-1111-1111-1111-111111111111");
    }

    // ==========================================
    // 1. DASHBOARD & ANALYTICS
    // ==========================================
    public async Task<CompensationDashboardMetricsDto> GetDashboardMetricsAsync()
    {
        var tenantId = GetEffectiveTenantId();

        var compensations = await _context.EmployeeCompensations
            .AsNoTracking()
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Department)
            .Include(c => c.PayGrade)
            .Include(c => c.Assignments)
                .ThenInclude(a => a.Component)
            .Where(c => c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted)
            .ToListAsync();

        var enrollments = await _context.BenefitEnrollments
            .AsNoTracking()
            .Include(b => b.BenefitPlan)
            .Where(b => b.TenantId == tenantId && b.Status == "Active" && !b.IsDeleted)
            .ToListAsync();

        var bonuses = await _context.EmployeeBonuses
            .AsNoTracking()
            .Where(b => b.TenantId == tenantId && !b.IsDeleted)
            .ToListAsync();

        var payGrades = await _context.PayGrades
            .AsNoTracking()
            .Where(p => p.TenantId == tenantId && !p.IsDeleted)
            .ToListAsync();

        var activeBenefitPlansCount = await _context.BenefitPlans
            .CountAsync(b => b.TenantId == tenantId && b.Status == "Active" && !b.IsDeleted);

        var pendingApprovals = await _context.SalaryRevisions
            .CountAsync(r => r.TenantId == tenantId && (r.Status == "Submitted" || r.Status == "ManagerApproved") && !r.IsDeleted);

        var pendingEnrollments = await _context.BenefitEnrollments
            .CountAsync(e => e.TenantId == tenantId && e.Status == "PendingApproval" && !e.IsDeleted);

        var totalEmployees = compensations.Count;
        var totalBaseSalary = compensations.Sum(c => c.BaseSalary);
        var totalAllowances = compensations.SelectMany(c => c.Assignments)
            .Where(a => a.Component != null && a.Component.Type == "Earnings" && a.Component.Code != "BASIC")
            .Sum(a => a.CalculatedAnnualAmount);

        var totalBonusAmount = bonuses.Where(b => b.Status == "Approved" || b.Status == "PaidInPayroll").Sum(b => b.Amount);
        var employerBenefitCost = enrollments.Sum(e => e.EmployerMonthlyContribution * 12);
        var employeeBenefitCost = enrollments.Sum(e => e.EmployeeMonthlyContribution * 12);
        var totalCompensationCost = totalBaseSalary + totalAllowances + totalBonusAmount + employerBenefitCost;

        // Department Breakdown
        var deptGroups = compensations
            .Where(c => c.Employee?.Department != null)
            .GroupBy(c => c.Employee!.Department!.Name)
            .Select(g => new DepartmentCostDto
            {
                DepartmentName = g.Key,
                TotalCost = g.Sum(c => c.AnnualTotalCompensation),
                AverageSalary = Math.Round(g.Average(c => c.BaseSalary), 2),
                EmployeeCount = g.Count()
            })
            .OrderByDescending(d => d.TotalCost)
            .ToList();

        // Salary Distribution Buckets
        var buckets = new List<SalaryDistributionBucketDto>
        {
            new() { RangeLabel = "< $50k", Count = compensations.Count(c => c.BaseSalary < 50000) },
            new() { RangeLabel = "$50k - $75k", Count = compensations.Count(c => c.BaseSalary >= 50000 && c.BaseSalary < 75000) },
            new() { RangeLabel = "$75k - $100k", Count = compensations.Count(c => c.BaseSalary >= 75000 && c.BaseSalary < 100000) },
            new() { RangeLabel = "$100k - $130k", Count = compensations.Count(c => c.BaseSalary >= 100000 && c.BaseSalary < 130000) },
            new() { RangeLabel = "$130k - $160k", Count = compensations.Count(c => c.BaseSalary >= 130000 && c.BaseSalary < 160000) },
            new() { RangeLabel = "> $160k", Count = compensations.Count(c => c.BaseSalary >= 160000) }
        };

        // Pay Grade Breakdown
        var gradeBreakdown = payGrades.Select(g =>
        {
            var empInGrade = compensations.Where(c => c.PayGradeId == g.Id).ToList();
            return new PayGradeCompensationDto
            {
                GradeCode = g.Code,
                GradeName = g.Name,
                MinimumSalary = g.MinimumSalary,
                MidpointSalary = g.MidpointSalary,
                MaximumSalary = g.MaximumSalary,
                AverageActualSalary = empInGrade.Any() ? Math.Round(empInGrade.Average(c => c.BaseSalary), 2) : 0,
                EmployeeCount = empInGrade.Count
            };
        }).OrderBy(g => g.MinimumSalary).ToList();

        // Trend
        var trends = new List<MonthlyCostTrendDto>
        {
            new() { Month = "May", EmployerCost = employerBenefitCost / 12, EmployeeCost = employeeBenefitCost / 12 },
            new() { Month = "Jun", EmployerCost = (employerBenefitCost / 12) * 1.02m, EmployeeCost = (employeeBenefitCost / 12) * 1.01m },
            new() { Month = "Jul", EmployerCost = (employerBenefitCost / 12) * 1.04m, EmployeeCost = (employeeBenefitCost / 12) * 1.02m },
            new() { Month = "Aug", EmployerCost = (employerBenefitCost / 12) * 1.05m, EmployeeCost = (employeeBenefitCost / 12) * 1.03m },
            new() { Month = "Sep", EmployerCost = (employerBenefitCost / 12) * 1.06m, EmployeeCost = (employeeBenefitCost / 12) * 1.04m }
        };

        return new CompensationDashboardMetricsDto
        {
            TotalEmployees = totalEmployees,
            TotalCompensationCost = Math.Round(totalCompensationCost, 2),
            AverageBaseSalary = totalEmployees > 0 ? Math.Round(totalBaseSalary / totalEmployees, 2) : 0,
            TotalAllowances = Math.Round(totalAllowances, 2),
            TotalBonuses = Math.Round(totalBonusAmount, 2),
            EmployerBenefitCost = Math.Round(employerBenefitCost, 2),
            EmployeeBenefitCost = Math.Round(employeeBenefitCost, 2),
            ActiveBenefitPlans = activeBenefitPlansCount,
            EmployeesEnrolledInBenefits = enrollments.Select(e => e.EmployeeId).Distinct().Count(),
            PendingCompensationApprovals = pendingApprovals,
            PendingBenefitEnrollments = pendingEnrollments,
            UpcomingCompensationReviews = await _context.CompensationReviewCycles.CountAsync(c => c.TenantId == tenantId && c.Status == "Open" && !c.IsDeleted),
            DepartmentCostBreakdown = deptGroups,
            SalaryDistribution = buckets,
            PayGradeBreakdown = gradeBreakdown,
            ContributionTrends = trends
        };
    }

    // ==========================================
    // 2. SALARY COMPONENTS
    // ==========================================
    public async Task<List<CompensationComponentDto>> GetComponentsAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.CompensationComponents
            .AsNoTracking()
            .Include(c => c.BasedOnComponent)
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .OrderBy(c => c.Type)
            .ThenBy(c => c.Code)
            .Select(c => new CompensationComponentDto
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                Description = c.Description,
                Type = c.Type,
                CalculationType = c.CalculationType,
                DefaultValue = c.DefaultValue,
                Percentage = c.Percentage,
                BasedOnComponentId = c.BasedOnComponentId,
                BasedOnComponentName = c.BasedOnComponent != null ? c.BasedOnComponent.Name : "",
                IsTaxable = c.IsTaxable,
                IsPensionable = c.IsPensionable,
                IsRecurring = c.IsRecurring,
                IsActive = c.IsActive
            })
            .ToListAsync();
    }

    public async Task<CompensationComponentDto> CreateComponentAsync(CreateCompensationComponentDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var comp = new CompensationComponent
        {
            TenantId = tenantId,
            Code = dto.Code.ToUpper().Trim(),
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Type = dto.Type,
            CalculationType = dto.CalculationType,
            DefaultValue = dto.DefaultValue,
            Percentage = dto.Percentage,
            BasedOnComponentId = dto.BasedOnComponentId,
            IsTaxable = dto.IsTaxable,
            IsPensionable = dto.IsPensionable,
            IsRecurring = dto.IsRecurring,
            IsActive = true,
            EffectiveFrom = DateTime.UtcNow
        };

        _context.CompensationComponents.Add(comp);
        await _context.SaveChangesAsync();

        return (await GetComponentsAsync()).First(c => c.Id == comp.Id);
    }

    public async Task<CompensationComponentDto> UpdateComponentAsync(Guid id, CreateCompensationComponentDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var comp = await _context.CompensationComponents.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == tenantId && !c.IsDeleted)
            ?? throw new KeyNotFoundException("Compensation component not found.");

        comp.Name = dto.Name.Trim();
        comp.Description = dto.Description.Trim();
        comp.Type = dto.Type;
        comp.CalculationType = dto.CalculationType;
        comp.DefaultValue = dto.DefaultValue;
        comp.Percentage = dto.Percentage;
        comp.BasedOnComponentId = dto.BasedOnComponentId;
        comp.IsTaxable = dto.IsTaxable;
        comp.IsPensionable = dto.IsPensionable;
        comp.IsRecurring = dto.IsRecurring;
        comp.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return (await GetComponentsAsync()).First(c => c.Id == comp.Id);
    }

    public async Task<bool> DeleteComponentAsync(Guid id)
    {
        var tenantId = GetEffectiveTenantId();
        var comp = await _context.CompensationComponents.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == tenantId && !c.IsDeleted);
        if (comp == null) return false;

        comp.IsDeleted = true;
        comp.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 3. PAY GRADES & SALARY BANDS
    // ==========================================
    public async Task<List<PayGradeDto>> GetPayGradesAsync()
    {
        var tenantId = GetEffectiveTenantId();
        var grades = await _context.PayGrades
            .AsNoTracking()
            .Include(g => g.SalaryBands)
            .Where(g => g.TenantId == tenantId && !g.IsDeleted)
            .OrderBy(g => g.Level)
            .ToListAsync();

        var empCounts = await _context.EmployeeCompensations
            .Where(c => c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted && c.PayGradeId != null)
            .GroupBy(c => c.PayGradeId!.Value)
            .Select(g => new { GradeId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(k => k.GradeId, v => v.Count);

        return grades.Select(g => new PayGradeDto
        {
            Id = g.Id,
            Code = g.Code,
            Name = g.Name,
            Description = g.Description,
            Level = g.Level,
            MinimumSalary = g.MinimumSalary,
            MidpointSalary = g.MidpointSalary,
            MaximumSalary = g.MaximumSalary,
            Currency = g.Currency,
            Status = g.Status,
            BandsCount = g.SalaryBands.Count(b => !b.IsDeleted),
            EmployeeCount = empCounts.GetValueOrDefault(g.Id, 0)
        }).ToList();
    }

    public async Task<PayGradeDto> CreatePayGradeAsync(CreatePayGradeDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var grade = new PayGrade
        {
            TenantId = tenantId,
            Code = dto.Code.ToUpper().Trim(),
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Level = dto.Level,
            MinimumSalary = dto.MinimumSalary,
            MidpointSalary = dto.MidpointSalary > 0 ? dto.MidpointSalary : (dto.MinimumSalary + dto.MaximumSalary) / 2,
            MaximumSalary = dto.MaximumSalary,
            Currency = dto.Currency,
            Status = "Active"
        };

        _context.PayGrades.Add(grade);
        await _context.SaveChangesAsync();

        return (await GetPayGradesAsync()).First(g => g.Id == grade.Id);
    }

    public async Task<List<SalaryBandDto>> GetSalaryBandsAsync(Guid? payGradeId)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.SalaryBands
            .AsNoTracking()
            .Include(b => b.PayGrade)
            .Include(b => b.Location)
            .Where(b => b.TenantId == tenantId && !b.IsDeleted);

        if (payGradeId.HasValue)
            query = query.Where(b => b.PayGradeId == payGradeId.Value);

        return await query
            .OrderBy(b => b.PayGrade != null ? b.PayGrade.Level : 0)
            .Select(b => new SalaryBandDto
            {
                Id = b.Id,
                PayGradeId = b.PayGradeId,
                GradeCode = b.PayGrade != null ? b.PayGrade.Code : "",
                BandName = b.BandName,
                LocationId = b.LocationId,
                LocationName = b.Location != null ? b.Location.Name : "All Locations",
                Country = b.Country,
                Minimum = b.Minimum,
                Midpoint = b.Midpoint,
                Maximum = b.Maximum,
                Currency = b.Currency,
                IsActive = b.IsActive
            })
            .ToListAsync();
    }

    public async Task<SalaryBandDto> CreateSalaryBandAsync(CreateSalaryBandDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var band = new SalaryBand
        {
            TenantId = tenantId,
            PayGradeId = dto.PayGradeId,
            BandName = dto.BandName.Trim(),
            LocationId = dto.LocationId,
            Country = dto.Country,
            Minimum = dto.Minimum,
            Midpoint = dto.Midpoint > 0 ? dto.Midpoint : (dto.Minimum + dto.Maximum) / 2,
            Maximum = dto.Maximum,
            Currency = dto.Currency,
            IsActive = true
        };

        _context.SalaryBands.Add(band);
        await _context.SaveChangesAsync();

        return (await GetSalaryBandsAsync(null)).First(b => b.Id == band.Id);
    }

    // ==========================================
    // 4. EMPLOYEE COMPENSATION
    // ==========================================
    public async Task<PagedResult<EmployeeCompensationDto>> GetEmployeeCompensationsAsync(CompensationFilterParams filters)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.EmployeeCompensations
            .AsNoTracking()
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Department)
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Designation)
            .Include(c => c.PayGrade)
            .Include(c => c.SalaryBand)
            .Where(c => c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var s = filters.Search.Trim().ToLower();
            query = query.Where(c =>
                c.EmployeeId.ToString().ToLower().Contains(s) ||
                (c.Employee != null && (
                    c.Employee.FirstName.ToLower().Contains(s) ||
                    c.Employee.LastName.ToLower().Contains(s) ||
                    c.Employee.EmployeeNumber.ToLower().Contains(s) ||
                    (c.PayGrade != null && c.PayGrade.Code.ToLower().Contains(s))
                ))
            );
        }

        if (filters.DepartmentId.HasValue)
            query = query.Where(c => c.Employee != null && c.Employee.DepartmentId == filters.DepartmentId.Value);

        if (filters.PayGradeId.HasValue)
            query = query.Where(c => c.PayGradeId == filters.PayGradeId.Value);

        if (!string.IsNullOrWhiteSpace(filters.Status))
            query = query.Where(c => c.Status == filters.Status);

        var total = await query.CountAsync();
        var page = filters.Page > 0 ? filters.Page : 1;
        var pageSize = filters.PageSize > 0 ? filters.PageSize : 20;

        var items = await query
            .OrderByDescending(c => c.BaseSalary)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new EmployeeCompensationDto
            {
                Id = c.Id,
                EmployeeId = c.EmployeeId,
                EmployeeNumber = c.Employee != null ? c.Employee.EmployeeNumber : "",
                EmployeeName = c.Employee != null ? $"{c.Employee.FirstName} {c.Employee.LastName}" : "",
                DepartmentName = c.Employee != null && c.Employee.Department != null ? c.Employee.Department.Name : "",
                DesignationTitle = c.Employee != null && c.Employee.Designation != null ? c.Employee.Designation.Name : "",
                PayGradeId = c.PayGradeId,
                GradeCode = c.PayGrade != null ? c.PayGrade.Code : "",
                GradeName = c.PayGrade != null ? c.PayGrade.Name : "",
                SalaryBandId = c.SalaryBandId,
                BandName = c.SalaryBand != null ? c.SalaryBand.BandName : "",
                BandMin = c.SalaryBand != null ? c.SalaryBand.Minimum : (c.PayGrade != null ? c.PayGrade.MinimumSalary : 0),
                BandMidpoint = c.SalaryBand != null ? c.SalaryBand.Midpoint : (c.PayGrade != null ? c.PayGrade.MidpointSalary : 1),
                BandMax = c.SalaryBand != null ? c.SalaryBand.Maximum : (c.PayGrade != null ? c.PayGrade.MaximumSalary : 0),
                BaseSalary = c.BaseSalary,
                Currency = c.Currency,
                AnnualTotalCompensation = c.AnnualTotalCompensation,
                MonthlyTotalCompensation = c.MonthlyTotalCompensation,
                CompaRatio = c.CompaRatio,
                EffectiveDate = c.EffectiveDate,
                EndDate = c.EndDate,
                IsCurrent = c.IsCurrent,
                Status = c.Status
            })
            .ToListAsync();

        return new PagedResult<EmployeeCompensationDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<EmployeeCompensationDetailDto?> GetEmployeeCompensationDetailAsync(Guid employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        var comp = await _context.EmployeeCompensations
            .AsNoTracking()
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Department)
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Designation)
            .Include(c => c.PayGrade)
            .Include(c => c.SalaryBand)
            .Include(c => c.Assignments)
                .ThenInclude(a => a.Component)
            .FirstOrDefaultAsync(c => c.EmployeeId == employeeId && c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted);

        if (comp == null) return null;

        var history = await _context.CompensationHistories
            .AsNoTracking()
            .Include(h => h.PreviousGrade)
            .Include(h => h.NewGrade)
            .Where(h => h.EmployeeId == employeeId && h.TenantId == tenantId && !h.IsDeleted)
            .OrderByDescending(h => h.EffectiveDate)
            .Select(h => new CompensationHistoryDto
            {
                Id = h.Id,
                EmployeeId = h.EmployeeId,
                PreviousSalary = h.PreviousSalary,
                NewSalary = h.NewSalary,
                IncreaseAmount = h.IncreaseAmount,
                PercentageIncrease = h.PercentageIncrease,
                PreviousGradeName = h.PreviousGrade != null ? h.PreviousGrade.Name : "",
                NewGradeName = h.NewGrade != null ? h.NewGrade.Name : "",
                EffectiveDate = h.EffectiveDate,
                ChangeType = h.ChangeType,
                Reason = h.Reason,
                ApprovedBy = h.ApprovedBy,
                ApprovalDate = h.ApprovalDate,
                Comments = h.Comments
            })
            .ToListAsync();

        var bonuses = await _context.EmployeeBonuses
            .AsNoTracking()
            .Where(b => b.EmployeeId == employeeId && b.TenantId == tenantId && !b.IsDeleted)
            .OrderByDescending(b => b.PaymentDate)
            .Select(b => new EmployeeBonusDto
            {
                Id = b.Id,
                EmployeeId = b.EmployeeId,
                BonusType = b.BonusType,
                Amount = b.Amount,
                TargetAmount = b.TargetAmount,
                AchievementPercentage = b.AchievementPercentage,
                Currency = b.Currency,
                PaymentDate = b.PaymentDate,
                Reason = b.Reason,
                Status = b.Status,
                IsPayrollProcessed = b.IsPayrollProcessed
            })
            .ToListAsync();

        var enrollments = await _context.BenefitEnrollments
            .AsNoTracking()
            .Include(e => e.BenefitPlan)
            .Where(e => e.EmployeeId == employeeId && e.TenantId == tenantId && e.Status == "Active" && !e.IsDeleted)
            .Select(e => new BenefitEnrollmentDto
            {
                Id = e.Id,
                EnrollmentNumber = e.EnrollmentNumber,
                EmployeeId = e.EmployeeId,
                BenefitPlanId = e.BenefitPlanId,
                PlanName = e.BenefitPlan != null ? e.BenefitPlan.PlanName : "",
                PlanType = e.BenefitPlan != null ? e.BenefitPlan.Type : "",
                Provider = e.BenefitPlan != null ? e.BenefitPlan.Provider : "",
                CoverageTier = e.CoverageTier,
                EmployeeMonthlyContribution = e.EmployeeMonthlyContribution,
                EmployerMonthlyContribution = e.EmployerMonthlyContribution,
                TotalMonthlyPremium = e.TotalMonthlyPremium,
                EnrollmentDate = e.EnrollmentDate,
                EffectiveDate = e.EffectiveDate,
                Status = e.Status
            })
            .ToListAsync();

        var midpoint = comp.SalaryBand?.Midpoint ?? comp.PayGrade?.MidpointSalary ?? 1;

        return new EmployeeCompensationDetailDto
        {
            Id = comp.Id,
            EmployeeId = comp.EmployeeId,
            EmployeeNumber = comp.Employee?.EmployeeNumber ?? "",
            EmployeeName = comp.Employee != null ? $"{comp.Employee.FirstName} {comp.Employee.LastName}" : "",
            DepartmentName = comp.Employee?.Department?.Name ?? "",
            DesignationTitle = comp.Employee?.Designation?.Name ?? "",
            PayGradeId = comp.PayGradeId,
            GradeCode = comp.PayGrade?.Code ?? "",
            GradeName = comp.PayGrade?.Name ?? "",
            SalaryBandId = comp.SalaryBandId,
            BandName = comp.SalaryBand?.BandName ?? "",
            BandMin = comp.SalaryBand?.Minimum ?? comp.PayGrade?.MinimumSalary ?? 0,
            BandMidpoint = midpoint,
            BandMax = comp.SalaryBand?.Maximum ?? comp.PayGrade?.MaximumSalary ?? 0,
            BaseSalary = comp.BaseSalary,
            Currency = comp.Currency,
            AnnualTotalCompensation = comp.AnnualTotalCompensation,
            MonthlyTotalCompensation = comp.MonthlyTotalCompensation,
            CompaRatio = comp.CompaRatio,
            EffectiveDate = comp.EffectiveDate,
            Status = comp.Status,
            Components = comp.Assignments.Where(a => !a.IsDeleted).Select(a => new CompensationComponentAssignmentDto
            {
                Id = a.Id,
                ComponentId = a.ComponentId,
                ComponentCode = a.Component?.Code ?? "",
                ComponentName = a.Component?.Name ?? "",
                Type = a.Component?.Type ?? "",
                Amount = a.Amount,
                Percentage = a.Percentage,
                CalculatedMonthlyAmount = a.CalculatedMonthlyAmount,
                CalculatedAnnualAmount = a.CalculatedAnnualAmount
            }).ToList(),
            History = history,
            Bonuses = bonuses,
            EnrolledBenefits = enrollments
        };
    }

    public async Task<EmployeeCompensationDto> UpsertEmployeeCompensationAsync(UpsertEmployeeCompensationDto dto, string initiatedBy)
    {
        var tenantId = GetEffectiveTenantId();

        // 1. Check existing active record
        var existing = await _context.EmployeeCompensations
            .Include(c => c.Assignments)
            .FirstOrDefaultAsync(c => c.EmployeeId == dto.EmployeeId && c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted);

        // Calculate midpoint for compa-ratio
        decimal midpoint = 1;
        if (dto.SalaryBandId.HasValue)
        {
            var band = await _context.SalaryBands.FirstOrDefaultAsync(b => b.Id == dto.SalaryBandId.Value);
            if (band != null && band.Midpoint > 0) midpoint = band.Midpoint;
        }
        else if (dto.PayGradeId.HasValue)
        {
            var grade = await _context.PayGrades.FirstOrDefaultAsync(g => g.Id == dto.PayGradeId.Value);
            if (grade != null && grade.MidpointSalary > 0) midpoint = grade.MidpointSalary;
        }

        var compaRatio = midpoint > 0 ? Math.Round(dto.BaseSalary / midpoint, 2) : 1.0m;

        // Calculate allowance total
        decimal totalMonthlyAllowances = 0;
        var assignments = new List<CompensationComponentAssignment>();
        foreach (var c in dto.Components)
        {
            var compDef = await _context.CompensationComponents.FirstOrDefaultAsync(x => x.Id == c.ComponentId);
            var monthly = c.Amount > 0 ? c.Amount : (c.Percentage > 0 ? (dto.BaseSalary / 12) * (c.Percentage / 100) : 0);
            totalMonthlyAllowances += monthly;

            assignments.Add(new CompensationComponentAssignment
            {
                TenantId = tenantId,
                ComponentId = c.ComponentId,
                Amount = c.Amount,
                Percentage = c.Percentage,
                CalculatedMonthlyAmount = Math.Round(monthly, 2),
                CalculatedAnnualAmount = Math.Round(monthly * 12, 2)
            });
        }

        var monthlyBase = dto.BaseSalary / 12;
        var monthlyTotal = monthlyBase + totalMonthlyAllowances;
        var annualTotal = dto.BaseSalary + (totalMonthlyAllowances * 12);

        if (existing != null)
        {
            // Close existing effective-dated record
            existing.IsCurrent = false;
            existing.EndDate = dto.EffectiveDate;
            existing.UpdatedAt = DateTime.UtcNow;

            // Audit history
            _context.CompensationHistories.Add(new CompensationHistory
            {
                TenantId = tenantId,
                EmployeeId = dto.EmployeeId,
                PreviousSalary = existing.BaseSalary,
                NewSalary = dto.BaseSalary,
                IncreaseAmount = dto.BaseSalary - existing.BaseSalary,
                PercentageIncrease = existing.BaseSalary > 0 ? Math.Round(((dto.BaseSalary - existing.BaseSalary) / existing.BaseSalary) * 100, 2) : 0,
                PreviousGradeId = existing.PayGradeId,
                NewGradeId = dto.PayGradeId,
                EffectiveDate = dto.EffectiveDate,
                ChangeType = string.IsNullOrWhiteSpace(dto.Reason) ? "MeritAdjustment" : dto.Reason,
                Reason = dto.Reason,
                InitiatedBy = initiatedBy,
                ApprovedBy = initiatedBy,
                ApprovalDate = DateTime.UtcNow
            });
        }

        // Create new active record
        var newComp = new EmployeeCompensation
        {
            TenantId = tenantId,
            EmployeeId = dto.EmployeeId,
            PayGradeId = dto.PayGradeId,
            SalaryBandId = dto.SalaryBandId,
            BaseSalary = dto.BaseSalary,
            Currency = dto.Currency,
            AnnualTotalCompensation = Math.Round(annualTotal, 2),
            MonthlyTotalCompensation = Math.Round(monthlyTotal, 2),
            CompaRatio = compaRatio,
            EffectiveDate = dto.EffectiveDate,
            IsCurrent = true,
            Status = "Active",
            Assignments = assignments
        };

        _context.EmployeeCompensations.Add(newComp);
        await _context.SaveChangesAsync();

        var emp = await _context.Employees.Include(e => e.Department).Include(e => e.Designation).FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        var resGrade = dto.PayGradeId.HasValue ? await _context.PayGrades.FirstOrDefaultAsync(g => g.Id == dto.PayGradeId.Value) : null;
        var resBand = dto.SalaryBandId.HasValue ? await _context.SalaryBands.FirstOrDefaultAsync(b => b.Id == dto.SalaryBandId.Value) : null;

        return new EmployeeCompensationDto
        {
            Id = newComp.Id,
            EmployeeId = newComp.EmployeeId,
            EmployeeNumber = emp?.EmployeeNumber ?? "",
            EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}" : "",
            DepartmentName = emp?.Department?.Name ?? "",
            DesignationTitle = emp?.Designation?.Name ?? "",
            PayGradeId = newComp.PayGradeId,
            GradeCode = resGrade?.Code ?? "",
            GradeName = resGrade?.Name ?? "",
            SalaryBandId = newComp.SalaryBandId,
            BandName = resBand?.BandName ?? "",
            BandMin = resBand?.Minimum ?? resGrade?.MinimumSalary ?? 0,
            BandMidpoint = midpoint,
            BandMax = resBand?.Maximum ?? resGrade?.MaximumSalary ?? 0,
            BaseSalary = newComp.BaseSalary,
            Currency = newComp.Currency,
            AnnualTotalCompensation = newComp.AnnualTotalCompensation,
            MonthlyTotalCompensation = newComp.MonthlyTotalCompensation,
            CompaRatio = newComp.CompaRatio,
            EffectiveDate = newComp.EffectiveDate,
            EndDate = newComp.EndDate,
            IsCurrent = newComp.IsCurrent,
            Status = newComp.Status
        };
    }

    // ==========================================
    // 5. SALARY REVISIONS & WORKFLOW
    // ==========================================
    public async Task<PagedResult<SalaryRevisionDto>> GetSalaryRevisionsAsync(string? status, int page, int pageSize)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.SalaryRevisions
            .AsNoTracking()
            .Include(r => r.Employee)
                .ThenInclude(e => e!.Department)
            .Where(r => r.TenantId == tenantId && !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
            query = query.Where(r => r.Status == status);

        var total = await query.CountAsync();
        page = page > 0 ? page : 1;
        pageSize = pageSize > 0 ? pageSize : 20;

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new SalaryRevisionDto
            {
                Id = r.Id,
                RevisionNumber = r.RevisionNumber,
                EmployeeId = r.EmployeeId,
                EmployeeName = r.Employee != null ? $"{r.Employee.FirstName} {r.Employee.LastName}" : "",
                DepartmentName = r.Employee != null && r.Employee.Department != null ? r.Employee.Department.Name : "",
                CurrentSalary = r.CurrentSalary,
                ProposedSalary = r.ProposedSalary,
                IncreaseAmount = r.IncreaseAmount,
                PercentageIncrease = r.PercentageIncrease,
                EffectiveDate = r.EffectiveDate,
                Reason = r.Reason,
                Comments = r.Comments,
                Status = r.Status,
                WorkflowRequestId = r.WorkflowRequestId,
                ApproverComments = r.ApproverComments,
                ApprovedAt = r.ApprovedAt,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<SalaryRevisionDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    public async Task<SalaryRevisionDto> CreateSalaryRevisionAsync(CreateSalaryRevisionDto dto, string initiatedBy)
    {
        var tenantId = GetEffectiveTenantId();

        var currentComp = await _context.EmployeeCompensations
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.EmployeeId == dto.EmployeeId && c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted);

        var currentSalary = currentComp?.BaseSalary ?? 0;
        var increaseAmount = dto.ProposedSalary - currentSalary;
        var percentageIncrease = currentSalary > 0 ? Math.Round((increaseAmount / currentSalary) * 100, 2) : 0;

        var revCount = await _context.SalaryRevisions.CountAsync(r => r.TenantId == tenantId) + 1;
        var revNumber = $"REV-{DateTime.UtcNow.Year}-{revCount:D5}";

        // Workflow Request Integration
        var workflowReq = new ApprovalRequest
        {
            TenantId = tenantId,
            RequestNumber = $"REQ-REV-{DateTime.UtcNow.Year}-{revCount:D5}",
            Module = "Compensation",
            EntityType = "SalaryRevision",
            Summary = $"Salary Revision request for {dto.ProposedSalary:C} ({percentageIncrease:+#;-#;0}%)",
            Amount = dto.ProposedSalary,
            RequesterName = initiatedBy,
            Status = "Pending",
            Priority = percentageIncrease > 15 ? "High" : "Normal"
        };
        _context.ApprovalRequests.Add(workflowReq);

        var revision = new SalaryRevision
        {
            TenantId = tenantId,
            RevisionNumber = revNumber,
            EmployeeId = dto.EmployeeId,
            CurrentSalary = currentSalary,
            ProposedSalary = dto.ProposedSalary,
            IncreaseAmount = increaseAmount,
            PercentageIncrease = percentageIncrease,
            EffectiveDate = dto.EffectiveDate,
            Reason = dto.Reason,
            Comments = dto.Comments,
            Status = "Submitted",
            WorkflowRequestId = workflowReq.Id
        };

        _context.SalaryRevisions.Add(revision);
        await _context.SaveChangesAsync();

        var empRev = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);

        return new SalaryRevisionDto
        {
            Id = revision.Id,
            RevisionNumber = revision.RevisionNumber,
            EmployeeId = revision.EmployeeId,
            EmployeeName = empRev != null ? $"{empRev.FirstName} {empRev.LastName}" : "",
            DepartmentName = empRev?.Department?.Name ?? "",
            CurrentSalary = revision.CurrentSalary,
            ProposedSalary = revision.ProposedSalary,
            IncreaseAmount = revision.IncreaseAmount,
            PercentageIncrease = revision.PercentageIncrease,
            EffectiveDate = revision.EffectiveDate,
            Reason = revision.Reason,
            Comments = revision.Comments,
            Status = revision.Status,
            WorkflowRequestId = revision.WorkflowRequestId,
            CreatedAt = revision.CreatedAt
        };
    }

    public async Task<SalaryRevisionDto> ProcessSalaryRevisionActionAsync(Guid revisionId, ProcessSalaryRevisionActionDto dto, string approver)
    {
        var tenantId = GetEffectiveTenantId();
        var revision = await _context.SalaryRevisions
            .Include(r => r.WorkflowRequest)
            .FirstOrDefaultAsync(r => r.Id == revisionId && r.TenantId == tenantId && !r.IsDeleted)
            ?? throw new KeyNotFoundException("Salary revision not found.");

        if (dto.Action == "Approve")
        {
            revision.Status = "Approved";
            revision.ApproverComments = dto.ApproverComments;
            revision.ApprovedAt = DateTime.UtcNow;

            if (revision.WorkflowRequest != null)
            {
                revision.WorkflowRequest.Status = "Approved";
                revision.WorkflowRequest.CompletedAt = DateTime.UtcNow;
            }

            // Apply salary change to employee compensation
            await UpsertEmployeeCompensationAsync(new UpsertEmployeeCompensationDto
            {
                EmployeeId = revision.EmployeeId,
                BaseSalary = revision.ProposedSalary,
                EffectiveDate = revision.EffectiveDate,
                Reason = revision.Reason
            }, approver);
        }
        else
        {
            revision.Status = "Rejected";
            revision.ApproverComments = dto.ApproverComments;
            if (revision.WorkflowRequest != null)
            {
                revision.WorkflowRequest.Status = "Rejected";
                revision.WorkflowRequest.CompletedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        var empAction = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == revision.EmployeeId);

        return new SalaryRevisionDto
        {
            Id = revision.Id,
            RevisionNumber = revision.RevisionNumber,
            EmployeeId = revision.EmployeeId,
            EmployeeName = empAction != null ? $"{empAction.FirstName} {empAction.LastName}" : "",
            DepartmentName = empAction?.Department?.Name ?? "",
            CurrentSalary = revision.CurrentSalary,
            ProposedSalary = revision.ProposedSalary,
            IncreaseAmount = revision.IncreaseAmount,
            PercentageIncrease = revision.PercentageIncrease,
            EffectiveDate = revision.EffectiveDate,
            Reason = revision.Reason,
            Comments = revision.Comments,
            Status = revision.Status,
            WorkflowRequestId = revision.WorkflowRequestId,
            ApproverComments = revision.ApproverComments,
            ApprovedAt = revision.ApprovedAt,
            CreatedAt = revision.CreatedAt
        };
    }

    // ==========================================
    // 6. BONUSES & INCENTIVES
    // ==========================================
    public async Task<List<EmployeeBonusDto>> GetBonusesAsync(Guid? employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.EmployeeBonuses
            .AsNoTracking()
            .Include(b => b.Employee)
                .ThenInclude(e => e!.Department)
            .Where(b => b.TenantId == tenantId && !b.IsDeleted);

        if (employeeId.HasValue)
            query = query.Where(b => b.EmployeeId == employeeId.Value);

        return await query
            .OrderByDescending(b => b.PaymentDate)
            .Select(b => new EmployeeBonusDto
            {
                Id = b.Id,
                EmployeeId = b.EmployeeId,
                EmployeeName = b.Employee != null ? $"{b.Employee.FirstName} {b.Employee.LastName}" : "",
                DepartmentName = b.Employee != null && b.Employee.Department != null ? b.Employee.Department.Name : "",
                BonusType = b.BonusType,
                Amount = b.Amount,
                TargetAmount = b.TargetAmount,
                AchievementPercentage = b.AchievementPercentage,
                Currency = b.Currency,
                EffectiveDate = b.EffectiveDate,
                PaymentDate = b.PaymentDate,
                Reason = b.Reason,
                Status = b.Status,
                IsPayrollProcessed = b.IsPayrollProcessed,
                PayrollPeriod = b.PayrollPeriod
            })
            .ToListAsync();
    }

    public async Task<EmployeeBonusDto> CreateBonusAsync(CreateEmployeeBonusDto dto, string approvedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var bonus = new EmployeeBonus
        {
            TenantId = tenantId,
            EmployeeId = dto.EmployeeId,
            BonusType = dto.BonusType,
            Amount = dto.Amount,
            TargetAmount = dto.TargetAmount,
            AchievementPercentage = dto.AchievementPercentage,
            Currency = dto.Currency,
            EffectiveDate = DateTime.UtcNow,
            PaymentDate = dto.PaymentDate,
            Reason = dto.Reason,
            Status = "Approved",
            ApprovedBy = approvedBy,
            ApprovedAt = DateTime.UtcNow
        };

        _context.EmployeeBonuses.Add(bonus);
        await _context.SaveChangesAsync();

        return (await GetBonusesAsync(dto.EmployeeId)).First(b => b.Id == bonus.Id);
    }

    // ==========================================
    // 7. REVIEW CYCLES & BUDGETS
    // ==========================================
    public async Task<List<CompensationReviewCycleDto>> GetReviewCyclesAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.CompensationReviewCycles
            .AsNoTracking()
            .Include(c => c.ReviewItems)
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .OrderByDescending(c => c.FiscalYear)
            .Select(c => new CompensationReviewCycleDto
            {
                Id = c.Id,
                CycleName = c.CycleName,
                FiscalYear = c.FiscalYear,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                EffectiveDate = c.EffectiveDate,
                TotalBudget = c.TotalBudget,
                AllocatedBudget = c.AllocatedBudget,
                UsedBudget = c.UsedBudget,
                Status = c.Status,
                Guidelines = c.Guidelines,
                ItemsCount = c.ReviewItems.Count(i => !i.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<CompensationReviewCycleDto> CreateReviewCycleAsync(string cycleName, int fiscalYear, decimal totalBudget, DateTime startDate, DateTime endDate, DateTime effectiveDate)
    {
        var tenantId = GetEffectiveTenantId();
        var cycle = new CompensationReviewCycle
        {
            TenantId = tenantId,
            CycleName = cycleName.Trim(),
            FiscalYear = fiscalYear,
            TotalBudget = totalBudget,
            AllocatedBudget = totalBudget,
            UsedBudget = 0,
            StartDate = startDate,
            EndDate = endDate,
            EffectiveDate = effectiveDate,
            Status = "Open",
            Guidelines = "Annual merit increase baseline: 3.5% target. High performers eligible for up to 8%."
        };

        _context.CompensationReviewCycles.Add(cycle);
        await _context.SaveChangesAsync();

        // Populate items from current employees
        var activeComps = await _context.EmployeeCompensations
            .Where(c => c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted)
            .ToListAsync();

        foreach (var c in activeComps)
        {
            _context.CompensationReviewItems.Add(new CompensationReviewItem
            {
                TenantId = tenantId,
                ReviewCycleId = cycle.Id,
                EmployeeId = c.EmployeeId,
                CurrentSalary = c.BaseSalary,
                CurrentCompaRatio = c.CompaRatio,
                ProposedSalary = c.BaseSalary,
                ProposedIncreasePercentage = 0,
                ProposedIncreaseAmount = 0,
                NewCompaRatio = c.CompaRatio,
                Status = "InReview"
            });
        }
        await _context.SaveChangesAsync();

        return (await GetReviewCyclesAsync()).First(c => c.Id == cycle.Id);
    }

    public async Task<List<CompensationReviewItemDto>> GetReviewItemsAsync(Guid cycleId)
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.CompensationReviewItems
            .AsNoTracking()
            .Include(i => i.Employee)
                .ThenInclude(e => e!.Department)
            .Include(i => i.Employee)
                .ThenInclude(e => e!.Designation)
            .Where(i => i.ReviewCycleId == cycleId && i.TenantId == tenantId && !i.IsDeleted)
            .OrderBy(i => i.Employee != null ? i.Employee.FirstName : "")
            .Select(i => new CompensationReviewItemDto
            {
                Id = i.Id,
                ReviewCycleId = i.ReviewCycleId,
                EmployeeId = i.EmployeeId,
                EmployeeName = i.Employee != null ? $"{i.Employee.FirstName} {i.Employee.LastName}" : "",
                DepartmentName = i.Employee != null && i.Employee.Department != null ? i.Employee.Department.Name : "",
                DesignationTitle = i.Employee != null && i.Employee.Designation != null ? i.Employee.Designation.Name : "",
                CurrentSalary = i.CurrentSalary,
                CurrentCompaRatio = i.CurrentCompaRatio,
                ProposedSalary = i.ProposedSalary,
                ProposedIncreasePercentage = i.ProposedIncreasePercentage,
                ProposedIncreaseAmount = i.ProposedIncreaseAmount,
                NewCompaRatio = i.NewCompaRatio,
                ManagerRecommendation = i.ManagerRecommendation,
                ManagerComments = i.ManagerComments,
                Status = i.Status
            })
            .ToListAsync();
    }

    public async Task<CompensationReviewItemDto> UpdateReviewItemAsync(Guid itemId, decimal proposedSalary, string recommendation, string comments)
    {
        var tenantId = GetEffectiveTenantId();
        var item = await _context.CompensationReviewItems
            .Include(i => i.ReviewCycle)
            .FirstOrDefaultAsync(i => i.Id == itemId && i.TenantId == tenantId && !i.IsDeleted)
            ?? throw new KeyNotFoundException("Review item not found.");

        var increase = proposedSalary - item.CurrentSalary;
        var pct = item.CurrentSalary > 0 ? Math.Round((increase / item.CurrentSalary) * 100, 2) : 0;

        item.ProposedSalary = proposedSalary;
        item.ProposedIncreaseAmount = increase;
        item.ProposedIncreasePercentage = pct;
        item.NewCompaRatio = item.CurrentCompaRatio * (item.CurrentSalary > 0 ? (proposedSalary / item.CurrentSalary) : 1);
        item.ManagerRecommendation = recommendation;
        item.ManagerComments = comments;
        item.Status = "Submitted";

        // Update cycle used budget
        if (item.ReviewCycle != null)
        {
            var totalIncrease = await _context.CompensationReviewItems
                .Where(i => i.ReviewCycleId == item.ReviewCycleId && i.Id != item.Id && !i.IsDeleted)
                .SumAsync(i => i.ProposedIncreaseAmount);
            item.ReviewCycle.UsedBudget = totalIncrease + increase;
        }

        await _context.SaveChangesAsync();
        return (await GetReviewItemsAsync(item.ReviewCycleId)).First(i => i.Id == item.Id);
    }

    // ==========================================
    // 8. BENEFIT PLANS & ENROLLMENTS
    // ==========================================
    public async Task<List<BenefitPlanDto>> GetBenefitPlansAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.BenefitPlans
            .AsNoTracking()
            .Include(b => b.Enrollments)
            .Where(b => b.TenantId == tenantId && !b.IsDeleted)
            .OrderBy(b => b.Type)
            .ThenBy(b => b.PlanName)
            .Select(b => new BenefitPlanDto
            {
                Id = b.Id,
                PlanCode = b.PlanCode,
                PlanName = b.PlanName,
                Type = b.Type,
                Provider = b.Provider,
                Description = b.Description,
                PolicyNumber = b.PolicyNumber,
                CoverageAmount = b.CoverageAmount,
                EmployeeMonthlyCost = b.EmployeeMonthlyCost,
                EmployerMonthlyCost = b.EmployerMonthlyCost,
                ContributionType = b.ContributionType,
                EmployerMatchPercentage = b.EmployerMatchPercentage,
                Currency = b.Currency,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                Status = b.Status,
                AllowsDependents = b.AllowsDependents,
                ActiveEnrollmentsCount = b.Enrollments.Count(e => e.Status == "Active" && !e.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<BenefitPlanDto> CreateBenefitPlanAsync(CreateBenefitPlanDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var plan = new BenefitPlan
        {
            TenantId = tenantId,
            PlanCode = dto.PlanCode.ToUpper().Trim(),
            PlanName = dto.PlanName.Trim(),
            Type = dto.Type,
            Provider = dto.Provider.Trim(),
            Description = dto.Description.Trim(),
            PolicyNumber = dto.PolicyNumber.Trim(),
            CoverageAmount = dto.CoverageAmount,
            EmployeeMonthlyCost = dto.EmployeeMonthlyCost,
            EmployerMonthlyCost = dto.EmployerMonthlyCost,
            ContributionType = dto.ContributionType,
            EmployerMatchPercentage = dto.EmployerMatchPercentage,
            Currency = dto.Currency,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = "Active",
            AllowsDependents = dto.AllowsDependents
        };

        _context.BenefitPlans.Add(plan);
        await _context.SaveChangesAsync();

        return (await GetBenefitPlansAsync()).First(b => b.Id == plan.Id);
    }

    public async Task<List<BenefitEnrollmentDto>> GetBenefitEnrollmentsAsync(Guid? employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.BenefitEnrollments
            .AsNoTracking()
            .Include(e => e.BenefitPlan)
            .Include(e => e.Employee)
                .ThenInclude(emp => emp!.Department)
            .Where(e => e.TenantId == tenantId && !e.IsDeleted);

        if (employeeId.HasValue)
            query = query.Where(e => e.EmployeeId == employeeId.Value);

        return await query
            .OrderByDescending(e => e.EnrollmentDate)
            .Select(e => new BenefitEnrollmentDto
            {
                Id = e.Id,
                EnrollmentNumber = e.EnrollmentNumber,
                EmployeeId = e.EmployeeId,
                EmployeeName = e.Employee != null ? $"{e.Employee.FirstName} {e.Employee.LastName}" : "",
                DepartmentName = e.Employee != null && e.Employee.Department != null ? e.Employee.Department.Name : "",
                BenefitPlanId = e.BenefitPlanId,
                PlanName = e.BenefitPlan != null ? e.BenefitPlan.PlanName : "",
                PlanType = e.BenefitPlan != null ? e.BenefitPlan.Type : "",
                Provider = e.BenefitPlan != null ? e.BenefitPlan.Provider : "",
                CoverageTier = e.CoverageTier,
                EmployeeMonthlyContribution = e.EmployeeMonthlyContribution,
                EmployerMonthlyContribution = e.EmployerMonthlyContribution,
                TotalMonthlyPremium = e.TotalMonthlyPremium,
                EnrollmentDate = e.EnrollmentDate,
                EffectiveDate = e.EffectiveDate,
                RenewalDate = e.RenewalDate,
                Status = e.Status
            })
            .ToListAsync();
    }

    public async Task<BenefitEnrollmentDto> CreateBenefitEnrollmentAsync(CreateBenefitEnrollmentDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var plan = await _context.BenefitPlans.FirstOrDefaultAsync(p => p.Id == dto.BenefitPlanId && p.TenantId == tenantId && !p.IsDeleted)
            ?? throw new KeyNotFoundException("Benefit plan not found.");

        // Multiplier based on tier
        decimal tierMultiplier = dto.CoverageTier switch
        {
            "EmployeeSpouse" => 1.75m,
            "EmployeeChildren" => 1.60m,
            "Family" => 2.20m,
            _ => 1.0m
        };

        var empCost = Math.Round(plan.EmployeeMonthlyCost * tierMultiplier, 2);
        var emplyrCost = Math.Round(plan.EmployerMonthlyCost * tierMultiplier, 2);

        var count = await _context.BenefitEnrollments.CountAsync(e => e.TenantId == tenantId) + 1;
        var enrollmentNumber = $"BEN-{DateTime.UtcNow.Year}-{count:D5}";

        var enrollment = new BenefitEnrollment
        {
            TenantId = tenantId,
            EnrollmentNumber = enrollmentNumber,
            EmployeeId = dto.EmployeeId,
            BenefitPlanId = dto.BenefitPlanId,
            CoverageTier = dto.CoverageTier,
            EmployeeMonthlyContribution = empCost,
            EmployerMonthlyContribution = emplyrCost,
            EnrollmentDate = DateTime.UtcNow,
            EffectiveDate = dto.EffectiveDate,
            RenewalDate = dto.EffectiveDate.AddYears(1),
            Status = "Active",
            CoveredDependentIds = JsonSerializer.Serialize(dto.CoveredDependentIds)
        };

        _context.BenefitEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        var empEnr = await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);

        return new BenefitEnrollmentDto
        {
            Id = enrollment.Id,
            EnrollmentNumber = enrollment.EnrollmentNumber,
            EmployeeId = enrollment.EmployeeId,
            EmployeeName = empEnr != null ? $"{empEnr.FirstName} {empEnr.LastName}" : "",
            DepartmentName = empEnr?.Department?.Name ?? "",
            BenefitPlanId = enrollment.BenefitPlanId,
            PlanName = plan.PlanName,
            PlanType = plan.Type,
            Provider = plan.Provider,
            CoverageTier = enrollment.CoverageTier,
            EmployeeMonthlyContribution = enrollment.EmployeeMonthlyContribution,
            EmployerMonthlyContribution = enrollment.EmployerMonthlyContribution,
            TotalMonthlyPremium = enrollment.TotalMonthlyPremium,
            EnrollmentDate = enrollment.EnrollmentDate,
            EffectiveDate = enrollment.EffectiveDate,
            RenewalDate = enrollment.RenewalDate,
            Status = enrollment.Status
        };
    }

    public async Task<List<EmployeeDependentDto>> GetDependentsAsync(Guid employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.EmployeeDependents
            .AsNoTracking()
            .Where(d => d.EmployeeId == employeeId && d.TenantId == tenantId && !d.IsDeleted)
            .OrderBy(d => d.Relationship)
            .Select(d => new EmployeeDependentDto
            {
                Id = d.Id,
                EmployeeId = d.EmployeeId,
                FullName = $"{d.FirstName} {d.LastName}".Trim(),
                Relationship = d.Relationship,
                DateOfBirth = d.DateOfBirth,
                Gender = d.Gender,
                VerificationStatus = d.VerificationStatus
            })
            .ToListAsync();
    }

    public async Task<EmployeeDependentDto> CreateDependentAsync(CreateEmployeeDependentDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var dep = new EmployeeDependent
        {
            TenantId = tenantId,
            EmployeeId = dto.EmployeeId,
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Relationship = dto.Relationship,
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            ContactPhone = dto.ContactPhone,
            VerificationStatus = "Verified"
        };

        _context.EmployeeDependents.Add(dep);
        await _context.SaveChangesAsync();

        return (await GetDependentsAsync(dto.EmployeeId)).First(d => d.Id == dep.Id);
    }

    // ==========================================
    // 9. TOTAL REWARDS & TEAM COMPENSATION
    // ==========================================
    public async Task<TotalRewardsDto?> GetTotalRewardsAsync(Guid employeeId)
    {
        var detail = await GetEmployeeCompensationDetailAsync(employeeId);
        if (detail == null) return null;

        var emp = await _context.Employees
            .AsNoTracking()
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        var totalBonuses = detail.Bonuses.Where(b => b.Status == "Approved" || b.Status == "PaidInPayroll").Sum(b => b.Amount);
        var totalAllowancesAnnual = detail.Components
            .Where(c => c.Type == "Earnings" && c.ComponentCode != "BASIC")
            .Sum(c => c.CalculatedAnnualAmount);
        var totalAllowancesMonthly = detail.Components
            .Where(c => c.Type == "Earnings" && c.ComponentCode != "BASIC")
            .Sum(c => c.CalculatedMonthlyAmount);

        var medicalAnnual = detail.EnrolledBenefits.Where(b => b.PlanType == "MedicalInsurance").Sum(b => b.EmployerMonthlyContribution * 12);
        var dentalVisionAnnual = detail.EnrolledBenefits.Where(b => b.PlanType == "Dental" || b.PlanType == "Vision").Sum(b => b.EmployerMonthlyContribution * 12);
        var retirementAnnual = detail.EnrolledBenefits.Where(b => b.PlanType == "Retirement" || b.PlanType == "Pension").Sum(b => b.EmployerMonthlyContribution * 12);
        var otherBenefitsAnnual = detail.EnrolledBenefits.Where(b => b.PlanType != "MedicalInsurance" && b.PlanType != "Dental" && b.PlanType != "Vision" && b.PlanType != "Retirement").Sum(b => b.EmployerMonthlyContribution * 12);
        var totalEmployerBenefits = medicalAnnual + dentalVisionAnnual + retirementAnnual + otherBenefitsAnnual;

        var grandTotalAnnual = detail.BaseSalary + totalAllowancesAnnual + totalBonuses + totalEmployerBenefits;

        return new TotalRewardsDto
        {
            EmployeeId = employeeId,
            EmployeeNumber = detail.EmployeeNumber,
            EmployeeName = detail.EmployeeName,
            DepartmentName = detail.DepartmentName,
            DesignationTitle = detail.DesignationTitle,
            GradeName = detail.GradeName,
            JoiningDate = emp?.JoiningDate ?? DateTime.UtcNow,
            BaseSalaryAnnual = detail.BaseSalary,
            BaseSalaryMonthly = Math.Round(detail.BaseSalary / 12, 2),
            TotalAllowancesAnnual = totalAllowancesAnnual,
            TotalAllowancesMonthly = totalAllowancesMonthly,
            TotalBonusesAnnual = totalBonuses,
            EmployerMedicalBenefitAnnual = medicalAnnual,
            EmployerDentalVisionAnnual = dentalVisionAnnual,
            EmployerRetirementMatchAnnual = retirementAnnual,
            EmployerOtherBenefitsAnnual = otherBenefitsAnnual,
            TotalEmployerBenefitsAnnual = totalEmployerBenefits,
            TotalRewardsValueAnnual = Math.Round(grandTotalAnnual, 2),
            TotalRewardsValueMonthly = Math.Round(grandTotalAnnual / 12, 2),
            AllowancesList = detail.Components,
            EnrolledBenefitsList = detail.EnrolledBenefits
        };
    }

    public async Task<List<EmployeeCompensationDto>> GetTeamCompensationAsync(Guid managerEmployeeId)
    {
        var tenantId = GetEffectiveTenantId();
        var directReportIds = await _context.Employees
            .Where(e => e.ManagerId == managerEmployeeId && e.TenantId == tenantId && !e.IsDeleted)
            .Select(e => e.Id)
            .ToListAsync();

        var query = _context.EmployeeCompensations
            .AsNoTracking()
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Department)
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Designation)
            .Include(c => c.PayGrade)
            .Include(c => c.SalaryBand)
            .Where(c => directReportIds.Contains(c.EmployeeId) && c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted);

        return await query.Select(c => new EmployeeCompensationDto
        {
            Id = c.Id,
            EmployeeId = c.EmployeeId,
            EmployeeNumber = c.Employee != null ? c.Employee.EmployeeNumber : "",
            EmployeeName = c.Employee != null ? $"{c.Employee.FirstName} {c.Employee.LastName}" : "",
            DepartmentName = c.Employee != null && c.Employee.Department != null ? c.Employee.Department.Name : "",
            DesignationTitle = c.Employee != null && c.Employee.Designation != null ? c.Employee.Designation.Name : "",
            PayGradeId = c.PayGradeId,
            GradeCode = c.PayGrade != null ? c.PayGrade.Code : "",
            GradeName = c.PayGrade != null ? c.PayGrade.Name : "",
            BaseSalary = c.BaseSalary,
            Currency = c.Currency,
            CompaRatio = c.CompaRatio,
            EffectiveDate = c.EffectiveDate,
            Status = c.Status
        }).ToListAsync();
    }

    // ==========================================
    // 10. PAYROLL INTEGRATION
    // ==========================================
    public async Task<List<PayrollCompensationExportDto>> GetPayrollCompensationExportAsync(DateTime asOfDate)
    {
        var tenantId = GetEffectiveTenantId();

        var compensations = await _context.EmployeeCompensations
            .AsNoTracking()
            .Include(c => c.Employee)
                .ThenInclude(e => e!.Department)
            .Include(c => c.Assignments)
                .ThenInclude(a => a.Component)
            .Where(c => c.TenantId == tenantId && c.IsCurrent && !c.IsDeleted)
            .ToListAsync();

        var employeeIds = compensations.Select(c => c.EmployeeId).ToList();

        var activeEnrollments = await _context.BenefitEnrollments
            .AsNoTracking()
            .Where(e => employeeIds.Contains(e.EmployeeId) && e.TenantId == tenantId && e.Status == "Active" && !e.IsDeleted)
            .ToListAsync();

        var approvedBonuses = await _context.EmployeeBonuses
            .AsNoTracking()
            .Where(b => employeeIds.Contains(b.EmployeeId) && b.TenantId == tenantId && (b.Status == "Approved" || b.Status == "PaidInPayroll") && !b.IsDeleted)
            .ToListAsync();

        var result = new List<PayrollCompensationExportDto>();
        foreach (var comp in compensations)
        {
            var empAllowances = comp.Assignments
                .Where(a => a.Component != null && a.Component.Type == "Earnings" && a.Component.Code != "BASIC")
                .Sum(a => a.CalculatedMonthlyAmount);

            var empDeductions = activeEnrollments
                .Where(e => e.EmployeeId == comp.EmployeeId)
                .Sum(e => e.EmployeeMonthlyContribution);

            var emplyrContributions = activeEnrollments
                .Where(e => e.EmployeeId == comp.EmployeeId)
                .Sum(e => e.EmployerMonthlyContribution);

            var empBonuses = approvedBonuses
                .Where(b => b.EmployeeId == comp.EmployeeId && b.PaymentDate.Month == asOfDate.Month && b.PaymentDate.Year == asOfDate.Year)
                .Sum(b => b.Amount);

            result.Add(new PayrollCompensationExportDto
            {
                EmployeeId = comp.EmployeeId,
                EmployeeNumber = comp.Employee?.EmployeeNumber ?? "",
                EmployeeName = comp.Employee != null ? $"{comp.Employee.FirstName} {comp.Employee.LastName}" : "",
                DepartmentName = comp.Employee?.Department?.Name ?? "",
                ApprovedBaseSalary = Math.Round(comp.BaseSalary / 12, 2),
                RegularAllowances = Math.Round(empAllowances, 2),
                ApprovedBonusesPayable = Math.Round(empBonuses, 2),
                EmployeeBenefitDeductions = Math.Round(empDeductions, 2),
                EmployerBenefitContributions = Math.Round(emplyrContributions, 2),
                AsOfDate = asOfDate
            });
        }

        return result;
    }

    // ==========================================
    // 11. REPORTS & CSV EXPORT
    // ==========================================
    public async Task<byte[]> ExportCompensationCsvAsync(string reportType)
    {
        var tenantId = GetEffectiveTenantId();
        using var memoryStream = new MemoryStream();
        using var writer = new StreamWriter(memoryStream, Encoding.UTF8);

        if (reportType == "SalaryBands")
        {
            var bands = await GetSalaryBandsAsync(null);
            writer.WriteLine("GradeCode,BandName,Country,Location,Minimum,Midpoint,Maximum,Currency,Status");
            foreach (var b in bands)
            {
                writer.WriteLine($"\"{b.GradeCode}\",\"{b.BandName}\",\"{b.Country}\",\"{b.LocationName}\",{b.Minimum},{b.Midpoint},{b.Maximum},\"{b.Currency}\",\"{(b.IsActive ? "Active" : "Inactive")}\"");
            }
        }
        else if (reportType == "Bonuses")
        {
            var bonuses = await GetBonusesAsync(null);
            writer.WriteLine("EmployeeName,Department,BonusType,Amount,Currency,PaymentDate,Reason,Status");
            foreach (var b in bonuses)
            {
                writer.WriteLine($"\"{b.EmployeeName}\",\"{b.DepartmentName}\",\"{b.BonusType}\",{b.Amount},\"{b.Currency}\",\"{b.PaymentDate:yyyy-MM-dd}\",\"{b.Reason}\",\"{b.Status}\"");
            }
        }
        else if (reportType == "BenefitsEnrollment")
        {
            var enrollments = await GetBenefitEnrollmentsAsync(null);
            writer.WriteLine("EnrollmentNumber,EmployeeName,Department,PlanName,PlanType,Provider,CoverageTier,EmployeeMonthlyCost,EmployerMonthlyCost,EffectiveDate,Status");
            foreach (var e in enrollments)
            {
                writer.WriteLine($"\"{e.EnrollmentNumber}\",\"{e.EmployeeName}\",\"{e.DepartmentName}\",\"{e.PlanName}\",\"{e.PlanType}\",\"{e.Provider}\",\"{e.CoverageTier}\",{e.EmployeeMonthlyContribution},{e.EmployerMonthlyContribution},\"{e.EffectiveDate:yyyy-MM-dd}\",\"{e.Status}\"");
            }
        }
        else
        {
            // Default: EmployeeCompensation
            var compensations = (await GetEmployeeCompensationsAsync(new CompensationFilterParams { PageSize = 1000 })).Items;
            writer.WriteLine("EmployeeNumber,EmployeeName,Department,Designation,Grade,BaseSalary,AnnualTotal,CompaRatio,CompaRatioStatus,EffectiveDate,Status");
            foreach (var c in compensations)
            {
                writer.WriteLine($"\"{c.EmployeeNumber}\",\"{c.EmployeeName}\",\"{c.DepartmentName}\",\"{c.DesignationTitle}\",\"{c.GradeCode}\",{c.BaseSalary},{c.AnnualTotalCompensation},{c.CompaRatio},\"{c.CompaRatioStatus}\",\"{c.EffectiveDate:yyyy-MM-dd}\",\"{c.Status}\"");
            }
        }

        await writer.FlushAsync();
        return memoryStream.ToArray();
    }
}
