# Multi-stage Dockerfile for .NET 9 Web API on Render
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files for layer caching
COPY ["HRMS.sln", "./"]
COPY ["HRMS.Domain/HRMS.Domain.csproj", "HRMS.Domain/"]
COPY ["HRMS.Application/HRMS.Application.csproj", "HRMS.Application/"]
COPY ["HRMS.Infrastructure/HRMS.Infrastructure.csproj", "HRMS.Infrastructure/"]
COPY ["HRMS.Identity/HRMS.Identity.csproj", "HRMS.Identity/"]
COPY ["HRMS.Persistence/HRMS.Persistence.csproj", "HRMS.Persistence/"]
COPY ["HRMS.Shared/HRMS.Shared.csproj", "HRMS.Shared/"]
COPY ["HRMS.Tests/HRMS.Tests.csproj", "HRMS.Tests/"]
COPY ["HRMS.Api/HRMS.Api.csproj", "HRMS.Api/"]

RUN dotnet restore "HRMS.sln"

# Copy full source tree and publish
COPY . .
WORKDIR "/src/HRMS.Api"
RUN dotnet publish "HRMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Default Render port configuration
ENV PORT=10000
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 10000

ENTRYPOINT ["dotnet", "HRMS.Api.dll"]
