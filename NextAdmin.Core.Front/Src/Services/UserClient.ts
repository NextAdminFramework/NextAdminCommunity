
namespace NextAdmin.Services {
    export class UserClient extends HttpClient {


        public authTokenName?: string;

        public constructor(rootServiceURL?: string, authTokenName = 'NextAdminAuthToken') {
            super(rootServiceURL ?? '/user');
            this.authTokenName = authTokenName;
        }

        public async recoverPassword(userName: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.get('recoverPassword', { userName: userName });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson<NextAdmin.Models.ApiResponse>();
        }

        public async changePassword(newPassword: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse>  {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return null;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('changePassword', { newPassword: newPassword });
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse.success)
                return null;
            return httpResponse.parseJson();
        }

        public async authUser(userName: string, password: string, rememberTokeninCookies?: boolean): Promise<NextAdmin.Models.AuthTokenResponse> {
            let httpResponse = await this.get('getAuthToken', { userName: userName, password: password });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            let authTokenResponse = httpResponse.parseJson<NextAdmin.Models.AuthTokenResponse>();
            if (authTokenResponse?.isSuccess) {
                if (rememberTokeninCookies) {
                    NextAdmin.Cookies.set(this.authTokenName, authTokenResponse.token, authTokenResponse.dayValidity ?? 1);
                }
                else {
                    NextAdmin.Cookies.set(this.authTokenName, authTokenResponse.token, 0);//do not set duration, so token is stored in sesssion only
                }
            }
            return authTokenResponse;
        }

        public async getUserByToken(authToken?: string): Promise<NextAdmin.Models.User> {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return null;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('getAuthentifiedUser');
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse.success)
                return null;

            let userResponse = httpResponse.parseJson<NextAdmin.Models.UserResponse>();
            return userResponse?.user;
        }

        public async getUserByLogin(userName: string, password: string): Promise<NextAdmin.Models.UserResponse> {
            let httpResponse = await this.get('getUser', { userName: userName, password: password });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson<NextAdmin.Models.UserResponse>();
        }

        public async setUserCulture(culture?: string, authToken?: string): Promise<boolean> {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return false;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('setUserCulture', { culture: culture });
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse?.success) {
                return false;
            }
            return httpResponse.parseJson<NextAdmin.Models.ApiResponse>()?.isSuccess ?? false;
        }


        public getCurrentAuthToken():string {
            return NextAdmin.Cookies.get(this.authTokenName);
        }

        public deleteCurrentAuthToken() {
            return NextAdmin.Cookies.delete(this.authTokenName);
        }


    }
}