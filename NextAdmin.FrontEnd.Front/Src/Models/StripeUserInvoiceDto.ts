namespace NextAdmin.Models {

	export interface UserInvoiceDto {
		date?: Date;
		code: string;
		amount: number;
		stripeInvoiceLink: string;
	}

}