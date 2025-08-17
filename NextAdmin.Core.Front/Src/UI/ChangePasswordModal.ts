/// <reference path="Modal.ts"/>


namespace NextAdmin.UI {

    export class ChangePasswordModal extends NextAdmin.UI.Modal {

        options: ChangePasswordModalOptions;

        constructor(options?: ChangePasswordModalOptions) {
            super({
                title: Resources.keyIcon + ' ' + Resources.changePasswordModalTitle,
                backdropColor: 'rgba(0,0,0,0.2)',
                size: ModalSize.smallFitContent, ...options
            } as ChangePasswordModalOptions);

            this.body.appendHTML('div', (container) => {
                container.style.padding = '20px';

                let newPassword1 = container.appendControl(new NextAdmin.UI.Input({
                    label: Resources.newPassword,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    inputType: NextAdmin.UI.InputType.password
                }), (input) => {
                    input.element.style.marginBottom = '20px';
                });

                let newPassword2 = container.appendControl(new NextAdmin.UI.Input({
                    label: Resources.newPasswordRepeat,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    inputType: NextAdmin.UI.InputType.password
                }), (input) => {
                    input.element.style.marginBottom = '20px';
                });

                this.rightFooter.appendControl(new Button({
                    text: NextAdmin.Resources.checkIcon + ' ' + Resources.validate, style: NextAdmin.UI.ButtonStyle.blue,
                    action: async (button) => {
                        if (newPassword1.getValue() != newPassword2.getValue()) {
                            NextAdmin.UI.MessageBox.createOk(Resources.error, Resources.error_passwordAreNotSame);
                            return;
                        }
                        this.startSpin();
                        let response = await this.options.userClient.changePassword(newPassword1.getValue());
                        this.stopSpin();
                        if (response?.isSuccess) {
                            this.close();
                        }
                        else if (response?.code == 'INVALID_PASSWORD') {
                            NextAdmin.UI.MessageBox.createOk(Resources.error, Resources.error_invalidPassword);
                        }
                        else {
                            NextAdmin.UI.MessageBox.createOk(Resources.error, response.message);
                        }
                    }
                }), (btn) => {
                    btn.element.style.cssFloat = 'right';
                    btn.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(newPassword1.getValue()) && !NextAdmin.String.isNullOrEmpty(newPassword2.getValue()), newPassword1, newPassword2);
                });
            });
        }
    }

    export interface ChangePasswordModalOptions extends NextAdmin.UI.ModalOptions{

        userClient?: NextAdmin.Services.UserClient;

    }

}