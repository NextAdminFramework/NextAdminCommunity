using Newtonsoft.Json;
using NextAdmin.Core.Model;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.FrontEnd.Model
{
    [Label]
    public class SupportMessage<TUser> : StrGuidEntity, ILinkedUserEntity<TUser>
        where TUser : IUser
    {

        [Label]
        public string? UserId { get; set; }

        [JsonIgnore, ForeignKey(nameof(UserId))]
        public TUser? User { get; set; }

        public DateTime? CreationDate { get; set; }

        public string? Message { get; set; }

        public string? UserEmail { get; set; }

        public string? SupportEmail { get; set; }

        public bool IsSuccessfullySent { get; set; }


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
