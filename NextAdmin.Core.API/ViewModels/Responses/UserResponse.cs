using NextAdmin.Core.Model;

namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class UserResponse : ApiResponse
    {
        public UserDto User { get; set; }

        public string UserType { get; set; }

    }

    public class UserDto
    {
        public object Id { get; set; }

        public string? UserName { get; set; }

        public string? Culture { get; set; }

        public UserDto(IUser user)
        {
            Id = user.GetId();
            UserName = user.UserName;
            Culture = user.Culture;
        }

    }

}
