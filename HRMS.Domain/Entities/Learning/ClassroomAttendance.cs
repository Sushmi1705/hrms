using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class ClassroomAttendance : BaseAuditableEntity
{
    public Guid SessionId { get; set; }
    public Guid EmployeeId { get; set; }
    public string Status { get; set; } = "Registered"; // Registered, Present, Absent
}

