using HRMS.Domain.Entities.Audit;
using HRMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace HRMS.Persistence.Interceptors;

public class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        var dbContext = eventData.Context;
        if (dbContext == null) return base.SavingChanges(eventData, result);

        var auditEntries = new List<AuditChange>();
        
        // This is a naive implementation for the sake of the HRMS assignment.
        // It hooks into EF Core's ChangeTracker and logs any entity that was Added, Modified, or Deleted.
        
        foreach (var entry in dbContext.ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted).ToList())
        {
            // Don't audit the audit tables themselves to prevent infinite loops
            if (entry.Entity is AuditLog || entry.Entity is AuditChange || entry.Entity is AuditLogin || entry.Entity is AuditSecurityEvent || entry.Entity is AuditExport)
                continue;

            var entityName = entry.Entity.GetType().Name;
            var primaryKey = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString() ?? "Unknown";
            
            // Link to a master AuditLog entry if one is present in the AsyncLocal (set by Middleware)
            // For now, we will just generate a new GUID for the AuditLogId to group these changes.
            var groupAuditId = Guid.NewGuid(); 

            foreach (var property in entry.Properties)
            {
                if (property.IsModified || entry.State == EntityState.Added || entry.State == EntityState.Deleted)
                {
                    string oldValue = entry.State == EntityState.Added ? string.Empty : property.OriginalValue?.ToString() ?? string.Empty;
                    string newValue = entry.State == EntityState.Deleted ? string.Empty : property.CurrentValue?.ToString() ?? string.Empty;
                    
                    // Skip if no actual value change occurred
                    if (oldValue == newValue) continue;

                    auditEntries.Add(new AuditChange
                    {
                        AuditLogId = groupAuditId,
                        EntityName = entityName,
                        PrimaryKey = primaryKey,
                        PropertyName = property.Metadata.Name,
                        OldValue = oldValue,
                        NewValue = newValue,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "System",
                        UpdatedBy = "System",
                        DeletedBy = string.Empty
                    });
                }
            }
        }

        if (auditEntries.Any())
        {
            dbContext.Set<AuditChange>().AddRange(auditEntries);
        }

        return base.SavingChanges(eventData, result);
    }
    
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        SavingChanges(eventData, result);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
