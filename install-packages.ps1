$dotnet = "C:\Program Files\dotnet\dotnet.exe"

& $dotnet add HRMS.Api/HRMS.Api.csproj package Microsoft.EntityFrameworkCore.Design -v 9.0.0
& $dotnet add HRMS.Api/HRMS.Api.csproj package Serilog.AspNetCore
& $dotnet add HRMS.Api/HRMS.Api.csproj package Swashbuckle.AspNetCore
& $dotnet add HRMS.Api/HRMS.Api.csproj package Microsoft.AspNetCore.Authentication.JwtBearer -v 9.0.0

& $dotnet add HRMS.Application/HRMS.Application.csproj package MediatR
& $dotnet add HRMS.Application/HRMS.Application.csproj package FluentValidation.DependencyInjectionExtensions
& $dotnet add HRMS.Application/HRMS.Application.csproj package Mapster

& $dotnet add HRMS.Persistence/HRMS.Persistence.csproj package Microsoft.EntityFrameworkCore -v 9.0.0
& $dotnet add HRMS.Persistence/HRMS.Persistence.csproj package Npgsql.EntityFrameworkCore.PostgreSQL -v 9.0.0

& $dotnet add HRMS.Infrastructure/HRMS.Infrastructure.csproj package StackExchange.Redis
& $dotnet add HRMS.Infrastructure/HRMS.Infrastructure.csproj package Hangfire.AspNetCore
& $dotnet add HRMS.Infrastructure/HRMS.Infrastructure.csproj package Hangfire.PostgreSql
