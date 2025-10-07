declare module Models {
	interface StripePaymentSession extends Entity {
		id: string;
		creationDate?: Date;
		userId: string;
		userType: string;
		paymentCompletedEventId: string;
		paymentCompletedDate?: Date;
		isPaid: boolean;
		paymentFailedEventId: string;
		purchasedElementId: string;
		purchasedElementType: string;
		purchasedElementName: string;
		purchasedElementAmountExcludingTax: number;
		paymentType: any;
		blob: string;
	}
}
