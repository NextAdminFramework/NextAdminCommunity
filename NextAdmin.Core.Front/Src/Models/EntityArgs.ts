namespace NextAdmin.Models {

    export interface EntityArgs {

        entityName: string;

        customActionName?: string;

        customActionArgs?: {};

        parameters?: Record<string, any>;

    }



    export interface GetEntitiesArgs extends EntityArgs, Query {

        whereQuery?: string;

        whereQueryArgs?: Array<any>;

        selectQueries?: Array<string>;

        isSelectDistinctQuery?: boolean;

        orderByQueries?: Array<any>;

        skipRecordCount?: number;

        takeRecordCount?: number;

    }


    export interface GetEntityArgs extends EntityArgs {

        entityId?;

        lockKey?: string;

        detailToLoadNames?: Array<string>;
    }


    export interface SaveEntityArgs extends EntityArgs {

        entity: any;

        lockKey?: string;

        conflictAction?: ConflictAction;

    }

    export interface SaveEntitiesArgs extends EntityArgs {

        entitiesToAddOrUpdate?: Array<any>;

        entitiesToDeleteIds?: Array<any>;
    }

    export enum ConflictAction {
        overwrite,
        cancel
    }

}