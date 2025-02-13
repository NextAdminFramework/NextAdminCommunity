using System.ComponentModel.DataAnnotations;

namespace NextAdmin.Core.Model
{
    public class UniqueInt64Entity : Entity
    {

        [Key, Required]
        public long? Id { get; set; }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            if (!Id.HasValue)
            {
                AssignPrimaryKey(dbContext);
            }
            base.OnSave(dbContext, args);
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {
            if (!Id.HasValue || force)
            {
                Id = dbContext.Randomiser.NextInt64(1, Serialization.JsonMaxNumberValue);
            }
        }

    }
}
