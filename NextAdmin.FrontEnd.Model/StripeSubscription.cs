using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    public class StripeSubscription : Entity, IBlobEntity
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Label]
        public string? UserId { get; set; }

        public string? UserType { get; set; }


        [JsonIgnore, Blob]
        public Subscription? StripeSubscriptionData { get; set; }

        public string? SessionPaymentCompletedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(SessionPaymentCompletedEventId))]
        public StripeEvent? SessionPaymentCompletedEvent { get; set; }

        public string? LastInvoicePayedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(LastInvoicePayedEventId))]
        public StripeEvent? LastInvoicePayedEvent { get; set; }

        [Required]
        public DateTime? CreationDate { get; set; }

        public DateTime? CancellationDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        [Required]
        public string? PurchasedElementId { get; set; }//order id, plan id...

        public PaymentType PaymentType { get; set; }

        public string? Blob { get; set; }

        public StripeSubscription()
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

            List<StripeEvent> paymentEvents = new List<StripeEvent>();

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



        public StripeEvent? GetLastPaymentCompletedEvent(NextAdminDbContext dbContext)
        {
            if (SessionPaymentCompletedEvent != null)
            {
                return SessionPaymentCompletedEvent;
            }
            if (SessionPaymentCompletedEventId == null)
            {
                return null;
            }
            return dbContext.Set<StripeEvent>().FirstOrDefault(a => a.Id == SessionPaymentCompletedEventId) as StripeEvent;
        }

        public StripeEvent? GetLastInvoicePayedEvent(NextAdminDbContext dbContext)
        {
            if (LastInvoicePayedEvent != null)
            {
                return LastInvoicePayedEvent;
            }
            if (LastInvoicePayedEventId == null)
            {
                return null;
            }
            return dbContext.Set<StripeEvent>().FirstOrDefault(a => a.Id == LastInvoicePayedEventId) as StripeEvent;
        }


        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {


        }
    }
}
