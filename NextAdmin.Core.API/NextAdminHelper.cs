using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using static NextAdmin.Core.Email;

namespace NextAdmin.Core.API
{
    public static class NextAdminHelper
    {

        public static IConfiguration? Configuration { get; set; }

        public static SmtpServerAccount? AppSmtpServerAccount { get; set; }

        public static string? AdminEmailAddress => Configuration?["AdminEmailAddress"];

        public static string? AppName => Configuration?["AppName"] ?? "Next'Admin";

        public static string? AppUrl => Configuration?["AppUrl"];


        public static string? AdminAuthTokenName => Configuration?["AdminAuthTokenName"] ?? "NextAdminAuthToken";

        public static string? AuthTokenPrivateKey => Configuration?["AuthTokenPrivateKey"];


        public static void AddNextAdminServices(this IServiceCollection services, IConfiguration configuration)
        {
            Configuration = configuration;
            services.AddMvc().AddNewtonsoftJson((njo) => njo.UseCamelCasing(true));
            services.AddSingleton<IConfiguration>(configuration);
            AppSmtpServerAccount = new SmtpServerAccount
            {
                EmailServerUserName = Configuration["AppEmailUserName"],
                EmailServerPassword = Configuration["AppEmailServerPassword"],
                FullEmailAddress = Configuration["AppEmailAddress"],
                EmailDisplayName = Configuration["AppEmailDisplayName"],
                EmailEncryption = (EmailEncryptionType)int.Parse(Configuration["AppEmailSmtpServerEncryption"]),
                SmtpServerAddress = Configuration["AppEmailSmtpServerAddress"],
                SmtpServerPort = int.Parse(Configuration["AppEmailSmtpServerPort"]),
            };
        }
    }
}
