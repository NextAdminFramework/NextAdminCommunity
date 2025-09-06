
/// <reference path="Control.ts" />

namespace NextAdmin.UI {

    export class FormControl extends Control implements IFormControl {

        onValueChanged = new NextAdmin.EventHandler<IFormControl, ValueChangeEventArgs>();

        public static onCreated = new EventHandler<FormControl, FormControlOptions>();

        options: FormControlOptions;

        public constructor(elementType = 'div', options?: FormControlOptions) {
            super(elementType, {
                ...options
            } as FormControlOptions);
            this.element['_isFormControl'] = true;

            if (this.options.onValueChanged) {
                this.onValueChanged.subscribe((sender, args) => {
                    this.options.onValueChanged(this, args);
                });
            }
            if (this.options.value !== undefined) {
                setTimeout(() => {
                    this.setValue(this.options.value);
                }, 1);
            }
            if (this.options.required) {
                setTimeout(() => {
                    this.displayAsRequired();
                }, 1);
            }
            if (this.options.disabled) {
                setTimeout(() => {
                    this.disable();
                }, 1);
            }
            if (this.options.propertyInfo) {
                setTimeout(() => {
                    this.setPropertyInfo(this.options.propertyInfo);
                }, 1);
            }
            FormControl.onCreated.dispatch(this, this.options);
        }

        enable() {
            this.element.enable();
        }

        disable() {
            this.element.disable();
        }

        isEnable(): boolean {
            return this.element.isEnable();
        }

        public setValue(value: any, fireChange?: boolean) {
            this.element.innerHTML = value;
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: this.getValue() });
            }
        }

        public getValue(): any {
            return this.element.innerHTML;
        }

        getLabel(): string {
            return '';
        }

        setLabel(label: string) {

        }

        setError(message: string) {


        }

        displayAsRequired() {


        }

        displayAsNotRequired() {


        }

        getPrintableElement(options?: any): HTMLElement {
            let printableElement = document.createElement('table');
            printableElement.style.width = '100%';
            printableElement.appendHTML('tr', (tr) => {
                let label = this.getLabel();
                if (!NextAdmin.String.isNullOrWhiteSpace(label)) {
                    tr.appendHTML('td', (td) => {
                        td.style.width = '30%';
                        td.innerHTML = '<b>' + label + '</b> : ';
                    });
                }
                tr.appendHTML('td', (td) => {
                    td.innerHTML = this.getDisplayValue();
                });
            });

            return printableElement;
        }

        getDisplayValue(): string {
            return Helper.getDefaultPropertyDisplayValue(this.getPropertyInfo(), this.getValue())
        }

        protected _dataController?: NextAdmin.Business.DataController_;
        protected _bindedPropertyName?: string;

        /**
         * Should not be called
         * @param dataController
         * @param propertyName
         */
        setDataController(dataController: NextAdmin.Business.DataController_, propertyName: string) {
            this._dataController = dataController;
            this._bindedPropertyName = propertyName;

            let propertyInfo = null;
            if (propertyName.contains('.')) {
                propertyInfo = dataController.getDataPropertyInfoFromPath(dataController.options.dataName, propertyName);
            }
            else {
                propertyInfo = dataController.getDataPropertyInfo_(dataController.options.dataName, propertyName);
            }
            if (propertyInfo != null) {
                this.setPropertyInfo(propertyInfo);
            }
        }

        getDataController(): NextAdmin.Business.DataController_ {
            return this._dataController;
        }


        getBindedPropertyName() {
            return this._bindedPropertyName;
        }


        protected _propertyInfo: NextAdmin.Business.DataPropertyInfo;
        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo) {
            this._propertyInfo = propertyInfo;

            if (propertyInfo != null) {
                if (this._propertyInfo.isRequired && (this.options.required === undefined || this.options.required == true)) {
                    this.displayAsRequired();
                }
            }
        }

        getPropertyInfo(): NextAdmin.Business.DataPropertyInfo {
            return this._propertyInfo;
        }

    }

    export interface FormControlOptions extends ControlOptions {

        onValueChanged?: (control: FormControl, args: ValueChangeEventArgs) => void;

        value?: any;

        required?: boolean;

        disabled?: boolean;

        propertyInfo?: NextAdmin.Business.DataPropertyInfo;

    }




}