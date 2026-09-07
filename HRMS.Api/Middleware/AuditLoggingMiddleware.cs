using System.Diagnostics;
using HRMS.Domain.Entities.Audit;
using HRMS.Persistence;

namespace HRMS.Api.Middleware;

public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public AuditLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        var sw = Stopwatch.StartNew();
        
        // Pass request to next middleware
        await _next(context);
        
        sw.Stop();

        // Only log API requests
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            // Resolve DbContext using scope
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();

            var auditLog = new AuditLog
            {
                UserId = Guid.Empty, // Would be fetched from claims in a real app: context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                UserName = context.User.Identity?.IsAuthenticated == true ? context.User.Identity.Name : "Anonymous",
                Module = DetermineModule(context.Request.Path),
                Action = DetermineAction(context.Request.Method),
                Category = "System",
                Severity = context.Response.StatusCode >= 400 ? "Warning" : "Info",
                IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
                UserAgent = context.Request.Headers["User-Agent"].ToString(),
                Endpoint = context.Request.Path,
                Status = context.Response.StatusCode >= 400 ? "Failed" : "Success",
                FailureReason = context.Response.StatusCode >= 400 ? $"HTTP {context.Response.StatusCode}" : string.Empty,
                ExecutionTimeMs = sw.ElapsedMilliseconds,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                UpdatedBy = "System",
                DeletedBy = string.Empty
            };

            dbContext.AuditLogs.Add(auditLog);
            await dbContext.SaveChangesAsync();
        }
    }

    private string DetermineAction(string method)
    {
        return method switch
        {
            "GET" => "View",
            "POST" => "Create",
            "PUT" => "Update",
            "DELETE" => "Delete",
            "PATCH" => "Update",
            _ => "Unknown"
        };
    }

    private string DetermineModule(string path)
    {
        var segments = path.Split('/');
        if (segments.Length >= 4) // /api/v1/{module}/...
        {
            return char.ToUpper(segments[3][0]) + segments[3].Substring(1);
        }
        return "System";
    }
}

// Extension method to easily add the middleware
public static class AuditLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseAuditLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuditLoggingMiddleware>();
    }
}
