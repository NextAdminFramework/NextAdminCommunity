namespace NextAdmin.UI {

    export class SignInModal extends NextAdmin.UI.Modal {

        options: SignInModalOptions;

        userNameInput: NextAdmin.UI.Input;

        passwordInput: NextAdmin.UI.Input;

        rememberMeCheckbox: NextAdmin.UI.Input;

        buttonSignIn: NextAdmin.UI.Button;

        container: HTMLDivElement;

        signInMessageContainer: HTMLSpanElement;

        constructor(options: SignInModalOptions) {
            super({
                title: NextAdmin.Resources.signIn,
                size: NextAdmin.UI.ModalSize.smallFitContent,
                backdropColor: 'rgba(0,0,0,0.2)',
                recoverPasswordModalFactory: (options) => new NextAdmin.UI.RecoverPasswordModal(options),
                ...options
            });


            this.container = this.body.appendHTML('div', (container) => {
                container.style.padding = '40px';

                this.userNameInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.login,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    size: NextAdmin.UI.InputSize.large
                }));
                this.userNameInput.element.style.marginBottom = '20px';

                this.passwordInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.password,
                    inputType: NextAdmin.UI.InputType.password,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    size: NextAdmin.UI.InputSize.large
                }), (passwordInput) => {
                    passwordInput.input.addEventListener('keyup', (args) => {
                        if (args.keyCode == 13) {
                            this.tryLogUser();
                        }
                    });
                });
                this.passwordInput.element.style.marginBottom = '20px';


                container.appendHTML('table', (table) => {
                    table.style.width = '100%';
                    table.style.marginBottom = '20px';
                    table.appendHTML('tr', (tr) => {
                        tr.appendHTML('td', (td) => {
                            td.style.width = '60%';
                            this.rememberMeCheckbox = td.appendControl(new NextAdmin.UI.Input({
                                labelWidth: '70%',
                                inputType: NextAdmin.UI.InputType.checkbox,
                                size: NextAdmin.UI.InputSize.large,
                                value: true,
                                label: NextAdmin.Resources.rememberMe,
                            }));
                        });
                        tr.appendHTML('td', (td) => {
                            td.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.forgottenPassword + ' ?',
                                style: NextAdmin.UI.ButtonStyle.noBgBlue,
                                action: () => {
                                    this.close();
                                    this.options.recoverPasswordModalFactory({
                                        userClient: this.options.userClient,
                                        email: this.userNameInput.getValue(),
                                        onClose: () => {
                                            this.open();
                                        }
                                    }).open();
                                }
                            }));
                        });
                    });
                });

                container.appendHTML('table', (table) => {
                    table.style.marginBottom = '20px';
                    table.appendHTML('tr', (tr) => {
                        tr.appendHTML('td', (td) => {
                            this.buttonSignIn = td.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.keyIcon + ' ' + NextAdmin.Resources.signIn,
                                style: NextAdmin.UI.ButtonStyle.lightBlue,
                                size: NextAdmin.UI.ButtonSize.large,
                                action: () => {
                                    this.tryLogUser();
                                }
                            }));
                            this.buttonSignIn.changeEnableStateOnControlsRequiredValueChanged(() =>
                                !NextAdmin.String.isNullOrEmpty(this.userNameInput.getValue()) && !NextAdmin.String.isNullOrEmpty(this.passwordInput.getValue()),
                                this.userNameInput, this.passwordInput);
                        });
                        tr.appendHTML('td', (td) => {
                            td.style.paddingLeft = '10px';
                            this.signInMessageContainer = td.appendHTML('span');
                            this.signInMessageContainer.style.color = '#cf0e0e';
                            this.signInMessageContainer.style.fontWeight = '600';
                        });
                    });
                });



                if (this.options.signUpAction) {
                    container.appendHTML('div', (footer) => {
                        footer.appendHTML('span', NextAdmin.Resources.noAccount);
                        footer.appendControl(new NextAdmin.UI.Button({
                            text: NextAdmin.Resources.createAccount,
                            style: NextAdmin.UI.ButtonStyle.noBgBlue,
                            action: () => {
                                this.close();
                                this.options.signUpAction();
                            }
                        }));
                    });
                }

                if (this.options.googleOauthOptions) {
                    container.appendControl(new ThirdPartyOauthPanel({ googleOauthOptions: this.options.googleOauthOptions }));
                }

            });
        }

        async tryLogUser() {
            let userName = this.userNameInput.getValue();
            let password = this.passwordInput.getValue();
            if (NextAdmin.String.isNullOrEmpty(userName) || NextAdmin.String.isNullOrEmpty(password))
                return;
            this.signInMessageContainer.innerHTML = '';
            this.modal.startSpin();
            let authTokenResponse = await this.options.userClient.authUser(userName, password, this.rememberMeCheckbox.getValue());
            this.modal.stopSpin();
            if (!authTokenResponse?.isSuccess) {
                this.signInMessageContainer.innerHTML = NextAdmin.Resources.invalidCredentials;
                return;
            }
            if (this.options.onSignIn) {
                this.close();
                this.options.onSignIn(authTokenResponse);
            }
        }
    }

    export interface SignInModalOptions extends NextAdmin.UI.ModalOptions {

        userClient?: NextAdmin.Services.UserClient;

        recoverPasswordModalFactory?: (options?: RecoverPasswordModalOptions) => RecoverPasswordModal;

        signUpAction?: () => void;

        onSignIn?: (authTokenResponse?: NextAdmin.Models.AuthTokenResponse) => void;

        googleOauthOptions?: GoogleOauthOptions;

    }



}