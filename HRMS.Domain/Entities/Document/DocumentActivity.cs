using System;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentActivity : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        
        // Uploaded, Viewed, Downloaded, Edited, Shared, Approved, Rejected
        public string ActionType { get; set; } = string.Empty; 
        
        public string Details { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
