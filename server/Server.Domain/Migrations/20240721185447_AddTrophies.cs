using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddTrophies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trophy",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateAchieved = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    TrophyType = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    AvidReviewer_amount = table.Column<int>(type: "int", nullable: true),
                    AvgRating = table.Column<float>(type: "real", nullable: true),
                    isBeta = table.Column<bool>(type: "bit", nullable: true),
                    DateJoined = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    BookAddict_amount = table.Column<int>(type: "int", nullable: true),
                    Commentator_amount = table.Column<int>(type: "int", nullable: true),
                    PRContributed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    amount = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trophy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trophy_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trophy_CustomerId",
                table: "Trophy",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trophy");
        }
    }
}
