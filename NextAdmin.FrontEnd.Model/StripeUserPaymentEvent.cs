using Newtonsoft.Json;
using NextAdmin.Core.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    public abstract class StripeUserPaymentEvent<TUser> : StripePaymentEvent, ILinkedUserEntity<TUser>
        where TUser : IFrontEndUser
    {
        [Label]
        public string? UserId { get; set; }

        [JsonIgnore, ForeignKey(nameof(UserId))]
        public TUser? User { get; set; }

        public StripeUserPaymentEvent()
        {
            BlobEntity.ExtendBlobEntity(this);
        }

        public override void OnCreate(NextAdminDbContext dbContext, EntityArgs args)
        {
            base.OnCreate(dbContext, args);
            IsHandeled = true;
        }

    }
}
