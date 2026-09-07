using System;

namespace HRMS.Domain.Entities.Payroll;

public class Reimbursement
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string ClaimType { get; set; } = string.Empty; // Travel, Medical, Office Supplies
    public decimal ClaimAmount { get; set; }
    public decimal ApprovedAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Paid
    public string Description { get; set; } = string.Empty;
    public DateTime ClaimDate { get; set; } = DateTime.UtcNow;
}
