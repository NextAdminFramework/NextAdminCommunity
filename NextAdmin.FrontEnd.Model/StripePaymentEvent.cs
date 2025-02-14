using Newtonsoft.Json;
using NextAdmin.Core.Model;
using Stripe;
using System.ComponentModel.DataAnnotations;

namespace NextAdmin.FrontEnd.Model
{
    [Label]
    public class StripePaymentEvent : Entity, IBlobEntity
    {
        [Key, Required, Label]
        public string? Id { get; set; }

        [Label, JsonIgnore]
        public string? Blob { get; set; }

        [Blob]
        public Event? StripeEvent { get; set; }

        [Label, Required]
        public string? EventType { get; set; }

        [Label]
        public DateTime? CreationDate { get; set; }

        public bool IsHandeled { get; set; }

        public string? ErrorMessage { get; set; }

        public StripePaymentEvent()
        {
            BlobEntity.ExtendBlobEntity(this);
        }


        protected override void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnInsert(dbContext, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.UtcNow;
            }
            if (EventType == null && StripeEvent != null)
            {
                EventType = StripeEvent.Type;
            }
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {


        }
    }
}
