declare module Models {
	interface AdminUser extends StrGuidEntity {
		userName: string;
		password: string;
		culture: string;
		disabled: boolean;
		creationDate?: Date;
		isSuperAdmin: boolean;
	}
}
