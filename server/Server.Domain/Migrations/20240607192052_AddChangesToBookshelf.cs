using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddChangesToBookshelf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HomelessBooks",
                table: "Bookshelves",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HomelessBooks",
                table: "Bookshelves");
        }
    }
}
