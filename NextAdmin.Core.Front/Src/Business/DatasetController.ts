
/// <reference path="DataControllerBase.ts"/>

namespace NextAdmin.Business {


    export class DatasetController<T> extends DataControllerBase<T> {

        public static factory: (dataName: string) => DatasetController_;

        dataset: Array<any> = [];

        loadAction: (resultDataset: (result: LoadDatasetResult) => void) => void;

        saveAction: (dataset: Array<any>, resultDataset?: (result: SaveDatasetResult) => void) => void;

        appendAction: (resultDataset?: (result: LoadDataResult) => void) => void;

        onStartRequest = new EventHandler<DatasetController_, Array<any>>();

        onEndRequest = new EventHandler<DatasetController_, Array<any>>();

        onStartLoadData = new EventHandler<DatasetController_, Array<any>>();

        onDataLoaded = new EventHandler<DatasetController_, LoadDatasetResult>();

        onDataAdded = new EventHandler<DatasetController_, LoadDatasetResult>();

        onStartSaveData = new EventHandler<DatasetController_, Array<any>>();

        onDataSaved = new EventHandler<DatasetController_, SaveDatasetResult>();

        onDataDeleted = new EventHandler<DatasetController_, SaveDatasetResult>();

        onStartAppeningData = new EventHandler<DatasetController_, Array<any>>();

        onDataAppened = new EventHandler<DatasetController_, LoadDataResult>();

        onDataCleared = new EventHandler<DatasetController_, Array<any>>();

        onDataChanged = new EventHandler<DatasetController_, DataChangedArgs>();

        options: DataControllerOptions;


        constructor(options: DataControllerOptions) {
            super(options);
            if (this.options.columnsToSelect != null) {
                this.select(...this.options.columnsToSelect);
            }
        }


        public displayDataErrors(dataset: Array<T>, action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox {

            let errorsAndWarning = new Array<DataError>();
            if (resultError.errors != null) {
                errorsAndWarning.addRange(resultError.errors);
            }
            if (resultError.warnings != null) {
                errorsAndWarning.addRange(resultError.warnings);
            }
            let textError = '';
            let errorsGroupedByDataName = errorsAndWarning.groupByArray((e) => {
                let displayName = this.getDataInfo(e.dataName).displayName;
                if (displayName == null) {
                    displayName = e.dataName;
                }
                return displayName + ' ' + e.dataId;
            });
            for (let group of errorsGroupedByDataName) {
                if (errorsGroupedByDataName.count() > 0) {//display data name
                    textError += '<br /><b>' + group.name + ' : </b><br /><br />';
                }
                for (let error of group.items) {
                    let propertyDisplayName = error.propertyDisplayName;
                    if (NextAdmin.String.isNullOrEmpty(propertyDisplayName)) {
                        propertyDisplayName = this.getDataPropertyInfo_(error.dataName, error.propertyName).displayName;
                    }
                    if (NextAdmin.String.isNullOrEmpty(propertyDisplayName)) {
                        propertyDisplayName = error.propertyName;
                    }
                    let errorMessage = '';
                    if (NextAdmin.String.isNullOrEmpty(errorMessage)) {
                        errorMessage = error.message;
                    }
                    textError += '<span style="margin-left:10px">' + propertyDisplayName + '</span> : ' + errorMessage + '<br />';
                }
            }
            if (NextAdmin.String.isNullOrEmpty(textError)) {
                textError = defaultErrorMessage;
            }
            if (NextAdmin.String.isNullOrEmpty(textError)) {
                textError = resultError.message;
            }
            if (NextAdmin.String.isNullOrEmpty(textError)) {
                textError = Resources.unknownError;
            }
            return UI.MessageBox.createOk(Resources.error, textError, okAction);
        }


        public async load(args?: LoadDatasetArgs): Promise<LoadDatasetResult> {
            args = {
                displayErrors: true,
                dataState: Business.DataState.serialized,
                ...args
            };
            return new Promise<LoadDatasetResult>((resolve) => {
                this.onStartLoadData.dispatch(this, this.dataset);
                this.onStartRequest.dispatch(this, this.dataset);
                this.loadAction((result) => {
                    if (args.onGetResponse) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        let previousDataset = this.dataset;
                        this.dataset = result.dataset;
                        for (let data of this.dataset) {
                            if (data['_state'] === undefined) {
                                data['_state'] = args.dataState;
                            }
                        }
                        this.onDataLoaded.dispatch(this, result);
                        this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDataErrors(null, DataControllerActionType.load, result);
                        }
                    }
                    this.onEndRequest.dispatch(this, this.dataset);
                    resolve(result);
                });
            });
        }

        public async loadAdd(args?: LoadDatasetArgs): Promise<LoadDatasetResult> {
            args = {
                displayErrors: true,
                dataState: Business.DataState.serialized,
                ...args
            };
            return new Promise<LoadDatasetResult>((resolve) => {
                this.onStartLoadData.dispatch(this, this.dataset);
                this.onStartRequest.dispatch(this, this.dataset);
                this.loadAction((result) => {
                    if (args.onGetResponse) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        let previousDataset = this.dataset.clone();
                        for (let data of result.dataset) {
                            if (data['_state'] === undefined) {
                                data['_state'] = args.dataState;
                            }
                            this.dataset.add(data);
                        }
                        this.onDataAdded.dispatch(this, result);
                        this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDataErrors(null, DataControllerActionType.load, result);
                        }
                    }
                    this.onEndRequest.dispatch(this, this.dataset);
                    resolve(result);
                });
            });
        }



        public async save(args?: SaveDatasetArgs): Promise<SaveDatasetResult> {
            args = {
                displayErrors: true,
                ...args
            };
            return new Promise<SaveDatasetResult>((resolve) => {
                this.onStartSaveData.dispatch(this, this.dataset);
                this.onStartRequest.dispatch(this, this.dataset);
                this.saveAction(this.dataset, (result: SaveDatasetResult) => {
                    if (args.onGetResponse != null) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        let previousDataset = this.dataset.clone();
                        this.dataset = result.newDataset;
                        this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDataErrors(this.dataset, DataControllerActionType.save, result);
                        }
                    }
                    this.onDataSaved.dispatch(this, result);
                    this.onEndRequest.dispatch(this, this.dataset);
                    resolve(result);
                });
            });
        }


        public async deleteItems(items: Array<any>, args?: SaveDatasetArgs): Promise<SaveDatasetResult> {
            args = {
                displayErrors: true,
                ...args
            };
            return new Promise<SaveDatasetResult>((resolve) => {
                this.onStartRequest.dispatch(this, this.dataset);
                for (let item of items) {
                    item['_state'] = DataState.deleted;
                }
                this.saveAction(items, async (result: SaveDatasetResult) => {
                    if (args.onGetResponse != null) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        let previousDataset = this.dataset.clone();
                        for (let deletedItem of items) {
                            this.dataset.remove(deletedItem);
                        }
                        this.onDataDeleted.dispatch(this, result);
                        this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDataErrors(items, DataControllerActionType.delete, result, Resources.defaultDeleteError);
                        }
                    }
                    this.onEndRequest.dispatch(this, this.dataset);
                    resolve(result);
                });
            });
        }



        public append(args?: LoadDatasetArgs): Promise<LoadDataResult> {
            args = {
                displayErrors: true,
                dataState: DataState.append,
                ...args
            };
            return new Promise<LoadDataResult>((promise) => {
                this.onStartAppeningData.dispatch(this, this.dataset);
                this.onStartRequest.dispatch(this, this.dataset);
                this.appendAction((result: LoadDataResult) => {
                    if (args.onGetResponse != null) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        let previousDataset = this.dataset.clone();
                        if (result.data['_state'] === undefined) {
                            result.data['_state'] = args.dataState;
                        }
                        this.dataset.add(result.data);
                        this.onDataAppened.dispatch(this, result);
                        this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDataErrors(null, DataControllerActionType.append, result);
                        }
                    }
                    this.onEndRequest.dispatch(this, this.dataset);
                    promise(result);
                });
            });


        }


        public clear() {
            let previousDataset = this.dataset.clone();
            this.dataset = [];
            this.onDataCleared.dispatch(this, this.dataset);
            this.onDataChanged.dispatch(this, { previousDataset: previousDataset, newDataset: this.dataset });
        }


        public getDataItemById(id: any): any {
            return this.dataset.firstOrDefault(e => e[this.options.dataPrimaryKeyName] == id);
        }


        public displayLostDataMessageIfNeededAndExecuteAction(actionToExecute: () => void) {
            if (this.dataset.firstOrDefault(e => DataStateHelper.getDataState(e) != DataState.serialized) != null) {
                UI.MessageBox.createYesCancel(Resources.warning, Resources.lostDataNotSavedMessage, actionToExecute);
            }
            else {
                actionToExecute();
            }
        }



        public isDataUpToDate() {
            return this.dataset.firstOrDefault(e => DataStateHelper.getDataState(e) != DataState.serialized) == null;
        }

        public ensureUpToDate(action: (dataset: any[]) => void) {
            if (!this.isDataUpToDate()) {
                UI.MessageBox.createYesCancel(Resources.formSaveRequiredTitle, Resources.formSaveRequiredMessage, async () => {
                    let result = await this.save();
                    if (result.success) {
                        action(this.dataset);
                    }
                });
            }
            else {
                action(this.dataset);
            }
        }



        public take(count?: number) {
            throw new Error('Not implemented');
        }

        public skip(count: number) {
            throw new Error('Not implemented');
        }

        public orderBy(...columns: { name: string, desc?: boolean }[]) {
            throw new Error('Not implemented');
        }

        public select(...columns: string[]) {
            throw new Error('Not implemented');
        }

        public distinct(value = true) {
            throw new Error('Not implemented');
        }

        public where(query: string, ...values: any[]) {
            throw new Error('Not implemented');
        }

        public search(searchPropertyNames: string[], seacrhValue?: string) {
            throw new Error('Not implemented');
        }

        setQuery(queryData: Models.Query) {
            throw new Error('Not implemented');
        }

        getQuery(): Models.Query {
            throw new Error('Not implemented');
        }


        public clone(): DatasetController_ {
            return new DatasetController_(this.options);
        }

    }


    export class DatasetController_ extends DatasetController<any> {


    }



    export interface DataChangedArgs {

        previousDataset?: Array<any>;

        newDataset?: Array<any>;

    }

    export interface DataControllerOptions extends DataControllerBaseOptions {

        columnsToSelect?: Array<string>;

    }

    export interface LoadDatasetArgs extends DataControllerActionArgs {

        onGetResponse?: (result: LoadDatasetResult) => void;

        dataState?: Business.DataState;

    }


    export interface SaveDatasetArgs extends DataControllerActionArgs {

        onGetResponse?: (result: SaveDatasetResult) => void;

    }



}