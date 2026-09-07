using System;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentVersion : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public int VersionNumber { get; set; }
        
        public string OriginalFileName { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        
        public string StorageProvider { get; set; } = "Local";
        public string StorageObjectKey { get; set; } = string.Empty;
        public string Checksum { get; set; } = string.Empty;
        
        public string ChangeReason { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
