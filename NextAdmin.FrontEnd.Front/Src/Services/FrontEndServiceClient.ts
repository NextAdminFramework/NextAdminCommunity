
namespace NextAdmin.Services {
    export class FrontEndServiceClient extends HttpClient {

        public authTokenName?: string;

        public constructor(rootServiceURL = '/api/frontEnd/service', authTokenName?: string, authToken?: string) {
            super(rootServiceURL);
            this.authTokenName = authTokenName;
            if (authToken) {
                this.setAuthToken(authToken);
            }
        }

        setAuthToken(authToken: string) {
            this.headerParams[this.authTokenName] = authToken;
        }

        getAuthToken() {
            if (this.authTokenName == null) {
                return null;
            }
            return this.headerParams[this.authTokenName];
        }

        public async sendContactMessage(message: string, email?: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.get('sendContactMessage', { message: message, email: email });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }



    }

}