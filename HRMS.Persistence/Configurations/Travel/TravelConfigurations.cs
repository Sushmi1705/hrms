using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HRMS.Domain.Entities.Travel;

namespace HRMS.Persistence.Configurations.Travel;

public class TravelRequestConfiguration : IEntityTypeConfiguration<TravelRequest>
{
    public void Configure(EntityTypeBuilder<TravelRequest> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.CostCenter).WithMany().HasForeignKey(e => e.CostCenterId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.TravelRequest).WithMany().HasForeignKey(e => e.TravelRequestId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(e => e.ItineraryItems).WithOne(e => e.Trip).HasForeignKey(e => e.TripId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(e => e.Expenses).WithOne(e => e.Trip).HasForeignKey(e => e.TripId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class TravelAdvanceConfiguration : IEntityTypeConfiguration<TravelAdvance>
{
    public void Configure(EntityTypeBuilder<TravelAdvance> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.TravelRequest).WithMany().HasForeignKey(e => e.TravelRequestId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class ExpenseCategoryConfiguration : IEntityTypeConfiguration<ExpenseCategory>
{
    public void Configure(EntityTypeBuilder<ExpenseCategory> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasIndex(e => new { e.TenantId, e.Code }).IsUnique();
    }
}

public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Category).WithMany().HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.ExpenseReport).WithMany(e => e.Expenses).HasForeignKey(e => e.ExpenseReportId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class ExpenseReportConfiguration : IEntityTypeConfiguration<ExpenseReport>
{
    public void Configure(EntityTypeBuilder<ExpenseReport> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.Employee).WithMany().HasForeignKey(e => e.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(e => e.Trip).WithMany().HasForeignKey(e => e.TripId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(e => new { e.TenantId, e.ReportNumber }).IsUnique();
    }
}

public class ExpensePolicyRuleConfiguration : IEntityTypeConfiguration<ExpensePolicyRule>
{
    public void Configure(EntityTypeBuilder<ExpensePolicyRule> builder)
    {
        builder.HasQueryFilter(e => !e.IsDeleted);
        builder.HasOne(e => e.Category).WithMany().HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.Restrict);
    }
}
