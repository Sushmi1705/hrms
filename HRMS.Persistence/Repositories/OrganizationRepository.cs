using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HRMS.Application.Interfaces.Repositories;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Persistence.Repositories;

public class OrganizationRepository : IOrganizationRepository
{
    private readonly HrmsDbContext _db;
    public OrganizationRepository(HrmsDbContext db) { _db = db; }

    public async Task<T> GetByIdAsync<T>(Guid id, CancellationToken ct) where T : BaseAuditableEntity
    {
        return await _db.Set<T>().FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    public async Task<List<T>> GetAllAsync<T>(CancellationToken ct) where T : BaseAuditableEntity
    {
        return await _db.Set<T>().Where(x => !x.IsDeleted).ToListAsync(ct);
    }

    public async Task AddAsync<T>(T entity, CancellationToken ct) where T : BaseAuditableEntity
    {
        _db.Set<T>().Add(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync<T>(T entity, CancellationToken ct) where T : BaseAuditableEntity
    {
        _db.Set<T>().Update(entity);
        await _db.SaveChangesAsync(ct);
    }
}
