using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddBookErrorsA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookErrors",
                columns: table => new
                {
                    Isbn = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Error = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    AdditionalCustomerComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookErrors", x => new { x.Isbn, x.Error });
                    table.CheckConstraint("CK_BookErrors_Error", "Error IN ('title', 'picture', 'author', 'release', 'subjects', 'pages')");
                    table.CheckConstraint("CK_BookErrors_Status", "Status IN ('pending', 'closed', 'completed')");
                    table.ForeignKey(
                        name: "FK_BookErrors_Books_Isbn",
                        column: x => x.Isbn,
                        principalTable: "Books",
                        principalColumn: "Isbn",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdminComment",
                columns: table => new
                {
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    AdminUsername = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BookErrorError = table.Column<string>(type: "nvarchar(8)", nullable: true),
                    BookErrorIsbn = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminComment", x => new { x.AdminUsername, x.Created });
                    table.ForeignKey(
                        name: "FK_AdminComment_BookErrors_BookErrorIsbn_BookErrorError",
                        columns: x => new { x.BookErrorIsbn, x.BookErrorError },
                        principalTable: "BookErrors",
                        principalColumns: new[] { "Isbn", "Error" });
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdminComment_BookErrorIsbn_BookErrorError",
                table: "AdminComment",
                columns: new[] { "BookErrorIsbn", "BookErrorError" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminComment");

            migrationBuilder.DropTable(
                name: "BookErrors");
        }
    }
}
