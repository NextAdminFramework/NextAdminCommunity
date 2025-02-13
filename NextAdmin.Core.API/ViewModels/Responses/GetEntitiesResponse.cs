namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class GetEntitiesResponse : ApiResponse
    {

        public List<object>? Entities { get; set; }


        public static GetEntitiesResponse Error(ApiResponseCode errorCode, string? message = null)
        {
            return new GetEntitiesResponse
            {
                Code = errorCode.ToString(),
                Message = message
            };
        }

    }
}
