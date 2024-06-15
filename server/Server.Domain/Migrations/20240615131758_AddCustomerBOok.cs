using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerBOok : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookshelfBook_Books_BookIsbn",
                table: "BookshelfBook"
            );

            migrationBuilder.DropPrimaryKey(name: "PK_BookshelfBook", table: "BookshelfBook");

            migrationBuilder.DropIndex(name: "IX_BookshelfBook_BookIsbn", table: "BookshelfBook");

            migrationBuilder.DropColumn(name: "BookIsbn", table: "BookshelfBook");

            migrationBuilder.AddColumn<Guid>(
                name: "CustomerBookId",
                table: "BookshelfBook",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000")
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookshelfBook",
                table: "BookshelfBook",
                columns: new[] { "BookshelfId", "CustomerBookId" }
            );

            migrationBuilder.CreateTable(
                name: "CustomerBooks",
                columns: table =>
                    new
                    {
                        Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                        CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                        Isbn = table.Column<string>(type: "nvarchar(450)", nullable: false),
                        Ranking = table.Column<int>(type: "int", nullable: false),
                        BookIsbn = table.Column<string>(type: "nvarchar(450)", nullable: false)
                    },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerBooks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerBooks_Books_BookIsbn",
                        column: x => x.BookIsbn,
                        principalTable: "Books",
                        principalColumn: "Isbn",
                        onDelete: ReferentialAction.NoAction
                    );
                    table.ForeignKey(
                        name: "FK_CustomerBooks_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction
                    );
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfBook_CustomerBookId",
                table: "BookshelfBook",
                column: "CustomerBookId"
            );

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfBook_Isbn",
                table: "BookshelfBook",
                column: "Isbn"
            );

            migrationBuilder.CreateIndex(
                name: "IX_CustomerBooks_BookIsbn",
                table: "CustomerBooks",
                column: "BookIsbn"
            );

            migrationBuilder.CreateIndex(
                name: "IX_CustomerBooks_CustomerId_Id",
                table: "CustomerBooks",
                columns: new[] { "CustomerId", "Id" },
                unique: true
            );

            migrationBuilder.CreateIndex(
                name: "IX_CustomerBooks_Isbn",
                table: "CustomerBooks",
                column: "Isbn"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_BookshelfBook_CustomerBooks_CustomerBookId",
                table: "BookshelfBook",
                column: "CustomerBookId",
                principalTable: "CustomerBooks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookshelfBook_CustomerBooks_CustomerBookId",
                table: "BookshelfBook"
            );

            migrationBuilder.DropTable(name: "CustomerBooks");

            migrationBuilder.DropPrimaryKey(name: "PK_BookshelfBook", table: "BookshelfBook");

            migrationBuilder.DropIndex(
                name: "IX_BookshelfBook_CustomerBookId",
                table: "BookshelfBook"
            );

            migrationBuilder.DropIndex(name: "IX_BookshelfBook_Isbn", table: "BookshelfBook");

            migrationBuilder.DropColumn(name: "CustomerBookId", table: "BookshelfBook");

            migrationBuilder.AddColumn<string>(
                name: "BookIsbn",
                table: "BookshelfBook",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_BookshelfBook",
                table: "BookshelfBook",
                columns: new[] { "BookshelfId", "Isbn" }
            );

            migrationBuilder.CreateIndex(
                name: "IX_BookshelfBook_BookIsbn",
                table: "BookshelfBook",
                column: "BookIsbn"
            );

            migrationBuilder.AddForeignKey(
                name: "FK_BookshelfBook_Books_BookIsbn",
                table: "BookshelfBook",
                column: "BookIsbn",
                principalTable: "Books",
                principalColumn: "Isbn",
                onDelete: ReferentialAction.Cascade
            );
        }
    }
}
