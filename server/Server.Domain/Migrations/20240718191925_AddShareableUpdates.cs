using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddShareableUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShareableBookshelf_Bookshelves_BookshelvesId",
                table: "ShareableBookshelf");

            migrationBuilder.RenameColumn(
                name: "BookshelvesId",
                table: "ShareableBookshelf",
                newName: "BookshelfId");

            migrationBuilder.RenameIndex(
                name: "IX_ShareableBookshelf_BookshelvesId",
                table: "ShareableBookshelf",
                newName: "IX_ShareableBookshelf_BookshelfId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShareableBookshelf_Bookshelves_BookshelfId",
                table: "ShareableBookshelf",
                column: "BookshelfId",
                principalTable: "Bookshelves",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShareableBookshelf_Bookshelves_BookshelfId",
                table: "ShareableBookshelf");

            migrationBuilder.RenameColumn(
                name: "BookshelfId",
                table: "ShareableBookshelf",
                newName: "BookshelvesId");

            migrationBuilder.RenameIndex(
                name: "IX_ShareableBookshelf_BookshelfId",
                table: "ShareableBookshelf",
                newName: "IX_ShareableBookshelf_BookshelvesId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShareableBookshelf_Bookshelves_BookshelvesId",
                table: "ShareableBookshelf",
                column: "BookshelvesId",
                principalTable: "Bookshelves",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
