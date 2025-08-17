namespace NextAdmin.UI {
    export class SignUpModal extends NextAdmin.UI.Modal {

        options: SignUpModalOptions;

        container: HTMLDivElement;

        step1Container: HTMLDivElement;

        step2Container: HTMLDivElement;

        emailInput: NextAdmin.UI.Input;

        passwordInput: NextAdmin.UI.Input;

        confirmationCodeInput: NextAdmin.UI.Input;

        verifyEmailButton: NextAdmin.UI.Button;

        stepOneErrorContainer: HTMLDivElement;

        confirmCodeButton: NextAdmin.UI.Button;

        signInContainer: HTMLDivElement;

        constructor(options: SignUpModalOptions) {
            super({
                title: NextAdmin.Resources.signUp,
                backdropColor: 'rgba(0,0,0,0.2)',
                size: NextAdmin.UI.ModalSize.smallFitContent,
                ...options
            });

            this.container = this.body.appendHTML('div', (container) => {
                container.style.padding = '40px';

                this.step1Container = container.appendHTML('div', (step1Container) => {

                    this.emailInput = step1Container.appendControl(new NextAdmin.UI.Input({
                        label: NextAdmin.Resources.login,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        size: NextAdmin.UI.InputSize.large
                    }));
                    this.emailInput.element.style.marginBottom = '20px';

                    this.passwordInput = step1Container.appendControl(new NextAdmin.UI.Input({
                        label: NextAdmin.Resources.password,
                        inputType: NextAdmin.UI.InputType.password,
                        labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                        size: NextAdmin.UI.InputSize.large
                    }));
                    this.passwordInput.element.style.marginBottom = '20px';
                    this.verifyEmailButton = step1Container.appendControl(new NextAdmin.UI.Button({
                        text: NextAdmin.Resources.checkIcon + ' ' + FrontEndResources.verifyInformations,
                        style: NextAdmin.UI.ButtonStyle.lightBlue,
                        size: NextAdmin.UI.ButtonSize.large,
                        action: async (btn) => {
                            let signUpData = this.getSignUpData();
                            if (signUpData == null) {
                                return;
                            }
                            this.stepOneErrorContainer.innerHTML = "";
                            this.modal.startSpin();
                            let signUpUserResponse = await this.options.userClient.signUpUser(signUpData);
                            this.modal.stopSpin();
                            if (!signUpUserResponse?.isSuccess) {
                                this.stepOneErrorContainer.innerHTML = this.getSignUpErrorMessage(signUpUserResponse) ?? '';
                                return;
                            }
                            step1Container.disable();
                            this.verifyEmailButton.element.style.display = 'none';
                            if (this.signInContainer) {
                                this.signInContainer.style.display = 'none';
                            }

                            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.emailIcon + " " + NextAdmin.Resources.confirmationCode, NextAdmin.Resources.confirmationCodeMessage);

                            let timer = new NextAdmin.Timer();

                            this.confirmationCodeInput = this.step2Container.appendControl(new NextAdmin.UI.Input({
                                label: NextAdmin.Resources.confirmationCode,
                                labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                                size: NextAdmin.UI.InputSize.large
                            }), (confirmationCodeInput) => {
                                confirmationCodeInput.onValueChanged.subscribe((sender, args) => {
                                    this.confirmCodeButton.executeAction();
                                });
                            });
                            this.confirmationCodeInput.element.style.marginBottom = '20px';

                            this.confirmCodeButton = this.step2Container.appendControl(new NextAdmin.UI.Button({
                                text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.Resources.validate,
                                style: NextAdmin.UI.ButtonStyle.lightBlue,
                                size: NextAdmin.UI.ButtonSize.large,
                                action: (btn) => {
                                    timer.throttle(async () => {
                                        btn.startSpin();
                                        let confirmCodeResponse = await this.options.userClient.confirmUserSignUpEmailCode(signUpUserResponse.data, this.confirmationCodeInput.getValue());
                                        btn.stopSpin();
                                        if (confirmCodeResponse?.isSuccess) {
                                            this.close();
                                            this.options.onSignUp(this.emailInput.getValue(), this.passwordInput.getValue())
                                        }
                                    }, 100);
                                }
                            }));

                        }
                    }));
                    this.verifyEmailButton.element.style.marginBottom = '20px';
                    setTimeout(() => {
                        this.verifyEmailButton.changeEnableStateOnControlsRequiredValueChanged(() =>
                            this.getRequiredFormControls().firstOrDefault(a => !a.getValue()) == null,
                            ...this.getRequiredFormControls());
                    }, 1);

                    this.stepOneErrorContainer = step1Container.appendHTML('div', (errorMessageContainer) => {
                        errorMessageContainer.style.color = NextAdmin.UI.DefaultStyle.RedOne;
                    });

                });

                this.step2Container = container.appendHTML('div');

                if (this.options.signInAction) {
                    this.signInContainer = container.appendHTML('div', (footer) => {
                        footer.appendHTML('span', NextAdmin.Resources.haveAnAccount);
                        footer.appendControl(new NextAdmin.UI.Button({
                            text: NextAdmin.Resources.signIn,
                            style: NextAdmin.UI.ButtonStyle.noBgBlue,
                            action: () => {
                                this.close();
                                this.options.signInAction();
                            }
                        }));
                    });
                }

                if (this.options.googleOauthOptions) {
                    container.appendControl(new ThirdPartyOauthPanel({ googleOauthOptions: this.options.googleOauthOptions }));
                }

            });
        }

        getSignUpErrorMessage(apiResponse: NextAdmin.Models.ApiResponse<string>) {
            switch (apiResponse?.code) {
                case 'USER_ALREADY_EXIST':
                    return NextAdmin.Resources.userAlreadyExist;
                case 'UNABLE_TO_SEND_EMAIL':
                    return NextAdmin.Resources.unableToSendEmail;
                case 'INVALID_EMAIL':
                    return NextAdmin.Resources.invalidEmail;
                case 'INVALID_PASSWORD':
                    return NextAdmin.Resources.invalidPassword;
                default:
                    return NextAdmin.Resources.unknownError;
            }
        }


        getSignUpData(): NextAdmin.Models.SignUpUserArgs {
            return {
                email: this.emailInput.getValue(),
                password: this.passwordInput.getValue()
            };
        }

        getRequiredFormControls(): Array<NextAdmin.UI.FormControl> {
            return [this.emailInput, this.passwordInput];
        }

    }

    export interface SignUpModalOptions extends NextAdmin.UI.ModalOptions {

        userClient?: NextAdmin.Services.FrontEndUserClient;

        onSignUp?: (userName?: string, password?: string) => void;

        signInAction?: () => void;

        googleOauthOptions?: GoogleOauthOptions;

    }
}