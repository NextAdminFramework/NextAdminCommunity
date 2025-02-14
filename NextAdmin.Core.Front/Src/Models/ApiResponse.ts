namespace NextAdmin.Models {

    export interface ApiResponse<T = void> {

        isSuccess?: boolean;

        code: string;

        message: string;

        exception: any;

        data: T;

    }


    export enum ApiResponseCode {

        Success = 'Success',
        AuthError = 'AuthError',
        PermissionLevelError = 'PermissionLevelError',
        SQLError = 'SQLError',
        ValidationError = 'ValidationError'

    }

}