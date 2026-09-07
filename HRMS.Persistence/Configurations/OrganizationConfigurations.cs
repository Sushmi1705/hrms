using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company> {
    public void Configure(EntityTypeBuilder<Company> b) {
        b.HasIndex(x => x.Code).IsUnique();
        b.HasIndex(x => x.Name).IsUnique();
        b.HasMany(x => x.BusinessUnits).WithOne(x => x.Company).HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Restrict);
    }
}
public class BusinessUnitConfiguration : IEntityTypeConfiguration<BusinessUnit> {
    public void Configure(EntityTypeBuilder<BusinessUnit> b) {
        b.HasIndex(x => x.Code).IsUnique();
        b.HasMany(x => x.Branches).WithOne(x => x.BusinessUnit).HasForeignKey(x => x.BusinessUnitId).OnDelete(DeleteBehavior.Restrict);
        b.HasMany(x => x.CostCenters).WithOne(x => x.BusinessUnit).HasForeignKey(x => x.BusinessUnitId).OnDelete(DeleteBehavior.Restrict);
    }
}
public class BranchConfiguration : IEntityTypeConfiguration<Branch> {
    public void Configure(EntityTypeBuilder<Branch> b) {
        b.HasIndex(x => x.Code).IsUnique();
        b.HasMany(x => x.Departments).WithOne(x => x.Branch).HasForeignKey(x => x.BranchId).OnDelete(DeleteBehavior.Restrict);
        b.HasMany(x => x.Locations).WithOne(x => x.Branch).HasForeignKey(x => x.BranchId).OnDelete(DeleteBehavior.Restrict);
    }
}
public class DepartmentConfiguration : IEntityTypeConfiguration<Department> {
    public void Configure(EntityTypeBuilder<Department> b) {
        b.HasIndex(x => x.Code).IsUnique();
        b.HasMany(x => x.Designations).WithOne(x => x.Department).HasForeignKey(x => x.DepartmentId).OnDelete(DeleteBehavior.Restrict);
    }
}
public class DesignationConfiguration : IEntityTypeConfiguration<Designation> {
    public void Configure(EntityTypeBuilder<Designation> b) => b.HasIndex(x => x.Code).IsUnique();
}
public class JobGradeConfiguration : IEntityTypeConfiguration<JobGrade> {
    public void Configure(EntityTypeBuilder<JobGrade> b) => b.HasIndex(x => x.Code).IsUnique();
}
public class LocationConfiguration : IEntityTypeConfiguration<Location> {
    public void Configure(EntityTypeBuilder<Location> b) => b.HasIndex(x => x.Code).IsUnique();
}
public class CostCenterConfiguration : IEntityTypeConfiguration<CostCenter> {
    public void Configure(EntityTypeBuilder<CostCenter> b) => b.HasIndex(x => x.Code).IsUnique();
}
