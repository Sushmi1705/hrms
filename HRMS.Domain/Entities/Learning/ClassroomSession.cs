using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Learning;

public class ClassroomSession : BaseAuditableEntity
{
    public Guid CourseId { get; set; }
    public Guid TrainerId { get; set; }
    public DateTime ScheduleDate { get; set; }
    public string Venue { get; set; } = string.Empty;
    public int Capacity { get; set; }
}

