/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class FlexLayout extends Control {

        public static style = `

        .next-admin-flex-layout{
            width:100%;
            height:100%;
            display:flex;
        }

        `;

        options: FlexLayoutOptions;

        constructor(options?: FlexLayoutOptions) {
            super('div', {
                direction: FlexLayoutDirection.vertical,
                ...options
            } as FlexLayoutOptions);

            NextAdmin.Style.append('NextAdmin.UI.FlexLayout', FlexLayout.style);
            this.element.classList.add('next-admin-flex-layout');
            this.setDirection(this.options.direction);
        }

        public setDirection(direction: FlexLayoutDirection) {
            switch (direction) {
                default:
                case FlexLayoutDirection.vertical:
                    this.element.style.flexDirection = 'column';
                    break;
                case FlexLayoutDirection.horizontal:
                    this.element.style.flexDirection = 'row';
                    break;
            }
        }

        public appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            if (elementOrControl instanceof Control) {
                this.element.appendControl(elementOrControl);
            }
            else {
                this.element.append(elementOrControl);
            }
            if (setControlPropertiesAction) {
                setControlPropertiesAction(elementOrControl);
            }
            return elementOrControl;
        }

        public appendControlStretch<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            if (elementOrControl instanceof Control) {
                this.element.appendControl(elementOrControl);
                elementOrControl.element.style.flexGrow = '1';
            }
            else {
                this.element.append(elementOrControl);
                elementOrControl.style.flexGrow = '1';
            }
            if (setControlPropertiesAction) {
                setControlPropertiesAction(elementOrControl);
            }
            return elementOrControl;
        }

        public appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.appendControl(document.createElement(html), setControlPropertiesAction) as any;
        }

        public appendHTMLStretch<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.appendControlStretch(document.createElement(html), setControlPropertiesAction) as any;
        }

        public prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            if (elementOrControl instanceof Control) {
                this.element.prependControl(elementOrControl);
            }
            else {
                this.element.prepend(elementOrControl);
            }
            if (setControlPropertiesAction) {
                setControlPropertiesAction(elementOrControl);
            }
            return elementOrControl;
        }

        public prependControlStretch<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            if (elementOrControl instanceof Control) {
                this.element.prependControl(elementOrControl);
                elementOrControl.element.style.flexGrow = '1';
            }
            else {
                this.element.prepend(elementOrControl);
                elementOrControl.style.flexGrow = '1';
            }
            if (setControlPropertiesAction) {
                setControlPropertiesAction(elementOrControl);
            }
            return elementOrControl;
        }


        public prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.prependControl(document.createElement(html), setControlPropertiesAction) as any;
        }

        public prependHTMLStretch<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.prependControlStretch(document.createElement(html), setControlPropertiesAction) as any;
        }

    }

    export interface FlexLayoutOptions extends ControlOptions {

        direction?: FlexLayoutDirection;

    }

    export enum FlexLayoutDirection {
        vertical,
        horizontal
    }

    export class HorizontalFlexLayout extends FlexLayout {
        constructor(options?: FlexLayoutOptions) {
            super({
                direction: FlexLayoutDirection.horizontal,
                ...options
            });
        }
    }
    export class VerticalFlexLayout extends FlexLayout {
        constructor(options?: FlexLayoutOptions) {
            super({
                direction: FlexLayoutDirection.vertical,
                ...options
            });
        }
    }

}