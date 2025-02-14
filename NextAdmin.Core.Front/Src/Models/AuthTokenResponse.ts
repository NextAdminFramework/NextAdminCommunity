namespace NextAdmin.Models {

	export interface AuthTokenResponse extends NextAdmin.Models.ApiResponse {
		token: string;
		user: User;
		dayValidity?: number;
		userType: string;
	}


}