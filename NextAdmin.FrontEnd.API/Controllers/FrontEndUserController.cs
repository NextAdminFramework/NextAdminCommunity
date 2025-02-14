using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core;
using NextAdmin.Core.API;
using NextAdmin.Core.API.Controllers;
using NextAdmin.Core.API.ViewModels.Args;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;
using NextAdmin.FrontEnd.API.ViewModels.Args;
using NextAdmin.FrontEnd.Model;

namespace NextAdmin.FrontEnd.API.Controllers
{
    public abstract class FrontEndUserController<TUser, TSignUpUserArgs> : UserController<TUser>
        where TUser : class, IFrontEndUser
        where TSignUpUserArgs : SignUpUserArgs
    {

        public FrontEndUserController(NextAdminDbContext model = null, IConfiguration configuration = null)
            : base(model, configuration)
        {

        }

        [HttpPost]
        public virtual ApiResponse<object> SignUpUser([FromBody] TSignUpUserArgs signUpUserArgs)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                var user = DbContext.Set<TUser>().FirstOrDefault(e => e.UserName == signUpUserArgs.Email);
                if (user != null && (user.EmailVerificationDate.HasValue || !user.Disabled))
                {
                    return ApiResponse<object>.Error("USER_ALREADY_EXIST");
                }
                transaction = DbContext.Database.BeginTransaction();
                if (user == null)
                {
                    user = CreateUser(signUpUserArgs);
                    DbContext.AddEntity(user);
                }
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    return ApiResponse<object>.Error(ApiResponseCode.UnknownError);
                }

                var emailMessage = new System.Net.Mail.MailMessage(NextAdminHelper.AppSmtpServerAccount.FullEmailAddress,
                    user.UserName,
                    GetConfirmationEmailTitle(user),
                    GetConfirmationEmailContent(user, user.EmailVerificationCode));
                emailMessage.IsBodyHtml = true;

                if (!Email.TrySendEmail(NextAdminHelper.AppSmtpServerAccount, emailMessage))
                {
                    return ApiResponse<object>.Error("UNABLE_TO_SEND_EMAIL");
                }
                transaction.Commit();
                transaction = null;
                return ApiResponse<object>.Success(user.GetId());
            }
            catch (Exception ex)
            {
                return ApiResponse<object>.Error(ex);
            }
            finally
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
            }
        }

        protected virtual TUser CreateUser(TSignUpUserArgs signUpUserArgs)
        {
            if (!UserHelper.IsValidEmail(signUpUserArgs.Email))
            {
                throw new ApiException("INVALID_EMAIL");
            }
            if (!UserHelper.IsValidPassword(signUpUserArgs.Password))
            {
                throw new ApiException("INVALID_PASSWORD");
            }
            var user = DbContext.CreateEntity<TUser>();
            user.Disabled = true;
            user.EmailVerificationCode = Guid.NewGuid().ToString().Substring(0, 5);
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
                var emailMessage = new System.Net.Mail.MailMessage(NextAdminHelper.AppSmtpServerAccount.FullEmailAddress,
                    email,
                    GetConfirmationEmailTitle(User),
                    GetConfirmationEmailContent(User, code));
                emailMessage.IsBodyHtml = true;

                if (!Email.TrySendEmail(NextAdminHelper.AppSmtpServerAccount, emailMessage))
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



        protected virtual string GetConfirmationEmailTitle(TUser user)
        {
            return NextAdminHelper.AppName + " : " + DbContext.Resources.CreateAccountEmailConfirmationTitle;
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
                user.EmailVerificationDate = DateTime.UtcNow;
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
