using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using HRMS.Persistence;
using HRMS.Api.Middleware;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// NSwag OpenAPI setup
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "v1";
    config.Title = "HRMS Authentication API";
    config.Version = "v1";
    config.Description = "API for the Enterprise HRMS System";
});

builder.Services.AddDbContext<HrmsDbContext>(options =>
    options.UseInMemoryDatabase("HRMS")
           .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning)));



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer();

builder.Services.AddScoped<HRMS.Application.Interfaces.Repositories.IOrganizationRepository, HRMS.Persistence.Repositories.OrganizationRepository>();
builder.Services.AddScoped<HRMS.Application.Interfaces.Repositories.IUserRepository, HRMS.Persistence.Repositories.UserRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IAttendanceRepository, HRMS.Persistence.Repositories.Attendance.AttendanceRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IAttendanceAnalyticsRepository, HRMS.Persistence.Repositories.Attendance.AttendanceAnalyticsRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IApprovalRepository, HRMS.Persistence.Repositories.ApprovalRepository>();
builder.Services.AddScoped<HRMS.Application.Interfaces.Repositories.Leave.ILeaveRepository, HRMS.Persistence.Repositories.Leave.LeaveRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IShiftRepository, HRMS.Persistence.Repositories.ShiftRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IPerformanceRepository, HRMS.Persistence.Repositories.PerformanceRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IPayrollRepository, HRMS.Persistence.Repositories.PayrollRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IRecruitmentRepository, HRMS.Persistence.Repositories.RecruitmentRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ITalentManagementRepository, HRMS.Persistence.Repositories.TalentManagementRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ILearningRepository, HRMS.Persistence.Repositories.LearningRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IWorkflowRepository, HRMS.Persistence.Repositories.WorkflowRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IAssetRepository, HRMS.Persistence.Repositories.AssetRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ICompensationRepository, HRMS.Persistence.Repositories.CompensationRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IEssRepository, HRMS.Persistence.Repositories.EssRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IMssRepository, HRMS.Persistence.Repositories.MssRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ITravelRepository, HRMS.Persistence.Repositories.TravelRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IReportRepository, HRMS.Persistence.Repositories.ReportRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Services.IWorkflowEngineService, HRMS.Persistence.Services.WorkflowEngineService>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.INotificationRepository, HRMS.Persistence.Repositories.NotificationRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.IAuditRepository, HRMS.Persistence.Repositories.AuditRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ISystemAdminRepository, HRMS.Persistence.Repositories.SystemAdminRepository>();
builder.Services.AddScoped<HRMS.Application.Contracts.Tenant.ITenantContext, HRMS.Infrastructure.Tenant.TenantContext>();
builder.Services.AddScoped<HRMS.Application.Contracts.Persistence.ITenantRepository, HRMS.Persistence.Repositories.TenantRepository>();
builder.Services.AddScoped<Microsoft.AspNetCore.Identity.IPasswordHasher<HRMS.Domain.Entities.Auth.User>, Microsoft.AspNetCore.Identity.PasswordHasher<HRMS.Domain.Entities.Auth.User>>();
builder.Services.AddScoped<HRMS.Application.Interfaces.Auth.IJwtService, HRMS.Infrastructure.Auth.JwtService>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(HRMS.Application.Features.Auth.LoginCommand).Assembly));
builder.Services.AddSignalR();
builder.Services.AddHostedService<HRMS.Api.Services.NotificationBackgroundService>();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5002";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

app.UseForwardedHeaders(new Microsoft.AspNetCore.HttpOverrides.ForwardedHeadersOptions
{
    ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor | Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedProto
});

// Enable OpenAPI & Swagger for testing on cloud deployments
app.UseOpenApi();
app.UseSwaggerUi();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<HrmsDbContext>();
    context.Database.EnsureCreated();
    
    // Call the massive bogus Database Seeder
    await HRMS.Persistence.Seeders.DatabaseSeeder.SeedAsync(app.Services);
}

app.UseCors("AllowAll");

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<TenantContextMiddleware>();
app.UseMiddleware<HRMS.Api.Middleware.AuditLoggingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

// Render Health Check endpoints
app.MapGet("/", () => Results.Ok(new { status = "Healthy", service = "HRMS.Api", timestamp = DateTime.UtcNow }));
app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

app.MapControllers();
app.MapHub<HRMS.Api.Hubs.NotificationHub>("/hubs/notification");

app.Run();


