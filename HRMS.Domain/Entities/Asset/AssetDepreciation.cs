using System;
using HRMS.Domain.Entities.Organization;

namespace HRMS.Domain.Entities.Asset;

public class AssetDepreciation : BaseAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset? Asset { get; set; }
    
    public DateTime PeriodDate { get; set; } = DateTime.UtcNow;
    public int Year { get; set; } = DateTime.UtcNow.Year;
    public int Month { get; set; } = DateTime.UtcNow.Month;
    
    // Method: StraightLine, DecliningBalance
    public string Method { get; set; } = "StraightLine";
    
    public decimal StartingBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal EndingBookValue { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    
    public bool IsCalculated { get; set; } = true;
    public string Notes { get; set; } = string.Empty;
}
