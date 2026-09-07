using System;
using System.Collections.Generic;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentFolder : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public Guid? ParentFolderId { get; set; }
        
        // e.g. "Company", "Employee"
        public string Scope { get; set; } = "Company";
        
        // If Scope == "Employee", this maps to the specific employee
        public Guid? EmployeeId { get; set; }
        
        public bool IsSystem { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        
        public DocumentFolder? ParentFolder { get; set; }
        public ICollection<DocumentFolder> SubFolders { get; set; } = new List<DocumentFolder>();
    }
}
