using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NextAdmin.Core.API.Services;
using NextAdmin.Core.API.ViewModels.Responses;
using NextAdmin.Core.Model;

namespace NextAdmin.Core.API.Controllers
{
    [ApiController, Route("user/{action}/{id?}")]
    public abstract class UserController<TUser> : Controller<TUser>
        where TUser : class, IUser
    {

        public virtual int TokenDayValidity { get { return 30; } }

        public UserController(NextAdminDbContext dbContext = null, IConfiguration configuration = null)
          : base(dbContext, configuration)
        {

        }

        protected virtual IUser FindUser(string userName, string password)
        {
            return DbContext.FindUser(typeof(TUser).Name, userName, password);
        }

        [HttpGet, HttpPost]
        public virtual AuthTokenResponse GetAuthToken(string userName, string password)
        {
            AuthTokenResponse response = new AuthTokenResponse();
            try
            {
                var user = FindUser(userName, password) as TUser;
                if (user == null || user.Disabled)
                {
                    response.Code = ApiResponseCode.AuthError.ToString();
                    return response;
                }
                var token = user.CreateAuthToken(DbContext, new AuthTokenSerializer(), AuthTokenIssuer, TokenDayValidity);
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    response.Message = saveResult.Message;
                    response.Exception = saveResult.DatabaseException;
                    response.Code = ApiResponseCode.ValidationError.ToString();
                    return response;
                }
                response.Token = token;
                response.User = GetUserDto(user);
                response.DayValidity = TokenDayValidity;
                response.UserType = user.GetType().Name;
                response.Code = ApiResponseCode.Success.ToString();
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }

        [HttpGet, HttpPost]
        public virtual UserResponse GetUser(string userName, string password)
        {
            var response = new UserResponse();
            try
            {
                var user = FindUser(userName, password);
                if (user == null || user.Disabled)
                {
                    response.Code = ApiResponseCode.AuthError.ToString();
                }
                else
                {
                    response.User = GetUserDto(User);
                    response.Code = ApiResponseCode.Success.ToString();
                }
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString();
            }
            return response;
        }

        [HttpGet, HttpPost]
        public ApiResponse SetUserCulture(string culture)
        {
            try
            {
                if (String.IsNullOrEmpty(culture))
                {
                    return ApiResponse.Error(ApiResponseCode.ParametersError);
                }
                if (User == null)
                {
                    return ApiResponse.Error(ApiResponseCode.AuthError);
                }
                User.Culture = culture;
                var saveResult = DbContext.ValidateAndSave();
                if (!saveResult.Success)
                {
                    return ApiResponse.Error(ApiResponseCode.DbError);
                }
                return ApiResponse.Success();
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(ex);
            }
        }

        [HttpGet, HttpPost]
        public UserResponse GetAuthentifiedUser()
        {
            var response = new UserResponse();
            try
            {
                if (User == null)
                {
                    response.Code = ApiResponseCode.AuthError.ToString(); ;
                }
                else
                {
                    response.User = GetUserDto(User);
                    response.UserType = User.GetType().Name;
                    response.Code = ApiResponseCode.Success.ToString(); ;
                }
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString(); ;
            }
            return response;
        }

        protected virtual UserDto GetUserDto(TUser user)
        {
            return new UserDto(user);
        }

        [HttpGet]
        public virtual ApiResponse ChangePassword(string newPassword)
        {
            var response = new ApiResponse();
            try
            {
                if (User == null)
                {
                    response.Code = ApiResponseCode.AuthError.ToString();
                    return response;
                }
                User.Password = newPassword;
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    response.Code = "INVALID_PASSWORD";
                    return response;
                }
                response.Code = ApiResponseCode.Success.ToString();
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
                response.Code = ApiResponseCode.UnknownError.ToString(); ;
            }
            return response;
        }

        [HttpGet]
        public virtual ApiResponse RecoverPassword(string userName)
        {
            var response = new ApiResponse();
            try
            {
                if (DbContext == null || NextAdminHelper.AppSmtpServerAccount == null)
                    return response;

                var user = DbContext.FindUser(typeof(TUser).Name, userName);
                if (user == null)
                    return response;
                var newPassword = Guid.NewGuid().ToString().Substring(0, 8);
                user.EncryptPassword(newPassword);
                var result = DbContext.ValidateAndSave();
                if (!result.Success)
                {
                    response.Code = ApiResponseCode.DbError.ToString();
                    return response;
                }

                if (Core.Email.TrySendEmail(NextAdminHelper.AppSmtpServerAccount, DbContext.Resources.RecoverPasswordMailTitle, DbContext.Resources.RecoverPasswordMailMessage.Replace("{PASSWORD}", newPassword), new string[] { userName }))
                {
                    response.Code = ApiResponseCode.Success.ToString();
                }
                else
                {
                    response.Code = "EMAIL_ERROR";
                }
            }
            catch (Exception ex)
            {
                response.Exception = ex;
                if (response.Message == null)
                {
                    response.Message = response.Exception.Message + " : " + response.Exception.StackTrace;
                }
            }
            return response;
        }
    }
}
