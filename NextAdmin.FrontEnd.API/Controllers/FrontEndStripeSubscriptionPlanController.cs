using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
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
    [ApiController, Route("/api/stripe/subscription/{action}/{id?}")]
    public abstract class FrontEndStripeSubscriptionPlanController<TUser, TStripeUserInvoice, TStripeUserSubscription, TStripeUserPaymentSession, TStripeUserPaymentEvent> : Controller<TUser>
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

                var plan = GetSubscriptionInfo(planId);
                var monthPrice = plan.GetMonthPrice(DbContext);
                var planName = plan.GetItemName(DbContext);
                if (!monthPrice.HasValue)
                {
                    return ApiResponse<string>.Error("INVALID_PLAN");
                }

                var service = new SessionService(new StripeClient(GetStripeSecretApiKey()));
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
                                    Name = planName,
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
                paymentSession.PurchasedElementType = plan.GetItemType(DbContext);
                paymentSession.PurchasedElementAmountExcludingTax = (double)monthPrice;
                paymentSession.PurchasedElementName = planName;
                paymentSession.PaymentType = PaymentType.MonthlySubscriptionPayment;
                DbContext.AddEntity(paymentSession);
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    return ApiResponse<string>.Error(ApiResponseCode.DbError);
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

                var stripeSubscriptionService = new SubscriptionService(new StripeClient(NextAdminFrontEndHelper.StripeSecretApiKey));
                var stripeSubscription = stripeSubscriptionService.Get(userSubscription.Id);
                if (stripeSubscription == null)
                {
                    return ApiResponse.Error("UNABLE_TO_RETRIVE_STRIPE_SUBSCRIPTION");
                }

                transaction = DbContext.Database.BeginTransaction();
                userSubscription.CancellationDate = DateTime.Now;
                var dbsetSaveResult = DbContext.ValidateAndSave();
                if (!dbsetSaveResult.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.DbError);
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

                var stripeSubscriptionService = new SubscriptionService(new StripeClient(NextAdminFrontEndHelper.StripeSecretApiKey));
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
                    return ApiResponse.Error(ApiResponseCode.DbError);
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

        protected virtual string GetStripeSecretApiKey()
        {
            var key = NextAdminFrontEndHelper.StripeSecretApiKey;
            if (key == null)
            {
                throw new Exception("FrontEndStripeWebhookController.GetStripeApiKey : StripeApiKey is required");
            }
            return key;
        }


        protected abstract ISubscriptionInfo GetSubscriptionInfo(string planId);

        protected abstract string? GetSuccessPaymentUrl(string planId);

        protected abstract string? GetCancelPaymentUrl(string planId);

    }
}
