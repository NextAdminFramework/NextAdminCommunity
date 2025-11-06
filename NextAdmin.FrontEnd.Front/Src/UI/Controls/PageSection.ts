namespace NextAdmin.UI {


    export class PageSection extends NextAdmin.UI.Container {

        element: HTMLDivElement;

        options: PageSectionOptions;

        public static style = `


        .next-admin-page-section-body.padding{
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

        constructor(options?: PageSectionOptions) {
            super({
                hasPadding: true,
                maxWidth: FrontDefaultStyle.PageContentMaxWidth,
                ...options
            } as PageSectionOptions);

            Style.append('NextAdmin.UI.PageSection', PageSection.style);
            this.body.classList.add('next-admin-page-section-body');

            if (this.options?.hasPadding) {
                this.body.classList.add('padding');
            }
            if (this.options?.minHeight) {
                this.body.style.minHeight = this.options.minHeight;
            }
        }

    }
    export interface PageSectionOptions extends NextAdmin.UI.ContainerOptions {

        hasPadding?: boolean;

        minHeight?: string;

    }

}