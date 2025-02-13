using Microsoft.EntityFrameworkCore;
using NextAdmin.Core.Model;
using NextAdminCommunity.Web.Models;
using NextAdminCommunity.Web.Resources;

namespace NextAdminCommunity.Web
{
    public class AppDbContext : NextAdminDbContext
    {

        public virtual DbSet<AdminUser>? AdminUsers { get; set; }

        public AppDbContext()
          : base()
        {

        }

        public AppDbContext(DbContextOptions options)
          : base(options)
        {

        }

        protected override void InitializeResources(string? languageCode)
        {
            switch (languageCode)
            {
                default:
                case "en":
                    Resources = new ResourcesEn();
                    break;
                case "fr":
                    Resources = new ResourcesFr();
                    break;
            }
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite();
            }
        }


        public void InitializeDatabase(AppDbSettings settings)
        {
            var adminUser = CreateEntity<AdminUser>();
            adminUser.Id = AdminUser.SuperAdminUserId;
            adminUser.UserName = settings.SuperAdminUserName;
            adminUser.EncryptPassword(settings.SuperAdminPassword);
            Add(adminUser);
        }

    }

    public class AppDbSettings
    {
        public string? SuperAdminUserName { get; set; }

        public string? SuperAdminPassword { get; set; }

    }


}
