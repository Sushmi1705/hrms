namespace HRMS.Domain.Entities.Organization;

public class JobGrade : BaseAuditableEntity
{
    public string Code { get; set; }
    public string Name { get; set; }
    public int Level { get; set; }
}
