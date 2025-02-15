namespace NextAdmin.UI {


    export class NavigationTopBar extends Control {

        options: NavigationTopBarOptions;

        container?: FlexLayout;

        logoImage?: HTMLImageElement;

        logoLink: HTMLAnchorElement;

        leftToolbar: Toolbar;

        rightToolbar: Toolbar;

        stretchArea: HTMLDivElement;

        pageLinks = new Dictionary<NavigationLink>();

        public static style = `

        .next-admin-top-bar{
            width:100%;
            height:50px;
            z-index:100;

            .top-bar-logo-link{
                height:100%;
                text-decoration:none;
                font-size:30px;
                font-weight:bold;
            }
            
            .next-admin-top-bar-center-container{
                position:relative;
                left:50%;
                height:100%;
                transform:perspective(1px) translateX(-50%);
                padding-left:5px;
                padding-right:5px;
            }
            .next-admin-top-bar-link{


            }
        }
        .next-admin-top-bar-white{
            background-color:#fff;
            box-shadow:0px 0px 2px rgba(0,0,0,0.25);
        }
        .next-admin-top-bar-glass{
            .next-admin-top-bar-center-container{
                padding-top:10px;
                padding-bottom:10px;
                border-bottom:1px solid rgba(255,255,255,0.1)
            }
        }

        .next-admin-top-bar-glass.scroll {
            background-color:` + DefaultStyle.BlueTwo + `;
            box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            .next-admin-top-bar-center-container{
                padding-top:0px;
                padding-bottom:0px;
                border-bottom:0px;
            }
        }

        `;

        constructor(options?: NavigationTopBarOptions) {
            super('div', {
                isFixed: true,
                style: NavigationTopBarStyle.white,
                maxContainerWidth: FrontDefaultStyle.PageContentMaxWidth,
                ...options
            } as NavigationTopBarOptions);
            Style.append('NextAdmin.UI.Topbar', NavigationTopBar.style);
            this.element.classList.add('next-admin-top-bar');
            if (this.options.isFixed) {
                this.element.style.position = 'fixed';
            }

            this.container = this.element.appendControl(new NextAdmin.UI.FlexLayout({ direction: NextAdmin.UI.FlexLayoutDirection.horizontal }), (container) => {
                container.element.classList.add('next-admin-top-bar-center-container');
                container.element.style.maxWidth = this.options.maxContainerWidth;

                this.logoLink = container.appendHTML('a', (logoLink) => {
                    logoLink.classList.add('top-bar-logo-link');
                    logoLink.centerContentVertically();
                    if (this.options.textLogoHtmlContent) {
                        logoLink.innerHTML = this.options.textLogoHtmlContent;
                    }
                    if (this.options?.navigationController?.options?.defaultPage) {
                        logoLink.href = this.options.navigationController.options.defaultPage;
                    }
                    if (this.options.imageLogoUrl) {
                        this.logoImage = logoLink.appendHTML('img', (logoImage) => {
                            logoImage.style.marginRight = '20px';
                            logoImage.src = this.options.imageLogoUrl;
                            logoImage.style.height = '100%';
                        });
                    }
                });
                this.leftToolbar = container.appendControl(new Toolbar());
                this.stretchArea = container.appendHTMLStretch('div');
                this.rightToolbar = container.appendControl(new Toolbar());
            });

            if (this.options.navigationController) {
                this.options.navigationController.onPageChanged.subscribe((sender, page) => {
                    for (let keyValue of this.pageLinks.getKeysValues()) {
                        keyValue.value.setActive(keyValue.key == page.options.name);
                    }
                });
            }
            this.setStyle(this.options.style);
        }

        setStyle(style: NavigationTopBarStyle) {

            switch (style) {
                default:
                case NavigationTopBarStyle.white:
                    this.element.classList.add('next-admin-top-bar-white');
                    break;
                case NavigationTopBarStyle.noBackgroundStickyDarkBlue:
                    this.element.classList.add('next-admin-top-bar-glass');
                    window.addEventListener('scroll', (ev) => {
                        if (window.scrollY > 50) {
                            if (!this.element.classList.contains('scroll')) {
                                this.element.classList.add('scroll');
                            }
                        }
                        else {
                            this.element.classList.remove('scroll');
                        }
                    });
                    break;
            }

        }

        addLeftNavigationLink(url: string, label: string, style?: LinkStyle): NavigationLink {
            return this.leftToolbar.appendControl(this.addNavigationLink(url, label, style));
        }

        addRightNavigationLink(url: string, label: string, style?: LinkStyle): NavigationLink {
            return this.rightToolbar.appendControl(this.addNavigationLink(url, label, style));
        }

        private addNavigationLink(url: string, label: string, style?: LinkStyle): NavigationLink {
            let link = new NavigationLink({
                text: label,
                href: '/' + url,
                style: style ?? this.getDefaultLinkStyle()
            });
            link.element.classList.add('next-admin-top-bar-link');
            this.pageLinks.add(url, link);
            return link;
        }

        appendRightLink(text: string, action?: () => void, style?: LinkStyle): NavigationLink {
            return this.rightToolbar.appendControl(new NavigationLink({
                text: text,
                action: action,
                style: style ?? this.getDefaultLinkStyle()
            }));
        }

        public getDefaultLinkStyle(): LinkStyle {
            switch (this.options.style) {
                default:
                case NavigationTopBarStyle.white:
                    return LinkStyle.blue;
                case NavigationTopBarStyle.noBackgroundStickyDarkBlue:
                    return LinkStyle.white;

            }

        }

    }

    export class NavigationLink extends Link {

        public static style = `

        .next-admin-navigation-link{
            font-size:16px;
            margin-left:10px;
            margin-right:10px;
        }

        .next-admin-navigation-link-active.dark{
            color:` + FrontDefaultStyle.PrimaryColor + `;
        }

        .next-admin-navigation-link-active.blue{
            color:` + DefaultStyle.BlueTwo + `;
        }

        .next-admin-navigation-link-active.white{
            color:#fff;
            font-weight:600;
        }

        `;


        constructor(options: LinkOptions) {
            super(options);
            Style.append('NextAdmin.UI.NavigationLink', NavigationLink.style);
            this.element.classList.add('next-admin-navigation-link');
        }

        setActive(value = true) {
            if (value && !this.element.classList.contains('next-admin-navigation-link-active')) {
                this.element.classList.add('next-admin-navigation-link-active');
            }
            else if (!value && this.element.classList.contains('next-admin-navigation-link-active')) {
                this.element.classList.remove('next-admin-navigation-link-active');
            }
        }

    }




    export interface NavigationTopBarOptions extends ControlOptions {

        isFixed?: boolean;

        maxContainerWidth?: string;

        imageLogoUrl?: string;

        textLogoHtmlContent?: string;

        navigationController?: NavigationController;

        style?: NavigationTopBarStyle;

    }


    export enum NavigationTopBarStyle {
        white,
        noBackgroundStickyDarkBlue,
    }

}