using System;
using System.Collections.Generic;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentRequest : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid EmployeeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Submitted, Approved, Rejected
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
        
        public ICollection<DocumentRequestItem> Items { get; set; } = new List<DocumentRequestItem>();
    }

    public class DocumentRequestItem : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRequestId { get; set; }
        public DocumentRequest? DocumentRequest { get; set; }
        
        public string DocumentName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsRequired { get; set; } = true;
        
        public Guid? SubmittedDocumentId { get; set; }
        public DocumentRecord? SubmittedDocument { get; set; }
        
        public string Status { get; set; } = "Pending";
    }

    public class DocumentAcknowledgement : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public Guid EmployeeId { get; set; }
        
        public bool IsAcknowledged { get; set; } = false;
        public DateTime? AcknowledgedAt { get; set; }
        public string? IpAddress { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class DocumentComment : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class DocumentRetentionPolicy : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        public Guid? CategoryId { get; set; }
        public DocumentCategory? Category { get; set; }
        
        public int RetentionDays { get; set; }
        public string ActionUponExpiry { get; set; } = "Archive"; // Archive, Delete
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
