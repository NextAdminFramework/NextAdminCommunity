
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
                    text: '+', style: NextAdmin.UI.ButtonStyle.noBg, action: () => {

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
                if (!this._selectedItems.contains(value)) {
                    let clonedvalues = this._selectedItems.clone();
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
            let clonedvalues = this._selectedItems.clone();
            for (let value of values) {
                if (!this._selectedItems.contains(value)) {
                    clonedvalues.add(value);
                }
            }
            this.updateValue(clonedvalues);
        }

        public unselectItem(value: string) {
            if (value != null) {
                value = value + '';
                if (this._selectedItems.contains(value)) {
                    let clonedvalues = this._selectedItems.clone();
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
            let selectItems = this.getItems().where(e => this._selectedItems.contains(e['_value'] + ''));
            this.dropDownTable.getSelectedRows().forEach(e => this.dropDownTable.unselectRow(e));
            selectItems.forEach(e => this.dropDownTable.selectRow(e));
        }


        private _selectedItems = [];
        setValue(value: any) {
            if (Array.isArray(value)) {
                this._selectedItems = value.select(e => e + '');
            }
            else {
                this._selectedItems = value != null ? (<string>value).split(this.options.valueCharSeparator) : [];
            }
            this._selectedItems = this._selectedItems.distinct();

            let selectItems = this.getItems().where(e => this._selectedItems.contains(e['_value'] + ''));
            let displayValue = selectItems.select(e => e.innerText).join(this.options.displayCharSeparator + ' ');
            this.input.value = displayValue;
        }


        getValue(): any {
            let items = this._selectedItems;
            if (!items?.length && this.options.outputAllItemValuesIfNoSelect) {
                items = this.getItems().select(a => a['_value']);
                console.log(items);
            }
            if (this.options.outputArray) {
                return items;
            }
            else {
                return items.where(a => !NextAdmin.String.isNullOrWhiteSpace(a + '')).join(this.options.valueCharSeparator);
            }
        }

        getSelectItems() {
            return this._selectedItems;
        }




    }


    export interface MultiInputSelectOptions extends InputSelectOptions {

        valueCharSeparator?: string;

        displayCharSeparator?: string;

        outputArray?: boolean;

        outputAllItemValuesIfNoSelect?: boolean;

    }


}