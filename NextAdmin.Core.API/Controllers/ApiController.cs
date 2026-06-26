using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using NextAdmin.Core.API.Attrbutes;
using NextAdmin.Core.API.Services;
using NextAdmin.Core.Model;
using System.Globalization;
using System.Reflection;

namespace NextAdmin.Core.API.Controllers
{

    public abstract class Controller<TDbContext> : Controller
        where TDbContext : NextAdminDbContext
    {
        public TDbContext DbContext { get; protected set; }

        public Logger RequestLogger { get; set; }

        public IConfiguration AppConfiguration { get; set; }

        public virtual SmtpServerAccount AppSmtpServerAccount
        {
            get
            {
                if (NextAdminServices.AppSmtpServerAccount == null)
                {
                    throw new Exception("No default server account configured");
                }
                return NextAdminServices.AppSmtpServerAccount;
            }
        }

        public Controller(TDbContext? dbContext = null, IConfiguration? configuration = null)
        {
            RequestLogger = new Logger();
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
            var lastMinuteTime = DateTime.Now.AddMinutes(-1);
            string apiServiceName = context?.ActionDescriptor?.DisplayName;



            string userIp = Request?.HttpContext?.Connection?.RemoteIpAddress?.ToString();
            var lastMinuteUserApiRequestLoggedEvents = NextAdminServices.LogUserApiRequest(userIp, apiServiceName).Where(a => a.Date > lastMinuteTime).ToList();
            if (lastMinuteUserApiRequestLoggedEvents.Count() > NextAdminServices.MaximumUserRequestParMinute)
            {
                NextAdminServices.LogUserEvent(userIp, "MAXIMUM_USER_REQUEST_REACHED");
                context.Result = new UnauthorizedObjectResult("MAXIMUM_USER_REQUEST_REACHED");
                return;
            }

            var methodInfo = this.GetType().GetMethod(apiServiceName.Split(' ').FirstOrDefault("").Split('.').LastOrDefault(""));//Never tested
            if (methodInfo != null)
            {
                var maxRequestCountAttribute = methodInfo.GetCustomAttribute<MaxUserMinuteRequestAttribute>();
                if (maxRequestCountAttribute != null)
                {
                    var lastMinuteUserServiceCallCount = lastMinuteUserApiRequestLoggedEvents.Where(a => a.Message.Contains(apiServiceName)).Count();
                    if (lastMinuteUserServiceCallCount > maxRequestCountAttribute.value)
                    {
                        NextAdminServices.LogUserEvent(userIp, "MAXIMUM_SERVICE_USER_REQUEST_REACHED");
                        context.Result = new UnauthorizedObjectResult("MAXIMUM_SERVICE_USER_REQUEST_REACHED");
                        return;
                    }
                }
            }







        }
    }


    public abstract class ApiController : Controller<NextAdminDbContext>
    {
        public ApiController(NextAdminDbContext? dbContext = null, IConfiguration? configuration = null)
            : base(dbContext, configuration)
        {

        }
    }


    public abstract class ApiController<TUser> : ApiController
        where TUser : class, IUser
    {

        public new TUser User { get; set; }

        public CultureInfo UserCulture { get; set; }

        public virtual string AuthTokenIssuer => NextAdminServices.AppName;

        public virtual string UserAuthTokenName => NextAdminServices.AdminAuthTokenName;

        public ApiController(NextAdminDbContext? dbContext = null, IConfiguration? configuration = null) : base(dbContext, configuration)
        {

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
