using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.Model;
using Stripe;
using Stripe.Checkout;

namespace NextAdmin.FrontEnd.API.Controllers
{
    [ApiController, Route("/api/stripe/webhook/{action}/{id?}")]
    public abstract class FrontEndStripeWebhookController<TUser, TStripeUserInvoice, TStripeUserSubscription, TStripeUserPaymentSession, TStripeUserPaymentEvent> : Controller<TUser>
        where TUser : class, IFrontEndUser
        where TStripeUserInvoice : StripeUserInvoice<TUser>
        where TStripeUserSubscription : StripeUserSubscription<TUser>
        where TStripeUserPaymentSession : StripeUserPaymentSession<TUser>
        where TStripeUserPaymentEvent : StripeUserPaymentEvent<TUser>
    {

        public FrontEndStripeWebhookController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
            : base(dbContext, configuration)
        {

        }


        [HttpGet]
        [HttpPost]
        public ApiResponse HandleEvent()
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
                if (stripeEvent.Type == "checkout.session.async_payment_succeeded")//never call so removed
                {
                    //isEventHandled = HandleStripeCheckoutSessionPaymentSucceededEvent(stripeEvent, stripeEvent.Data.Object as Session);
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

        protected virtual bool HandleStripeCheckoutSessionCompletedEvent(Event stripeEvent, Session stripeSession)
        {
            var paymentSession = DbContext.Set<TStripeUserPaymentSession>().FirstOrDefault(a => a.Id == stripeSession.Id);
            if (paymentSession == null)
            {
                throw new Exception($"Unable to find payment session {stripeSession.Id}");
            }

            var userPaymentEvent = CreateUserPaymentEvent(stripeEvent, paymentSession.UserId);
            paymentSession.PaymentCompletedEventId = userPaymentEvent.Id;

            if (stripeSession.PaymentStatus == "paid")
            {
                paymentSession.IsPaid = true;
            }

            //Save subscription
            if (stripeSession.SubscriptionId != null)
            {
                var subscription = DbContext.Set<TStripeUserSubscription>().FirstOrDefault(a => a.Id == stripeSession.SubscriptionId);
                if (subscription == null)
                {
                    subscription = DbContext.CreateEntity<TStripeUserSubscription>();
                    subscription.Id = stripeSession.SubscriptionId;
                    subscription.StripeSubscription = stripeSession.Subscription;
                    subscription.UserId = paymentSession.UserId;
                    subscription.SessionPaymentCompletedEventId = userPaymentEvent.Id;
                    subscription.PurchasedElementId = paymentSession.PurchasedElementId;
                    DbContext.Add(subscription);
                }
                subscription.SessionPaymentCompletedEventId = userPaymentEvent.Id;
            }
            var saveResult = DbContext.ValidateAndSave();
            return saveResult.Success;
        }

        protected virtual bool HandleStripeCheckoutSessionPaymentFailedEvent(Event stripeEvent, Session stripeSession)
        {
            return false;
        }

        protected virtual bool HandleStripeInvoicePaymentSuccededEvent(Event stripeEvent, Invoice stripeInvoice)
        {
            if (stripeInvoice.SubscriptionId == null)
            {
                return false;
            }

            TStripeUserSubscription subscription = null;
            for (int i = 0; i < 1000; i++)
            {
                subscription = DbContext.Set<TStripeUserSubscription>().FirstOrDefault(a => a.Id == stripeInvoice.SubscriptionId);
                if (subscription != null)
                {
                    break;
                }
                Thread.Sleep(100);
            }
            if (subscription == null)
            {
                throw new Exception($"Unable to find subscription {stripeInvoice.SubscriptionId}");
            }

            var paymentSessionCompletedEvent = CreateUserPaymentEvent(stripeEvent, subscription.UserId);
            subscription.LastInvoicePayedEventId = paymentSessionCompletedEvent.Id;

            var invoice = DbContext.CreateEntity<TStripeUserInvoice>();
            invoice.Id = stripeInvoice.Id;
            invoice.StripeInvoice = stripeInvoice;
            invoice.UserId = subscription.UserId;
            invoice.SubscriptionId = subscription.Id;

            DbContext.Add(invoice);

            var saveResult = DbContext.ValidateAndSave();
            return saveResult.Success;
        }


        protected virtual string GetStripeApiKey()
        {
            var key = NextAdminFrontEndHelper.StripeApiKey;
            if (key == null)
            {
                throw new Exception("FrontEndStripeWebhookController.GetStripeApiKey : StripeApiKey is required");
            }
            return key;
        }

        protected virtual string GetStripeEndpointScretKey()
        {
            var key = NextAdminFrontEndHelper.StripeEndpointScretKey;
            if (key == null)
            {
                throw new Exception("FrontEndStripeWebhookController.GetStripeEndpointScretKey : StripeEndpointScretKey is required");
            }
            return key;
        }

        protected virtual TStripeUserPaymentEvent CreateUserPaymentEvent(Event stripeEvent, string userId)
        {
            var userPaymentEvent = DbContext.CreateEntity<TStripeUserPaymentEvent>();
            userPaymentEvent.Id = stripeEvent.Id;
            userPaymentEvent.EventType = stripeEvent.Type;
            userPaymentEvent.StripeEvent = stripeEvent;
            userPaymentEvent.UserId = userId;
            DbContext.Add(userPaymentEvent);
            return userPaymentEvent;
        }




    }
}
