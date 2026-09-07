using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Asset.DTOs;
using HRMS.Domain.Entities.Asset;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/asset-requests")]
public class AssetRequestsController : ControllerBase
{
    private readonly IAssetRepository _assetRepository;

    public AssetRequestsController(IAssetRepository assetRepository)
    {
        _assetRepository = assetRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null, [FromQuery] Guid? employeeId = null)
    {
        var result = await _assetRepository.GetAssetRequestsAsync(page, pageSize, status, employeeId);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyRequests([FromQuery] Guid? employeeId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var empId = employeeId ?? Guid.Empty;
        var result = await _assetRepository.GetAssetRequestsAsync(page, pageSize, null, empId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var request = await _assetRepository.GetAssetRequestByIdAsync(id);
        if (request == null) return NotFound(new { message = "Asset request not found" });
        return Ok(request);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAssetRequestDto dto, [FromQuery] Guid? employeeId)
    {
        var empId = employeeId.HasValue && employeeId.Value != Guid.Empty ? employeeId.Value : Guid.Parse("08bd7f84-0fd0-4c54-b2c2-b1e8c08fc1cb");
        
        var request = new AssetRequest
        {
            Id = Guid.NewGuid(),
            EmployeeId = empId,
            CategoryId = dto.CategoryId,
            ModelId = dto.ModelId,
            Quantity = dto.Quantity,
            Reason = dto.Reason,
            RequiredDate = dto.RequiredDate,
            Priority = dto.Priority,
            Notes = dto.Notes
        };

        var created = await _assetRepository.CreateAssetRequestAsync(request);
        return Ok(created);
    }

    [HttpPost("{id}/action")]
    public async Task<IActionResult> ProcessAction(Guid id, [FromBody] ProcessAssetRequestActionDto dto)
    {
        var actorName = User.Identity?.Name ?? "Department Manager / Approver";
        var success = await _assetRepository.ProcessAssetRequestActionAsync(id, dto, actorName);
        if (!success) return NotFound();
        return Ok(new { success = true, message = $"Asset request successfully updated with action '{dto.Action}'." });
    }
}
