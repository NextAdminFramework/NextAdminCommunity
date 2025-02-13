
namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class GetEntityResponse : ApiResponse
    {

        public object? Entity { get; set; }

        public LockInfo? LockInfo { get; set; }

    }
}
