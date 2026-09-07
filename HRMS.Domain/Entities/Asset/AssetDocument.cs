using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Document;

namespace HRMS.Domain.Entities.Asset;

public class AssetDocument : BaseAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    // Integration with Document Management System (DMS)
    public Guid? DocumentRecordId { get; set; }
    public DocumentRecord? DocumentRecord { get; set; }
    
    public string Title { get; set; } = string.Empty;
    // Type: Invoice, PurchaseOrder, WarrantyCertificate, MaintenanceReceipt, HandoverForm, ReturnForm, DisposalCertificate, AuditSheet
    public string DocumentType { get; set; } = "Invoice";
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; } = 0;
    public string ContentType { get; set; } = "application/pdf";
}
