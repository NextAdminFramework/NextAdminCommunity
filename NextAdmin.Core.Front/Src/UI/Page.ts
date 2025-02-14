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
                clearOnLeave: true,
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

        public async navigateTo(args: NavigateToArgs): Promise<void> {
            this.options.container.appendChild(this.element);
            this.parameters = args?.parameters;
            window.scrollTo(0, 0);
            await this.load(args.contentUrl, args.parameters, args.dependencies);
            window.scrollTo(0, 0);
            this.onNavigateTo.dispatch(this, args);
        }


        public navigateFrom(args: NavigateFromArgs): void {
            this.onNavigateFrom.dispatch(this, args);
        }

        public endNavigateFrom() {
            this.unloadDependencies(this._loadedDependencies);
            this.element.remove();
            if (this.options.clearOnLeave) {
                this.element.innerHTML = '';
            }
            this.onEndNavigateFrom.dispatch();
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

        clearOnLeave?: boolean;

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