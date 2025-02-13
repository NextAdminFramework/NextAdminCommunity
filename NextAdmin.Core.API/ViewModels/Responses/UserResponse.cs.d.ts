declare module Models {
	interface UserResponse extends ApiResponse {
		user: Models.UserDto;
		userType: string;
	}
	interface ApiResponse {
		isSuccess: boolean;
		code: string;
		message: string;
		exception: {
			data: any[];
			helpLink: string;
			hResult: number;
			innerException: any;
			message: string;
			source: string;
			stackTrace: string;
			targetSite: {
				attributes: any;
				callingConvention: any;
				containsGenericParameters: boolean;
				isAbstract: boolean;
				isAssembly: boolean;
				isConstructedGenericMethod: boolean;
				isConstructor: boolean;
				isFamily: boolean;
				isFamilyAndAssembly: boolean;
				isFamilyOrAssembly: boolean;
				isFinal: boolean;
				isGenericMethod: boolean;
				isGenericMethodDefinition: boolean;
				isHideBySig: boolean;
				isPrivate: boolean;
				isPublic: boolean;
				isSecurityCritical: boolean;
				isSecuritySafeCritical: boolean;
				isSecurityTransparent: boolean;
				isSpecialName: boolean;
				isStatic: boolean;
				isVirtual: boolean;
				methodHandle: any;
				methodImplementationFlags: any;
			};
		};
	}
	interface ApiException {
		code: string;
	}
	interface UserDto {
		id: any;
		userName: string;
		culture: string;
	}
}
