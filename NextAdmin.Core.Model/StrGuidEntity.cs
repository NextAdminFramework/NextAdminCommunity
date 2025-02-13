using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace NextAdmin.Core.Model
{
    public abstract class StrGuidEntity : Entity
    {

        [Key, MaxLength(38), Required]
        public string Id { get; set; }


        public StrGuidEntity()
        {
            AssignPrimaryKey(null);
        }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            if (args.Entry.State == EntityState.Added || args.Entry.State == EntityState.Modified)
            {
                Id = new Guid(Id).ToString();
            }
            base.OnSave(dbContext, args);
        }

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {
            if (String.IsNullOrEmpty(Id) || force)
            {
                Id = Guid.NewGuid().ToString();
            }
        }
    }
}
