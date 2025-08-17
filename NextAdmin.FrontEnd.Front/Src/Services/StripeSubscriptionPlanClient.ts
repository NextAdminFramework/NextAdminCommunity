
namespace NextAdmin.Services {
    export class StripeSubscriptionPlanClient extends HttpClient {

        public authTokenName?: string;

        public static defaultControllerUrl = '/api/stripe/subscription';

        public constructor(rootServiceURL?: string, authTokenName?: string) {
            super(rootServiceURL ?? StripeSubscriptionPlanClient.defaultControllerUrl);
            this.authTokenName = authTokenName;
        }

        setAuthToken(authToken: string) {
            this.headerParams[this.authTokenName] = authToken;
        }

        public async getSubscriptionStripePaymentLink(planId: string): Promise<NextAdmin.Models.ApiResponse<string>> {
            let httpResponse = await this.get('getSubscriptionStripePaymentLink', { planId: planId });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

        public async cancelSubscriptionAutoRenew(subscriptionId: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.get('cancelSubscriptionAutoRenew', { subscriptionId: subscriptionId });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

        public async resumeSubscriptionAutoRenew(subscriptionId: string): Promise<NextAdmin.Models.ApiResponse> {
            let httpResponse = await this.get('resumeSubscriptionAutoRenew', { subscriptionId: subscriptionId });
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

        public async getUserInvoices(): Promise<NextAdmin.Models.ApiResponse<Array<Models.UserInvoiceDto>>> {
            let httpResponse = await this.get('getUserInvoices');
            if (httpResponse == null || !httpResponse.success) {
                return null;
            }
            return httpResponse.parseJson();
        }

    }
}