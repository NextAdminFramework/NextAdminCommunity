using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.API.Services;
using NextAdmin.FrontEnd.Model;

namespace NextAdmin.FrontEnd.API.Controllers
{
    [ApiController, Route("/api/stripe/payment/{action}/{id?}")]
    public abstract class FrontEndStripePaymentController<TUser, TStripePaymentSession, TStripePaymentEvent> : Controller<TUser>
        where TUser : class, IUser
        where TStripePaymentSession : StripePaymentSession
        where TStripePaymentEvent : StripeEvent
    {

        public FrontEndStripePaymentController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
            : base(dbContext, configuration)
        {

        }

        [HttpGet]
        public virtual ApiResponse<string> GetItemStripePaymentLink(string itemId)
        {
            try
            {
                if (User == null)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.AuthError);
                }
                var item = GetItemInfo(itemId);
                if (item == null)
                {
                    return ApiResponse<string>.Error("INVALID_ITEM");
                }
                var stripeService = new StripeService<TUser, TStripePaymentSession>(DbContext, GetStripeSecretApiKey());
                var paymentSession = stripeService.CreatePaymentSession(item, User, GetSuccessPaymentUrl(itemId), GetCancelPaymentUrl(itemId));
                if (string.IsNullOrEmpty(paymentSession.StripeSessionData.Url))
                {
                    return ApiResponse<string>.Error(ApiResponseCode.UnknownError, "Unable to get Stripe payment url");
                }
                DbContext.AddEntity(paymentSession);
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.DbError);
                }
                return ApiResponse<string>.Success(paymentSession.StripeSessionData.Url);
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.Error(ex);
            }
        }

        protected virtual string GetStripeSecretApiKey()
        {
            var key = NextAdminFrontEndHelper.StripeSecretApiKey;
            if (key == null)
            {
                throw new Exception("FrontEndStripeWebhookController.GetStripeSecretWebhookSignatureKey : StripeApiKey is required");
            }
            return key;
        }


        protected abstract IItemInfo? GetItemInfo(string itemId);

        protected abstract string? GetSuccessPaymentUrl(string itemId);

        protected abstract string? GetCancelPaymentUrl(string itemId);



    }
}
