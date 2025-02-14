using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe.Checkout;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    public abstract class StripeUserPaymentSession<TUser> : Entity, IBlobEntity
        where TUser : IFrontEndUser
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Required, Label]
        public DateTime? CreationDate { get; set; }

        [Required, Label]
        public string? UserId { get; set; }

        [JsonIgnore, ForeignKey(nameof(UserId))]
        public TUser? User { get; set; }

        [JsonIgnore, Blob]
        public Session? StripeSession { get; set; }

        [Label]
        public string? PaymentCompletedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(PaymentCompletedEventId))]
        public StripeUserPaymentEvent<TUser>? PaymentCompletedEvent { get; set; }


        [Label]
        public string? PaymentSuccededEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(PaymentSuccededEventId))]
        public StripeUserPaymentEvent<TUser>? PaymentSuccededEvent { get; set; }


        [Label]
        public string? PaymentFailedEventId { get; set; }

        [JsonIgnore, ForeignKey(nameof(PaymentFailedEventId))]
        public StripeUserPaymentEvent<TUser>? PaymentFailedEvent { get; set; }

        [Required]
        public string? PurchasedElementId { get; set; }//order id, plan id...

        public PaymentType PaymentType { get; set; }


        [Label]
        public string? Blob { get; set; }


        public StripeUserPaymentSession()
        {
            BlobEntity.ExtendBlobEntity(this);
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
                CreationDate = DateTime.UtcNow;
            }
        }

    }
}
