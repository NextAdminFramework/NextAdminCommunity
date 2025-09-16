using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace NextAdmin.FrontEnd.API
{
    public static class NextAdminFrontEndHelper
    {
        public static IConfiguration? Configuration { get; set; }

        public static string? StripeSecretApiKey => Configuration?["StripeSecretApiKey"];

        public static string? StripeSecretWebhookSignatureKey => Configuration?["StripeSecretWebhookSignatureKey"];

        public static void AddNextAdminFrontEndServices(this IServiceCollection services, IConfiguration configuration)
        {
            Configuration = configuration;
        }
    }
}
