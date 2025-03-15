namespace NextAdmin.Core.API.ViewModels.Responses
{

    public class GetEntitiesResponse<TEntity> : ApiResponse
    {

        public List<TEntity>? Entities { get; set; }


        public static GetEntitiesResponse<TEntity> Error(ApiResponseCode errorCode, string? message = null)
        {
            return new GetEntitiesResponse<TEntity>
            {
                Code = errorCode.ToString(),
                Message = message
            };
        }

    }

    public class GetEntitiesResponse : GetEntitiesResponse<object>
    {
        public static new GetEntitiesResponse Error(ApiResponseCode errorCode, string? message = null)
        {
            return new GetEntitiesResponse
            {
                Code = errorCode.ToString(),
                Message = message
            };
        }
    }
}
