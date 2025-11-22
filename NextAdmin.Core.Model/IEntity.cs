
using System;
using System.Collections;
using System.Reflection;

namespace NextAdmin.Core.Model
{
    public interface IEntity
    {

        void OnCreate(NextAdminDbContext dbContext, EntityArgs args);

        void OnLoad(NextAdminDbContext dbContext, EntityArgs args);

        void OnSave(NextAdminDbContext dbContext, SavingArgs args);

        void OnDelete(NextAdminDbContext dbContext, SavingArgs args);

        void OnEndSave(NextAdminDbContext dbContext, SavingArgs args);

        void OnEndDelete(NextAdminDbContext dbContext, SavingArgs args);

        void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false);

        event EventHandler<EntityArgs> OnCreating;

        event EventHandler<EntityArgs> OnLoading;

        event EventHandler<SavingArgs> OnSaving;

        event EventHandler<SavingArgs> OnDeleting;

        event EventHandler<SavingArgs> OnEndSaving;

        event EventHandler<SavingArgs> OnEndDeleting;

    }

    public class DetailsCollectionInfo
    {
        public string DetailForeignKeyName { get; set; }

        public string MasterKeyName { get; set; }

        public bool? AutoLoad { get; set; }

        public bool? AutoUpdate { get; set; }

        public bool? AutoDelete { get; set; }

        public PropertyInfo Property { get; set; }

        public string CollectionMemberName { get; set; }

        public string DetailEntityName { get; set; }

        public IList Collection { get; set; }

    }


    public class ForeignEntityInfo
    {
        public Type ForeignEntityType { get; set; }

        public string ForeignEntityMemberName { get; set; }

        public string ForeignEntityKeyMemberName { get; set; }

    }
}
