
/// <reference path="FormControl.ts"/>

namespace NextAdmin.UI {


    export class LabelFormControl extends FormControl {

        public element: HTMLTableElement;

        public label: HTMLLabelElement;

        public asterisk: HTMLLabelElement;

        public labelContainer: HTMLTableCellElement;

        public controlContainer: HTMLTableCellElement;

        public options: LabelFormControlOptions;

        public static defaultLabelWidth = '30%';

        public static style = `
        .next-admin-layout-form-control-cell {
            /*
            padding-left:2px;
            padding-right:2px;
            */
        }
        .next-admin-control-label-error {
            color:#ff0000
        }
        .next-admin-control-label-info {
            text-decoration:underline
        }
        .next-admin-layout-form-control-label-container {
            color:#444;
            font-size:14px;
        }
        .next-admin-layout-form-control-asterisk{
            color:#105ABE;
        }
        `;

        public static onCreated = new EventHandler<LabelFormControl, LabelFormControlOptions>();

        constructor(options?: LabelFormControlOptions) {
            super("table", {
                labelWidth: LabelFormControl.defaultLabelWidth,
                ...options
            } as LabelFormControlOptions);

            Style.append("LayoutFormControl", LabelFormControl.style);
            this.element.classList.add('next-admin-layout-control-table');
            this.element.style.borderSpacing = '0px';
            this.element.style.borderCollapse = 'collapse';

            this.element.style.width = '100%';
            if (this.options.labelPosition == FormControlLabelPosition.top) {
                this.element.appendHTML('tr', tr => {
                    this.labelContainer = tr.appendHTML('td');
                    this.labelContainer.colSpan = 10;
                    this.labelContainer.classList.add('next-admin-layout-form-control-cell');
                    this.label = this.labelContainer.appendHTML('label');
                    this.asterisk = this.labelContainer.appendHTML('label');
                    this.asterisk.classList.add('next-admin-layout-form-control-asterisk');

                });
                this.element.appendHTML('tr', tr => {
                    this.controlContainer = tr.appendHTML('td');
                    this.controlContainer.classList.add('next-admin-layout-form-control-cell');
                });
            }
            else {//default inline
                this.element.appendHTML('tr', tr => {
                    this.labelContainer = tr.appendHTML('td');
                    this.labelContainer.classList.add('next-admin-layout-form-control-cell');
                    this.setLabelWidth(this.options.labelWidth);
                    this.label = this.labelContainer.appendHTML('label');
                    this.asterisk = this.labelContainer.appendHTML('label');
                    this.asterisk.classList.add('next-admin-layout-form-control-asterisk');
                    this.controlContainer = tr.appendHTML('td');
                    this.controlContainer.classList.add('next-admin-layout-form-control-cell');
                });
            }

            this.labelContainer.classList.add('next-admin-layout-form-control-label-container');
            this.controlContainer.classList.add('next-admin-layout-form-control-control-container');

            if (this.options.label) {
                this.label.innerHTML = this.options.label;
            }
            else {
                this.labelContainer.style.display = 'none';
            }
            this.onValueChanged.subscribe(() => {
                this.setError(null);
            });
            if (this.options.leftAddons) {
                for (let addon of this.options.leftAddons) {
                    this.addLeftAddon(addon);
                }
            }
            if (this.options.rightAddons) {
                for (let addon of this.options.rightAddons) {
                    this.addRightAddon(addon);
                }
            }

            LabelFormControl.onCreated.dispatch(this, this.options);
        }

        setLabelWidth(width: string) {
            this.labelContainer.style.width = width;
        }


        /**
       * Add addon at the right of the control
       * @param addon
       */
        public addRightAddon<TAddon extends string | HTMLElement | Control | FormControlAddon>(addon: TAddon): TAddon {
            let newCell = document.createElement('td');
            this.controlContainer.parentElement.appendChild(newCell);
            return this.appendAddonCell(newCell, addon);
        }

        /**
         * Add addon at the left of the input
         * @param addon
         */
        public addLeftAddon<TAddon extends string | HTMLElement | Control | FormControlAddon>(addon: TAddon): TAddon {
            let newCell = document.createElement('td');
            this.controlContainer.parentElement.insertBefore(newCell, this.controlContainer);
            return this.appendAddonCell(newCell, addon);
        }


        private appendAddonCell(cell: HTMLTableCellElement, addon: string | HTMLElement | Control | FormControlAddon): any {
            cell.style.width = '0px';
            if (typeof addon == 'string') {
                addon = cell.appendHTML(addon);
            }
            else if (typeof addon == 'number') {
                addon = cell.appendControl(this.getFormControlAddon(addon));
            }
            else if (addon instanceof Control) {
                cell.appendControl(addon);
            }
            else {
                cell.appendChild(addon);
            }
            return addon;
        }

        getFormControlAddon(addon: FormControlAddon): NextAdmin.UI.Control {
            switch (addon) {
                case FormControlAddon.clipboardCopy:
                    return new Button({
                        style: NextAdmin.UI.ButtonStyle.noBg,
                        text: NextAdmin.Resources.copyIcon,
                        popover: NextAdmin.Resources.copy,
                        action: () => {
                            navigator.clipboard.writeText(this.getValue());
                        }
                    });
                default:
                    throw new Error('InvalidAddon : ' + addon);
            }
        }

        public setValue(value: any, fireChange?: boolean) {
            this.controlContainer.innerHTML = value;
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: this.getValue() });
            }
        }

        public getValue(): any {
            return this.controlContainer.innerHTML;
        }

        public setLabel(text: string): LabelFormControl {
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


        private _errorMessage = null;
        setError(message?: string) {
            if (message != null) {
                this.label.classList.add('next-admin-control-label-error');
                this.element.classList.add('next-admin-control-error');
                this.element.setPopover(message);
            }
            else {
                this.label.classList.remove('next-admin-control-label-error');
                this.element.classList.remove('next-admin-control-error');
                this.element.removePopover();
                if (this._tooltipMessage != null) {
                    this.setTooltip(this._tooltipMessage);
                }
            }
            this._errorMessage = message;
        }

        private _tooltipMessage = null;
        setTooltip(message?: string) {
            if (message != null) {
                this.label.classList.add('next-admin-control-label-info');
                this.element.classList.add('next-admin-control-label-info');
                this.element.setPopover(message, this.controlContainer);
            }
            else {
                this.label.classList.remove('next-admin-control-label-info');
                this.element.classList.remove('next-admin-control-label-info');
                this.element.removePopover();
                if (this._errorMessage != null) {
                    this.setError(this._errorMessage);
                }
            }
            this._tooltipMessage = message;
        }

        displayAsRequired() {
            this.asterisk.innerHTML = '*';
        }

        displayAsNotRequired() {
            this.asterisk.innerHTML = '';
        }

        protected _disabled = false;
        isEnable() {
            return !this._disabled;
        }

        enable() {
            this.controlContainer.enable();
            this._disabled = false;
        }

        disable() {
            this._disabled = true;
            this.controlContainer.disable();
        }

        getToolTip(): string {
            return this._tooltipMessage;
        }

    }


    export interface LabelFormControlOptions extends FormControlOptions {

        label?: string;

        labelPosition?: FormControlLabelPosition;

        labelWidth?: string;

        leftAddons?: Array<string | HTMLElement | Control | FormControlAddon>;

        rightAddons?: Array<string | HTMLElement | Control | FormControlAddon>;

    }

    export enum FormControlAddon {
        clipboardCopy = 1
    }

    export enum FormControlLabelPosition {
        left = "left",
        top = "top",
    }

}