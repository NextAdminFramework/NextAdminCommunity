declare module Models {
	interface LongIdEntity extends Entity {
		id?: number;
	}
	interface LongIdEntityExtension {
	}
	interface LongRandomIdEntity extends LongIdEntity {
		primaryKeyAssignationMode: any;
	}
	interface LongTimeIdEntity extends LongIdEntity {
		primaryKeyAssignationMode: any;
	}
}
