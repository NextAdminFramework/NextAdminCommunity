using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    [Label]
    public class StripeInvoice : Entity, IBlobEntity
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Label]
        public string? UserId { get; set; }

        public string? UserType { get; set; }


        [JsonIgnore, Blob]
        public Invoice? StripeInvoiceData { get; set; }

        public string? SubscriptionId { get; set; }

        [JsonIgnore, ForeignKey(nameof(SubscriptionId))]
        public StripeSubscription Subscription { get; set; }

        [Required]
        public DateTime? CreationDate { get; set; }

        public string? Blob { get; set; }

        public StripeInvoice()
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
        }


        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {


        }

    }
}
