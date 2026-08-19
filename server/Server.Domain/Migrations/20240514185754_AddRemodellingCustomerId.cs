using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddRemodellingCustomerId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookshelves_Customer_CustomerId",
                table: "Bookshelves"
            );
            migrationBuilder.DropPrimaryKey("PK_Customer", "Customer");
            migrationBuilder.Sql("DELETE FROM Customer");
            migrationBuilder.Sql("DELETE FROM Bookshelves");
            migrationBuilder.DropIndex(name: "IX_Customer_CustomerId", table: "Customer");

            migrationBuilder.DropColumn(name: "CustomerId", table: "Customer");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Customer",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier"
            );
            migrationBuilder.AddPrimaryKey("PK_Customer", "Customer", "Id");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Bookshelves",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Bookshelves_Customer_CustomerId",
                table: "Bookshelves",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookshelves_Customer_CustomerId",
                table: "Bookshelves"
            );

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Customer",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)"
            );

            migrationBuilder.AddColumn<string>(
                name: "CustomerId",
                table: "Customer",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: ""
            );

            migrationBuilder.AlterColumn<Guid>(
                name: "CustomerId",
                table: "Bookshelves",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Customer_CustomerId",
                table: "Customer",
                column: "CustomerId",
                unique: true
            );

            migrationBuilder.AddForeignKey(
                name: "FK_Bookshelves_Customer_CustomerId",
                table: "Bookshelves",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id"
            );
        }
    }
}
