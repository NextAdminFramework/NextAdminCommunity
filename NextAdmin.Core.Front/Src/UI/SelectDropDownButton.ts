namespace NextAdmin.UI {

    export class SelectDropDownButton extends FormControl {

        options: SelectDropDownButtonOptions;

        dropDownButton: DropDownButton;

        public constructor(options?: SelectDropDownButtonOptions) {
            super('div', {
                autoFill: true,
                style: ButtonStyle.default,
                ...options
            } as SelectDropDownButtonOptions);

            this.dropDownButton = this.element.appendControl(new DropDownButton({ text: this.options.label, style: this.options.style }), (dropDownButton) => {
                dropDownButton.dropDown.onOpen.subscribe((dropDown) => {
                    let value = this.getValue();
                    for (let button of dropDown.getItems() as Array<Button>) {
                        if (button['_value'] == value) {
                            button.element.style.color = DefaultStyle.BlueOne;
                        }
                        else {
                            button.element.style.color = 'unset';
                        }
                    }
                });
            });
            if (this.options.items) {
                this.setItems(this.options.items);
            }
            if (this.options.label) {
                this.setLabel(this.options.label);
            }
        }

        getLabel(): string {
            return this._label;
        }

        private _label: string;
        setLabel(label: string) {
            this._label = label;
            let valueLabel = this.getValueLabel(this.getValue());
            if (valueLabel) {
                this.dropDownButton.setText(this._label + ' : ' + valueLabel);
            }
            else {
                this.dropDownButton.setText(this._label);
            }
        }

        getValueLabel(value?: any): string {
            return this.getItemButton(value)?.getText();
        }

        getValue(): any {
            return this._value;
        }

        private _value?: any;
        setValue(value: any, fireChange?: boolean) {
            let previousValue = this._value;
            this._value = value;
            this.setLabel(this.getLabel());
            if (fireChange) {
                this.onValueChanged.dispatch(this, {
                    previousValue: previousValue,
                    value: this.getValue()
                });
            }
        }

        setItems(selectItems: Array<SelectItem>): Array<Button> {
            this.clearItems();
            return this.addItems(selectItems);
        }

        addItems(selectItems: Array<SelectItem>): Array<Button> {
            let buttons = [];
            for (let item of selectItems) {
                buttons.add(this.addItem(item));
            }
            return buttons;
        }

        addItem(selectItem: SelectItem): Button {
            let button = this.dropDownButton.addItem({
                text: selectItem.label,
                action: () => {
                    this.setValue(selectItem.value, true);
                }
            });
            if (this.options.onAddButton) {
                this.options.onAddButton(this, {
                    button: button,
                    item: selectItem
                });
            }
            button['_value'] = selectItem.value;
            return button;
        }

        removeItem(value?: any) {
            let button = this.getItemButton(value);
            if (button?.element?.parentElement) {
                button?.element?.parentElement.remove();
            }
        }

        getItemButton(value?: any): Button {
            return this.dropDownButton.dropDown.getItems().firstOrDefault(a => a['_value'] == value) as any;
        }

        clearItems() {
            this.dropDownButton.clearItems();
        }

        clearAll() {
            this.clearItems();
            this.setValue(null);
        }

        setPropertyInfo(ropertyInfo?: NextAdmin.Business.DataPropertyInfo) {
            super.setPropertyInfo(ropertyInfo);
            if (this.options.autoFill && ropertyInfo?.values?.length) {
                this.setItems(ropertyInfo.values);
            }
        }

    }

    export interface AddButtonArgs {

        button: Button;

        item?: SelectItem;

    }


    export interface SelectDropDownButtonOptions extends FormControlOptions {

        label?: string;

        value?: any;

        items?: Array<SelectItem>;

        style?: ButtonStyle;

        autoFill?: boolean;

        onAddButton?: (sender: SelectDropDownButton, args: AddButtonArgs) => void;

    }

}