using System;
using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Leave;

public class LeaveType : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public bool IsPaid { get; set; }
    public bool RequiresAttachment { get; set; }
    public int DefaultMaxDaysPerYear { get; set; }
    public string ColorCode { get; set; } = "#3b82f6"; // Default blue
}

public class LeavePolicy : BaseAuditableEntity
{
    public Guid LeaveTypeId { get; set; }
    public LeaveType LeaveType { get; set; } = null!;
    
    public bool CanCarryForward { get; set; }
    public int MaxCarryForwardDays { get; set; }
    public bool AllowNegativeBalance { get; set; }
    public int MaxNegativeBalance { get; set; }
    public bool ApplySandwichRule { get; set; }
    public bool IncludeHolidays { get; set; }
    public bool IncludeWeekends { get; set; }
    public bool IsEncashable { get; set; }
    public bool AvailableOnProbation { get; set; }
}

public class LeaveBalance : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;

    public Guid LeaveTypeId { get; set; }
    public LeaveType LeaveType { get; set; } = null!;

    public int Year { get; set; }

    public decimal OpeningBalance { get; set; }
    public decimal Accrued { get; set; }
    public decimal Used { get; set; }
    public decimal Pending { get; set; }
    public decimal Remaining { get; set; }
    public decimal Expired { get; set; }
    public decimal CarryForward { get; set; }
    public decimal Encashed { get; set; }
}

public class LeaveRequest : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity Employee { get; set; } = null!;

    public Guid LeaveTypeId { get; set; }
    public LeaveType LeaveType { get; set; } = null!;

    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    
    public decimal TotalDays { get; set; }
    public bool IsHalfDay { get; set; }
    public string? HalfDayType { get; set; } // "FirstHalf" or "SecondHalf"

    public string Reason { get; set; } = null!;
    public string? AttachmentUrl { get; set; }
    public string? EmergencyContact { get; set; }

    public Guid? DelegateEmployeeId { get; set; }
    public EmployeeEntity? DelegateEmployee { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Cancelled

    public Guid? ApproverId { get; set; }
    public EmployeeEntity? Approver { get; set; }
    
    public string? ApprovalComments { get; set; }
    public DateTime? ActionDate { get; set; }
}


