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
    public abstract class FrontEndStripePaymentController<TUser, TStripeUserPaymentSession, TStripeUserPaymentEvent> : Controller<TUser>
        where TUser : class, IFrontEndUser
        where TStripeUserPaymentSession : StripeUserPaymentSession<TUser>
        where TStripeUserPaymentEvent : StripeUserPaymentEvent<TUser>
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
                var stripeService = new StripeService<TUser, TStripeUserPaymentSession>(DbContext);
                var paymentSession = stripeService.CreatePaymentSession(item, User, GetSuccessPaymentUrl(itemId), GetCancelPaymentUrl(itemId));
                if (string.IsNullOrEmpty(paymentSession.StripeSession.Url))
                {
                    return ApiResponse<string>.Error(ApiResponseCode.UnknownError, "Unable to get Stripe payment url");
                }
                DbContext.AddEntity(paymentSession);
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.SQLError);
                }
                return ApiResponse<string>.Success(paymentSession.StripeSession.Url);
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.Error(ex);
            }
        }

        protected abstract IItemInfo? GetItemInfo(string itemId);

        protected abstract string? GetSuccessPaymentUrl(string itemId);

        protected abstract string? GetCancelPaymentUrl(string itemId);



    }
}
