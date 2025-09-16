declare module Models {
	interface ContactMessage extends StrGuidEntity {
		userId: string;
		date?: Date;
		responseDate?: Date;
		message: string;
		userEmail: string;
		adminEmail: string;
		isSuccessfullySent: boolean;
		responses: Models.ContactMessageResponse[];
	}
	interface ContactMessageResponse {
		message: string;
		date?: Date;
	}
}
