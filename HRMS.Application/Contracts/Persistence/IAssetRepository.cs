using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Application.Features.Asset.DTOs;
using HRMS.Domain.Entities.Asset;

namespace HRMS.Application.Contracts.Persistence;

public interface IAssetRepository
{
    // Asset Core CRUD & Search
    Task<PagedResult<AssetDto>> GetAssetsAsync(AssetFilterParams filters);
    Task<AssetDetailDto?> GetAssetByIdAsync(Guid id);
    Task<Asset> CreateAssetAsync(Asset asset);
    Task<Asset> UpdateAssetAsync(Asset asset);
    Task<bool> DeleteAssetAsync(Guid id);
    Task<bool> IsAssetTagUniqueAsync(string assetTag, Guid? excludeAssetId = null);

    // Lifecycle Operations
    Task<AssetAssignment> AssignAssetAsync(Guid assetId, AssignAssetDto dto, string assignedBy);
    Task<AssetTransfer> TransferAssetAsync(Guid assetId, TransferAssetDto dto, string initiatedBy);
    Task<AssetReturn> ReturnAssetAsync(Guid assetId, ProcessReturnDto dto, string processedBy);
    Task<AssetMaintenance> ScheduleMaintenanceAsync(Guid assetId, ScheduleMaintenanceDto dto);
    Task<AssetMaintenance> CompleteMaintenanceAsync(Guid maintenanceId, decimal actualCost, string workPerformed);
    Task<AssetIncident> ReportIncidentAsync(Guid assetId, ReportIncidentDto dto, string reportedBy);
    Task<AssetDisposal> DisposeAssetAsync(Guid assetId, DisposeAssetDto dto, string approvedBy);
    Task<bool> AcknowledgeAssignmentAsync(Guid assignmentId, DigitalHandoverAcknowledgementDto dto);

    // Bulk Operations
    Task<int> BulkUpdateStatusAsync(BulkStatusUpdateDto dto, string updatedBy);
    Task<int> BulkTransferAsync(BulkTransferDto dto, string initiatedBy);

    // Lookups & Taxonomy
    Task<List<AssetCategoryDto>> GetCategoriesAsync();
    Task<AssetCategory> CreateCategoryAsync(AssetCategory category);
    Task<List<AssetModelDto>> GetModelsAsync(Guid? categoryId = null);
    Task<AssetModel> CreateModelAsync(AssetModel model);
    Task<List<AssetLocationDto>> GetLocationsAsync();
    Task<AssetLocation> CreateLocationAsync(AssetLocation location);
    Task<List<AssetVendorDto>> GetVendorsAsync();
    Task<AssetVendor> CreateVendorAsync(AssetVendor vendor);
    Task<List<AssetWarrantyDto>> GetExpiringWarrantiesAsync(int daysAhead = 30);

    // Audits
    Task<List<AssetAuditDto>> GetAuditsAsync();
    Task<AssetAuditDto?> GetAuditByIdAsync(Guid id);
    Task<AssetAudit> CreateAuditAsync(AssetAudit audit);
    Task<bool> VerifyAuditItemAsync(Guid auditItemId, VerifyAuditItemDto dto, string verifiedBy);

    // Requests & Approvals
    Task<PagedResult<AssetRequestDto>> GetAssetRequestsAsync(int page = 1, int pageSize = 10, string? status = null, Guid? employeeId = null);
    Task<AssetRequestDto?> GetAssetRequestByIdAsync(Guid id);
    Task<AssetRequest> CreateAssetRequestAsync(AssetRequest request);
    Task<bool> ProcessAssetRequestActionAsync(Guid requestId, ProcessAssetRequestActionDto dto, string actorName);

    // Self-Service & Manager
    Task<List<AssetDto>> GetEmployeeAssetsAsync(Guid employeeId);
    Task<List<AssetDto>> GetTeamAssetsAsync(Guid managerId);

    // Analytics, Reports, Inventory, Depreciation
    Task<AssetDashboardMetricsDto> GetDashboardMetricsAsync(Guid? companyId = null, Guid? branchId = null, Guid? departmentId = null);
    Task<List<AssetInventorySummaryDto>> GetInventorySummaryAsync();
    Task<DepreciationCalculationResultDto> CalculateDepreciationAsync(Guid assetId);
    Task<AssetReportResultDto> GenerateReportAsync(AssetReportFilterDto filter);

    Task<bool> SaveChangesAsync();
}
