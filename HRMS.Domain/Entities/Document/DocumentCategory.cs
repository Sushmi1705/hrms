using System;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentCategory : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        public bool IsSystem { get; set; } = false; // System categories cannot be deleted
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
