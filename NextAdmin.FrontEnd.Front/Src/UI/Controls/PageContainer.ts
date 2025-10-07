namespace NextAdmin.UI {


    export class PageContainer extends NextAdmin.UI.Control {

        element: HTMLDivElement;

        options: PageContaineOptions;

        public static style = `

        .next-admin-page-container{
            margin: 0 auto;
        }
        .next-admin-page-container.padding{
            padding:20px;
            @media (max-width: 1024px) {
                padding:16px;
            }
            @media (max-width: 768px) {
                padding:8px;
            }
            @media (max-width: 512px) {
                padding:4px;
            }
        }

        `;

        constructor(options?: PageContaineOptions) {
            super('div', {
                hasPadding: true,
                maxWidth: FrontDefaultStyle.PageContentMaxWidth,
                ...options
            } as PageContaineOptions);

            Style.append('NextAdmin.UI.PageContainer', PageContainer.style);
            this.element.classList.add('next-admin-page-container');

            if (this.options?.hasPadding) {
                this.element.classList.add('padding');
            }
            if (this.options?.maxWidth) {
                this.element.style.maxWidth = this.options.maxWidth;
            }
            if (this.options?.minHeight) {
                this.element.style.minHeight = this.options.minHeight;
            }

        }

    }
    export interface PageContaineOptions extends NextAdmin.UI.ControlOptions {

        hasPadding?: boolean;

        maxWidth?: string;

        minHeight?: string;

    }

}