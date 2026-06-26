using Newtonsoft.Json;
using NextAdmin.Core;
using NextAdmin.Core.Model;
using NextAdminCommunity.Web.Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;

namespace NextAdminCommunity.Web.Models
{
    [Label("AdminUser")]
    public class AdminUser : StrGuidIdEntity, IUser
    {
        public static string SuperAdminUserId = "61ff244a-21d5-4f07-b370-57cfb97273bd";

        [Required, Previewable, Label(nameof(ResourcesEn.AdminUser_UserName))]
        public string? UserName { get; set; }

        [NotMapped, Label(nameof(ResourcesEn.AdminUser_Password))]
        public string? Password { get; set; }

        [Label(nameof(ResourcesEn.AdminUser_Culture))]
        public string? Culture { get; set; }

        [JsonIgnore, Required]
        public string? EncryptedPassword { get; set; }

        [Label(nameof(ResourcesEn.AdminUser_Disabled))]
        public bool Disabled { get; set; }

        [Label(nameof(ResourcesEn.AdminUser_CreationDate))]
        public DateTime? CreationDate { get; set; }

        [Label(nameof(ResourcesEn.AdminUser_LastAuthDate))]
        public DateTime? LastAuthDate { get; set; }

        [NotMapped, Label(nameof(ResourcesEn.AdminUser_IsSuperAdmin))]
        public bool IsSuperAdmin { get; set; }

        public string AuthProviderName { get; set; }

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
