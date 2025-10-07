using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe.Checkout;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    public class StripePaymentSession : Entity, IBlobEntity
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Required, Label]
        public DateTime? CreationDate { get; set; }

        [Label]
        public string? UserId { get; set; }

        public string? UserType { get; set; }


        [JsonIgnore, Blob]
        public Session? StripeSessionData { get; set; }

        [Label]
        public string? PaymentCompletedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(PaymentCompletedEventId))]
        public StripeEvent? PaymentCompletedEvent { get; set; }

        public DateTime? PaymentCompletedDate { get; set; }

        public bool IsPaid { get; set; }

        [Label]
        public string? PaymentFailedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(PaymentFailedEventId))]
        public StripeEvent? PaymentFailedEvent { get; set; }

        [Required]
        public string? PurchasedElementId { get; set; }//order id, plan id...

        public string? PurchasedElementType { get; set; }

        public string? PurchasedElementName { get; set; }

        public double PurchasedElementAmountExcludingTax { get; set; }

        public PaymentType PaymentType { get; set; }


        [Label]
        public string? Blob { get; set; }


        public StripePaymentSession()
        {
            BlobEntity.ExtendBlobEntity(this);
        }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnSave(dbContext, args);
            if (!string.IsNullOrEmpty(PaymentCompletedEventId) && IsPaid && !PaymentCompletedDate.HasValue)
            {
                PaymentCompletedDate = DateTime.Now;
            }
        }

        public bool IsCanceled(NextAdminDbContext dbContext)
        {
            /*Should parse session events, and find if a canceled event exist*/
            throw new NotImplementedException();
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {

        }

        protected override void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnInsert(dbContext, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.Now;
            }
        }

    }
}
