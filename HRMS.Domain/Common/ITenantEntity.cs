using System;

namespace HRMS.Domain.Common;

public interface ITenantEntity
{
    Guid TenantId { get; set; }
}
