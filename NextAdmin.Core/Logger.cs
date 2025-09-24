namespace NextAdmin.Core
{
    public class Logger
    {
        public List<LogEvent> Events { get; set; } = new List<LogEvent>();

        public string? LogFilePath { get; set; }

        public bool LogIntoConsole { get; set; }

        public Logger(string? logFilePath = null, bool logIntoConsole = false)
        {
            LogFilePath = logFilePath;
            LogIntoConsole = logIntoConsole;
        }


        public Logger LogError(string message)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Error,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public Logger LogException(string message)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Exception,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }
        public Logger LogException(string message, Exception exception)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Exception,
                Message = string.Join(':', message, exception.Message, exception.StackTrace),
                Date = DateTime.Now
            });
            return this;
        }

        public Logger LogException(Exception exception)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Exception,
                Message = string.Join(':', exception.Message, exception.StackTrace),
                Date = DateTime.Now
            });
            return this;
        }

        public Logger Log(LogEvent logEvent)
        {
            Events.Add(logEvent);
            if (LogFilePath != null)
            {
                try
                {
                    var logDirectoryPath = Path.GetDirectoryName(LogFilePath);
                    if (logDirectoryPath != null)
                    {
                        if (!Directory.Exists(logDirectoryPath))
                        {
                            Directory.CreateDirectory(logDirectoryPath);
                        }
                    }
                }
                catch
                {

                }
                File.AppendAllLines(LogFilePath, new List<string> { logEvent.GetTrace() });
            }
            if (LogIntoConsole)
            {
                Console.WriteLine(logEvent.GetTrace());
            }
            return this;
        }

        public void ThrowError(string message)
        {
            LogError(message);
            throw new TaskLoggerErrorException(message);
        }

        public void ThrowException(string message)
        {
            LogException(message);
            throw new TaskLoggerErrorException(message);
        }

        public void ThrowException(string message, Exception exception)
        {
            LogException(message, exception);
            throw new TaskLoggerErrorException(message, exception);
        }

        public Logger LogWarning(string message)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Warning,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public Logger LogInfo(string message)
        {
            Log(new LogEvent
            {
                Type = LogEventType.Info,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public string GetHtmlTrace()
        {
            string html = "";
            foreach (var ev in Events)
            {
                html += "<b style=\"color:" + LogEvent.GetEventTypeColor(ev.Type) + "\">" + ev.Date + "</b>:" + ev.Message + "<br />\n";
            }
            return html;
        }

        public string GetTrace()
        {
            return string.Join("\r\n", Events.Select(a => a.GetTrace()));
        }


        public bool HasError()
        {
            return Events.Any(e => e.Type == LogEventType.Error);
        }

    }

    public class TaskLoggerErrorException : Exception
    {
        public TaskLoggerErrorException(string message, Exception? exception = null) : base(message, exception)
        {
        }
    }


    public class LogEvent
    {

        public DateTime Date { get; set; }

        public string? Message { get; set; }

        public LogEventType Type { get; set; }

        public string GetTrace()
        {
            return Date + " " + GetEventTypeLabel(Type) + ":" + Message ?? "";
        }

        public static string GetEventTypeColor(LogEventType eventType)
        {
            switch (eventType)
            {
                case LogEventType.Info:
                    return "#00aeff";
                case LogEventType.Warning:
                    return "#ffea00";
                case LogEventType.Error:
                    return "#d72c2c";
                case LogEventType.Exception:
                    return "#ff0000";
                default:
                    return "#000000";
            }
        }

        public static string GetEventTypeLabel(LogEventType eventType)
        {
            switch (eventType)
            {
                case LogEventType.Info:
                    return "INFO";
                case LogEventType.Warning:
                    return "WARNING";
                case LogEventType.Error:
                    return "ERROR";
                case LogEventType.Exception:
                    return "EXCEPTION";
                default:
                    return "";
            }
        }

    }


    public enum LogEventType
    {
        Info = 0,
        Warning = 1,
        Error = 2,
        Exception = 3,
    }
}
