namespace NextAdmin.Services {

    export class StripePaymentClient extends HttpClient {


        public authTokenName?: string;

        public static defaultControllerUrl = '/api/stripe/payment';

        public constructor(rootServiceURL?: string, authTokenName?: string, authToken?: string) {
            super(rootServiceURL ?? StripePaymentClient.defaultControllerUrl);
            this.authTokenName = authTokenName;
            if (authToken) {
                this.setAuthToken(authToken);
            }
        }

        setAuthToken(authToken: string) {
            this.headerParams[this.authTokenName] = authToken;
        }

        public async getItemStripePaymentLink(itemId: string): Promise<NextAdmin.Models.ApiResponse<string>> {
            let httpResponse = await this.get('getItemStripePaymentLink', { itemId: itemId });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

    }




}