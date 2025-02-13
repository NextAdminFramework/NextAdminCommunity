using Newtonsoft.Json;
using NextAdmin.Core;
using NextAdmin.Core.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;

namespace NextAdminCommunity.Web.Models
{
    [Label("AdminUser")]
    public class AdminUser : StrGuidEntity, IUser
    {
        public static string SuperAdminUserId = "61ff244a-21d5-4f07-b370-57cfb97273bd";

        [Required, Preview, Label("AdminUser_UserName")]
        public string? UserName { get; set; }

        [NotMapped, Label("AdminUser_Password")]
        public string? Password { get; set; }

        [Label("AdminUser_Culture")]
        public string? Culture { get; set; }

        [JsonIgnore, Required]
        public string? EncryptedPassword { get; set; }

        [Label("AdminUser_Disabled")]
        public bool Disabled { get; set; }

        [Label("AdminUser_CreationDate")]
        public DateTime? CreationDate { get; set; }

        [NotMapped, Label("AdminUser_IsSuperAdmin")]
        public bool IsSuperAdmin { get; set; }

        public AdminUser()
        {
            this.ExtendUserEntity();
        }

        public override void OnSave(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnSave(dbContext, args);
            if (!CreationDate.HasValue)
            {
                CreationDate = DateTime.UtcNow;
            }
        }

        public override void OnDelete(NextAdminDbContext dbContext, SavingArgs args)
        {
            base.OnDelete(dbContext, args);
            if (SuperAdminUserId == Id)
            {
                args.AddError(dbContext.Resources.Get("AdminUser_Error_DeleteSuperAdminNotAllowed"));
            }
        }

        public override void OnLoad(NextAdminDbContext dbContext, EntityArgs args)
        {
            base.OnLoad(dbContext, args);
            IsSuperAdmin = SuperAdminUserId == Id;
        }

        public string CreateAuthToken(NextAdminDbContext context, ITokenSerializer tokenSerilizer, string issuer, int duration = 30)
        {
            var expirationDate = DateTime.UtcNow.AddDays(duration);
            var claims = new List<Claim>
            {
                new Claim("userId", Id.ToString()),
                new Claim("userType", GetType().Name)
            };
            return tokenSerilizer.CreateTokenString(GetType().ToString(), expirationDate, issuer, claims);
        }

        public object GetId()
        {
            return Id;
        }
    }
}
