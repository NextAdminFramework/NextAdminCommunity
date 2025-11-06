declare module Models {
	interface StrIdEntity extends Entity {
		id: string;
	}
	interface StrIdEntityExtension {
	}
	interface StrGuidIdEntity extends StrIdEntity {
		primaryKeyAssignationMode: any;
	}
	interface StrTimeUniqueIdEntity extends StrIdEntity {
		primaryKeyAssignationMode: any;
	}
}
