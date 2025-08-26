/// <reference path="Control.ts" />

namespace NextAdmin.UI {


    export class Table extends Control {

        public static defaultStyle?: TableStyle;

        public tableContainer: HTMLDivElement;

        public table: HTMLTableElement;

        public tHead: HTMLTableSectionElement;

        public tBody: HTMLTableSectionElement;

        public tFoot: HTMLTableSectionElement;

        public onRowSelected = new NextAdmin.EventHandler<Table, HTMLTableRowElement>();

        public onRowUnselected = new NextAdmin.EventHandler<Table, HTMLTableRowElement>();

        public onSelectedRowsChanged = new NextAdmin.EventHandler<Table, HTMLTableRowElement[]>();

        public onRowAdded = new NextAdmin.EventHandler<Table, HTMLTableRowElement>();

        options: TableOptions;

        public static style = `
        .next-admin-table {
            border-spacing:0px;
        } 
        .next-admin-table thead td {
            position:sticky;
            top:0;
            background:rgba(255,255,255,1)
        } 
        .next-admin-table thead th {
            position:sticky;
            top:0;
            background:rgba(255,255,255,1)
        } 
        .next-admin-table thead .next-admin-table-row-border {
            border-bottom:1px solid #ccc
        } 
        .next-admin-table-row-border {
            border-bottom:1px solid #e5e5e5
        } 
        .next-admin-table-col-border{

        }
        .next-admin-table-row-hover {
            background:rgba(220,220,220,0.2);
            text-shadow:` + DefaultStyle.HoveredRowBackground + `;
        }
        .next-admin-table-row-hover {
            .next-admin-table-cell{
                background:` + DefaultStyle.HoveredRowBackground + `;
            }
        }
        .next-admin-table-row-selected{
            background:` + DefaultStyle.SelectedRowBackground + `;
        }
        .next-admin-table-row-selected{
            .next-admin-table-cell{
                background:` + DefaultStyle.SelectedRowBackground + `;
            }
        }


        .next-admin-table-modern {
            .next-admin-table {
                .next-admin-table-thead-row{
                    .next-admin-table-header-cell{
                        box-shadow:0px 1px 1px rgba(0,0,0,0.25);
                        color:#263544;
                    }
                }

                .next-admin-table-row{
                    box-shadow:0px 1px 1px rgba(0,0,0,0.15);
                    .next-admin-table-cell{
                        padding:10px;
                    }
                }
            }
        }
        .next-admin-table-modern-no-cell-padding {
            .next-admin-table {
                .next-admin-table-thead-row{
                    .next-admin-table-header-cell{
                        box-shadow:0px 1px 1px rgba(0,0,0,0.25);
                        color:#263544;
                    }
                }

                .next-admin-table-row{
                    box-shadow:0px 1px 1px rgba(0,0,0,0.15);
                    .next-admin-table-cell{
                        padding:0px;
                        min-height:
                    }
                }
            }
        }
        .next-admin-table-card {

            .next-admin-table-header{
                background-color:unset;
                border-bottom:0px;
            }

            .next-admin-table {

                .next-admin-table-thead{
                    visibility:collapse;
                }

                border-collapse:separate;
                border-spacing: 0 20px;

                .next-admin-table-row{
                    .next-admin-table-cell{
                        padding:30px;
                        border: solid 1px #ccc;
                        border-style: solid none;
                    }
                    .next-admin-table-cell:first-child {
                        border-left-style: solid;
                        border-top-left-radius: 10px;
                        border-bottom-left-radius: 10px;
                    }
                    .next-admin-table-cell:last-child {
                        border-right-style: solid;
                        border-bottom-right-radius: 10px;
                        border-top-right-radius: 10px;
                    }

                }
                .next-admin-table-row-hover{

                }
            }
        }


        `;

        public static onCreated = new EventHandler<Table, TableOptions>();

        public constructor(options?: TableOptions) {
            super("div", {
                style: Table.defaultStyle,
                stretchWidth:true,
                ...options
            } as TableOptions);

            Style.append("NextAdmin.UI.Table", Table.style);



            this.element.style.width = this.options.stretchWidth ? '100%' : 'fit-content';

            this.tableContainer = this.element.appendHTML('div', (tableContainer) => {
                tableContainer.style.width = this.options.stretchWidth ? '100%' : 'fit-content';

                this.table = tableContainer.appendHTML('table', (table) => {
                    table.classList.add('next-admin-table');
                    if (this.options.stretchWidth) {
                        table.style.width = '100%';
                    }
                    this.tHead = table.appendHTML('thead');
                    this.tBody = table.appendHTML('tbody');
                    this.tFoot = table.appendHTML('tfoot');
                });

            });

            if (this.options.stretchHeight) {
                this.element.style.position = 'relative';
                this.element.style.height = '100%';
                this.tableContainer.style.position = 'absolute';
                this.tableContainer.style.height = '100%';
                this.tableContainer.style.left = '0px';
                this.tableContainer.style.top = '0px';
                this.tableContainer.style.overflow = 'auto';
                if (UserAgent.isDesktop()) {
                    this.tableContainer.appendPerfectScrollbar();
                }
            }
            this.setStyle(this.options.style);

            Table.onCreated.dispatch(this, this.options);
        }

        public setStyle(style?: TableStyle) {
            switch (style) {
                default:
                case TableStyle.default:
                    this.element.classList.add('next-admin-table-default');
                    break;
                case TableStyle.modern:
                    this.element.classList.add('next-admin-table-modern');
                    break;
                case TableStyle.modernNoCellPadding:
                    this.element.classList.add('next-admin-table-modern-no-cell-padding');
                    break;
                case TableStyle.card:
                    this.element.classList.add('next-admin-table-card');
                    break;
            }
        }


        public addHeaderRow(...headerCellCaptions: string[]): HTMLTableRowElement {
            let tr = document.createElement('tr');
            tr['RowType'] = 'Head';
            if (headerCellCaptions != null) {
                for (let caption of headerCellCaptions) {
                    tr.addCell(caption);
                }
            }
            this.tHead.appendChild(tr);
            return tr;
        }

        public addBodyRow(...cellContent: string[]): HTMLTableRowElement {
            let tr = document.createElement('tr');
            tr.classList.add('next-admin-table-row');
            if (cellContent != null) {
                for (let content of cellContent) {
                    let cell = tr.addCell(content);
                    cell.classList.add('next-admin-table-cell');
                }
            }
            if (this.options.rowSelectionMode != null && this.options.rowSelectionMode != RowSelectionMode.disabled) {
                tr.style.cursor = 'pointer';
            }
            tr.addEventListener('click', (e) => {
                if (this.options.rowSelectionMode != RowSelectionMode.disabled) {
                    this.selectRow(tr);
                }
            });

            if (this.options.rowHoverable) {
                tr.addEventListener('pointerenter', (e) => {
                    tr.classList.add('next-admin-table-row-hover');
                });
                tr.addEventListener('pointerleave', (e) => {
                    tr.classList.remove('next-admin-table-row-hover');
                });
            }

            tr['RowType'] = 'Body';
            this.tBody.appendChild(tr);
            this.onRowAdded.dispatch(this, tr);
            return tr;
        }

        public addFooterRow(): HTMLTableRowElement {
            let tr = document.createElement('tr');
            tr['RowType'] = 'Foot';
            this.tFoot.appendChild(tr);
            return tr;
        }

        public selectRow(row: HTMLTableRowElement, fireRowSelectedEvent = true) {
            if (this.options.rowSelectionMode == RowSelectionMode.singleSelect) {
                for (let otherRow of Array.from(this.tBody.children)) {
                    this.unselectRow(otherRow as HTMLTableRowElement);
                }
            }

            if (!row.hasAttribute('selected')) {
                row.setAttribute('selected', 'true');
                row.classList.add('next-admin-table-row-selected');
                if (fireRowSelectedEvent) {
                    this.onRowSelected.dispatch(this, row);
                    this.onSelectedRowsChanged.dispatch(this, this.getSelectedRows());
                }
            }
            else if (this.options.rowSelectionMode == RowSelectionMode.multiSelect) {
                this.unselectRow(row);
            }
        }


        public unselectRow(row: HTMLTableRowElement) {
            if (row.hasAttribute('selected')) {
                row.removeAttribute('selected');
                row.classList.remove('next-admin-table-row-selected');

                this.onRowUnselected.dispatch(this, row);
                this.onSelectedRowsChanged.dispatch(this, this.getSelectedRows());
            }
        }

        public unselectAll() {
            for (let row of this.getBodyRows()) {
                this.unselectRow(row);
            }
        }


        public getSelectedRows(): Array<HTMLTableRowElement> {
            let selectedRows = new Array<HTMLTableRowElement>();
            for (let row of Array.from(this.tBody.children)) {
                if (row.hasAttribute('selected')) {
                    selectedRows.add(row as HTMLTableRowElement);
                }
            }
            return selectedRows;
        }

        public getBodyRows(): Array<HTMLTableRowElement> {
            let rows = new Array<HTMLTableRowElement>();
            for (let row of Array.from(this.tBody.children)) {
                rows.add(row as HTMLTableRowElement);
            }
            return rows;
        }

        public getHeaderRows(): Array<HTMLTableRowElement> {
            let rows = new Array<HTMLTableRowElement>();
            for (let row of Array.from(this.tHead.children)) {
                rows.add(row as HTMLTableRowElement);
            }
            return rows;
        }





        public getColumnCells(index: number): Array<HTMLTableCellElement> {
            let columnCells = new Array<HTMLTableCellElement>();

            let headerRows = this.getBodyRows();
            for (let row of headerRows) {
                let cells = row.getCells();
                let cell = cells[index];
                columnCells.add(cell);
            }
            let bodyRows = this.getBodyRows();
            for (let row of bodyRows) {
                let cells = row.getCells();
                let cell = cells[index];
                columnCells.add(cell);
            }
            return columnCells;
        }


        public clear(clearTHead = false) {

            if (clearTHead) {
                this.tHead.innerHTML = '';
            }
            this.tBody.innerHTML = '';

        }

    }

    export enum TableStyle {
        default,
        modern,
        modernNoCellPadding,
        card
    }


    export enum RowSelectionMode {
        disabled,
        singleSelect,
        multiSelect,
        multiSelect_CtrlShift
    }

    export interface TableOptions extends ControlOptions {

        rowSelectionMode?: RowSelectionMode;

        rowHoverable?: boolean;

        stretchHeight?: boolean;

        stretchWidth?: boolean;

        style?: TableStyle;

    }

}


interface HTMLTableRowElement {


    getCells(): Array<HTMLTableCellElement>;


    addCell(content?: string): HTMLTableCellElement;

}


try {
    HTMLTableRowElement.prototype.getCells = function (): Array<HTMLTableCellElement> {
        let cells = new Array<HTMLTableCellElement>();
        if (this['RowType'] == 'Head') {
            for (let cell of Array.from(this.children)) {
                cells.add(cell as HTMLTableCellElement);
            }
        }
        else {
            for (let cell of Array.from(this.children)) {
                cells.add(cell as HTMLTableCellElement);
            }
        }
        return cells;
    };



    HTMLTableRowElement.prototype.addCell = function (content: string = null): HTMLTableCellElement {

        let cell: HTMLTableCellElement;
        if (this['RowType'] == 'Head') {
            cell = document.createElement('th');
            this.appendChild(cell);
        }
        else {
            cell = document.createElement('td');
            this.appendChild(cell);
        }
        if (content != null) {
            cell.innerHTML = content;
        }
        return cell;

    };


}
catch
{

}