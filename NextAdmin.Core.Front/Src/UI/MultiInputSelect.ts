
/// <reference path="InputSelect.ts"/>

namespace NextAdmin.UI {

    export class MultiInputSelect extends InputSelect {

        options: MultiInputSelectOptions;

        constructor(options?: MultiInputSelectOptions) {
            super({
                resetSearchAtOpen: true,
                canAddCustomValue: false,
                lightButtons: true,
                valueCharSeparator: ',',
                displayCharSeparator: ',',
                hideDropdownButton: true,
                canSearchData: false,
                ...options
            } as MultiInputSelectOptions);
            this.dropDownTable.options.rowSelectionMode = RowSelectionMode.multiSelect;

            this.dropDownTable.onRowUnselected.subscribe((sender, row) => {
                this.unselectItem(row['_value']);
            });

            if (this.options.canAddCustomValue) {
                this.addLeftAddon(new NextAdmin.UI.Button({
                    text: Resources.addIcon, style: NextAdmin.UI.ButtonStyle.noBg, action: () => {

                        let addValueModal = new NextAdmin.UI.Modal({
                            title: Resources.addNewItems,
                            size: ModalSize.smallFitContent
                        });

                        addValueModal.body.appendHTML('div', (container) => {
                            container.style.padding = '5px';
                            let valuesInput = container.appendControl(new NextAdmin.UI.Input());
                            valuesInput.element.style.marginBottom = '10px';
                            container.appendHTML('p', Resources.addNewItemsText + '"' + this.options.displayCharSeparator + '"');

                            let validateAction = () => {
                                let newItems = (valuesInput.getValue() + '').split(this.options.displayCharSeparator).where(e => !NextAdmin.String.isNullOrEmpty(e));
                                this.selectItems(newItems, true);
                                addValueModal.close();
                            };
                            valuesInput.input.addEventListener('keydown', (e) => {
                                if (e.keyCode == 13) {
                                    validateAction();
                                }
                            });
                            addValueModal.rightFooter.appendControl(new NextAdmin.UI.Button({
                                text: Resources.addIcon + ' ' + Resources.add, style: NextAdmin.UI.ButtonStyle.blue, action: () => {
                                    validateAction();
                                }
                            }), (btnAdd) => {
                                btnAdd.element.style.cssFloat = 'right';
                            });
                        });
                        addValueModal.open();


                    }
                }));
            }
            if (this.options.canSearchData && this.options.searchAction) {
                this.controlContainer.disable();
                this.addLeftAddon(new NextAdmin.UI.Button({
                    text: Resources.searchIcon, style: NextAdmin.UI.ButtonStyle.noBg, action: () => {

                        let searchModal = new NextAdmin.UI.Modal({ size: NextAdmin.UI.ModalSize.smallFitContent, title: Resources.search, canChangeScreenMode: false });
                        searchModal.body.appendHTML('div', (container) => {
                            container.style.height = '400px';
                            container.style.padding = '10px';

                            let grid = container.appendControl(new NextAdmin.UI.DataGrid({
                                rowHoverable: true,
                                stretchHeight: true,
                                displayNoDataMessage: false,
                                minHeight: '300px',
                                canAdd: false,
                                deleteMode: NextAdmin.UI.DataDeleteMode.disabled,
                                hasActionColumn: false,
                                rowSelectionMode: NextAdmin.UI.RowSelectionMode.multiSelect_CtrlShift,
                                columns: [
                                    { propertyName: 'label' }
                                ]
                            }), (grid) => {
                                grid.onDoubleClickRow.subscribe((row, ev) => {
                                    validateButton.executeAction();
                                });
                                grid.tHead.style.display = 'none';
                                grid.toolBar.element.style.display = 'none';
                                grid.topBar.style.border = '0px';
                                let searchBox = grid.topBar.appendControl(new NextAdmin.UI.Input({
                                    onValueChanged: (sender, args) => {
                                        this.timer.throttle(() => {
                                            this.options.searchAction(args.value, (items) => {
                                                grid.setDataset(items);
                                            });
                                        }, this.options.throttle);
                                    }
                                }));
                                searchBox.element.style.marginBottom = '10px';
                            });
                            this.options.searchAction('', (items) => {
                                grid.setDataset(items);
                            });

                            let validateButton = searchModal.rightFooter.appendControl(new NextAdmin.UI.Button({
                                css: { cssFloat: 'right' },
                                text: Resources.validate, action: () => {

                                    let selectedItems = grid.getSelectedRows().select(a => a.data) as Array<SelectItem>;
                                    this.clearAll();
                                    this.addSelectItems(selectedItems)
                                    this.setValue(selectedItems.select(a => a.value));
                                    searchModal.close();
                                }
                            }));
                        });
                        searchModal.open();
                    }
                }));

                this.addLeftAddon(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.closeIcon,
                    style: NextAdmin.UI.ButtonStyle.noBg,
                    //disabled: true,
                    action: () => {
                        this.clearAll();
                    }
                }));
            }


        }

        onInputKeyDown(event: KeyboardEvent) {
            if (this.dropDown.style.display == 'none') {
                this.openDropDown();
            }
            if (event.keyCode == 13) {//enter
                this.closeDropDown();
            }
            else if (event.keyCode == 27)//escape
            {
                this.cancelSelect();
            }
            event.preventDefault();
        }


        public selectItem(value: string, addIfNotExist = false) {
            if (value != null) {
                if (addIfNotExist) {
                    if (!this.getItemsValues().contains(value)) {
                        this.addItem(value);
                    }
                }
                if (!this._selectedItemValues.contains(value)) {
                    let clonedvalues = this._selectedItemValues.clone();
                    clonedvalues.add(value);
                    this.updateValue(clonedvalues);
                }
            }
        }

        public selectItems(values: string[], addIfNotExist = false) {
            if (addIfNotExist) {
                let itemsValues = this.getItemsValues();
                for (let value of values) {
                    if (!itemsValues.contains(value)) {
                        this.addItem(value);
                    }
                }
            }
            let clonedvalues = this._selectedItemValues.clone();
            for (let value of values) {
                if (!this._selectedItemValues.contains(value)) {
                    clonedvalues.add(value);
                }
            }
            this.updateValue(clonedvalues);
        }

        public unselectItem(value: string) {
            if (value != null) {
                value = value + '';
                if (this._selectedItemValues.contains(value)) {
                    let clonedvalues = this._selectedItemValues.clone();
                    clonedvalues.remove(value);
                    this.updateValue(clonedvalues);
                }
            }
        }

        protected updateValue(value: any[]) {
            let previousValue = this.getValue();
            this.setValue(value);
            this.onValueChanged.dispatch(this, { previousValue: previousValue, value: value });
        }

        public cancelSelect() {
            this.closeDropDown();
        }

        openDropDown() {
            super.openDropDown();
            let selectItems = this.getItems().where(e => this._selectedItemValues.contains(e['_value'] + ''));
            this.dropDownTable.getSelectedRows().forEach(e => this.dropDownTable.unselectRow(e));
            selectItems.forEach(e => this.dropDownTable.selectRow(e));
        }


        private _selectedItemValues = [];
        setValue(value: any) {
            if (Array.isArray(value)) {
                this._selectedItemValues = value.select(e => e + '');
            }
            else {
                this._selectedItemValues = value != null ? (<string>value).split(this.options.valueCharSeparator) : [];
            }
            this._selectedItemValues = this._selectedItemValues.distinct();

            let selectItems = this.getItems().where(e => this._selectedItemValues.contains(e['_value'] + ''));
            let displayValue = selectItems.select(e => e.innerText).join(this.options.displayCharSeparator + ' ');
            this.input.value = displayValue;
        }


        getValue(): any {
            let items = this._selectedItemValues;
            if (!items?.length && this.options.outputAllItemValuesIfNoSelect) {
                items = this.getItems().select(a => a['_value']);
            }
            if (this.options.outputArray) {
                return [...items];
            }
            else {
                return items.where(a => !NextAdmin.String.isNullOrWhiteSpace(a + '')).join(this.options.valueCharSeparator);
            }
        }

        getSelectItemValues() {
            return [...this._selectedItemValues];
        }




    }


    export interface MultiInputSelectOptions extends InputSelectOptions {

        valueCharSeparator?: string;

        displayCharSeparator?: string;

        outputArray?: boolean;

        outputAllItemValuesIfNoSelect?: boolean;

    }


}