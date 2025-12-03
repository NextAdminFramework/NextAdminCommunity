/*-----LICENCE------
 * NextAdmin.FrontEnd.js v1.0.0
 * Copyright (c) 2023, Maxime AVART
 * Licensed under the MIT License:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 
------------------*/ 
var NextAdmin;
(function (NextAdmin) {
    class BackEndAppController extends NextAdmin.NavigationController {
        constructor(options) {
            super(options);
            this.onUserLoggedIn = new NextAdmin.EventHandler();
            this.onUserLoggedOut = new NextAdmin.EventHandler();
            this.onStartInitializeApp = new NextAdmin.EventHandler();
            this.onAppInitialized = new NextAdmin.EventHandlerBase();
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
                        document.activeElement.blur();
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
                    NextAdmin.Resources = new NextAdmin.ResourcesEn();
                    NextAdmin.BackEndResources = new NextAdmin.BackEndResourcesEn();
                    break;
                case 'fr':
                    NextAdmin.Resources = new NextAdmin.ResourcesFr();
                    NextAdmin.BackEndResources = new NextAdmin.BackEndResourcesFr();
                    break;
            }
            return this._currentLanguage;
        }
        getCurrentLanguage() {
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
        async navigateTo(pageName, parameters, updateNavigatorState, force) {
            if (pageName == this.options.defaultPageName && this.user != null) {
                return super.navigateTo(this.options.afterLoginPage, null, NextAdmin.UpdateNavigatorState.none);
            }
            return await super.navigateTo(pageName, parameters, updateNavigatorState, force);
        }
        logOutUser(reloadPage = true) {
            NextAdmin.Cookies.delete(this.userClient.authTokenName);
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
                                            text: NextAdmin.Resources.lockIcon + ' ' + NextAdmin.BackEndResources.changePassword,
                                            action: () => {
                                                new NextAdmin.UI.ChangePasswordModal({ userClient: this.userClient }).open();
                                            }
                                        });
                                        topBarDropDownMenuButton.addElement({
                                            text: NextAdmin.BackEndResources.logOutIcon + ' ' + NextAdmin.BackEndResources.logOut,
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
        getDbSet(entityName, queryData) {
            return new NextAdmin.Business.EntityDbSetHandler(this.entityInfos.get(entityName), this.entityClient, queryData);
        }
        getEntityInfo(entityName) {
            return this.entityInfos.get(entityName);
        }
    }
    BackEndAppController.style = `

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
    NextAdmin.BackEndAppController = BackEndAppController;
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    class BackEndResourcesBase {
        constructor() {
            this.logOutIcon = '<i class="fas fa-sign-out"></i>';
            this.userIcon = '<i class="fas fa-user"></i>';
        }
    }
    NextAdmin.BackEndResourcesBase = BackEndResourcesBase;
})(NextAdmin || (NextAdmin = {}));
/// <reference path="BackEndResourcesBase.ts"/>
var NextAdmin;
(function (NextAdmin) {
    class BackEndResourcesEn extends NextAdmin.BackEndResourcesBase {
        constructor() {
            super(...arguments);
            this.logOut = 'Log out';
            this.changePassword = 'Change password';
            this.invalidCredentials = 'Invalid credentials';
            this.connection = 'Connection';
            this.userName = 'User name';
            this.authentication = 'Authentication';
            this.stayConnected = 'Stay connected';
            this.viewGcu = 'View CGU';
            this.gcu = 'GCU';
        }
    }
    NextAdmin.BackEndResourcesEn = BackEndResourcesEn;
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    class BackEndResourcesFr extends NextAdmin.BackEndResourcesEn {
        constructor() {
            super(...arguments);
            this.logOut = 'Se déconnecter';
            this.changePassword = 'Changer de mot de passe';
            this.invalidCredentials = 'Vos informations d’identification ne sont pas valides';
            this.displayUserEntry = "Afficher la fiche utilisateur";
            this.connection = 'Connexion';
            this.userName = 'Identifiant';
            this.authentication = 'Identification';
            this.stayConnected = 'Rester connecté';
            this.viewGcu = 'Voir les CGU';
            this.gcu = 'CGU';
        }
    }
    NextAdmin.BackEndResourcesFr = BackEndResourcesFr;
})(NextAdmin || (NextAdmin = {}));
var NextAdmin;
(function (NextAdmin) {
    var UI;
    (function (UI) {
        class LoginPage extends NextAdmin.UI.Page {
            constructor(option) {
                super(option);
            }
            async navigateTo(args) {
                await super.navigateTo(args);
                NextAdmin.Style.append('LoginPage', LoginPage.style);
                this.element.classList.add('login-page', 'container');
                if (this.options.backgroundImageUrl) {
                    this.element.style.background = 'url(' + this.options.backgroundImageUrl + ') no-repeat center center fixed';
                    this.element.style.backgroundSize = 'cover';
                }
                this.element.appendHTML('div', (backgroundOverlay) => {
                    backgroundOverlay.classList.add('background-overlay');
                    backgroundOverlay.appendHTML('div', (loginPanelContainer) => {
                        loginPanelContainer.classList.add('login-panel-container');
                        loginPanelContainer.center();
                        loginPanelContainer.appendHTML('div', (logoContainer) => {
                            logoContainer.style.height = '50px';
                            logoContainer.appendHTML('img', (logoImage) => {
                                logoImage.src = this.navigationController.options.appLogoUrl;
                                logoImage.style.height = '100%';
                            });
                            logoContainer.style.marginBottom = '25px';
                        });
                        loginPanelContainer.appendHTML('div', (loginPanel) => {
                            loginPanel.classList.add('account-wall');
                            loginPanel.appendHTML('span', (loginTitle) => {
                                loginTitle.innerHTML = NextAdmin.BackEndResources.userIcon + ' ' + NextAdmin.BackEndResources.authentication;
                                loginTitle.classList.add('login-title');
                            });
                            loginPanel.appendHTML('div', (logoContainer) => {
                                logoContainer.style.fontSize = '50px';
                                logoContainer.style.fontWeight = 'bold';
                            });
                            loginPanel.appendHTML('div', (form) => {
                                form.classList.add('form-signin');
                                let userAppIdInput;
                                let loginInput = form.appendControl(new NextAdmin.UI.Input({ placeholder: NextAdmin.BackEndResources.userName }), (input) => { input.element.style.marginBottom = '10px'; });
                                let passwordInput = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.password, placeholder: NextAdmin.Resources.password }));
                                passwordInput.input.addEventListener('keyup', (args) => {
                                    if (args.keyCode == 13) {
                                        this.tryLogUser(userAppIdInput?.getValue(), loginInput.getValue(), passwordInput.getValue(), stayConnected.getValue());
                                    }
                                });
                                let stayConnected = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.checkbox, label: NextAdmin.BackEndResources.stayConnected, labelWidth: '60%' }), (cb) => {
                                    cb.label.classList.add('checkbox');
                                });
                                this.buttonLogin = form.appendControl(new NextAdmin.UI.Button({
                                    style: NextAdmin.UI.ButtonStyle.blue,
                                    size: NextAdmin.UI.ButtonSize.large,
                                    text: NextAdmin.Resources.keyIcon + ' ' + NextAdmin.BackEndResources.connection,
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
                                    if (this.options.gcuInfos?.length) {
                                        let currentLanguage = this.navigationController.getCurrentLanguage();
                                        let gcuInfo = this.options.gcuInfos.firstOrDefault(a => a.language == currentLanguage) ?? this.options.gcuInfos.firstOrDefault(a => a.language == 'en') ?? this.options.gcuInfos.firstOrDefault();
                                        if (gcuInfo) {
                                            footer.appendControl(new NextAdmin.UI.Button({
                                                text: NextAdmin.BackEndResources.viewGcu, style: NextAdmin.UI.ButtonStyle.default, action: async () => {
                                                    let gcuModal = new NextAdmin.UI.Modal({ title: NextAdmin.BackEndResources.gcu, size: NextAdmin.UI.ModalSize.medium });
                                                    gcuModal.open();
                                                    gcuModal.startSpin();
                                                    let httpClient = new NextAdmin.Services.HttpClient();
                                                    let gcu = await httpClient.get(gcuInfo.url);
                                                    gcuModal.stopSpin();
                                                    gcuModal.body.appendHTML('div', (container) => {
                                                        container.style.padding = '20px';
                                                        container.innerHTML = gcu.text;
                                                    });
                                                }
                                            }));
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            }
            async tryLogUser(userAppId, login, password, stayConnected) {
                this.buttonLogin.startSpin();
                if (userAppId) {
                    NextAdmin.Cookies.set('UserAppId', userAppId, stayConnected ? 30 : null);
                }
                let logUserResponse = await this.navigationController.userClient.authUser(login, password, stayConnected);
                this.buttonLogin.stopSpin();
                if (logUserResponse?.isSuccess) {
                    this.navigationController.logUser(logUserResponse.user);
                }
                else {
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidCredentials);
                }
            }
        }
        LoginPage.style = `.login-page{height:100vh;background:#79828c} 
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
        UI.LoginPage = LoginPage;
    })(UI = NextAdmin.UI || (NextAdmin.UI = {}));
})(NextAdmin || (NextAdmin = {}));
//# sourceMappingURL=NextAdmin.BackEnd.js.map