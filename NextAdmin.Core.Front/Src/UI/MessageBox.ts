/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class MessageBox extends Control {


        public modal: HTMLDivElement;

        public modalContent: HTMLDivElement;

        public image?: HTMLImageElement;

        public header: HTMLHeadingElement;

        public body: HTMLParagraphElement;

        public footer: HTMLDivElement;

        public options: MessageBoxOptions;

        private _desktopButtonToolbar: Toolbar;

        private _button = new Array<Button>();

        public static onCreated = new EventHandler<MessageBox, MessageBoxOptions>();


        public static style = `
        .next-admin-msgbox-container { 
            position:fixed;
            left:0px;top:0px;width:100%;
            height:100%;background:rgba(0,0,0,0.1);
            z-index:10000;
        }
        .next-admin-msgbox-modal{
            position:relative;
            min-height:70px;
            width:100%;
            margin:0 auto;
            padding-top:40px;
            padding-bottom:60px;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 100px rgba(0,0,0,0.4);
            top:50%;
            transform:perspective(1px) translateY(-50%);
        }
        .next-admin-msgbox-modal-content {
            height:100%;
            margin-left:15%;
            width:70%;
            position:relative;

            .next-admin-msgbox-modal-image{
                float:left;
                height:100px;
                margin-right:20px;
                border-radius: 5px;
            }

            .next-admin-msgbox-modal-content-header {
                font-weight:bold;
                font-size:20px;
            }
            .next-admin-msgbox-modal-content-body {
                margin-bottom:20px;
                max-height:50vh;
                overflow:auto;
                position:relative;
            }
        }
        .next-admin-msgbox-modal-footer {
            position:relative;
        }
        `;

        public constructor(options: MessageBoxOptions) {
            super('div', options);
            Style.append("MessageBox", MessageBox.style);

            if (this.options.parentContainer == null) {
                this.options.parentContainer = document.body;
            }

            this.element.classList.add('next-admin-msgbox-container');

            this.modal = this.element.appendHTML('div', (modal) => {
                modal.classList.add('next-admin-msgbox-modal');

                this.modalContent = modal.appendHTML('div', (modalContent) => {
                    modalContent.classList.add('next-admin-msgbox-modal-content');

                    if (options.imageUrl) {
                        this.image = modalContent.appendHTML('img', (image) => {
                            image.classList.add('next-admin-msgbox-modal-image');
                            image.src = options.imageUrl;
                        });

                    }


                    this.header = modalContent.appendHTML('div', (header) => {
                        header.classList.add('next-admin-msgbox-modal-content-header');
                        header.innerHTML = this.options.title;
                    });

                    this.body = modalContent.appendHTML('div', (body) => {
                        body.classList.add('next-admin-msgbox-modal-content-body');
                        body.style.overflow = 'auto';
                        if (UserAgent.isDesktop()) {
                            body.appendPerfectScrollbar();
                        }
                        if (this.options.text) {
                            body.innerHTML = this.options.text;
                        }
                    });

                    this.footer = modalContent.appendHTML('div', (footer) => {
                        footer.classList.add('next-admin-msgbox-modal-footer');
                        if (NextAdmin.UserAgent.isDesktop()) {
                            this._desktopButtonToolbar = footer.appendControl(new Toolbar(), (footerToolbar) => {
                                footerToolbar.element.style.cssFloat = 'right';
                            });
                        }
                    });
                    if (this.options.buttons) {
                        for (let button of this.options.buttons) {
                            this.appendButton(button);
                        }
                    }
                });

            });

            MessageBox.onCreated.dispatch(this, this.options);
        }

        appendButton(button: Button) {
            if (NextAdmin.UserAgent.isDesktop()) {
                this._button.add(this._desktopButtonToolbar.appendControl(button));
            }
            else {
                this.footer.appendHTML('div', (btnContainer) => {
                    btnContainer.style.marginTop = '5px';
                    this._button.add(btnContainer.appendControl(button));
                });
            }
        }

        prependButton(button: Button) {
            if (NextAdmin.UserAgent.isDesktop()) {
                this._button.add(this._desktopButtonToolbar.prependControl(button));
            }
            else {
                this.footer.appendHTML('div', (btnContainer) => {
                    btnContainer.style.marginTop = '5px';
                    this._button.add(btnContainer.prependControl(button));
                });
            }
        }

        getButtons(): Array<Button> {
            return this._button;
        }

        startSpin() {
            this.modal.startSpin();
        }

        private static _previousBodyOverflow = null;

        public close() {
            this.element.anim('fadeOut', {
                animationSpeed: AnimationSpeed.faster,
                onEndAnimation: () => {
                    this.element.remove();
                    document.body.style.overflow = MessageBox._previousBodyOverflow;
                    MessageBox._previousBodyOverflow = null;
                }
            });
        }


        public open() {
            if (this.element.parentElement != null)
                return;
            if (MessageBox._previousBodyOverflow == null) {
                MessageBox._previousBodyOverflow = document.body.style.overflow;
            }
            document.body.style.overflow = 'hidden';
            this.options.parentContainer.appendChild(this.element);
            this.element.anim('fadeIn', { animationSpeed: AnimationSpeed.faster });
        }



        public static createOk(title: string, message: string, okAction?: any, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                buttons: [
                    new Button({
                        text: 'OK', action: () => {
                            if (okAction != null) {
                                okAction();
                            }
                            messageBox.close();
                        }
                    })
                ]
            });
            if (parentContainer != null) {
                messageBox.open();
            }
            return messageBox;
        }


        public static createLoading(title = Resources.loading, message = Resources.pleaseWait, cancelAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                buttons: cancelAction ? [new Button({
                    text: Resources.cancel, action: () => {
                        cancelAction(messageBox);
                        messageBox.close();
                    }
                })] : null
            });

            //messageBox.header.style.marginTop = '60px';
            let spinner = NextAdmin.Spinner.createDefault(50);
            //spinner.style.marginTop = '40px';
            spinner.style.marginRight = '20px';
            spinner.style.marginLeft = '20vw';
            spinner.style.cssFloat = 'left';
            messageBox.modal.prepend(spinner);
            if (parentContainer != null) {
                messageBox.open();
            }
            return messageBox;
        }

        public static createYesNo(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, noAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                buttons: [
                    new Button({
                        text: Resources.yes, action: () => {
                            if (yesAction != null) {
                                yesAction(messageBox);
                            }
                            messageBox.close();
                        }
                    }),
                    new Button({
                        text: Resources.no, action: () => {
                            if (noAction != null) {
                                noAction(messageBox);
                            }
                            messageBox.close();
                        }
                    })
                ]
            });
            if (parentContainer != null) {
                messageBox.open();
            }
            return messageBox;
        }


        public static createYesCancel(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, cancelAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                buttons: [
                    new Button({
                        text: Resources.yes, action: () => {
                            if (yesAction != null) {
                                yesAction(messageBox);
                            }
                            messageBox.close();
                        }
                    }),
                    new Button({
                        text: Resources.cancel, action: () => {
                            if (cancelAction != null) {
                                cancelAction(messageBox);
                            }
                            messageBox.close();
                        }
                    })
                ]
            });
            if (parentContainer != null) {
                messageBox.open();
            }
            return messageBox;
        }


    }



    export interface MessageBoxOptions extends ControlOptions {

        title: string;

        text?: string;

        imageUrl?: string;

        buttons?: Array<Button>;

        parentContainer?: Element;

    }



}