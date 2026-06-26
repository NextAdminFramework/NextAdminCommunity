declare module Models {
	interface AdminUser extends StrGuidIdEntity {
		userName: string;
		password: string;
		culture: string;
		disabled: boolean;
		creationDate?: Date;
		lastAuthDate?: Date;
		isSuperAdmin: boolean;
		authProviderName: string;
	}
}
