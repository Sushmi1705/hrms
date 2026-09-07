using System;
using System.Collections.Generic;
using HRMS.Domain.Common;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Employee;

public class EmployeeEmergencyContact : ITenantEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class EmployeeProfileChangeRequest : ITenantEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }

    public string FieldName { get; set; } = string.Empty;
    public string CurrentValue { get; set; } = string.Empty;
    public string ProposedValue { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Submitted"; // Submitted, Approved, Rejected

    public Guid? ApproverId { get; set; }
    public string? ApproverName { get; set; }
    public string? ApproverComments { get; set; }
    public DateTime? ActionDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class EmployeeHRRequest : ITenantEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }

    public string RequestNumber { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // HR, Payroll, Attendance, Leave, Benefits, Assets, Documents, IT_Support, General
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Urgent
    public string Status { get; set; } = "Submitted"; // Submitted, InProgress, WaitingForEmployee, Resolved, Closed, Rejected

    public string? AssignedTo { get; set; }
    public string? ResolutionNotes { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<EmployeeHRRequestComment> Comments { get; set; } = new List<EmployeeHRRequestComment>();
}

public class EmployeeHRRequestComment : ITenantEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid EmployeeHRRequestId { get; set; }
    public EmployeeHRRequest? EmployeeHRRequest { get; set; }

    public string AuthorName { get; set; } = string.Empty;
    public string AuthorRole { get; set; } = string.Empty; // Employee, HRAdmin, Manager, SupportAgent
    public string Message { get; set; } = string.Empty;
    public bool IsInternal { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
