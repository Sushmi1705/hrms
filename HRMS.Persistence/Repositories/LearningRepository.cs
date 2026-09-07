using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRMS.Application.Contracts.Persistence;
using HRMS.Domain.Entities.Learning;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Persistence.Repositories;

public class LearningRepository : ILearningRepository
{
    private readonly HrmsDbContext _context;

    public LearningRepository(HrmsDbContext context)
    {
        _context = context;
    }

    public async Task<List<Course>> GetAllCoursesAsync()
    {
        return await _context.Courses.ToListAsync();
    }

    public async Task<Course?> GetCourseByIdAsync(Guid id)
    {
        return await _context.Courses.FindAsync(id);
    }

    public async Task<Course> AddCourseAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task UpdateCourseAsync(Course course)
    {
        _context.Entry(course).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCourseAsync(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course != null)
        {
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<CourseAssignment>> GetAssignmentsByEmployeeIdAsync(Guid employeeId)
    {
        return await _context.CourseAssignments
            .Where(x => x.EmployeeId == employeeId)
            .ToListAsync();
    }

    public async Task<int> GetTotalCoursesAsync()
    {
        return await _context.Courses.CountAsync();
    }

    public async Task<int> GetTotalPublishedCoursesAsync()
    {
        return await _context.Courses.CountAsync(x => x.PublishStatus == "Published");
    }

    public async Task<int> GetTotalEnrollmentsAsync()
    {
        return await _context.CourseAssignments.CountAsync();
    }

    public async Task<int> GetCompletedCoursesCountAsync()
    {
        return await _context.CourseAssignments.CountAsync(x => x.Status == "Completed");
    }
}
