
/// <reference path="HTTPClient.ts"/>

namespace NextAdmin.Services {
    export class EntityClient extends HttpClient {

        public static onEntiesUpdated = new EventHandler<any, Dictionary<EntityUpdatedInfo>>();

        public static dispatchEntitiesUpdated(sender: any, mainEntities?: Array<{ name: string, entities: Array<any> }>, updateInfos?: Array<Models.UpdateEntityInfo>) {
            let entitiesUpdatedInfos = new Dictionary<EntityUpdatedInfo>();

            if (mainEntities) {
                for (let mainEntity of mainEntities) {
                    entitiesUpdatedInfos.set(mainEntity.name, {
                        entityName: mainEntity.name,
                        entities: mainEntity.entities?.where(a => a != null)
                    });
                }
            }
            if (updateInfos) {
                for (let group of updateInfos.groupByArray(a => a.entityName)) {
                    let info = entitiesUpdatedInfos.get(group.name);
                    if (info) {
                        info.entityUpdatedInfos = group.items;
                    }
                    else {
                        entitiesUpdatedInfos.set(group.name, {
                            entityName: group.name,
                            entityUpdatedInfos: group.items,

                        } as EntityUpdatedInfo);
                    }
                }
            }
            EntityClient.onEntiesUpdated.dispatch(sender, entitiesUpdatedInfos);
        }

        public authTokenName?: string;

        public constructor(rootServiceURL = '/entity', authTokenName = 'NextAdminAuthToken', authToken?: string) {
            super(rootServiceURL);
            this.authTokenName = authTokenName;
            if (authToken) {
                this.setAuthToken(authToken);
            }
        }

        setAuthToken(authToken: string) {
            this.headerParams[this.authTokenName] = authToken;
        }

        public async tryLockEntity(entityName: string, entityId: string, lockKey: string): Promise<NextAdmin.Models.ApiResponse<Models.LockInfo>> {
            let httpResponse = await this.get('tryLockEntity', { entityName: entityName, entityId: entityId, lockKey: lockKey });
            if (!httpResponse?.success) {
                return null;
            }
            return httpResponse.parseJson<NextAdmin.Models.ApiResponse<Models.LockInfo>>();
        }

        public async tryUnlockEntity(entityName: string, entityId: string, lockKey: string): Promise<NextAdmin.Models.ApiResponse<boolean>> {
            let httpResponse = await this.get('tryUnlockEntity', { entityName: entityName, entityId: entityId, lockKey: lockKey });
            if (!httpResponse?.success) {
                return null;
            }
            return httpResponse.parseJson<NextAdmin.Models.ApiResponse<boolean>>();
        }

        public getEntity(args: NextAdmin.Models.GetEntityArgs,
            responseAction?: (response: NextAdmin.Models.GetEntityResponse) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntityResponse> {
            return new Promise((resolve, reject) => {
                this.postJson('getEntity', args, (response) => {
                    if (response.success) {
                        let responseData = response.parseJson<NextAdmin.Models.GetEntityResponse>();
                        if (responseAction != null) {
                            responseAction(responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }


        public createEntity(args: NextAdmin.Models.EntityArgs,
            responseAction?: (response: NextAdmin.Models.GetEntityResponse) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntityResponse> {
            return new Promise((resolve, reject) => {
                this.postJson('createEntity', args, (response) => {
                    if (response.success) {
                        let responseData = response.parseJson<NextAdmin.Models.GetEntityResponse>();
                        if (responseAction != null) {
                            responseAction(responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }

        public saveEntity(saveEntityArgs: NextAdmin.Models.SaveEntityArgs,
            responseAction?: (response: NextAdmin.Models.SaveEntityResponse_) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.SaveEntityResponse_> {
            return new Promise((resolve, reject) => {
                this.postJson('saveEntity', saveEntityArgs, (response) => {
                    if (response.success) {
                        let saveEntityResponse = response.parseJson<NextAdmin.Models.SaveEntityResponse_>();
                        if (responseAction) {
                            responseAction(saveEntityResponse);
                        }
                        EntityClient.dispatchEntitiesUpdated(this, [{ name: saveEntityArgs.entityName, entities: [saveEntityResponse.entity] }], saveEntityResponse?.updateInfos);
                        resolve(saveEntityResponse);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }

        public deleteEntity(args: NextAdmin.Models.GetEntityArgs,
            responseAction?: (response: NextAdmin.Models.UpdateEntitiesResponse) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.UpdateEntitiesResponse> {
            return new Promise((resolve, reject) => {
                this.postJson('deleteEntity', args, (response) => {
                    if (response.success) {
                        let apiResponse = response.parseJson() as NextAdmin.Models.UpdateEntitiesResponse;
                        if (responseAction) {
                            responseAction(apiResponse);
                        }
                        if (apiResponse?.isSuccess) {
                            EntityClient.dispatchEntitiesUpdated(this, null, apiResponse?.updateInfos);
                        }
                        resolve(apiResponse);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }

        public getEntities(args: NextAdmin.Models.GetEntitiesArgs,
            responseAction?: (response: NextAdmin.Models.GetEntitiesResponse) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntitiesResponse> {

            return new Promise((resolve, reject) => {
                this.postJson('getEntities', args, (response) => {
                    if (response.success) {
                        let responseData = response.parseJson<NextAdmin.Models.GetEntitiesResponse>();
                        if (responseAction != null) {
                            responseAction(responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }

        public countEntities(args: NextAdmin.Models.GetEntitiesArgs,
            responseAction?: (response: NextAdmin.Models.ApiResponse<number>) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.ApiResponse<number>> {

            return new Promise((resolve, reject) => {
                this.postJson('countEntities', args, (response) => {
                    if (response.success) {
                        let responseData = response.parseJson<NextAdmin.Models.ApiResponse<number>>();
                        if (responseAction != null) {
                            responseAction(responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }


        public sumEntities(args: NextAdmin.Models.GetEntitiesArgs,
            responseAction?: (response: NextAdmin.Models.ApiResponse<number>) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.ApiResponse<number>> {
            return new Promise((resolve, reject) => {
                this.postJson('sumEntities', args, (response) => {
                    if (response.success) {
                        let responseData = response.parseJson<NextAdmin.Models.ApiResponse<number>>();
                        if (responseAction != null) {
                            responseAction(responseData);
                        }
                        resolve(responseData);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }


        public async minEntities(args: NextAdmin.Models.GetEntitiesArgs): Promise<NextAdmin.Models.ApiResponse<number>> {
            let response = await this.postJson('minEntities', args);
            if (!response.success) {
                return null;
            }
            return response.parseJson<NextAdmin.Models.ApiResponse<number>>();
        }

        public async maxEntities(args: NextAdmin.Models.GetEntitiesArgs): Promise<NextAdmin.Models.ApiResponse<number>> {
            let response = await this.postJson('maxEntities', args);
            if (!response.success) {
                return null;
            }
            return response.parseJson<NextAdmin.Models.ApiResponse<number>>();
        }


        public saveEntities(args: NextAdmin.Models.SaveEntitiesArgs,
            responseAction?: (response: NextAdmin.Models.SaveEntitiesResponse_) => void,
            errorAction?: (response: HttpResponse) => void,
            progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.SaveEntitiesResponse_> {
            return new Promise((resolve, reject) => {
                this.postJson('saveEntities', args, (response) => {
                    if (response.success) {
                        let saveEntitiesResponse = response.parseJson<NextAdmin.Models.SaveEntitiesResponse_>();
                        if (responseAction) {
                            responseAction(saveEntitiesResponse);
                        }
                        if (saveEntitiesResponse?.isSuccess) {
                            EntityClient.dispatchEntitiesUpdated(this, [{ name: args.entityName, entities: saveEntitiesResponse?.entities }], saveEntitiesResponse?.updateInfos);
                        }
                        resolve(saveEntitiesResponse);
                    }
                    else {
                        if (errorAction != null) {
                            errorAction(response);
                        }
                        reject(response);
                    }
                }, progressAction);
            });
        }

        public async getEntityUserRight(entityName?: string, entityId?: string): Promise<number> {
            let response = await this.get('getUserEntityRight', { entityName: entityName, entityId: entityId });
            if (!response.success) {
                return null;
            }
            return response.parseJson();
        }

    }



    export interface EntityUpdatedInfo {

        entityName: string;

        entityUpdatedInfos?: Array<Models.UpdateEntityInfo>;

        entities?: Array<any>;

    }


}