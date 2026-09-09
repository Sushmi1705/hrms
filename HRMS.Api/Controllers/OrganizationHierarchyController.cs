using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMS.Persistence;

namespace HRMS.Api.Controllers;

[ApiController]
[Route("api/v1/organization")]
public class OrganizationHierarchyController : ControllerBase
{
    private readonly HrmsDbContext _db;
    public OrganizationHierarchyController(HrmsDbContext db) { _db = db; }

    [HttpGet("hierarchy")]
    public async Task<IActionResult> GetHierarchy()
    {
        var companies = await _db.Companies
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .Include(c => c.BusinessUnits.Where(bu => !bu.IsDeleted))
                .ThenInclude(bu => bu.Branches.Where(b => !b.IsDeleted))
                    .ThenInclude(b => b.Departments.Where(d => !d.IsDeleted))
                        .ThenInclude(d => d.Designations.Where(des => !des.IsDeleted))
            .Include(c => c.BusinessUnits.Where(bu => !bu.IsDeleted))
                .ThenInclude(bu => bu.CostCenters.Where(cc => !cc.IsDeleted))
            .Include(c => c.BusinessUnits.Where(bu => !bu.IsDeleted))
                .ThenInclude(bu => bu.Branches.Where(b => !b.IsDeleted))
                    .ThenInclude(b => b.Locations.Where(l => !l.IsDeleted))
            .OrderBy(c => c.Name)
            .ToListAsync();

        var employeeCountsByDept = await _db.Employees
            .AsNoTracking()
            .Where(e => !e.IsDeleted)
            .GroupBy(e => e.DepartmentId)
            .Select(g => new { DepartmentId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.DepartmentId, x => x.Count);

        var totalEmployees = await _db.Employees.CountAsync(e => !e.IsDeleted);
        var totalJobGrades = await _db.JobGrades.CountAsync(j => !j.IsDeleted);

        var tree = companies.Select(c => new
        {
            c.Id,
            c.Code,
            c.Name,
            c.Description,
            BusinessUnits = c.BusinessUnits.Select(bu => new
            {
                bu.Id,
                bu.CompanyId,
                bu.Code,
                bu.Name,
                Branches = bu.Branches.Select(b => new
                {
                    b.Id,
                    b.BusinessUnitId,
                    b.Code,
                    b.Name,
                    Locations = b.Locations.Select(l => new
                    {
                        l.Id,
                        l.BranchId,
                        l.Code,
                        l.Name,
                        l.Address
                    }).ToList(),
                    Departments = b.Departments.Select(d => new
                    {
                        d.Id,
                        d.BranchId,
                        d.Code,
                        d.Name,
                        EmployeeCount = employeeCountsByDept.TryGetValue(d.Id, out var count) ? count : 0,
                        Designations = d.Designations.Select(des => new
                        {
                            des.Id,
                            des.DepartmentId,
                            des.Code,
                            des.Name
                        }).ToList()
                    }).ToList()
                }).ToList(),
                CostCenters = bu.CostCenters.Select(cc => new
                {
                    cc.Id,
                    cc.BusinessUnitId,
                    cc.Code,
                    cc.Name
                }).ToList()
            }).ToList()
        }).ToList();

        var totalBUs = tree.Sum(c => c.BusinessUnits.Count);
        var totalBranches = tree.Sum(c => c.BusinessUnits.Sum(bu => bu.Branches.Count));
        var totalDepts = tree.Sum(c => c.BusinessUnits.Sum(bu => bu.Branches.Sum(b => b.Departments.Count)));
        var totalDesignations = tree.Sum(c => c.BusinessUnits.Sum(bu => bu.Branches.Sum(b => b.Departments.Sum(d => d.Designations.Count))));

        return Ok(new
        {
            summary = new
            {
                totalCompanies = tree.Count,
                totalBusinessUnits = totalBUs,
                totalBranches = totalBranches,
                totalDepartments = totalDepts,
                totalDesignations,
                totalJobGrades,
                totalEmployees
            },
            tree
        });
    }
}
