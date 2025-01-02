using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddTrophiesAsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trophy_Customer_CustomerId",
                table: "Trophy");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Trophy",
                table: "Trophy");

            migrationBuilder.RenameTable(
                name: "Trophy",
                newName: "Trophies");

            migrationBuilder.RenameIndex(
                name: "IX_Trophy_CustomerId",
                table: "Trophies",
                newName: "IX_Trophies_CustomerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Trophies",
                table: "Trophies",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Trophies_Customer_CustomerId",
                table: "Trophies",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trophies_Customer_CustomerId",
                table: "Trophies");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Trophies",
                table: "Trophies");

            migrationBuilder.RenameTable(
                name: "Trophies",
                newName: "Trophy");

            migrationBuilder.RenameIndex(
                name: "IX_Trophies_CustomerId",
                table: "Trophy",
                newName: "IX_Trophy_CustomerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Trophy",
                table: "Trophy",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Trophy_Customer_CustomerId",
                table: "Trophy",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id");
        }
    }
}
