using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using NextAdmin.Core.API.Services;
using NextAdmin.Core.Model;
using System.Globalization;

namespace NextAdmin.Core.API.Controllers
{
    public abstract class Controller<TUser> : Controller
        where TUser : class, IUser
    {
        public NextAdminDbContext DbContext { get; protected set; }

        public new TUser User { get; set; }

        public IConfiguration AppConfiguration { get; set; }

        public CultureInfo UserCulture { get; set; }

        public virtual string AuthTokenIssuer => NextAdminHelper.AppName;

        public virtual string UserAuthTokenName => NextAdminHelper.AdminAuthTokenName;



        public Controller(NextAdminDbContext? dbContext = null, IConfiguration? configuration = null)
        {
            if (dbContext != null)
            {
                DbContext = dbContext;
            }
            if (configuration != null)
            {
                AppConfiguration = configuration;
            }
        }



        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);

            StringValues languages;
            if (Request.Headers.TryGetValue("Accept-Language", out languages))
            {
                string culture = languages.FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(culture))
                {
                    try
                    {
                        string cultureCode = culture.Substring(0, 2);
                        UserCulture = new CultureInfo(cultureCode);
                    }
                    catch
                    {

                    }
                }
            }
            User = TryAuthUser();
            if (User != null && DbContext != null)
            {
                if (!string.IsNullOrEmpty(User.Culture))
                {
                    UserCulture = new CultureInfo(User.Culture.Substring(0, 2));
                }
                DbContext.Initialize(new NextAdminDbContextOptions(AppConfiguration, UserCulture, User));
            }
        }


        protected virtual string GetUserAuthToken(string authTokenName = null)
        {
            if (authTokenName == null)
            {
                authTokenName = UserAuthTokenName;
            }
            string authToken = Request.Headers[authTokenName];//search token in header
            if (string.IsNullOrWhiteSpace(authToken))//search token in urls
            {
                authToken = Request.Query[authTokenName];
            }
            if (string.IsNullOrWhiteSpace(authToken))//search token in cookies
            {
                authToken = Request.Cookies[authTokenName];
            }
            return authToken;
        }


        protected virtual TUser TryAuthUser()
        {
            if (DbContext == null)
            {
                return null;
            }
            return UserHelper.FindUserFromToken<TUser>(DbContext, new AuthTokenSerializer(), AuthTokenIssuer, GetUserAuthToken());
        }


        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
            if (DbContext != null)
            {
                DbContext.Dispose();
            }
        }



    }
}
