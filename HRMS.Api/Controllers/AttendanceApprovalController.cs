using HRMS.Application.Features.Attendance.Commands;
using HRMS.Application.Features.Attendance.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AttendanceApprovalController : ControllerBase
{
    private readonly IMediator _mediator;

    public AttendanceApprovalController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("pending-approvals")]
    public async Task<IActionResult> GetPendingApprovals()
    {
        var result = await _mediator.Send(new GetPendingApprovalsQuery());
        return Ok(result);
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve([FromBody] ApproveAttendanceCommand command)
    {
        // Hardcode a manager ID for now
        command.HRManagerId = Guid.NewGuid();
        var result = await _mediator.Send(command);
        if (!result) return BadRequest("Failed to approve the attendance request.");
        return Ok(new { Message = "Successfully approved." });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> Reject([FromBody] RejectAttendanceCommand command)
    {
        // Hardcode a manager ID for now
        command.HRManagerId = Guid.NewGuid();
        var result = await _mediator.Send(command);
        if (!result) return BadRequest("Failed to reject the attendance request.");
        return Ok(new { Message = "Successfully rejected." });
    }
}
