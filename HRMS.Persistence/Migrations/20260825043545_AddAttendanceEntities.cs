using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HRMS.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendanceEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClockInDevice",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockInIpAddress",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockInLocation",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockInPhotoUrl",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockOutDevice",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockOutIpAddress",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockOutLocation",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClockOutPhotoUrl",
                table: "AttendanceLogs",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AttendanceBreaks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AttendanceLogId = table.Column<Guid>(type: "uuid", nullable: false),
                    BreakStartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BreakEndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BreakType = table.Column<string>(type: "text", nullable: true),
                    Remarks = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceBreaks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Holidays",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    BranchId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Holidays", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Overtimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Hours = table.Column<decimal>(type: "numeric", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ApprovedById = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Overtimes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    DurationHours = table.Column<decimal>(type: "numeric", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ApprovedById = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShiftAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    ShiftId = table.Column<Guid>(type: "uuid", nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftAssignments", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttendanceBreaks");

            migrationBuilder.DropTable(
                name: "Holidays");

            migrationBuilder.DropTable(
                name: "Overtimes");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "ShiftAssignments");

            migrationBuilder.DropColumn(
                name: "ClockInDevice",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockInIpAddress",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockInLocation",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockInPhotoUrl",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockOutDevice",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockOutIpAddress",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockOutLocation",
                table: "AttendanceLogs");

            migrationBuilder.DropColumn(
                name: "ClockOutPhotoUrl",
                table: "AttendanceLogs");
        }
    }
}
