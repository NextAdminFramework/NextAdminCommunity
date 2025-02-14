/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class AspectRatioContainer extends NextAdmin.UI.Control {

        options: AspectRatioLayoutOptions;

        imageRatio: HTMLImageElement;

        body: HTMLDivElement;


        constructor(options: AspectRatioLayoutOptions) {
            super('div', options);
            this.element.style.position = 'relative';
            this.imageRatio = this.element.appendHTML('img', (img) => {
                img.src = NextAdmin.Image.createBase64EmptyImage(this.options.width, this.options.height);
                img.style.width = '100%';
            });
            this.element.appendHTML('div', (absoluteContainer) => {
                absoluteContainer.style.position = 'absolute';
                absoluteContainer.style.left = '0px';
                absoluteContainer.style.top = '0px';
                absoluteContainer.style.width = '100%';
                absoluteContainer.style.height = '100%';

                this.body = absoluteContainer.appendHTML('div', (body) => {
                    body.style.width = '100%';
                    body.style.height = '100%';

                });
            });
        }
    }


    export interface AspectRatioLayoutOptions extends NextAdmin.UI.ControlOptions {

        width?: number;

        height?: number;


    }

}