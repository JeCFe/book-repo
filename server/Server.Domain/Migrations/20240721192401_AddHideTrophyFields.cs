using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddHideTrophyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvidReviewer_amount",
                table: "Trophies");

            migrationBuilder.DropColumn(
                name: "BookAddict_amount",
                table: "Trophies");

            migrationBuilder.DropColumn(
                name: "Commentator_amount",
                table: "Trophies");

            migrationBuilder.DropColumn(
                name: "amount",
                table: "Trophies");

            migrationBuilder.DropColumn(
                name: "isBeta",
                table: "Trophies");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvidReviewer_amount",
                table: "Trophies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BookAddict_amount",
                table: "Trophies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Commentator_amount",
                table: "Trophies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "amount",
                table: "Trophies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isBeta",
                table: "Trophies",
                type: "bit",
                nullable: true);
        }
    }
}
