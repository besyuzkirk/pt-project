using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PtApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAssignedTrainer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedTrainerId",
                table: "Users",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_AssignedTrainerId",
                table: "Users",
                column: "AssignedTrainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_AssignedTrainerId",
                table: "Users",
                column: "AssignedTrainerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Users_AssignedTrainerId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_AssignedTrainerId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AssignedTrainerId",
                table: "Users");
        }
    }
}
