using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextAdminCommunity.Web.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", maxLength: 38, nullable: false),
                    UserName = table.Column<string>(type: "TEXT", nullable: false),
                    Culture = table.Column<string>(type: "TEXT", nullable: true),
                    EncryptedPassword = table.Column<string>(type: "TEXT", nullable: false),
                    Disabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUsers", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminUsers");
        }
    }
}
