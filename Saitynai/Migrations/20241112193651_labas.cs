using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Saitynai.Migrations
{
    /// <inheritdoc />
    public partial class labas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workouts_Coaches_CoachId",
                table: "Workouts");

            migrationBuilder.DropTable(
                name: "Coaches");

            migrationBuilder.DropTable(
                name: "CustomerWorkouts");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Workouts_CoachId",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "CaloriesBurned",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Workouts");

            migrationBuilder.RenameColumn(
                name: "WorkoutDate",
                table: "Workouts",
                newName: "HireDate");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Workouts",
                newName: "Specialization");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Workouts",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "MaxParticipants",
                table: "Workouts",
                newName: "GymId");

            migrationBuilder.RenameColumn(
                name: "Difficulty",
                table: "Workouts",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Workouts",
                newName: "FirstName");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Workouts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Reviews",
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
                    WorkoutId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Workouts_WorkoutId",
                        column: x => x.WorkoutId,
                        principalTable: "Workouts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Workouts_GymId",
                table: "Workouts",
                column: "GymId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_WorkoutId",
                table: "Reviews",
                column: "WorkoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workouts_Gyms_GymId",
                table: "Workouts",
                column: "GymId",
                principalTable: "Gyms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workouts_Gyms_GymId",
                table: "Workouts");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Workouts_GymId",
                table: "Workouts");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Workouts");

            migrationBuilder.RenameColumn(
                name: "Specialization",
                table: "Workouts",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Workouts",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Workouts",
                newName: "Difficulty");

            migrationBuilder.RenameColumn(
                name: "HireDate",
                table: "Workouts",
                newName: "WorkoutDate");

            migrationBuilder.RenameColumn(
                name: "GymId",
                table: "Workouts",
                newName: "MaxParticipants");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Workouts",
                newName: "Description");

            migrationBuilder.AddColumn<int>(
                name: "CaloriesBurned",
                table: "Workouts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CoachId",
                table: "Workouts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "Workouts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Coaches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GymId = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    HireDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Specialization = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coaches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Coaches_Gyms_GymId",
                        column: x => x.GymId,
                        principalTable: "Gyms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateOfBirth = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerWorkouts",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    WorkoutId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerWorkouts", x => new { x.CustomerId, x.WorkoutId });
                    table.ForeignKey(
                        name: "FK_CustomerWorkouts_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerWorkouts_Workouts_WorkoutId",
                        column: x => x.WorkoutId,
                        principalTable: "Workouts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Workouts_CoachId",
                table: "Workouts",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Coaches_GymId",
                table: "Coaches",
                column: "GymId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerWorkouts_WorkoutId",
                table: "CustomerWorkouts",
                column: "WorkoutId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workouts_Coaches_CoachId",
                table: "Workouts",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
