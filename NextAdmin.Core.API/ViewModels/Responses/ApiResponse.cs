namespace NextAdmin.Core.API.ViewModels.Responses
{
    public class ApiResponse
    {
        public bool IsSuccess => Code == ApiResponseCode.Success.ToString();

        public string? Code { get; set; }

        public string? Message { get; set; }

        public Exception? Exception { get; set; }

        public ApiResponse()
        {
            Code = ApiResponseCode.UnknownError.ToString();
        }

        public static ApiResponse Error(ApiResponseCode errorCode, string? message = null, Exception? exception = null)
        {
            return new GetEntitiesResponse
            {
                Code = errorCode.ToString(),
                Message = message,
                Exception = exception
            };
        }

        public static ApiResponse Error(ApiResponseCode errorCode, Exception exception)
        {
            return new GetEntitiesResponse
            {
                Code = errorCode.ToString(),
                Message = exception.Message,
                Exception = exception
            };
        }

        public static ApiResponse Error(Exception exception)
        {
            return new GetEntitiesResponse
            {
                Code = exception is ApiException ? ((ApiException)exception).Code : ApiResponseCode.UnknownError.ToString(),
                Message = exception.Message,
                Exception = exception
            };
        }

        public static ApiResponse Error(string errorCode, string? message = null, Exception? exception = null)
        {
            return new ApiResponse
            {
                Code = errorCode,
                Message = message,
                Exception = exception
            };
        }

        public static ApiResponse Success(string? message = null)
        {
            return new ApiResponse
            {
                Code = ApiResponseCode.Success.ToString(),
                Message = message
            };
        }

    }

    public class ApiResponse<TData> : ApiResponse
    {
        public TData? Data { get; set; }

        public static ApiResponse<TData> Success(TData? data, string? message = null)
        {
            return new ApiResponse<TData>
            {
                Code = ApiResponseCode.Success.ToString(),
                Message = message,
                Data = data,
            };
        }

        public static ApiResponse<TData> Error(ApiResponseCode errorCode, TData? data, string? message = null)
        {
            return new ApiResponse<TData>
            {
                Code = errorCode.ToString(),
                Message = message,
                Data = data
            };
        }

        public static new ApiResponse<TData> Error(ApiResponseCode errorCode, string? message = null, Exception? exception = null)
        {
            return new ApiResponse<TData>
            {
                Code = errorCode.ToString(),
                Message = message,
                Exception = exception
            };
        }

        public static new ApiResponse<TData> Error(ApiResponseCode errorCode, Exception exception)
        {
            return new ApiResponse<TData>
            {
                Code = errorCode.ToString(),
                Message = exception.Message,
                Exception = exception
            };
        }

        public static new ApiResponse<TData> Error(Exception exception)
        {
            if (exception is ApiException)
            {
                var apiException = (ApiException)exception;
                return new ApiResponse<TData>
                {
                    Code = apiException.Code,
                    Message = exception.Message,
                };
            }
            return new ApiResponse<TData>
            {
                Code = ApiResponseCode.UnknownError.ToString(),
                Message = exception.Message,
                Exception = exception
            };
        }

        public static new ApiResponse<TData> Error(string errorCode, string? message = null, Exception? exception = null)
        {
            return new ApiResponse<TData>
            {
                Code = errorCode,
                Message = message,
                Exception = exception
            };
        }

    }

    public class ApiException : Exception
    {

        public string Code { get; set; }

        public ApiException(string code, string? message = null) : base(message)
        {
            Code = code;
        }

    }

}
