using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Employee;

public class EmployeeEntity : BaseAuditableEntity
{
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    public DateTime JoiningDate { get; set; }
    public DateTime DateOfBirth { get; set; }
    
    public Guid DepartmentId { get; set; }
    public Department? Department { get; set; }
    
    public Guid DesignationId { get; set; }
    public Designation? Designation { get; set; }
    
    public Guid BranchId { get; set; }
    public Branch? Branch { get; set; }
    
    public Guid? ManagerId { get; set; }
    public EmployeeEntity? Manager { get; set; }

    public Guid? CurrentShiftId { get; set; }
    public HRMS.Domain.Entities.Shift.ShiftMaster? CurrentShift { get; set; }

    public string Status { get; set; } = "Active";
}

