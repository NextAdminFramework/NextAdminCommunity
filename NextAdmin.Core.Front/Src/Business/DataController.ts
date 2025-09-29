
/// <reference path="DataControllerBase.ts"/>

namespace NextAdmin.Business {

    export class DataController<T> extends DataControllerBase<T> {

        public static factory: (dataName: string) => DataController_;

        public form: NextAdmin.UI.IForm;

        public bindedControls = new Dictionary<UI.FormControl>();

        public data: T;

        private _originalData: any;

        public appendAction: (actionResult: (result: LoadDataResult) => void) => void = null;

        public loadAction: (args: any, actionResult: (result: LoadDataResult) => void) => void = null;

        public saveAction: (data: any, actionResult: (result: SaveDataResult) => void) => void = null;

        public deleteAction: (data: any, actionResult: (result: DeleteDataResult) => void) => void = null;

        public cancelAction: (data: any) => void = null;

        public onDataChanged = new EventHandler<DataController_, DataChangedEventArgs>();

        public onDataLoaded = new EventHandler<DataController_, LoadDataResult>();

        public onDataAppended = new EventHandler<DataController_, LoadDataResult>();

        public onDataDeleted = new EventHandler<DataController_, T>();

        public onDataSaved = new EventHandler<DataController_, SaveDataResult>();

        public onControlChanged = new EventHandler<UI.IFormControl, UI.ValueChangeEventArgs>();

        public onDataStateChanged = new EventHandler<DataController_, DataStateChangedEventArgs>();

        public onStartChangeData = new AsyncEventHandler<DataController_, DataChangedEventArgs>();

        public onStartSaveData = new AsyncEventHandler<DataController_, SaveDataEventArgs>();

        public onControlBinded = new EventHandler<DataController_, UI.IFormControl>();

        public onReadOnlyChanged = new EventHandler<DataController_, boolean>();

        _isReadOnlyEnabled?: boolean;

        _readOnlyMessage?: string;

        constructor(options: DataControllerBaseOptions) {
            super(options);
            this.data = {} as T;
            this._originalData = {};
            DataStateHelper.setDataState(this.data, DataState.append);
            DataStateHelper.setDataState(this._originalData, DataState.append);
        }



        public displayDataErrors(action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox {
            if (resultError.code == 'VERSION_CONFLICT') {
                return;
            }

            let errorsAndWarning = new Array<DataError>();
            if (resultError.errors != null) {
                errorsAndWarning.addRange(resultError.errors);
            }
            if (resultError.warnings != null) {
                errorsAndWarning.addRange(resultError.warnings);
            }
            let textError = '';
            let errorsGroupedByDataName = errorsAndWarning.groupByArray((e) => {
                let dataInfos = this.getDataInfo(e.dataName);
                if (dataInfos == null || dataInfos.displayName == null) {
                    return e.dataName;
                }
                let displayValue = dataInfos.displayName;
                if (displayValue == null) {
                    displayValue = e.dataName;
                }
                if (e.dataId != null) {
                    displayValue += ' ' + e.dataId;
                }
                return displayValue;
            });
            for (let group of errorsGroupedByDataName) {
                if (errorsGroupedByDataName.count() > 0) {//display data name
                    textError += '<br /><b>' + group.name + ' : </b><br /><br />';
                }
                for (let error of group.items) {
                    let propertyDisplayName = error.propertyDisplayName;
                    if (NextAdmin.String.isNullOrEmpty(propertyDisplayName)) {//try find display name from data info
                        propertyDisplayName = this.getDataPropertyInfo_(error.dataName, error.propertyName).displayName;
                    }
                    if (NextAdmin.String.isNullOrEmpty(propertyDisplayName) && error.dataName == this.options.dataName) {//try find display name from form
                        let formControl = (<NextAdmin.UI.FormControl>this.bindedControls[error.propertyName]);
                        if (formControl != null) {
                            let controlLabel = formControl.getLabel();
                            if (!NextAdmin.String.isNullOrEmpty(controlLabel)) {
                                propertyDisplayName = controlLabel;
                            }
                        }
                    }

                    if (error.dataName == this.options.dataName) {
                        let control = this.bindedControls[error.propertyName] as NextAdmin.UI.IFormControl;
                        if (control != null) {
                            control.setError(error.message);
                            if (NextAdmin.String.isNullOrEmpty(propertyDisplayName)) {
                                propertyDisplayName = control.getLabel();
                            }
                        }
                    }
                    else {
                        for (let controlPropertyName in this.bindedControls) {
                            if (this.bindedControls[controlPropertyName] instanceof UI.DataGrid) {
                                let grid = this.bindedControls[controlPropertyName] as UI.DataGrid<any>;
                                if (grid.datasetController != null && grid.datasetController.options.dataName == error.dataName) {
                                    let gridErrors = errorsAndWarning.where(e => e.dataName == grid.datasetController.options.dataName);
                                    grid.setError(gridErrors);
                                }
                            }
                        }
                    }

                    if (NextAdmin.String.isNullOrEmpty(propertyDisplayName)) {
                        propertyDisplayName = error.propertyName;
                    }
                    let errorMessage = '';
                    if (NextAdmin.String.isNullOrEmpty(errorMessage)) {
                        errorMessage = error.message;
                    }
                    if (!NextAdmin.String.isNullOrWhiteSpace(propertyDisplayName)) {
                        textError += '<span style="margin-left:10px">' + propertyDisplayName + '</span> : ';
                    }
                    textError += errorMessage + '<br />';
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

        public enableReadOnly(message?: string) {
            if (this._isReadOnlyEnabled) {
                return;
            }
            this._isReadOnlyEnabled = true;
            this._readOnlyMessage = message;
            if (this.form) {
                this.form.saveButton.disable();
                this.form.deleteButton.disable();
                this.form.enableReadOnly();
            }
            this.onReadOnlyChanged.dispatch(this, true);
        }


        public disableReadOnly() {
            if (!this._isReadOnlyEnabled) {
                return;
            }
            this._isReadOnlyEnabled = false;
            this._readOnlyMessage = null;
            if (this.form) {
                this.form.disableReadOnly();
            }
            this.onReadOnlyChanged.dispatch(this, false);
        }

        public clearErrors() {
            for (let propertyName in this.bindedControls) {
                let formControl = this.bindedControls[propertyName] as NextAdmin.UI.IFormControl;
                formControl.setError(null);
            }
        }


        public bindToForm(form: NextAdmin.UI.IForm, autoExecuteAction = false) {
            this.form = form;
            if (autoExecuteAction) {
                this.form.cancelButton.action = () => {
                    this.setData(this._originalData);
                };
                this.form.deleteButton.action = () => {
                    UI.MessageBox.createYesCancel(Resources.formDeleteMessageTitle, Resources.formDeleteMessage, () => {
                        this.delete();
                    });
                };
                this.form.saveButton.action = () => {
                    this.save();
                };
            }
        }



        public save(args?: SaveDataArgs): Promise<SaveDataResult> {
            args = {
                displayErrors: true,
                preCheckRequiredFields: false,
                ...args
            };
            return new Promise(async (resolve) => {

                let dataToSave = NextAdmin.Copy.clone(this.data);

                let saveDataEventArgs = {
                    data: dataToSave,
                    dataState: this.getDataState(),
                    errors: this.getValidationErrors(args.preCheckRequiredFields),
                    warnings: [],
                } as SaveDataEventArgs;


                await this.onStartSaveData.dispatch(this, saveDataEventArgs);

                if (saveDataEventArgs.errors?.length || saveDataEventArgs.warnings?.length || saveDataEventArgs.message) {
                    this.displayDataErrors(DataControllerActionType.save, {
                        errors: saveDataEventArgs.errors,
                        warnings: saveDataEventArgs.warnings,
                        message: saveDataEventArgs.message,
                        success: false,
                    });
                }

                if (saveDataEventArgs.cancel || saveDataEventArgs.errors?.length) {

                    return;
                }
                if (this.form != null) {
                    this.form.startSpin();
                }

                if (this.saveAction != null) {
                    this.saveAction(dataToSave, (result: SaveDataResult) => {
                        if (args.onGetResponse != null) {
                            args.onGetResponse(result);
                        }
                        if (this.form != null) {
                            this.form.stopSpin();
                        }
                        if (result.success) {
                            if (result.newData != null && this.options.updateDataFromServerAfterSave) {
                                Copy.copyTo(result.newData, this.data);//copy new data into actual data to not change reference of data object
                                this.setData(this.data, DataState.serialized);
                            }
                            else {
                                this.setDataState(DataState.serialized);
                                this._originalData = NextAdmin.Copy.clone(this.data);
                            }
                            this.clearErrors();
                            for (let controlName in this.bindedControls) {
                                let control = this.bindedControls[controlName];
                                (control as UI.IFormControl).setError(null);
                            }
                        }
                        else {
                            if (args.displayErrors) {
                                this.displayDataErrors(DataControllerActionType.save, result);
                            }
                        }
                        this.onDataSaved.dispatch(this, result);
                        resolve(result);
                    });
                }
                else {
                    resolve(null);
                }
            });
        }

        public getValidationErrors(checkRequiredFields = true): Array<DataError> {

            let errors = new Array<DataError>();
            if (checkRequiredFields) {
                let propertiInfos = this.getDataPropertyInfos();
                for (let propertyInfo of propertiInfos) {
                    if (propertyInfo.isRequired && this.getControl(propertyInfo.name) && (this.data[propertyInfo.name] === null || this.data[propertyInfo.name] === undefined || (propertyInfo.type == 'string' && this.data[propertyInfo.name] == ''))){
                        errors.add({
                            dataName: this.getDataInfo().name,
                            propertyName: propertyInfo.name,
                            propertyDisplayName: propertyInfo.displayName,
                            errorCode: 'REQUIRED_FIELD',
                            message: Resources.requiredField
                        });
                    }
                }
            }
            if (this.getDataPrimaryKeyValue() == null && this.getControl(this.options.dataPrimaryKeyName) != null) {
                errors.add({
                    dataName: this.getDataInfo().name,
                    propertyName: this.options.dataPrimaryKeyName,
                    propertyDisplayName: this.getDataPropertyInfo_(this.options.dataName, this.options.dataPrimaryKeyName).displayName,
                    errorCode: 'PRIMARY_KEY_REQUIRED',
                    message: Resources.requiredField
                });
            }
            return errors;
        }



        public delete(args?: DeleteDataArgs): Promise<DeleteDataResult> {
            args = {
                displayErrors: true,
                ...args
            };
            return new Promise((resolve) => {
                if (this.deleteAction != null) {
                    this.deleteAction(this.data, (result) => {
                        if (args.onGetResponse != null) {
                            args.onGetResponse(result);
                        }
                        if (result.success) {
                            this.onDataDeleted.dispatch(this, this.data);
                            this.setDataState(DataState.deleted);
                            this.clear();
                        }
                        else {
                            if (args.displayErrors) {
                                if (result.errors.length > 0) {
                                    this.displayDataErrors(DataControllerActionType.delete, result);
                                }
                                else {
                                    this.displayDataErrors(DataControllerActionType.delete, result, Resources.defaultDeleteError);
                                }
                            }
                        }
                        resolve(result);
                    });
                }
                else {
                    resolve(null);
                }
            });
        }


        public cancel() {
            if (this.cancelAction != null) {
                this.cancelAction(this.data);
            }
            else {
                this.setData(this._originalData);

            }
        }

        private _bindControl(formControl: UI.IFormControl, propertyName: string) {
            let alreadyBindedControl = this.bindedControls.get(propertyName);
            if (alreadyBindedControl) {
                this.unbindControl(alreadyBindedControl);
            }
            this.bindedControls[propertyName] = formControl;
            formControl.setDataController(this, propertyName);
            formControl['_propertyName'] = propertyName;
            formControl.onValueChanged.subscribe(formControl['_onValueChangedBindedAction'] = (control, args) => {
                this.controlChanged(control, args);
            });
            this.onControlBinded.dispatch(this, formControl);
        }


        public bindControl(formControl: UI.IFormControl, property: ((dataDef: T) => any) | string) {
            if (String.isString(property)) {
                this._bindControl(formControl, property as string);
            }
            else {
                this._bindControl(formControl, this.getPropertyName(property as any));
            }
        }

        public unbindControl(formControl: UI.IFormControl) {
            delete this.bindedControls[formControl.getBindedPropertyName()];
            formControl.onValueChanged.unsubscribe(formControl['_onValueChangedBindedAction']);
        }

        public getControl<TControl extends UI.FormControl>(property: ((dataDef: T) => any) | string): TControl {
            if (String.isString(property)) {
                return this.bindedControls[property as string];
            }
            else {
                return this.bindedControls[this.getPropertyName(property as any)];
            }
        }


        public async load(dataId?: any, args?: LoadDataArgs): Promise<LoadDataResult> {
            if (dataId == null) {
                dataId = this.getDataPrimaryKeyValue();
            }
            args = {
                displayErrors: true,
                ...args
            };
            return new Promise<LoadDataResult>((resolve, reject) => {
                if (this.loadAction == null) {
                    throw new Error('No load action');
                }
                if (this.form != null) {
                    this.form.startSpin();
                }
                this.loadAction(dataId, async (result) => {
                    if (args.onGetResponse != null) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        await this.setData(result.data, DataState.serialized);
                    }
                    else {
                        if (args.displayErrors) {
                            this.displayDefaultError(result);
                        }
                    }
                    if (this.form != null) {
                        this.form.stopSpin();
                    }
                    this.onDataLoaded.dispatch(this, result);
                    resolve(result);
                });
            });
        }

        public async append(args?: LoadDataArgs): Promise<LoadDataResult> {
            args = {
                displayErrors: true,
                ...args
            };
            return new Promise<LoadDataResult>((resolve, reject) => {
                if (this.form != null) {
                    this.form.startSpin();
                }
                this.appendAction(async (result) => {
                    if (args.onGetResponse != null) {
                        args.onGetResponse(result);
                    }
                    if (result.success) {
                        await this.setData(result.data, DataState.append);
                    }
                    if (this.form != null) {
                        this.form.stopSpin();
                    }
                    this.onDataAppended.dispatch(this, result);
                    resolve(result);
                });
            });
        }


        public async setData(data: any, state: DataState = null) {

            for (let memberName in this.bindedControls) {
                let formControl = this.bindedControls[memberName] as UI.IFormControl;
                formControl.setError(null);
            }

            if (state == null) {
                if (data['_state'] == null) {
                    state = DataState.append;
                }
                else {
                    state = data['_state'] as DataState;
                }
            }

            this.data = data;
            await this.onStartChangeData.dispatch(this, { previousData: this._originalData, newData: data, newDataState: state });
            for (let propertyName in this.bindedControls) {
                this.updateControlValueFromData(propertyName);
            }
            this.setDataState(state);
            this.onDataChanged.dispatch(this, { previousData: this._originalData, newData: data, newDataState: state });
            this._originalData = NextAdmin.Copy.clone(data);
        }

        public setDataPropertyValue(dataDefPropertyAction: (dataDef: T) => any, value?: any, fireChange?: boolean) {
            let propertyName = this.getPropertyName(dataDefPropertyAction);
            this.data[propertyName] = value;
            let control = this.getControl(propertyName);
            if (control) {
                control.setValue(value, fireChange);
            }
        }

        public updateControlValueFromData(propertyName: string) {
            let formControl = this.bindedControls[propertyName] as UI.IFormControl;

            let propertyPathArray = propertyName.split('.');
            let currentData = this.data;
            while (propertyPathArray.length > 0) {
                currentData = currentData[propertyPathArray[0]];
                if (currentData == null) {
                    currentData = null;
                    break;
                }
                propertyPathArray.removeAt(0);
            }
            let value = currentData;
            if (formControl != null) {
                formControl.setValue(value);
            }
        }

        public updateDataValueFromControl(control: UI.IFormControl) {
            let propertyName = control['_propertyName'];
            let propertyPathArray = propertyName.split('.');
            let currentData = this.data as any;
            while (propertyPathArray.length > 1) {
                let previousData = currentData;
                currentData = previousData[propertyPathArray[0]];
                if (currentData == null) {
                    previousData[propertyPathArray[0]] = currentData = {};
                }
                propertyPathArray.removeAt(0);
            }
            currentData[propertyPathArray[0]] = control.getValue();
        }



        public getDataDisplayValue(data = this.data) {
            return super.getDataDisplayValue(data);
        }

        public getDataPrimaryKeyValue(data = this.data) {
            return super.getDataPrimaryKeyValue(data);
        }

        public getPrimaryKeyValue() {
            return super.getDataPrimaryKeyValue(this.data);
        }

        public getData(): T {
            return this.data;
        }

        public getOriginalData(): T {
            return this._originalData;
        }

        protected controlChanged(control: UI.IFormControl, args: UI.ValueChangeEventArgs) {
            if (this._isReadOnlyEnabled) {
                UI.MessageBox.createOk(Resources.readOnlyMode, this._readOnlyMessage ?? Resources.readOnlyDefaultMessage);
                setTimeout(() => {
                    let propertyName = control['_propertyName'];
                    if (propertyName) {
                        control.setValue(this.data[propertyName], false)
                    }
                }, 10)
                return;
            }
            this.fireChange();
            this.updateDataValueFromControl(control);
            this.onControlChanged.dispatch(control, args);
        }


        public fireChange() {
            if (this.getDataState() == DataState.serialized) {
                this.setDataState(DataState.edited);
            }
        }

        public getDataState(): DataState {
            if (this.data == null) {
                throw Error('Unable to get data state without data');
            }
            return DataStateHelper.getDataState(this.data);
        }

        public setDataState(state: DataState) {
            if (this.data == null) {
                throw Error('Unable to set data state without data');
            }
            let previousState = this.getDataState();
            this.data['_state'] = state;
            if (this.form != null) {
                switch (state) {
                    case DataState.append:
                        if (this.form.deleteButton != null) {
                            this.form.deleteButton.disable();
                        }
                        if (this.form.saveButton != null) {
                            this.form.saveButton.enable();
                        }
                        break;
                    case DataState.edited:
                        if (this.form.deleteButton != null && !this._isReadOnlyEnabled) {
                            this.form.deleteButton.enable();
                        }
                        if (this.form.saveButton != null && !this._isReadOnlyEnabled) {
                            this.form.saveButton.enable();
                        }
                        if (this.form.cancelButton != null) {
                            this.form.cancelButton.enable();
                        }
                        break;
                    case DataState.serialized:
                        if (this.form.deleteButton != null && !this._isReadOnlyEnabled) {
                            this.form.deleteButton.enable();
                        }
                        if (this.form.saveButton != null) {
                            this.form.saveButton.disable();
                        }
                        if (this.form.cancelButton != null) {
                            this.form.cancelButton.disable();
                        }
                        break;
                    default:
                }
                if (state != DataState.append) {
                    let primaryKeyControl = this.getControl(this.options.dataPrimaryKeyName);
                    if (primaryKeyControl) {
                        primaryKeyControl.disable();
                    }
                }

            }
            this.onDataStateChanged.dispatch(this, { previousState: previousState, newState: state });
        }


        public clear() {
            this.data = {} as any;
            for (let memberName in this.bindedControls) {
                let formControl = this.bindedControls[memberName] as UI.IFormControl;
                if (formControl != null) {
                    formControl.setValue(null);
                    formControl.setError(null);
                }
            }
            this.setDataState(DataState.append)
        }

        public isDataUpToDate(): boolean {
            return this.getDataState() == DataState.serialized;
        }

        public ensureSerilized(action: (data: any) => void) {
            if (this._isReadOnlyEnabled) {
                UI.MessageBox.createOk(Resources.readOnlyMode, this._readOnlyMessage ?? Resources.readOnlyDefaultMessage);
                return;
            }
            if (DataStateHelper.getDataState(this.data) == DataState.append) {
                UI.MessageBox.createYesCancel(Resources.formSaveRequiredTitle, Resources.formSaveRequiredMessage, async () => {
                    let result = await this.save();
                    if (result.success) {
                        action(this.data);
                    }
                });
            }
            else {
                action(this.data);
            }
        }

        public ensureUpToDate(action: (data: any) => void, cancelAction?: () => void) {
            if (this._isReadOnlyEnabled) {
                UI.MessageBox.createOk(Resources.readOnlyMode, this._readOnlyMessage ?? Resources.readOnlyDefaultMessage);
                if (cancelAction) {
                    cancelAction();
                }
                return;
            }
            if (DataStateHelper.getDataState(this.data) != DataState.serialized) {
                UI.MessageBox.createYesCancel(Resources.formSaveRequiredTitle, Resources.formSaveRequiredMessage, async () => {
                    let result = await this.save();
                    if (result.success) {
                        action(this.data);
                    }
                }, cancelAction);
            }
            else {
                action(this.data);
            }
        }
    }



    export class DataController_ extends DataController<any> {



    }

    export class LocalDataController<T> extends NextAdmin.Business.DataController<T> {

        constructor(options) {
            super(options);
            this.appendAction = (actionResult) => {
                actionResult({
                    success: true,
                    data: {},
                } as LoadDataResult);
            };

        }

    }

    export interface SaveDataArgs extends DataControllerActionArgs {

        onGetResponse?: (result: SaveDataResult) => void;

        preCheckRequiredFields?: boolean;

    }

    export interface LoadDataArgs extends DataControllerActionArgs {

        onGetResponse?: (result: LoadDataResult) => void;

    }

    export interface DeleteDataArgs extends DataControllerActionArgs {

        onGetResponse?: (result: DeleteDataResult) => void;

    }


    export interface SaveDataEventArgs {

        data: any;

        dataState: any;

        errors: Array<DataError>;

        warnings: Array<DataError>;

        message?: string;

        cancel?: boolean;
    }

}