using Microsoft.EntityFrameworkCore;
using NextAdmin.Core.Model.QueryBuilder;
using System;
using System.Linq;

namespace NextAdmin.Core.Model
{
    [Index(nameof(Date), nameof(Type), nameof(IpAddress))]
    [Index(nameof(UserId))]
    public class AppEvent : StrTimeUniqueIdEntity
    {

        public DateTime? Date { get; set; }

        public string Type { get; set; }

        public string IpAddress { get; set; }

        public string UserId { get; set; }

        public string UserType { get; set; }

        public string Data { get; set; }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnSave(dbContext, args);
            if (!Date.HasValue)
            {
                Date = DateTime.Now;
            }
        }

        public override void OnCreate(NextAdminDbContext dbContext, EntityArgs args)
        {
            base.OnCreate(dbContext, args);
            Date = DateTime.Now;
        }


        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, string eventType, string eventData = null, string userId = null, string userType = null, string ipAddress = null)
        {
            var appEvent = dbContext.CreateEntity<AppEvent>(true, true);
            appEvent.Type = eventType;
            appEvent.Data = eventData;
            appEvent.IpAddress = ipAddress;
            appEvent.UserId = userId;
            appEvent.UserType = userType;

            return appEvent;
        }
        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, string eventType, string eventData = null, IUser user = null, string ipAddress = null)
        {
            return AddAppEvent(dbContext, eventType, eventData, user?.GetId()?.ToString(), user?.GetType()?.Name, ipAddress);
        }

        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, string eventType, object eventData, string userId = null, string userType = null, string ipAddress = null)
        {
            return AddAppEvent(dbContext, eventType, eventData.ToJSON(), userId, userType, ipAddress);
        }

        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, string eventType, object eventData, IUser user = null, string ipAddress = null)
        {
            return AddAppEvent(dbContext, eventType, eventData, user?.GetId()?.ToString(), user?.GetType()?.Name, ipAddress);
        }

        public static void SaveAppEvent(NextAdminDbContext dbContext, string eventType, string eventData = null, string userId = null, string userType = null, string ipAddress = null)
        {
            var appEvent = dbContext.CreateEntity<AppEvent>(true, false);
            appEvent.Type = eventType;
            appEvent.Data = eventData;
            appEvent.IpAddress = ipAddress;
            appEvent.UserId = userId;
            appEvent.UserType = userType;

            dbContext.SQLQuery(nameof(AppEvent)).Insert(
                new ColumnValue(nameof(Id), appEvent.Id),
                new ColumnValue(nameof(Date), appEvent.Date),
                new ColumnValue(nameof(Type), appEvent.Type),
                new ColumnValue(nameof(IpAddress), appEvent.IpAddress),
                new ColumnValue(nameof(UserId), appEvent.UserId),
                new ColumnValue(nameof(UserType), appEvent.UserType),
                new ColumnValue(nameof(Data), appEvent.Data)).Execute();
            /*
            dbContext.ExecuteRawSQL($"INSERT INTO {dbContext.GetEntityInfo(nameof(AppEvent)).EntityTableName} ({nameof(AppEvent.Id)}, {nameof(AppEvent.Type)}, {nameof(AppEvent.IpAddress)}, {nameof(AppEvent.UserId)}, {nameof(AppEvent.UserType)}, {nameof(AppEvent.Data)}) "
                + $"VALUES (@0, @1, @2, @3, @4, @5, @6)", appEvent.Id, appEvent.Type, appEvent.IpAddress, appEvent.UserId, appEvent.UserType, appEvent.Data);*/
        }

        public static void SaveAppEvent(NextAdminDbContext dbContext, string eventType, string eventData = null, IUser user = null, string ipAddress = null)
        {
            SaveAppEvent(dbContext, eventType, eventData, user?.GetId()?.ToString(), user?.GetType()?.Name, ipAddress);
        }

        public static void SaveAppEvent(NextAdminDbContext dbContext, string eventType, object eventData, string userId = null, string userType = null, string ipAddress = null)
        {
            SaveAppEvent(dbContext, eventType, eventData.ToJSON(), userId, userType, ipAddress);
        }

        public static void SaveAppEvent(NextAdminDbContext dbContext, string eventType, object eventData, IUser user = null, string ipAddress = null)
        {
            SaveAppEvent(dbContext, eventType, eventData.ToJSON(), user?.GetId()?.ToString(), user?.GetType()?.Name, ipAddress);
        }

        public static bool EnsureBruteForce(NextAdminDbContext dbContext, string ipAddress, string eventType, string eventData = null, int maximumAttemptPerMinute = 1)
        {
            var lastMinuteTime = DateTime.Now.AddMinutes(-1);
            var lastMinuteAttemptCount = dbContext.Set<AppEvent>().Where(a => a.Type == eventType && a.IpAddress == ipAddress && a.Date > lastMinuteTime).Count();
            if (lastMinuteAttemptCount >= maximumAttemptPerMinute)
            {
                AppEvent.SaveAppEvent(dbContext, eventType + "_" + "MAX_ATTEMPT", eventData, null, ipAddress);
                return false;
            }
            AppEvent.SaveAppEvent(dbContext, eventType, eventData, null, ipAddress);
            return true;
        }

        public static bool EnsureBruteForce(NextAdminDbContext dbContext, string ipAddress, string eventType, object eventData, int maximumAttemptPerMinute = 1)
        {
            return EnsureBruteForce(dbContext, ipAddress, eventType, eventData.ToJSON(), maximumAttemptPerMinute);
        }

    }
}
