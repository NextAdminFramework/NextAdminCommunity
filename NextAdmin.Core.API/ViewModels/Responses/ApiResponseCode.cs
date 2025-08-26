namespace NextAdmin.Core.API.ViewModels.Responses
{
    public enum ApiResponseCode : int
    {
        UnknownError = 0,
        ParametersError = 1,
        AuthError = 2,
        PermissionLevelError = 3,
        ValidationError = 4,
        DbError = 5,
        LockError = 6,
        DataNotFoundError = 7,
        Success = 1000,
    }
}
