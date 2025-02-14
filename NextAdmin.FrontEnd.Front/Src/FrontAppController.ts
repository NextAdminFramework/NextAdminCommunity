namespace NextAdmin {

    export class FrontAppController<TUser extends NextAdmin.Models.User> extends NavigationController {

        httpClient: NextAdmin.Services.HttpClient;

        userClient: NextAdmin.Services.FrontEndUserClient;

        user: TUser;

        onUserSignIn = new NextAdmin.EventHandler<FrontAppController<TUser>, TUser>();

        onUserSignUp = new NextAdmin.EventHandler<FrontAppController<TUser>, TUser>();

        onUserLogged = new NextAdmin.EventHandler<FrontAppController<TUser>, TUser>();

        onUserLogOut = new NextAdmin.EventHandler<FrontAppController<TUser>, TUser>();

        onCultureChanged = new NextAdmin.EventHandler<FrontAppController<TUser>, string>();

        options: FrontAppControllerOptions;

        public static style = `

        @font-face {
          font-family: "NextAdminDefaultFont";
          src: url(@NextAdminDefaultFontPath);
        }

        body {
            font-family:NextAdminDefaultFont,calibri,helvetica,roboto,sans-serif;
            font-size:14px;
            margin:0px;
        }

        `;

        public constructor(options: FrontAppControllerOptions) {
            super({
                httpClient: new NextAdmin.Services.HttpClient(),
                canSignIn: true,
                canSignUp: true,
                defaultFontPath: '/Content/Dependencies/Fonts/OpenSans-Regular.ttf',
                signUpModalFactory: (options) => new NextAdmin.UI.SignUpModal(options),
                signInModalFactory: (options) => new NextAdmin.UI.SignInModal(options),
                ...options
            } as FrontAppControllerOptions);
            this.httpClient = this.options.httpClient;
            this.userClient = this.options.userClient;
            FrontApp = this;
        }

        async startApp(navigateToUrl?: boolean) {

            NextAdmin.Style.append('NextAdmin.FrontAppController', FrontAppController.style.replaceAll('@NextAdminDefaultFontPath', this.options.defaultFontPath));

            if (this.pageContainer) {
                this.pageContainer.startSpin();
            }
            let user = (await this.userClient.getUserByToken()) as TUser;
            if (user != null) {
                await this.logUser(user);
            }
            if (NextAdmin.String.isNullOrEmpty(this.user?.culture)) {
                this.setCulture(this.getCulture());
            }
            if (this.pageContainer) {
                this.pageContainer.stopSpin();
            }
            if (navigateToUrl) {
                this.navigateToUrl();
            }
        }

        protected async logUser(user: TUser) {
            if (user == null) {
                return;
            }
            this.user = user;
            if (!NextAdmin.String.isNullOrEmpty(this.user.culture)) {
                this.setCulture(this.user.culture);
            }
            else {
                await this.refresh();
            }
            this.onUserLogged.dispatch(this, this.user);
        }

        public logOutUser() {
            this.userClient.deleteCurrentAuthToken();
            this.onUserLogOut.dispatch(this, this.user);
            this.user = null;
        }

        public signIn(onSignIn?: (user: NextAdmin.Models.User) => void) {
            if (!this.options.canSignIn || this.options.signInModalFactory == null) {
                return;
            }
            let modal = this.options.signInModalFactory({
                userClient: this.userClient,
                onSignIn: async (response) => {
                    await this.logUser(response.user as TUser);
                    this.onUserSignIn.dispatch(this, response.user as TUser);
                    if (onSignIn) {
                        onSignIn(response.user);
                    }
                },
                signUpAction: () => this.signUp((user) => {
                    this.onUserSignUp.dispatch(this, user as TUser);
                    if (onSignIn) {
                        onSignIn(user);
                    }
                })
            });
            modal.open();
        }

        public signUp(onSignUp?: (user: NextAdmin.Models.User) => void) {
            if (!this.options.canSignUp || this.options.signUpModalFactory == null) {
                return;
            }
            let modal = this.options.signUpModalFactory({
                userClient: this.userClient,
                onSignUp: async (userName, userPassword) => {
                    let authUserResponse = await this.userClient.authUser(userName, userPassword);
                    if (authUserResponse?.isSuccess) {
                        await this.logUser(authUserResponse.user as TUser);
                        this.onUserSignUp.dispatch(this, authUserResponse.user as TUser);
                        if (onSignUp) {
                            onSignUp(authUserResponse.user);
                        }
                    }
                },
                signInAction: () => this.signIn((user) => {
                    this.onUserSignIn.dispatch(this, user as TUser);
                    if (onSignUp) {
                        onSignUp(user);
                    }
                })
            });
            modal.open();
        }

        public getCulture(): string {
            return (NextAdmin.Cookies.get('culture') ?? window.navigator.language) ?? 'en-US';
        }

        public getLanguage(): string {
            let culture = NextAdmin.Cookies.get('culture');
            return NextAdmin.String.isNullOrEmpty(culture) ? 'en' : culture.substr(0, 2);
        }

        public async setCulture(culture, updateUserCulture?: boolean) {
            this.initializeResources(culture.substring(0, 2));
            NextAdmin.Cookies.set('culture', culture);
            this.onCultureChanged.dispatch(this, culture);
            await this.refresh();
            if (updateUserCulture && this.user) {
                this.userClient.setUserCulture(culture);
            }
        }

        protected initializeResources(language: string): string {
            if (!language) {
                language = window?.navigator?.language;
            }
            if (language) {
                language = language?.substring(0, 2);
            }
            switch (language) {
                case 'fr':
                    NextAdmin.Resources = new NextAdmin.ResourcesFr();
                    NextAdmin.FrontEndResources = new NextAdmin.FrontEndResourcesFr();
                default:
                case 'en':
                    NextAdmin.Resources = new NextAdmin.ResourcesEn();
                    NextAdmin.FrontEndResources = new NextAdmin.FrontEndResourcesEn();
            }
            return language;
        }

    }

    export interface FrontAppControllerOptions extends NavigationControllerOptions {

        httpClient?: NextAdmin.Services.HttpClient;

        userClient?: NextAdmin.Services.FrontEndUserClient;

        canSignIn?: boolean;

        canSignUp?: boolean;

        defaultFontPath?: string,

        signUpModalFactory?: (options?: NextAdmin.UI.SignUpModalOptions) => NextAdmin.UI.SignUpModal;

        signInModalFactory?: (options?: NextAdmin.UI.SignInModalOptions) => NextAdmin.UI.SignInModal;

    }
    export var FrontApp: FrontAppController<NextAdmin.Models.User>;
}