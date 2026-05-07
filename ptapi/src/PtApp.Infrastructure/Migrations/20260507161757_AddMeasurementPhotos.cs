using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PtApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurementPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackPhotoUrl",
                table: "BodyMeasurements",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FrontPhotoUrl",
                table: "BodyMeasurements",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SidePhotoUrl",
                table: "BodyMeasurements",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackPhotoUrl",
                table: "BodyMeasurements");

            migrationBuilder.DropColumn(
                name: "FrontPhotoUrl",
                table: "BodyMeasurements");

            migrationBuilder.DropColumn(
                name: "SidePhotoUrl",
                table: "BodyMeasurements");
        }
    }
}
