
/// <reference path="DataController.ts"/>
/// <reference path="../EventHandler .ts"/>

namespace NextAdmin.Business {

    export class EntityDataController<T> extends DataController<T> {

        public static onEntityChanged = new NextAdmin.EventHandler<EntityDataController_, EntityChangedArgs>();

        public onStartLoadEntity = new NextAdmin.EventHandler<EntityDataController_, NextAdmin.Models.GetEntityArgs>();

        public options: EntityDataControllerOptions;

        public entityLockKey?: string;

        public isDataMostRecentOverwritingAllowed = true;

        private _entityLockInfo?: Models.LockInfo;

        constructor(options: EntityDataControllerOptions) {
            super({
                ...options
            } as EntityDataControllerOptions);

            this.entityLockKey = this.options.entityLockKey;

            this.loadAction = (dataId?: any, actionResult?: (result: LoadDataResult) => void) => {
                let detailsToLoad = [];
                for (let controlPropertyName in this.bindedControls) {
                    if (this.bindedControls.get(controlPropertyName) instanceof UI.DataGrid) {
                        detailsToLoad.add(controlPropertyName);
                    }
                }
                let args = {
                    entityId: dataId,
                    entityName: this.options.dataName,
                    lockKey: this.entityLockKey,
                    detailToLoadNames: detailsToLoad,
                } as NextAdmin.Models.GetEntityArgs;

                this.onStartLoadEntity.dispatch(this, args);

                this.options.entityClient.getEntity(args, (response) => {
                    let loadResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        message: response.message,
                        data: response.entity,
                        code: response.code
                    } as LoadDataResult;
                    let isPreviouslyLocked = this.isEntityLocked();
                    if (response.lockInfo) {
                        this._entityLockInfo = response.lockInfo;
                    }
                    if (this.entityLockKey && !this._entityLockInfo?.isOwner) {
                        this.enableReadOnly();
                    }
                    else if (isPreviouslyLocked) {
                        this.disableReadOnly();
                    }
                    actionResult(loadResult);
                }, (response) => {
                    this.displayHTTPError(response, () => {
                        actionResult({ success: false });
                    });
                });
            };


            let conflictAction = NextAdmin.Models.ConflictAction.cancel;
            this.saveAction = (data, actionResult) => {

                let saveEntityArgs = {
                    entityName: this.options.dataName,
                    entity: data,
                    conflictAction: conflictAction,
                    lockKey: this.entityLockKey,
                } as NextAdmin.Models.SaveEntityArgs;


                this.options.entityClient.saveEntity(saveEntityArgs, (response: NextAdmin.Models.SaveEntityResponse_) => {

                    let saveResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        errors: response.errors != null ? response.errors.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        warnings: response.warings != null ? response.warings.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        message: response.message,
                        newData: response.entity,
                        code: response.code
                    } as SaveDataResult;

                    if (response.code == 'VERSION_CONFLICT') {
                        if (this.isDataMostRecentOverwritingAllowed) {
                            let msgBox = new NextAdmin.UI.MessageBox({
                                title: Resources.overwriteDataTitle,
                                text: Resources.overwriteDataMessage,
                                buttons: [
                                    new NextAdmin.UI.Button({
                                        text: Resources.overwriteData,
                                        action: () => {
                                            conflictAction = NextAdmin.Models.ConflictAction.overwrite;
                                            this.saveAction(data, actionResult);
                                            conflictAction = NextAdmin.Models.ConflictAction.cancel;
                                            msgBox.close();
                                        }
                                    }),
                                    new NextAdmin.UI.Button({
                                        text: Resources.cancel,
                                        action: () => {
                                            actionResult(saveResult);
                                            msgBox.close();
                                        }
                                    }),
                                ]
                            })
                            msgBox.open();
                        } else {
                            NextAdmin.UI.MessageBox.createOk(Resources.saveNotAllowed, Resources.overwriteDataNotAllowedMessage);
                            actionResult(saveResult);
                        }
                        return;
                    }
                    actionResult(saveResult);
                    if (saveResult.success) {
                        this.dispatchEntityChanged({ entityName: this.options.dataName, previousEntity: data, newEntity: saveResult.newData, previousEntityState: data['_state'], newEntityState: DataState.serialized });
                    }
                }, (error) => {
                    this.displayHTTPError(error, () => {
                        actionResult({ success: false });
                    });
                });
            };



            this.deleteAction = (data: any, actionResult) => {

                this.options.entityClient.deleteEntity({ entityName: this.options.dataName, entityId: data[this.options.dataPrimaryKeyName] }, (response: NextAdmin.Models.DeleteEntityResponse) => {
                    let deleteResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        errors: response.errors != null ? response.errors.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        warnings: response.warings != null ? response.warings.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        message: response.message,
                        code: response.code
                    } as DeleteDataResult;

                    actionResult(deleteResult);
                    if (deleteResult.success) {
                        this.dispatchEntityChanged({ entityName: this.options.dataName, previousEntity: data, newEntity: null, previousEntityState: data['_state'], newEntityState: DataState.deleted });
                    }


                }, (error) => {
                    this.displayHTTPError(error, () => {
                        actionResult({ success: false });
                    });
                });
            };

            this.appendAction = (actionResult) => {
                this.options.entityClient.createEntity({ entityName: this.options.dataName }, (response) => {
                    actionResult({
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        message: response.message,
                        data: response.entity,
                        code: response.code
                    } as LoadDataResult);
                });
            };
        }

        public displayDataErrors(action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox {
            let messageBox = super.displayDataErrors(action, resultError, defaultErrorMessage, okAction);
            if (action == DataControllerActionType.delete && messageBox && this.data[this.options.dataPrimaryKeyName]) {
                Business.EntityHelper.getLinkedEntities(this.options.entityClient, this.options.dataInfos, this.options.dataName, this.data[this.options.dataPrimaryKeyName]).then((linkedEntitiesInfos) => {
                    if (linkedEntitiesInfos?.length) {
                        messageBox.text.appendHTML('div', (container) => {
                            container.appendHTML('h3', 'Données liées :');
                            for (let linkedEntitiesInfo of linkedEntitiesInfos) {
                                container.appendHTML('div', (title) => {
                                    title.style.fontWeight = 'bold';
                                    title.innerHTML = linkedEntitiesInfo.entityInfo.displayName ?? linkedEntitiesInfo.entityInfo.name;
                                });
                                for (let entity of linkedEntitiesInfo.entities) {
                                    container.appendHTML('div', (row) => {
                                        row.style.padding = '5px';
                                        let linkedEntityPrimaryKey = entity[linkedEntitiesInfo.entityInfo.getPrimaryKey()];
                                        if (linkedEntitiesInfo.entityInfo.displayPropertiesNames?.length) {
                                            row.appendControl(new NextAdmin.UI.Link({
                                                text: linkedEntitiesInfo.entityInfo.displayPropertiesNames.select(a => entity[a]).join(' '),
                                                action: () => {
                                                    messageBox.close();
                                                    UI.DataFormModal_.formModalByDataNameFactory(linkedEntitiesInfo.entityInfo.name).open({ dataPrimaryKey: linkedEntityPrimaryKey });
                                                }
                                            }));
                                        }
                                        else {
                                            row.innerHTML = linkedEntityPrimaryKey;
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            }
            return messageBox;
        }
        
        public getEntityInfo(): Business.EntityInfo<T> {
            return this.options.dataInfos.get(this.options.dataName);
        }

        public getEntityLockInfo(): Models.LockInfo {
            return this._entityLockInfo;
        }

        public async tryLockEntity(): Promise<Models.LockInfo> {
            let entityPrimaryKey = this.getPrimaryKeyValue();
            if (entityPrimaryKey == null || this.entityLockKey == null) {
                return null;
            }

            let response = await this.options.entityClient.tryLockEntity(this.options.dataName, entityPrimaryKey, this.entityLockKey);
            let lockEntityInfo = response?.data;
            if (lockEntityInfo && !lockEntityInfo.isOwner) {
                this._entityLockInfo = lockEntityInfo;
                this.enableReadOnly();
            }
            else if (this.isEntityLocked()) {
                await this.load(this.getPrimaryKeyValue());
            }
            else {
                this._entityLockInfo = lockEntityInfo;
            }
            return this._entityLockInfo;
        }

        public async tryUnlockEntity(): Promise<boolean> {
            let entityPrimaryKey = this.getPrimaryKeyValue();
            if (entityPrimaryKey == null || this.entityLockKey == null) {
                return false;
            }

            let response = await this.options.entityClient.tryUnlockEntity(this.options.dataName, entityPrimaryKey, this.entityLockKey);
            if (response?.isSuccess) {
                this._entityLockInfo = null;
                return true;
            }
            return false;
        }

        public isEntityLocked(): boolean {
            return this._entityLockInfo && !this._entityLockInfo.isOwner;
        }


        public displayHTTPError(response: Services.HttpResponse, endDisplayFunc: () => void) {

            alert('HTTP Error : code : ' + response.status + ', message : ' + response.text);
            endDisplayFunc();
        }


        public dispatchEntityChanged(args: EntityChangedArgs) {

            EntityDataController_.onEntityChanged.dispatch(this, args);
        }
    }


    export class EntityDataController_ extends EntityDataController<any> {


    }


    export interface EntityDataControllerOptions extends DataControllerBaseOptions {

        entityClient: Services.EntityClient;

        dataInfos?: EntityInfos;

        entityLockKey?: string;

    }


    export interface EntityChangedArgs {

        entityName: string;

        previousEntity: any;

        newEntity: any;

        previousEntityState: DataState;

        newEntityState: DataState;


    }





}
