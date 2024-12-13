using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saitynai.Migrations
{
    /// <inheritdoc />
    public partial class initialstructuress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "IX_CustomerWorkouts_WorkoutId",
                table: "CustomerWorkouts",
                column: "WorkoutId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerWorkouts");
        }
    }
}
