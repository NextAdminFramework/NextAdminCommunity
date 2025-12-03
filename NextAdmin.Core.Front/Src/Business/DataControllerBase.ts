/// <reference path="../EventHandler .ts"/>

namespace NextAdmin.Business {

    export class DataControllerBase<T> {

        public options: DataControllerBaseOptions;

        constructor(options: DataControllerBaseOptions) {
            if (options.updateDataFromServerAfterSave === undefined) {
                options.updateDataFromServerAfterSave = true;
            }
            if (options.dataPrimaryKeyName == null) {
                if (options.dataInfos != null) {
                    let dataInfo = options.dataInfos.get(options.dataName);
                    if (dataInfo) {
                        let propertyInfos = dataInfo.propertyInfos;
                        for (let propertyName in propertyInfos) {
                            if ((propertyInfos[propertyName] as DataPropertyInfo).isPrimaryKey) {
                                options.dataPrimaryKeyName = propertyName;
                                break;
                            }
                        }
                    }
                }
                if (options.dataPrimaryKeyName == null) {
                    options.dataPrimaryKeyName = 'id';
                }
            }
            this.options = options;
        }

        public getDataPropertyInfoFromPath(dataName: string, path: string): DataPropertyInfo {
            if (this.options.dataInfos == null)
                return null;
            let dataInfo = this.getDataInfo(dataName);
            let pathArray = path.split('.');
            let lastPropertyName = pathArray.lastOrDefault();
            pathArray.removeAt(pathArray.length - 1);

            while (pathArray.length > 0) {
                let pathItem = pathArray[0];

                let found = false;
                for (let propertyName in dataInfo.propertyInfos) {
                    let property = dataInfo.propertyInfos[propertyName] as DataPropertyInfo;
                    if (property.foreignDataRelationName == pathItem) {
                        dataInfo = this.getDataInfo(property.foreignDataName);
                        pathArray.removeAt(0);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return null;
                }
            }
            let propertyInfo = dataInfo.propertyInfos[lastPropertyName];
            return propertyInfo;
        }

        public getDataName() {
            return this.options.dataName;
        }

        public getDataPrimaryKeyName(): string {
            return this.options.dataPrimaryKeyName;
        }

        public getDataPropertyInfo_(dataName: string, propertyName: string): DataPropertyInfo {
            let defaultPropertyInfo = { dataName: dataName, name: propertyName };
            if (this.options.dataInfos == null)
                return defaultPropertyInfo;
            let dataInfo = this.getDataInfo(dataName);
            if (dataInfo?.propertyInfos == null) {
                return defaultPropertyInfo;
            }
            let propertyInfo = dataInfo.propertyInfos[propertyName];
            if (propertyInfo == null) {
                return defaultPropertyInfo;
            }
            return propertyInfo;
        }

        public getDataPropertyInfo(property: ((dataDef: T) => any) | string): DataPropertyInfo {
            if (String.isString(property)) {
                return this.getDataPropertyInfo_(this.options.dataName, property as string);
            }
            else {
                return this.getDataPropertyInfo_(this.options.dataName, this.getPropertyName(property as any));
            }
        }

        public getDataInfo(dataName = this.options.dataName): DataInfo {
            let defaultEntityInfo = { name: dataName, propertiesInfos: {} };
            if (this.options.dataInfos == null)
                return defaultEntityInfo;
            let dataInfo = this.options.dataInfos[dataName];
            if (dataInfo == null) {
                return defaultEntityInfo;
            }
            return dataInfo;
        }

        public getDataPropertyInfos(dataName = this.options.dataName): Array<DataPropertyInfo> {
            let dataInfo = this.getDataInfo(dataName);
            let propertiesInfos = [];
            for (let propertyName in dataInfo.propertyInfos) {
                propertiesInfos.push(dataInfo.propertyInfos[propertyName]);
            }
            return propertiesInfos;
        }



        public getDataDisplayName(dataName = this.options.dataName) {
            let dataDisplayName = this.getDataInfo(dataName).displayName;
            return dataDisplayName != null ? dataDisplayName : dataName;
        }


        public getDataDisplayValue(data: any) {
            let displayValue = '';
            let dataInfo = this.getDataInfo();
            if (dataInfo?.displayPropertiesNames) {
                let displayValues = [];
                for (let displayPropertyName of dataInfo.displayPropertiesNames) {
                    let dataValue = data[displayPropertyName];
                    if (!String.isNullOrWhiteSpace(dataValue)) {
                        displayValues.add(dataValue);
                    }
                }
                if (displayValues.length > 0) {
                    displayValue = displayValues.join(' ');
                }
            }
            else {
                displayValue = this.getDataPrimaryKeyValue(data);
            }
            if (NextAdmin.String.isNullOrWhiteSpace(displayValue)) {
                displayValue = Resources.unamed;
            }
            return displayValue;
        }


        public getDataPropertyPaths(dataName = this.options.dataName, exploreJoinedData = true, includeForeignKey = false): Array<{ label: string, path: string }> {

            let dataVars = new Array<{ label: string, path: string }>();
            let schemaDatasInfos = this.options.dataInfos;
            let dataToExplores: { dataName: string, path?: string; dataDisplayName?: string }[];
            dataToExplores = [];
            dataToExplores.add({ dataName: dataName });

            while (dataToExplores.length > 0) {
                let currentData = dataToExplores[0];
                dataToExplores.removeAt(0);
                let currentDataInfo = schemaDatasInfos[currentData.dataName] as DataInfo;
                if (currentDataInfo == null) {
                    continue;
                }
                for (let propertyName in currentDataInfo.propertyInfos) {
                    let propertyInfo = (currentDataInfo.propertyInfos[propertyName] as any as DataPropertyInfo);
                    if (propertyInfo.isQueryable == true && (propertyInfo.displayName != null || (propertyInfo.isPrimaryKey && propertyInfo.dataName == currentData.dataName))) {
                        let selectQuery = currentData.path == null ? propertyName : currentData.path + '.' + propertyName;
                        let displayName = propertyInfo.displayName != null ? propertyInfo.displayName : propertyInfo.name;
                        if (exploreJoinedData && propertyInfo.foreignDataName) {
                            let foreignData = schemaDatasInfos[propertyInfo.foreignDataName] as DataInfo;
                            if (foreignData != null && foreignData.name != currentDataInfo.name && (NextAdmin.String.isNullOrEmpty(currentData?.path) || currentData.path.split('.').length < 5)) {
                                dataToExplores.add({
                                    dataName: propertyInfo.foreignDataName,
                                    path: currentData.path == null ? propertyInfo.foreignDataRelationName : currentData.path + '.' + propertyInfo.foreignDataRelationName,
                                    dataDisplayName: currentData.dataDisplayName == null ? propertyInfo.displayName : currentData.dataDisplayName + '->' + foreignData.displayName + ' (' + propertyInfo.displayName + ')'
                                });
                            }
                        }
                        if (!includeForeignKey && propertyInfo.foreignDataName != null && !propertyInfo.isPrimaryKey) {
                            continue;
                        }
                        if (propertyInfo.isPrimaryKey) {
                            displayName += ' (' + Resources.primaryKey + ')';
                        }
                        if (propertyInfo.foreignDataName != null) {
                            displayName += ' (' + Resources.linkTo + ' : ' + propertyInfo.foreignDataRelationName + ')';
                        }
                        dataVars.add({ path: selectQuery, label: currentData.dataDisplayName == null ? displayName : currentData.dataDisplayName + '->' + displayName });
                    }
                }

            }
            dataVars = dataVars.orderBy(e => e.label.contains('>') ? e.label.replace('>', Array.from(e.label).where(e => e == '>').length.toString()) : '0000' + e.label);
            return dataVars;
        }


        public getDataPrimaryKeyValue(data: any) {
            return data[this.options.dataPrimaryKeyName];
        }

        public isDataUpToDate(): boolean {
            throw new Error('Not implemented');
        }

        public save(args?: DataControllerActionArgs): Promise<any> {
            throw new Error('Not implemented');
        }

        public displayDefaultError(result: Result) {
            UI.MessageBox.createOk(Resources.error, 'Code : ' + result.code + '<br />' + (result.message != null ? result.message : ''));
        }

        public askUserToSaveDataIfNeededAndExecuteAction(continueAction: (dataSaved: boolean) => void, cancelAction?: () => void) {
            if (!this.isDataUpToDate()) {
                let messageBox = new UI.MessageBox({
                    title: Resources.saveLastModification,
                    text: Resources.lostDataNotSavedMessage,
                    buttons: [new UI.Button({
                        text: Resources.saveIcon + ' ' + Resources.saveAndContinue,
                        style: UI.ButtonStyle.green,
                        action: async () => {
                            let result = await this.save();
                            if (result.code == NextAdmin.Models.ApiResponseCode.Success) {
                                continueAction(true);
                            }
                            else if (cancelAction) {
                                cancelAction();
                            }
                            messageBox.close();
                        }
                    }), new UI.Button({
                        text: Resources.discardAndContinue,
                        action: () => {
                            messageBox.close();
                            continueAction(false);
                        }
                    }), new UI.Button({
                        text: Resources.cancel,
                        action: () => {
                            messageBox.close();
                            if (cancelAction) {
                                cancelAction();
                            }
                        }
                    })]
                });
                messageBox.open();
            }
            else {
                continueAction(true);
            }
        }

        private _dataDef: T;
        public getDataDef(): T {
            if (this._dataDef == null) {
                this._dataDef = {} as T;
                for (let propertyName in this.getDataInfo().propertyInfos) {
                    this._dataDef[propertyName] = propertyName;
                }
            }
            return this._dataDef;
        }

        public getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string {
            return dataDefPropertyAction(this.getDataDef());
        }

    }



    export class DataControllerBase_ extends DataControllerBase<any> {



    }

    export interface DataControllerBaseOptions {

        dataName: string;

        dataPrimaryKeyName?: string;

        dataInfos?: Dictionary<DataInfo>;

        updateDataFromServerAfterSave?: boolean;

    }

    export interface SaveDataResult extends ResultErrors {

        success: boolean

        message?: string;

        newData?: any;

    }


    export interface Result {

        message?: string;

        code?: string;

        success: boolean;
    }


    export interface ResultErrors extends Result {

        errors?: Array<DataError>;

        warnings?: Array<DataError>;

    }


    export interface DeleteDataResult extends ResultErrors {



    }

    export interface LoadDataResult extends Result {

        data?: any;

    }


    export interface DataError {
        dataName?: string;
        dataDisplayName?: string;
        dataId?: string;
        propertyName: string;
        propertyDisplayName: string;
        message: string;
        errorCode: string;
    }


    export interface SaveDatasetResult extends ResultErrors {

        message?: string;

        newDataset?: Array<any>;

    }


    export interface LoadDatasetResult extends Result {

        dataset?: Array<any>;

    }

    export interface DataInfo {

        name: string;

        displayName?: string;

        displayPropertiesNames?: string[];

        propertyInfos?: Record<string, DataPropertyInfo> | {};

    }



    export interface DataPropertyInfo {

        dataName: string;

        name: string;

        displayName?: string;

        type?: string;

        isPrimaryKey?: boolean;

        isRequired?: boolean;

        values?: Models.ValueItem[];

        foreignDataName?: string;

        foreignDataRelationName?: string;

        isQueryable?: boolean;

    }


    export interface DataChangedEventArgs {

        previousData: any;

        newData: any;

        newDataState: DataState;
    }

    export interface DataStateChangedEventArgs {

        previousState: DataState;

        newState: DataState;

    }
    export enum DataErrorType {
        unknow = 0,
        emptyValue = 1,
        invalidValue = 2,
    }

    export enum DataState {
        append = 0,
        edited = 1,
        serialized = 2,
        deleted = 3
    }

    export enum DataControllerActionType {
        append,
        load,
        save,
        delete
    }

    export class DataStateHelper {

        public static getDataState(data: any): DataState {
            let state = data['_state'];
            if (state == null) {
                return DataState.append;
            }
            return state as DataState;
        }

        public static setDataState(data: any, state: DataState) {
            data['_state'] = state;
        }

    }

    export interface DataControllerActionArgs {

        displayErrors?: boolean;

    }


}