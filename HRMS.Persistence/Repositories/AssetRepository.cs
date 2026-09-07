using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Contracts.Persistence;
using HRMS.Application.Contracts.Tenant;
using HRMS.Application.Features.Asset.DTOs;
using HRMS.Domain.Entities.Asset;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Workflow;

namespace HRMS.Persistence.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly HrmsDbContext _context;
    private readonly ITenantContext _tenantContext;

    public AssetRepository(HrmsDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    private Guid GetEffectiveTenantId()
    {
        if (_tenantContext.CurrentTenantId.HasValue && _tenantContext.CurrentTenantId.Value != Guid.Empty)
            return _tenantContext.CurrentTenantId.Value;
        
        // Fallback to first existing tenant in context for dev/demo simplicity
        var firstTenant = _context.Tenants.FirstOrDefault(t => !t.IsDeleted);
        return firstTenant?.Id ?? Guid.Parse("11111111-1111-1111-1111-111111111111");
    }

    // ==========================================
    // 1. ASSET CRUD & SEARCH
    // ==========================================
    public async Task<PagedResult<AssetDto>> GetAssetsAsync(AssetFilterParams filters)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.Assets
            .AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Model)
            .Include(a => a.Vendor)
            .Include(a => a.Location)
            .Include(a => a.Department)
            .Include(a => a.CurrentCustodianEmployee)
            .Where(a => a.TenantId == tenantId && !a.IsDeleted);

        // Search
        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var search = filters.Search.Trim().ToLower();
            query = query.Where(a => 
                a.AssetTag.ToLower().Contains(search) ||
                a.AssetName.ToLower().Contains(search) ||
                a.SerialNumber.ToLower().Contains(search) ||
                (a.CurrentCustodianEmployee != null && (a.CurrentCustodianEmployee.FirstName + " " + a.CurrentCustodianEmployee.LastName).ToLower().Contains(search)) ||
                (a.Category != null && a.Category.Name.ToLower().Contains(search)) ||
                (a.Location != null && a.Location.Name.ToLower().Contains(search))
            );
        }

        // Filters
        if (filters.CategoryId.HasValue) query = query.Where(a => a.CategoryId == filters.CategoryId.Value);
        if (!string.IsNullOrWhiteSpace(filters.Status) && filters.Status != "All") query = query.Where(a => a.Status == filters.Status);
        if (!string.IsNullOrWhiteSpace(filters.Condition) && filters.Condition != "All") query = query.Where(a => a.Condition == filters.Condition);
        if (filters.LocationId.HasValue) query = query.Where(a => a.LocationId == filters.LocationId.Value);
        if (filters.DepartmentId.HasValue) query = query.Where(a => a.DepartmentId == filters.DepartmentId.Value);
        if (filters.EmployeeId.HasValue) query = query.Where(a => a.CurrentCustodianEmployeeId == filters.EmployeeId.Value);
        if (filters.MinPrice.HasValue) query = query.Where(a => a.PurchasePrice >= filters.MinPrice.Value);
        if (filters.MaxPrice.HasValue) query = query.Where(a => a.PurchasePrice <= filters.MaxPrice.Value);

        // Sorting
        query = (filters.SortBy?.ToLower(), filters.SortDirection?.ToLower()) switch
        {
            ("assettag", "asc") => query.OrderBy(a => a.AssetTag),
            ("assettag", "desc") => query.OrderByDescending(a => a.AssetTag),
            ("assetname", "asc") => query.OrderBy(a => a.AssetName),
            ("assetname", "desc") => query.OrderByDescending(a => a.AssetName),
            ("purchasedate", "asc") => query.OrderBy(a => a.PurchaseDate),
            ("purchasedate", "desc") => query.OrderByDescending(a => a.PurchaseDate),
            ("purchaseprice", "asc") => query.OrderBy(a => a.PurchasePrice),
            ("purchaseprice", "desc") => query.OrderByDescending(a => a.PurchasePrice),
            ("status", "asc") => query.OrderBy(a => a.Status),
            ("status", "desc") => query.OrderByDescending(a => a.Status),
            _ => query.OrderByDescending(a => a.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                CategoryId = a.CategoryId,
                CategoryName = a.Category != null ? a.Category.Name : string.Empty,
                CategoryCode = a.Category != null ? a.Category.Code : string.Empty,
                ModelId = a.ModelId,
                ModelName = a.Model != null ? a.Model.ModelName : string.Empty,
                Manufacturer = a.Manufacturer,
                SerialNumber = a.SerialNumber,
                Barcode = a.Barcode,
                QrCode = a.QrCode,
                PurchaseDate = a.PurchaseDate,
                PurchasePrice = a.PurchasePrice,
                Currency = a.Currency,
                VendorId = a.VendorId,
                VendorName = a.Vendor != null ? a.Vendor.VendorName : string.Empty,
                InvoiceNumber = a.InvoiceNumber,
                WarrantyEndDate = a.WarrantyEndDate,
                WarrantyStatus = a.WarrantyEndDate.HasValue && a.WarrantyEndDate.Value < DateTime.UtcNow ? "Expired" :
                                 a.WarrantyEndDate.HasValue && a.WarrantyEndDate.Value < DateTime.UtcNow.AddDays(30) ? "ExpiringSoon" : "Active",
                Status = a.Status,
                Condition = a.Condition,
                LocationId = a.LocationId,
                LocationName = a.Location != null ? a.Location.Name : string.Empty,
                DepartmentId = a.DepartmentId,
                DepartmentName = a.Department != null ? a.Department.Name : string.Empty,
                CurrentCustodianEmployeeId = a.CurrentCustodianEmployeeId,
                CurrentCustodianName = a.CurrentCustodianEmployee != null ? (a.CurrentCustodianEmployee.FirstName + " " + a.CurrentCustodianEmployee.LastName) : string.Empty,
                CurrentCustodianEmail = a.CurrentCustodianEmployee != null ? a.CurrentCustodianEmployee.Email : string.Empty,
                CurrentBookValue = a.CurrentBookValue,
                UsefulLifeMonths = a.UsefulLifeMonths,
                DepreciationMethod = a.DepreciationMethod,
                LastAuditDate = a.LastAuditDate,
                NextAuditDate = a.NextAuditDate,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<AssetDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filters.Page,
            PageSize = filters.PageSize
        };
    }

    public async Task<AssetDetailDto?> GetAssetByIdAsync(Guid id)
    {
        var tenantId = GetEffectiveTenantId();
        var a = await _context.Assets
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Model)
            .Include(x => x.Vendor)
            .Include(x => x.Location)
            .Include(x => x.Department)
            .Include(x => x.CurrentCustodianEmployee)
            .Include(x => x.Assignments).ThenInclude(asg => asg.Employee)
            .Include(x => x.Transfers).ThenInclude(t => t.FromEmployee)
            .Include(x => x.Transfers).ThenInclude(t => t.ToEmployee)
            .Include(x => x.Transfers).ThenInclude(t => t.FromLocation)
            .Include(x => x.Transfers).ThenInclude(t => t.ToLocation)
            .Include(x => x.MaintenanceRecords)
            .Include(x => x.Returns).ThenInclude(r => r.Employee)
            .Include(x => x.Warranties)
            .Include(x => x.Incidents).ThenInclude(inc => inc.Employee)
            .Include(x => x.Depreciations)
            .Include(x => x.Documents)
            .FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId && !x.IsDeleted);

        if (a == null) return null;

        var detail = new AssetDetailDto
        {
            Id = a.Id,
            AssetTag = a.AssetTag,
            AssetName = a.AssetName,
            CategoryId = a.CategoryId,
            CategoryName = a.Category?.Name ?? string.Empty,
            CategoryCode = a.Category?.Code ?? string.Empty,
            ModelId = a.ModelId,
            ModelName = a.Model?.ModelName ?? string.Empty,
            Manufacturer = a.Manufacturer,
            SerialNumber = a.SerialNumber,
            Barcode = a.Barcode,
            QrCode = a.QrCode,
            Description = a.Description,
            PurchaseDate = a.PurchaseDate,
            PurchasePrice = a.PurchasePrice,
            Currency = a.Currency,
            VendorId = a.VendorId,
            VendorName = a.Vendor?.VendorName ?? string.Empty,
            InvoiceNumber = a.InvoiceNumber,
            PoNumber = a.PoNumber,
            WarrantyStartDate = a.WarrantyStartDate,
            WarrantyEndDate = a.WarrantyEndDate,
            WarrantyStatus = a.WarrantyEndDate.HasValue && a.WarrantyEndDate.Value < DateTime.UtcNow ? "Expired" :
                             a.WarrantyEndDate.HasValue && a.WarrantyEndDate.Value < DateTime.UtcNow.AddDays(30) ? "ExpiringSoon" : "Active",
            Status = a.Status,
            Condition = a.Condition,
            LocationId = a.LocationId,
            LocationName = a.Location?.Name ?? string.Empty,
            DepartmentId = a.DepartmentId,
            DepartmentName = a.Department?.Name ?? string.Empty,
            CurrentCustodianEmployeeId = a.CurrentCustodianEmployeeId,
            CurrentCustodianName = a.CurrentCustodianEmployee != null ? $"{a.CurrentCustodianEmployee.FirstName} {a.CurrentCustodianEmployee.LastName}" : string.Empty,
            CurrentCustodianEmail = a.CurrentCustodianEmployee?.Email ?? string.Empty,
            UsefulLifeMonths = a.UsefulLifeMonths,
            DepreciationMethod = a.DepreciationMethod,
            SalvageValue = a.SalvageValue,
            CurrentBookValue = a.CurrentBookValue,
            LastAuditDate = a.LastAuditDate,
            NextAuditDate = a.NextAuditDate,
            Notes = a.Notes,
            ImageUrl = a.ImageUrl,
            CreatedAt = a.CreatedAt,

            AssignmentHistory = a.Assignments.OrderByDescending(x => x.AssignedDate).Select(x => new AssetAssignmentDto
            {
                Id = x.Id,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                EmployeeId = x.EmployeeId,
                EmployeeName = x.Employee != null ? $"{x.Employee.FirstName} {x.Employee.LastName}" : "Employee",
                EmployeeEmail = x.Employee?.Email ?? string.Empty,
                AssignedDate = x.AssignedDate,
                ExpectedReturnDate = x.ExpectedReturnDate,
                ActualReturnDate = x.ActualReturnDate,
                ConditionAtHandover = x.ConditionAtHandover,
                AccessoriesJson = x.AccessoriesJson,
                HandoverNotes = x.HandoverNotes,
                AcknowledgementStatus = x.AcknowledgementStatus,
                AcknowledgementDate = x.AcknowledgementDate,
                DigitalSignature = x.DigitalSignature,
                AssignedBy = x.AssignedBy,
                Status = x.Status
            }).ToList(),

            TransferHistory = a.Transfers.OrderByDescending(x => x.TransferDate).Select(x => new AssetTransferDto
            {
                Id = x.Id,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                FromEmployeeId = x.FromEmployeeId,
                FromEmployeeName = x.FromEmployee != null ? $"{x.FromEmployee.FirstName} {x.FromEmployee.LastName}" : "Unassigned",
                ToEmployeeId = x.ToEmployeeId,
                ToEmployeeName = x.ToEmployee != null ? $"{x.ToEmployee.FirstName} {x.ToEmployee.LastName}" : "Unassigned",
                FromLocationId = x.FromLocationId,
                FromLocationName = x.FromLocation?.Name ?? "Main Facility",
                ToLocationId = x.ToLocationId,
                ToLocationName = x.ToLocation?.Name ?? "New Facility",
                TransferDate = x.TransferDate,
                ReceivedDate = x.ReceivedDate,
                InitiatedBy = x.InitiatedBy,
                ApprovedBy = x.ApprovedBy,
                Reason = x.Reason,
                Condition = x.Condition,
                Status = x.Status,
                Comments = x.Comments
            }).ToList(),

            MaintenanceHistory = a.MaintenanceRecords.OrderByDescending(x => x.StartDate).Select(x => new AssetMaintenanceDto
            {
                Id = x.Id,
                MaintenanceNumber = x.MaintenanceNumber,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                MaintenanceType = x.MaintenanceType,
                ServiceProvider = x.ServiceProvider,
                StartDate = x.StartDate,
                CompletionDate = x.CompletionDate,
                Issue = x.Issue,
                Diagnosis = x.Diagnosis,
                WorkPerformed = x.WorkPerformed,
                Cost = x.Cost,
                WarrantyCovered = x.WarrantyCovered,
                InvoiceNumber = x.InvoiceNumber,
                TechnicianName = x.TechnicianName,
                Status = x.Status,
                Notes = x.Notes
            }).ToList(),

            ReturnHistory = a.Returns.OrderByDescending(x => x.ReturnDate).Select(x => new AssetReturnDto
            {
                Id = x.Id,
                ReturnNumber = x.ReturnNumber,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                EmployeeId = x.EmployeeId,
                EmployeeName = x.Employee != null ? $"{x.Employee.FirstName} {x.Employee.LastName}" : "Employee",
                ReturnDate = x.ReturnDate,
                Condition = x.Condition,
                AccessoriesReturnedJson = x.AccessoriesReturnedJson,
                MissingAccessoriesJson = x.MissingAccessoriesJson,
                DamageDetails = x.DamageDetails,
                DamageChargeAmount = x.DamageChargeAmount,
                Status = x.Status,
                InspectionNotes = x.InspectionNotes,
                InspectedBy = x.InspectedBy,
                ResultingAssetStatus = x.ResultingAssetStatus
            }).ToList(),

            Warranties = a.Warranties.OrderByDescending(x => x.EndDate).Select(x => new AssetWarrantyDto
            {
                Id = x.Id,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                WarrantyProvider = x.WarrantyProvider,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                WarrantyType = x.WarrantyType,
                CoverageDetails = x.CoverageDetails,
                ContractNumber = x.ContractNumber,
                SupportPhone = x.SupportPhone,
                SupportEmail = x.SupportEmail,
                Status = x.Status
            }).ToList(),

            Incidents = a.Incidents.OrderByDescending(x => x.IncidentDate).Select(x => new AssetIncidentDto
            {
                Id = x.Id,
                IncidentNumber = x.IncidentNumber,
                AssetId = x.AssetId,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                EmployeeId = x.EmployeeId,
                EmployeeName = x.Employee != null ? $"{x.Employee.FirstName} {x.Employee.LastName}" : "Unknown",
                IncidentType = x.IncidentType,
                IncidentDate = x.IncidentDate,
                ReportedDate = x.ReportedDate,
                Severity = x.Severity,
                EstimatedLoss = x.EstimatedLoss,
                Description = x.Description,
                Resolution = x.Resolution,
                Status = x.Status,
                ResolvedBy = x.ResolvedBy
            }).ToList(),

            Depreciations = a.Depreciations.OrderBy(x => x.PeriodDate).Select(x => new AssetDepreciationDto
            {
                Id = x.Id,
                AssetId = x.AssetId,
                PeriodDate = x.PeriodDate,
                Year = x.Year,
                Month = x.Month,
                Method = x.Method,
                StartingBookValue = x.StartingBookValue,
                DepreciationAmount = x.DepreciationAmount,
                EndingBookValue = x.EndingBookValue,
                AccumulatedDepreciation = x.AccumulatedDepreciation
            }).ToList(),

            Documents = a.Documents.OrderByDescending(x => x.CreatedAt).Select(x => new AssetDocumentDto
            {
                Id = x.Id,
                AssetId = x.AssetId,
                DocumentRecordId = x.DocumentRecordId,
                Title = x.Title,
                DocumentType = x.DocumentType,
                FileName = x.FileName,
                FileUrl = x.FileUrl,
                FileSizeBytes = x.FileSizeBytes,
                CreatedAt = x.CreatedAt
            }).ToList()
        };

        return detail;
    }

    public async Task<Asset> CreateAssetAsync(Asset asset)
    {
        var tenantId = GetEffectiveTenantId();
        asset.TenantId = tenantId;
        
        // Ensure Tag uniqueness
        if (string.IsNullOrWhiteSpace(asset.AssetTag))
        {
            var count = await _context.Assets.CountAsync(a => a.TenantId == tenantId) + 1;
            asset.AssetTag = $"AST-2026-{count:D5}";
        }
        else if (!await IsAssetTagUniqueAsync(asset.AssetTag))
        {
            throw new InvalidOperationException($"Asset tag '{asset.AssetTag}' is already in use for this organization.");
        }

        if (string.IsNullOrWhiteSpace(asset.Barcode))
            asset.Barcode = asset.AssetTag;
        if (string.IsNullOrWhiteSpace(asset.QrCode))
            asset.QrCode = $"https://hrms.enterprise.internal/assets/verify/{asset.AssetTag}";

        if (asset.CurrentBookValue == 0)
            asset.CurrentBookValue = asset.PurchasePrice;

        asset.CreatedAt = DateTime.UtcNow;
        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();
        return asset;
    }

    public async Task<Asset> UpdateAssetAsync(Asset asset)
    {
        asset.UpdatedAt = DateTime.UtcNow;
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
        return asset;
    }

    public async Task<bool> DeleteAssetAsync(Guid id)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == id && a.TenantId == tenantId);
        if (asset == null) return false;

        asset.IsDeleted = true;
        asset.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsAssetTagUniqueAsync(string assetTag, Guid? excludeAssetId = null)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.Assets.Where(a => a.TenantId == tenantId && a.AssetTag == assetTag && !a.IsDeleted);
        if (excludeAssetId.HasValue) query = query.Where(a => a.Id != excludeAssetId.Value);
        return !await query.AnyAsync();
    }

    // ==========================================
    // 2. LIFECYCLE OPERATIONS
    // ==========================================
    public async Task<AssetAssignment> AssignAssetAsync(Guid assetId, AssignAssetDto dto, string assignedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        // Transaction & Concurrency validation: Never allow assigning an asset that is already assigned, maintenance, lost, or disposed
        if (asset.Status == "Assigned")
            throw new InvalidOperationException($"Conflict: Asset '{asset.AssetTag}' is already assigned to another employee. Please return or transfer it first.");
        if (asset.Status is "UnderMaintenance" or "Lost" or "Damaged" or "Retired" or "Disposed")
            throw new InvalidOperationException($"Cannot assign asset '{asset.AssetTag}' because its current status is '{asset.Status}'.");

        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == dto.EmployeeId && !e.IsDeleted);
        if (employee == null)
            throw new KeyNotFoundException($"Employee with ID '{dto.EmployeeId}' was not found.");

        var assignment = new AssetAssignment
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetId = asset.Id,
            EmployeeId = dto.EmployeeId,
            DepartmentId = dto.DepartmentId ?? employee.DepartmentId,
            LocationId = dto.LocationId ?? asset.LocationId,
            AssignedDate = DateTime.UtcNow,
            ExpectedReturnDate = dto.ExpectedReturnDate,
            ConditionAtHandover = dto.ConditionAtHandover,
            AccessoriesJson = JsonSerializer.Serialize(dto.Accessories ?? new List<string>()),
            HandoverNotes = dto.HandoverNotes,
            AcknowledgementStatus = "Pending",
            AssignedBy = assignedBy,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        // Update Asset
        asset.Status = "Assigned";
        asset.CurrentCustodianEmployeeId = dto.EmployeeId;
        asset.DepartmentId = assignment.DepartmentId;
        asset.LocationId = assignment.LocationId;
        asset.Condition = dto.ConditionAtHandover;
        asset.UpdatedAt = DateTime.UtcNow;

        _context.AssetAssignments.Add(assignment);
        _context.Assets.Update(asset);

        // Queue in Notification System
        _context.NotificationQueues.Add(new HRMS.Domain.Entities.Notification.NotificationQueue
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            UserId = employee.Id,
            Channel = "InApp",
            Payload = JsonSerializer.Serialize(new
            {
                subject = $"Asset Handover: {asset.AssetName} ({asset.AssetTag}) Assigned to You",
                body = $"Hello {employee.FirstName}, you have been assigned {asset.AssetName} (Tag: {asset.AssetTag}). Please log in to your Self-Service portal to review condition and digitally acknowledge receipt.",
                recipient = employee.Email
            }),
            Status = "Queued",
            RetryCount = 0
        });

        await _context.SaveChangesAsync();
        return assignment;
    }

    public async Task<AssetTransfer> TransferAssetAsync(Guid assetId, TransferAssetDto dto, string initiatedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        if (asset.Status is "Disposed" or "Retired" or "Lost")
            throw new InvalidOperationException($"Cannot transfer asset with status '{asset.Status}'.");

        var transfer = new AssetTransfer
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            AssetId = asset.Id,
            FromEmployeeId = asset.CurrentCustodianEmployeeId,
            ToEmployeeId = dto.ToEmployeeId,
            FromLocationId = asset.LocationId,
            ToLocationId = dto.ToLocationId ?? asset.LocationId,
            FromDepartmentId = asset.DepartmentId,
            ToDepartmentId = dto.ToDepartmentId ?? asset.DepartmentId,
            TransferDate = DateTime.UtcNow,
            ReceivedDate = DateTime.UtcNow,
            InitiatedBy = initiatedBy,
            ApprovedBy = initiatedBy,
            Reason = dto.Reason,
            Condition = dto.Condition,
            Status = "Received",
            Comments = dto.Comments,
            CreatedAt = DateTime.UtcNow
        };

        // Close previous assignment if exists
        var activeAssignment = await _context.AssetAssignments
            .FirstOrDefaultAsync(x => x.AssetId == assetId && x.Status == "Active");
        if (activeAssignment != null)
        {
            activeAssignment.Status = "Transferred";
            activeAssignment.ActualReturnDate = DateTime.UtcNow;
            _context.AssetAssignments.Update(activeAssignment);
        }

        // Update Asset
        asset.CurrentCustodianEmployeeId = dto.ToEmployeeId;
        if (dto.ToLocationId.HasValue) asset.LocationId = dto.ToLocationId.Value;
        if (dto.ToDepartmentId.HasValue) asset.DepartmentId = dto.ToDepartmentId.Value;
        asset.Condition = dto.Condition;
        asset.Status = dto.ToEmployeeId.HasValue ? "Assigned" : "Available";
        asset.UpdatedAt = DateTime.UtcNow;

        // If transferred to new employee, create new active assignment
        if (dto.ToEmployeeId.HasValue)
        {
            _context.AssetAssignments.Add(new AssetAssignment
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                AssetId = asset.Id,
                EmployeeId = dto.ToEmployeeId.Value,
                DepartmentId = asset.DepartmentId,
                LocationId = asset.LocationId,
                AssignedDate = DateTime.UtcNow,
                ConditionAtHandover = dto.Condition,
                AcknowledgementStatus = "Pending",
                AssignedBy = initiatedBy,
                Status = "Active"
            });
        }

        _context.AssetTransfers.Add(transfer);
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
        return transfer;
    }

    public async Task<AssetReturn> ReturnAssetAsync(Guid assetId, ProcessReturnDto dto, string processedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        var count = await _context.AssetReturns.CountAsync(r => r.TenantId == tenantId) + 1;
        var returnRecord = new AssetReturn
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            ReturnNumber = $"RET-2026-{count:D4}",
            AssetId = asset.Id,
            EmployeeId = asset.CurrentCustodianEmployeeId ?? Guid.Empty,
            ReturnDate = DateTime.UtcNow,
            Condition = dto.Condition,
            AccessoriesReturnedJson = JsonSerializer.Serialize(dto.AccessoriesReturned ?? new List<string>()),
            MissingAccessoriesJson = JsonSerializer.Serialize(dto.MissingAccessories ?? new List<string>()),
            DamageDetails = dto.DamageDetails,
            DamageChargeAmount = dto.DamageChargeAmount,
            Status = "Completed",
            InspectionNotes = dto.InspectionNotes,
            InspectedBy = processedBy,
            InspectedAt = DateTime.UtcNow,
            ProcessedBy = processedBy,
            ResultingAssetStatus = dto.ResultingAssetStatus,
            CreatedAt = DateTime.UtcNow
        };

        // Close current active assignment
        var activeAssignment = await _context.AssetAssignments
            .FirstOrDefaultAsync(x => x.AssetId == assetId && x.Status == "Active");
        if (activeAssignment != null)
        {
            activeAssignment.Status = "Returned";
            activeAssignment.ActualReturnDate = DateTime.UtcNow;
            _context.AssetAssignments.Update(activeAssignment);
        }

        // Update Asset
        asset.Status = dto.ResultingAssetStatus; // Usually "Available" or "UnderMaintenance"
        asset.CurrentCustodianEmployeeId = null;
        asset.Condition = dto.Condition;
        asset.UpdatedAt = DateTime.UtcNow;

        _context.AssetReturns.Add(returnRecord);
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
        return returnRecord;
    }

    public async Task<AssetMaintenance> ScheduleMaintenanceAsync(Guid assetId, ScheduleMaintenanceDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        var count = await _context.AssetMaintenances.CountAsync(m => m.TenantId == tenantId) + 1;
        var maintenance = new AssetMaintenance
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            MaintenanceNumber = $"MNT-2026-{count:D4}",
            AssetId = asset.Id,
            MaintenanceType = dto.MaintenanceType,
            ServiceProvider = dto.ServiceProvider,
            StartDate = dto.StartDate,
            CompletionDate = dto.CompletionDate,
            Issue = dto.Issue,
            Diagnosis = dto.Diagnosis,
            WorkPerformed = dto.WorkPerformed,
            Cost = dto.Cost,
            WarrantyCovered = dto.WarrantyCovered,
            InvoiceNumber = dto.InvoiceNumber,
            TechnicianName = dto.TechnicianName,
            Status = dto.Status,
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.Status == "InProgress")
        {
            asset.Status = "UnderMaintenance";
            asset.UpdatedAt = DateTime.UtcNow;
            _context.Assets.Update(asset);
        }

        _context.AssetMaintenances.Add(maintenance);
        await _context.SaveChangesAsync();
        return maintenance;
    }

    public async Task<AssetMaintenance> CompleteMaintenanceAsync(Guid maintenanceId, decimal actualCost, string workPerformed)
    {
        var tenantId = GetEffectiveTenantId();
        var record = await _context.AssetMaintenances
            .Include(m => m.Asset)
            .FirstOrDefaultAsync(m => m.Id == maintenanceId && m.TenantId == tenantId);
        
        if (record == null)
            throw new KeyNotFoundException($"Maintenance record '{maintenanceId}' was not found.");

        record.Status = "Completed";
        record.CompletionDate = DateTime.UtcNow;
        record.Cost = actualCost;
        record.WorkPerformed = workPerformed;
        record.UpdatedAt = DateTime.UtcNow;

        if (record.Asset != null && record.Asset.Status == "UnderMaintenance")
        {
            record.Asset.Status = record.Asset.CurrentCustodianEmployeeId.HasValue ? "Assigned" : "Available";
            record.Asset.Condition = "Good";
            record.Asset.UpdatedAt = DateTime.UtcNow;
            _context.Assets.Update(record.Asset);
        }

        _context.AssetMaintenances.Update(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<AssetIncident> ReportIncidentAsync(Guid assetId, ReportIncidentDto dto, string reportedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        var count = await _context.AssetIncidents.CountAsync(i => i.TenantId == tenantId) + 1;
        var incident = new AssetIncident
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            IncidentNumber = $"INC-2026-{count:D4}",
            AssetId = asset.Id,
            EmployeeId = dto.EmployeeId ?? asset.CurrentCustodianEmployeeId,
            IncidentType = dto.IncidentType,
            IncidentDate = dto.IncidentDate,
            ReportedDate = DateTime.UtcNow,
            Severity = dto.Severity,
            EstimatedLoss = dto.EstimatedLoss,
            Description = dto.Description,
            Resolution = dto.Resolution,
            Status = dto.Status,
            ResolvedBy = reportedBy,
            CreatedAt = DateTime.UtcNow
        };

        // Update asset status based on incident type
        if (dto.IncidentType is "Lost" or "Theft")
        {
            asset.Status = "Lost";
            asset.CurrentCustodianEmployeeId = null;
        }
        else if (dto.IncidentType is "Damage" && dto.Severity is "High" or "Critical")
        {
            asset.Status = "Damaged";
            asset.Condition = "Damaged";
        }
        asset.UpdatedAt = DateTime.UtcNow;

        _context.AssetIncidents.Add(incident);
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
        return incident;
    }

    public async Task<AssetDisposal> DisposeAssetAsync(Guid assetId, DisposeAssetDto dto, string approvedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset with ID '{assetId}' was not found.");

        var count = await _context.AssetDisposals.CountAsync(d => d.TenantId == tenantId) + 1;
        var disposal = new AssetDisposal
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            DisposalNumber = $"DSP-2026-{count:D4}",
            AssetId = asset.Id,
            DisposalDate = dto.DisposalDate,
            DisposalReason = dto.DisposalReason,
            DisposalMethod = dto.DisposalMethod,
            SaleValue = dto.SaleValue,
            BuyerVendorName = dto.BuyerVendorName,
            ApprovedBy = approvedBy,
            ApprovalDate = DateTime.UtcNow,
            Status = "Completed",
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        // Close any assignment
        var activeAssignment = await _context.AssetAssignments
            .FirstOrDefaultAsync(x => x.AssetId == assetId && x.Status == "Active");
        if (activeAssignment != null)
        {
            activeAssignment.Status = "Returned";
            activeAssignment.ActualReturnDate = DateTime.UtcNow;
            _context.AssetAssignments.Update(activeAssignment);
        }

        // Strictly mark Disposed
        asset.Status = "Disposed";
        asset.CurrentCustodianEmployeeId = null;
        asset.CurrentBookValue = dto.SaleValue;
        asset.UpdatedAt = DateTime.UtcNow;

        _context.AssetDisposals.Add(disposal);
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();
        return disposal;
    }

    public async Task<bool> AcknowledgeAssignmentAsync(Guid assignmentId, DigitalHandoverAcknowledgementDto dto)
    {
        var tenantId = GetEffectiveTenantId();
        var assignment = await _context.AssetAssignments.FirstOrDefaultAsync(x => x.Id == assignmentId && x.TenantId == tenantId);
        if (assignment == null) return false;

        assignment.AcknowledgementStatus = "Acknowledged";
        assignment.AcknowledgementDate = DateTime.UtcNow;
        assignment.DigitalSignature = dto.Signature;
        assignment.AcknowledgedComments = dto.Comments;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 3. BULK OPERATIONS
    // ==========================================
    public async Task<int> BulkUpdateStatusAsync(BulkStatusUpdateDto dto, string updatedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var assets = await _context.Assets
            .Where(a => dto.AssetIds.Contains(a.Id) && a.TenantId == tenantId && !a.IsDeleted)
            .ToListAsync();

        foreach (var a in assets)
        {
            // Do not alter Disposed assets
            if (a.Status == "Disposed") continue;

            a.Status = dto.Status;
            if (dto.Status is "Available" or "Retired" or "Lost")
                a.CurrentCustodianEmployeeId = null;

            a.Notes = string.IsNullOrWhiteSpace(a.Notes) ? dto.Notes : $"{a.Notes} | Bulk Update: {dto.Notes}";
            a.UpdatedAt = DateTime.UtcNow;
            a.UpdatedBy = updatedBy;
        }

        return await _context.SaveChangesAsync();
    }

    public async Task<int> BulkTransferAsync(BulkTransferDto dto, string initiatedBy)
    {
        var tenantId = GetEffectiveTenantId();
        var assets = await _context.Assets
            .Where(a => dto.AssetIds.Contains(a.Id) && a.TenantId == tenantId && !a.IsDeleted && a.Status != "Disposed")
            .ToListAsync();

        foreach (var a in assets)
        {
            var transfer = new AssetTransfer
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                AssetId = a.Id,
                FromEmployeeId = a.CurrentCustodianEmployeeId,
                ToEmployeeId = dto.NewCustodianEmployeeId,
                FromLocationId = a.LocationId,
                ToLocationId = dto.NewLocationId ?? a.LocationId,
                FromDepartmentId = a.DepartmentId,
                ToDepartmentId = dto.NewDepartmentId ?? a.DepartmentId,
                TransferDate = DateTime.UtcNow,
                ReceivedDate = DateTime.UtcNow,
                InitiatedBy = initiatedBy,
                ApprovedBy = initiatedBy,
                Reason = dto.Reason,
                Status = "Received"
            };

            a.CurrentCustodianEmployeeId = dto.NewCustodianEmployeeId;
            if (dto.NewLocationId.HasValue) a.LocationId = dto.NewLocationId.Value;
            if (dto.NewDepartmentId.HasValue) a.DepartmentId = dto.NewDepartmentId.Value;
            a.Status = dto.NewCustodianEmployeeId.HasValue ? "Assigned" : "Available";
            a.UpdatedAt = DateTime.UtcNow;

            _context.AssetTransfers.Add(transfer);
        }

        return await _context.SaveChangesAsync();
    }

    // ==========================================
    // 4. TAXONOMY & LOOKUPS
    // ==========================================
    public async Task<List<AssetCategoryDto>> GetCategoriesAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.AssetCategories
            .AsNoTracking()
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .Select(c => new AssetCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                Description = c.Description,
                AssetType = c.AssetType,
                DepreciationMethod = c.DepreciationMethod,
                UsefulLifeMonths = c.UsefulLifeMonths,
                RequiresSerialNumber = c.RequiresSerialNumber,
                RequiresAssignment = c.RequiresAssignment,
                RequiresApproval = c.RequiresApproval,
                IsActive = c.IsActive,
                TotalAssetsCount = c.Assets.Count(a => !a.IsDeleted),
                TotalValue = c.Assets.Where(a => !a.IsDeleted).Sum(a => a.PurchasePrice)
            })
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<AssetCategory> CreateCategoryAsync(AssetCategory category)
    {
        category.TenantId = GetEffectiveTenantId();
        category.CreatedAt = DateTime.UtcNow;
        _context.AssetCategories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<List<AssetModelDto>> GetModelsAsync(Guid? categoryId = null)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.AssetModels
            .AsNoTracking()
            .Include(m => m.Category)
            .Where(m => m.TenantId == tenantId && !m.IsDeleted);

        if (categoryId.HasValue) query = query.Where(m => m.CategoryId == categoryId.Value);

        return await query.Select(m => new AssetModelDto
        {
            Id = m.Id,
            CategoryId = m.CategoryId,
            CategoryName = m.Category != null ? m.Category.Name : string.Empty,
            Manufacturer = m.Manufacturer,
            ModelName = m.ModelName,
            ModelNumber = m.ModelNumber,
            Specifications = m.Specifications,
            WarrantyPeriodMonths = m.WarrantyPeriodMonths,
            DefaultUsefulLifeMonths = m.DefaultUsefulLifeMonths,
            IsActive = m.IsActive,
            AssetsCount = m.Assets.Count(a => !a.IsDeleted)
        }).OrderBy(m => m.Manufacturer).ThenBy(m => m.ModelName).ToListAsync();
    }

    public async Task<AssetModel> CreateModelAsync(AssetModel model)
    {
        model.TenantId = GetEffectiveTenantId();
        model.CreatedAt = DateTime.UtcNow;
        _context.AssetModels.Add(model);
        await _context.SaveChangesAsync();
        return model;
    }

    public async Task<List<AssetLocationDto>> GetLocationsAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.AssetLocations
            .AsNoTracking()
            .Include(l => l.Company)
            .Include(l => l.Branch)
            .Where(l => l.TenantId == tenantId && !l.IsDeleted)
            .Select(l => new AssetLocationDto
            {
                Id = l.Id,
                Name = l.Name,
                Code = l.Code,
                CompanyId = l.CompanyId,
                CompanyName = l.Company != null ? l.Company.Name : string.Empty,
                BranchId = l.BranchId,
                BranchName = l.Branch != null ? l.Branch.Name : string.Empty,
                Building = l.Building,
                Floor = l.Floor,
                Room = l.Room,
                StorageArea = l.StorageArea,
                Description = l.Description,
                IsActive = l.IsActive,
                AssetsCount = l.Assets.Count(a => !a.IsDeleted)
            })
            .OrderBy(l => l.Name)
            .ToListAsync();
    }

    public async Task<AssetLocation> CreateLocationAsync(AssetLocation location)
    {
        location.TenantId = GetEffectiveTenantId();
        location.CreatedAt = DateTime.UtcNow;
        _context.AssetLocations.Add(location);
        await _context.SaveChangesAsync();
        return location;
    }

    public async Task<List<AssetVendorDto>> GetVendorsAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.AssetVendors
            .AsNoTracking()
            .Where(v => v.TenantId == tenantId && !v.IsDeleted)
            .Select(v => new AssetVendorDto
            {
                Id = v.Id,
                VendorName = v.VendorName,
                VendorCode = v.VendorCode,
                ContactPerson = v.ContactPerson,
                Email = v.Email,
                Phone = v.Phone,
                Address = v.Address,
                Website = v.Website,
                TaxId = v.TaxId,
                Status = v.Status,
                Notes = v.Notes,
                TotalAssetsSupplied = v.Assets.Count(a => !a.IsDeleted),
                TotalSpend = v.Assets.Where(a => !a.IsDeleted).Sum(a => a.PurchasePrice)
            })
            .OrderBy(v => v.VendorName)
            .ToListAsync();
    }

    public async Task<AssetVendor> CreateVendorAsync(AssetVendor vendor)
    {
        vendor.TenantId = GetEffectiveTenantId();
        vendor.CreatedAt = DateTime.UtcNow;
        _context.AssetVendors.Add(vendor);
        await _context.SaveChangesAsync();
        return vendor;
    }

    public async Task<List<AssetWarrantyDto>> GetExpiringWarrantiesAsync(int daysAhead = 30)
    {
        var tenantId = GetEffectiveTenantId();
        var threshold = DateTime.UtcNow.AddDays(daysAhead);
        return await _context.AssetWarranties
            .AsNoTracking()
            .Include(w => w.Asset)
            .Where(w => w.TenantId == tenantId && !w.IsDeleted && w.EndDate <= threshold && w.EndDate >= DateTime.UtcNow.AddDays(-30))
            .OrderBy(w => w.EndDate)
            .Select(w => new AssetWarrantyDto
            {
                Id = w.Id,
                AssetId = w.AssetId,
                AssetTag = w.Asset != null ? w.Asset.AssetTag : string.Empty,
                AssetName = w.Asset != null ? w.Asset.AssetName : string.Empty,
                WarrantyProvider = w.WarrantyProvider,
                StartDate = w.StartDate,
                EndDate = w.EndDate,
                WarrantyType = w.WarrantyType,
                CoverageDetails = w.CoverageDetails,
                ContractNumber = w.ContractNumber,
                SupportPhone = w.SupportPhone,
                SupportEmail = w.SupportEmail,
                Status = w.EndDate < DateTime.UtcNow ? "Expired" : "ExpiringSoon"
            })
            .ToListAsync();
    }

    // ==========================================
    // 5. AUDIT CAMPAIGNS
    // ==========================================
    public async Task<List<AssetAuditDto>> GetAuditsAsync()
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.AssetAudits
            .AsNoTracking()
            .Include(a => a.Location)
            .Include(a => a.Department)
            .Include(a => a.AssignedAuditor)
            .Where(a => a.TenantId == tenantId && !a.IsDeleted)
            .OrderByDescending(a => a.StartDate)
            .Select(a => new AssetAuditDto
            {
                Id = a.Id,
                AuditCode = a.AuditCode,
                Name = a.Name,
                LocationId = a.LocationId,
                LocationName = a.Location != null ? a.Location.Name : "All Locations",
                DepartmentId = a.DepartmentId,
                DepartmentName = a.Department != null ? a.Department.Name : "All Departments",
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                AssignedAuditorEmployeeId = a.AssignedAuditorEmployeeId,
                AssignedAuditorName = a.AssignedAuditor != null ? $"{a.AssignedAuditor.FirstName} {a.AssignedAuditor.LastName}" : "Unassigned",
                Status = a.Status,
                TotalAssetsCount = a.TotalAssetsCount,
                VerifiedCount = a.VerifiedCount,
                MissingCount = a.MissingCount,
                DiscrepancyCount = a.DiscrepancyCount,
                SummaryNotes = a.SummaryNotes
            })
            .ToListAsync();
    }

    public async Task<AssetAuditDto?> GetAuditByIdAsync(Guid id)
    {
        var tenantId = GetEffectiveTenantId();
        var a = await _context.AssetAudits
            .AsNoTracking()
            .Include(x => x.Location)
            .Include(x => x.Department)
            .Include(x => x.AssignedAuditor)
            .Include(x => x.Items).ThenInclude(i => i.Asset)
            .FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId && !x.IsDeleted);

        if (a == null) return null;

        return new AssetAuditDto
        {
            Id = a.Id,
            AuditCode = a.AuditCode,
            Name = a.Name,
            LocationId = a.LocationId,
            LocationName = a.Location?.Name ?? "All Locations",
            DepartmentId = a.DepartmentId,
            DepartmentName = a.Department?.Name ?? "All Departments",
            StartDate = a.StartDate,
            EndDate = a.EndDate,
            AssignedAuditorEmployeeId = a.AssignedAuditorEmployeeId,
            AssignedAuditorName = a.AssignedAuditor != null ? $"{a.AssignedAuditor.FirstName} {a.AssignedAuditor.LastName}" : "Unassigned",
            Status = a.Status,
            TotalAssetsCount = a.TotalAssetsCount,
            VerifiedCount = a.VerifiedCount,
            MissingCount = a.MissingCount,
            DiscrepancyCount = a.DiscrepancyCount,
            SummaryNotes = a.SummaryNotes,
            Items = a.Items.Select(i => new AssetAuditItemDto
            {
                Id = i.Id,
                AuditId = i.AuditId,
                AssetId = i.AssetId,
                AssetTag = i.Asset?.AssetTag ?? string.Empty,
                AssetName = i.Asset?.AssetName ?? string.Empty,
                SerialNumber = i.Asset?.SerialNumber ?? string.Empty,
                ExpectedCondition = i.ExpectedCondition,
                ActualCondition = i.ActualCondition,
                Status = i.Status,
                VerificationDate = i.VerificationDate,
                VerifiedBy = i.VerifiedBy,
                DiscrepancyNotes = i.DiscrepancyNotes,
                ScannedViaQr = i.ScannedViaQr
            }).ToList()
        };
    }

    public async Task<AssetAudit> CreateAuditAsync(AssetAudit audit)
    {
        var tenantId = GetEffectiveTenantId();
        audit.TenantId = tenantId;
        audit.CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(audit.AuditCode))
        {
            var count = await _context.AssetAudits.CountAsync(a => a.TenantId == tenantId) + 1;
            audit.AuditCode = $"AUD-2026-Q{((DateTime.UtcNow.Month - 1) / 3) + 1}-{count:D3}";
        }

        // Populate items from matching assets
        var assetsQuery = _context.Assets.Where(a => a.TenantId == tenantId && !a.IsDeleted && a.Status != "Disposed");
        if (audit.LocationId.HasValue) assetsQuery = assetsQuery.Where(a => a.LocationId == audit.LocationId.Value);
        if (audit.DepartmentId.HasValue) assetsQuery = assetsQuery.Where(a => a.DepartmentId == audit.DepartmentId.Value);

        var assets = await assetsQuery.Take(250).ToListAsync();
        audit.TotalAssetsCount = assets.Count;

        foreach (var asset in assets)
        {
            audit.Items.Add(new AssetAuditItem
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                AuditId = audit.Id,
                AssetId = asset.Id,
                ExpectedLocationId = asset.LocationId,
                ExpectedEmployeeId = asset.CurrentCustodianEmployeeId,
                ExpectedCondition = asset.Condition,
                ActualCondition = asset.Condition,
                Status = "Verified",
                VerificationDate = DateTime.UtcNow,
                VerifiedBy = "Lead Auditor",
                ScannedViaQr = true
            });
        }

        audit.VerifiedCount = audit.TotalAssetsCount;
        _context.AssetAudits.Add(audit);
        await _context.SaveChangesAsync();
        return audit;
    }

    public async Task<bool> VerifyAuditItemAsync(Guid auditItemId, VerifyAuditItemDto dto, string verifiedBy)
    {
        var item = await _context.AssetAuditItems
            .Include(i => i.Audit)
            .Include(i => i.Asset)
            .FirstOrDefaultAsync(i => i.Id == auditItemId);

        if (item == null) return false;

        item.ActualLocationId = dto.ActualLocationId ?? item.ExpectedLocationId;
        item.ActualEmployeeId = dto.ActualEmployeeId ?? item.ExpectedEmployeeId;
        item.ActualCondition = dto.ActualCondition;
        item.Status = dto.Status;
        item.DiscrepancyNotes = dto.DiscrepancyNotes;
        item.ScannedViaQr = dto.ScannedViaQr;
        item.VerificationDate = DateTime.UtcNow;
        item.VerifiedBy = verifiedBy;

        if (item.Audit != null)
        {
            // Recompute counts
            var allItems = await _context.AssetAuditItems.Where(x => x.AuditId == item.AuditId).ToListAsync();
            item.Audit.VerifiedCount = allItems.Count(x => x.Status == "Verified");
            item.Audit.MissingCount = allItems.Count(x => x.Status == "Missing");
            item.Audit.DiscrepancyCount = allItems.Count(x => x.Status is "Moved" or "Damaged" or "Mismatch");
            _context.AssetAudits.Update(item.Audit);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 6. REQUESTS & WORKFLOW INTEGRATION
    // ==========================================
    public async Task<PagedResult<AssetRequestDto>> GetAssetRequestsAsync(int page = 1, int pageSize = 10, string? status = null, Guid? employeeId = null)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.AssetRequests
            .AsNoTracking()
            .Include(r => r.Employee)
            .Include(r => r.Category)
            .Include(r => r.Model)
            .Include(r => r.FulfilledAsset)
            .Where(r => r.TenantId == tenantId && !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
            query = query.Where(r => r.Status == status);

        if (employeeId.HasValue)
            query = query.Where(r => r.EmployeeId == employeeId.Value);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new AssetRequestDto
            {
                Id = r.Id,
                RequestNumber = r.RequestNumber,
                EmployeeId = r.EmployeeId,
                EmployeeName = r.Employee != null ? $"{r.Employee.FirstName} {r.Employee.LastName}" : "Employee",
                EmployeeEmail = r.Employee != null ? r.Employee.Email : string.Empty,
                DepartmentName = r.Employee != null && r.Employee.Department != null ? r.Employee.Department.Name : "IT / Ops",
                CategoryId = r.CategoryId,
                CategoryName = r.Category != null ? r.Category.Name : "General",
                ModelId = r.ModelId,
                ModelName = r.Model != null ? r.Model.ModelName : "Any Model",
                Quantity = r.Quantity,
                Reason = r.Reason,
                RequiredDate = r.RequiredDate,
                Priority = r.Priority,
                Status = r.Status,
                ApprovalRequestId = r.ApprovalRequestId,
                ApproverComments = r.ApproverComments,
                ReviewedBy = r.ReviewedBy,
                ReviewedAt = r.ReviewedAt,
                FulfilledAssetId = r.FulfilledAssetId,
                FulfilledAssetTag = r.FulfilledAsset != null ? r.FulfilledAsset.AssetTag : string.Empty,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return new PagedResult<AssetRequestDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<AssetRequestDto?> GetAssetRequestByIdAsync(Guid id)
    {
        var tenantId = GetEffectiveTenantId();
        var r = await _context.AssetRequests
            .AsNoTracking()
            .Include(x => x.Employee)
            .Include(x => x.Category)
            .Include(x => x.Model)
            .Include(x => x.FulfilledAsset)
            .FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId && !x.IsDeleted);

        if (r == null) return null;

        return new AssetRequestDto
        {
            Id = r.Id,
            RequestNumber = r.RequestNumber,
            EmployeeId = r.EmployeeId,
            EmployeeName = r.Employee != null ? $"{r.Employee.FirstName} {r.Employee.LastName}" : "Employee",
            EmployeeEmail = r.Employee?.Email ?? string.Empty,
            DepartmentName = r.Employee?.Department?.Name ?? "IT",
            CategoryId = r.CategoryId,
            CategoryName = r.Category?.Name ?? "General",
            ModelId = r.ModelId,
            ModelName = r.Model?.ModelName ?? "Any",
            Quantity = r.Quantity,
            Reason = r.Reason,
            RequiredDate = r.RequiredDate,
            Priority = r.Priority,
            Status = r.Status,
            ApprovalRequestId = r.ApprovalRequestId,
            ApproverComments = r.ApproverComments,
            ReviewedBy = r.ReviewedBy,
            ReviewedAt = r.ReviewedAt,
            FulfilledAssetId = r.FulfilledAssetId,
            FulfilledAssetTag = r.FulfilledAsset?.AssetTag ?? string.Empty,
            CreatedAt = r.CreatedAt
        };
    }

    public async Task<AssetRequest> CreateAssetRequestAsync(AssetRequest request)
    {
        var tenantId = GetEffectiveTenantId();
        request.TenantId = tenantId;
        request.CreatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(request.RequestNumber))
        {
            var count = await _context.AssetRequests.CountAsync(r => r.TenantId == tenantId) + 1;
            request.RequestNumber = $"ARQ-2026-{count:D4}";
        }

        // Link with Workflow Engine (create Workflow ApprovalRequest)
        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId);
        var workflowApproval = new ApprovalRequest
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            RequestNumber = request.RequestNumber,
            RequesterId = request.EmployeeId.ToString(),
            RequesterName = employee != null ? $"{employee.FirstName} {employee.LastName}" : "Employee",
            RequesterEmail = employee?.Email ?? "employee@anraone.com",
            Department = "IT Operations",
            Module = "Asset",
            EntityType = "AssetRequest",
            ReferenceId = request.Id.ToString(),
            Status = "Pending",
            Priority = request.Priority,
            Summary = $"Asset Requisition for {request.Reason} (Qty: {request.Quantity})",
            SubmittedAt = DateTime.UtcNow
        };

        request.ApprovalRequestId = workflowApproval.Id;
        request.Status = "PendingApproval";

        _context.ApprovalRequests.Add(workflowApproval);
        _context.AssetRequests.Add(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<bool> ProcessAssetRequestActionAsync(Guid requestId, ProcessAssetRequestActionDto dto, string actorName)
    {
        var tenantId = GetEffectiveTenantId();
        var req = await _context.AssetRequests
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == requestId && r.TenantId == tenantId && !r.IsDeleted);

        if (req == null) return false;

        req.ReviewedBy = actorName;
        req.ReviewedAt = DateTime.UtcNow;
        req.ApproverComments = dto.Comments;

        if (dto.Action.Equals("Approve", StringComparison.OrdinalIgnoreCase))
        {
            req.Status = "Approved";

            // If an asset was selected to immediately fulfill:
            if (dto.FulfillWithAssetId.HasValue)
            {
                var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == dto.FulfillWithAssetId.Value && a.TenantId == tenantId);
                if (asset != null && asset.Status == "Available")
                {
                    req.FulfilledAssetId = asset.Id;
                    req.FulfilledDate = DateTime.UtcNow;
                    req.Status = "Fulfilled";

                    // Assign asset to employee
                    await AssignAssetAsync(asset.Id, new AssignAssetDto
                    {
                        EmployeeId = req.EmployeeId,
                        ConditionAtHandover = "Good",
                        HandoverNotes = $"Fulfilled automatically via Request {req.RequestNumber}",
                        Accessories = new List<string> { "Standard Accessories" }
                    }, actorName);
                }
            }

            // Also update linked Workflow ApprovalRequest
            if (req.ApprovalRequestId.HasValue)
            {
                var wf = await _context.ApprovalRequests.FirstOrDefaultAsync(w => w.Id == req.ApprovalRequestId.Value);
                if (wf != null)
                {
                    wf.Status = "Approved";
                    wf.CompletedAt = DateTime.UtcNow;
                    _context.ApprovalRequests.Update(wf);
                }
            }
        }
        else if (dto.Action.Equals("Reject", StringComparison.OrdinalIgnoreCase))
        {
            req.Status = "Rejected";
            if (req.ApprovalRequestId.HasValue)
            {
                var wf = await _context.ApprovalRequests.FirstOrDefaultAsync(w => w.Id == req.ApprovalRequestId.Value);
                if (wf != null)
                {
                    wf.Status = "Rejected";
                    wf.CompletedAt = DateTime.UtcNow;
                    _context.ApprovalRequests.Update(wf);
                }
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    // ==========================================
    // 7. SELF-SERVICE & MANAGER
    // ==========================================
    public async Task<List<AssetDto>> GetEmployeeAssetsAsync(Guid employeeId)
    {
        var tenantId = GetEffectiveTenantId();
        return await _context.Assets
            .AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Model)
            .Include(a => a.Location)
            .Where(a => a.TenantId == tenantId && a.CurrentCustodianEmployeeId == employeeId && !a.IsDeleted)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                CategoryId = a.CategoryId,
                CategoryName = a.Category != null ? a.Category.Name : string.Empty,
                ModelName = a.Model != null ? a.Model.ModelName : string.Empty,
                Manufacturer = a.Manufacturer,
                SerialNumber = a.SerialNumber,
                Barcode = a.Barcode,
                QrCode = a.QrCode,
                PurchaseDate = a.PurchaseDate,
                PurchasePrice = a.PurchasePrice,
                Status = a.Status,
                Condition = a.Condition,
                LocationName = a.Location != null ? a.Location.Name : string.Empty,
                WarrantyEndDate = a.WarrantyEndDate,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<AssetDto>> GetTeamAssetsAsync(Guid managerId)
    {
        var tenantId = GetEffectiveTenantId();
        // Employees reporting to manager
        var reporteeIds = await _context.Employees
            .Where(e => e.ManagerId == managerId && !e.IsDeleted)
            .Select(e => e.Id)
            .ToListAsync();

        return await _context.Assets
            .AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Model)
            .Include(a => a.CurrentCustodianEmployee)
            .Include(a => a.Location)
            .Where(a => a.TenantId == tenantId && a.CurrentCustodianEmployeeId.HasValue && reporteeIds.Contains(a.CurrentCustodianEmployeeId.Value) && !a.IsDeleted)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                AssetTag = a.AssetTag,
                AssetName = a.AssetName,
                CategoryId = a.CategoryId,
                CategoryName = a.Category != null ? a.Category.Name : string.Empty,
                ModelName = a.Model != null ? a.Model.ModelName : string.Empty,
                CurrentCustodianEmployeeId = a.CurrentCustodianEmployeeId,
                CurrentCustodianName = a.CurrentCustodianEmployee != null ? $"{a.CurrentCustodianEmployee.FirstName} {a.CurrentCustodianEmployee.LastName}" : string.Empty,
                Status = a.Status,
                Condition = a.Condition,
                LocationName = a.Location != null ? a.Location.Name : string.Empty,
                PurchasePrice = a.PurchasePrice,
                WarrantyEndDate = a.WarrantyEndDate,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    // ==========================================
    // 8. DASHBOARD & 10 CHARTS
    // ==========================================
    public async Task<AssetDashboardMetricsDto> GetDashboardMetricsAsync(Guid? companyId = null, Guid? branchId = null, Guid? departmentId = null)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.Assets.AsNoTracking().Where(a => a.TenantId == tenantId && !a.IsDeleted);

        if (departmentId.HasValue) query = query.Where(a => a.DepartmentId == departmentId.Value);

        var assets = await query
            .Include(a => a.Category)
            .Include(a => a.Department)
            .Include(a => a.Location)
            .ToListAsync();

        var totalCount = assets.Count;
        var totalValue = assets.Sum(a => a.PurchasePrice);
        var availableCount = assets.Count(a => a.Status == "Available");
        var assignedCount = assets.Count(a => a.Status == "Assigned");
        var maintenanceCount = assets.Count(a => a.Status == "UnderMaintenance");
        var lostDamagedCount = assets.Count(a => a.Status is "Lost" or "Damaged");
        var retiredCount = assets.Count(a => a.Status is "Retired" or "Disposed");
        
        var pendingRequests = await _context.AssetRequests.CountAsync(r => r.TenantId == tenantId && r.Status == "PendingApproval" && !r.IsDeleted);
        var expiringWarranties = assets.Count(a => a.WarrantyEndDate.HasValue && a.WarrantyEndDate.Value > DateTime.UtcNow && a.WarrantyEndDate.Value <= DateTime.UtcNow.AddDays(30));
        
        var returnsDue = await _context.AssetAssignments.CountAsync(asg => asg.TenantId == tenantId && asg.Status == "Active" && asg.ExpectedReturnDate.HasValue && asg.ExpectedReturnDate.Value <= DateTime.UtcNow.AddDays(7));

        // 1. Assets by Category
        var catColors = new[] { "#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316" };
        var assetsByCategory = assets
            .GroupBy(a => a.Category?.Name ?? "Uncategorized")
            .Select((g, idx) => new ChartDataPointDto
            {
                Name = g.Key,
                Value = g.Count(),
                Count = g.Count(),
                Color = catColors[idx % catColors.Length]
            })
            .OrderByDescending(x => x.Value)
            .ToList();

        // 2. Assets by Status
        var statusColorMap = new Dictionary<string, string>
        {
            ["Available"] = "#10b981",
            ["Assigned"] = "#3b82f6",
            ["UnderMaintenance"] = "#f59e0b",
            ["Lost"] = "#ef4444",
            ["Damaged"] = "#dc2626",
            ["Retired"] = "#64748b",
            ["Disposed"] = "#475569"
        };
        var assetsByStatus = assets
            .GroupBy(a => a.Status)
            .Select(g => new ChartDataPointDto
            {
                Name = g.Key,
                Value = g.Count(),
                Count = g.Count(),
                Color = statusColorMap.ContainsKey(g.Key) ? statusColorMap[g.Key] : "#6366f1"
            })
            .OrderByDescending(x => x.Value)
            .ToList();

        // 3. Assets by Department
        var assetsByDept = assets
            .GroupBy(a => a.Department?.Name ?? "General Pool")
            .Select(g => new ChartDataPointDto
            {
                Name = g.Key,
                Value = g.Count(),
                Count = g.Count(),
                Color = "#3b82f6"
            })
            .OrderByDescending(x => x.Value)
            .Take(8)
            .ToList();

        // 4. Assets by Location
        var assetsByLocation = assets
            .GroupBy(a => a.Location?.Name ?? "Central Warehouse")
            .Select(g => new ChartDataPointDto
            {
                Name = g.Key,
                Value = g.Count(),
                Count = g.Count(),
                Color = "#10b981"
            })
            .OrderByDescending(x => x.Value)
            .Take(8)
            .ToList();

        // 5. Asset Value by Category
        var valByCategory = assets
            .GroupBy(a => a.Category?.Name ?? "Uncategorized")
            .Select(g => new ChartDataPointDto
            {
                Name = g.Key,
                Value = g.Sum(x => x.PurchasePrice),
                Color = "#8b5cf6"
            })
            .OrderByDescending(x => x.Value)
            .Take(8)
            .ToList();

        // 6. Monthly Assignments (Last 6 Months)
        var now = DateTime.UtcNow;
        var assignments = await _context.AssetAssignments
            .Where(asg => asg.TenantId == tenantId && asg.AssignedDate >= now.AddMonths(-6))
            .ToListAsync();

        var monthlyAssignments = Enumerable.Range(0, 6)
            .Select(i => now.AddMonths(-5 + i))
            .Select(m => new ChartDataPointDto
            {
                Name = m.ToString("MMM yyyy"),
                Value = assignments.Count(a => a.AssignedDate.Year == m.Year && a.AssignedDate.Month == m.Month),
                Color = "#6366f1"
            })
            .ToList();

        // 7. Monthly Returns (Last 6 Months)
        var returns = await _context.AssetReturns
            .Where(r => r.TenantId == tenantId && r.ReturnDate >= now.AddMonths(-6))
            .ToListAsync();

        var monthlyReturns = Enumerable.Range(0, 6)
            .Select(i => now.AddMonths(-5 + i))
            .Select(m => new ChartDataPointDto
            {
                Name = m.ToString("MMM yyyy"),
                Value = returns.Count(r => r.ReturnDate.Year == m.Year && r.ReturnDate.Month == m.Month),
                Color = "#14b8a6"
            })
            .ToList();

        // 8. Maintenance Cost Trend
        var maintenances = await _context.AssetMaintenances
            .Where(mnt => mnt.TenantId == tenantId && mnt.StartDate >= now.AddMonths(-6))
            .ToListAsync();

        var maintenanceCosts = Enumerable.Range(0, 6)
            .Select(i => now.AddMonths(-5 + i))
            .Select(m => new ChartDataPointDto
            {
                Name = m.ToString("MMM yyyy"),
                Value = maintenances.Where(mnt => mnt.StartDate.Year == m.Year && mnt.StartDate.Month == m.Month).Sum(mnt => mnt.Cost),
                Color = "#f59e0b"
            })
            .ToList();

        // 9. Warranty Expiry Timeline
        var warranties = await _context.AssetWarranties
            .Where(w => w.TenantId == tenantId && !w.IsDeleted)
            .ToListAsync();

        var warrantyTimeline = new List<ChartDataPointDto>
        {
            new() { Name = "Expired", Value = warranties.Count(w => w.EndDate < now), Color = "#ef4444" },
            new() { Name = "Expiring in 7 Days", Value = warranties.Count(w => w.EndDate >= now && w.EndDate <= now.AddDays(7)), Color = "#f97316" },
            new() { Name = "Expiring in 30 Days", Value = warranties.Count(w => w.EndDate > now.AddDays(7) && w.EndDate <= now.AddDays(30)), Color = "#f59e0b" },
            new() { Name = "Expiring in 60 Days", Value = warranties.Count(w => w.EndDate > now.AddDays(30) && w.EndDate <= now.AddDays(60)), Color = "#3b82f6" },
            new() { Name = "Expiring in 90 Days", Value = warranties.Count(w => w.EndDate > now.AddDays(60) && w.EndDate <= now.AddDays(90)), Color = "#6366f1" },
            new() { Name = "> 90 Days Active", Value = warranties.Count(w => w.EndDate > now.AddDays(90)), Color = "#10b981" }
        };

        // 10. Asset Utilization
        var utilizationRate = totalCount > 0 ? Math.Round((decimal)assignedCount / totalCount * 100, 1) : 0;
        var assetUtilization = new List<ChartDataPointDto>
        {
            new() { Name = "Assigned / Utilized", Value = assignedCount, Color = "#10b981" },
            new() { Name = "Available / Idle", Value = availableCount, Color = "#3b82f6" },
            new() { Name = "Maintenance / Out of Service", Value = maintenanceCount + lostDamagedCount, Color = "#ef4444" },
            new() { Name = "Retired / Surplus", Value = retiredCount, Color = "#64748b" }
        };

        return new AssetDashboardMetricsDto
        {
            TotalAssets = totalCount,
            TotalAssetValue = totalValue,
            AvailableAssets = availableCount,
            AssignedAssets = assignedCount,
            AssetsUnderMaintenance = maintenanceCount,
            LostDamagedAssets = lostDamagedCount,
            RetiredAssets = retiredCount,
            PendingAssetRequests = pendingRequests,
            ExpiringWarranties = expiringWarranties,
            AssetsDueForReturn = returnsDue,
            AssetsByCategory = assetsByCategory,
            AssetsByStatus = assetsByStatus,
            AssetsByDepartment = assetsByDept,
            AssetsByLocation = assetsByLocation,
            AssetValueByCategory = valByCategory,
            MonthlyAssignments = monthlyAssignments,
            MonthlyReturns = monthlyReturns,
            MaintenanceCostTrend = maintenanceCosts,
            WarrantyExpiryTimeline = warrantyTimeline,
            AssetUtilization = assetUtilization
        };
    }

    public async Task<List<AssetInventorySummaryDto>> GetInventorySummaryAsync()
    {
        var tenantId = GetEffectiveTenantId();
        var assets = await _context.Assets
            .AsNoTracking()
            .Include(a => a.Category)
            .Where(a => a.TenantId == tenantId && !a.IsDeleted)
            .ToListAsync();

        return assets
            .GroupBy(a => a.Category?.Name ?? "General Equipment")
            .Select(g => new AssetInventorySummaryDto
            {
                CategoryName = g.Key,
                TotalStock = g.Count(),
                Available = g.Count(x => x.Status == "Available"),
                Assigned = g.Count(x => x.Status == "Assigned"),
                Reserved = g.Count(x => x.Status == "Reserved"),
                Damaged = g.Count(x => x.Status == "Damaged"),
                Lost = g.Count(x => x.Status == "Lost"),
                UnderMaintenance = g.Count(x => x.Status == "UnderMaintenance"),
                TotalValue = g.Sum(x => x.PurchasePrice)
            })
            .OrderByDescending(x => x.TotalStock)
            .ToList();
    }

    // ==========================================
    // 9. FINANCIAL DEPRECIATION CALCULATION
    // ==========================================
    public async Task<DepreciationCalculationResultDto> CalculateDepreciationAsync(Guid assetId)
    {
        var tenantId = GetEffectiveTenantId();
        var asset = await _context.Assets.FirstOrDefaultAsync(a => a.Id == assetId && a.TenantId == tenantId && !a.IsDeleted);
        if (asset == null)
            throw new KeyNotFoundException($"Asset '{assetId}' was not found.");

        var purchasePrice = asset.PurchasePrice;
        var salvageValue = asset.SalvageValue;
        var usefulLife = asset.UsefulLifeMonths > 0 ? asset.UsefulLifeMonths : 36;
        var method = asset.DepreciationMethod ?? "StraightLine";

        var schedule = new List<DepreciationScheduleRowDto>();
        decimal currentVal = purchasePrice;
        decimal accumulated = 0;
        decimal monthlyDepreciation = 0;
        decimal annualDepreciation = 0;

        if (method.Equals("StraightLine", StringComparison.OrdinalIgnoreCase))
        {
            var depreciableBase = Math.Max(0, purchasePrice - salvageValue);
            monthlyDepreciation = Math.Round(depreciableBase / usefulLife, 2);
            annualDepreciation = monthlyDepreciation * 12;

            for (int i = 1; i <= Math.Min(usefulLife, 60); i++)
            {
                var periodDate = asset.PurchaseDate.AddMonths(i);
                var beginning = currentVal;
                var dep = Math.Min(monthlyDepreciation, beginning - salvageValue);
                if (dep < 0) dep = 0;
                accumulated += dep;
                currentVal = Math.Max(salvageValue, beginning - dep);

                schedule.Add(new DepreciationScheduleRowDto
                {
                    PeriodNumber = i,
                    Year = periodDate.Year,
                    Month = periodDate.Month,
                    BeginningValue = beginning,
                    DepreciationAmount = dep,
                    AccumulatedDepreciation = accumulated,
                    EndingValue = currentVal
                });

                if (currentVal <= salvageValue) break;
            }
        }
        else // Declining Balance
        {
            // Double declining rate = 2 / (usefulLife / 12)
            var annualRate = (decimal)(2.0 / (usefulLife / 12.0));
            var monthlyRate = annualRate / 12.0m;
            monthlyDepreciation = Math.Round(currentVal * monthlyRate, 2);
            annualDepreciation = Math.Round(currentVal * annualRate, 2);

            for (int i = 1; i <= Math.Min(usefulLife, 60); i++)
            {
                var periodDate = asset.PurchaseDate.AddMonths(i);
                var beginning = currentVal;
                var dep = Math.Round(beginning * monthlyRate, 2);
                if (beginning - dep < salvageValue)
                    dep = Math.Max(0, beginning - salvageValue);

                accumulated += dep;
                currentVal = Math.Max(salvageValue, beginning - dep);

                schedule.Add(new DepreciationScheduleRowDto
                {
                    PeriodNumber = i,
                    Year = periodDate.Year,
                    Month = periodDate.Month,
                    BeginningValue = beginning,
                    DepreciationAmount = dep,
                    AccumulatedDepreciation = accumulated,
                    EndingValue = currentVal
                });

                if (currentVal <= salvageValue) break;
            }
        }

        // Calculate months elapsed since purchase
        var monthsElapsed = Math.Max(0, (int)((DateTime.UtcNow.Year - asset.PurchaseDate.Year) * 12 + DateTime.UtcNow.Month - asset.PurchaseDate.Month));
        var currentBookValue = schedule.FirstOrDefault(s => s.PeriodNumber == Math.Min(monthsElapsed, schedule.Count))?.EndingValue ?? currentVal;
        var totalDepreciated = purchasePrice - currentBookValue;

        // Update current book value on entity
        asset.CurrentBookValue = currentBookValue;
        _context.Assets.Update(asset);
        await _context.SaveChangesAsync();

        return new DepreciationCalculationResultDto
        {
            AssetId = asset.Id,
            AssetTag = asset.AssetTag,
            AssetName = asset.AssetName,
            PurchasePrice = purchasePrice,
            SalvageValue = salvageValue,
            UsefulLifeMonths = usefulLife,
            Method = method,
            CurrentBookValue = currentBookValue,
            TotalDepreciated = totalDepreciated,
            MonthlyDepreciation = monthlyDepreciation,
            AnnualDepreciation = annualDepreciation,
            Schedule = schedule
        };
    }

    // ==========================================
    // 10. ENTERPRISE REPORTS GENERATION
    // ==========================================
    public async Task<AssetReportResultDto> GenerateReportAsync(AssetReportFilterDto filter)
    {
        var tenantId = GetEffectiveTenantId();
        var query = _context.Assets
            .AsNoTracking()
            .Include(a => a.Category)
            .Include(a => a.Model)
            .Include(a => a.Vendor)
            .Include(a => a.Location)
            .Include(a => a.Department)
            .Include(a => a.CurrentCustodianEmployee)
            .Where(a => a.TenantId == tenantId && !a.IsDeleted);

        if (filter.CategoryId.HasValue) query = query.Where(a => a.CategoryId == filter.CategoryId.Value);
        if (filter.DepartmentId.HasValue) query = query.Where(a => a.DepartmentId == filter.DepartmentId.Value);
        if (filter.LocationId.HasValue) query = query.Where(a => a.LocationId == filter.LocationId.Value);
        if (!string.IsNullOrWhiteSpace(filter.Status) && filter.Status != "All") query = query.Where(a => a.Status == filter.Status);
        if (filter.StartDate.HasValue) query = query.Where(a => a.PurchaseDate >= filter.StartDate.Value);
        if (filter.EndDate.HasValue) query = query.Where(a => a.PurchaseDate <= filter.EndDate.Value);

        var assets = await query.OrderBy(a => a.AssetTag).ToListAsync();
        var result = new AssetReportResultDto
        {
            GeneratedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC"),
            TotalRecords = assets.Count
        };

        switch (filter.ReportType)
        {
            case "AssetAssignmentReport":
                result.ReportTitle = "Asset Assignment Register";
                result.Columns = new List<string> { "Asset Tag", "Asset Name", "Category", "Custodian", "Department", "Location", "Status", "Condition" };
                result.Rows = assets.Where(a => a.Status == "Assigned").Select(a => new Dictionary<string, object>
                {
                    ["Asset Tag"] = a.AssetTag,
                    ["Asset Name"] = a.AssetName,
                    ["Category"] = a.Category?.Name ?? "Uncategorized",
                    ["Custodian"] = a.CurrentCustodianEmployee != null ? $"{a.CurrentCustodianEmployee.FirstName} {a.CurrentCustodianEmployee.LastName}" : "Unassigned",
                    ["Department"] = a.Department?.Name ?? "IT",
                    ["Location"] = a.Location?.Name ?? "HQ",
                    ["Status"] = a.Status,
                    ["Condition"] = a.Condition
                }).ToList();
                break;

            case "WarrantyExpiryReport":
                result.ReportTitle = "Warranty Expiry Forecast Report";
                result.Columns = new List<string> { "Asset Tag", "Asset Name", "Serial", "Vendor", "Warranty Expiry", "Status", "Days Left" };
                result.Rows = assets.Where(a => a.WarrantyEndDate.HasValue).OrderBy(a => a.WarrantyEndDate).Select(a => new Dictionary<string, object>
                {
                    ["Asset Tag"] = a.AssetTag,
                    ["Asset Name"] = a.AssetName,
                    ["Serial"] = a.SerialNumber,
                    ["Vendor"] = a.Vendor?.VendorName ?? "Manufacturer Direct",
                    ["Warranty Expiry"] = a.WarrantyEndDate!.Value.ToString("yyyy-MM-dd"),
                    ["Status"] = a.WarrantyEndDate.Value < DateTime.UtcNow ? "Expired" : "Active",
                    ["Days Left"] = (int)(a.WarrantyEndDate.Value - DateTime.UtcNow).TotalDays
                }).ToList();
                break;

            case "AssetMaintenanceReport":
                result.ReportTitle = "Asset Maintenance & Servicing Cost Report";
                var maintenances = await _context.AssetMaintenances
                    .Include(m => m.Asset)
                    .Where(m => m.TenantId == tenantId)
                    .ToListAsync();
                result.Columns = new List<string> { "Maintenance #", "Asset Tag", "Type", "Provider", "Start Date", "Cost (USD)", "Status", "Issue" };
                result.Rows = maintenances.Select(m => new Dictionary<string, object>
                {
                    ["Maintenance #"] = m.MaintenanceNumber,
                    ["Asset Tag"] = m.Asset?.AssetTag ?? string.Empty,
                    ["Type"] = m.MaintenanceType,
                    ["Provider"] = m.ServiceProvider,
                    ["Start Date"] = m.StartDate.ToString("yyyy-MM-dd"),
                    ["Cost (USD)"] = m.Cost,
                    ["Status"] = m.Status,
                    ["Issue"] = m.Issue
                }).ToList();
                result.SummaryMetrics["Total Maintenance Cost"] = maintenances.Sum(m => m.Cost);
                break;

            case "DepreciationReport":
                result.ReportTitle = "Asset Book Value & Depreciation Ledger";
                result.Columns = new List<string> { "Asset Tag", "Asset Name", "Purchase Date", "Original Cost", "Method", "Salvage Value", "Current Book Value", "Accumulated Depr" };
                result.Rows = assets.Select(a => new Dictionary<string, object>
                {
                    ["Asset Tag"] = a.AssetTag,
                    ["Asset Name"] = a.AssetName,
                    ["Purchase Date"] = a.PurchaseDate.ToString("yyyy-MM-dd"),
                    ["Original Cost"] = a.PurchasePrice,
                    ["Method"] = a.DepreciationMethod,
                    ["Salvage Value"] = a.SalvageValue,
                    ["Current Book Value"] = a.CurrentBookValue,
                    ["Accumulated Depr"] = Math.Max(0, a.PurchasePrice - a.CurrentBookValue)
                }).ToList();
                result.SummaryMetrics["Total Original Cost"] = assets.Sum(a => a.PurchasePrice);
                result.SummaryMetrics["Total Current Book Value"] = assets.Sum(a => a.CurrentBookValue);
                break;

            default: // AssetRegister & others
                result.ReportTitle = "Master Enterprise Asset Register";
                result.Columns = new List<string> { "Asset Tag", "Asset Name", "Category", "Model", "Serial #", "Status", "Condition", "Custodian", "Location", "Cost" };
                result.Rows = assets.Select(a => new Dictionary<string, object>
                {
                    ["Asset Tag"] = a.AssetTag,
                    ["Asset Name"] = a.AssetName,
                    ["Category"] = a.Category?.Name ?? "Uncategorized",
                    ["Model"] = a.Model?.ModelName ?? "Generic",
                    ["Serial #"] = a.SerialNumber,
                    ["Status"] = a.Status,
                    ["Condition"] = a.Condition,
                    ["Custodian"] = a.CurrentCustodianEmployee != null ? $"{a.CurrentCustodianEmployee.FirstName} {a.CurrentCustodianEmployee.LastName}" : "Unassigned",
                    ["Location"] = a.Location?.Name ?? "Main Office",
                    ["Cost"] = a.PurchasePrice
                }).ToList();
                result.SummaryMetrics["Total Assets"] = assets.Count;
                result.SummaryMetrics["Total Asset Value"] = assets.Sum(a => a.PurchasePrice);
                break;
        }

        return result;
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
