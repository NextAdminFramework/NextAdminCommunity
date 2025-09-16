namespace NextAdmin.UI {

    export class LoginPage extends NextAdmin.UI.Page {


        navigationController: BackEndAppController;

        buttonLogin: NextAdmin.UI.Button;

        options: LoginPageOptions;

        public static style = `.login-page{height:100vh;background:#79828c} 
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

        constructor(option?: LoginPageOptions) {
            super(option);
        }


        async navigateTo(args: NextAdmin.UI.NavigateToArgs) {
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
                            loginTitle.innerHTML = BackEndResources.userIcon + ' ' + BackEndResources.authentication;
                            loginTitle.classList.add('login-title');
                        });

                        loginPanel.appendHTML('div', (logoContainer) => {
                            logoContainer.style.fontSize = '50px';
                            logoContainer.style.fontWeight = 'bold';
                        });


                        loginPanel.appendHTML('div', (form) => {
                            form.classList.add('form-signin');

                            let userAppIdInput: NextAdmin.UI.Input;

                            let loginInput = form.appendControl(new NextAdmin.UI.Input({ placeHolder: BackEndResources.userName }), (input) => { input.element.style.marginBottom = '10px'; });
                            let passwordInput = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.password, placeHolder: NextAdmin.Resources.password }));
                            passwordInput.input.addEventListener('keyup', (args) => {
                                if (args.keyCode == 13) {
                                    this.tryLogUser(userAppIdInput?.getValue(), loginInput.getValue(), passwordInput.getValue(), stayConnected.getValue());
                                }
                            });
                            let stayConnected = form.appendControl(new NextAdmin.UI.Input({ inputType: NextAdmin.UI.InputType.checkbox, label: BackEndResources.stayConnected, labelWidth: '60%' }), (cb) => {
                                cb.label.classList.add('checkbox');
                            });

                            this.buttonLogin = form.appendControl(new NextAdmin.UI.Button({
                                style: NextAdmin.UI.ButtonStyle.blue,
                                size: NextAdmin.UI.ButtonSize.large,
                                text: NextAdmin.Resources.keyIcon + ' ' + BackEndResources.connection,
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
                                            text: BackEndResources.viewGcu, style: NextAdmin.UI.ButtonStyle.default, action: async () => {
                                                let gcuModal = new NextAdmin.UI.Modal({ title: BackEndResources.gcu, size: NextAdmin.UI.ModalSize.medium });
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

        public async tryLogUser(userAppId: string, login: string, password: string, stayConnected: boolean) {
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

    export interface LoginPageOptions extends PageOptions {

        backgroundImageUrl?: string;

        gcuInfos?: Array<LoginPageGcuInfo>;

    }


    export interface LoginPageGcuInfo {

        url?: string;

        language?: string;

    }

}