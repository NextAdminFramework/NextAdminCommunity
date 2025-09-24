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
        .next-admin-front-page-container.padding{
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

        constructor(options?: FrontPageOptions) {
            super({
                navigateToAnimation: 'fadeIn',
                navigateToAnimationSpeed: NextAdmin.AnimationSpeed.faster,
                navigateFromAnimation: null,
                navigateFromAnimationSpeed: NextAdmin.AnimationSpeed.faster,
                ...options
            } as FrontPageOptions);
            Style.append('NextAdmin.UI.FrontPage', FrontPage.style);
            this.element.classList.add('next-admin-front-page');
        }

        async navigateTo(args: NextAdmin.UI.NavigateToArgs) {
            await super.navigateTo(args);
            if (!NextAdmin.String.isNullOrEmpty(this.options.navigateToAnimation)) {
                this.element.anim(this.options.navigateToAnimation, { animationSpeed: this.options.navigateToAnimationSpeed });
            }

        }

        public async navigateFrom(args: NextAdmin.UI.NavigateFromArgs) {
            await super.navigateFrom(args);
            if (!NextAdmin.String.isNullOrEmpty(this.options.navigateFromAnimation)) {
                this.element.anim(this.options.navigateFromAnimation, { animationSpeed: this.options.navigateFromAnimationSpeed })
                await NextAdmin.Timer.sleep(250);
            }
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
                container.classList.add('padding');
            }
            if (options?.maxWidth) {
                container.style.maxWidth = options.maxWidth;
            }
            if (options?.minHeight) {
                container.style.minHeight = options.minHeight;
            }
            return container;
        }

    }


    export interface FrontPageOptions extends PageOptions {

        navigateFromAnimation?: string;

        navigateFromAnimationSpeed?: NextAdmin.AnimationSpeed;

        navigateToAnimation?: string;

        navigateToAnimationSpeed?: NextAdmin.AnimationSpeed;

    }


    export interface FrontPageContaineOptions {

        hasPadding?: boolean;

        maxWidth?: string;

        minHeight?: string;


    }


}