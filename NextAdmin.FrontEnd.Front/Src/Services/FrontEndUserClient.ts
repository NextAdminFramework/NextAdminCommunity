
namespace NextAdmin.Services {
    export class FrontEndUserClient extends UserClient {


        public authTokenName?: string;


        public async changeEmailStep1(email: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse> {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return null;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('changeUserEmailStep1', { email: email });
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse.success)
                return null;
            return httpResponse.parseJson();
        }

        public async changeEmailStep2(email: string, code: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse> {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return null;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('changeUserEmailStep2', { email: email, code: code });
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse.success)
                return null;
            return httpResponse.parseJson();
        }

        public async deleteUser(authToken?: string): Promise<NextAdmin.Models.ApiResponse> {
            if (authToken == null) {
                authToken = this.getCurrentAuthToken();
            }
            if (NextAdmin.String.isNullOrEmpty(authToken)) {
                return null;
            }
            this.headerParams[this.authTokenName] = authToken;
            let httpResponse = await this.get('deleteUser');
            delete this.headerParams[this.authTokenName];
            if (httpResponse == null || !httpResponse.success)
                return null;
            return httpResponse.parseJson();
        }

        public async signUpUser(args: NextAdmin.Models.SignUpUserArgs): Promise<NextAdmin.Models.ApiResponse<string>> {
            let httpResponse = await this.postJson('signUpUser', args);
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

        public async confirmUserSignUpEmailCode(userId: any, code: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.postJson('confirmUserSignUpEmailCode', {
                userId: userId,
                code: code
            });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

        public async isUserAccountExist(email: string): Promise<boolean> {
            let httpResponse = await this.get('isUserAccountExist', {
                email: email
            });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

    }
}