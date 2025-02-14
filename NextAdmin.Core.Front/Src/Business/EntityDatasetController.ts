
/// <reference path="DatasetController.ts"/>

namespace NextAdmin.Business {
    export class EntityDatasetController extends DatasetController_ {

        public options: EntityDatasetControllerOptions;

        constructor(options: EntityDatasetControllerOptions) {
            super(options);

            this.loadAction = (actionResult) => {
                let args = this.buildQuery();
                this.options.entityClient.getEntities(args, (response) => {
                    let loadResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        message: response.message,
                        dataset: response.entities,
                        code: response.code,
                    } as LoadDatasetResult;
                    actionResult(loadResult);
                }, (response) => {
                    this.displayHTTPError(response, () => {
                        actionResult({ success: false });
                    });
                });
            };


            this.saveAction = (dataset: Array<any>, actionResult) => {

                let saveEntitiesArgs = {
                    entityName: this.options.dataName,
                    entitiesToAddOrUpdate: dataset.where((e) => e['_state'] != DataState.deleted),
                    entitiesToDeleteIds: dataset.where((e) => e['_state'] == DataState.deleted).select(e => e[this.options.dataPrimaryKeyName])
                } as NextAdmin.Models.SaveEntitiesArgs;

                this.options.entityClient.saveEntities(saveEntitiesArgs, (response) => {
                    let saveResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        errors: response.errors != null ? response.errors.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        warnings: response.warings != null ? response.warings.select(e => <DataError>{ dataName: e.entityName, dataDisplayName: this.getDataInfo(e.entityName).displayName, dataId: e.entityId, propertyName: e.memberName, propertyDisplayName: this.getDataPropertyInfo_(e.entityName, e.memberName).displayName, message: e.message, errorCode: e.errorCode }) : [],
                        message: response.message,
                        newDataset: response.entities,
                        code: response.code
                    } as SaveDatasetResult;
                    actionResult(saveResult);
                }, (response) => {
                    this.displayHTTPError(response, () => {
                        actionResult({ success: false });
                    });
                });
            };


            this.appendAction = (actionResult) => {

                this.options.entityClient.createEntity({ entityName: this.options.dataName }, (response) => {
                    let loadResult = {
                        success: response.code == NextAdmin.Models.ApiResponseCode.Success,
                        message: response.message,
                        data: response.entity,
                        code: response.code
                    } as LoadDataResult;
                    actionResult(loadResult);
                }, (response) => {
                    this.displayHTTPError(response, () => {
                        actionResult({ success: false });
                    });
                });
            };
        }

        public displayDataErrors(dataset: Array<any>, action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox {
            let messageBox = super.displayDataErrors(dataset, action, resultError, defaultErrorMessage, okAction);
            if (action == DataControllerActionType.delete && messageBox && dataset?.length == 1) {

                Business.EntityHelper.getLinkedEntities(this.options.entityClient, this.options.dataInfos, this.options.dataName, dataset[0][this.options.dataPrimaryKeyName]).then((linkedEntitiesInfos) => {
                    if (linkedEntitiesInfos?.length) {
                        messageBox.body.appendHTML('div', (container) => {

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


        public displayHTTPError(response: Services.HttpResponse, endDisplayFunc: () => void) {
            alert('HTTP Error : code : ' + response.status + ', message : ' + response.text);
            endDisplayFunc();
        }


        public buildQuery(): NextAdmin.Models.GetEntitiesArgs {

            let where = '';
            if (!String.isNullOrEmpty(this._where)) {
                where = this._where;
            }
            if (!String.isNullOrEmpty(this._searchWhere)) {
                if (!String.isNullOrEmpty(where)) {
                    where = '(' + where + ') AND (' + this._searchWhere + ')';
                }
                else {
                    where = this._searchWhere;
                }
            }
            let whereValues = this._whereValues.clone();
            whereValues.addRange(this._searchValues);

            return {
                entityName: this.options.dataName,
                whereQuery: where,
                whereQueryArgs: whereValues,
                orderColumnNames: this._orderBy,
                columnToSelectNames: this._columnsToSelect?.length == 0 ? null : this._columnsToSelect,
                skipRecordCount: this._skip,
                takeRecordCount: this._take,
                isSelectDistinctQuery: this._distinct
            } as NextAdmin.Models.GetEntitiesArgs;
        }



        private _take?: number;
        public take(count?: number) {
            this._take = count;
        }

        private _skip?: number;
        public skip(count: number) {
            this._skip = count;
        }

        private _orderBy?: Array<string>;
        public orderBy(...columns: { name: string, desc?: boolean }[]) {
            let orderBy = [];
            for (let column of columns) {
                orderBy.add(column.name + (column.desc ? ' DESC' : ''));
            }
            this._orderBy = orderBy;
        }

        private _columnsToSelect?: string[];
        public select(...columns: string[]) {
            this._columnsToSelect = columns;
        }

        private _distinct?: boolean;
        public distinct(value = true) {
            this._distinct = value;
        }

        private _where = null;
        private _whereValues = [];
        public where(query: string, ...values: any[]) {
            this._whereValues = [];
            for (let value of values) {
                this._whereValues.add(value);
            }
            this._where = query;
            return this;
        }

        private _searchWhere = null;
        private _searchValues = [];
        public search(searchPropertyNames: string[], seacrhValue?: string) {
            this._searchWhere = '';
            this._searchValues = [];
            if (searchPropertyNames == null || searchPropertyNames.length == 0) {
                return;
            }
            if (String.isNullOrEmpty(seacrhValue)) {
                return;
            }
            let seacrhParts = seacrhValue.split(' ');
            let i = 0;
            for (let seacrhPart of seacrhParts) {
                if (seacrhPart == '' || seacrhPart == '')
                    continue;
                if (i > 0) {
                    this._searchWhere += ' AND '
                }
                this._searchWhere += '(';
                let j = 0;
                for (let searchmember of searchPropertyNames) {
                    if (j > 0) {
                        this._searchWhere += ' OR ';
                    }
                    this._searchWhere += 'LOWER(' + searchmember + ')' + ' LIKE LOWER(?)';
                    this._searchValues.add('%' + seacrhPart + '%');
                    j++;
                }
                this._searchWhere += ')';
                i++;
            }
        }

        setQuery(queryData: Models.Query) {
            this._columnsToSelect = queryData.columnToSelectNames;
            this._orderBy = queryData.orderColumnNames;
            this._where = queryData.whereQuery;
            this._whereValues = queryData.whereQueryArgs;
            this._skip = queryData.skipRecordCount;
            this._take = queryData.takeRecordCount;
            this._distinct = queryData.isSelectDistinctQuery;
        }

        getQuery(): Models.Query {
            return {
                columnToSelectNames: this._columnsToSelect,
                orderColumnNames: this._orderBy,
                whereQuery: this._where,
                whereQueryArgs: this._whereValues,
                skipRecordCount: this._skip,
                takeRecordCount: this._take,
                isSelectDistinctQuery: this._distinct
            };
        }

        public clone(): EntityDatasetController {
            let clone = new EntityDatasetController(this.options);
            clone._take = this._take;
            clone._skip = this._skip;
            clone._orderBy = this._orderBy;
            clone._columnsToSelect = this._columnsToSelect;
            clone._where = this._where;
            clone._whereValues = this._whereValues;
            clone._searchWhere = this._searchWhere;
            clone._searchValues = this._searchValues;
            return clone;
        }


    }


    export interface EntityDatasetControllerOptions extends DataControllerOptions {

        entityClient: Services.EntityClient;

        dataInfos?: EntityInfos;

    }


}




