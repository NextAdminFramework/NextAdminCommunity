
/// <reference path="LabelFormControl.ts"/>
/// <reference path="DefaultStyle.ts"/>

namespace NextAdmin.UI {


    export class Input extends LabelFormControl {

        public static defaultStyle?: InputStyle;

        public input: HTMLInputElement;

        public options: InputOptions;

        public static style = `

            .next-admin-input { 
                border-radius: 4px;
                height:32px;
                margin:0px;box-sizing:border-box; 
                outline:0px;border:1px solid #ccc; 
                background:rgba(250,250,250,1);
                font-size:14px;
                color:#444;
                padding-left:5px;
            }
            .next-admin-input-large{
                height:38px;
                font-size:18px;
            }
            .next-admin-input-ultra-large{
                height:46px;
                font-size:22px;
            }
            .next-admin-input-checkbox { 
                height:18px;
                margin-top:3px;
            } 
            .next-admin-table .next-admin-input { 
                border:0px;background:rgba(255,255,255,0)
            } 
            .next-admin-table .next-admin-input:hover {
                border:1px solid #ccc
            }
            .next-admin-control-error .next-admin-input { 
                background:#FFC7C7;
            }
            .next-admin-table .next-admin-control-error .next-admin-input { 
                background:rgba(255,0,0,0.3);
            }

            .next-admin-input-modern{
                .next-admin-input{
                    background:#fff;
                    border:1px solid #fff;
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
                    transition: 0.5s;
                }
                .next-admin-input:hover{
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.40);
                }
                .next-admin-input-checkbox{
                    box-shadow: 0px 0px 0px rgba(0,0,0,0) !important;
                }

                *:disabled{
                    color:#999;
                }
                .next-admin-input:focus {
                    border: 1px solid #12101d;
                    text-shadow:0px 0px 2px rgba(0,0,0,0.2);
                }
            }

            .next-admin-input-no-background{
                .next-admin-input{
                    background:rgba(255,255,255,0);
                    border:0px;
                    box-shadow: unset;
                }
                *:disabled{
                    color:#999;
                }
                .next-admin-input:hover {
                    border:0px;
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.40);
                }
            }

            .next-admin-input-inline-grid{
                .next-admin-input{
                    height:46px;
                    border-radius:0px;
                }
            }

            .next-admin-input.next-admin-required{
                background:` + DefaultStyle.RequiredFieldBackground + `;
            }

            .next-admin-input.next-admin-error{
                background:#f5e4e4;
            }

            `;

        public static onCreated = new EventHandler<Input, InputOptions>();

        constructor(options?: InputOptions) {
            super({
                style: Input.defaultStyle,
                ...options
            });

            Style.append("Input", Input.style);
            this.input = this.controlContainer.appendHTML('input') as HTMLInputElement;
            this.input.style.width = '100%';
            this.input.classList.add('next-admin-input');
            if (this.options.inputType == InputType.checkbox) {
                this.input.classList.add('next-admin-input-checkbox');
            }
            if (this.options.inputType == InputType.password) {
                this.input.setAttribute('autocomplete', 'new-password');
            }
            if (this.options.decimalCount != null) {
                this.options.inputType = InputType.number;
                let step = '0.';
                for (let i = 1; i < this.options.decimalCount; i++) {
                    step += '0';
                }
                step += '1';
                this.input.step = step;
            }
            if (this.options.inputType != null) {
                this.input.type = this.options.inputType;
            }
            if (this.options.inlineGrid) {
                this.options.style = NextAdmin.UI.InputStyle.noBackground;
                this.element.classList.add('next-admin-input-inline-grid');
            }
            this.input.addEventListener("input", () => {
                let value = this.getValue();
                if (this.options.decimalCount && value) {
                    value = Number(Number(value).toFixed(this.options.decimalCount));
                    this.setValue(value);
                }
                this.onValueChanged.dispatch(this, { value: value } as ValueChangeEventArgs);
            });
            if (this.options.placeHolder != null) {
                this.setPlaceholder(this.options.placeHolder);
            }
            this.setStyle(this.options.style);
            this.setSize(this.options.size);
            Input.onCreated.dispatch(this, this.options);
        }


        public setStyle(style?: InputStyle) {
            switch (style) {
                default:
                case InputStyle.default:
                    this.element.classList.add('next-admin-input-default');
                    break;
                case InputStyle.modern:
                    this.element.classList.add('next-admin-input-modern');
                    break;
                case InputStyle.noBackground:
                    this.element.classList.add('next-admin-input-no-background');
                    break;
            }
        }

        public setSize(size?: InputSize) {
            switch (size) {
                default:
                case InputSize.medium:
                    break;
                case InputSize.large:
                    this.input.classList.add('next-admin-input-large');
                    break;
                case InputSize.ultraLarge:
                    this.input.classList.add('next-admin-input-ultra-large');
                    break;
            }
        }

        displayAsRequired() {
            super.displayAsRequired();
            this.input.classList.add('next-admin-required');
        }

        displayAsNotRequired() {
            super.displayAsNotRequired();
            if (this.input.classList.contains('next-admin-required')) {
                this.input.classList.remove('next-admin-required');
            }
        }

        setError(message?: string) {
            super.setError(message);
            if (message != null) {
                this.input.classList.add('next-admin-error');
            }
            else {
                this.input.classList.remove('next-admin-error');
            }
        }


        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo) {
            super.setPropertyInfo(propertyInfo);
            if (propertyInfo?.type == 'number' && this.input.type == 'text') {
                this.input.type = 'number';
            }
            else if (propertyInfo?.type == 'date' && this.input.type == 'text') {
                this.input.type = 'date';
            }
        }

        public setPlaceholder(text: string): Input {
            this.input.setAttribute('placeholder', text);
            return this;
        }

        public setLabel(text: string): Input {
            this.label.innerHTML = text;
            if (text) {
                this.label.style.display = '';
                this.labelContainer.style.display = '';
            }
            else {
                this.labelContainer.style.display = 'none';
                this.label.style.display = 'none';
            }
            return this;
        }

        getLabel(): string {
            return this.label.innerText;
        }



        setValue(value: any, fireChange?: boolean) {
            if (value == null) {
                this.input.value = '';
            }
            else {
                if (this.input.type == 'date') {
                    if (value instanceof Date) {
                        this.input.value = value.toISOString().split('T')[0];
                    }
                    else {
                        let stringDate = value + '';
                        if (stringDate != '' && stringDate.indexOf('T') != -1) {
                            this.input.value = stringDate.split('T')[0];
                        }
                        else {
                            this.input.value = stringDate;
                        }
                    }
                }
                else if (this.input.type == 'time') {
                    if (value instanceof Date) {
                        this.input.value = value.toISOString().split('T')[1];
                    }
                    else {
                        let stringDate = value + '';
                        if (!NextAdmin.String.isNullOrEmpty(stringDate) && stringDate.indexOf('T') != -1) {
                            this.input.value = stringDate.split('T')[1];
                        }
                        else if (!NextAdmin.String.isNullOrEmpty(stringDate) && stringDate.indexOf(' ') != -1) {
                            this.input.value = stringDate.split(' ')[1];
                        }
                        else {
                            this.input.value = stringDate;
                        }
                    }
                }
                else if (value && this.input.type == 'number') {
                    let numberValue = Number(value);
                    this.input.value = Number.isInteger(numberValue) ? value : numberValue.toFixed(UserInterfaceHelper.DefaultNumberDecimalCount);
                }
                else if (this.input.type == 'checkbox') {
                    if (value == 'true' || value == '1' || value == 'True' || value == true) {
                        this.input.checked = true;
                    }
                    else {
                        this.input.checked = false;
                    }
                }
                else {
                    this.input.value = value;
                }
            }
            value = this.getValue();
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: value, origin: ChangeOrigin.code });
            }
        }

        getValue(): any {
            if (this.input.type == 'checkbox') {
                return this.input.checked;
            }
            if (this.input.type == 'number' || this.input.type == 'range') {
                return NextAdmin.String.isNullOrEmpty(this.input.value) ? null : Number(this.input.value);
            }
            if (this.options.outputNullIfEmpty && NextAdmin.String.isNullOrEmpty(this.input.value)) {
                return null;
            }
            return this.input.value;
        }

        enable() {
            this.input.disabled = false;
            this._disabled = false;
        }

        disable() {
            this.input.disabled = true;
            this._disabled = true;
        }
    }


    export interface InputOptions extends LabelFormControlOptions {

        inputType?: InputType;

        decimalCount?: number;

        placeHolder?: string;

        style?: InputStyle | any;

        size?: InputSize;

        inlineGrid?: boolean;

        outputNullIfEmpty?: boolean;

    }



    export enum InputType {
        button = "button",
        checkbox = "checkbox",
        color = "color",
        date = "date",
        datetimeLocal = "datetime-local",
        email = "email",
        file = "file",
        hidden = "hidden",
        image = "image",
        month = "month",
        number = "number",
        password = "password",
        radio = "radio",
        range = "range",
        reset = "reset",
        search = "search",
        submit = "submit",
        tel = "tel",
        text = "text",
        time = "time",
        url = "url",
        week = "week",
    }

    export enum InputStyle {
        default,
        modern,
        noBackground,
    }


    export enum InputSize {
        medium,
        large,
        ultraLarge
    }

}