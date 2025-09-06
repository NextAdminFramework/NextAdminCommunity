/// <reference path="Input.ts"/>

namespace NextAdmin.UI {

    export class Range extends Input {

        options: RangeOptions;

        _valueLabel: HTMLDivElement;

        constructor(options?: RangeOptions) {
            super({
                inputType: NextAdmin.UI.InputType.range,
                hasValueLabel: true,
                decimalCount: 2,
                unit: '%',

                ...options
            } as RangeOptions);
            if (this.options.step) {
                this.input.step = this.options.step.toString();
            }
            if (this.options.maxValue) {
                this.input.max = this.options.maxValue.toString();
            }
            if (this.options.minValue !== undefined) {
                this.input.min = this.options.minValue.toString();
            }
            this.input.style.boxShadow = 'unset';

            if (this.options.hasValueLabel) {
                this.appendValueLabel();
            }

        }

        getValue(): number {
            let value = super.getValue() ?? 0;
            if (this.options.maxValue && value > this.options.maxValue) {
                return this.options.maxValue;
            }
            if (this.options.minValue !== undefined && value < this.options.minValue) {
                return this.options.minValue;
            }
            return value;
        }

        setValue(value: number, fireChange?: boolean) {
            super.setValue(value, fireChange);

            if (this._valueLabel) {
                this.updateValueLabel();
            }
        }

        appendValueLabel() {
            this._valueLabel = this.addRightAddon(document.createElement('div'));
            this._valueLabel.style.fontSize = '12px';
            this._valueLabel.style.marginLeft = '10px';
            this._valueLabel.style.color = '#777';
            this._valueLabel.style.width = '60px';
            this.updateValueLabel();
        }

        updateValueLabel() {
            this._valueLabel.innerHTML = this.getValue().toFixed(this.options.decimalCount ?? 0) + (this.options.unit ? ' ' + this.options.unit : '')
        }

    }


    export interface RangeOptions extends InputOptions {


        hasValueLabel?: boolean;

        unit?: string;

        maxValue?: number;

        minValue?: number;

        step?: number;

    }

}