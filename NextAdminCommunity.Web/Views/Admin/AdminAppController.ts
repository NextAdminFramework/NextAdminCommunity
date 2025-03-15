class AdminAppController extends NextAdmin.BackEndAppController {

    public options: AdminAppControllerOptions;

    public entityClient: AdminEntityClient;

    public serviceClient: AdminServiceClient;

    public userClient: AdminUserClient;

    public appConfig: Models.AdminAppConfig;

    public entityInfos: NextAdmin.Business.EntityInfos;

    public user: NextAdmin.Models.User;

    constructor(options?: AdminAppControllerOptions) {
        super({
            defaultPage: 'login',
            afterLoginPage: AdminUserPage.pageName,
            appLogoUrl: '/Content/Images/logo.png',
            defaultFontUrl: '/Content/Dependencies/Fonts/OpenSans-Regular.ttf',
            pages: [
                {
                    name: 'login', factory: (options) => new NextAdmin.UI.LoginPage({
                        ...options,
                        backgroundImageUrl: '/Content/Images/login_bg.jpg',
                        gcuInfos: [{ language: 'fr', url: '' }, { language: 'en', url: '' }]
                    })
                },
                { name: AdminUserPage.pageName, factory: (option) => new AdminUserPage(option) },
            ],
            ...options
        } as AdminAppControllerOptions);
        this.onAppInitialized.subscribe(() => {

            this.menu.addPageButton({
                icon: Resources.userIcon,
                text: Resources.adminUsers,
                pageName: AdminUserPage.pageName
            });

        });
    }

    async startApp() {
        App = AdminApp = this;
        this.userClient = new AdminUserClient(this.options.adminUserControllerUrl, this.options.adminAuthTokenName);
        await super.startApp();
    }

    async initializeApp(): Promise<boolean> {
        let authToken = this.userClient.getCurrentAuthToken();
        if (this.user == null || NextAdmin.String.isNullOrEmpty(authToken)) {
            return false;
        }
        this.entityClient = new AdminEntityClient(this.options.adminEntityControllerUrl, this.options.adminAuthTokenName, authToken);
        this.serviceClient = new AdminServiceClient(this.options.adminServiceControllerUrl, this.options.adminAuthTokenName, authToken);
        this.onStartInitializeApp.dispatch(this, this.options);

        this.appConfig = await this.serviceClient.getAppConfig();
        if (this.appConfig == null) {
            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidCredentials, () => {
                this.logOutUser();
            });
            return false;
        }
        this.entityInfos = new NextAdmin.Business.EntityInfos(this.appConfig.entityInfos);
        return await super.initializeApp();
    }

    public initializeResources(language?: string): string {
        language = super.initializeResources(language);
        switch (language) {
            default:
            case 'en':
                NextAdmin.Resources.addResources(new NextAdminIcons());
                Resources = new ResourcesEn();
                break;
            case 'fr':
                NextAdmin.Resources.addResources(new NextAdminIcons());
                Resources = new ResourcesFr();
                break;
        }
        return language;
    }

    public isSuperAdmin() {
        return this?.user?.id == this?.appConfig?.superAdminUserId;
    }
}

interface AdminAppControllerOptions extends NextAdmin.BackEndAppControllerOptions {

    requestUrl?: string;

    adminAuthTokenName?: string;

    adminUserControllerUrl?: string;

    adminEntityControllerUrl?: string;

    adminServiceControllerUrl?: string;

}

var AdminApp: AdminAppController;
var App: AdminAppController;
var Resources: ResourcesEn;




