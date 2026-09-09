using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Application.Interfaces.Repositories;

public interface IOrganizationRepository
{
    Task<T> GetByIdAsync<T>(Guid id, CancellationToken ct) where T : BaseAuditableEntity;
    Task<List<T>> GetAllAsync<T>(CancellationToken ct) where T : BaseAuditableEntity;
    Task AddAsync<T>(T entity, CancellationToken ct) where T : BaseAuditableEntity;
    Task UpdateAsync<T>(T entity, CancellationToken ct) where T : BaseAuditableEntity;
    System.Linq.IQueryable<T> Query<T>() where T : BaseAuditableEntity;
}
