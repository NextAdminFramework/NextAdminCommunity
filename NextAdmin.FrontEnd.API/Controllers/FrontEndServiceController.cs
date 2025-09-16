using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core;
using NextAdmin.Core.API;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.Model;

namespace NextAdmin.FrontEnd.API.Controllers
{
    [ApiController, Route("/api/frontEnd/service/{action}/{id?}")]
    public abstract class FrontEndServiceController<TUser, TContactMessage> : Controller<TUser>
        where TUser : class, IFrontEndUser
        where TContactMessage : ContactMessage
    {

        public virtual string ContactMessageAdminRecipientEmailAddress => NextAdminHelper.AdminEmailAddress;

        public virtual string ContactEmailSubject => NextAdminHelper.AppName + " : New support request";

        public FrontEndServiceController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
            : base(dbContext, configuration)
        {

        }

        [HttpGet]
        public ApiResponse SendContactMessage(string message, string? email = null)
        {
            try
            {
                if (email == null && User == null)
                {
                    return ApiResponse.Error("EMAIL_OR_USER_REQUIRED");
                }
                if (email == null)
                {
                    email = User.UserName;
                }
                if (!email.Contains("@"))
                {
                    return ApiResponse.Error("INVALID_EMAIL");
                }

                var supportMessage = DbContext.CreateEntity<TContactMessage>(true, true);
                supportMessage.UserId = User?.Id;
                supportMessage.AdminEmail = ContactMessageAdminRecipientEmailAddress;
                supportMessage.UserEmail = email;
                supportMessage.Message = message;

                var emailMessage = supportMessage.GetAdminNotificationEmail(DbContext);
                supportMessage.IsSuccessfullySent = AppSmtpServerAccount.TrySendEmail(emailMessage);

                if (!DbContext.ValidateAndSave().Success)
                {
                    return ApiResponse.Error(ApiResponseCode.DbError);
                }
                if (!supportMessage.IsSuccessfullySent)
                {
                    return ApiResponse.Error("UNABLE_TO_SEND_EMAIL");
                }

                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse<object>.Error(ex);
            }
        }






    }
}
