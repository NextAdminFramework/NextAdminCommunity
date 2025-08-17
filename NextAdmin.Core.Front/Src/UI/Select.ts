/// <reference path="LabelFormControl.ts"/>
/// <reference path="DefaultStyle.ts"/>

namespace NextAdmin.UI {

    export class Select extends LabelFormControl {

        public static defaultStyle?: SelectStyle;

        public select: HTMLSelectElement;

        public options: SelectOptions;

        public static style = `

        .next-admin-select { 
            border-radius: 4px;
            height:32px;
            margin:0px;
            padding:0px;
            box-sizing:border-box;
            outline:0px;
            border:1px solid #ccc; 
            background:rgba(250,250,250,1);
            font-size:14px;
            color:#444;
        }
        .next-admin-select-large{
            height:38px;
            font-size:18px;
        }
        .next-admin-input-select-large{
            height:46px;
            font-size:22px;
        }
        .next-admin-table .next-admin-select { 
            border:0px;background:rgba(255,255,255,0)
        }

        .next-admin-table .next-admin-select:hover {
            border:1px solid #ccc;
        }

        .next-admin-select-modern{
            .next-admin-select{
                background:#fff;
                border:1px solid #fff;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
                transition: 0.5s;
            }
            .next-admin-select:hover{
                box-shadow: 0px 0px 2px rgba(0,0,0,0.40);
            }
            .next-admin-select:focus {
                border: 1px solid #12101d;
                text-shadow:0px 0px 2px rgba(0,0,0,0.2);
            }
        }


        .next-admin-select-no-background{
            .next-admin-select{
                background:rgba(0,0,0,0);
                border:0px;
                box-shadow: unset;
                transition: 0.5s;
            }
            .next-admin-select:hover{
                border:0px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.40);
            }
        }

        .next-admin-select-inline-grid{
            .next-admin-select{
                height:46px;
                border-radius:0px;
                transition: unset;
            }
        }

        .next-admin-select.next-admin-required{
            background:` + DefaultStyle.RequiredFieldBackground + `;
        }
        `;

        public static onCreated = new EventHandler<Select, SelectOptions>();

        private _previousValue?: any;

        constructor(options?: SelectOptions) {
            super({
                autoFill: true,
                style: Select.defaultStyle,
                size: InputSize.medium,
                valueType: SelectValueType.string,
                ...options
            } as SelectOptions);

            Style.append("SelectBox", Select.style);
            this.select = document.createElement('select');
            this.select.style.width = '100%';
            this.select.classList.add('next-admin-select');

            if (this.options.inlineGrid) {
                this.options.style = NextAdmin.UI.SelectStyle.noBackground;
                this.element.classList.add('next-admin-select-inline-grid');
            }

            this.select.addEventListener("input", () => {
                this.onValueChanged.dispatch(this, { value: this.select.value, previousValue: this._previousValue } as ValueChangeEventArgs);
                this._previousValue = this.select.value;
            });
            this.controlContainer.appendChild(this.select);
            if (this.options.items) {
                this.addSelectItems(this.options.items);
            }
            this.setStyle(this.options.style);
            this.setSize(this.options.size);
            Select.onCreated.dispatch(this, this.options);
        }

        public setStyle(style?: SelectStyle) {
            switch (style) {
                default:
                case SelectStyle.default:
                    this.element.classList.add('next-admin-select-default');
                    break;
                case SelectStyle.modern:
                    this.element.classList.add('next-admin-select-modern');
                    break;
                case SelectStyle.noBackground:
                    this.element.classList.add('next-admin-select-no-background');
                    break;
            }
        }

        public setSize(size?: SelectSize) {
            switch (size) {
                default:
                case SelectSize.medium:
                    break;
                case SelectSize.large:
                    this.select.classList.add('next-admin-select-large');
                    break;
                case SelectSize.ultraLarge:
                    this.select.classList.add('next-admin-select-ultra-large');
                    break;
            }
        }

        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo) {
            super.setPropertyInfo(propertyInfo);
            if (this.options.autoFill && propertyInfo.values != null && this.getItems().length == 0) {
                if ((!propertyInfo.isRequired && this.options.required === undefined) || this.options.allowNullValue) {
                    this.addItem("");
                }
                for (let memberValue of propertyInfo.values) {
                    this.addItem(memberValue.value, memberValue.label);
                }
            }
            if (propertyInfo.type == 'number') {
                this.options.valueType = SelectValueType.number;
            }
        }


        addSelectItem(selectItem: SelectItem): HTMLOptionElement {
            return this.addItem(selectItem.value, selectItem.label, selectItem.selected);
        }

        addSelectItems(selectItems: Array<SelectItem>): Array<HTMLOptionElement> {
            let optionElements = [];
            for (let valueItem of selectItems) {
                optionElements.add(this.addSelectItem(valueItem));
            }
            if (this._previousValue == null) {
                this._previousValue = this.getValue();
            }
            return optionElements;
        }

        setSelectItems(selectItems: Array<SelectItem>): Array<HTMLOptionElement> {
            let value = this.getValue();
            this.clearItems();
            let items = this.addSelectItems(selectItems);
            if (value) {
                this.setValue(value);
            }
            return items;
        }

        addItem(value: string | number, label = value, selected?: boolean): HTMLOptionElement {

            let option = document.createElement('option');
            option.innerHTML = label.toString();
            option.value = value == null ? '' : value.toString();
            option.selected = selected;
            this.select.appendChild(option);
            if (this._previousValue == null) {
                this._previousValue = this.getValue();
            }
            return option;
        }



        addItems<T>(dataset: Array<T>, valueFunc: (data: T) => string, captionFunc: (data: T) => string = null): Array<HTMLOptionElement> {
            let items = new Array<HTMLOptionElement>();
            for (let data of dataset) {
                let item = this.addItem(valueFunc(data), captionFunc == null ? undefined : captionFunc(data));
                items.push(item);
            }
            if (this._previousValue == null) {
                this._previousValue = this.getValue();
            }
            return items;
        }


        setItems<T>(dataset: Array<T>, valueFunc: (data: T) => string, captionFunc: (data: T) => string = null): Array<HTMLOptionElement> {
            this.clearItems();
            return this.addItems(dataset, valueFunc, captionFunc);
        }


        getItems(): Array<HTMLOptionElement> {

            let items = new Array<HTMLOptionElement>();
            for (let i = 0; i < this.select.children.length; i++) {
                items.add(this.select.children.item(i) as HTMLOptionElement);
            }
            return items;
        }

        removeItem(item: HTMLOptionElement) {
            item.remove();
        }

        removeItemByValue(value: string) {
            for (let item of this.getItems()) {
                if (item.value == value) {
                    item.remove();
                }
            }
        }

        clearItems() {
            for (let item of this.getItems()) {
                item.remove();
            }
        }

        clearAll() {
            this.clearItems();
            this.setValue(null);
        }

        public setPlaceholder(text: string): Select {
            this.select.setAttribute('placeholder', text);
            return this;
        }


        setValue(value: any, fireChange?: boolean) {
            if (value && this.getItems().firstOrDefault(a => a.value == value) == null) {
                this.addItem(value);
            }
            this.select.value = value ?? '';
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: value, previousValue: this._previousValue, origin: ChangeOrigin.code });
            }
            this._previousValue = value;
        }


        getValue(): any {
            switch (this.options.valueType) {
                default:
                case SelectValueType.string:
                    if (this.options.outputNullIfEmpty && NextAdmin.String.isNullOrEmpty(this.select.value)) {
                        return null;
                    }
                    return this.select.value;
                case SelectValueType.number:
                    return NextAdmin.String.isNullOrWhiteSpace(this.select.value) ? null : Number(this.select.value);
                case SelectValueType.date:
                    return NextAdmin.String.isNullOrWhiteSpace(this.select.value) ? null : new Date(this.select.value);
            }
        }

        getSelectedItem(): HTMLOptionElement {
            return this.getItems().firstOrDefault(a => a.value == this.getValue());
        }

        getValueText(): string {
            return this.getSelectedItem()?.text;
        }

        displayAsRequired() {
            super.displayAsRequired();
            this.select.classList.add('next-admin-required');
        }

        displayAsNotRequired() {
            super.displayAsNotRequired();
            this.select.classList.remove('next-admin-required');
        }


    }

    export interface SelectOptions extends LabelFormControlOptions {

        label?: string;

        items?: Array<SelectItem>;

        autoFill?: boolean;

        style?: SelectStyle | any;

        size?: SelectSize | any;

        inlineGrid?: boolean;

        isNumeric?: boolean;

        valueType?: SelectValueType;

        allowNullValue?: boolean;

        outputNullIfEmpty?: boolean;

    }

    export interface SelectItem {

        value: string | number;

        label?: string;

        selected?: boolean;
    }

    export enum SelectStyle {
        default,
        modern,
        noBackground
    }
    export enum SelectSize {
        medium,
        large,
        ultraLarge
    }


    export enum SelectValueType {
        string,
        number,
        date,
    }



}