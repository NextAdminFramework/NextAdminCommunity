
namespace NextAdmin.UI {

    export class RecoverPasswordModal extends NextAdmin.UI.Modal {

        options: RecoverPasswordModalOptions;

        loginInput: NextAdmin.UI.Input;

        sendEmailButton: NextAdmin.UI.Button;

        container: HTMLElement;

        constructor(options?: RecoverPasswordModalOptions) {
            super({
                size: NextAdmin.UI.ModalSize.smallFitContent,
                backdropColor: 'rgba(0,0,0,0.2)',
                title: NextAdmin.Resources.lockIcon + ' ' + Resources.recoverPassword,
                ...options
            });

            this.container = this.body.appendHTML('div', (container) => {
                container.style.padding = '40px';

                this.loginInput = container.appendControl(new NextAdmin.UI.Input({
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    size: NextAdmin.UI.InputSize.large,
                    placeHolder: 'E-mail',
                }), (emailInput) => {
                    emailInput.setValue(this.options.email);
                    emailInput.element.style.marginBottom = '20px';
                });
            });

            this.sendEmailButton = this.rightFooter.appendControl(new NextAdmin.UI.Button({
                css: { cssFloat:'right' },
                style: NextAdmin.UI.ButtonStyle.lightBlue,
                text: Resources.emailIcon + ' ' + Resources.recoverMyPassword,
                action: (button) => {
                    this.sendPasswordRecoveryEmail();
                }
            }));
            this.sendEmailButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(this.loginInput.getValue()), this.loginInput);
        }

        async sendPasswordRecoveryEmail() {
            this.sendEmailButton.startSpin();
            let response = await this.options.userClient.recoverPassword(this.loginInput.getValue());
            this.sendEmailButton.stopSpin();
            if (response?.code == Models.ApiResponseCode.Success) {
                NextAdmin.UI.MessageBox.createOk(Resources.emailSent, Resources.recoverPasswordSuccess);
                this.close();
            }
            else if (response?.code == 'EMAIL_ERROR') {
                NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, Resources.recoverPasswordDefaultError);
                this.close();
            }
            else {
                NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, Resources.recoverPasswordInvalidEmail);
            }
        }
    }

    export interface RecoverPasswordModalOptions extends NextAdmin.UI.ModalOptions {

        userClient?: NextAdmin.Services.UserClient;

        email?: string;
    }

}