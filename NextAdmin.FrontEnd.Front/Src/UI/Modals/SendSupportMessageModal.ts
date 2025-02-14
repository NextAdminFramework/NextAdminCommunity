namespace NextAdmin.UI {

    export class SendSupportMessageModal extends NextAdmin.UI.Modal {

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
                this.textArea = container.appendControl(new NextAdmin.UI.TextArea({ fillHeight: true }), (textArea) => {
                    textArea.element.style.minHeight = '200px';
                });

                this.sendMessageButton = container.appendControl(new NextAdmin.UI.Button({
                    text: NextAdmin.Resources.emailIcon + ' ' + NextAdmin.FrontEndResources.send,
                    style: NextAdmin.UI.ButtonStyle.lightBlue,
                    size: NextAdmin.UI.ButtonSize.large,
                    action: async () => {
                        this.startSpin();

                        let response = await this.options.commonServicesClient.sendSupportMessage(this.textArea.getValue());
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
                this.sendMessageButton.changeEnableStateOnControlsRequiredValueChanged(() => !NextAdmin.String.isNullOrEmpty(this.textArea.getValue()), this.textArea);
            });
        }
    }


    interface SendSupportMessageModalOptions extends NextAdmin.UI.ModalOptions {


        commonServicesClient?: NextAdmin.Services.FrontEndServiceClient;

    }



}