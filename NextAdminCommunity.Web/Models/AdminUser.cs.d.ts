declare module Models {
	interface AdminUser extends StrGuidIdEntity {
		userName: string;
		password: string;
		culture: string;
		disabled: boolean;
		creationDate?: Date;
		isSuperAdmin: boolean;
		authProviderName: string;
	}
}
