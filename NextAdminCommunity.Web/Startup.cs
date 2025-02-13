using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using NextAdmin.Core.API;
using System.IO;

namespace NextAdminCommunity.Web
{
    public class Startup
    {
        public static IConfiguration? Configuration { protected set; get; }

        public static string? DbConnectionString => "Data Source=" + AppDbPath;

        public static string? AppDbPath => AppDataFolder + "/" + AppDbName;

        public static string? AppDataFolder => Configuration?["AppDataFolder"];

        public static string? AppDbName => Configuration?["AppDbName"];


        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin", builder => builder.SetIsOriginAllowed((origin) => true).AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            });

            services.AddHealthChecks();
            services.AddNextAdminServices(Configuration);
            services.AddDbContext<AppDbContext>(options =>
            {
                if (!options.IsConfigured)
                {
                    options.UseSqlite(DbConnectionString);
                }
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowAnyOrigin");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseRouting();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Content")),
                RequestPath = new PathString("/Content")
            });

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    context.Response.Redirect("/app?url=" + context.Request.Path + context.Request.QueryString);
                }
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(name: "default", pattern: "{action}/{id?}", defaults: new { controller = "App", action = "Index" });
            });

            CreateOrUpdateDatabase(app);
        }

        public void CreateOrUpdateDatabase(IApplicationBuilder app)
        {
            if (!Directory.Exists(AppDataFolder))
            {
                Directory.CreateDirectory(AppDataFolder);
            }
            bool isDbExistBeforeMigration = File.Exists(AppDbPath);
            var dbContextOptions = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(DbConnectionString).Options;
            using (AppDbContext model = new AppDbContext(dbContextOptions))
            {
                model.Database.Migrate();
            }
            using (var scope = app.ApplicationServices?.GetService<IServiceScopeFactory>()?.CreateScope())
            {
                using (var dbContext = scope?.ServiceProvider.GetRequiredService<AppDbContext>())
                {
                    if (dbContext != null)
                    {
                        if (!isDbExistBeforeMigration)
                        {
                            dbContext.InitializeDatabase(new AppDbSettings
                            {
                                SuperAdminUserName = Configuration?["SuperAdminUserName"],
                                SuperAdminPassword = Configuration?["SuperAdminPassword"]
                            });
                            var result = dbContext.ValidateAndSave();
                            if (!result.Success)
                            {
                                throw new System.Exception("Unable to Initilize database");
                            }
                        }
                    }
                }
            }
        }
    }
}
