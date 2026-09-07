using System;
using HRMS.Domain.Common;

namespace HRMS.Domain.Entities.Document
{
    public class DocumentPermission : ITenantEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        
        // Polimorphic reference: Can apply to a Document or a Folder
        public Guid? DocumentRecordId { get; set; }
        public DocumentRecord? DocumentRecord { get; set; }
        
        public Guid? DocumentFolderId { get; set; }
        public DocumentFolder? DocumentFolder { get; set; }
        
        // Target of permission
        public Guid? TargetUserId { get; set; }
        public Guid? TargetRoleId { get; set; }
        public Guid? TargetDepartmentId { get; set; }
        
        public string PermissionLevel { get; set; } = "Viewer"; // Owner, Editor, Viewer, DownloadOnly
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = string.Empty;
    }
}
