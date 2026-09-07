using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HRMS.Domain.Entities.Auth;
using HRMS.Domain.Entities.Tenant;

namespace HRMS.Domain.Entities.Reports;

public class SavedReport
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid TenantId { get; set; }
    
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    [StringLength(100)]
    public string DataSource { get; set; } = string.Empty; // e.g., "Workforce", "Attendance", "Payroll"
    
    [Required]
    public string Configuration { get; set; } = "{}"; // JSON string containing fields, filters, groupings, visualizations
    
    [Required]
    [StringLength(50)]
    public string Visibility { get; set; } = "Private"; // Private, Team, Department, Company
    
    public Guid OwnerId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("TenantId")]
    public HRMS.Domain.Entities.Tenant.Tenant? Tenant { get; set; }
    
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; }
}

public class ReportSchedule
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid SavedReportId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Frequency { get; set; } = "Monthly"; // Daily, Weekly, Monthly, Quarterly
    
    [Required]
    public string Recipients { get; set; } = "[]"; // JSON array of emails or user IDs
    
    [Required]
    [StringLength(50)]
    public string Format { get; set; } = "PDF"; // PDF, Excel, CSV
    
    public bool IsActive { get; set; } = true;
    
    public DateTime? LastRunAt { get; set; }
    
    public DateTime? NextRunAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("SavedReportId")]
    public SavedReport? SavedReport { get; set; }
}

public class DashboardWidget
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid TenantId { get; set; }
    
    public Guid OwnerId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string WidgetType { get; set; } = string.Empty; // e.g., "HeadcountTrend", "PayrollCost", "CustomReport"
    
    public Guid? SavedReportId { get; set; } // If the widget is based on a custom saved report
    
    [Required]
    public string Configuration { get; set; } = "{}"; // JSON config for the widget (type of chart, title override, etc)
    
    public int PositionX { get; set; } = 0;
    public int PositionY { get; set; } = 0;
    public int Width { get; set; } = 1;
    public int Height { get; set; } = 1;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [ForeignKey("TenantId")]
    public HRMS.Domain.Entities.Tenant.Tenant? Tenant { get; set; }
    
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; }
    
    [ForeignKey("SavedReportId")]
    public SavedReport? SavedReport { get; set; }
}
