using NextAdmin.Core.API;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.Model;
using Stripe;
using Stripe.Checkout;

namespace NextAdmin.FrontEnd.API.Services
{
    public class StripeService<TUser, TStripeUserPaymentSession>
        where TUser : class, IFrontEndUser
        where TStripeUserPaymentSession : StripeUserPaymentSession<TUser>
    {
        public NextAdminDbContext DbContext { get; protected set; }


        public StripeService(NextAdminDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public TStripeUserPaymentSession CreatePaymentSession(IItemInfo item, TUser user, string? successPaymentUrl = null, string? cancelPaymentUrl = null)
        {
            var unitSalePrice = item.GetUnitSalePrice(DbContext);
            var elementName = item.GetItemName(DbContext);
            var service = new SessionService(new StripeClient(NextAdminFrontEndHelper.StripeApiKey));

            if (successPaymentUrl == null)
            {
                successPaymentUrl = NextAdminHelper.AppUrl + "/successPayment?itemId=" + item.GetItemId(DbContext);

            }
            if (cancelPaymentUrl == null)
            {
                cancelPaymentUrl = NextAdminHelper.AppUrl + "/cancelPayment?itemId=" + item.GetItemId(DbContext);
            }

            Session stripeSession = service.Create(new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl = successPaymentUrl,
                CancelUrl = cancelPaymentUrl,
                CustomerEmail = user.UserName,
                LineItems = new List<SessionLineItemOptions> {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions {
                                ProductData = new SessionLineItemPriceDataProductDataOptions {
                                    Name = elementName,
                                },
                                UnitAmountDecimal = unitSalePrice * 100,
                                Currency = "EUR",
                            },
                            Quantity=1
                        }
                    }
            });
            var paymentSession = DbContext.CreateEntity<TStripeUserPaymentSession>();
            paymentSession.Id = stripeSession.Id;
            paymentSession.UserId = user.Id;
            paymentSession.StripeSession = stripeSession;
            paymentSession.PurchasedElementId = item.GetItemId(DbContext);
            paymentSession.PurchasedElementType = item.GetItemType(DbContext);
            paymentSession.PurchasedElementAmountExcludingTax = (double)unitSalePrice;
            paymentSession.PurchasedElementName = elementName;
            paymentSession.PaymentType = PaymentType.OneTimePayment;
            return paymentSession;
        }







    }
}
