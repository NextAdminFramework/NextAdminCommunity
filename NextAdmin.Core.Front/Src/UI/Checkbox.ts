/// <reference path="Input.ts"/>

namespace NextAdmin.UI {

    export class Checkbox extends Input {

        constructor(options?: InputOptions) {
            super({
                inputType: NextAdmin.UI.InputType.checkbox,
                ...options
            });
        }

        getValue(): boolean {
            return this.input.checked;
        }

        isChecked() {
            return this.input.checked;
        }
    }

}