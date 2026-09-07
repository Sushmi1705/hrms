using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Features.Asset.DTOs;
using HRMS.Domain.Entities.Asset;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetRepository _assetRepository;

    public AssetsController(IAssetRepository assetRepository)
    {
        _assetRepository = assetRepository;
    }

    // 1. Core Listing & Search
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] AssetFilterParams filters)
    {
        var result = await _assetRepository.GetAssetsAsync(filters);
        return Ok(result);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] Guid? companyId, [FromQuery] Guid? branchId, [FromQuery] Guid? departmentId)
    {
        var metrics = await _assetRepository.GetDashboardMetricsAsync(companyId, branchId, departmentId);
        return Ok(metrics);
    }

    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventory()
    {
        var inventory = await _assetRepository.GetInventorySummaryAsync();
        return Ok(inventory);
    }

    // 2. Taxonomy & Master Data
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _assetRepository.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] AssetCategory category)
    {
        var created = await _assetRepository.CreateCategoryAsync(category);
        return Ok(created);
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetModels([FromQuery] Guid? categoryId)
    {
        var models = await _assetRepository.GetModelsAsync(categoryId);
        return Ok(models);
    }

    [HttpPost("models")]
    public async Task<IActionResult> CreateModel([FromBody] AssetModel model)
    {
        var created = await _assetRepository.CreateModelAsync(model);
        return Ok(created);
    }

    [HttpGet("locations")]
    public async Task<IActionResult> GetLocations()
    {
        var locations = await _assetRepository.GetLocationsAsync();
        return Ok(locations);
    }

    [HttpPost("locations")]
    public async Task<IActionResult> CreateLocation([FromBody] AssetLocation location)
    {
        var created = await _assetRepository.CreateLocationAsync(location);
        return Ok(created);
    }

    [HttpGet("vendors")]
    public async Task<IActionResult> GetVendors()
    {
        var vendors = await _assetRepository.GetVendorsAsync();
        return Ok(vendors);
    }

    [HttpPost("vendors")]
    public async Task<IActionResult> CreateVendor([FromBody] AssetVendor vendor)
    {
        var created = await _assetRepository.CreateVendorAsync(vendor);
        return Ok(created);
    }

    [HttpGet("warranties")]
    public async Task<IActionResult> GetWarranties([FromQuery] int days = 30)
    {
        var warranties = await _assetRepository.GetExpiringWarrantiesAsync(days);
        return Ok(warranties);
    }

    // 3. Physical Audits
    [HttpGet("audits")]
    public async Task<IActionResult> GetAudits()
    {
        var audits = await _assetRepository.GetAuditsAsync();
        return Ok(audits);
    }

    [HttpGet("audits/{id}")]
    public async Task<IActionResult> GetAuditById(Guid id)
    {
        var audit = await _assetRepository.GetAuditByIdAsync(id);
        if (audit == null) return NotFound(new { message = "Audit not found" });
        return Ok(audit);
    }

    [HttpPost("audits")]
    public async Task<IActionResult> CreateAudit([FromBody] AssetAudit audit)
    {
        var created = await _assetRepository.CreateAuditAsync(audit);
        return Ok(created);
    }

    [HttpPost("audits/items/{itemId}/verify")]
    public async Task<IActionResult> VerifyAuditItem(Guid itemId, [FromBody] VerifyAuditItemDto dto)
    {
        var actor = User.Identity?.Name ?? "Lead Auditor";
        var success = await _assetRepository.VerifyAuditItemAsync(itemId, dto, actor);
        if (!success) return NotFound();
        return Ok(new { success = true, message = "Audit item verified successfully." });
    }

    // 4. Reports & Financials
    [HttpGet("reports")]
    public async Task<IActionResult> GetReport([FromQuery] AssetReportFilterDto filter)
    {
        var report = await _assetRepository.GenerateReportAsync(filter);
        return Ok(report);
    }

    [HttpGet("reports/export")]
    public async Task<IActionResult> ExportReportCsv([FromQuery] AssetReportFilterDto filter)
    {
        var report = await _assetRepository.GenerateReportAsync(filter);
        var sb = new StringBuilder();
        sb.AppendLine(string.Join(",", report.Columns));

        foreach (var row in report.Rows)
        {
            var line = new List<string>();
            foreach (var col in report.Columns)
            {
                var val = row.ContainsKey(col) ? row[col]?.ToString() ?? "" : "";
                val = val.Replace("\"", "\"\"");
                line.Add($"\"{val}\"");
            }
            sb.AppendLine(string.Join(",", line));
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return File(bytes, "text/csv", $"{filter.ReportType}_{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    [HttpGet("depreciation/calculate/{id}")]
    public async Task<IActionResult> CalculateDepreciation(Guid id)
    {
        try
        {
            var result = await _assetRepository.CalculateDepreciationAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // 5. Bulk Operations
    [HttpPost("bulk-status")]
    public async Task<IActionResult> BulkUpdateStatus([FromBody] BulkStatusUpdateDto dto)
    {
        var actor = User.Identity?.Name ?? "HR Admin";
        var updatedCount = await _assetRepository.BulkUpdateStatusAsync(dto, actor);
        return Ok(new { success = true, updatedCount });
    }

    [HttpPost("bulk-transfer")]
    public async Task<IActionResult> BulkTransfer([FromBody] BulkTransferDto dto)
    {
        var actor = User.Identity?.Name ?? "HR Admin";
        var transferredCount = await _assetRepository.BulkTransferAsync(dto, actor);
        return Ok(new { success = true, transferredCount });
    }

    // 6. Role Specific: Employee & Manager
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAssets([FromQuery] Guid? employeeId)
    {
        // For testing/demo, if employeeId is passed or use default seeded employee
        var empId = employeeId ?? Guid.Empty;
        var assets = await _assetRepository.GetEmployeeAssetsAsync(empId);
        return Ok(assets);
    }

    [HttpGet("team")]
    public async Task<IActionResult> GetTeamAssets([FromQuery] Guid? managerId)
    {
        var mgrId = managerId ?? Guid.Empty;
        var assets = await _assetRepository.GetTeamAssetsAsync(mgrId);
        return Ok(assets);
    }

    // 7. Single Asset Operations
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var asset = await _assetRepository.GetAssetByIdAsync(id);
        if (asset == null) return NotFound(new { message = "Asset not found" });
        return Ok(asset);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertAssetDto dto)
    {
        try
        {
            var asset = new Asset
            {
                Id = Guid.NewGuid(),
                AssetTag = dto.AssetTag,
                AssetName = dto.AssetName,
                CategoryId = dto.CategoryId,
                ModelId = dto.ModelId,
                Manufacturer = dto.Manufacturer,
                SerialNumber = dto.SerialNumber,
                Barcode = dto.Barcode,
                Description = dto.Description,
                PurchaseDate = dto.PurchaseDate,
                PurchasePrice = dto.PurchasePrice,
                Currency = dto.Currency,
                VendorId = dto.VendorId,
                InvoiceNumber = dto.InvoiceNumber,
                PoNumber = dto.PoNumber,
                WarrantyStartDate = dto.WarrantyStartDate,
                WarrantyEndDate = dto.WarrantyEndDate,
                Status = dto.Status,
                Condition = dto.Condition,
                LocationId = dto.LocationId,
                DepartmentId = dto.DepartmentId,
                UsefulLifeMonths = dto.UsefulLifeMonths,
                DepreciationMethod = dto.DepreciationMethod,
                SalvageValue = dto.SalvageValue,
                Notes = dto.Notes,
                ImageUrl = dto.ImageUrl
            };

            var created = await _assetRepository.CreateAssetAsync(asset);
            return Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpsertAssetDto dto)
    {
        var existing = await _assetRepository.GetAssetByIdAsync(id);
        if (existing == null) return NotFound(new { message = "Asset not found" });

        var asset = new Asset
        {
            Id = id,
            AssetTag = dto.AssetTag,
            AssetName = dto.AssetName,
            CategoryId = dto.CategoryId,
            ModelId = dto.ModelId,
            Manufacturer = dto.Manufacturer,
            SerialNumber = dto.SerialNumber,
            Barcode = dto.Barcode,
            Description = dto.Description,
            PurchaseDate = dto.PurchaseDate,
            PurchasePrice = dto.PurchasePrice,
            Currency = dto.Currency,
            VendorId = dto.VendorId,
            InvoiceNumber = dto.InvoiceNumber,
            PoNumber = dto.PoNumber,
            WarrantyStartDate = dto.WarrantyStartDate,
            WarrantyEndDate = dto.WarrantyEndDate,
            Status = dto.Status,
            Condition = dto.Condition,
            LocationId = dto.LocationId,
            DepartmentId = dto.DepartmentId,
            UsefulLifeMonths = dto.UsefulLifeMonths,
            DepreciationMethod = dto.DepreciationMethod,
            SalvageValue = dto.SalvageValue,
            Notes = dto.Notes,
            ImageUrl = dto.ImageUrl
        };

        var updated = await _assetRepository.UpdateAssetAsync(asset);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _assetRepository.DeleteAssetAsync(id);
        if (!success) return NotFound();
        return Ok(new { success = true, message = "Asset removed successfully." });
    }

    // 8. Lifecycle Actions
    [HttpPost("{id}/assign")]
    public async Task<IActionResult> Assign(Guid id, [FromBody] AssignAssetDto dto)
    {
        try
        {
            var actor = User.Identity?.Name ?? "HR Administrator";
            var assignment = await _assetRepository.AssignAssetAsync(id, dto, actor);
            return Ok(new { success = true, assignment });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = "Assignment Conflict", message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/transfer")]
    public async Task<IActionResult> Transfer(Guid id, [FromBody] TransferAssetDto dto)
    {
        try
        {
            var actor = User.Identity?.Name ?? "HR Administrator";
            var transfer = await _assetRepository.TransferAssetAsync(id, dto, actor);
            return Ok(new { success = true, transfer });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/return")]
    public async Task<IActionResult> Return(Guid id, [FromBody] ProcessReturnDto dto)
    {
        try
        {
            var actor = User.Identity?.Name ?? "Asset Inspector";
            var returnRecord = await _assetRepository.ReturnAssetAsync(id, dto, actor);
            return Ok(new { success = true, returnRecord });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/maintenance")]
    public async Task<IActionResult> ScheduleMaintenance(Guid id, [FromBody] ScheduleMaintenanceDto dto)
    {
        try
        {
            var maintenance = await _assetRepository.ScheduleMaintenanceAsync(id, dto);
            return Ok(new { success = true, maintenance });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("maintenance/{maintenanceId}/complete")]
    public async Task<IActionResult> CompleteMaintenance(Guid maintenanceId, [FromBody] ScheduleMaintenanceDto dto)
    {
        try
        {
            var record = await _assetRepository.CompleteMaintenanceAsync(maintenanceId, dto.Cost, dto.WorkPerformed);
            return Ok(new { success = true, record });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/incident")]
    public async Task<IActionResult> ReportIncident(Guid id, [FromBody] ReportIncidentDto dto)
    {
        try
        {
            var actor = User.Identity?.Name ?? "HR Admin";
            var incident = await _assetRepository.ReportIncidentAsync(id, dto, actor);
            return Ok(new { success = true, incident });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/dispose")]
    public async Task<IActionResult> Dispose(Guid id, [FromBody] DisposeAssetDto dto)
    {
        try
        {
            var actor = User.Identity?.Name ?? "Director of Operations";
            var disposal = await _assetRepository.DisposeAssetAsync(id, dto, actor);
            return Ok(new { success = true, disposal });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/qr")]
    public async Task<IActionResult> GetQrCode(Guid id)
    {
        var asset = await _assetRepository.GetAssetByIdAsync(id);
        if (asset == null) return NotFound();

        var payload = new
        {
            assetTag = asset.AssetTag,
            assetName = asset.AssetName,
            category = asset.CategoryName,
            serialNumber = asset.SerialNumber,
            verificationUrl = $"http://localhost:5174/admin/assets/{asset.Id}",
            generatedAt = DateTime.UtcNow
        };

        return Ok(payload);
    }

    [HttpPost("assignments/{assignmentId}/acknowledge")]
    public async Task<IActionResult> AcknowledgeAssignment(Guid assignmentId, [FromBody] DigitalHandoverAcknowledgementDto dto)
    {
        var success = await _assetRepository.AcknowledgeAssignmentAsync(assignmentId, dto);
        if (!success) return NotFound();
        return Ok(new { success = true, message = "Asset handover successfully acknowledged." });
    }
}
