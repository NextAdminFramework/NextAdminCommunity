
namespace NextAdmin.Models {

    export interface GetEntityResponse extends NextAdmin.Models.ApiResponse {

        entity: any;

        lockInfo?: LockInfo;

    }

    export interface LockInfo {

        creationDate?: string;

        expirationDate?: string;

        ownerName?: string;

        isOwner: boolean;

    }

    export interface GetEntitiesResponse extends NextAdmin.Models.ApiResponse {

        entities: Array<any>;

    }

    export interface UpdateEntitiesResponse extends NextAdmin.Models.ApiResponse {
        errors: EntityError[];
        warings: EntityError[];
        updateInfos: UpdateEntityInfo[];
    }


    export interface SaveEntityResponse<T> extends UpdateEntitiesResponse {
        entity: T;
    }

    export interface SaveEntityResponse_ extends SaveEntityResponse<any> {

    }

    export interface SaveEntitiesResponse<T> extends UpdateEntitiesResponse {
        entities: Array<T>;
    }

    export interface SaveEntitiesResponse_ extends SaveEntitiesResponse<any> {


    }

    export interface DeleteEntityResponse extends UpdateEntitiesResponse {


    }

    export interface EntityError {
        entityName: string;
        entityId: any;
        memberName: string;
        message: string;
        errorCode: string;
    }

    export interface UpdateEntityInfo {
        entityName: string;
        entityId: any;
        actionType: UpdateEntityActionType;
    }

    export enum UpdateEntityActionType {
        create = 1,
        update = 2,
        delete = 3
    }


}