using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.Model;
using Stripe;
using Stripe.Checkout;

namespace NextAdmin.FrontEnd.API.Controllers
{
    [ApiController, Route("/api/subscription/{action}/{id?}")]
    public abstract class FrontEndStripeSubscriptionPlanController<TUser, TStripeUserInvoice, TStripeUserSubscription, TStripeUserPaymentSession, TStripeUserPaymentEvent> : FrontEndStripeController<TUser, TStripeUserInvoice>
        where TUser : class, IFrontEndUser
        where TStripeUserInvoice : StripeUserInvoice<TUser>
        where TStripeUserSubscription : StripeUserSubscription<TUser>
        where TStripeUserPaymentSession : StripeUserPaymentSession<TUser>
        where TStripeUserPaymentEvent : StripeUserPaymentEvent<TUser>
    {
        public FrontEndStripeSubscriptionPlanController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
            : base(dbContext, configuration)
        {

        }


        [HttpGet]
        public virtual ApiResponse<string> GetSubscriptionStripePaymentLink(string planId)
        {
            try
            {
                if (User == null)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.AuthError);
                }

                var plan = GetPlanInfo(planId);
                var monthPrice = plan.GetMonthPrice(DbContext);
                if (!monthPrice.HasValue)
                {
                    return ApiResponse<string>.Error("INVALID_PLAN");
                }

                var service = new SessionService(new StripeClient(NextAdminFrontEndHelper.StripeApiKey));
                Session stripeSession = service.Create(new SessionCreateOptions
                {
                    Mode = "subscription",
                    SuccessUrl = GetSuccessPaymentUrl(planId),
                    CancelUrl = GetCancelPaymentUrl(planId),
                    CustomerEmail = User.UserName,
                    LineItems = new List<SessionLineItemOptions> {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions {
                                ProductData = new SessionLineItemPriceDataProductDataOptions {
                                    Name = NextAdminHelper.AppName + " : " + planId.ToString(),
                                },
                                UnitAmountDecimal = monthPrice.Value * 100,
                                Currency = "EUR",
                                Recurring = new SessionLineItemPriceDataRecurringOptions {
                                    Interval = "month",
                                    IntervalCount = 1,
                                }
                            },
                            Quantity=1
                        }
                    }
                });
                var paymentSession = DbContext.CreateEntity<TStripeUserPaymentSession>();
                paymentSession.Id = stripeSession.Id;
                paymentSession.UserId = User.Id;
                paymentSession.StripeSession = stripeSession;
                paymentSession.PurchasedElementId = planId;
                paymentSession.PaymentType = PaymentType.MonthlySubscriptionPayment;
                DbContext.AddEntity(paymentSession);
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.SQLError);
                }
                return ApiResponse<string>.Success(stripeSession.Url);
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.Error(ex);
            }
        }

        [HttpGet]
        public virtual ApiResponse CancelSubscriptionAutoRenew(string subscriptionId)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }

                var userSubscription = DbContext.Set<TStripeUserSubscription>().FirstOrDefault(a => a.Id == subscriptionId && a.UserId == User.Id);
                if (userSubscription == null)
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }

                var stripeSubscriptionService = new SubscriptionService(new StripeClient(NextAdminFrontEndHelper.StripeApiKey));
                var stripeSubscription = stripeSubscriptionService.Get(userSubscription.Id);
                if (stripeSubscription == null)
                {
                    return ApiResponse.Error("UNABLE_TO_RETRIVE_STRIPE_SUBSCRIPTION");
                }

                transaction = DbContext.Database.BeginTransaction();
                userSubscription.CancellationDate = DateTime.UtcNow;
                var dbsetSaveResult = DbContext.ValidateAndSave();
                if (!dbsetSaveResult.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.SQLError);
                }

                stripeSubscriptionService.Update(stripeSubscription.Id, new SubscriptionUpdateOptions { CancelAtPeriodEnd = true });
                transaction.Commit();
                transaction = null;
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
            finally
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
            }
        }

        [HttpGet]
        public virtual ApiResponse ResumeSubscriptionAutoRenew(string subscriptionId)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }

                var userSubscription = DbContext.Set<TStripeUserSubscription>().FirstOrDefault(a => a.Id == subscriptionId && a.UserId == User.Id);
                if (userSubscription == null)
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }

                var stripeSubscriptionService = new SubscriptionService(new StripeClient(NextAdminFrontEndHelper.StripeApiKey));
                var stripeSubscription = stripeSubscriptionService.Get(userSubscription.Id);
                if (stripeSubscription == null)
                {
                    return ApiResponse.Error("UNABLE_TO_RETRIVE_STRIPE_SUBSCRIPTION");
                }

                transaction = DbContext.Database.BeginTransaction();
                userSubscription.CancellationDate = null;
                var dbsetSaveResult = DbContext.ValidateAndSave();
                if (!dbsetSaveResult.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.SQLError);
                }

                stripeSubscriptionService.Update(stripeSubscription.Id, new SubscriptionUpdateOptions { CancelAtPeriodEnd = false });
                transaction.Commit();
                transaction = null;
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
            finally
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
            }
        }


        protected override bool HandleStripeInvoicePaymentSuccededEvent(Event stripeEvent, Invoice stripeInvoice)
        {
            base.HandleStripeInvoicePaymentSuccededEvent(stripeEvent, stripeInvoice);

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

            return DbContext.ValidateAndSave().Success;
        }

        protected override bool HandleStripeCheckoutSessionCompletedEvent(Event stripeEvent, Session stripeSession)
        {
            base.HandleStripeCheckoutSessionCompletedEvent(stripeEvent, stripeSession);
            if (stripeSession.SubscriptionId == null)
            {
                return false;
            }

            var paymentSession = DbContext.Set<TStripeUserPaymentSession>().FirstOrDefault(a => a.Id == stripeSession.Id);
            if (paymentSession == null)
            {
                throw new Exception($"Unable to find payment session {stripeSession.Id}");
            }

            var userPaymentEvent = CreateUserPaymentEvent(stripeEvent, paymentSession.UserId);
            paymentSession.PaymentCompletedEventId = userPaymentEvent.Id;

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


            return DbContext.ValidateAndSave().Success;
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


        protected abstract IPlanInfo GetPlanInfo(string planId);

        protected abstract string? GetSuccessPaymentUrl(string planId);

        protected abstract string? GetCancelPaymentUrl(string planId);
    }
}
