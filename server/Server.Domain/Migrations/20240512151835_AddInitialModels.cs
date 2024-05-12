using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddInitialModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Isbn = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Author = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Release = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Isbn);
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.Id);
                });

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
                name: "Bookshelf",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookshelf", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookshelf_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
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
                        name: "FK_BookshelfCustomerBook_Bookshelf_BookshelvesId",
                        column: x => x.BookshelvesId,
                        principalTable: "Bookshelf",
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
                name: "IX_Bookshelf_CustomerId",
                table: "Bookshelf",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfCustomerBook_BooksCustomerId_BooksIsbn",
                table: "BookshelfCustomerBook",
                columns: new[] { "BooksCustomerId", "BooksIsbn" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "BookshelfCustomerBook");

            migrationBuilder.DropTable(
                name: "Bookshelf");

            migrationBuilder.DropTable(
                name: "CustomerBook");

            migrationBuilder.DropTable(
                name: "Customer");
        }
    }
}
