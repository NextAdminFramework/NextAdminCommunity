namespace NextAdmin.UI {

    export class UserInterfaceHelper {

        public static noSelectStyle = `
        .no-select{
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currentlysupported by Chrome, Edge, Opera and Firefox */
        }
        `;

        public static noScrollbarStyle = `
        .no-scrollbar::-webkit-scrollbar{
            display: none;
        }
        `;


        public static DefaultNumberDecimalCount = 2;

        public getDefaultPropertyDisplayValue(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any): string {
            let displayValue = value == null ? '' : value;
            if (propertyInfo != null) {

                if (value != null && propertyInfo.values != null && propertyInfo.values.length > 0) {
                    if (propertyInfo.type == 'string') {
                        let selectValudes = (<string>value).split(',');
                        displayValue = propertyInfo.values.where(e => selectValudes.contains(e.value.toString())).select(e => e.label).join(', ');
                    }
                    else {
                        let valueItem = propertyInfo.values.firstOrDefault(e => e.value == value);
                        if (valueItem != null) {
                            displayValue = valueItem.label;
                        }
                    }
                }
                else if (!NextAdmin.String.isNullOrEmpty(value) && propertyInfo.type == 'date') {
                    displayValue = new Date(value).toLocaleDateString();
                }
                else if (value && propertyInfo.type == 'number') {
                    let numberValue = Number(value);
                    displayValue = (Number.isInteger(numberValue) ? value + '' : numberValue.toFixed(UserInterfaceHelper.DefaultNumberDecimalCount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }
                else if (value != null && propertyInfo.type == 'boolean') {
                    displayValue = value ? Resources.yes : Resources.no;
                }
            }
            return displayValue;
        }


        public getDefaultPropertyHtmlElement(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any, onReady?: (element: HTMLElement)=>void): HTMLElement {
            let element = document.createElement('span');
            if (propertyInfo?.type == 'number') {
                element.style.cssFloat = 'right';
            }
            element.innerHTML = this.getDefaultPropertyDisplayValue(propertyInfo, value);
            if (onReady) {
                onReady(element);
            }
            return element;
        }

        public getDefaultPropertyHtmlElementAsync(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any): Promise<HTMLElement> {
            return new Promise<HTMLElement>((resolve) => {
                this.getDefaultPropertyHtmlElement(propertyInfo, value, (element) => {
                    resolve(element);
                });
            });
        }


        public getDefaultPropertyFormControl(propertyInfo: NextAdmin.Business.DataPropertyInfo, inlineControl?: boolean): FormControl {
            if (!NextAdmin.String.isNullOrEmpty(propertyInfo.foreignDataName) && !propertyInfo.isPrimaryKey) {//lookup
                return new NextAdmin.UI.DataSelect({ inlineGrid: inlineControl });
            }
            else if (propertyInfo.values != null && propertyInfo.values.length > 0) {
                if (propertyInfo.type == 'string') {
                    return new NextAdmin.UI.MultiInputSelect({ inlineGrid: inlineControl });
                }
                else {
                    return new NextAdmin.UI.Select({ inlineGrid: inlineControl });
                }
            }
            else {
                switch (propertyInfo.type) {
                    default:
                    case 'string':
                        return new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.text, inlineGrid: inlineControl });
                    case 'number':
                        return new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.number, inlineGrid: inlineControl });
                    case 'date':
                        return new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.date, inlineGrid: inlineControl });
                    case 'boolean':
                        return new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.checkbox, inlineGrid: inlineControl });
                }
            }
        }

    }

    export var Helper = new UserInterfaceHelper();

}