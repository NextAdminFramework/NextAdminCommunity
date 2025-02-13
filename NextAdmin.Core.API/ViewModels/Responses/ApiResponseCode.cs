namespace NextAdmin.Core.API.ViewModels.Responses
{
    public enum ApiResponseCode : int
    {
        ParametersError,
        UnknownError,
        AuthError,
        PermissionLevelError,
        ValidationError,
        SQLError,
        LockError,
        Success,
    }
}
