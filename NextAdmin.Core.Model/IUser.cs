using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace NextAdmin.Core.Model
{
    public interface IUser : IEntity
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string EncryptedPassword { get; set; }

        public string Culture { get; set; }

        public DateTime? CreationDate { get; set; }

        public bool Disabled { get; set; }

        public string CreateAuthToken(NextAdminDbContext context, ITokenSerializer tokenSerilizer, string issuer, int duration = 30);

        public object GetId();
    }


    public static class UserHelper
    {

        public static void ExtendUserEntity(this IUser entity)
        {
            entity.OnLoading += (sender, args) =>
            {


            };

            entity.OnSaving += (sender, args) =>
            {
                if (!string.IsNullOrWhiteSpace(entity.Password))
                {
                    if (!IsValidPassword(entity.Password))
                    {
                        args.Errors.Add(new EntityMemberValidationInfo(entity.GetPropertyName(e => e.Password), args.DbContext.Resources.Error_InvalidPassword));
                        return;
                    }
                    entity.EncryptPassword();
                }

            };

            entity.OnEndSaving += (sender, args) =>
            {
                if (!string.IsNullOrWhiteSpace(entity.UserName))
                {
                    if (!IsValidLogin(entity.UserName))
                    {
                        args.Errors.Add(new EntityMemberValidationInfo(entity.GetPropertyName(e => e.UserName), args.DbContext.Resources.Error_InvalidLogin));
                        return;
                    }
                    if (args.Entry.State == EntityState.Modified || args.Entry.State == EntityState.Added)//check unicity
                    {
                        if (!entity.IsUnique(args.DbContext, e => e.UserName))
                        {
                            args.Errors.Add(new EntityMemberValidationInfo(entity.GetPropertyName(e => e.UserName), args.DbContext.Resources.Error_InvalidLogin));
                            return;
                        }
                    }
                }

            };

        }


        /// <summary>
        /// Encrypt given password into EncryptedPassword field, if null, use entity Password Field
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string EncryptPassword(this IUser entity, string password = null)
        {
            if (password == null)
            {
                password = entity.Password;
            }
            string encryptedPassword = Encryption.HashString(password);
            if (string.IsNullOrWhiteSpace(encryptedPassword))
                return null;
            entity.EncryptedPassword = encryptedPassword;
            return encryptedPassword;
        }


        public static TUser FindUser<TUser>(this NextAdminDbContext model, string login, string password)
          where TUser : class, IUser
        {
            string encryptedPassword = Encryption.HashString(password);
            return model.Set<TUser>().FirstOrDefault(e => e.UserName == login && e.EncryptedPassword == encryptedPassword);
        }


        public static IUser FindUser(this NextAdminDbContext model, string userType, string login, string password)
        {
            string encryptedPassword = Encryption.HashString(password);
            var set = ((IQueryable<IUser>)model.Set(userType));
            return set.FirstOrDefault(e => e.UserName == login && e.EncryptedPassword == encryptedPassword);
        }

        public static IUser FindUser(this NextAdminDbContext model, string userType, string login)
        {
            var set = ((IQueryable<IUser>)model.Set(userType));
            return set.FirstOrDefault(e => e.UserName == login);
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


        public static bool IsValidPassword(this string password)
        {
            if (password.Length < 6 || password.Length > 256)
                return false;
            return System.Text.RegularExpressions.Regex.IsMatch(password, @"^[a-zA-Z0-9\s,@.\-_]*$");
        }

        public static bool IsValidLogin(this string login)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(login, @"^[a-zA-Z0-9\s,@.\-_]*$");
        }

        public static bool IsValidEmail(this string email)
        {
            if (!IsValidLogin(email))
                return false;
            if (email.Length < 5) //a@b.c
                return false;
            if (email.Length > 50)
                return false;
            if (!email.Contains("@") || !email.Contains("."))
                return false;
            return true;
        }

    }
}
