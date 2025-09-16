namespace NextAdmin.UI {

    export class SendSupportMessageModal extends NextAdmin.UI.Modal {

        emailInput: NextAdmin.UI.Input;

        textArea: NextAdmin.UI.TextArea;

        sendMessageButton: NextAdmin.UI.Button;

        options: SendSupportMessageModalOptions;

        constructor(options: SendSupportMessageModalOptions) {
            super({
                title: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.FrontEndResources.contact,
                size: NextAdmin.UI.ModalSize.smallFitContent,
                backdropColor: 'rgba(0,0,0,0.2)',
                ...options
            });

            this.body.appendHTML('div', container => {
                container.style.padding = '20px';

                this.emailInput = container.appendControl(new NextAdmin.UI.Input({
                    inputType: NextAdmin.UI.InputType.email,
                    labelPosition: NextAdmin.UI.FormControlLabelPosition.top,
                    label: 'E-mail',
                    value: this.options.email,
                    required: true,
                    css: {
                        marginBottom: '20px'
                    }
                }));

                this.textArea = container.appendControl(new NextAdmin.UI.TextArea({
                    displayMode: NextAdmin.UI.TextAreaDisplayMode.stretchHeight,
                    css: {
                        minHeight: '200px',
                        marginBottom: '20px'
                    }
                }));

                this.sendMessageButton = container.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.FrontEndResources.send,
                    style: NextAdmin.UI.ButtonStyle.lightBlue,
                    size: NextAdmin.UI.ButtonSize.large,
                    css: { cssFloat: 'right' },
                    action: async () => {
                        this.startSpin();

                        let response = await this.options.commonServicesClient.sendContactMessage(this.textArea.getValue(), this.emailInput.getValue());
                        if (response?.isSuccess) {
                            this.close();
                            NextAdmin.UI.MessageBox.createOk(NextAdmin.FrontEndResources.messageSentTitle, NextAdmin.FrontEndResources.messageSentText);
                        }
                        else {
                            NextAdmin.UI.MessageBox.createOk(NextAdmin.Resources.error, NextAdmin.Resources.unknownError);
                        }

                        this.stopSpin();

                    }
                }));
                this.sendMessageButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(this.textArea.getValue()) && !NextAdmin.String.isNullOrEmpty(this.emailInput.getValue()), this.textArea, this.emailInput);
            });
        }
    }


    interface SendSupportMessageModalOptions extends NextAdmin.UI.ModalOptions {


        commonServicesClient?: NextAdmin.Services.FrontEndServiceClient;

        email?: string;

    }



}