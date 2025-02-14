
namespace NextAdmin.Services {
    export class SubscriptionPlanClient extends HttpClient {

        public constructor(rootServiceURL = '/api/subscription') {
            super(rootServiceURL);
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