using System;

namespace NextAdmin.Core.Model
{
    public class AppEvent : StrTimeUniqueIdEntity
    {

        public DateTime? Date { get; set; }

        public string Type { get; set; }

        public string Data { get; set; }

        public string UserId { get; set; }

        public string UserType { get; set; }

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


        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, string type, string data = null, string userId = null, string userType = null)
        {
            var appEvent = dbContext.CreateEntity<AppEvent>(true, true);
            if (appEvent == null)
            {
                return null;
            }
            appEvent.Type = type;
            appEvent.Data = data;
            appEvent.UserId = userId;
            appEvent.UserType = userType;
            return appEvent;
        }

        public static AppEvent AddAppEvent(NextAdminDbContext dbContext, IUser user, string type, string data = null)
        {
            return AddAppEvent(dbContext, type, data, user?.GetId()?.ToString(), user?.GetType()?.Name);
        }

    }
}
