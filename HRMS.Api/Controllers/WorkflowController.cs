using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Services;
using HRMS.Application.Features.Workflow.Commands;
using HRMS.Application.Features.Workflow.DTOs;
using HRMS.Application.Features.Workflow.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class WorkflowController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWorkflowEngineService _engineService;

    public WorkflowController(IMediator mediator, IWorkflowEngineService engineService)
    {
        _mediator = mediator;
        _engineService = engineService;
    }

    // 1. Dashboard & Analytics
    [HttpGet("dashboard")]
    [HttpGet("analytics")]
    public async Task<IActionResult> GetDashboard([FromQuery] string? department, [FromQuery] string? module)
    {
        var result = await _mediator.Send(new GetWorkflowDashboardAnalyticsQuery(department, module));
        return Ok(result);
    }

    // 2. Workflow Definitions
    [HttpGet("definitions")]
    public async Task<IActionResult> GetDefinitions([FromQuery] WorkflowFilterParams filters)
    {
        var result = await _mediator.Send(new GetWorkflowDefinitionsQuery(filters));
        return Ok(result);
    }

    [HttpGet("definitions/{id}")]
    public async Task<IActionResult> GetDefinitionById(Guid id)
    {
        var result = await _mediator.Send(new GetWorkflowDefinitionByIdQuery(id));
        if (result == null) return NotFound(new { message = "Workflow definition not found" });
        return Ok(result);
    }

    [HttpPost("definitions")]
    public async Task<IActionResult> CreateDefinition([FromBody] UpsertWorkflowDefinitionDto dto)
    {
        var createdBy = User.Identity?.Name ?? "HR Admin";
        var result = await _mediator.Send(new CreateWorkflowDefinitionCommand(dto, createdBy));
        return CreatedAtAction(nameof(GetDefinitionById), new { id = result.Id }, result);
    }

    [HttpPut("definitions/{id}")]
    public async Task<IActionResult> UpdateDefinition(Guid id, [FromBody] UpsertWorkflowDefinitionDto dto)
    {
        var updatedBy = User.Identity?.Name ?? "HR Admin";
        var result = await _mediator.Send(new UpdateWorkflowDefinitionCommand(id, dto, updatedBy));
        return Ok(result);
    }

    [HttpDelete("definitions/{id}")]
    public async Task<IActionResult> DeleteDefinition(Guid id)
    {
        var success = await _mediator.Send(new DeleteWorkflowDefinitionCommand(id));
        if (!success) return NotFound();
        return Ok(new { success = true, message = "Workflow definition deleted successfully." });
    }

    [HttpPost("definitions/{id}/publish")]
    public async Task<IActionResult> PublishDefinition(Guid id)
    {
        var publishedBy = User.Identity?.Name ?? "HR Admin";
        var result = await _mediator.Send(new PublishWorkflowDefinitionCommand(id, publishedBy));
        return Ok(result);
    }

    [HttpPost("definitions/{id}/duplicate")]
    public async Task<IActionResult> DuplicateDefinition(Guid id)
    {
        var createdBy = User.Identity?.Name ?? "HR Admin";
        var result = await _mediator.Send(new DuplicateWorkflowDefinitionCommand(id, createdBy));
        return Ok(result);
    }

    // 3. Approval Inbox & Tasks
    [HttpGet("tasks/inbox")]
    public async Task<IActionResult> GetApprovalInbox([FromQuery] ApprovalInboxFilterParams filters)
    {
        var result = await _mediator.Send(new GetApprovalInboxQuery(filters));
        return Ok(result);
    }

    [HttpGet("tasks/my")]
    public async Task<IActionResult> GetMyApprovals([FromQuery] string tab, [FromQuery] ApprovalInboxFilterParams filters, [FromQuery] string? userId)
    {
        var effectiveUserId = !string.IsNullOrEmpty(userId) ? userId : (User.Identity?.Name ?? "hr-admin-01");
        var result = await _mediator.Send(new GetMyApprovalsQuery(effectiveUserId, tab ?? "pending", filters));
        return Ok(result);
    }

    [HttpGet("instances/{id}")]
    public async Task<IActionResult> GetApprovalDetails(Guid id, [FromQuery] string? viewerUserId)
    {
        var result = await _mediator.Send(new GetApprovalDetailsQuery(id, viewerUserId));
        if (result == null) return NotFound(new { message = "Approval request details not found" });
        return Ok(result);
    }

    [HttpPost("instances/start")]
    public async Task<IActionResult> StartWorkflowInstance([FromBody] StartWorkflowInstanceCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("tasks/{id}/action")]
    public async Task<IActionResult> ProcessAction(Guid id, [FromBody] ProcessApprovalActionDto dto)
    {
        var actorId = User.Identity?.Name ?? "admin-user";
        var actorName = User.Identity?.Name ?? "System Administrator";
        var actorRole = "Approver";

        var command = new ProcessApprovalTaskActionCommand(
            id,
            actorId,
            actorName,
            actorRole,
            dto.Action,
            dto.Comments,
            dto.DelegateToUserId,
            dto.DelegateToUserName,
            dto.ReassignToUserId,
            dto.ReassignToUserName);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("tasks/bulk-action")]
    public async Task<IActionResult> BulkProcessAction([FromBody] BulkApprovalActionDto dto)
    {
        var actorId = User.Identity?.Name ?? "admin-user";
        var actorName = User.Identity?.Name ?? "System Administrator";
        var actorRole = "Approver";

        var command = new BulkApprovalActionCommand(
            dto.TaskIds,
            actorId,
            actorName,
            actorRole,
            dto.Action,
            dto.Comments);

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // 4. Delegations
    [HttpGet("delegations")]
    public async Task<IActionResult> GetDelegations([FromQuery] string? delegatorId, [FromQuery] bool activeOnly = false)
    {
        var result = await _mediator.Send(new GetDelegationsQuery(delegatorId, activeOnly));
        return Ok(result);
    }

    [HttpPost("delegations")]
    public async Task<IActionResult> CreateDelegation([FromBody] CreateDelegationDto dto)
    {
        var result = await _mediator.Send(new CreateDelegationCommand(dto));
        return Ok(result);
    }

    [HttpDelete("delegations/{id}")]
    public async Task<IActionResult> RevokeDelegation(Guid id)
    {
        var result = await _mediator.Send(new RevokeDelegationCommand(id));
        return Ok(new { success = result });
    }

    // 5. Templates
    [HttpGet("templates")]
    public async Task<IActionResult> GetTemplates()
    {
        var result = await _mediator.Send(new GetWorkflowTemplatesQuery());
        return Ok(result);
    }

    [HttpPost("templates/{id}/instantiate")]
    public async Task<IActionResult> InstantiateTemplate(Guid id)
    {
        var template = await _mediator.Send(new GetWorkflowTemplatesQuery());
        var t = template.Find(x => x.Id == id);
        if (t == null) return NotFound();

        var createdBy = User.Identity?.Name ?? "HR Admin";
        var upsertDto = new UpsertWorkflowDefinitionDto
        {
            Code = $"WF-{t.Module.ToUpper()}-{new Random().Next(100, 999)}",
            Name = $"{t.Name} (From Template)",
            Module = t.Module,
            Category = t.Category,
            Description = t.Description,
            Status = "Draft",
            TriggerEvent = "OnSubmit",
            Steps = new List<UpsertWorkflowStepDto>
            {
                new UpsertWorkflowStepDto
                {
                    StepKey = "step_mgr",
                    StepName = "Direct Manager Review",
                    OrderIndex = 1,
                    ApproverType = "EmployeeManager",
                    TimeoutHours = 24,
                    EscalationEnabled = true,
                    EscalateAfterHours = 24,
                    EscalateToType = "HR"
                },
                new UpsertWorkflowStepDto
                {
                    StepKey = "step_dept",
                    StepName = "Department Head Approval",
                    OrderIndex = 2,
                    ApproverType = "DepartmentManager",
                    TimeoutHours = 48,
                    EscalationEnabled = false
                }
            }
        };

        var created = await _mediator.Send(new CreateWorkflowDefinitionCommand(upsertDto, createdBy));
        return Ok(created);
    }

    // 6. Reports
    [HttpGet("reports/escalations")]
    public async Task<IActionResult> GetEscalationsReport([FromQuery] string? module)
    {
        var result = await _mediator.Send(new GetEscalationsReportQuery(module));
        return Ok(result);
    }

    [HttpGet("reports/sla")]
    public async Task<IActionResult> GetSlaReport([FromQuery] string? module)
    {
        var result = await _mediator.Send(new GetSlaReportQuery(module));
        return Ok(result);
    }

    [HttpGet("reports/workload")]
    public async Task<IActionResult> GetWorkloadReport()
    {
        var result = await _mediator.Send(new GetWorkloadReportQuery());
        return Ok(result);
    }

    // 7. CSV Export
    [HttpGet("export")]
    public async Task<IActionResult> ExportWorkflowData([FromQuery] string type = "inbox")
    {
        var csv = new StringBuilder();
        if (type == "inbox" || type == "approvals")
        {
            csv.AppendLine("RequestId,RequestNumber,Requester,Department,Module,StepName,Status,Priority,DueDate,SlaStatus");
            var inbox = await _mediator.Send(new GetApprovalInboxQuery(new ApprovalInboxFilterParams { PageSize = 1000 }));
            foreach (var item in inbox.Items)
            {
                csv.AppendLine($"\"{item.ApprovalRequestId}\",\"{item.RequestNumber}\",\"{item.RequesterName}\",\"{item.Department}\",\"{item.Module}\",\"{item.StepName}\",\"{item.Status}\",\"{item.Priority}\",\"{item.DueDate:yyyy-MM-dd HH:mm}\",\"{item.SlaStatus}\"");
            }
        }
        else
        {
            csv.AppendLine("Id,Code,Name,Module,Category,Status,Version,StepsCount,UsageCount,CreatedAt");
            var defs = await _mediator.Send(new GetWorkflowDefinitionsQuery(new WorkflowFilterParams { PageSize = 1000 }));
            foreach (var item in defs.Items)
            {
                csv.AppendLine($"\"{item.Id}\",\"{item.Code}\",\"{item.Name}\",\"{item.Module}\",\"{item.Category}\",\"{item.Status}\",\"{item.Version}\",\"{item.StepsCount}\",\"{item.UsageCount}\",\"{item.CreatedAt:yyyy-MM-dd}\"");
            }
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", $"workflow_{type}_export_{DateTime.UtcNow:yyyyMMdd}.csv");
    }
}
