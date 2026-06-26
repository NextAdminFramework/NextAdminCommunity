using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace NextAdmin.Core.API
{
    public static class NextAdminServices
    {
        public const int MaximumMemoryLogCount = 10000;

        public static IConfiguration? AppConfiguration { get; set; }

        public static Logger? AppLogger { get; set; }

        public static SmtpServerAccount? AppSmtpServerAccount { get; set; }

        public static FtpServerAccount? AppFtpServerAccount { get; set; }

        public static string AppLogsFolder => AppConfiguration?["AppLogFolder"] ?? "../Logs";

        public static string? CurrentAppLogFilePath => Path.Combine(AppLogsFolder, "log_" + DateTime.Now.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + ".txt");

        public static string? AppFtpServerRootFolderPath { get; set; }

        public static string? AdminEmailAddress => AppConfiguration?["AdminEmailAddress"];

        public static string? AppName => AppConfiguration?["AppName"] ?? "Next'Admin";

        public static string? AppUrl => AppConfiguration?["AppUrl"];

        public static string? AdminAuthTokenName => AppConfiguration?["AdminAuthTokenName"] ?? "NextAdminAuthToken";

        public static string? AuthTokenPrivateKey => AppConfiguration?["AuthTokenPrivateKey"];

        public static int? MaximumUserRequestParMinute => AppConfiguration?.GetValue<int?>("MaximumUserRequestParMinute") ?? 1000;/*This number can't be sup. MaximumMemoryLogSize*/


        public static Dictionary<string, Dictionary<string, List<LogEvent>>> UserEvents = new Dictionary<string, Dictionary<string, List<LogEvent>>>();


        public static void AddNextAdminServices(this IServiceCollection services, IConfiguration configuration)
        {
            AppConfiguration = configuration;
            services.AddMvc().AddNewtonsoftJson((njo) => njo.UseCamelCasing(true));
            services.AddSingleton<IConfiguration>(configuration);
            AppSmtpServerAccount = new SmtpServerAccount
            {
                EmailServerUserName = AppConfiguration["AppEmailUserName"],
                EmailServerPassword = AppConfiguration["AppEmailServerPassword"],
                FullEmailAddress = AppConfiguration["AppEmailAddress"],
                EmailDisplayName = AppConfiguration["AppEmailDisplayName"],
                EmailEncryption = (EmailEncryptionType)int.Parse(AppConfiguration["AppEmailSmtpServerEncryption"]),
                SmtpServerAddress = AppConfiguration["AppEmailSmtpServerAddress"],
                SmtpServerPort = int.Parse(AppConfiguration["AppEmailSmtpServerPort"]),
            };

            if (!string.IsNullOrEmpty(AppConfiguration["AppFtpServerHostName"]))
            {
                AppFtpServerAccount = new FtpServerAccount
                {
                    ServerAddress = AppConfiguration["AppFtpServerHostName"],
                    UserName = AppConfiguration["AppFtpServerUserName"],
                    Password = AppConfiguration["AppFtpServerUserPassword"],
                };
                AppFtpServerRootFolderPath = AppConfiguration["AppFtpServerRootFolderPath"];
            }

            AppLogger = new Logger(CurrentAppLogFilePath, true, MaximumMemoryLogCount);
        }


        public static List<LogEvent> LogUserEvent(string? userIp, string eventType, string? message = null, LogEventType eventGravity = LogEventType.Info)
        {
            lock (AppLogger)
            {
                var logEvent = AppLogger?.Log($"{userIp}|{eventType}|{message}", eventGravity);
                Dictionary<string, List<LogEvent>>? userEvents;
                if (!UserEvents.TryGetValue(userIp, out userEvents))
                {
                    userEvents = new Dictionary<string, List<LogEvent>>();
                    UserEvents.Add(userIp, userEvents);
                }
                List<LogEvent>? typedUserEvents;
                if (!userEvents.TryGetValue(eventType, out typedUserEvents))
                {
                    typedUserEvents = new List<LogEvent>();
                    userEvents.Add(eventType, typedUserEvents);
                }
                if (typedUserEvents.Count > MaximumMemoryLogCount)
                {
                    typedUserEvents.RemoveAt(0);
                }
                typedUserEvents.Add(logEvent);
                return typedUserEvents;
            }
        }

        public static List<LogEvent> GetUserEvents(string userIp, string? eventType = null)
        {
            Dictionary<string, List<LogEvent>>? userEvents;
            if (!UserEvents.TryGetValue(userIp, out userEvents))
            {
                return new List<LogEvent>();
            }
            if (string.IsNullOrEmpty(eventType))
            {
                return userEvents.Values.SelectMany(a => a).ToList();
            }
            List<LogEvent>? typedUserEvents;
            if (!userEvents.TryGetValue(eventType, out typedUserEvents))
            {
                return new List<LogEvent>();
            }
            return typedUserEvents;
        }


        public static List<LogEvent> LogUserApiRequest(string? userIp, string? requestName)
        {
            return LogUserEvent(userIp, "API_REQUEST", $"service-name:{requestName ?? "Unknown"}");
        }



    }
}
