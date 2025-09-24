using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;

namespace NextAdmin.Core.Model
{
    [Index(nameof(UserName), IsUnique = true), Label()]
    public abstract class User : StrGuidEntity, IUser
    {
        [Required, Label, Previewable, MaxLength(96)]
        public string UserName { get; set; }

        [NotMapped, Label]
        public string Password { get; set; }

        [Label]
        public string Culture { get; set; }

        [JsonIgnore, Required]
        public string EncryptedPassword { get; set; }

        public string AuthProviderName { get; set; }

        public string AuthProviderToken { get; set; }

        public DateTime? CreationDate { get; set; }

        public bool Disabled { get; set; }

        public User()
        {
            this.ExtendUserEntity();
        }

        protected override void OnInsert(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnInsert(dbContext, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.Now;
            }
        }

        public string CreateAuthToken(NextAdminDbContext context, ITokenSerializer tokenSerilizer, string issuer, int duration = 30)
        {
            var claims = new List<Claim>
            {
                new Claim("userId", Id.ToString()),
                new Claim("userType", this.GetType().Name)
            };
            return tokenSerilizer.CreateTokenString(this.GetType().ToString().ToString(), DateTime.Now.AddDays(duration), issuer, claims);
        }

        public virtual object GetId()
        {
            return Id;
        }
    }
}
