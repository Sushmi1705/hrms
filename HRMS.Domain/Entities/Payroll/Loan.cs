using System;

namespace HRMS.Domain.Entities.Payroll;

public class Loan
{
    public Guid Id { get; set; }
    public Guid EmployeeId { get; set; }
    public string LoanType { get; set; } = string.Empty; // Personal, Car, Home
    public decimal PrincipalAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int TenureMonths { get; set; }
    public decimal EmiAmount { get; set; }
    public decimal OutstandingAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Active, Closed
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public DateTime? DisbursalDate { get; set; }
}
