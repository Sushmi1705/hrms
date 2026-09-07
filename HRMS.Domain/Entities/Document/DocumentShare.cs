using System;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentShare : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public Guid SharedWithUserId { get; set; }
        
        public string PermissionLevel { get; set; } = "Viewer"; // Viewer, Editor, DownloadOnly
        
        public DateTime? ExpiryDate { get; set; }
        
        public bool IsRevoked { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
