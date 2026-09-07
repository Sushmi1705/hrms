using System;
using System.Collections.Generic;

namespace HRMS.Domain.Entities.Payroll;

public class SalaryStructure
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BaseAmount { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<SalaryComponent> Components { get; set; } = new List<SalaryComponent>();
}

public class SalaryComponent
{
    public Guid Id { get; set; }
    public Guid SalaryStructureId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Allowance, Deduction, Bonus
    public decimal Value { get; set; } // Can be percentage or flat amount
    public bool IsPercentage { get; set; }
    
    public SalaryStructure? SalaryStructure { get; set; }
}
