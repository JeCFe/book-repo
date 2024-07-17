using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddShareable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ShareableBookShowcase",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerBookId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ShowRanking = table.Column<bool>(type: "bit", nullable: false),
                    ShowComment = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShareableBookShowcase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShareableBookShowcase_CustomerBooks_CustomerBookId",
                        column: x => x.CustomerBookId,
                        principalTable: "CustomerBooks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shareables",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ShowcaseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shareables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shareables_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Shareables_ShareableBookShowcase_ShowcaseId",
                        column: x => x.ShowcaseId,
                        principalTable: "ShareableBookShowcase",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ShareableBookshelf",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BookshelvesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    ShareableId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShareableBookshelf", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShareableBookshelf_Bookshelves_BookshelvesId",
                        column: x => x.BookshelvesId,
                        principalTable: "Bookshelves",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShareableBookshelf_Shareables_ShareableId",
                        column: x => x.ShareableId,
                        principalTable: "Shareables",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShareableBookshelf_BookshelvesId",
                table: "ShareableBookshelf",
                column: "BookshelvesId");

            migrationBuilder.CreateIndex(
                name: "IX_ShareableBookshelf_ShareableId",
                table: "ShareableBookshelf",
                column: "ShareableId");

            migrationBuilder.CreateIndex(
                name: "IX_ShareableBookShowcase_CustomerBookId",
                table: "ShareableBookShowcase",
                column: "CustomerBookId");

            migrationBuilder.CreateIndex(
                name: "IX_Shareables_CustomerId",
                table: "Shareables",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Shareables_ShowcaseId",
                table: "Shareables",
                column: "ShowcaseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShareableBookshelf");

            migrationBuilder.DropTable(
                name: "Shareables");

            migrationBuilder.DropTable(
                name: "ShareableBookShowcase");
        }
    }
}
