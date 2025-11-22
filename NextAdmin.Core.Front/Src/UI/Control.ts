/// <reference path="../EventHandler .ts" />

namespace NextAdmin.UI {


    export class Control implements IControl {

        element: HTMLElement;

        options: ControlOptions;

        public static onCreated = new EventHandler<Control, any>();


        constructor(htmlElement: HTMLElement | string, options?: ControlOptions) {
            if (options == null) {
                options = {};
            }
            if (typeof htmlElement == 'string') {
                this.element = document.createElement(htmlElement);
            }
            else {
                this.element = htmlElement;
            }
            this.element['_control'] = this;
            this.element.setAttribute('control-type', this.constructor.name);
            this.options = options;
            if (this.options.id) {
                this.element.id = this.options.id;
            }
            if (this.options.disabled) {
                setTimeout(() => {
                    this.disable();
                },1);
            }
            if (this.options.toolTip) {
                setTimeout(() => {
                    this.setTooltip(this.options.toolTip);
                }, 1);
            }
            if (this.options.hidden) {
                this.hide();
            }
            if (this.options.classes) {
                this.element.classList.add(...this.options.classes);
            }

            if (this.options.css) {
                NextAdmin.Copy.copyTo(this.options.css, this.element.style);
            }
            Control.onCreated.dispatch(this, this.options);
        }

        public isEnable() {
            return this.element.isEnable();
        }

        public enable() {
            this.element.enable();
        }

        public disable() {
            this.element.disable();
        }

        private _tooltipValue = null;
        setTooltip(value?: string) {
            if (value != null) {
                this.element.setPopover(value);
            }
            else {
                this.element.removePopover();
            }
            this._tooltipValue = value;
        }

        getToolTip(): string {
            return this._tooltipValue;
        }

        public changeEnableStateOnControlsRequiredValueChanged(condition: () => boolean, ...controls: Array<FormControl>) {
            this.disable();
            setTimeout(() => {
                if (condition()) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            }, 20);//use timeout in the case of value is setted by option.value
            for (let control of controls) {
                control.onValueChanged.subscribe((sender, args) => {
                    if (condition()) {
                        this.enable();
                    }
                    else {
                        this.disable();
                    }
                });
            }
        }

        startSpin() {
            this.element.startSpin('rgba(255,255,255,0.5)', 20);
        }

        stopSpin() {
            this.element.stopSpin();
        }

        hide() {
            this.element.style.display = 'none';
        }

        display() {
            this.element.style.display = '';
        }

        isVisible() {
            return this.element.style.display != 'none';
        }

        dispose() {
            this.element.remove();
        }
    }

    export interface ControlOptions {

        css?: CssDeclaration;

        id?: string;

        classes?: Array<string>;

        disabled?: boolean;

        hidden?: boolean;

        toolTip?: string;

    }

    export enum ControlStyle {
        default,
        modern
    }


}