namespace NextAdmin {

    export class BackEndAppController extends NextAdmin.NavigationController {

        public options: BackEndAppControllerOptions;

        public entityClient: NextAdmin.Services.EntityClient;

        public userClient: NextAdmin.Services.UserClient;

        public user: NextAdmin.Models.User;

        public entityInfos: NextAdmin.Business.EntityInfos;

        public onUserLoggedIn = new NextAdmin.EventHandler<BackEndAppController, NextAdmin.Models.User>();

        public onUserLoggedOut = new NextAdmin.EventHandler<BackEndAppController, NextAdmin.Models.User>();

        public onStartInitializeApp = new NextAdmin.EventHandler<BackEndAppController, BackEndAppControllerOptions>();

        public onAppInitialized = new NextAdmin.EventHandlerBase();

        public menu: NextAdmin.UI.Sidebar;

        public leftContainer?: HTMLDivElement;

        public bottomContainer?: HTMLElement;

        public mainArea: HTMLDivElement;

        public pageBody: HTMLDivElement;

        public topBar: HTMLDivElement;

        public topLeftToolBar: NextAdmin.UI.Toolbar;

        public topRightToolBar: NextAdmin.UI.Toolbar;

        public topBarBehindMenuSpace: HTMLDivElement;

        public topBarDropDownMenuButton: NextAdmin.UI.DropDownButton;

        public static style = `

    @font-face {
        font-family: "NextAdminDefaultFont";
        src: url(@NextAdminDefaultFontPath);
    }

    body {
        margin:0px;
        overflow:hidden;
        font-family:NextAdminDefaultFont,calibri,helvetica,roboto,sans-serif;
        font-size:14px;
    }

    #main {
        position:relative;
        padding:0px;
        background:rgba(241,243,244,1);
        height:100vh;
        display:flex;
        flex-direction:column;
        overflow:auto;
    }

    .main-desktop{
        margin-left:250px;
    }

    .next-admin-page-body {
        padding-left:8px;
        padding-right:8px;
        padding-top:50px;
        flex-grow:1;
    }
    .next-admin-page-body-mobile{
        padding-bottom:50px;
        padding-left:0px;
        padding-right:0px;
    }

    .next-admin-app-header{
        background:rgba(241,243,244,0.95);
        position:fixed;
        height:50px;
        display:flex;
        flex-direction:row;
        width:100%;
        left:0px;
        top:0px;
        z-index:1;
    }

    .next-admin-app-header-behind-desktop-menu-space{
        width:250px;
        min-width:250px;
        max-width:250px;
    }


    .next-admin-app-footer{
        position:fixed;
        width:100%;
        bottom:0px;
        z-index:1;
    }

    .next-admin-main-toolbar{
        float:right;
        .next-admin-main-toolbar-btn{
            margin-left:5px;
            margin-right:5px;
        }
    }
    `
        constructor(options?: BackEndAppControllerOptions) {
            super(options);
        }



        async startApp() {
            NextAdmin.Style.append('Admin.AppController', BackEndAppController.style.replaceAll('@NextAdminDefaultFontPath', this.options.defaultFontUrl));
            NextAdmin.UI.Modal.defaultStyle = NextAdmin.UI.ModalStyle.modern;
            NextAdmin.UI.Input.defaultStyle = NextAdmin.UI.InputStyle.modern;
            NextAdmin.UI.Select.defaultStyle = NextAdmin.UI.SelectStyle.modern;
            NextAdmin.UI.TabPanel.defaultStyle = NextAdmin.UI.TabPanelStyle.modern;
            NextAdmin.UI.TextArea.defaultStyle = NextAdmin.UI.TextAreaStyle.modern;
            NextAdmin.UI.RichTextEditor.defaultStyle = NextAdmin.UI.RichTextEditorStyle.modern;
            NextAdmin.UI.DataGrid_.defaultStyle = NextAdmin.UI.TableStyle.modern;
            document.body.disableUserSelection();
            document.body.style.overflow = 'hidden';
            if (NextAdmin.UserAgent.isMobile()) {
                document.body.addEventListener('touchstart', () => {
                    if (document.activeElement) {
                        (document.activeElement as HTMLElement).blur();
                    }
                });
            }
            this.initializeResources();
            document.body.startSpin();
            let user = await this.userClient.getUserByToken();
            document.body.stopSpin();
            if (user) {
                await this.logUser(user);
            }
            else {
                await this.navigateTo(this.options.defaultPageName);
            }
        }

        private _currentLanguage?: string;
        public initializeResources(language?: string): string {
            if (!language) {
                language = window?.navigator?.language;
            }
            if (language) {
                language = language?.substring(0, 2);
            }
            this._currentLanguage = language;
            switch (this._currentLanguage) {
                default:
                case 'en':
                    Resources = new ResourcesEn();
                    BackEndResources = new BackEndResourcesEn();
                    break;
                case 'fr':
                    Resources = new ResourcesFr();
                    BackEndResources = new BackEndResourcesFr();
                    break;
            }
            return this._currentLanguage;
        }

        getCurrentLanguage() {
            return this._currentLanguage ?? 'en';
        }

        async logUser(user: NextAdmin.Models.User) {
            this.user = user;
            this.onUserLoggedIn.dispatch(this, this.user);
            let success = await this.initializeApp();
            if (success) {
                let pageInfo = this.getPageInfoFromUrl();
                if (!NextAdmin.String.isNullOrEmpty(pageInfo.pageName)) {
                    await this.navigateToUrl();
                }
                else {
                    await this.navigateTo(this.options.afterLoginPageName);
                }
            }
        }

        async navigateTo(pageName: string, parameters?: any, updateNavigatorState?: UpdateNavigatorState, force?: boolean): Promise<NextAdmin.UI.Page> {
            if (pageName == this.options.defaultPageName && this.user != null) {
                return super.navigateTo(this.options.afterLoginPageName, null, UpdateNavigatorState.none);
            }
            return await super.navigateTo(pageName, parameters, updateNavigatorState, force);
        }

        public logOutUser(reloadPage = true) {
            NextAdmin.Cookies.delete(this.userClient.authTokenName);
            let previousUser = this.user;
            this.user = null;
            this.onUserLoggedOut.dispatch(this, previousUser);
            if (reloadPage) {
                location.reload();
            }
        }

        async initializeApp(): Promise<boolean> {
            let authToken = this.userClient.getCurrentAuthToken();
            if (this.user == null || NextAdmin.String.isNullOrEmpty(authToken)) {
                return false;
            }

            this.initializeResources(this.user.culture);
            NextAdmin.Business.DatasetController_.factory = (dataName) => dataName == null ? null : new NextAdmin.Business.EntityDatasetController({
                entityClient: this.entityClient,
                dataInfos: this.entityInfos,
                dataName: dataName
            });
            NextAdmin.Business.DataController_.factory = (dataName) => dataName == null ? null : new NextAdmin.Business.EntityDataController_({
                entityClient: this.entityClient,
                dataInfos: this.entityInfos,
                dataName: dataName
            });

            this.onStartInitializeApp.dispatch(this, this.options);

            this.leftContainer = document.body.appendHTML('div', (leftContainer) => {
                leftContainer.classList.add('next-admin-side-container');
                this.menu = leftContainer.appendControl(new NextAdmin.UI.Sidebar({
                    navigationController: this,
                    style: NextAdmin.UI.SideBarStyle.darkBlueTwo,
                }), (menu) => {

                    menu.header.style.paddingBottom = '0px';
                    menu.header.appendHTML('div', (header) => {
                        header.classList.add('d-flex', 'justify-content-between', null);
                        header.appendHTML('div', (logoContainer) => {
                            logoContainer.classList.add('logo');
                            logoContainer.style.borderBottom = '1px solid #ccc';
                            logoContainer.style.marginBottom = '10px';
                            logoContainer.style.paddingBottom = '10px';
                            logoContainer.style.width = '100%';
                            logoContainer.appendHTML('img', (logoImage) => {
                                logoImage.src = this.options.appLogoUrl;
                                logoImage.style.width = '100%';
                            });
                        });
                    });

                    menu.header.appendHTML('div', async (infoContainer) => {
                        infoContainer.style.fontWeight = 'bold';
                        infoContainer.style.fontSize = '12px';
                        infoContainer.style.color = '#f0f0f0';
                        infoContainer.innerHTML = this.user.userName;
                    });

                    menu.body.appendHTML('li', (sideBarTitle) => {
                        sideBarTitle.classList.add('sidebar-title');
                    });
                });
            });

            this.mainArea = document.body.appendHTML('div', (mainArea) => {
                mainArea.id = 'main';
                mainArea.classList.add('main-desktop');
                this.initializeHeader(mainArea);
                this.pageBody = mainArea.appendHTML('div', (pageBody) => {
                    pageBody.classList.add('next-admin-page-body');
                });
                this.pageContainer = this.pageBody;
                this.bottomContainer = mainArea.appendHTML('footer', (footer) => {
                    footer.classList.add('next-admin-app-footer');
                });
            });

            this.onAppInitialized.dispatch();
            return true;
        }

        protected initializeHeader(mainArea: HTMLElement) {
            this.topBar = mainArea.appendHTML('header', (topBar) => {
                topBar.classList.add('next-admin-app-header');

                this.topBarBehindMenuSpace = topBar.appendHTML('div', (topBarBehindMenuSpace) => {
                    topBarBehindMenuSpace.classList.add('next-admin-app-header-behind-desktop-menu-space');
                });

                topBar.appendHTML('div', (mainTopBarGrowArea) => {
                    mainTopBarGrowArea.style.flexGrow = '1';
                    mainTopBarGrowArea.appendHTML('div', (mainTopBarGrowRelativeArea) => {
                        mainTopBarGrowRelativeArea.style.position = 'relative';
                        mainTopBarGrowRelativeArea.style.width = '100%';
                        mainTopBarGrowRelativeArea.appendHTML('div', (mainTopBarArea) => {
                            mainTopBarArea.style.position = 'absolute';
                            mainTopBarArea.style.width = '100%';
                            mainTopBarArea.style.left = '0px';
                            mainTopBarArea.style.top = '0px';

                            mainTopBarArea.appendControl(new NextAdmin.UI.FlexLayout({ direction: NextAdmin.UI.FlexLayoutDirection.horizontal }), (headerlayout) => {
                                headerlayout.appendControlStretch(new NextAdmin.UI.ScrollableHorizontalBar({ scrollOffset: 200 }), (scrollableBar) => {
                                    scrollableBar.element.style.marginTop = '8px';
                                    scrollableBar.element.style.height = '34px';
                                    this.topLeftToolBar = scrollableBar.scrollableArea.appendControl(NextAdmin.UI.Modal.getMinimizedModalToolbar());
                                    let getMinimizedModalAvailableSpace = () => {
                                        return mainTopBarArea.clientWidth - this.topRightToolBar.element.clientWidth;
                                    };
                                    this.topLeftToolBar.onItemsChanged.subscribe(() => {
                                        scrollableBar.setMaxWidth(getMinimizedModalAvailableSpace());
                                    });
                                    window.addEventListener('resize', () => {
                                        scrollableBar.setMaxWidth(getMinimizedModalAvailableSpace());
                                    });
                                    setTimeout(() => {
                                        scrollableBar.setMaxWidth(getMinimizedModalAvailableSpace());
                                    }, 10);
                                });
                                this.topRightToolBar = headerlayout.appendControl(new NextAdmin.UI.Toolbar(), (topRightToolBar) => {
                                    topRightToolBar.element.classList.add('next-admin-main-toolbar');

                                    this.topBarDropDownMenuButton = topRightToolBar.appendControl(new NextAdmin.UI.DropDownButton({
                                        dropDownParentContainer: document.body,
                                        text: NextAdmin.Resources.menuIcon,
                                        style: NextAdmin.UI.ButtonStyle.noBg,
                                        size: NextAdmin.UI.ButtonSize.large,
                                        dropDownWidth: '240px',
                                        dropDownPosition: NextAdmin.UI.DropDownPosition.downLeft,
                                    }), (topBarDropDownMenuButton) => {
                                        topBarDropDownMenuButton.element.classList.add('next-admin-main-toolbar-btn');
                                        topBarDropDownMenuButton.addElement({
                                            text: NextAdmin.Resources.lockIcon + ' ' + BackEndResources.changePassword,
                                            action: () => {
                                                new NextAdmin.UI.ChangePasswordModal({ userClient: this.userClient }).open();
                                            }
                                        });
                                        topBarDropDownMenuButton.addElement({
                                            text: BackEndResources.logOutIcon + ' ' + BackEndResources.logOut,
                                            action: () => {
                                                this.logOutUser();
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });

                });
            }) as HTMLDivElement;
        }

        public getDbSet<T>(entityName: string, queryData?: NextAdmin.Models.Query): NextAdmin.Business.EntityDbSetHandler<T> {
            return new NextAdmin.Business.EntityDbSetHandler<T>(this.entityInfos.get(entityName), this.entityClient, queryData);
        }

        public getEntityInfo<T>(entityName: string): NextAdmin.Business.EntityInfo<T> {
            return this.entityInfos.get(entityName);
        }

    }

    export interface BackEndAppControllerOptions extends NextAdmin.NavigationControllerOptions {

        appName?: string;

        afterLoginPageName?: string;

        appLogoUrl?: string;

        defaultFontUrl?: string;
    }
    export var BackEndResources: BackEndResourcesEn;

}