using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;

namespace NextAdmin.Core.Model
{
    [Index(nameof(UserName), IsUnique = true), Label()]
    public abstract class User : StrGuidEntity, IUser
    {
        [Required, Label, Previewable]
        public string UserName { get; set; }

        [NotMapped, Label]
        public string Password { get; set; }

        [Label]
        public string Culture { get; set; }

        [JsonIgnore, Required]
        public string EncryptedPassword { get; set; }

        public DateTime? CreationDate { get; set; }

        public bool Disabled { get; set; }

        public User()
        {
            this.ExtendUserEntity();
        }

        public string CreateAuthToken(NextAdminDbContext context, ITokenSerializer tokenSerilizer, string issuer, int duration = 30)
        {
            var claims = new List<Claim>
            {
                new Claim("userId", Id.ToString()),
                new Claim("userType", this.GetType().Name)
            };
            return tokenSerilizer.CreateTokenString(this.GetType().ToString().ToString(), DateTime.UtcNow.AddDays(duration), issuer, claims);
        }

        public static TUser FindUserFromToken<TUser>(NextAdminDbContext context, ITokenSerializer tokenSerilizer, string issuer, string tokenString)
            where TUser : class, IUser
        {
            if (string.IsNullOrEmpty(tokenString))
            {
                return null;
            }
            var authToken = tokenSerilizer.ValidateAndParseTokenString(tokenString, typeof(TUser).ToString(), issuer, true);
            if (authToken == null)
            {
                return null;
            }
            var claimUserId = authToken.Claims.FirstOrDefault(a => a.Type == "userId");
            if (claimUserId == null)
            {
                return null;
            }
            var user = context.GetEntity(typeof(TUser), claimUserId.Value) as TUser;
            if (user != null && user.Disabled)
            {
                return null;
            }
            return user;
        }

        public virtual object GetId()
        {
            return Id;
        }
    }
}
