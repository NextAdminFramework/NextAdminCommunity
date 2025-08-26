namespace NextAdmin {

    export class NavigationController {

        private _pages = new Dictionary<UI.Page>();

        private _previousPage: UI.Page;

        private _currentPage: UI.Page;

        public onNavigate = new EventHandler<NavigationController, NavigationArgs>();

        public onAddPage = new EventHandler<NavigationController, UI.Page>();

        public onPageChanged = new EventHandler<NavigationController, NextAdmin.UI.Page>();

        public options: NavigationControllerOptions;

        public pageContainer: HTMLElement;

        constructor(options?: NavigationControllerOptions) {
            this.options = {
                pageContainer: document.body,
                enableSpaLinkNavigation: true,
                ...options
            };
            this.pageContainer = this.options.pageContainer;
            if (NextAdmin.Navigation == null) {
                NextAdmin.Navigation = this;
            }
            window.addEventListener('popstate', () => {
                this.navigateToUrl();
            });
            if (this.options.enableSpaLinkNavigation) {
                document.addEventListener('click', (e) => {

                    let element = e.srcElement as HTMLElement;
                    while (true) {
                        if (element?.tagName === 'A') {
                            break;
                        }
                        element = element.parentElement;
                        if (element == null) {
                            return;
                        }
                    }
                    let linkElement = element as HTMLLinkElement;
                    if (!NextAdmin.String.isNullOrEmpty(linkElement.href)) {
                        if (new URL(linkElement.href).hostname == document.location.hostname && !linkElement.href.contains('#')) {//internalLink
                            let pageName = linkElement.href.split('/').lastOrDefault();
                            let args = null;
                            if (pageName.contains('?')) {
                                let queryString = pageName.split('?');
                                pageName = queryString[0];
                                let queryStringArgs = queryString[1];
                                args = {};
                                for (let queryArgs of queryStringArgs.split('&')) {
                                    args[queryArgs.split('=')[0]] = queryArgs.split('=')[1];
                                }
                            }
                            let page = this._pages.get(pageName);
                            console.log('Try handle spa internal link for page:' + pageName);
                            if (this._pages.get(pageName) != null || this.options.pages.firstOrDefault(a => a.name == pageName) != null) {
                                e.preventDefault();
                                this.navigateTo(pageName, args);
                            }
                            else {
                                console.log('Unable to find page:' + pageName);
                            }
                        }
                    }
                });
            }
        }

        public addPage(page: UI.Page, key?: string) {
            this.onAddPage.dispatch(this, page);
            this._pages.add(key ?? page.options.name, page);
        }


        public getInstantiatedPages(): Array<UI.Page> {
            return this._pages.getValues();
        }

        public async getPage(pageName: string): Promise<UI.Page> {
            if (String.isNullOrEmpty(pageName))
                return null;
            let page = this._pages.get(pageName);
            if (page == null) {
                let pageInfo = this.options.pages.firstOrDefault(a => a.name == pageName);
                if (pageInfo) {
                    let pageContainer = this.pageContainer ?? document.body;
                    if (pageInfo.scriptUrl) {
                        await DependenciesController.load([pageInfo.scriptUrl]);
                    }
                    let pageOptions = { name: pageName, id: pageName, container: pageContainer, pageInfo: pageInfo } as NextAdmin.UI.PageOptions;
                    if (pageInfo.factory) {
                        page = pageInfo.factory(pageOptions);
                    }
                    else if (pageInfo.className) {
                        try {
                            eval("page=new " + pageInfo.className + "(pageOptions)");
                        }
                        catch
                        {
                            console.log('NavigationController.getPage:Unable to instanciate page : ' + pageInfo.name);
                        }
                    }
                    else {
                        page = new NextAdmin.UI.Page(pageOptions);
                    }
                }
                if (page != null) {
                    this.addPage(page, pageName);
                }
            }
            return page;
        }

        public getCurrentPage(): UI.Page {
            return this._currentPage;
        }

        public getCurrentPageName(): string {
            return this._currentPage?.options.name;
        }

        public getPreviousPage(): UI.Page {
            return this._previousPage;
        }

        public getPreviousPageName(): string {
            return this._previousPage?.options.name;
        }


        public async navigateToUrl(url = document.location.href, updateNavigatorState = UpdateNavigatorState.none) {
            let pageInfo = this.getPageInfoFromUrl(url);
            let page = await this.getPage(pageInfo.pageName);
            if (page == null) {//unable to find view, so navigate to default view
                console.log('NavigationController.navigateToUrl:unable to find page:' + pageInfo.pageName + ', so navigate to default page:' + this.options.defaultPage);
                this.navigateTo(this.options.defaultPage, null, updateNavigatorState);
            }
            else {
                console.log('NavigationController.navigateToUrl:navigate to:{' + pageInfo.pageName + '}');
                this.navigateTo(pageInfo.pageName, pageInfo.pageData, updateNavigatorState);
            }
        }

        public getPageInfoFromUrl(url = document.location.href): { pageName?: string, pageData?: any } {
            let urlParts = url.split('/');
            let pageName = null;
            if (urlParts != null && urlParts.length > 0) {
                pageName = urlParts.last();
            }
            else {
                pageName = url;
            }
            let data: any;
            if (pageName.indexOf('?') != -1) {
                let viewNameAndParams = pageName.split('?');
                pageName = viewNameAndParams[0];
                let params = viewNameAndParams[1];
                if (!NextAdmin.String.isNullOrEmpty(params)) {
                    data = NextAdmin.QueryString.parseQuery(params);
                }
            }
            return {
                pageName: pageName,
                pageData: data
            }
        }

        async refresh(reload?: boolean) {
            if (reload) {
                location.reload();
            }
            if (this._currentPage?.options?.name == null) {
                return;
            }
            await this.navigateTo(this._currentPage.options.name, this._currentPage.getData(), UpdateNavigatorState.none, true);
        }

        async navigateBack(): Promise<NextAdmin.UI.Page> {
            return new Promise<NextAdmin.UI.Page>((result) => {
                this.onNavigate.subscribeOnce(() => {
                    result(this.getCurrentPage());
                });
                history.back();
            });
        }

        async navigateBackOrDefault(defaultPageName?: string): Promise<NextAdmin.UI.Page> {
            if (this.getPreviousPage()) {
                return this.navigateBack();
            }
            else {
                if (defaultPageName == null) {
                    defaultPageName = this.options.defaultPage;
                }
                this.navigateTo(defaultPageName, null, UpdateNavigatorState.replaceState);
            }
        }



        async navigateTo(pageName: string, parameters = null, updateNavigatorState = UpdateNavigatorState.pushState, force = false): Promise<NextAdmin.UI.Page> {
            if (!force && this._currentPage != null && this._currentPage.options != null && pageName == this._currentPage.options.name && JSON.stringify(parameters) == JSON.stringify(this._currentPage.parameters)) {
                return;
            }
            if (parameters == null) {
                parameters = {};
            }
            let nextPage = await this.getPage(pageName);
            if (nextPage == null) {
                console.log(pageName + ' not found');
                return null;
            }
            let previousPage = this._currentPage;
            if (previousPage != null) {
                let args = {
                    nextPage: nextPage,
                    nextPageParameters: parameters
                } as UI.NavigateFromArgs;
                await previousPage.navigateFrom(args);
                if (args.cancelNavigation) {
                    return null;
                }
            }
            if (this._currentPage != nextPage) {
                this._previousPage = previousPage;
                this._currentPage = nextPage;
            }

            let navigateArgs = { previousPage: this._previousPage, nextPage: nextPage } as NavigationArgs;
            this.onNavigate.dispatch(this, navigateArgs);
            if (navigateArgs.cancelNavigation) {
                return null;
            }

            let nextPageNavigationArgs = {
                previousPage: previousPage,
                parameters: parameters,
                dependencies: nextPage?.options?.pageInfo?.dependencies,
                contentUrl: nextPage?.options?.pageInfo?.contentUrl
            } as NextAdmin.UI.NavigateToArgs;
            if (nextPageNavigationArgs.contentUrl) {//preload view html content
                await nextPage.loadContent(nextPageNavigationArgs.contentUrl);
            }
            if (previousPage != null) {
                previousPage.endNavigateFrom();
            }
            await nextPage.navigateTo(nextPageNavigationArgs);

            if (updateNavigatorState && window.history && window.history.pushState) {
                let url = this._currentPage.options.name;
                if (!String.isNullOrEmpty(document.location.pathname)) {
                    let currentLocationArrayPath = document.location.pathname.split('/');
                    currentLocationArrayPath.pop();
                    currentLocationArrayPath.push(url);
                    url = currentLocationArrayPath.join('/').replaceAll('//', '/');
                }
                if (!url.startsWith('/')) {
                    url = '/' + url;
                }
                if (parameters != null) {
                    let params = NextAdmin.QueryString.encodeQuery(parameters);
                    if (!String.isNullOrEmpty(params)) {
                        url += '?' + params;
                    }
                }
                if (updateNavigatorState == UpdateNavigatorState.pushState) {
                    window.history.pushState('', this._currentPage.options.name, url);
                } else if (updateNavigatorState == UpdateNavigatorState.replaceState) {
                    window.history.replaceState('', this._currentPage.options.name, url);
                }
            }
            this.onPageChanged.dispatch(this, nextPage);
            return nextPage;

        }

        protected displayMode?: DisplayMode;
        public getDisplayMode(): DisplayMode {
            if (this.displayMode) {
                return this.displayMode;
            }
            return NextAdmin.UserAgent.isMobile() ? DisplayMode.mobile : DisplayMode.desktop;
        }

        public async setDisplayMode(displayMode?: DisplayMode) {
            this.displayMode = displayMode;
        }

        public static getDisplayMode(): DisplayMode {
            if (Navigation) {
                return Navigation.getDisplayMode();
            }
            return NextAdmin.UserAgent.isMobile() ? DisplayMode.mobile : DisplayMode.desktop;
        }

    }

    export enum DisplayMode {
        desktop = 1,
        mobile = 2
    }

    export interface NavigationArgs {

        previousPage: UI.Page;

        nextPage: UI.Page;

        cancelNavigation: boolean;

    }


    export interface PageInfo {

        /**Common name of the page, used for navigation */
        name?: string;

        factory?: (options: UI.PageOptions) => UI.Page;

        /**NextAdmin.UI.Page object class name used to instanciate page */
        className?: string;

        /**Url of page Html content */
        contentUrl?: string;

        /**Url of the script conatining page class */
        scriptUrl?: string;

        /**List of dependencies loaded and unload when navigate to page */
        dependencies?: Array<string | DependencyInfo>;

    }


    export interface NavigationControllerOptions {

        pages?: PageInfo[];

        defaultPage?: string;

        pageContainer?: HTMLElement;

        enableSpaLinkNavigation?: boolean;

    }

    export var Navigation: NavigationController;

    export enum UpdateNavigatorState {
        none = 0,
        pushState = 1,
        replaceState = 2
    }

}