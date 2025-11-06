using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NextAdmin.Core.Model
{
    public abstract class LongIdEntity : Entity, ILongIdEntity
    {

        [Key, Required]
        public long? Id { get; set; }

        [NotMapped, JsonIgnore]
        public virtual PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.AutoIncrement;

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

        public override void AssignPrimaryKey(NextAdminDbContext dbContext, bool force = false)
        {
            LongIdEntityExtension.AssignPrimaryKey(this, dbContext, force);
        }

    }

    public interface ILongIdEntity : IEntity
    {

        public long? Id { get; set; }

        public virtual PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.AutoIncrement;


    }


    public static class LongIdEntityExtension
    {
        public static void AssignPrimaryKey(this ILongIdEntity _this, NextAdminDbContext dbContext, bool force = false)
        {
            if (!_this.Id.HasValue || force)
            {
                if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.RandomUniqueId)
                {
                    _this.Id = dbContext.Randomiser.NextInt64(1, Serialization.JsonMaxNumberValue);
                }
                else if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.RandomUniqueId)
                {
                    _this.Id = DateTime.Now.Ticks;
                }
                else if (_this.PrimaryKeyAssignationMode == PrimaryKeyAssignationMode.AutoIncrement)
                {
                    _this.Id = dbContext.GetNextPrimaryKeyIncrementValue(_this.GetType());
                }
            }
        }
    }


    public abstract class LongRandomIdEntity : LongIdEntity
    {

        public override PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.RandomUniqueId;

    }

    public abstract class LongTimeIdEntity : LongIdEntity
    {

        public override PrimaryKeyAssignationMode PrimaryKeyAssignationMode => PrimaryKeyAssignationMode.TimeUniqueId;

    }



}
