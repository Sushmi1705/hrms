using System;
using System.Collections.Generic;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentRecord : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public Guid? CategoryId { get; set; }
        public DocumentCategory? Category { get; set; }
        
        public Guid? FolderId { get; set; }
        public DocumentFolder? Folder { get; set; }
        
        // Ownership
        public Guid? EmployeeId { get; set; } // If owned by an employee
        public Guid? DepartmentId { get; set; } // If owned by a department
        
        // Metadata
        public string OriginalFileName { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        
        // Storage
        public string StorageProvider { get; set; } = "Local";
        public string StorageObjectKey { get; set; } = string.Empty;
        public string Checksum { get; set; } = string.Empty;
        
        // Status & Classification
        public string Status { get; set; } = "Active"; // Active, Archived, PendingApproval, Rejected
        public string Classification { get; set; } = "Internal"; // Public, Internal, Confidential, HighlyConfidential
        public string ApprovalStatus { get; set; } = "NotRequired"; // NotRequired, Pending, Approved, Rejected
        
        public DateTime? ExpiryDate { get; set; }
        public int CurrentVersion { get; set; } = 1;
        
        // Soft Delete
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public DateTime? RetentionArchiveDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        
        public ICollection<DocumentVersion> Versions { get; set; } = new List<DocumentVersion>();
        public ICollection<DocumentTag> Tags { get; set; } = new List<DocumentTag>();
    }
}
