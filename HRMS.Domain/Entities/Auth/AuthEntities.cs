using System;
using System.Collections.Generic;
using HRMS.Domain.Entities.Employee;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Auth;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; } = Guid.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public Guid? UpdatedBy { get; set; }
    public string UpdatedByName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int Version { get; set; } = 1;
}

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    
    // Linked Employee
    public string EmployeeId { get; set; } = string.Empty;
    public Guid? EmployeeEntityId { get; set; }
    public EmployeeEntity? Employee { get; set; }

    // Organization Links
    public Guid? CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;

    // Security & State
    public bool RequireMfa { get; set; }
    public bool MfaEnabled { get; set; }
    public string MfaSecret { get; set; } = string.Empty;
    public int FailedAttempts { get; set; }
    public bool IsLocked { get; set; }
    public string LockReason { get; set; } = string.Empty;
    public DateTime? LockedUntil { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string LastLoginIp { get; set; } = string.Empty;
    public bool MustChangePasswordOnNextLogin { get; set; }
    public string PasswordPolicy { get; set; } = "Standard";
    public bool AllowLogin { get; set; } = true;

    // Navigation
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
    public ICollection<PasswordHistory> PasswordHistories { get; set; } = new List<PasswordHistory>();
}

public class Role : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class UserRole
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public string AssignedBy { get; set; } = "System Administrator";
}

public class Session : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string SessionToken { get; set; } = Guid.NewGuid().ToString("N");
    public string DeviceId { get; set; } = string.Empty;
    public string DeviceType { get; set; } = "Desktop";
    public string Browser { get; set; } = "Chrome";
    public string OperatingSystem { get; set; } = "Windows 11";
    public string UserAgent { get; set; } = string.Empty;
    public string IpAddress { get; set; } = "127.0.0.1";
    public string Location { get; set; } = "HQ Office (San Francisco, CA)";
    public DateTime LoginAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(12);
    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string RevokedBy { get; set; } = string.Empty;
    public string RevocationReason { get; set; } = string.Empty;
}

public class RefreshToken : BaseEntity
{
    public Guid SessionId { get; set; }
    public Session Session { get; set; } = null!;
    public string Token { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public bool IsUsed { get; set; }
    public Guid? ReplacedByTokenId { get; set; }
}

public class PasswordHistory : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
}
