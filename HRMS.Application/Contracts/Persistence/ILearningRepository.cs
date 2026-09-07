using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HRMS.Domain.Entities.Learning;

namespace HRMS.Application.Contracts.Persistence;

public interface ILearningRepository
{
    Task<List<Course>> GetAllCoursesAsync();
    Task<Course?> GetCourseByIdAsync(Guid id);
    Task<Course> AddCourseAsync(Course course);
    Task UpdateCourseAsync(Course course);
    Task DeleteCourseAsync(Guid id);

    Task<List<CourseAssignment>> GetAssignmentsByEmployeeIdAsync(Guid employeeId);
    
    // Analytics
    Task<int> GetTotalCoursesAsync();
    Task<int> GetTotalPublishedCoursesAsync();
    Task<int> GetTotalEnrollmentsAsync();
    Task<int> GetCompletedCoursesCountAsync();
}
