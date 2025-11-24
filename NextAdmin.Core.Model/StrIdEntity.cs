using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.Core.Model
{
    public abstract class StrIdEntity : Entity, IStrIdEntity
    {
        [Key, MaxLength(38), Required]
        public string Id { get; set; }


        [NotMapped, JsonIgnore]
        public virtual PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.Manual;

        public override void OnCreate(NextAdminDbContext dbContext, EntityArgs args)
        {
            base.OnCreate(dbContext, args);
            if (PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.RandomUniqueId || PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.TimeUniqueId)
            {
                AssignPrimaryKey(dbContext);
            }
        }


        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            AssignPrimaryKey(dbContext);
            base.OnSave(dbContext, args);
        }


        public override void AssignPrimaryKey(NextAdminDbContext dbContext = null, bool force = false)
        {
            StrIdEntityExtension.AssignPrimaryKey(this, dbContext, force);
        }
    }

    public interface IStrIdEntity : IEntity
    {
        public string Id { get; set; }

        public PrimaryKeyAssignationMode PrimaryKeyAssignationMode { get; }


    }


    public static class StrIdEntityExtension
    {
        public static void AssignPrimaryKey(IStrIdEntity _this, NextAdminDbContext dbContext = null, bool force = false)
        {
            if (string.IsNullOrEmpty(_this.Id) || force)
            {
                if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.RandomUniqueId)
                {
                    _this.Id = Guid.NewGuid().ToString();
                }
                else if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.TimeUniqueId)
                {
                    _this.Id = TimeId.NewTimeId();
                }
                else if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.AutoIncrement)
                {
                    if (dbContext == null)
                    {
                        throw new Exception("Assign primary key to auto increment entity require db context");
                    }
                    _this.Id = dbContext.GetNextPrimaryKeyIncrementValue(_this.GetType()).ToString();
                }
            }
        }
    }

    public abstract class StrGuidIdEntity : StrIdEntity
    {

        public override PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.RandomUniqueId;

        public StrGuidIdEntity()
        {
            AssignPrimaryKey();
        }

    }

    public abstract class StrTimeUniqueIdEntity : StrIdEntity
    {

        public override PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.TimeUniqueId;

        public StrTimeUniqueIdEntity()
        {
            AssignPrimaryKey();
        }

    }

}
