using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Args;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.API.Services;
using NextAdmin.FrontEnd.API.ViewModels.Args;
using NextAdmin.FrontEnd.Model;

namespace NextAdmin.FrontEnd.API.Controllers
{
    public abstract class FrontEndUserController<TUser, TSignUpUserArgs> : UserController<TUser>
        where TUser : class, IFrontEndUser
        where TSignUpUserArgs : SignUpUserArgs
    {

        public static string GoogleOAuthV2ProviderName = "GoogleOAuthV2";

        public FrontEndUserController(NextAdminDbContext model = null, IConfiguration configuration = null)
            : base(model, configuration)
        {

        }


        [HttpPost]
        public virtual ApiResponse<object> SignUpUser([FromBody] TSignUpUserArgs signUpUserArgs)
        {
            try
            {
                var user = DbContext.Set<TUser>().FirstOrDefault(e => e.UserName == signUpUserArgs.Email);
                if (user != null && !string.IsNullOrEmpty(signUpUserArgs.VerificationCode))//try to sign up existing user already created by administrator
                {
                    if (user.EmailVerificationCode != signUpUserArgs.VerificationCode)
                    {
                        return ApiResponse<object>.Error("INVALID_VERIFICATION_CODE");
                    }
                    this.InitializeUser(user, signUpUserArgs);
                    user.AuthProviderName = null;
                    user.Disabled = false;
                    user.EmailVerificationCode = null;
                    user.EmailVerificationDate = DateTime.Now;
                }
                else if (user != null && !user.EmailVerificationDate.HasValue && user.Disabled)
                {
                    this.InitializeUser(user, signUpUserArgs);
                    user.AuthProviderName = null;
                    user.EmailVerificationCode = new Random().Next(10000, 99999).ToString();
                }
                else if (user == null)
                {
                    user = this.CreateUser();
                    this.InitializeUser(user, signUpUserArgs);
                    user.AuthProviderName = null;
                    user.Disabled = true;
                    user.EmailVerificationCode = new Random().Next(10000, 99999).ToString();
                    DbContext.AddEntity(user);
                }
                else
                {
                    return ApiResponse<object>.Error("USER_ALREADY_EXIST");
                }
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse<object>.Error(ApiResponseCode.UnknownError);
                }
                if (string.IsNullOrEmpty(signUpUserArgs.VerificationCode))
                {
                    var emailMessage = new System.Net.Mail.MailMessage(AppSmtpServerAccount.FullEmailAddress,
                        user.UserName,
                        GetConfirmationEmailTitle(user),
                        GetConfirmationEmailContent(user, user.EmailVerificationCode));
                    emailMessage.IsBodyHtml = true;

                    if (!Email.TrySendEmail(AppSmtpServerAccount, emailMessage))
                    {
                        return ApiResponse<object>.Error("UNABLE_TO_SEND_EMAIL");
                    }
                }
                return ApiResponse<object>.Success(user.GetId());
            }
            catch (Exception ex)
            {
                return ApiResponse<object>.Error(ex);
            }
        }


        [NonAction]
        public virtual TUser? TryGetUserFromGoogleAuth(GoogleAuthInfo authInfo, bool signUpUserIfNotExist = true, bool linkAccountToGoogleIfExistAndSimple = true)
        {
            string? userEmail = authInfo?.UserInfo?.Email;
            if (string.IsNullOrEmpty(userEmail))
                return null;

            var user = DbContext.Set<TUser>().FirstOrDefault(e => e.UserName == userEmail);
            if (user != null)
            {
                if (linkAccountToGoogleIfExistAndSimple)
                {
                    user.AuthProviderName = GoogleOAuthV2ProviderName;
                    user.EncryptPassword(Guid.NewGuid().ToString());
                }
                return user;
            }
            if (signUpUserIfNotExist)
            {
                user = CreateUser();
                user.UserName = userEmail;
                user.Disabled = false;
                user.EncryptPassword(Guid.NewGuid().ToString());
                user.EmailVerificationDate = DateTime.Now;
                user.AuthProviderName = GoogleOAuthV2ProviderName;
                DbContext.Add(user);
            }
            return user;
        }


        protected virtual TUser CreateUser()
        {
            return DbContext.CreateEntity<TUser>();
        }

        protected virtual TUser InitializeUser(TUser user, TSignUpUserArgs signUpUserArgs)
        {
            if (!UserHelper.IsValidEmail(signUpUserArgs.Email))
            {
                throw new ApiException("INVALID_EMAIL");
            }
            if (!UserHelper.IsValidPassword(signUpUserArgs.Password))
            {
                throw new ApiException("INVALID_PASSWORD");
            }
            user.UserName = signUpUserArgs.Email.ToLower();
            user.Password = signUpUserArgs.Password;
            return user;
        }



        [HttpPost]
        [HttpGet]
        public virtual ApiResponse DeleteUser()
        {
            try
            {
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }
                DbContext.DeleteEntity(User);
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.UnknownError);
                }
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
        }

        [HttpPost]
        [HttpGet]
        public virtual ApiResponse ChangeUserEmailStep1(string email)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                if (!UserHelper.IsValidEmail(email))
                {
                    return ApiResponse<object>.Error("INVALID_EMAIL");
                }
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }
                email = email.ToLower();
                if (User.UserName == email)
                {
                    return ApiResponse<object>.Error("INVALID_EMAIL");
                }

                if (DbContext.Set<TUser>().FirstOrDefault(a => a.UserName == email) != null)
                {
                    return ApiResponse<object>.Error("EMAIL_ALREADY_USED");
                }

                transaction = DbContext.Database.BeginTransaction();
                string code = Guid.NewGuid().ToString().Substring(0, 5);

                User.UpdateEmailCode = code + "/" + email;
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.UnknownError);
                }

                var emailMessage = new System.Net.Mail.MailMessage(AppSmtpServerAccount.FullEmailAddress,
                    email,
                    GetConfirmationEmailTitle(User),
                    GetConfirmationEmailContent(User, code));
                emailMessage.IsBodyHtml = true;

                if (!Email.TrySendEmail(AppSmtpServerAccount, emailMessage))
                {
                    return ApiResponse<object>.Error("UNABLE_TO_SEND_EMAIL");
                }
                transaction.Commit();
                transaction = null;
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
            finally
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
            }
        }

        [HttpPost]
        [HttpGet]
        public virtual ApiResponse ChangeUserEmailStep2(string email, string code)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                if (string.IsNullOrEmpty(code))
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                if (!UserHelper.IsValidEmail(email))
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }
                email = email.ToLower();
                if (User.UpdateEmailCode != code + "/" + email)
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                User.UpdateEmailCode = null;
                User.UserName = email;
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.UnknownError);
                }
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
        }

        [HttpPost]
        [HttpGet]
        public virtual bool IsUserAccountExist(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return false;
                }
                email = email.ToLower();
                return DbContext.Set<TUser>().Any(e => e.UserName == email);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost]
        [HttpGet]
        public virtual bool IsUserAccountExistAndIsActivated(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return false;
                }
                email = email.ToLower();
                return DbContext.Set<TUser>().Any(e => e.UserName == email && e.EmailVerificationDate.HasValue);
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost]
        [HttpGet]
        public virtual string? GetUserAuthProviderName(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    return null;
                }
                email = email.ToLower();
                return DbContext.Set<TUser>().FirstOrDefault(e => e.UserName == email)?.AuthProviderName;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        protected virtual string GetConfirmationEmailTitle(TUser user)
        {
            return DbContext.Resources.CreateAccountEmailConfirmationTitle;
        }

        protected virtual string GetConfirmationEmailContent(TUser user, string confirmationCode)
        {
            return DbContext.Resources.CreateAccountEmailConfirmationContent.Replace("{CONFIRMATION_CODE}", confirmationCode);
        }

        [HttpPost]
        public ApiResponse ConfirmUserSignUpEmailCode([FromBody] ConfirmEmailCodeArgs confirmEmailCodeArgs)
        {
            try
            {
                if (string.IsNullOrEmpty(confirmEmailCodeArgs.Code) || confirmEmailCodeArgs.UserId == null)
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                var user = DbContext.GetEntity<TUser>(confirmEmailCodeArgs.UserId);
                if (user == null)
                {
                    return ApiResponse.Error("USER_NOT_EXIST");
                }
                if (user.EmailVerificationDate.HasValue)
                {
                    return ApiResponse.Error("EMAIL_ALREADY_CONFIRMED");
                }
                if (user.EmailVerificationCode != confirmEmailCodeArgs.Code)
                {
                    return ApiResponse.Error("INVALID_CODE");
                }
                user.EmailVerificationDate = DateTime.Now;
                user.EmailVerificationCode = null;
                user.Disabled = false;
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.UnknownError);
                }
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
        }




    }
}
