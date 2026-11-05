using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MunicipalIssueTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIssueCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Issues",
                type: "datetimeoffset",
                nullable: false,
                defaultValueSql: "TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Issues");
        }
    }
}
