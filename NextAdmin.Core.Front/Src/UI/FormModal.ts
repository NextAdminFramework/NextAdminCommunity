namespace NextAdmin.UI {

    export class FormModal<T> extends NextAdmin.UI.Modal {

        protected data?: T;

        options: FormModalOptions<T>;

        form: HTMLDivElement;

        formControls = new Dictionary<FormControl>();

        validateButton: Button;

        public static style = `

            .next-admin-form-modal{
                .next-admin-form-modal-form{
                    padding-left:20px;
                    padding-right:20px;
                    @media (max-width: 512px) {
                        padding-left:10px;
                        padding-right:10px;
                    }
                    .form-modal-control{
                        margin-top:10px;
                        margin-bottom:10px;
                    }
                }
            }
        `;

        constructor(options?: FormModalOptions<T>) {
            super({
                size: NextAdmin.UI.ModalSize.mediumFitContent,
                ...options
            });
            Style.append('NextAdmin.UI.FormModal', FormModal.style);
            this.modal.classList.add('next-admin-form-modal');
            this.form = this.body.appendHTML('div', (form) => {
                form.classList.add('next-admin-form-modal-form');
            });
            this.data = this.options.data ?? {};
            this.validateButton = this.rightFooter.appendControl(new NextAdmin.UI.Button({
                text: Resources.validate,
                style: NextAdmin.UI.ButtonStyle.blue,
                css: { cssFloat: 'right' },
                action: () => {
                    this.validate();
                },
                ...this.options.validateButtonOption
            }));
        }

        open(args?: OpenFormModalArgs) {
            super.open(args);
            if (args?.data) {
                this.setData(args?.data);
            }
            setTimeout(() => {
                this.updateValidateButtonState();
            }, 1);
        }

        updateValidateButtonState() {
            if (this.formControls.getValues().firstOrDefault(a => a.options.required && String.isNullOrEmpty(a.getValue()))) {
                this.validateButton.disable();
            }
            else {
                this.validateButton.enable();
            }
        }

        async validate() {
            this.updateDataFromControls();
            if (this.options.onValidate) {
                this.options.onValidate(this.data)
            }
        }

        appendFormControl<TControl extends FormControl>(dataPropertyName: string, formControl: TControl, configAction?: (control: TControl) => void) {
            this.form.appendControl(formControl, configAction);
            this.bindControl(formControl, dataPropertyName);
            formControl.element.classList.add('form-modal-control');
        }

        bindControl(formControl: FormControl, dataPropertyName?: string) {
            this.formControls.add(dataPropertyName, formControl);
            if (this.data[dataPropertyName]) {
                formControl.setValue(this.data[dataPropertyName], false);
            }
            formControl.onValueChanged.subscribe((sender, args) => {
                this.data[dataPropertyName] = args.value;
                this.updateValidateButtonState();
            });
            this.updateValidateButtonState();
        }

        setData(data?: T, fireChange?: boolean) {
            if (data = null) {
                data = {} as any;
            }
            this.data = data;
            this.updateControlsFromData(fireChange);
            if (!fireChange) {
                this.updateValidateButtonState();
            }
        }

        updateControlsFromData(fireChange?: boolean) {
            for (let propertyNameControl of this.formControls.getKeysValues()) {
                propertyNameControl.value.setValue(this.data[propertyNameControl.key], fireChange);
            }
        }

        updateDataFromControls() {
            for (let propertyNameControl of this.formControls.getKeysValues()) {
                this.data[propertyNameControl.key] = propertyNameControl.value.getValue();
            }
        }

        getData(): T {
            return this.data;
        }

    }

    export interface FormModalOptions<T> extends ModalOptions {

        data?: any;

        onValidate?: (data?: T) => void;

        validateButtonOption?: ButtonOptions;

    }

    export class FormModal_ extends FormModal<any> {

    }

    export interface FormModalOptions_ extends FormModalOptions<any> {



    }

    export interface OpenFormModalArgs {

        data?: any;

    }

}