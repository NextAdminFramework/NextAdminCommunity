using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.API.ViewModels.Responses;
using NextAdmin.FrontEnd.Model;
using Stripe;
using Stripe.Checkout;

namespace NextAdmin.FrontEnd.API.Controllers
{
    public abstract class FrontEndStripeController<TUser, TStripeUserInvoice> : Controller<TUser>
        where TUser : class, IFrontEndUser
        where TStripeUserInvoice : StripeUserInvoice<TUser>
    {

        public FrontEndStripeController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
            : base(dbContext, configuration)
        {

        }



        [HttpGet]
        [HttpPost]
        public ApiResponse StripeWebhookEvent()
        {
            try
            {
                string endpointSecretKey = GetStripeEndpointScretKey();
                var streamReaderTask = new StreamReader(Request.Body).ReadToEndAsync();
                streamReaderTask.Wait(30000);
                string requestJsonData = streamReaderTask.Result;
                EventUtility.ValidateSignature(requestJsonData, Request.Headers["Stripe-Signature"], endpointSecretKey);
                HandleStripeEvent(EventUtility.ParseEvent(requestJsonData, false));
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
            return ApiResponse.Success();
        }

        protected virtual void HandleStripeEvent(Event stripeEvent)
        {
            bool isEventHandled = false;
            string errorMessage = null;
            try
            {
                if (stripeEvent.Type == "checkout.session.completed")
                {
                    isEventHandled = HandleStripeCheckoutSessionCompletedEvent(stripeEvent, stripeEvent.Data.Object as Session);
                }
                if (stripeEvent.Type == "checkout.session.async_payment_succeeded")
                {
                    isEventHandled = HandleStripeCheckoutSessionPaymentSucceededEvent(stripeEvent, stripeEvent.Data.Object as Session);
                }
                if (stripeEvent.Type == "checkout.session.async_payment_failed")
                {
                    isEventHandled = HandleStripeCheckoutSessionPaymentFailedEvent(stripeEvent, stripeEvent.Data.Object as Session);
                }
                if (stripeEvent.Type == "invoice.payment_succeeded")
                {
                    isEventHandled = HandleStripeInvoicePaymentSuccededEvent(stripeEvent, stripeEvent.Data.Object as Invoice);
                }
            }
            catch (Exception ex)
            {
                errorMessage = $"Exception: {ex.Message} ---> stack trace: {ex.StackTrace}";
            }


            if (!isEventHandled)
            {
                DbContext.DetachAllEntities();
                var paymentProviderEvent = DbContext.CreateEntity<StripePaymentEvent>();
                paymentProviderEvent.Id = stripeEvent.Id;
                paymentProviderEvent.StripeEvent = stripeEvent;
                paymentProviderEvent.ErrorMessage = errorMessage;
                DbContext.Add(paymentProviderEvent);
                var dbContextSaveResult = DbContext.ValidateAndSave();
                if (!dbContextSaveResult.Success)/*shoud log error*/
                {
                    return;
                }
            }
        }

        protected virtual bool HandleStripeCheckoutSessionCompletedEvent(Event stripeEvent, Session session)
        {
            return false;
        }

        protected virtual bool HandleStripeCheckoutSessionPaymentSucceededEvent(Event stripeEvent, Session session)
        {
            return false;
        }

        protected virtual bool HandleStripeCheckoutSessionPaymentFailedEvent(Event stripeEvent, Session session)
        {
            return false;
        }

        protected virtual bool HandleStripeInvoicePaymentSuccededEvent(Event stripeEvent, Invoice invoice)
        {
            return false;
        }


        protected virtual string GetStripeApiKey()
        {
            var key = NextAdminFrontEndHelper.StripeApiKey;
            if (key == null)
            {
                throw new Exception("NextSubscriptionPlanController.GetStripeApiKey : StripeApiKey is required");
            }
            return key;
        }

        protected virtual string GetStripeEndpointScretKey()
        {
            var key = NextAdminFrontEndHelper.StripeEndpointScretKey;
            if (key == null)
            {
                throw new Exception("NextSubscriptionPlanController.GetStripeEndpointScretKey : StripeEndpointScretKey is required");
            }
            return key;
        }

        [HttpGet]
        public ApiResponse<List<UserInvoiceDto>> GetUserInvoices()
        {
            try
            {
                if (User == null)
                {
                    return ApiResponse<List<UserInvoiceDto>>.Error(ApiResponseCode.AuthError);
                }
                return ApiResponse<List<UserInvoiceDto>>.Success(DbContext.Set<TStripeUserInvoice>().Where(a => a.UserId == User.Id)
                    .OrderByDescending(a => a.CreationDate)
                    .ToList()
                    .Select(a => new UserInvoiceDto
                    {
                        Date = a.CreationDate,
                        Code = a.StripeInvoice.Number,
                        Amount = a.StripeInvoice.AmountPaid / 100,
                        StripeInvoiceLink = a.StripeInvoice.InvoicePdf,
                    }).ToList());
            }
            catch (Exception ex)
            {
                return ApiResponse<List<UserInvoiceDto>>.Error(ex);
            }
        }


    }
}
