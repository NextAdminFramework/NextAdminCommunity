namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class AuthTokenResponse : ApiResponse
    {
        public string Token { get; set; }

        public UserDto User { get; set; }

        public int DayValidity { get; set; }

        public string UserType { get; set; }

    }
}
