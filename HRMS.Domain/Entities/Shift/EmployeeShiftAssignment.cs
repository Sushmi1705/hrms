using HRMS.Domain.Entities.Organization;
using HRMS.Domain.Entities.Employee;
using System;
using HRMS.Domain.Entities.Employee;

namespace HRMS.Domain.Entities.Shift;

public class EmployeeShiftAssignment : BaseAuditableEntity
{
    public Guid EmployeeId { get; set; }
    public EmployeeEntity? Employee { get; set; }
    
    public Guid ShiftId { get; set; }
    public ShiftMaster? Shift { get; set; }
    
    public DateTime EffectiveFromDate { get; set; }
    public DateTime? EffectiveToDate { get; set; }
    
    public bool IsRotating { get; set; }
    public string? RotationPattern { get; set; } // e.g., "Weekly", "Bi-Weekly"
    public string Status { get; set; } = "Active";
}


