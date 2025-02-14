
namespace NextAdmin.Services {
    export class FrontEndServiceClient extends HttpClient {

        public constructor(rootServiceURL = '/api/frontEnd/service') {
            super(rootServiceURL);
        }

        public async sendSupportMessage(message: string, email?: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.get('sendSupportMessage', { message: message, email: email });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }



    }

}