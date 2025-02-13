declare module Models {
	interface Base64DocumentEntity extends Entity {
		base64Data: string;
		name: string;
		extension: string;
		creationDate?: Date;
		data: any[];
	}
	interface Base64Document extends Base64DocumentEntity {
		id: string;
	}
}
