/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class FormLayout<T> extends NextAdmin.UI.Control {

        public static defaultViewName = 'DEFAULT';

        options: FormLayoutOptions;

        table: HTMLTableElement;

        firstRow: HTMLTableRowElement;

        rows = new Array<HTMLTableRowElement>();

        onDrowCell = new EventHandler<FormLayout_, { cell: HTMLTableCellElement, options: FormLayoutItem, control: Control }>();

        dataController?: NextAdmin.Business.DataController<T>;

        public controlsDictionary = new Dictionary<Control | HTMLElement>();

        protected _columnCount = 0;

        protected _rowCount = 0;

        protected _itemsDictionary = new Dictionary<FormLayoutItem>();

        protected _cellsDictionary = new Dictionary<HTMLTableCellElement>();

        protected _viewsDictionary = new Dictionary<FormLayoutView>();

        protected _activeViewName?: string;

        public static style = `

        .next-admin-form-layout{

            .next-admin-form-layout-cell{
                padding:5px;
            }
        }
        .next-admin-form-layout.thin-label{
            .next-admin-layout-form-control-label-container{
                padding-left:4px;font-size:12px
            }
        }


        `;


        constructor(options?: FormLayoutOptions) {
            super('div', { rowCount: 0, columnCount: 0, ...options } as FormLayoutOptions);
            this.dataController = this.options.dataController;
            Style.append('NextAdmin.UI.FormLayout', FormLayout_.style);
            this.element.classList.add('next-admin-form-layout');
            this.element.style.width = '100%';
            this.table = this.element.appendHTML('table', (table) => {
                table.style.width = '100%';
            });
            this.setStyle(this.options.style);
            this.addView(FormLayout.defaultViewName, [], true);
            this.initialize(this.options.columnCount, this.options.rowCount, this.options.items);
        }

        public setStyle(style?: FormLayoutStyle) {
            switch (style) {
                case FormLayoutStyle.thinLabels:
                    this.element.classList.add('thin-label');
                    break;
                default:
                    break;
            }
        }


        public initialize(colCount: number, rowCount: number, items?: Array<FormLayoutItem>) {
            this._columnCount = colCount;
            this._rowCount = rowCount;
            this._cellsDictionary = new Dictionary<HTMLTableCellElement>();
            this._itemsDictionary = new Dictionary<FormLayoutItem>();
            this.rows = [];

            this.table.innerHTML = '';

            this.firstRow = this.table.appendHTML('tr', (row) => {
                for (let iCol = 0; iCol < this._columnCount; iCol++) {
                    row.appendHTML('td', (td) => {
                        td.style.width = (100 / colCount) + '%';
                    });
                }
            });

            for (let iRow = 0; iRow < this._rowCount; iRow++) {
                this.table.appendHTML('tr', (row) => {
                    this.rows.add(row);
                    for (let iCol = 0; iCol < this._columnCount; iCol++) {
                        row.appendHTML('td', (td) => {
                            this._cellsDictionary.add((iCol + 1) + ',' + (iRow + 1), td);
                        });
                    }
                });
            }
            if (items != null) {
                for (let item of items) {
                    this.addItem(item as FormLayoutControlItem<any>);
                }
            }
        }

        getView(viewName: string) {
            return this._viewsDictionary.get(viewName);
        }

        addView(viewName: string, items?: Array<FormLayoutViewItem>, active?: boolean): FormLayoutView {
            let view = {
                name: viewName,
                items: items ?? []
            } as FormLayoutView;
            this._viewsDictionary.add(viewName, view);
            if (active) {
                this.setActiveView(viewName);
            }
            return view;
        }

        addViewItems(viewName: string, items?: Array<FormLayoutViewItem>): FormLayoutView {
            let view = this.getView(viewName);
            if (view == null) {
                return this.addView(viewName, items);
            }
            if (items) {
                for (let item of items) {
                    let existingItem = view.items.firstOrDefault(a => a.id == item.id);
                    if (existingItem) {
                        view.items.replace(existingItem, item);
                    }
                    else {
                        view.items.add(item);
                    }
                }
            }
            return view;
        }

        addViewItem(viewName: string, item: FormLayoutViewItem): FormLayoutView {
            let view = this.getView(viewName);
            if (view == null) {
                return this.addView(viewName, [item]);
            }
            let existingItem = view.items.firstOrDefault(a => a.id == item.id);
            if (existingItem) {
                view.items.replace(existingItem, item);
            }
            else {
                view.items.add(item);
            }
            return view;
        }

        setActiveView(viewName: string) {
            if (String.isNullOrEmpty(viewName)) {
                viewName = FormLayout.defaultViewName;
            }
            if (this._activeViewName == viewName)
                return;

            let view = this._viewsDictionary.get(viewName);
            if (view == null) {
                throw Error('Unable to find view:' + viewName);
            }
            this._activeViewName = viewName;

            let items = new Array<FormLayoutItem>();
            for (let viewItem of view.items) {
                let control = this.controlsDictionary.get(viewItem.id);
                if (control == null) {
                    console.log('View: ' + viewName + ', unable to find control : ' + viewItem.id);
                    continue;
                }
                items.add({
                    control: control,
                    labelWidth: control instanceof LabelFormControl ? control.options.labelWidth : null,
                    ...viewItem
                });
            }
            let minColCount = items.max(e => e.col);
            let minRowCount = items.max(e => e.row);
            this.initialize(minColCount, minRowCount, items);
        }

        getActiveView(): FormLayoutView {
            return this._activeViewName ? this._viewsDictionary.get(this._activeViewName) : null;
        }


        enableResponsiveMode(getActivViewFunc: (formLayout: FormLayout_) => string) {
            this.element.appendControl(new ResisingContainer(), (resizingContainer) => {
                resizingContainer.element.style.width = '100%';
                resizingContainer.element.style.height = '0px';
                resizingContainer.element.style.visibility = 'hidden';
                resizingContainer.onSizeChanged.subscribe(() => {
                    this.setActiveView(getActivViewFunc(this))
                });
                this.setActiveView(getActivViewFunc(this));
            });
        }


        setColumnCount(columnCount: number) {
            if (columnCount > this._columnCount) {
                for (let iCol = this._columnCount; iCol < columnCount; iCol++) {
                    this.firstRow.appendHTML('td');
                    let iRow = 0;
                    for (let row of this.rows) {
                        row.appendHTML('td', (td) => {
                            this._cellsDictionary.add((iCol + 1) + ',' + (iRow + 1), td);
                        });
                        iRow++;
                    }
                }
                for (let cell of this.firstRow.cells) {
                    cell.style.width = (100 / columnCount) + '%';
                }

                this._columnCount = columnCount;
            }
            else if (columnCount < this._columnCount) {
                this.initialize(columnCount, this._rowCount, this._itemsDictionary.getValues())
            }

        }

        setRowCount(rowCount: number) {
            if (rowCount > this._rowCount) {
                for (let iRow = this._rowCount; iRow < rowCount; iRow++) {
                    this.table.appendHTML('tr', (row) => {
                        this.rows.add(row);
                        for (let iCol = 0; iCol < this._columnCount; iCol++) {
                            row.appendHTML('td', (td) => {
                                this._cellsDictionary.add((iCol + 1) + ',' + (iRow + 1), td);
                            });
                        }
                    });
                }
                this._rowCount = rowCount;
            }
        }

        setColumnWidth(columnIndex: number, width: string) {
            (this.firstRow.cells[columnIndex]).style.width = width;
        }

        public addItem<TElement extends Control | HTMLElement>(item: FormLayoutControlItem<TElement>): TElement {
            if (item.id == null) {
                if (item.html) {
                    item.id = item.html;
                }
            }
            if (item.colSpan == null) {
                item.colSpan = 1;
            }
            if (item.rowSpan == null) {
                item.rowSpan = 1;
            }
            if (item.id == null) {
                item.id = NextAdmin.Guid.newGuid().toString();
            }

            if (item.col + item.colSpan - 1 > this._columnCount) {
                this.setColumnCount(item.col + item.colSpan - 1);
            }
            if (item.row + item.rowSpan - 1 > this._rowCount) {
                this.setRowCount(item.row + item.rowSpan - 1);
            }

            let activeView = this.getActiveView();
            if (activeView.items.firstOrDefault(a => a.id == item.id) == null) {
                activeView.items.add({
                    id: item.id,
                    col: item.col,
                    row: item.row,
                    colSpan: item.colSpan,
                    rowSpan: item.rowSpan
                });
            }

            let cell = this._cellsDictionary.get(item.col + ',' + item.row);
            cell.innerHTML = '';
            let control: any;
            if (item.control != null) {
                control = item.control;
            }
            else if (item.controlType != null) {
                if (item.controlOption != null) {
                    eval("control=new " + item.controlType + "(item.controlOption)");
                }
                else {
                    eval("control=new " + item.controlType + "()");
                }
            }
            else if (item.useDefaultControl && !String.isNullOrEmpty(item.propertyName) && this.options.dataController != null) {
                let propertyInfo = this.options.dataController.getDataPropertyInfo_(this.options.dataController.options.dataName, item.propertyName);
                control = Helper.getDefaultPropertyFormControl(propertyInfo);
            }
            else if (item.html) {
                control = document.createElement('div');
                control.innerHTML = item.html;
            }
            if (this.options.dataController != null && item.propertyName != null && control instanceof FormControl && control.getBindedPropertyName() == null) {
                this.options.dataController.bindControl(control, item.propertyName);
                control['_bindedPropertyName'] = item.propertyName;
            }
            if (item.labelWidth && control instanceof LabelFormControl) {
                control.setLabelWidth(item.labelWidth);
            }
            if (!(control instanceof FormLayout)) {
                cell.classList.add('next-admin-form-layout-cell');
            }

            if (control) {
                if (control instanceof Control) {
                    cell.appendControl(control);
                }
                else {
                    cell.appendChild(control);
                }
                this.controlsDictionary.set(item.id, control);
            }

            let restaurCellToDefault = (c) => {
                c.colSpan = 1;
                c.rowSpan = 1;
                if (c['_adjcentCells'] != null) {
                    for (let adjacentCell of c['_adjcentCells'] as Array<HTMLTableCellElement>) {
                        adjacentCell.style.display = '';
                    }
                    c['_adjcentCells'] = [];
                }
            };
            restaurCellToDefault(cell);
            if (cell['_parentCell'] != null) {
                restaurCellToDefault(cell['_parentCell']);
            }
            cell.style.display = '';
            cell.colSpan = item.colSpan;
            cell.rowSpan = item.rowSpan;
            let adjcentsCells = [];
            for (let iRow = item.row; iRow <= item.row + item.rowSpan - 1; iRow++) {
                for (let iCol = item.col; iCol <= item.col + item.colSpan - 1; iCol++) {
                    let adjcentCell = this._cellsDictionary.get(iCol + ',' + iRow);
                    if (adjcentCell == cell)
                        continue;
                    adjcentCell.style.display = 'none';
                    adjcentsCells.add(adjcentCell);
                    adjcentCell['_parentCell'] = cell;
                }
            }
            cell['_adjcentCells'] = adjcentsCells;
            cell['_control'] = control;
            cell['_id'] = item.id;
            this._itemsDictionary.set(item.id, item);
            if (item.configAction) {
                item.configAction(control);
            }
            this.onDrowCell.dispatch(this, { cell: cell, options: item, control: control });
            return control;
        }


        public removeItem(col: number, row: number) {
            let cell = this._cellsDictionary[col + ',' + row];
            if (cell != null && cell['_control'] != null) {
                this._itemsDictionary.remove(cell['_id']);
                (<NextAdmin.UI.Control>cell['_control']).element.remove();
                delete cell['_id'];
            }
        }

        public clear() {
            this.initialize(0, 0);
        }


        public getItems() {
            return this._itemsDictionary.getValues();
        }


        public getPrintableElement(options?: any): HTMLTableElement {
            //return document.createElement('table');

            let printableElement = document.createElement('table');
            printableElement.style.width = '100%';
            for (let row of this.rows) {
                printableElement.appendHTML('tr', (tr) => {
                    for (let cell of row.cells) {
                        tr.appendHTML('td', (td) => {
                            if (cell.style.width != null) {
                                td.style.width = cell.style.width;
                            }
                            if (cell['_control'] instanceof FormControl) {
                                td.append(cell['_control'].getPrintableElement());
                            }
                            else {
                                td.innerHTML = cell.innerHTML;
                            }
                        });
                    }
                });
            }
            return printableElement;
        }

        public unbindControls() {
            for (let control of this.controlsDictionary.getValues()) {
                if (control instanceof NextAdmin.UI.FormControl) {
                    this.dataController.unbindControl(control);
                }
            }
        }

        public bindControls(updateControlValueFromData = true) {
            for (let control of this.controlsDictionary.getValues()) {
                if (control instanceof NextAdmin.UI.FormControl && control['_bindedPropertyName']) {
                    this.dataController.bindControl(control, control['_bindedPropertyName']);
                    if (updateControlValueFromData) {
                        control.setValue(this.dataController.data[control['_bindedPropertyName']]);
                    }
                }
            }
        }


        public getRow(rowIndex: number) {
            return this.rows.length > rowIndex ? this.rows[rowIndex] : null;
        }

        public getCell(col: number, row: number) {
            return this._cellsDictionary.get(col + ',' + row);
        }

        public getControl(col: number, row: number): NextAdmin.UI.Control {
            let cell = this.getCell(col, row);
            if (cell == null) {
                return null;
            }
            return cell['_control'] as NextAdmin.UI.Control;
        }

        public getCells(): Array<HTMLTableCellElement> {
            return this._cellsDictionary.getValues();
        }

        public getRowCount() {
            return this._rowCount;
        }

        public getColumnCount() {
            return this._columnCount;
        }


    }



    export class FormLayout_ extends FormLayout<any> {


    }


    export interface FormLayoutOptions extends ControlOptions {

        columnCount?: number;

        rowCount?: number;

        items?: FormLayoutItem[];

        dataController?: NextAdmin.Business.DataController_;

        style?: FormLayoutStyle;

    }

    export enum FormLayoutStyle {
        thinLabels,
    }



    export interface FormLayoutViewItem {

        id?: string;

        col: number;

        row: number;

        colSpan?: number;

        rowSpan?: number;

        labelWidth?: string;

    }



    export interface FormLayoutItem extends FormLayoutViewItem {

        html?: string;

        useDefaultControl?: boolean;

        propertyName?: string;

        controlType?: string;

        controlOption?: {};

        control?: IControl | HTMLElement;

        configAction?: (control: IControl | Element) => void;

    }


    export interface FormLayoutView {

        name: string;

        items?: Array<FormLayoutViewItem>;

    }





    export interface FormLayoutControlItem<TControl extends Control | HTMLElement> extends FormLayoutItem {


        control?: TControl;

        configAction?: (control: TControl) => void;

    }





}
