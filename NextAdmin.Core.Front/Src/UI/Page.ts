/// <reference path="View.ts"/>


namespace NextAdmin.UI {

    export class Page extends UI.View {

        navigationController: NavigationController;

        options: PageOptions;

        onNavigateFrom = new EventHandler<Page, NavigateFromArgs>();

        onEndNavigateFrom = new EventHandlerBase();

        onNavigateTo = new EventHandler<Page, NavigateToArgs>();

        parameters?: any;

        public static onCreated = new EventHandler<Page, PageOptions>();

        constructor(options?: PageOptions) {
            super({
                disposeOnNavigateFrom: true,
                container: document.body,
                navigationController: NextAdmin.Navigation,
                ...options
            } as PageOptions);
            if (this.options.name == null) {
                this.options.name = this.constructor.name;
            }
            this.navigationController = this.options.navigationController;
            Page.onCreated.dispatch(this, this.options);
        }

        public setParameters(parameters?: any, updateNavigatorState = UpdateNavigatorState.replaceState) {
            this.parameters = parameters;
            if (updateNavigatorState) {
                this.navigationController.updateNavigatorHistory(this.options.name, parameters, updateNavigatorState == UpdateNavigatorState.pushState);
            }
        }

        public getParameters(): any {
            return this.parameters;
        }

        public async navigateTo(args: NavigateToArgs): Promise<void> {
            this.options.container.appendChild(this.element);
            this.parameters = args?.parameters;
            window.scrollTo(0, 0);
            await this.load(args.contentUrl, args.parameters, args.dependencies);
            window.scrollTo(0, 0);
            this.onNavigateTo.dispatch(this, args);
        }


        public async navigateFrom(args: NavigateFromArgs): Promise<void> {
            this.onNavigateFrom.dispatch(this, args);
        }

        public endNavigateFrom() {
            this.unloadDependencies(this._loadedDependencies);
            this.element.remove();
            if (this.options.disposeOnNavigateFrom) {
                this.dispose();
            }
            this.onEndNavigateFrom.dispatch();
        }

        public dispose() {
            this.element.innerHTML = '';
        }

        public isActivePage() {
            return this.navigationController.getCurrentPage() == this;
        }

        public bindEvent<TSender, TArgs>(eventHandler: EventHandler<TSender, TArgs>, eventAction: (sender: TSender, args: TArgs) => void) {
            if (this.isActivePage()) {
                eventHandler.subscribe(eventAction);
            }
            this.onNavigateTo.subscribe(() => {
                if (!eventHandler.isSubscribed(eventAction)) {
                    eventHandler.subscribe(eventAction);
                }
            });
            this.onEndNavigateFrom.subscribe(() => {
                eventHandler.unsubscribe(eventAction);
            });
        }

    }

    export interface PageOptions extends ViewOptions {

        name?: string;

        container?: HTMLElement;

        disposeOnNavigateFrom?: boolean;

        pageInfo?: NextAdmin.PageInfo;

        navigationController?: NavigationController;

    }


    export interface NavigateToArgs {

        previousPage: UI.Page;

        parameters: any;

        contentUrl?: string;

        dependencies?: Array<string | DependencyInfo>;
    }

    export interface NavigateFromArgs {

        cancelNavigation: boolean;

        nextPage: UI.Page;

        nextPageParameters?: any;

    }

}