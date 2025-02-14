/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    /*
        DEPRECATED - Use FlexLayout instead
    */
    export class StretchLayout extends Control {


        public fixedContainer: HTMLDivElement;

        public stretchContainer: HTMLDivElement;

        public options: StretchLayoutOptions;

        public static style = '';

        public static onCreated = new EventHandler<StretchLayout, StretchLayoutOptions>();

        public constructor(options?: StretchLayoutOptions) {
            super('div', { stretch: true, ...options } as StretchLayoutOptions);


            this.element.style.display = this.options.stretch ? 'flex' : 'block';
            this.element.style.width = '100%';
            this.element.style.height = '100%';

            switch (this.options.type) {
                default:
                case StretchLayoutType.stretchBottom:
                    this.element.style.flexDirection = 'column';

                    this.fixedContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer.style.flexGrow = '1';

                    break;
                case StretchLayoutType.stretchTop:
                    this.element.style.flexDirection = 'column';

                    this.stretchContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer.style.flexGrow = '1';
                    this.fixedContainer = this.element.appendHTML('div') as HTMLDivElement;

                    break;
                case StretchLayoutType.stretchLeft:
                    this.element.style.flexDirection = 'row';
                    this.stretchContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer.style.flexGrow = '1';
                    this.fixedContainer = this.element.appendHTML('div') as HTMLDivElement;

                    break;
                case StretchLayoutType.stretchRight:
                    this.element.style.flexDirection = 'row';

                    this.fixedContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer = this.element.appendHTML('div') as HTMLDivElement;
                    this.stretchContainer.style.flexGrow = '1';
                    break;
            }

            if (this.options.fixedItems != null) {
                for (let control of this.options.fixedItems) {
                    if (control instanceof HTMLElement) {
                        this.stretchContainer.appendChild(control);
                    }
                    if (control instanceof Control) {
                        this.stretchContainer.appendControl(control);
                    }
                }
            }
            if (this.options.stretchItem != null) {
                if (this.options.stretchItem instanceof HTMLElement) {
                    this.stretchContainer.appendChild(this.options.stretchItem);
                }
                if (this.options.stretchItem instanceof Control) {
                    this.stretchContainer.appendControl(this.options.stretchItem);
                }
            }
            StretchLayout.onCreated.dispatch(this, this.options);
        }





    }



    export interface StretchLayoutOptions extends ControlOptions {

        type?: StretchLayoutType;

        fixedItems?: Array<HTMLElement | Control>;

        stretchItem?: HTMLElement | Control;

        stretch?: boolean;

    }

    export enum StretchLayoutType {
        stretchLeft,
        stretchRight,
        stretchTop,
        stretchBottom,
    }

}

