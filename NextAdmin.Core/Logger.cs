using System;
using System.Collections.Generic;
using System.Linq;

namespace NextAdmin.Core
{
    public class Logger
    {
        public List<LogEvent> Events { get; set; } = new List<LogEvent>();


        public Logger LogError(string message)
        {
            Events.Add(new LogEvent
            {
                Type = LogEventType.Error,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public void ThrowError(string message)
        {
            LogError(message);
            throw new TaskLoggerErrorException(message);
        }

        public Logger LogWarning(string message)
        {
            Events.Add(new LogEvent
            {
                Type = LogEventType.Warning,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public Logger LogInfo(string message)
        {
            Events.Add(new LogEvent
            {
                Type = LogEventType.Info,
                Message = message,
                Date = DateTime.Now
            });
            return this;
        }

        public string BuildHtmlTrace()
        {
            string html = "";
            foreach (var ev in Events)
            {
                html += "<b style=\"color:" + GetEventTypeColor(ev.Type) + "\">" + ev.Date + "</b>:" + ev.Message + "<br />\n";
            }
            return html;
        }


        public static string GetEventTypeColor(LogEventType eventType)
        {
            switch (eventType)
            {
                case LogEventType.Info:
                    return "#00aeff";
                case LogEventType.Warning:
                    return "#ffa200";
                case LogEventType.Error:
                    return "#ff0000";
                default:
                    return "#000000";
            }
        }

        public bool HasError()
        {
            return Events.Any(e => e.Type == LogEventType.Error);
        }



    }

    public class TaskLoggerErrorException : Exception
    {
        public TaskLoggerErrorException(string message) : base(message)
        {
        }
    }


    public class LogEvent
    {

        public DateTime Date { get; set; }

        public string? Message { get; set; }

        public LogEventType Type { get; set; }

    }


    public enum LogEventType
    {
        Info = 0,
        Warning = 1,
        Error = 2,
    }
}
