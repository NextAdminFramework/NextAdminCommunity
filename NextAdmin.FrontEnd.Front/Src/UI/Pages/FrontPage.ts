namespace NextAdmin.UI {

    export class FrontPage extends UI.Page {

        options: FrontPageOptions;

        public static style = `

        .next-admin-front-page {
            width: 100%;
            min-height:100vh;
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


        appendContainer(options?: PageSectionOptions, configAction?: (container: HTMLDivElement) => void): PageSection {
            return this.appendSection(options, (section) => {
                if (configAction) {
                    configAction(section.body);
                }
            });
        }


        appendSection(options?: PageSectionOptions, configAction?: (section: PageSection) => void): PageSection {
            return this.element.appendControl(new PageSection(options), configAction);
        }

    }




    export interface FrontPageOptions extends PageOptions {

        navigateFromAnimation?: string;

        navigateFromAnimationSpeed?: NextAdmin.AnimationSpeed;

        navigateToAnimation?: string;

        navigateToAnimationSpeed?: NextAdmin.AnimationSpeed;

    }




}