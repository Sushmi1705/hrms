using System;
using System.Collections.Generic;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentTag : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string ColorCode { get; set; } = "#000000";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        
        public ICollection<DocumentRecord> Documents { get; set; } = new List<DocumentRecord>();
    }
}
