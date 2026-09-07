using System;
using System.Collections.Generic;

namespace HRMS.Application.Features.Asset.DTOs;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));
    public bool HasNext => Page < TotalPages;
    public bool HasPrevious => Page > 1;
}

public class AssetFilterParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Status { get; set; }
    public string? Condition { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? EmployeeId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}

public class AssetDto
{
    public Guid Id { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryCode { get; set; } = string.Empty;
    public Guid? ModelId { get; set; }
    public string ModelName { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = "USD";
    public Guid? VendorId { get; set; }
    public string VendorName { get; set; } = string.Empty;
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime? WarrantyEndDate { get; set; }
    public string WarrantyStatus { get; set; } = "Active"; // Active, ExpiringSoon, Expired
    public string Status { get; set; } = "Available";
    public string Condition { get; set; } = "Good";
    public Guid? LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public Guid? CurrentCustodianEmployeeId { get; set; }
    public string CurrentCustodianName { get; set; } = string.Empty;
    public string CurrentCustodianEmail { get; set; } = string.Empty;
    public decimal CurrentBookValue { get; set; }
    public int UsefulLifeMonths { get; set; }
    public string DepreciationMethod { get; set; } = "StraightLine";
    public DateTime? LastAuditDate { get; set; }
    public DateTime? NextAuditDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AssetDetailDto : AssetDto
{
    public string Description { get; set; } = string.Empty;
    public string PoNumber { get; set; } = string.Empty;
    public DateTime? WarrantyStartDate { get; set; }
    public decimal SalvageValue { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;

    public List<AssetAssignmentDto> AssignmentHistory { get; set; } = new();
    public List<AssetTransferDto> TransferHistory { get; set; } = new();
    public List<AssetMaintenanceDto> MaintenanceHistory { get; set; } = new();
    public List<AssetReturnDto> ReturnHistory { get; set; } = new();
    public List<AssetWarrantyDto> Warranties { get; set; } = new();
    public List<AssetIncidentDto> Incidents { get; set; } = new();
    public List<AssetDepreciationDto> Depreciations { get; set; } = new();
    public List<AssetDocumentDto> Documents { get; set; } = new();
    public List<AssetAuditItemDto> AuditHistory { get; set; } = new();
}

public class UpsertAssetDto
{
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? ModelId { get; set; }
    public string Manufacturer { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; } = "USD";
    public Guid? VendorId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string PoNumber { get; set; } = string.Empty;
    public DateTime? WarrantyStartDate { get; set; }
    public DateTime? WarrantyEndDate { get; set; }
    public string Status { get; set; } = "Available";
    public string Condition { get; set; } = "Good";
    public Guid? LocationId { get; set; }
    public Guid? DepartmentId { get; set; }
    public int UsefulLifeMonths { get; set; } = 36;
    public string DepreciationMethod { get; set; } = "StraightLine";
    public decimal SalvageValue { get; set; } = 0;
    public string Notes { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class AssetCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string AssetType { get; set; } = "Hardware";
    public string DepreciationMethod { get; set; } = "StraightLine";
    public int UsefulLifeMonths { get; set; } = 36;
    public bool RequiresSerialNumber { get; set; } = true;
    public bool RequiresAssignment { get; set; } = true;
    public bool RequiresApproval { get; set; } = true;
    public bool IsActive { get; set; } = true;
    public int TotalAssetsCount { get; set; }
    public decimal TotalValue { get; set; }
}

public class AssetModelDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public string Specifications { get; set; } = string.Empty;
    public int WarrantyPeriodMonths { get; set; } = 36;
    public int DefaultUsefulLifeMonths { get; set; } = 36;
    public bool IsActive { get; set; } = true;
    public int AssetsCount { get; set; }
}

public class AssetLocationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string Building { get; set; } = string.Empty;
    public string Floor { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public string StorageArea { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int AssetsCount { get; set; }
}

public class AssetVendorDto
{
    public Guid Id { get; set; }
    public string VendorName { get; set; } = string.Empty;
    public string VendorCode { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string Notes { get; set; } = string.Empty;
    public int TotalAssetsSupplied { get; set; }
    public decimal TotalSpend { get; set; }
}

public class AssetAssignmentDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public Guid? LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public DateTime? ExpectedReturnDate { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    public string ConditionAtHandover { get; set; } = "Good";
    public string AccessoriesJson { get; set; } = "[]";
    public string HandoverNotes { get; set; } = string.Empty;
    public string AcknowledgementStatus { get; set; } = "Pending";
    public DateTime? AcknowledgementDate { get; set; }
    public string DigitalSignature { get; set; } = string.Empty;
    public string AssignedBy { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
}

public class AssignAssetDto
{
    public Guid EmployeeId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? LocationId { get; set; }
    public DateTime? ExpectedReturnDate { get; set; }
    public string ConditionAtHandover { get; set; } = "Good";
    public List<string> Accessories { get; set; } = new();
    public string HandoverNotes { get; set; } = string.Empty;
}

public class AssetTransferDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid? FromEmployeeId { get; set; }
    public string FromEmployeeName { get; set; } = string.Empty;
    public Guid? ToEmployeeId { get; set; }
    public string ToEmployeeName { get; set; } = string.Empty;
    public Guid? FromLocationId { get; set; }
    public string FromLocationName { get; set; } = string.Empty;
    public Guid? ToLocationId { get; set; }
    public string ToLocationName { get; set; } = string.Empty;
    public DateTime TransferDate { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public string InitiatedBy { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Condition { get; set; } = "Good";
    public string Status { get; set; } = "Received";
    public string Comments { get; set; } = string.Empty;
}

public class TransferAssetDto
{
    public Guid? ToEmployeeId { get; set; }
    public Guid? ToLocationId { get; set; }
    public Guid? ToDepartmentId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Condition { get; set; } = "Good";
    public string Comments { get; set; } = string.Empty;
}

public class AssetReturnDto
{
    public Guid Id { get; set; }
    public string ReturnNumber { get; set; } = string.Empty;
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime ReturnDate { get; set; }
    public string Condition { get; set; } = "Good";
    public string AccessoriesReturnedJson { get; set; } = "[]";
    public string MissingAccessoriesJson { get; set; } = "[]";
    public string DamageDetails { get; set; } = string.Empty;
    public decimal? DamageChargeAmount { get; set; }
    public string Status { get; set; } = "Completed";
    public string InspectionNotes { get; set; } = string.Empty;
    public string InspectedBy { get; set; } = string.Empty;
    public string ResultingAssetStatus { get; set; } = "Available";
}

public class ProcessReturnDto
{
    public string Condition { get; set; } = "Good";
    public List<string> AccessoriesReturned { get; set; } = new();
    public List<string> MissingAccessories { get; set; } = new();
    public string DamageDetails { get; set; } = string.Empty;
    public decimal? DamageChargeAmount { get; set; }
    public string InspectionNotes { get; set; } = string.Empty;
    public string ResultingAssetStatus { get; set; } = "Available"; // Available or UnderMaintenance
}

public class AssetMaintenanceDto
{
    public Guid Id { get; set; }
    public string MaintenanceNumber { get; set; } = string.Empty;
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string MaintenanceType { get; set; } = "Preventive";
    public string ServiceProvider { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string Issue { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string WorkPerformed { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public bool WarrantyCovered { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string TechnicianName { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed";
    public string Notes { get; set; } = string.Empty;
}

public class ScheduleMaintenanceDto
{
    public string MaintenanceType { get; set; } = "Preventive";
    public string ServiceProvider { get; set; } = string.Empty;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? CompletionDate { get; set; }
    public string Issue { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string WorkPerformed { get; set; } = string.Empty;
    public decimal Cost { get; set; } = 0;
    public bool WarrantyCovered { get; set; } = false;
    public string InvoiceNumber { get; set; } = string.Empty;
    public string TechnicianName { get; set; } = string.Empty;
    public string Status { get; set; } = "InProgress";
    public string Notes { get; set; } = string.Empty;
}

public class AssetWarrantyDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string WarrantyProvider { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string WarrantyType { get; set; } = "Manufacturer";
    public string CoverageDetails { get; set; } = string.Empty;
    public string ContractNumber { get; set; } = string.Empty;
    public string SupportPhone { get; set; } = string.Empty;
    public string SupportEmail { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public int DaysRemaining => (int)(EndDate - DateTime.UtcNow).TotalDays;
}

public class AssetAuditDto
{
    public Guid Id { get; set; }
    public string AuditCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public Guid? LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? AssignedAuditorEmployeeId { get; set; }
    public string AssignedAuditorName { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed";
    public int TotalAssetsCount { get; set; }
    public int VerifiedCount { get; set; }
    public int MissingCount { get; set; }
    public int DiscrepancyCount { get; set; }
    public string SummaryNotes { get; set; } = string.Empty;
    public List<AssetAuditItemDto> Items { get; set; } = new();
}

public class AssetAuditItemDto
{
    public Guid Id { get; set; }
    public Guid AuditId { get; set; }
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string ExpectedLocationName { get; set; } = string.Empty;
    public string ActualLocationName { get; set; } = string.Empty;
    public string ExpectedEmployeeName { get; set; } = string.Empty;
    public string ActualEmployeeName { get; set; } = string.Empty;
    public string ExpectedCondition { get; set; } = "Good";
    public string ActualCondition { get; set; } = "Good";
    public string Status { get; set; } = "Verified";
    public DateTime? VerificationDate { get; set; }
    public string VerifiedBy { get; set; } = string.Empty;
    public string DiscrepancyNotes { get; set; } = string.Empty;
    public bool ScannedViaQr { get; set; } = true;
}

public class VerifyAuditItemDto
{
    public Guid? ActualLocationId { get; set; }
    public Guid? ActualEmployeeId { get; set; }
    public string ActualCondition { get; set; } = "Good";
    public string Status { get; set; } = "Verified"; // Verified, Missing, Moved, Damaged, Mismatch
    public string DiscrepancyNotes { get; set; } = string.Empty;
    public bool ScannedViaQr { get; set; } = true;
}

public class AssetIncidentDto
{
    public Guid Id { get; set; }
    public string IncidentNumber { get; set; } = string.Empty;
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public Guid? EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string IncidentType { get; set; } = "Damage";
    public DateTime IncidentDate { get; set; }
    public DateTime ReportedDate { get; set; }
    public string Severity { get; set; } = "Medium";
    public decimal EstimatedLoss { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Resolution { get; set; } = string.Empty;
    public string Status { get; set; } = "Resolved";
    public string ResolvedBy { get; set; } = string.Empty;
}

public class ReportIncidentDto
{
    public Guid? EmployeeId { get; set; }
    public string IncidentType { get; set; } = "Damage";
    public DateTime IncidentDate { get; set; } = DateTime.UtcNow;
    public string Severity { get; set; } = "Medium";
    public decimal EstimatedLoss { get; set; } = 0;
    public string Description { get; set; } = string.Empty;
    public string Resolution { get; set; } = string.Empty;
    public string Status { get; set; } = "Reported";
}

public class AssetDisposalDto
{
    public Guid Id { get; set; }
    public string DisposalNumber { get; set; } = string.Empty;
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public DateTime DisposalDate { get; set; }
    public string DisposalReason { get; set; } = "Obsolete";
    public string DisposalMethod { get; set; } = "Recycling";
    public decimal SaleValue { get; set; }
    public string BuyerVendorName { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed";
    public string Notes { get; set; } = string.Empty;
}

public class DisposeAssetDto
{
    public DateTime DisposalDate { get; set; } = DateTime.UtcNow;
    public string DisposalReason { get; set; } = "Obsolete";
    public string DisposalMethod { get; set; } = "Recycling";
    public decimal SaleValue { get; set; } = 0;
    public string BuyerVendorName { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class AssetDepreciationDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public DateTime PeriodDate { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public string Method { get; set; } = "StraightLine";
    public decimal StartingBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal EndingBookValue { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
}

public class DepreciationScheduleRowDto
{
    public int PeriodNumber { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal BeginningValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    public decimal EndingValue { get; set; }
}

public class DepreciationCalculationResultDto
{
    public Guid AssetId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public decimal SalvageValue { get; set; }
    public int UsefulLifeMonths { get; set; }
    public string Method { get; set; } = "StraightLine";
    public decimal CurrentBookValue { get; set; }
    public decimal TotalDepreciated { get; set; }
    public decimal MonthlyDepreciation { get; set; }
    public decimal AnnualDepreciation { get; set; }
    public List<DepreciationScheduleRowDto> Schedule { get; set; } = new();
}

public class AssetDocumentDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public Guid? DocumentRecordId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string DocumentType { get; set; } = "Invoice";
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AssetRequestDto
{
    public Guid Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public Guid? ModelId { get; set; }
    public string ModelName { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public string Reason { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "PendingApproval";
    public Guid? ApprovalRequestId { get; set; }
    public string ApproverComments { get; set; } = string.Empty;
    public string ReviewedBy { get; set; } = string.Empty;
    public DateTime? ReviewedAt { get; set; }
    public Guid? FulfilledAssetId { get; set; }
    public string FulfilledAssetTag { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateAssetRequestDto
{
    public Guid CategoryId { get; set; }
    public Guid? ModelId { get; set; }
    public int Quantity { get; set; } = 1;
    public string Reason { get; set; } = string.Empty;
    public DateTime RequiredDate { get; set; }
    public string Priority { get; set; } = "Normal";
    public string Notes { get; set; } = string.Empty;
}

public class ProcessAssetRequestActionDto
{
    public string Action { get; set; } = "Approve"; // Approve, Reject
    public string Comments { get; set; } = string.Empty;
    public Guid? FulfillWithAssetId { get; set; }
}

public class DigitalHandoverAcknowledgementDto
{
    public string Signature { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public bool AcceptTerms { get; set; } = true;
}

public class BulkStatusUpdateDto
{
    public List<Guid> AssetIds { get; set; } = new();
    public string Status { get; set; } = "Available";
    public string Notes { get; set; } = string.Empty;
}

public class BulkTransferDto
{
    public List<Guid> AssetIds { get; set; } = new();
    public Guid? NewLocationId { get; set; }
    public Guid? NewCustodianEmployeeId { get; set; }
    public Guid? NewDepartmentId { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class ChartDataPointDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public string? Color { get; set; }
    public int? Count { get; set; }
}

public class AssetDashboardMetricsDto
{
    public int TotalAssets { get; set; }
    public decimal TotalAssetValue { get; set; }
    public int AvailableAssets { get; set; }
    public int AssignedAssets { get; set; }
    public int AssetsUnderMaintenance { get; set; }
    public int LostDamagedAssets { get; set; }
    public int RetiredAssets { get; set; }
    public int PendingAssetRequests { get; set; }
    public int ExpiringWarranties { get; set; }
    public int AssetsDueForReturn { get; set; }
    
    // 10 Detailed Charts
    public List<ChartDataPointDto> AssetsByCategory { get; set; } = new();
    public List<ChartDataPointDto> AssetsByStatus { get; set; } = new();
    public List<ChartDataPointDto> AssetsByDepartment { get; set; } = new();
    public List<ChartDataPointDto> AssetsByLocation { get; set; } = new();
    public List<ChartDataPointDto> AssetValueByCategory { get; set; } = new();
    public List<ChartDataPointDto> MonthlyAssignments { get; set; } = new();
    public List<ChartDataPointDto> MonthlyReturns { get; set; } = new();
    public List<ChartDataPointDto> MaintenanceCostTrend { get; set; } = new();
    public List<ChartDataPointDto> WarrantyExpiryTimeline { get; set; } = new();
    public List<ChartDataPointDto> AssetUtilization { get; set; } = new();
}

public class AssetInventorySummaryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int TotalStock { get; set; }
    public int Available { get; set; }
    public int Assigned { get; set; }
    public int Reserved { get; set; }
    public int Damaged { get; set; }
    public int Lost { get; set; }
    public int UnderMaintenance { get; set; }
    public decimal TotalValue { get; set; }
}

public class AssetReportFilterDto
{
    public string ReportType { get; set; } = "AssetRegister"; 
    // Types: AssetRegister, AssetAssignmentReport, EmployeeAssetStatement, AssetReturnReport,
    // AssetTransferReport, AssetMaintenanceReport, WarrantyExpiryReport, InventoryReport,
    // AssetUtilizationReport, DepreciationReport, LostDamagedAssetReport, DisposalReport,
    // AssetValueReport, DepartmentWiseReport, LocationWiseReport
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? LocationId { get; set; }
    public string? Status { get; set; }
}

public class AssetReportResultDto
{
    public string ReportTitle { get; set; } = string.Empty;
    public string GeneratedAt { get; set; } = string.Empty;
    public int TotalRecords { get; set; }
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object>> Rows { get; set; } = new();
    public Dictionary<string, decimal> SummaryMetrics { get; set; } = new();
}
