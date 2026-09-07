using HRMS.Domain.Entities.Document;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Persistence.Configurations
{
    public class DocumentRecordConfiguration : IEntityTypeConfiguration<DocumentRecord>
    {
        public void Configure(EntityTypeBuilder<DocumentRecord> builder)
        {
            builder.HasKey(e => e.Id);
            
            builder.Property(e => e.Name).IsRequired().HasMaxLength(255);
            builder.Property(e => e.OriginalFileName).HasMaxLength(500);
            builder.Property(e => e.StorageObjectKey).HasMaxLength(1000);
            
            // Relationships
            builder.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Folder)
                .WithMany()
                .HasForeignKey(e => e.FolderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(e => e.Versions)
                .WithOne(v => v.DocumentRecord)
                .HasForeignKey(v => v.DocumentRecordId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class DocumentFolderConfiguration : IEntityTypeConfiguration<DocumentFolder>
    {
        public void Configure(EntityTypeBuilder<DocumentFolder> builder)
        {
            builder.HasKey(e => e.Id);
            
            builder.HasOne(e => e.ParentFolder)
                .WithMany(f => f.SubFolders)
                .HasForeignKey(e => e.ParentFolderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class DocumentTagConfiguration : IEntityTypeConfiguration<DocumentTag>
    {
        public void Configure(EntityTypeBuilder<DocumentTag> builder)
        {
            builder.HasKey(e => e.Id);
            
            builder.HasMany(e => e.Documents)
                .WithMany(d => d.Tags)
                .UsingEntity("DocumentRecordTags");
        }
    }

    public class DocumentRequestItemConfiguration : IEntityTypeConfiguration<DocumentRequestItem>
    {
        public void Configure(EntityTypeBuilder<DocumentRequestItem> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.DocumentRequest)
                .WithMany(r => r.Items)
                .HasForeignKey(e => e.DocumentRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.SubmittedDocument)
                .WithMany()
                .HasForeignKey(e => e.SubmittedDocumentId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }

    public class DocumentPermissionConfiguration : IEntityTypeConfiguration<DocumentPermission>
    {
        public void Configure(EntityTypeBuilder<DocumentPermission> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.DocumentRecord)
                .WithMany()
                .HasForeignKey(e => e.DocumentRecordId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.DocumentFolder)
                .WithMany()
                .HasForeignKey(e => e.DocumentFolderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class DocumentRetentionPolicyConfiguration : IEntityTypeConfiguration<DocumentRetentionPolicy>
    {
        public void Configure(EntityTypeBuilder<DocumentRetentionPolicy> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
