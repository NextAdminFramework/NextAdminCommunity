
/// <reference path="Control.ts" />

namespace NextAdmin.UI {


    export class Toolbar extends Control {


        row: HTMLTableRowElement;

        options: ToolbarOptions;

        onItemsChanged = new EventHandler<Toolbar, Array<Control | HTMLElement>>();

        public static style = `
        .next-admin-toolbar {
            border-spacing:0px 
        } 
        .next-admin-toolbar .toolbar-cell {
            padding:0px; 
            padding-left:1px;
            padding-right:1px;
        }
        .next-admin-toolbar-align-top .toolbar-cell{
            vertical-align:top;
        }
        `;

        public static onCreated = new EventHandler<Toolbar, any>();

        items = new Array<Control | HTMLElement>();

        constructor(options?: ToolbarOptions) {
            super('table', options);
            Style.append("Toolbar", Toolbar.style);
            this.element.classList.add('next-admin-toolbar');
            if (this.options.alignItemsTop) {
                this.element.classList.add('next-admin-toolbar-align-top');
            }
            this.element.style.borderSpacing = '0px';
            this.row = this.element.appendHTML('tr') as HTMLTableRowElement;
            if (this.options.items != null) {
                for (let item of this.options.items) {
                    this.appendControl(item);
                }
            }
            Toolbar.onCreated.dispatch(this, this.options);
        }

        protected addItem(item: Control | HTMLElement) {
            this.items.push(item);
            this.onItemsChanged.dispatch(this, this.items);
        }


        public appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElement) => void): HTMLElementTagNameMap[K] {
            return this.appendControl(document.createElement(html), setControlPropertiesAction) as any;
        }

        public prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.prependControl(document.createElement(html), setControlPropertiesAction);
        }

        public appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            this.row.appendHTML('td', (td) => {
                td.classList.add('toolbar-cell');
                if (elementOrControl instanceof Control) {
                    td.appendControl(elementOrControl);
                }
                else {
                    td.appendChild(elementOrControl);
                }
            });
            if (setControlPropertiesAction != null) {
                setControlPropertiesAction(elementOrControl);
            }
            this.addItem(elementOrControl);
            return elementOrControl;
        }


        public prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            this.row.prependHTML('td', (td) => {
                td.classList.add('toolbar-cell');
                if (elementOrControl instanceof Control) {
                    td.appendControl(elementOrControl);
                }
                else {
                    td.appendChild(elementOrControl);
                }
            });
            if (setControlPropertiesAction != null) {
                setControlPropertiesAction(elementOrControl);
            }
            this.addItem(elementOrControl);
            return elementOrControl;
        }

        public insertControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, index: number, setControlPropertiesAction?: (control: TElement) => void): TElement {
            let td = this.row.insertCell(index);
            td.classList.add('toolbar-cell');
            if (elementOrControl instanceof Control) {
                td.appendControl(elementOrControl);
            }
            else {
                td.appendChild(elementOrControl);
            }
            if (setControlPropertiesAction != null) {
                setControlPropertiesAction(elementOrControl);
            }
            this.addItem(elementOrControl);
            return elementOrControl;
        }

        public removeControl<TElement extends Control | HTMLElement>(elementOrControl: TElement) {
            if (elementOrControl instanceof Control) {
                elementOrControl.element.parentElement.remove();
            }
            else {
                elementOrControl.parentElement.remove();
            }
            this.items.remove(elementOrControl);
            this.onItemsChanged.dispatch(this, this.items);
        }


        public clear() {
            for (let item of this.items) {
                this.removeControl(item);
            }

        }


    }


    export interface ToolbarOptions extends ControlOptions {


        items?: Array<Control | HTMLElement>;

        alignItemsTop?: boolean;


    }




}