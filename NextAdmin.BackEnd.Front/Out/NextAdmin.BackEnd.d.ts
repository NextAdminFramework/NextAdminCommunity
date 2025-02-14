declare namespace NextAdmin {
    class BackEndAppController extends NextAdmin.NavigationController {
        options: BackEndAppControllerOptions;
        entityClient: NextAdmin.Services.EntityClient;
        userClient: NextAdmin.Services.UserClient;
        user: NextAdmin.Models.User;
        entityInfos: NextAdmin.Business.EntityInfos;
        onUserLoggedIn: EventHandler<BackEndAppController, Models.User>;
        onUserLoggedOut: EventHandler<BackEndAppController, Models.User>;
        onStartInitializeApp: EventHandlerBase;
        onAppInitialized: EventHandlerBase;
        menu: NextAdmin.UI.Sidebar;
        leftContainer?: HTMLDivElement;
        bottomContainer?: HTMLElement;
        mainArea: HTMLDivElement;
        pageBody: HTMLDivElement;
        topBar: HTMLDivElement;
        topLeftToolBar: NextAdmin.UI.Toolbar;
        topRightToolBar: NextAdmin.UI.Toolbar;
        topBarBehindMenuSpace: HTMLDivElement;
        topBarDropDownMenuButton: NextAdmin.UI.DropDownButton;
        static style: string;
        constructor(options?: BackEndAppControllerOptions);
        startApp(): Promise<void>;
        private _currentLanguage?;
        initializeResources(language?: string): string;
        getCurrentLenguage(): string;
        logUser(user: NextAdmin.Models.User): Promise<void>;
        navigateTo(pageName: string, parameters?: any, updateBrowserUrl?: boolean, force?: boolean): Promise<NextAdmin.UI.Page>;
        logOutUser(reloadPage?: boolean): void;
        initializeApp(): Promise<boolean>;
        protected initializeHeader(mainArea: HTMLElement): void;
        getDbSet<T>(entityName: string, queryData?: NextAdmin.Models.Query): NextAdmin.Business.EntityDbSetHandler<T>;
        getEntityInfo<T>(entityName: string): NextAdmin.Business.EntityInfo<T>;
    }
    interface BackEndAppControllerOptions extends NextAdmin.NavigationControllerOptions {
        appName?: string;
        afterLoginPage?: string;
        appLogoUrl?: string;
        defaultFontUrl?: string;
    }
    var BackEndResources: BackEndResourcesEn;
}
declare namespace NextAdmin {
    class BackEndResourcesBase {
        logOutIcon: string;
        userIcon: string;
    }
}
declare namespace NextAdmin {
    class BackEndResourcesEn extends BackEndResourcesBase {
        logOut: string;
        changePassword: string;
        invalidCredentials: string;
        connection: string;
        userName: string;
        authentication: string;
        stayConnected: string;
        viewGcu: string;
        gcu: string;
    }
}
declare namespace NextAdmin {
    class BackEndResourcesFr extends BackEndResourcesEn {
        logOut: string;
        changePassword: string;
        invalidCredentials: string;
        displayUserEntry: string;
        connection: string;
        userName: string;
        authentication: string;
        stayConnected: string;
        viewGcu: string;
        gcu: string;
    }
}
declare namespace NextAdmin.UI {
    class LoginPage extends NextAdmin.UI.Page {
        navigationController: BackEndAppController;
        buttonLogin: NextAdmin.UI.Button;
        options: LoginPageOptions;
        static style: string;
        constructor(option?: LoginPageOptions);
        navigateTo(args: NextAdmin.UI.NavigateToArgs): Promise<void>;
        navigateFrom(args: NextAdmin.UI.NavigateFromArgs): void;
        tryLogUser(userAppId: string, login: string, password: string, stayConnected: boolean): Promise<void>;
    }
    interface LoginPageOptions extends PageOptions {
        backgroundImageUrl?: string;
        gcuInfos?: Array<LoginPageGcuInfo>;
    }
    interface LoginPageGcuInfo {
        url?: string;
        language?: string;
    }
}
