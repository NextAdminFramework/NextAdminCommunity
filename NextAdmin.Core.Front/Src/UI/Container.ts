
namespace NextAdmin.UI {

    export class Container extends Control {

        options: ContainerOptions;

        body?: HTMLDivElement;

        constructor(options?: ContainerOptions) {
            super('div', {
                maxWidth: '1280px',
                ...options
            } as ContainerOptions);

            this.body = this.element.appendHTML('div', (body) => {
                body.style.margin = '0 auto';
                body.style.maxWidth = this.options.maxWidth;
            });
        }
    }


    export interface ContainerOptions extends ControlOptions {

        maxWidth?: string;

    }

}