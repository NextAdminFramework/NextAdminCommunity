/*!
 * Next'Admin v1.0.0 (https://www.nextadmin.fr)
 * Auteur Maxime AVART - Tous droits réservés - Toute reproduction et utilisation interdite sans l'autorisation de l'auteur
 * Copyright (c) 2023 Maxime AVART
 * All rights reserved.
 * Redistribution and use are forbidden without approval of the author.
 */ 
class EntityNames {
}
EntityNames.AdminUser = 'AdminUser';
class NextAdminIcons extends NextAdmin.ResourcesManager {
    constructor() {
        super(...arguments);
        this.addIcon = '<i class="fas fa-plus"></i>';
        this.downloadIcon = '<i class="fas fa-download"></i>';
        this.printIcon = '<i class="fas fa-print"></i>';
        this.saveIcon = '<i class="fas fa-save"></i>';
        this.deleteIcon = '<i class="fas fa-trash-alt"></i>';
        this.removeIcon = '<i class="fas fa-times-circle"></i>';
        this.clearIcon = '<i class="fas fa-eraser"></i>';
        this.checkIcon = '<i class="fas fa-check"></i>';
        this.cogIcon = '<i class="fas fa-cog"></i>';
        this.openIcon = '<i class="far fa-edit"></i>';
        this.refreshIcon = '<i class="fas fa-sync"></i>';
        this.searchIcon = '<i class="fas fa-search"></i>';
        this.menuIcon = '<i class="fas fa-bars"></i>';
        this.iconCaretDown = '<i class="fas fa-angle-down"></i>';
        this.iconCaretLeft = '<i class="fas fa-angle-left"></i>';
        this.iconCaretRight = '<i class="fas fa-angle-right"></i>';
        this.keyIcon = '<i class="fas fa-key"></i>';
        this.emailIcon = '<i class="fas fa-envelope"></i>';
        this.lockIcon = '<i class="fas fa-lock"></i>';
        this.noDataIcon = '<i class="fas fa-database"></i>';
        this.copyIcon = '<i class="fa-solid fa-copy"></i>';
        this.dragIcon = '<i class="fas fa-grip-vertical"></i>';
        this.backIcon = '<i class="fas fa-arrow-alt-left"></i>';
        this.linkIcon = '<i class="fas fa-link"></i>';
        this.warningIcon = '<i class="fas fa-exclamation-triangle"></i>';
    }
}
class ResourcesBase extends NextAdmin.ResourcesManager {
    constructor() {
        super(...arguments);
        this.userIcon = '<i class="fas fa-user"></i>';
        this.logOutIcon = '<i class="fas fa-sign-out"></i>';
        this.cloudIcon = '<i class="fas fa-cloud"></i>';
    }
}
class ResourcesEn extends ResourcesBase {
    constructor() {
        super(...arguments);
        this.adminUsers = 'Administrators';
        this.invalidCredentials = 'Invalid credentials';
        this.changePassword = 'Change password';
        this.displayUserEntry = "Display user profile";
        this.logOut = 'Lgout';
        this.french = 'French';
        this.english = 'English';
        this.connection = 'Connection';
        this.userName = 'User name';
        this.authentication = 'Authentication';
        this.stayConnected = 'Stay connected';
        this.viewGcu = 'View CGU';
        this.gcu = 'GCU';
    }
}
/// <reference path="ResourcesEn.ts"/>
class ResourcesFr extends ResourcesEn {
    constructor() {
        super(...arguments);
        this.adminUsers = 'Administrateurs';
        this.invalidCredentials = 'Vos informations d’identification ne sont pas valides';
        this.changePassword = 'Changer de mot de passe';
        this.displayUserEntry = "Afficher la fiche utilisateur";
        this.logOut = 'Se déconnecter';
        this.french = 'Français';
        this.english = 'Anglais';
        this.connection = 'Connexion';
        this.userName = 'Identifiant';
        this.authentication = 'Identification';
        this.stayConnected = 'Rester connecté';
        this.viewGcu = 'Voir les CGU';
        this.gcu = 'CGU';
    }
}
class AdminEntityClient extends NextAdmin.Services.EntityClient {
}
class AdminServiceClient extends NextAdmin.Services.HttpClient {
    constructor(controllerUrl, authTokenName = 'NextAdminAuthToken', authToken) {
        super(controllerUrl);
        if (authToken) {
            this.setAuthToken(authToken);
        }
    }
    setAuthToken(authToken) {
        this.headerParams[this.authTokenName] = authToken;
    }
    async getAppConfig() {
        let response = await this.get('getAppConfig', {});
        if (!response?.success)
            return null;
        return response.parseJson();
    }
}
class AdminUserClient extends NextAdmin.Services.UserClient {
}
class AdminAppController extends NextAdmin.NavigationController {
    constructor(options) {
        super({
            defaultPage: 'login',
            afterLoginPage: 'adminUsers',
            appLogoUrl: '/Content/Images/logo.png',
            defaultFontUrl: '/Content/Dependencies/Fonts/OpenSans-Regular.ttf',
            pages: [
                { name: 'login', factory: (option) => new AdminLoginPage(option) },
                { name: AdminUserPage.pageName, factory: (option) => new AdminUserPage(option) },
            ],
            ...options
        });
        this.onUserLoggedIn = new NextAdmin.EventHandler();
        this.onUserLoggedOut = new NextAdmin.EventHandler();
        this.onStartInitializeApp = new NextAdmin.EventHandlerBase();
        this.onAppInitialized = new NextAdmin.EventHandlerBase();
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
        NextAdmin.Style.append('Admin.AppController', AdminAppController.style.replaceAll('@NextAdminDefaultFontPath', this.options.defaultFontUrl));
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
                    document.activeElement.blur();
                }
            });
        }
        this.initializeResources();
        this.userClient = new AdminUserClient(this.options.adminUserControllerUrl, this.options.adminAuthTokenName);
        document.body.startSpin();
        let user = await this.userClient.getUserByToken();
        document.body.stopSpin();
        if (user) {
            this.logUser(user);
        }
        else {
            this.navigateTo(this.options.defaultPage);
        }
    }
    initializeResources(language) {
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
                NextAdmin.Resources = new NextAdmin.ResourcesEn().addResources(new NextAdminIcons());
                Resources = new ResourcesEn();
                break;
            case 'fr':
                NextAdmin.Resources = new NextAdmin.ResourcesFr().addResources(new NextAdminIcons());
                Resources = new ResourcesFr();
                break;
        }
        return this._currentLanguage;
    }
    getCurrentLenguage() {
        return this._currentLanguage ?? 'en';
    }
    async logUser(user) {
        this.user = user;
        this.onUserLoggedIn.dispatch(this, this.user);
        let success = await this.initializeApp();
        if (success) {
            let pageInfo = this.getPageInfoFromUrl();
            if (!NextAdmin.String.isNullOrEmpty(pageInfo.pageName)) {
                await this.navigateToUrl();
            }
            else {
                await this.navigateTo(this.options.afterLoginPage);
            }
        }
    }
    async navigateTo(pageName, parameters, updateBrowserUrl, force) {
        if (pageName == this.options.defaultPage && this.user != null) {
            return super.navigateTo(this.options.afterLoginPage, null, false);
        }
        return await super.navigateTo(pageName, parameters, updateBrowserUrl, force);
    }
    logOutUser(reloadPage = true) {
        NextAdmin.Cookies.delete(this.options.adminAuthTokenName);
        let previousUser = this.user;
        this.user = null;
        this.onUserLoggedOut.dispatch(this, previousUser);
        if (reloadPage) {
            location.reload();
        }
    }
    async initializeApp() {
        let authToken = this.userClient.getCurrentAuthToken();
        if (this.user == null || NextAdmin.String.isNullOrEmpty(authToken)) {
            throw Error("Unable to initialize app if user is not logged");
        }
        this.entityClient = new AdminEntityClient(this.options.adminEntityControllerUrl, this.options.adminAuthTokenName, authToken);
        this.serviceClient = new AdminServiceClient(this.options.adminServiceControllerUrl, this.options.adminAuthTokenName, authToken);
        this.onStartInitializeApp.dispatch();
        this.appConfig = await this.serviceClient.getAppConfig();
        if (this.appConfig == null) {
            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, Resources.invalidCredentials, () => {
                this.logOutUser();
            });
            return false;
        }
        this.initializeResources(this.user.culture);
        this.entityInfos = new NextAdmin.Business.EntityInfos(this.appConfig.entityInfos);
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
                            logoImage.src = AdminApp.options.appLogoUrl;
                            logoImage.style.width = '100%';
                        });
                    });
                });
                menu.header.appendHTML('div', async (infoContainer) => {
                    infoContainer.style.fontWeight = 'bold';
                    infoContainer.style.fontSize = '12px';
                    infoContainer.style.color = '#f0f0f0';
                    infoContainer.innerHTML = Resources.cloudIcon + ' ' + AdminApp.user.userName;
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
    initializeHeader(mainArea) {
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
                                        text: NextAdmin.Resources.lockIcon + ' ' + Resources.changePassword,
                                        action: () => {
                                            new NextAdmin.UI.ChangePasswordModal({ userClient: this.userClient }).open();
                                        }
                                    });
                                    topBarDropDownMenuButton.addElement({
                                        text: Resources.userIcon + ' ' + Resources.displayUserEntry,
                                        action: () => {
                                            NextAdmin.UI.DataFormModal.createUnique(AdminUserModal.name, { dataPrimaryKey: this.user.id }).open({ dataPrimaryKey: this.user.id });
                                        }
                                    });
                                    topBarDropDownMenuButton.addElement({
                                        text: Resources.logOutIcon + ' ' + Resources.logOut,
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
        });
    }
    isSuperAdmin() {
        return this?.user?.id == this?.appConfig?.superAdminUserId;
    }
    getDbSet(entityName, queryData) {
        return new NextAdmin.Business.EntityDbSetHandler(this.entityInfos.get(entityName), this.entityClient, queryData);
    }
    getEntityInfo(entityName) {
        return this.entityInfos.get(entityName);
    }
}
AdminAppController.style = `

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
    `;
var AdminApp;
var App;
var Resources;
class AdminUserModal extends NextAdmin.UI.DataFormModal {
    constructor(option) {
        super({
            size: NextAdmin.UI.ModalSize.smallFitContent,
            canMoveAndResize: true,
            canMinimize: true,
            dataName: EntityNames.AdminUser,
            ...option
        });
        this.body.appendControl(new NextAdmin.UI.FormLayout({ dataController: this.dataController }), (formLayout) => {
            formLayout.addItem({
                col: 1, row: 1, colSpan: 2,
                propertyName: this.getPropertyName(a => a.userName),
                useDefaultControl: true
            });
            formLayout.addItem({
                col: 1, row: 2, colSpan: 2,
                propertyName: this.getPropertyName(a => a.password),
                control: new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.password })
            });
            formLayout.addItem({
                col: 1, row: 3, colSpan: 2,
                propertyName: this.getPropertyName(a => a.culture),
                control: new NextAdmin.UI.Select({
                    items: [{ value: '' },
                        { value: 'fr', label: 'FR - ' + Resources.french },
                        { value: 'en', label: 'EN - ' + Resources.english }
                    ]
                })
            });
            formLayout.addItem({
                col: 1, row: 4, colSpan: 1,
                propertyName: this.getPropertyName(a => a.disabled),
                labelWidth: '50%',
                useDefaultControl: true
            });
            formLayout.addItem({
                col: 2, row: 4, colSpan: 1,
                propertyName: this.getPropertyName(a => a.isSuperAdmin),
                labelWidth: '50%',
                control: new NextAdmin.UI.Input({
                    inputType: NextAdmin.UI.InputType.checkbox,
                    disabled: true
                }),
            });
        });
    }
    async initialize(data, dataState) {
        await super.initialize(data, dataState);
        if (data.isSuperAdmin) {
            this.dataController.getControl(a => a.disabled).disable();
            if (!AdminApp.isSuperAdmin()) {
                this.dataController.getControl(a => a.userName).disable();
                this.dataController.getControl(a => a.password).disable();
                this.dataController.getControl(a => a.culture).disable();
            }
        }
    }
}
class AdminLoginPage extends NextAdmin.UI.Page {
    constructor(option) {
        super(option);
    }
    async navigateTo(args) {
        await super.navigateTo(args);
        NextAdmin.Style.append('LoginPage', AdminLoginPage.style);
        this.element.classList.add('login-page', 'container');
        this.element.style.background = 'url(/Content/Images/login_bg.jpg) no-repeat center center fixed';
        this.element.style.backgroundSize = 'cover';
        this.element.appendHTML('div', (backgroundOverlay) => {
            backgroundOverlay.classList.add('background-overlay');
            backgroundOverlay.appendHTML('div', (loginPanelContainer) => {
                loginPanelContainer.classList.add('login-panel-container');
                loginPanelContainer.center();
                loginPanelContainer.appendHTML('div', (logoContainer) => {
                    logoContainer.style.height = '50px';
                    logoContainer.appendHTML('img', (logoImage) => {
                        logoImage.src = AdminApp.options.appLogoUrl;
                        logoImage.style.height = '100%';
                    });
                    logoContainer.style.marginBottom = '25px';
                });
                loginPanelContainer.appendHTML('div', (loginPanel) => {
                    loginPanel.classList.add('account-wall');
                    loginPanel.appendHTML('span', (loginTitle) => {
                        loginTitle.innerHTML = Resources.userIcon + ' ' + Resources.authentication;
                        loginTitle.classList.add('login-title');
                    });
                    loginPanel.appendHTML('div', (logoContainer) => {
                        logoContainer.style.fontSize = '50px';
                        logoContainer.style.fontWeight = 'bold';
                    });
                    loginPanel.appendHTML('div', (form) => {
                        form.classList.add('form-signin');
                        let userAppIdInput;
                        let loginInput = form.appendControl(new NextAdmin.UI.Input({ placeHolder: Resources.userName }), (input) => { input.element.style.marginBottom = '10px'; });
                        let passwordInput = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.password, placeHolder: NextAdmin.Resources.password }));
                        passwordInput.input.addEventListener('keyup', (args) => {
                            if (args.keyCode == 13) {
                                this.tryLogUser(userAppIdInput?.getValue(), loginInput.getValue(), passwordInput.getValue(), stayConnected.getValue());
                            }
                        });
                        let stayConnected = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.checkbox, label: Resources.stayConnected, labelWidth: '60%' }), (cb) => {
                            cb.label.classList.add('checkbox');
                        });
                        this.buttonLogin = form.appendControl(new NextAdmin.UI.Button({
                            style: NextAdmin.UI.ButtonStyle.blue,
                            size: NextAdmin.UI.ButtonSize.large,
                            text: NextAdmin.Resources.keyIcon + ' ' + Resources.connection,
                            action: () => {
                                this.tryLogUser(userAppIdInput?.getValue(), loginInput.getValue(), passwordInput.getValue(), stayConnected.getValue());
                            }
                        }), (btn) => {
                            btn.element.style.marginTop = '20px';
                            btn.element.style.marginBottom = '20px';
                        });
                        form.appendHTML('div', (footer) => {
                            footer.style.borderTop = '1px solid #ccc';
                            footer.style.paddingTop = '20px';
                            footer.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.forgottenPassword, style: NextAdmin.UI.ButtonStyle.default, action: () => {
                                    new NextAdmin.UI.RecoverPasswordModal({ email: loginInput.getValue() }).open();
                                }
                            }));
                            footer.appendControl(new NextAdmin.UI.Button({
                                text: Resources.viewGcu, style: NextAdmin.UI.ButtonStyle.default, action: async () => {
                                    let gcuModal = new NextAdmin.UI.Modal({ title: Resources.gcu, size: NextAdmin.UI.ModalSize.medium });
                                    gcuModal.open();
                                    gcuModal.startSpin();
                                    let httpClient = new NextAdmin.Services.HttpClient();
                                    let gcu = await httpClient.get('/Content/gcu_' + (AdminApp.getCurrentLenguage() == 'fr' ? 'fr' : 'en') + '.html');
                                    gcuModal.stopSpin();
                                    gcuModal.body.appendHTML('div', (container) => {
                                        container.style.padding = '20px';
                                        container.innerHTML = gcu.text;
                                    });
                                }
                            }));
                        });
                    });
                });
            });
        });
    }
    navigateFrom(args) {
        super.navigateFrom(args);
    }
    async tryLogUser(userAppId, login, password, stayConnected) {
        this.buttonLogin.startSpin();
        if (userAppId) {
            NextAdmin.Cookies.set('UserAppId', userAppId, stayConnected ? 30 : null);
        }
        let logUserResponse = await AdminApp.userClient.authUser(login, password, stayConnected);
        this.buttonLogin.stopSpin();
        if (logUserResponse?.isSuccess) {
            AdminApp.logUser(logUserResponse.user);
        }
        else {
            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidCredentials);
        }
    }
}
AdminLoginPage.style = `.login-page{height:100vh;background:#79828c} 
        .login-page .form-signin { max-width: 350px; padding: 15px;  margin: 0 auto; } 
        .login-page .form-signin .form-signin-heading, .form-signin .checkbox { margin-bottom: 10px; }
        .login-page .form-signin .checkbox { font-weight: normal; }
        .login-page .form-signin .form-control { position: relative;font-size: 16px;height: auto;padding: 10px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
        .login-page .form-signin .form-control:focus z-index: 2;}
        .login-page .form-signin input[type="text"] {margin-bottom: -1px;}
        .login-page .form-signin input[type="password"] {margin-bottom: 10px;}
        .login-page .account-wall {border-radius:10px;padding: 40px 0px 20px 0px;background-color: #fff;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);text-align: center;}
        .login-page .login-title { font-size:30px; font-weight:600;color:#183153 }
        .login-page .profile-img {width: 96px;height: 96px;margin: 0 auto 10px;display: block;-moz-border-radius: 50%;-webkit-border-radius: 50%;border-radius: 50%;}
        .login-page .need-help {margin-top: 10px;}
        .login-page .new-account {display: block;margin-top: 10px;}
        .login-page .form-control {height: 40px !important;}
        .login-page .user-icon {color: #95a0be;font-size: 80px;}
        .login-page .panel-container {position: relative;top: 50%;transform: perspective(1px) translateY(-50%);}
        .account-wall .next-admin-input {border-radius:4px; background-color:e0e0e0; height:30px;margin-bottom:5px }
        .account-wall .next-admin-btn {margin:5px}
        .login-panel-container { width:450px;max-width:95% }
        .background-overlay{
            width:100%;
            height:100%;
            background: linear-gradient(-45deg, rgba(134, 158, 169, 0.4), rgba(155, 134, 169, 0.2), rgba(35, 166, 213, 0.4), rgba(11, 109, 108, 0.6));
            background-size: 400% 400%;
            animation: gradient 30s ease infinite;
        }
        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }
    `;
class AdminUserPage extends NextAdmin.UI.Page {
    constructor(pageOption) {
        super({
            clearOnLeave: false,
            css: { height: '100%' },
            ...pageOption
        });
        this.element.appendControl(new NextAdmin.UI.Panel(), (panel) => {
            panel.leftHeader.innerHTML = Resources.adminUsers;
            let userInfo = AdminApp.getEntityInfo(EntityNames.AdminUser);
            this.grid = panel.body.appendControl(new NextAdmin.UI.DataGrid({
                dataName: userInfo.name,
                deleteMode: NextAdmin.UI.DataDeleteMode.server,
                searchMode: NextAdmin.UI.DataSearchMode.server,
                rowSelectionMode: NextAdmin.UI.RowSelectionMode.multiSelect_CtrlShift,
                rowHoverable: true,
                paginItemCount: 200,
                canSave: false,
                formModalFactory: (dataName, option) => NextAdmin.UI.DataFormModal.createUnique(AdminUserModal.name, option),
                columns: [
                    { propertyName: userInfo.getPropertyName(a => a.userName), defaultOrdering: NextAdmin.UI.ColumnOrdering.ascending },
                    { propertyName: userInfo.getPropertyName(a => a.creationDate), width: '160px' },
                    { propertyName: userInfo.getPropertyName(a => a.culture), width: '80px' },
                    { propertyName: userInfo.getPropertyName(a => a.disabled), width: '140px' },
                ]
            }));
        });
    }
    async navigateTo(args) {
        await super.navigateTo(args);
        this.grid.load({
            updateOnlyIfDataChanged: true,
            tryPreserveSelectionAndScroll: true
        });
    }
}
AdminUserPage.pageName = 'adminUsers';
//# sourceMappingURL=App.js.map