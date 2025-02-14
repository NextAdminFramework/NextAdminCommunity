
namespace NextAdmin.UI {

    export class Sidebar extends UI.Control {

        public static sideBarJS = 'function slideToggle(t,e,o){0===t.clientHeight?j(t,e,o,!0):j(t,e,o)}function slideUp(t,e,o){j(t,e,o)}function slideDown(t,e,o){j(t,e,o,!0)}function j(t,e,o,i){void 0===e&&(e=400),void 0===i&&(i=!1),t.style.overflow="hidden",i&&(t.style.display="block");var p,l=window.getComputedStyle(t),n=parseFloat(l.getPropertyValue("height")),a=parseFloat(l.getPropertyValue("padding-top")),s=parseFloat(l.getPropertyValue("padding-bottom")),r=parseFloat(l.getPropertyValue("margin-top")),d=parseFloat(l.getPropertyValue("margin-bottom")),g=n/e,y=a/e,m=s/e,u=r/e,h=d/e;window.requestAnimationFrame(function l(x){void 0===p&&(p=x);var f=x-p;i?(t.style.height=g*f+"px",t.style.paddingTop=y*f+"px",t.style.paddingBottom=m*f+"px",t.style.marginTop=u*f+"px",t.style.marginBottom=h*f+"px"):(t.style.height=n-g*f+"px",t.style.paddingTop=a-y*f+"px",t.style.paddingBottom=s-m*f+"px",t.style.marginTop=r-u*f+"px",t.style.marginBottom=d-h*f+"px"),f>=e?(t.style.height="",t.style.paddingTop="",t.style.paddingBottom="",t.style.marginTop="",t.style.marginBottom="",t.style.overflow="",i||(t.style.display="none"),"function"==typeof o&&o()):window.requestAnimationFrame(l)})}';

        public static sideBarJSLoaded = false;

        public header: HTMLDivElement;

        public body: HTMLDivElement;

        public options: SidebarOptions;

        public pagesButtonsDictionary = new Dictionary<SidebarPageButton>();

        private _pageChangedAction;

        public static style = `
        .sidebar-wrapper {
            background-color:#fff;
            bottom:0;height:100vh;
            overflow-y:auto;position:fixed;
            top:0;transition:left .5s ease-out;
            width:250px;
            z-index:10;
            box-shadow:2px 0px 2px #ccc;
        }

        .sidebar-wrapper .sidebar-header {
            padding:1rem 1rem .8rem
        }

        .sidebar-wrapper .sidebar-toggler.x {
            display:none;
            position:absolute;
            right:0;top:.5rem;
        }

        .sidebar-wrapper .menu {
            margin-top:10px;
            padding:0 20px;
        }

        .sidebar-wrapper .menu .sidebar-title {
            color:#25396f;
            list-style:none;
            margin:1.5rem 0 .8rem;padding:0 .8rem
        }

        .sidebar-wrapper .menu .sidebar-link {
            font-size:14px;
            align-items:center;
            border-radius:.5rem;
            color:#25396f;
            font-weight:bold;
            display:block;
            padding:.5rem .5rem;
            text-decoration:none;
            transition:all .5s;
        }

        .sidebar-wrapper .menu .sidebar-link i,.sidebar-wrapper .menu .sidebar-link svg {
            color:#7c8db5;
        }

        .sidebar-wrapper .menu .sidebar-link .sidebar-link-text {
            margin-left:.8rem;
        }

        .sidebar-wrapper .menu .sidebar-link:hover {
            background-color:#f0f1f5;
        }

        .sidebar-wrapper .menu .sidebar-item {
            list-style:none;
            margin-top:.5rem;
            position:relative
        }

        .sidebar-wrapper .menu .sidebar-item.active>.sidebar-link {
            background-color:#0069b6
        }

        .sidebar-wrapper .menu .sidebar-item.active>.sidebar-link .sidebar-link-text {
            color:#fff;
        }

        .sidebar-wrapper .menu .sidebar-item.active>.sidebar-link i,.sidebar-wrapper .menu .sidebar-item.active>.sidebar-link svg {
            fill:#fff;color:#fff
        }

        .sidebar-wrapper .menu .submenu {
            display:none;
            list-style:none;
            overflow:hidden;
            transition:max-height 2s cubic-bezier(0, .55, .45, 1);
            padding-left:1.5rem
        }

        .sidebar-wrapper .menu .caret{
            float:right;
        }

        .sidebar-wrapper .menu .submenu.active {
            display:block;
            max-height:999px
        }

        .sidebar-wrapper .menu .submenu .submenu-item.active>a {
            color:#435ebe;
        }

        .sidebar-wrapper .menu .submenu .submenu-item a {
            color:#25396f;
            display:block;
            padding:.5rem .5rem;
            transition:all .3s
        }

        .sidebar-wrapper .menu .submenu .submenu-item a:hover {
            margin-left:.3rem
        }

        .sidebar-wrapper .sidebar-item.has-sub .submenu-item .sidebar-link:after {
            content:'';
        }

        .side-bar-dark-blue-one {

            background-color:#263544 !important;

            .sidebar-title{
                color:#e0e0e0 !important;
            }
            .sidebar-link{
                color:#e0e0e0 !important;
            }
            .sidebar-link:hover {
                color:#263544 !important;
            }
            .menu .sidebar-item.active>.sidebar-link{
                background-color:#1d2431 !important;
            }
            .sidebar-link
            {
                color:#007FFF;
            }
            .menu .submenu .submenu-item.active>a{
                color:#7c8db5 !important;
            }
        }

        .side-bar-dark-blue-two {

            background-color:#12101d !important;

            .sidebar-title{
                color:#e0e0e0 !important;
            }
            .sidebar-link{
                padding:12px !important;
                color:#e0e0e0 !important;
            }
            .sidebar-link:hover {
                color:#263544 !important;
            }
            .sidebar-link
            {
                color:#d6d2d7 !important;
            }
            .sidebar-link i {
                color:#d6d2d7 !important;
            }
            .menu .sidebar-item.active>.sidebar-link{
                background-color:#fdfffe !important;
            }
            .menu .submenu-item.active .sidebar-link{
                background-color:#fdfffe !important;
            }
            .menu .sidebar-link:hover {
                background-color:#fdfffe !important;
            }

            .sidebar-item.active>.sidebar-link .sidebar-link-text {
                color:#3f424a !important;
            }
            .sidebar-item.active>.sidebar-link i {
                color:#3f424a !important;
            }
            .menu .submenu-item.active .sidebar-link .sidebar-link-text{
                color:#3f424a !important;
            }
            .menu .submenu-item.active .sidebar-link i{
                color:#3f424a !important;
            }
            .submenu{
                padding-left:0px !important;
            }
            .submenu .submenu-item{
                margin-top:0.5rem;
            }

        }

        `;

        constructor(options?: SidebarOptions) {
            super('div', options);

            this.setStyle(this.options.style);

            if (this.options.navigationController != null) {

                this._pageChangedAction = this.options.navigationController.onNavigate.subscribe((sender, args) => {
                    this.updateActivePage(args.nextPage?.options?.name, args.previousPage?.options?.name);
                });
            }
            Style.append("SideBar", Sidebar.style);
            if (!Sidebar.sideBarJSLoaded) {
                let script = document.createElement('script');
                script.textContent = Sidebar.sideBarJS;
                document.head.appendChild(script);
                Sidebar.sideBarJSLoaded = true;
            }
            this.element.classList.add('sidebar-wrapper');
            this.header = this.element.appendHTML('div', (header) => {
                header.classList.add('sidebar-header');
            });

            this.element.appendHTML('div', (sideBarMenu) => {
                sideBarMenu.classList.add('sidebar-menu');
                this.body = sideBarMenu.appendHTML('div', (body) => {
                    body.classList.add('menu');
                });
            });
            this.element.appendPerfectScrollbar();
        }

        public updateActivePage(activePageName: string, previousPageName?: string) {
            if (previousPageName) {
                let previousPageButton = this.pagesButtonsDictionary.get(previousPageName);
                if (previousPageButton != null) {
                    previousPageButton.desactivate();
                }
            }
            if (activePageName) {
                let newPageButton = this.pagesButtonsDictionary.get(activePageName);
                if (newPageButton != null) {
                    newPageButton.activate();
                }
            }
        }


        public setStyle(style?: SideBarStyle) {
            switch (style) {
                case SideBarStyle.darkBlueOne:
                    this.element.classList.add('side-bar-dark-blue-one');
                    break;
                case SideBarStyle.darkBlueTwo:
                    this.element.classList.add('side-bar-dark-blue-two');
                    break;
                default:
                case SideBarStyle.default:
                    break;
            }

        }

        public addPageButton(options: SidebarPageButtonOptions): SidebarPageButton {
            return this.body.appendControl(new SidebarPageButton(this, options));
        }

        public dispose() {
            super.dispose();
            if (this._pageChangedAction) {
                this.options.navigationController.onNavigate.unsubscribe(this._pageChangedAction);
            }
        }

    }

    export interface SidebarOptions extends ControlOptions {

        navigationController?: NextAdmin.NavigationController;

        style?: SideBarStyle;

    }


    export class SidebarPageButton extends Control {

        sidebar: Sidebar;

        options: SidebarPageButtonOptions;

        link: HTMLAnchorElement;

        subMenu: HTMLElement;

        caret: HTMLElement;

        constructor(sidebar: Sidebar, options: SidebarPageButtonOptions) {
            super('li', options)
            this.sidebar = sidebar;
            this.options = options;
            this.element.classList.add(this.options.parent ? 'submenu-item' : 'sidebar-item');
            this.link = this.element.appendHTML('a', (a) => {
                a.classList.add('sidebar-link');
                a.href = 'JavaScript:void(0)';
                if (this.options.page != null) {
                    this.element.id = this.options.page.options.name + '_Button';
                    if (sidebar.options.navigationController != null) {
                        a.addEventListener('click', () => {
                            sidebar.options.navigationController.navigateTo(this.options.page.options.name);
                        });
                    }
                    sidebar.pagesButtonsDictionary.add(options.page.options.name, this);
                }
                else if (this.options.action) {
                    this.options.action(this);
                }
                else if (this.options.href) {
                    a.href = this.options.href;
                    sidebar.pagesButtonsDictionary.add(this.options.href, this);
                }
                else if (this.options.pageName) {
                    a.href = this.options.pageName;
                    sidebar.pagesButtonsDictionary.add(this.options.pageName, this);
                }
                if (this.options.parent) {
                    a.style.paddingLeft = '0px';
                    a.style.paddingRight = '0px';
                }
                if (options.icon) {
                    a.appendHTML('span', (icon) => {
                        icon.classList.add('sidebar-link-icon');
                        icon.innerHTML = options.icon;
                    });
                }
                a.appendHTML('span', (text) => {
                    text.classList.add('sidebar-link-text');
                    if (options.fontSize) {
                        text.style.fontSize = options.fontSize;
                    }
                    text.innerHTML = options.text;
                });
            });
        }


        activate() {
            if (!this.element.classList.contains('active')) {
                this.element.classList.add('active');
            }

            document.body.querySelectorAll('.submenu').forEach(otherSubMenu => {
                if (this.options.parent == null || this.options.parent.subMenu != otherSubMenu) {
                    let otherPageButton = (<SidebarPageButton>otherSubMenu['_control']);
                    if (otherPageButton != null) {
                        otherPageButton.closeSubMenu();
                    }
                }
                else if (this.options.parent != null && this.options.parent.subMenu.style.display == '') {
                    this.options.parent.openSubMenu();
                }
            });


        }


        desactivate() {
            this.element.classList.remove('active');
        }




        public addPageButton(options: SidebarPageButtonOptions): SidebarPageButton {
            if (this.subMenu == null) {
                this.element.classList.add('has-sub');

                this.caret = this.link.appendHTML('span', (caret) => {
                    caret.classList.add('caret');
                    caret.innerHTML = Resources.iconCaretDown;
                });

                this.subMenu = this.element.appendHTML('ul', (subMenu) => {
                    subMenu.classList.add('submenu');
                });
                this.subMenu['_control'] = this;

                this.link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleSubMenu();
                });

            }
            options.parent = this;
            return this.subMenu.appendControl(new SidebarPageButton(this.sidebar, options));
        }


        public isSubMenuOpen() {
            return this.subMenu != null && this.subMenu.offsetParent !== null;
        }


        public toggleSubMenu() {
            if (this.subMenu == null) {
                return;
            }
            if (this.isSubMenuOpen()) {
                this.closeSubMenu();
            }
            else {
                this.openSubMenu();
            }

        }


        public openSubMenu() {
            if (this.subMenu == null || this.isSubMenuOpen()) {
                return;
            }
            slideDown(this.subMenu, 300);
            this.caret.innerHTML = Resources.iconCaretLeft;
        }

        public closeSubMenu() {
            if (this.subMenu == null || !this.isSubMenuOpen()) {
                return;
            }
            slideUp(this.subMenu, 300);
            this.caret.innerHTML = Resources.iconCaretDown;
        }
    }

    export interface SidebarPageButtonOptions extends ControlOptions {

        icon?: string;

        fontSize?: string;

        text: string;

        action?: (button?: SidebarPageButton) => void;

        href?: string;

        pageName?: string;

        parent?: SidebarPageButton;

        page?: Page;

    }

    export enum SideBarStyle {
        default,
        darkBlueOne,
        darkBlueTwo
    }





}

declare function slideToggle(sideBarEl: HTMLElement, width?: number);

declare function slideUp(sideBarEl: HTMLElement, width?: number);

declare function slideDown(sideBarEl: HTMLElement, width?: number);
