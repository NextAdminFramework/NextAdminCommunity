using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NextAdmin.Core.Model
{
    public abstract class Base64DocumentEntity : Entity, IDocument
    {
        public string Base64Data { get; set; }

        public string Name { get; set; }

        public string Extension { get; set; }

        public DateTime? CreationDate { get; set; }


        [NotMapped, JsonIgnore]
        public byte[] Data
        {
            get
            {
                return this.GetData();
            }
            set
            {
                this.SetData(value);
            }
        }

        public byte[] GetPreview()
        {
            throw new NotImplementedException();
        }

        public override void OnSave(NextAdminDbContext model, SavingArgs args)
        {
            base.OnSave(model, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.Now;
            }
        }

        public byte[] GetData()
        {
            return System.Convert.FromBase64String(Base64Data);
        }

        public void SetData(byte[] data)
        {
            Base64Data = System.Convert.ToBase64String(data);
        }

    }


    public class Base64Document : Base64DocumentEntity
    {

        [Key, MaxLength(38), Required]
        public string Id { get; set; }


        public Base64Document()
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
