
/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class ResisingContainer extends Control {


        container: HTMLDivElement;

        onSizeChanged = new NextAdmin.EventHandler<ResisingContainer, DOMRect>();

        options: ResisingContainerOptions;


        //exemple : (16,9), will produce a div that allway stretch with conbtainer and respect 16/9 ratio
        constructor(options?: ResisingContainerOptions) {
            super('div', options);

            this.element.style.width = '100%';
            this.element.style.height = '100%';
            this.element.style.position = 'relative';
            this.element.style.overflow = 'hidden';

            let iframe = document.createElement('iframe');
            this.element.appendChild(iframe);

            this.container = document.createElement('div');
            this.container.style.position = 'absolute';
            this.container.style.left = '0px';
            this.container.style.top = '0px';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.element.appendChild(this.container);

            iframe.style.position = 'relative';
            iframe.frameBorder = '0'
            iframe.style.width = '100%';
            iframe.style.height = '100%';


            let onsizeChanged = () => {
                let bounding = iframe.getBoundingClientRect();
                this.onSizeChanged.dispatch(this, bounding);
                if (this.options.onSizeChanged) {
                    this.options.onSizeChanged(this, bounding);
                }
            };

            iframe.addEventListener('load', () => {
                onsizeChanged();
                iframe.contentWindow.addEventListener('resize', (ev) => {
                    onsizeChanged();
                });
            });
        }

    }

    export interface ResisingContainerOptions extends ControlOptions{

        onSizeChanged?: (sender: ResisingContainer, args: DOMRect) => void;

    }

}