
/// <reference path="InputSelect.ts"/>

namespace NextAdmin.UI {

    export class DataSelect extends InputSelect {

        public dropDownMenuButton?: DropDownButton;

        options: DataSelectOptions;

        public static onCreated = new EventHandler<DataSelect, DataSelectOptions>();

        public datasetController: NextAdmin.Business.DatasetController_;

        constructor(options?: DataSelectOptions) {
            super({
                canAddData: true,
                canEditData: true,
                hasDropDownMenu:true,
                resetSearchAtOpen: false,
                canAddCustomValue: false,
                searchItemsCount: 100,
                lightButtons: true,
                allowNullValue: true,
                searchPropertiesNames: options?.displayPropertiesNames,
                searchAction: (searchValue, seacrhResultAction) => {
                    this.options.datasetController.take(this.options.searchItemsCount ?? null);
                    if (this.options.orderBy) {
                        this.options.datasetController.orderBy(...this.options.orderBy);
                    }
                    let dataInfo = this.datasetController.getDataInfo();
                    if (dataInfo != null) {
                        this.options.datasetController.search(this.options.searchPropertiesNames
                            .where(a => dataInfo.propertyInfos[a] != null && dataInfo.propertyInfos[a].isQueryable), searchValue);//check that columns are querieable
                    }
                    else {
                        this.options.datasetController.search(this.options.searchPropertiesNames, searchValue);
                    }

                    if (dataInfo && this.options.displayPropertiesNames && this.options.displayPropertiesNames.length > 0
                        && this.options.displayPropertiesNames.firstOrDefault(a => dataInfo.propertyInfos[a] == null || !dataInfo.propertyInfos[a].isQueryable) == null) {
                        let selectColumns = this.options.displayPropertiesNames.clone();
                        if (!selectColumns.contains(this.datasetController.options.dataPrimaryKeyName)) {
                            selectColumns.add(this.datasetController.options.dataPrimaryKeyName);
                        }
                        this.options.datasetController.select(...selectColumns);
                    }
                    this.options.datasetController.where('');
                    if (this.options.onStartLoadData) {
                        this.options.onStartLoadData(this);
                    }

                    this.options.datasetController.load({
                        onGetResponse: (result) => {
                            if (result.success) {
                                let items = new Array<SelectItem>();
                                for (let data of result.dataset) {
                                    let label = '';
                                    if (this.options.itemDisplayValueFunc) {
                                        label = this.options.itemDisplayValueFunc(data);
                                    }
                                    else {
                                        for (let displayProperty of this.options.displayPropertiesNames) {
                                            if (label != '') {
                                                label += ' ';
                                            }
                                            label += data[displayProperty];
                                        }
                                    }
                                    items.add({
                                        value: data[this.options.datasetController.options.dataPrimaryKeyName],
                                        label: label
                                    } as SelectItem);
                                }
                                if (this.options.allowNullValue) {
                                    items.add({
                                        value: '',
                                        label: ''
                                    } as SelectItem);
                                }
                                seacrhResultAction(items);
                            }
                            else {
                                seacrhResultAction(null);
                            }
                        }
                    });

                },
                ...options
            } as DataSelectOptions);
            this.options.datasetController = this.options.datasetController == null && this.options.dataName != null ? NextAdmin.Business.DatasetController_.factory(this.options.dataName) : this.options.datasetController;
            this.datasetController = this.options.datasetController;
            if (this.options.dataName == null && this.datasetController != null) {
                this.options.dataName = this.datasetController.options.dataName;
            }
            if (this.options.displayPropertiesNames == null && this.options.searchPropertiesNames == null && this.datasetController != null) {
                let dataInfo = this.datasetController.getDataInfo();
                if (dataInfo) {
                    this.options.displayPropertiesNames = this.options.searchPropertiesNames = dataInfo.displayPropertiesNames;
                }
            }
            this.openDropDownButton.element.style.display = 'none';

            this.dropDownMenuButton = this.addLeftAddon(new DropDownButton({
                text: Resources.menuIcon,
                style: UI.ButtonStyle.noBg,
                onOpeningDropDown: (button, args) => {
                    this.onOpeningDropdownMenu(args);
                }
            }));

            if (!this.options.hasDropDownMenu || (!this.options.canAddData && !this.options.canEditData)) {
                this.dropDownMenuButton.hide();
            }
            DataSelect.onCreated.dispatch(this, this.options);
        }


        protected onOpeningDropdownMenu(args: OpeningDropDownArgs) {
            args.dropDown.clearItems();
            let dataPrimaryKey = this.getValue();

            if (this.options.formModalFactory != null && this.datasetController) {

                if (this.options.canAddData) {
                    let addButton = args.dropDown.appendControl(new Button({
                        text: Resources.addIcon + ' ' + Resources.newEntry,
                        action: () => {
                            let modal: DataFormModal_;
                            if (this.options.formModalFactory != null) {
                                modal = this.options.formModalFactory(this.options.dataName, null);
                            }
                            else if (this.options.dataName != null) {
                                modal = DataFormModal_.formModalByDataNameFactory(this.options.dataName);
                            }
                            else {
                                console.log('unable to find modal');
                                return;
                            }

                            modal.open({ appendNewData: true });
                            modal.dataController.onDataSaved.subscribe((sender, args) => {
                                if (args.newData != null) {
                                    let value = args.newData[this.options.datasetController.options.dataPrimaryKeyName];
                                    this.setValue(value, true);
                                }
                            });
                            modal.dataController.onDataDeleted.subscribe((sender, data) => {
                                let value = data[this.options.datasetController.options.dataPrimaryKeyName];
                                if (this.getValue() == value) {
                                    this.clearAll();
                                }
                            });
                        }
                    }));
                }

                if (this.options.canEditData) {
                    let openButton = args.dropDown.appendControl(new Button({
                        text: Resources.openIcon + ' ' + Resources.openEntry,
                        action: () => {
                            let dataPrimaryKey = this.getValue();
                            if (dataPrimaryKey == null) {
                                return;
                            }
                            let modal: DataFormModal_;
                            if (this.options.formModalFactory != null) {
                                modal = this.options.formModalFactory(this.options.dataName, { dataPrimaryKey: dataPrimaryKey });
                            }
                            else if (this.options.dataName != null) {
                                modal = DataFormModal_.formModalByDataNameFactory(this.options.dataName, { dataPrimaryKey: dataPrimaryKey });
                            }
                            if (modal == null) {
                                console.log('unable to find modal');
                                return;
                            }
                            modal.open({ dataPrimaryKey: dataPrimaryKey });
                            modal.dataController.onDataSaved.subscribe((sender, args) => {
                                if (args.newData != null) {
                                    let value = args.newData[this.options.datasetController.options.dataPrimaryKeyName];
                                    if (this.getValue() == value) {
                                        this.clearAll();
                                        this.setValue(value);
                                    }
                                }
                            });
                            modal.dataController.onDataDeleted.subscribe((sender, data) => {
                                let value = data[this.options.datasetController.options.dataPrimaryKeyName];
                                if (this.getValue() == value) {
                                    this.clearAll();
                                }
                            });
                        }
                    }));
                    if (dataPrimaryKey == null) {
                        openButton.disable();
                    }
                }
            }
            if (this.options.canEditData) {
                let deleteButton = args.dropDown.appendControl(new Button({
                    text: Resources.deleteIcon + ' ' + Resources.deleteEntry,
                    action: async () => {
                        let dataPrimaryKey = this.getValue();
                        if (dataPrimaryKey == null) {
                            return;
                        }
                        let previousState = this._dataController?.getDataState();
                        this.setValue(null, true);
                        if (previousState == Business.DataState.serialized) {
                            let result = await this._dataController.save();
                            if (result?.success) {
                                this.deleteData(dataPrimaryKey, true);
                            }
                        }
                        else if (this._dataController?.getDataState() == Business.DataState.edited) {
                            this._dataController.ensureUpToDate(() => {
                                this.deleteData(dataPrimaryKey, true);
                            });
                        }
                        else {
                            this.deleteData(dataPrimaryKey, true);
                        }
                    }
                }));
                if (dataPrimaryKey == null) {
                    deleteButton.disable();
                }
            }

            let deleteButton = args.dropDown.appendControl(new Button({
                text: Resources.clearIcon + ' ' + Resources.stopUseEntry,
                action: async () => {
                    this.setValue(null);
                }
            }));
            if (dataPrimaryKey == null) {
                deleteButton.disable();
            }



        }


        public async deleteData(dataPrimaryKey?: string, displayError?: boolean) {
            if (dataPrimaryKey == null) {
                dataPrimaryKey = this.getValue();
            }
            if (dataPrimaryKey == null) {
                return;
            }
            this.startSpin();
            let item = {};
            item[this.datasetController.options.dataPrimaryKeyName] = dataPrimaryKey;
            await this.datasetController.deleteItems([item], { displayErrors: displayError });
            this.stopSpin();
        }


        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo) {
            super.setPropertyInfo(propertyInfo);
            if (propertyInfo.isRequired != null && this.options.allowNullValue === undefined) {
                this.options.allowNullValue = !propertyInfo.isRequired;
            }
            if (this.options.dataName == null && this.options.datasetController == null && propertyInfo.foreignDataName != null) {
                this.options.dataName = propertyInfo.foreignDataName;
                this.datasetController = this.options.datasetController = NextAdmin.Business.DatasetController_.factory(propertyInfo.foreignDataName);
            }
            let dataInfo = this.options.datasetController.getDataInfo();
            if (this.options.displayPropertiesNames == null && this.options.datasetController != null) {
                if (dataInfo.displayPropertiesNames != null) {
                    this.options.displayPropertiesNames = dataInfo.displayPropertiesNames;
                }
            }
            if (this.options.searchPropertiesNames == null && this.options.datasetController != null) {
                if (dataInfo.displayPropertiesNames != null) {
                    this.options.searchPropertiesNames = dataInfo.displayPropertiesNames;
                }
            }
        }

        setValue(value: any, fireChange?: boolean) {
            if (!String.isNullOrEmpty(value)) {
                let items = this.getItems();
                let item = items.firstOrDefault(e => e['_value'] == value);
                if (item == null) {//we set value of non existing item, so we ask a preview value
                    let displayValue: string;
                    if (this.options.previewValueFunc != null) {
                        displayValue = this.options.previewValueFunc(value);
                    }
                    if (!String.isNullOrEmpty(displayValue))
                    {
                        this.addItem(value, displayValue);
                    }
                    else if (this.options.datasetController != null) {
                        let tempItem: HTMLTableRowElement;
                        if (!NextAdmin.String.isNullOrEmpty(value)) {
                            tempItem = this.addItem(value);
                        }

                        this.options.datasetController.take(1);
                        this.options.datasetController.search(null);
                        this.options.datasetController.select();
                        if (this.options.onStartLoadData) {
                            this.options.onStartLoadData(this);
                        }
                        this.options.datasetController.where(this.options.datasetController.options.dataPrimaryKeyName + ' = ?', value);
                        this.options.datasetController.load({
                            onGetResponse: (result) => {
                                if (result.success) {
                                    if (tempItem != null) {
                                        this.removeItem(tempItem);
                                    }
                                    let item = result.dataset.firstOrDefault();
                                    if (item != null) {
                                        let label = '';
                                        if (this.options.itemDisplayValueFunc) {
                                            label = this.options.itemDisplayValueFunc(item);
                                        }
                                        else {
                                            for (let displayProperty of this.options.displayPropertiesNames) {
                                                if (label != '') {
                                                    label += ' ';
                                                }
                                                label += item[displayProperty];
                                            }
                                        }
                                        this.addItem(value, label);
                                        super.setValue(value);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            super.setValue(value);
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: this.getValue(), origin: ChangeOrigin.code });
            }
        }

        async getItemValueData<TData>(itemValue?: any): Promise<TData> {
            if (itemValue == null) {
                itemValue = this.getValue();
            }
            if (itemValue == null) {
                return null;
            }
            return new Promise<TData>((resolve) => {
                let clonedDataController = this.options.datasetController.clone();
                clonedDataController.take(1);
                clonedDataController.search(null);
                clonedDataController.select();
                clonedDataController.where(this.options.datasetController.options.dataPrimaryKeyName + '=?', itemValue);
                clonedDataController.load({
                    onGetResponse: (result) => {
                        if (result.dataset != null && result.dataset.length == 1) {
                            resolve(result.dataset[0]);
                            return;
                        }
                        else {
                            resolve(null);
                            return;
                        }
                    }
                });
            });
        }

        getDisplayValue() {
            return this.input.value;
        }

        disable() {
            super.disable();
            this.dropDownMenuButton.disable();
        }

        enable() {
            super.enable();
            this.dropDown.enable();
        }


    }


    export interface DataSelectOptions extends InputSelectOptions {

        datasetController?: NextAdmin.Business.DatasetController_;

        dataName?: string;

        displayPropertiesNames?: string[];

        itemDisplayValueFunc?: (item: any) => string;

        searchPropertiesNames?: string[];

        previewValueFunc?: (value: string) => string;

        formModalFactory?: (dataName: string, modalOption?: NextAdmin.UI.DataFormModalOptions) => DataFormModal_;

        allowNullValue?: boolean;

        searchItemsCount?: number;

        orderBy?: Array<{ name: string, desc?: boolean }>;

        canAddData?: boolean;

        canEditData?: boolean;

        hasDropDownMenu?: boolean;

        onStartLoadData?: (sender: DataSelect) => void;

    }


}