using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Saitynai.Migrations
{
    /// <inheritdoc />
    public partial class initialstructures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Coaches_CoachId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_CoachId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Coaches",
                newName: "PhoneNumber");

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "Gyms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Gyms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Gyms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Customers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Customers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Coaches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Coaches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Coaches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Workouts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    WorkoutDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Difficulty = table.Column<string>(type: "text", nullable: false),
                    CaloriesBurned = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    MaxParticipants = table.Column<int>(type: "integer", nullable: false),
                    CoachId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workouts_Coaches_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Coaches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Workouts_CoachId",
                table: "Workouts",
                column: "CoachId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Workouts");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Gyms");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Gyms");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Gyms");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Coaches");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Coaches");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Coaches",
                newName: "Name");

            migrationBuilder.AddColumn<int>(
                name: "CoachId",
                table: "Customers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_CoachId",
                table: "Customers",
                column: "CoachId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Coaches_CoachId",
                table: "Customers",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
