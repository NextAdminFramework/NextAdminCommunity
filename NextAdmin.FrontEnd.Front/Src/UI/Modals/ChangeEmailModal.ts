namespace NextAdmin.UI {

    export class ChangeEmailModal extends UI.Modal {

        options: ChangeEmailModalOptions;

        constructor(options?: ChangeEmailModalOptions) {
            super({
                title: Resources.emailIcon + ' ' + Resources.changeEmailModalTitle,
                backdropColor: 'rgba(0,0,0,0.2)',
                size: ModalSize.smallFitContent, ...options
            } as ChangePasswordModalOptions);

            this.body.appendHTML('div', (container) => {
                container.style.padding = '20px';


                let newEmailInput = container.appendControl(new NextAdmin.UI.Input({
                    label: NextAdmin.Resources.newEmail,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    size: NextAdmin.UI.InputSize.large
                }), (input) => {
                    input.element.style.marginBottom = '20px';
                });

                container.appendControl(new Button({
                    text: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.Resources.confirmEmail,
                    style: NextAdmin.UI.ButtonStyle.lightBlue,
                    size: NextAdmin.UI.ButtonSize.large,
                    action: async (button) => {
                        this.startSpin();
                        let step1Response = await this.options.userClient.changeEmailStep1(newEmailInput.getValue());
                        this.stopSpin();
                        if (!step1Response?.isSuccess) {
                            this.displayStep1Error(step1Response);
                            return;

                        }
                        button.element.style.display = 'none';
                        newEmailInput.disable();
                        NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.emailIcon + " " + NextAdmin.Resources.confirmationCode, NextAdmin.Resources.confirmationCodeMessage);

                        let timer = new NextAdmin.Timer();

                        let confirmationCodeInput = container.appendControl(new NextAdmin.UI.Input({
                            label: NextAdmin.Resources.confirmationCode,
                            labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                            size: NextAdmin.UI.InputSize.large
                        }), (confirmationCodeInput) => {
                            confirmationCodeInput.onValueChanged.subscribe((sender, args) => {
                                confirmCodeButton.executeAction();
                            });
                        });
                        confirmationCodeInput.element.style.marginBottom = '20px';

                        let confirmCodeButton = container.appendControl(new NextAdmin.UI.Button({
                            text: NextAdmin.Resources.checkIcon + ' ' + NextAdmin.Resources.validate,
                            style: NextAdmin.UI.ButtonStyle.lightBlue,
                            size: NextAdmin.UI.ButtonSize.large,
                            action: (btn) => {
                                timer.throttle(async () => {
                                    btn.startSpin();
                                    let confirmCodeResponse = await this.options.userClient.changeEmailStep2(newEmailInput.getValue(), confirmationCodeInput.getValue());
                                    btn.stopSpin();
                                    if (confirmCodeResponse?.isSuccess) {
                                        this.close();
                                        if (this.options.onEmailUpdated) {
                                            this.options.onEmailUpdated(newEmailInput.getValue());
                                        }
                                    }

                                }, 100);
                            }
                        }));
                        confirmCodeButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(confirmationCodeInput.getValue()), confirmationCodeInput);

                    }
                }), (btn) => {
                    btn.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(newEmailInput.getValue()), newEmailInput);
                });
            });
        }

        displayStep1Error(apiResponse: NextAdmin.Models.ApiResponse) {
            switch (apiResponse?.code) {
                case 'EMAIL_ALREADY_USED':
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.userAlreadyExist);
                case 'UNABLE_TO_SEND_EMAIL':
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unableToSendEmail);
                case 'INVALID_EMAIL':
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidEmail);
                case 'INVALID_PASSWORD':
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.invalidPassword);
                default:
                    NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unknownError);
            }
        }


    }


    export interface ChangeEmailModalOptions extends NextAdmin.UI.ModalOptions {

        userClient?: NextAdmin.Services.FrontEndUserClient;

        onEmailUpdated?: (newEmai?: string) => void;

    }

}