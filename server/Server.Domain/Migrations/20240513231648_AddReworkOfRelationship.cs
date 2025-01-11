using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddReworkOfRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookshelfCustomerBook");

            migrationBuilder.DropTable(
                name: "CustomerBook");

            migrationBuilder.CreateTable(
                name: "BookshelfBook",
                columns: table => new
                {
                    BookshelfId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Isbn = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    BookIsbn = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookshelfBook", x => new { x.BookshelfId, x.Isbn });
                    table.ForeignKey(
                        name: "FK_BookshelfBook_Books_BookIsbn",
                        column: x => x.BookIsbn,
                        principalTable: "Books",
                        principalColumn: "Isbn",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookshelfBook_Bookshelves_BookshelfId",
                        column: x => x.BookshelfId,
                        principalTable: "Bookshelves",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfBook_BookIsbn",
                table: "BookshelfBook",
                column: "BookIsbn");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookshelfBook");

            migrationBuilder.CreateTable(
                name: "CustomerBook",
                columns: table => new
                {
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Isbn = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerBook", x => new { x.CustomerId, x.Isbn });
                });

            migrationBuilder.CreateTable(
                name: "BookshelfCustomerBook",
                columns: table => new
                {
                    BookshelvesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BooksCustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BooksIsbn = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookshelfCustomerBook", x => new { x.BookshelvesId, x.BooksCustomerId, x.BooksIsbn });
                    table.ForeignKey(
                        name: "FK_BookshelfCustomerBook_Bookshelves_BookshelvesId",
                        column: x => x.BookshelvesId,
                        principalTable: "Bookshelves",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookshelfCustomerBook_CustomerBook_BooksCustomerId_BooksIsbn",
                        columns: x => new { x.BooksCustomerId, x.BooksIsbn },
                        principalTable: "CustomerBook",
                        principalColumns: new[] { "CustomerId", "Isbn" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfCustomerBook_BooksCustomerId_BooksIsbn",
                table: "BookshelfCustomerBook",
                columns: new[] { "BooksCustomerId", "BooksIsbn" });
        }
    }
}
