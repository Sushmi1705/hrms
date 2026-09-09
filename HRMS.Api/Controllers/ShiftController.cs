using System;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Features.Shift.Queries;
using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Shift;

namespace HRMS.Api.Controllers;

public class CreateOrUpdateShiftRequest
{
    public string ShiftName { get; set; } = string.Empty;
    public string ShiftCode { get; set; } = string.Empty;
    public string ShiftType { get; set; } = "General";
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
    public decimal WorkingHours { get; set; } = 8;
    public string ColorCode { get; set; } = "#3b82f6";
    public string Status { get; set; } = "Active";
    public string? Description { get; set; }
}

[ApiController]
[Route("api/v1/[controller]")]
public class ShiftController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IShiftRepository _shiftRepository;

    public ShiftController(IMediator mediator, IShiftRepository shiftRepository)
    {
        _mediator = mediator;
        _shiftRepository = shiftRepository;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetDashboardAnalytics()
    {
        var result = await _mediator.Send(new GetShiftDashboardAnalyticsQuery());
        return Ok(result);
    }

    [HttpGet("master")]
    public async Task<IActionResult> GetAllShifts()
    {
        var result = await _mediator.Send(new GetAllShiftsQuery());
        return Ok(result);
    }

    [HttpPost("master")]
    public async Task<IActionResult> CreateShift([FromBody] CreateOrUpdateShiftRequest request)
    {
        TimeSpan.TryParse(request.StartTime, out var startTime);
        TimeSpan.TryParse(request.EndTime, out var endTime);

        var entity = new ShiftMaster
        {
            Id = Guid.NewGuid(),
            ShiftName = request.ShiftName,
            ShiftCode = string.IsNullOrWhiteSpace(request.ShiftCode) ? ("SHF" + new Random().Next(100, 999)) : request.ShiftCode,
            ShiftType = request.ShiftType ?? "General",
            StartTime = startTime,
            EndTime = endTime,
            WorkingHours = request.WorkingHours > 0 ? request.WorkingHours : 8,
            ColorCode = string.IsNullOrWhiteSpace(request.ColorCode) ? "#3b82f6" : request.ColorCode,
            Status = request.Status ?? "Active",
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _shiftRepository.CreateShiftAsync(entity);
        return Ok(created);
    }

    [HttpPut("master/{id}")]
    public async Task<IActionResult> UpdateShift(Guid id, [FromBody] CreateOrUpdateShiftRequest request)
    {
        var existing = await _shiftRepository.GetShiftByIdAsync(id);
        if (existing == null) return NotFound(new { message = "Shift not found" });

        TimeSpan.TryParse(request.StartTime, out var startTime);
        TimeSpan.TryParse(request.EndTime, out var endTime);

        existing.ShiftName = request.ShiftName;
        if (!string.IsNullOrWhiteSpace(request.ShiftCode)) existing.ShiftCode = request.ShiftCode;
        existing.ShiftType = request.ShiftType ?? "General";
        existing.StartTime = startTime;
        existing.EndTime = endTime;
        existing.WorkingHours = request.WorkingHours > 0 ? request.WorkingHours : existing.WorkingHours;
        existing.ColorCode = request.ColorCode ?? existing.ColorCode;
        existing.Status = request.Status ?? existing.Status;
        existing.Description = request.Description ?? existing.Description;
        existing.UpdatedAt = DateTime.UtcNow;

        var updated = await _shiftRepository.UpdateShiftAsync(existing);
        return Ok(updated);
    }

    [HttpDelete("master/{id}")]
    public async Task<IActionResult> DeleteShift(Guid id)
    {
        await _shiftRepository.DeleteShiftAsync(id);
        return Ok(new { success = true, message = "Shift deleted successfully" });
    }

    [HttpGet("assignments")]
    public async Task<IActionResult> GetAllAssignments()
    {
        var assignments = await _shiftRepository.GetAllAssignmentsAsync();
        return Ok(assignments.Select(a => new
        {
            id = a.Id,
            employeeId = a.EmployeeId,
            employee = a.Employee != null ? $"{a.Employee.FirstName} {a.Employee.LastName}".Trim() : "Team Member",
            dept = a.Employee != null && a.Employee.Department != null ? a.Employee.Department.Name : "Engineering",
            shiftId = a.ShiftId,
            shift = a.Shift != null ? a.Shift.ShiftName : "General Shift",
            pattern = a.RotationPattern ?? "Weekly",
            nextChange = a.EffectiveToDate.HasValue ? a.EffectiveToDate.Value.ToString("yyyy-MM-dd") : a.EffectiveFromDate.AddDays(7).ToString("yyyy-MM-dd"),
            status = a.Status
        }));
    }

    [HttpPost("assign")]
    public async Task<IActionResult> BulkAssignShifts([FromBody] BulkShiftAssignRequest request)
    {
        var shifts = await _shiftRepository.GetAllShiftsAsync();
        var shift = request.ShiftId.HasValue 
            ? System.Linq.Enumerable.FirstOrDefault(shifts, s => s.Id == request.ShiftId.Value)
            : (!string.IsNullOrWhiteSpace(request.ShiftName) 
                ? System.Linq.Enumerable.FirstOrDefault(shifts, s => s.ShiftName.Equals(request.ShiftName, StringComparison.OrdinalIgnoreCase))
                : System.Linq.Enumerable.FirstOrDefault(shifts));

        var shiftId = shift != null ? shift.Id : Guid.NewGuid();
        var results = new System.Collections.Generic.List<object>();

        if (request.EmployeeIds != null && request.EmployeeIds.Count > 0)
        {
            foreach (var empId in request.EmployeeIds)
            {
                var assignment = new EmployeeShiftAssignment
                {
                    Id = Guid.NewGuid(),
                    EmployeeId = empId,
                    ShiftId = shiftId,
                    EffectiveFromDate = request.EffectiveFromDate ?? DateTime.UtcNow,
                    EffectiveToDate = (request.EffectiveFromDate ?? DateTime.UtcNow).AddDays(request.RotationPattern == "Bi-Weekly" ? 14 : 7),
                    IsRotating = request.RotationPattern != "Fixed",
                    RotationPattern = request.RotationPattern ?? "Weekly",
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };

                await _shiftRepository.CreateAssignmentAsync(assignment);
                results.Add(assignment);
            }
        }

        return Ok(new { success = true, count = results.Count, message = "Shifts assigned successfully" });
    }
}

public class BulkShiftAssignRequest
{
    public System.Collections.Generic.List<Guid>? EmployeeIds { get; set; }
    public Guid? ShiftId { get; set; }
    public string? ShiftName { get; set; }
    public string? DepartmentName { get; set; }
    public string? RotationPattern { get; set; } = "Weekly";
    public DateTime? EffectiveFromDate { get; set; } = DateTime.UtcNow;
}

