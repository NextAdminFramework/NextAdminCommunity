using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe;
using System.ComponentModel.DataAnnotations;

namespace NextAdmin.FrontEnd.Model
{
    public class StripeEvent : Entity, IBlobEntity
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Label]
        public string? UserId { get; set; }

        public string? UserType { get; set; }

        public string? PaymentSessionId { get; set; }

        public string? SubscriptionId { get; set; }

        public string? InvoiceId { get; set; }

        [Label, JsonIgnore]
        public string? Blob { get; set; }

        [Blob]
        public Event? StripeEventData { get; set; }

        [Label, Required]
        public string? EventType { get; set; }

        [Label]
        public DateTime? CreationDate { get; set; }

        public string? ErrorMessage { get; set; }

        public StripeEvent()
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
            if (EventType == null && StripeEventData != null)
            {
                EventType = StripeEventData.Type;
            }
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {


        }
    }
}
