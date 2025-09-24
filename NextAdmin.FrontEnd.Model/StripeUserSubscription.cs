using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    public class StripeUserSubscription<TUser> : Entity, IBlobEntity, ILinkedUserEntity<TUser>
        where TUser : IFrontEndUser
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Label]
        public string? UserId { get; set; }

        [JsonIgnore, ForeignKey(nameof(UserId))]
        public TUser? User { get; set; }

        [JsonIgnore, Blob]
        public Subscription? StripeSubscription { get; set; }

        public string? SessionPaymentCompletedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(SessionPaymentCompletedEventId))]
        public StripeUserPaymentEvent<TUser>? SessionPaymentCompletedEvent { get; set; }

        public string? LastInvoicePayedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(LastInvoicePayedEventId))]
        public StripeUserPaymentEvent<TUser>? LastInvoicePayedEvent { get; set; }

        [Required]
        public DateTime? CreationDate { get; set; }

        public DateTime? CancellationDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        [Required]
        public string? PurchasedElementId { get; set; }//order id, plan id...

        public PaymentType PaymentType { get; set; }

        public string? Blob { get; set; }

        public StripeUserSubscription()
        {
            BlobEntity.ExtendBlobEntity(this);
        }


        protected override void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnInsert(dbContext, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.Now;
            }
            if (!ExpirationDate.HasValue)
            {
                ExpirationDate = CreationDate.Value.AddDays(PaymentType == PaymentType.AnnualSubscriptionPayment ? 366 : 32);
            }
        }


        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnSave(dbContext, args);

            List<StripePaymentEvent> paymentEvents = new List<StripePaymentEvent>();

            var lastPaymentCompletedEvent = GetLastPaymentCompletedEvent(dbContext);
            if (lastPaymentCompletedEvent != null)
            {
                paymentEvents.Add(lastPaymentCompletedEvent);
            }
            var lastInvoicePayedEvent = GetLastInvoicePayedEvent(dbContext);
            if (lastInvoicePayedEvent != null)
            {
                paymentEvents.Add(lastInvoicePayedEvent);
            }
            var lastPaymentEvent = paymentEvents.OrderBy(a => a.CreationDate).LastOrDefault();
            if (lastPaymentEvent == null)
            {
                throw new Exception("UserSubscription must have at least one payment event!");
            }
            ExpirationDate = lastPaymentEvent.CreationDate.Value.AddDays(PaymentType == PaymentType.AnnualSubscriptionPayment ? 366 : 32);
        }



        public StripeUserPaymentEvent<TUser>? GetLastPaymentCompletedEvent(NextAdminDbContext dbContext)
        {
            if (SessionPaymentCompletedEvent != null)
            {
                return SessionPaymentCompletedEvent;
            }
            if (SessionPaymentCompletedEventId == null)
            {
                return null;
            }
            return dbContext.Set<StripePaymentEvent>().FirstOrDefault(a => a.Id == SessionPaymentCompletedEventId) as StripeUserPaymentEvent<TUser>;
        }

        public StripeUserPaymentEvent<TUser>? GetLastInvoicePayedEvent(NextAdminDbContext dbContext)
        {
            if (LastInvoicePayedEvent != null)
            {
                return LastInvoicePayedEvent;
            }
            if (LastInvoicePayedEventId == null)
            {
                return null;
            }
            return dbContext.Set<StripePaymentEvent>().FirstOrDefault(a => a.Id == LastInvoicePayedEventId) as StripeUserPaymentEvent<TUser>;
        }


        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {


        }
    }
}
