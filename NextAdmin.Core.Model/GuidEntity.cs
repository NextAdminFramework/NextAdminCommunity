using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace NextAdmin.Core.Model
{
    public abstract class GuidEntity : Entity
    {

        [Key, Required]
        public Guid? Id { get; set; }


        public GuidEntity()
        {
            AssignPrimaryKey(null);
        }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            if (args.Entry.State == EntityState.Added || args.Entry.State == EntityState.Modified)
            {
                AssignPrimaryKey(dbContext);
            }
            base.OnSave(dbContext, args);
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {
            if (Id == null || force)
            {
                Id = Guid.NewGuid();
            }
        }

    }
}
