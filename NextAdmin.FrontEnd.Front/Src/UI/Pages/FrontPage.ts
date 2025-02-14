namespace NextAdmin.UI {

    export class FrontPage extends UI.Page {


        options: FrontPageOptions;


        public static style = `

        .next-admin-front-page {
            width: 100%;
            min-height:100vh;
        }

        .next-admin-front-page-container{
            margin: 0 auto;
        }

        `;


        constructor(options?: FrontPageOptions) {
            super(options);
            Style.append('NextAdmin.UI.FrontPage', FrontPage.style);
            this.element.classList.add('next-admin-front-page');
        }

        appendContainer(options?: FrontPageContaineOptions, configAction?: (container: HTMLDivElement) => void): HTMLDivElement {
            options = {
                hasPadding: true,
                maxWidth: FrontDefaultStyle.PageContentMaxWidth,
                ...options
            };
            let container = this.element.appendHTML('div', configAction);
            container.classList.add('next-admin-front-page-container');
            if (options?.hasPadding) {
                container.style.padding = '10px';
            }
            if (options?.maxWidth) {
                container.style.maxWidth = options.maxWidth;
            }
            return container;
        }

    }


    export interface FrontPageOptions extends PageOptions {





    }


    export interface FrontPageContaineOptions {

        hasPadding?: boolean;

        maxWidth?: string;


    }


}