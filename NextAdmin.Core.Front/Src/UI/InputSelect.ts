
/// <reference path="Input.ts"/>


namespace NextAdmin.UI {

    export class InputSelect extends Input {

        dropDown: HTMLDivElement;

        openDropDownButton: Button;

        dropDownTable: Table;

        onDropdownOpening = new EventHandler<InputSelect, DropDownOpeningArgs>();

        onDropdownOpen = new EventHandler<InputSelect, HTMLElement>();

        onDropdownClose = new EventHandler<InputSelect, HTMLElement>();

        options: InputSelectOptions;

        timer = new NextAdmin.Timer();

        protected _selectedItem: HTMLTableRowElement;

        protected _customValueItem: HTMLTableRowElement;

        public static style = `
        .form-input-select-dropdown {
            border-radius: 4px; 
            background-color:#fff;
            width:100%;
            border:1px solid #ccc;
            box-shadow:0px 1px 2px rgba(0,0,0,0.4) 
        } 
        .form-input-select-dropdown td {
            padding:5px;
            font-size:14px;
        }
        `;

        public static onCreated = new EventHandler<InputSelect, InputSelectOptions>();

        constructor(options?: InputSelectOptions) {
            super({
                autoFill: true,
                usePerfectScrollbar: false,
                localOrdering: true,
                inputSearchDelay: 50,
                canSearchData: true,
                maxDropDownHeight: '250px', ...options
            } as InputSelectOptions);
            Style.append("InputSelect", InputSelect.style);

            //used to kill chrome autcompletion dropdown
            this.input.setAttribute('autocomplete', 'one-time-code');
            this.input.setAttribute('readonly', 'true');
            this.input.addEventListener('focus', () => setTimeout(() => this.input.removeAttribute('readonly'), 100));
            this.input.addEventListener('focusout', () => this.input.setAttribute('readonly', 'true'));
            this.input.addEventListener('pointerdown', (ev) => {
                ev.stopImmediatePropagation();
                ev.stopPropagation();
            });


            this.controlContainer.style.position = 'relative';
            this.dropDown = document.createElement('div');
            this.dropDown.classList.add('form-input-select-dropdown');
            this.dropDown.style.position = 'fixed';
            this.dropDown.style.zIndex = '9999999';
            this.dropDown.style.maxHeight = this.options.maxDropDownHeight;
            this.dropDown.style.overflow = 'auto';
            if (this.options.usePerfectScrollbar && UserAgent.isDesktop()) {
                this.dropDown.appendPerfectScrollbar();
            }
            this.dropDownTable = new Table({ rowSelectionMode: RowSelectionMode.singleSelect, rowHoverable: true });

            this.dropDownTable.element.style.width = '100%';
            this.dropDownTable.element.style.margin = '0px';

            this.dropDown.appendControl(this.dropDownTable);
            if (this.options.canAddCustomValue) {
                this._customValueItem = this.dropDownTable.addBodyRow('');
            }

            this.dropDownTable.onRowSelected.subscribe((sender, row) => {
                this.selectItem(row['_value']);
            });

            this.input.addEventListener('click', () => {
                this.toggleDropDown();
            });
            this.input.addEventListener('keydown', (event) => {
                this.onInputKeyDown(event);
            });

            this.input.addEventListener('input', (event) => {
                this.onInputValueChanging(super.getValue());
            });

            let suspendBlur = false;
            this.input.addEventListener('blur', (event) => {
                if (suspendBlur) {
                    return;
                }
                this.input.focus();
                this.input.setSelectionRange(0, 0);
                suspendBlur = true;
                this.input.blur();
                suspendBlur = false;
            });
            //this.input.setSelectionRange(0, 0);

            this.openDropDownButton = this.addRightAddon(new Button({
                style: ButtonStyle.bgWhite,
                text: '▼',
                action: () => {
                    this.toggleDropDown();
                }
            }));

            if (!this.options.displayDropdownButton) {
                this.openDropDownButton.element.style.display = 'none';
            }

            this._onClickOutside = (event) => {//test close on click for device which not fire mousedown events...
                if (this.dropDown.parentElement == null)
                    return;
                let elementToTest = event.target as Node;
                let isOutside = true;
                do {
                    if (elementToTest == this.dropDown || elementToTest == this.controlContainer || elementToTest == this.openDropDownButton.element || elementToTest == this.element) {
                        isOutside = false;
                        break;
                    }
                    elementToTest = elementToTest.parentNode;
                } while (elementToTest);
                if (isOutside) {//click outside
                    this.cancelSelect();
                }
            };

            if (this.options.items != null) {
                this.addSelectItems(this.options.items);
            }

            InputSelect.onCreated.dispatch(this, this.options);
        }

        private _onClickOutside;


        public toggleDropDown() {
            if (this.dropDown.parentElement == null) {
                this.openDropDown();
            }
            else {
                this.closeDropDown()
            }
        }


        public getItemValue(rowElement: HTMLTableRowElement) {
            return rowElement['_value'];
        }

        getItem(value: any): HTMLTableRowElement {
            return this.getItems().firstOrDefault(a => a['_value'] == value);
        }


        protected onInputKeyDown(event: KeyboardEvent) {
            if (this.dropDown.parentElement == null) {
                this.openDropDown();
            }
            if (event.keyCode == 13) {//enter
                let selectedRow = this.dropDownTable.getSelectedRows().firstOrDefault();
                if (selectedRow != null) {
                    this.updateValue(selectedRow['_value']);
                }
                else {
                    this.updateValue(null);
                }
                this.closeDropDown();
            }
            else if (event.keyCode == 27)//escape
            {
                this.cancelSelect();
            }

            let newSelectedRow: HTMLTableRowElement;

            if (event.keyCode == 38) {//arrow up
                let rows = this.dropDownTable.getBodyRows().where(e => e.style.display != 'none');
                let selectedRow = this.dropDownTable.getSelectedRows().firstOrDefault();
                if (selectedRow != null) {
                    let indexNextRow = rows.indexOf(selectedRow) - 1;
                    if (indexNextRow >= 0) {
                        newSelectedRow = rows[indexNextRow];
                        this.dropDownTable.selectRow(newSelectedRow, false);
                    }
                }
                else if (rows.length > 0) {
                    newSelectedRow = rows[0];
                    this.dropDownTable.selectRow(newSelectedRow, false);
                }
            }
            else if (event.keyCode == 40) {//arrow down
                let rows = this.dropDownTable.getBodyRows().where(e => e.style.display != 'none');
                let selectedRow = this.dropDownTable.getSelectedRows().firstOrDefault();
                if (selectedRow != null) {
                    let indexNextRow = rows.indexOf(selectedRow) + 1;
                    if (indexNextRow < rows.length) {
                        newSelectedRow = rows[indexNextRow];
                        this.dropDownTable.selectRow(newSelectedRow, false);
                    }
                }
                else if (rows.length > 0) {
                    newSelectedRow = rows[0];
                    this.dropDownTable.selectRow(newSelectedRow, false);
                }
            }
            if (newSelectedRow) {
                this.dropDown.scrollTo({ top: newSelectedRow.offsetTop })
            }
        }



        public selectItem(value: any) {
            this.closeDropDown();
            this.updateValue(value);
            this.input.setSelectionRange(0, 0);
        }


        public cancelSelect() {
            this.updateValue(this.getValue());
            this.closeDropDown();
            if (this.options.canSearchData) {
                this.input.setSelectionRange(0, 0);
            }
        }



        public onInputValueChanging(val: string) {
            if (this.options.canAddCustomValue && this._customValueItem != null) {
                this._customValueItem.getCells()[0].innerHTML = val;
                this._customValueItem['_value'] = val;
                this.dropDownTable.selectRow(this._customValueItem, false);
                this._customValueItem.style.display = '';
            }
            if (this.options.canSearchData) {
                if (this.options.searchAction != null) {
                    if (this.options.inputSearchDelay) {
                        this.timer.throttle(() => {
                            this.distantSearch(super.getValue());
                        }, this.options.inputSearchDelay);
                    }
                    else {
                        this.distantSearch(super.getValue());
                    }
                }
                else {
                    this.localSearch(super.getValue());
                }
            }
        }


        public load(endSearchAction?: (searchResult: Array<SelectItem>) => void) {
            let pv = this.dropDown.style.display;
            this.dropDown.style.display = '';
            this.distantSearch('', endSearchAction);
            this.dropDown.style.display = pv;
        }



        public distantSearch(searchValue: string, endSearchAction?: (searchResult: Array<SelectItem>) => void) {
            if (this.dropDown.parentElement == null) {
                //return; removed to the impossibility to pre load data before drop down open
            }
            this.startSpin();

            let inputValue = (super.getValue() + '').trim();

            this.options.searchAction(searchValue, (searchResultItems) => {
                this.stopSpin();
                this.clearItems();
                let hasRowSelected = false;

                if (searchResultItems != null) {
                    if (this.options.localOrdering) {
                        searchResultItems = searchResultItems.orderBy(a => a.label);
                    }
                    for (let valueItem of searchResultItems) {
                        if (valueItem == null)
                            continue;
                        let itemAdded = this.addItem(valueItem.value, valueItem.label);

                        if ((this._customValueItem == null || this._customValueItem.style.display == 'none') && !hasRowSelected) {
                            this.dropDownTable.selectRow(itemAdded, false);
                            hasRowSelected = true;
                        }
                        if (valueItem?.label?.trim() == inputValue) {//if user type exacty a value
                            if (this._customValueItem != null) {
                                this._customValueItem.style.display = 'none';
                            }
                            this.dropDownTable.selectRow(itemAdded, false);
                        }
                    }
                }
                if (endSearchAction != null) {
                    endSearchAction(searchResultItems);
                }
            });
        }


        public localSearch(searchValue: string) {
            let hasRowSelected = false;
            for (let item of this.dropDownTable.getBodyRows()) {
                if (item == this._customValueItem)
                    continue;
                if (item['_search'].toLowerCase().indexOf(searchValue.toLowerCase().removeDiacritics()) != -1) {
                    item.style.display = '';
                    if ((this._customValueItem == null || this._customValueItem.style.display == 'none') && !hasRowSelected) {
                        this.dropDownTable.selectRow(item, false);
                        hasRowSelected = true;
                    }
                    if (item.cells[0].innerText == searchValue) {//if user type exacty a value
                        if (this._customValueItem != null) {
                            this._customValueItem.style.display = 'none';
                            this.dropDownTable.selectRow(item, false);
                            hasRowSelected = true;
                        }
                    }
                }
                else {
                    item.style.display = 'none';
                }
            }
        }


        openDropDown() {
            if (this.options.canSearchData) {
                this.input.select();
            }
            let dropDownOpeningArgs = {
                dropDown: this.dropDown,
            } as DropDownOpeningArgs;
            this.onDropdownOpening.dispatch(this, dropDownOpeningArgs);
            if (dropDownOpeningArgs.cancel)
                return;
            document.body.appendChild(this.dropDown);

            let inputBoundings = this.input.getBoundingClientRect();
            this.dropDown.style.top = (inputBoundings.top + inputBoundings.height) + 'px';
            this.dropDown.style.left = inputBoundings.left + 'px';
            this.dropDown.style.width = inputBoundings.width + 'px';
            if (this.options.searchAction != null) {
                this.clearItems();
                this.distantSearch(this.options.resetSearchAtOpen ? '' : super.getValue());
            }
            else {
                for (let item of this.dropDownTable.getBodyRows()) {
                    item.style.display = '';
                }
            }
            if (this._customValueItem != null) {
                this._customValueItem.style.display = 'none';
            }
            this.element.focus();
            this.input.removeAttribute('readonly');
            this.onDropdownOpen.dispatch(this, this.dropDown);
            if (this.options.onDropdownOpen != null) {
                this.options.onDropdownOpen(this, this.dropDown);
            }
            document.addEventListener('pointerdown', this._onClickOutside);
            document.addEventListener('click', this._onClickOutside);
            document.addEventListener('touchstart', this._onClickOutside);
        }


        closeDropDown() {
            this.input.setAttribute('readonly', 'true');//used to kill chrome autcompletion dropdown
            this.dropDown.remove();
            this.onDropdownClose.dispatch(this, this.dropDown);
            document.removeEventListener('pointerdown', this._onClickOutside);
            document.removeEventListener('click', this._onClickOutside);
            document.removeEventListener('touchstart', this._onClickOutside);
        }

        getItems(): Array<HTMLTableRowElement> {
            let items = this.dropDownTable.getBodyRows();
            if (this.options.canAddCustomValue && this._customValueItem != null) {
                items = items.where(e => e != this._customValueItem);
            }
            return items;
        }

        getFilteredItems(): Array<HTMLTableRowElement> {
            return this.getItems().where(e => e.style.display != 'none');
        }

        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo) {
            super.setPropertyInfo(propertyInfo);
            if (this.options.autoFill && propertyInfo.values != null) {
                for (let memberValue of propertyInfo.values) {
                    this.addItem(memberValue.value, memberValue.label);
                }
            }
        }

        addSelectItems(items: SelectItem[]) {
            console.log('add items');
            for (let item of items) {
                this.addSelectItem(item);
            }
        }

        addSelectItem(item: SelectItem) {
            this.addItem(item.value, item.label, item.selected);
        }

        removeItem(rowElement: HTMLTableRowElement) {
            if (rowElement['_value'] == this.getValue()) {
                this.setValue(null);
            }
            rowElement.remove();
        }


        getItemsValues(): Array<string> {
            return this.getItems().select(e => e['_value']);
        }


        addItem(value: string | number, label = null, selected?: boolean): HTMLTableRowElement {
            if (value == null) {
                return;
            }
            if (label == null) {
                label = value.toString();
            }
            let row = this.dropDownTable.addBodyRow(label);
            row['_value'] = value;
            row['_search'] = label.removeDiacritics();
            if (String.isNullOrEmpty(label)) {
                row.cells[0].appendHTML('div', (d) => {
                    d.style.minHeight = '15px';
                });
            }

            if (this.options.canAddCustomValue && this._customValueItem != null && this._customValueItem['_value'] == value) {
                this._selectedItem = row;
                this.dropDownTable.selectRow(row, false);
                this._customValueItem.getCells()[0].innerHTML = label;
                if (this._customValueItem != null) {
                    this._customValueItem.style.display = 'none';
                }
            }
            else if (selected) {
                this._selectedItem = row;
                this.dropDownTable.selectRow(row, false);
                if (this._customValueItem != null) {
                    this._customValueItem.style.display = 'none';
                }
            }
            return row;
        }

        addItems<T>(dataset: Array<T>, captionFunc: (data: T) => string, valueFunc: (data: T) => string = null): Array<HTMLTableRowElement> {
            let items = new Array<HTMLTableRowElement>();
            for (let data of dataset) {
                let item = this.addItem(captionFunc(data), valueFunc == null ? undefined : valueFunc(data));
                items.push(item);
            }
            return items;
        }

        setItems<T>(dataset: Array<T>, captionFunc: (data: T) => string, valueFunc: (data: T) => string = null): Array<HTMLTableRowElement> {
            this.clearItems();
            return this.addItems(dataset, captionFunc, valueFunc);
        }

        clearAll() {
            this.clearItems();
            this.setValue(null);
        }

        clearItems() {
            this.dropDownTable.clear();
            if (this.options.canAddCustomValue && this._customValueItem) {
                this.dropDownTable.tBody.appendChild(this._customValueItem);
            }
        }


        protected updateValue(value: any) {
            let previousValue = this.getValue();
            this.setValue(value);
            this.onValueChanged.dispatch(this, { previousValue: previousValue, value: this.getValue() });
        }


        setValue(value: any, fireChange?: boolean) {
            let items = this.getItems();
            let item: HTMLTableRowElement;
            if (items != null) {
                item = items.firstOrDefault(e => e['_value'] == value);
            }
            if (item != null) {
                super.setValue(item.innerText);
                this.dropDownTable.selectRow(item, false);
                this._selectedItem = item;
                if (this._customValueItem != null) {
                    this._customValueItem.style.display = 'none';
                }
            }
            else if (this.options.canAddCustomValue && this._customValueItem != null) {
                this._customValueItem.getCells()[0].innerHTML = value;
                this._customValueItem['_value'] = value;
                this._customValueItem.style.display = '';
                this._selectedItem = this._customValueItem;
                super.setValue(value);
                this.dropDownTable.selectRow(this._customValueItem, false);
            }
            else {
                this._selectedItem = null;
                super.setValue('');
            }
            value = this.getValue();
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: value, origin: ChangeOrigin.code });
            }
        }

        getValue(): any {
            let value = null;
            if (this.options.canAddCustomValue && this.dropDownTable.getSelectedRows().firstOrDefault() == this._customValueItem) {
                value = super.getValue();
            }
            else {
                value = this._selectedItem ? this._selectedItem['_value'] : null;
            }
            if (value != null && NextAdmin.String.isString(value) && value == '') {
                return null;
            }
            return value;
        }

        Enable() {
            super.enable();
            this.openDropDownButton.enable();
        }
        Disable() {
            super.disable();
            this.openDropDownButton.disable();
        }


        startSpin() {
            this.openDropDownButton.startSpin();
        }


        stopSpin() {
            this.openDropDownButton.stopSpin();
        }
    }




    export interface InputSelectOptions extends InputOptions, SelectOptions {

        canAddCustomValue?: boolean;

        canSearchData?: boolean;

        searchAction?: (searchValue: string, searchResultAction: (searchResult: Array<SelectItem>) => void) => void;

        maxDropDownHeight?: string;

        displayDropdownButton?: boolean;

        autoFill?: boolean;

        resetSearchAtOpen?: boolean;

        usePerfectScrollbar?: boolean;

        localOrdering?: boolean;

        inputSearchDelay?: number;//used to reduce number of server call

        size?: InputSize;

        onDropdownOpen?: (sender: InputSelect, args: HTMLElement) => void;

    }

    export interface DropDownOpeningArgs {

        dropDown: HTMLElement;

        cancel?: boolean;


    }

}