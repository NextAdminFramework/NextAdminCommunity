using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace NextAdmin.Core.Model
{
    public abstract class Entity : IEntity
    {

        public event EventHandler<EntityArgs> OnCreating;

        public event EventHandler<EntityArgs> OnLoading;

        public event EventHandler<SavingArgs> OnSaving;

        public event EventHandler<SavingArgs> OnDeleting;

        public event EventHandler<SavingArgs> OnEndSaving;

        [NotMapped, JsonIgnore]
        public virtual int SaveOrder => 0;

        public event EventHandler<SavingArgs> OnEndDeleting;

        public abstract void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false);

        public virtual void OnCreate(NextAdminDbContext dbContext, EntityArgs args)
        {
            OnCreating?.Invoke(this, args);
            UpdateComputedMembers(dbContext);
        }

        public virtual void OnLoad(NextAdminDbContext dbContext, EntityArgs args)
        {
            OnLoading?.Invoke(this, args);
            this.UpdateJoinedMembers(dbContext);
            LoadDetails(dbContext);
            UpdateComputedMembers(dbContext);
        }

        [JsonIgnore]
        private bool _hasAttachedDetails = false;

        public virtual void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            if (args.Entry.State == EntityState.Added || args.Entry.State == EntityState.Modified)
            {
                SetForeignKeyStringMembersEmptyToNull();
            }
            if (!_hasAttachedDetails)
            {
                AttachDetails(dbContext);
                _hasAttachedDetails = true;
            }
            OnSaving?.Invoke(this, args);
            switch (args.Entry.State)
            {
                case EntityState.Added:
                    OnInsert(dbContext, args);
                    break;
                case EntityState.Unchanged:
                case EntityState.Modified:
                    OnUpdate(dbContext, args);
                    break;
                case EntityState.Detached:
                default:
                    break;
            }
        }

        public void SetForeignKeyStringMembersEmptyToNull()
        {
            foreach (var foreignEntityInfo in this.GetForeignEntityInfos())
            {
                if (this.GetPropertyType(foreignEntityInfo.ForeignEntityKeyMemberName) == typeof(string))
                {
                    if (this.GetMemberValue(foreignEntityInfo.ForeignEntityKeyMemberName) as string == string.Empty)
                    {
                        this.SetPropertyValue(foreignEntityInfo.ForeignEntityKeyMemberName, null);
                    }
                }
            }
        }


        public virtual void OnDelete(NextAdminDbContext dbContext, SavingArgs args)
        {
            DeleteDetails(dbContext);
            OnDeleting?.Invoke(this, args);
        }


        public virtual void OnEndSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            OnEndSaving?.Invoke(this, args);
            switch (args.Entry.State)
            {
                case EntityState.Added:
                case EntityState.Modified:
                    this.CheckValidity(dbContext, args);
                    break;
                case EntityState.Deleted:
                case EntityState.Unchanged:
                case EntityState.Detached:
                default:
                    break;
            }
        }

        public virtual void OnEndDelete(NextAdminDbContext dbContext, SavingArgs args)
        {
            OnEndDeleting?.Invoke(this, args);
        }

        public virtual void OnAfterSave(NextAdminDbContext dbContext, EntityState stateBeforeSave)
        {
            if (stateBeforeSave != EntityState.Deleted)
            {
                this.UpdateJoinedMembers(dbContext);
                UpdateComputedMembers(dbContext);
            }
        }

        public virtual void UpdateComputedMembers(NextAdminDbContext dbContext)
        {

        }

        protected virtual void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {

        }

        protected virtual void OnUpdate(NextAdminDbContext dbContext, SavingArgs args)
        {

        }
        protected virtual void CheckValidity(NextAdminDbContext dbContext, SavingArgs args)
        {

        }

        public virtual List<DetailsCollectionInfo> LoadDetails(NextAdminDbContext dbContext)
        {
            var detailInfos = this.GetDetailsInfos();
            foreach (var detailInfo in detailInfos.Where(a => a.AutoLoad.HasValue && a.AutoLoad.Value))
            {
                this.LoadDetails(dbContext, detailInfo);
            }
            return detailInfos;
        }


        public virtual List<DetailsCollectionInfo> AttachDetails(NextAdminDbContext dbContext)
        {
            var detailInfos = this.GetDetailsInfos();
            foreach (var detailInfo in detailInfos.Where(a => a.AutoUpdate.HasValue && a.AutoUpdate.Value))
            {
                this.AttachDetails(dbContext, detailInfo);
            }
            return detailInfos;
        }

        public virtual List<DetailsCollectionInfo> DeleteDetails(NextAdminDbContext dbContext)
        {
            var detailInfos = this.GetDetailsInfos();
            foreach (var detailInfo in detailInfos.Where(a => a.AutoDelete.HasValue && a.AutoDelete.Value))
            {
                var details = this.LoadDetails(dbContext, detailInfo);
                foreach (var detail in details)
                {
                    dbContext.DeleteEntity(detail);
                }
            }
            return detailInfos;
        }


    }

}
