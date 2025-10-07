declare module Models {
	interface StripeEvent extends Entity {
		id: string;
		userId: string;
		userType: string;
		paymentSessionId: string;
		subscriptionId: string;
		invoiceId: string;
		stripeEventData: {
			id: string;
			object: string;
			account: string;
			apiVersion: string;
			created: Date;
			data: {
				object: any;
				previousAttributes: {
				};
				rawObject: {
				};
			};
			livemode: boolean;
			pendingWebhooks: number;
			request: {
				id: string;
				idempotencyKey: string;
			};
			type: string;
		};
		eventType: string;
		creationDate?: Date;
		errorMessage: string;
	}
}
