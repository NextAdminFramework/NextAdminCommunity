namespace NextAdmin.Models {

	export interface UserResponse extends NextAdmin.Models.ApiResponse {
		user: User;
		userType: string;
	}


}