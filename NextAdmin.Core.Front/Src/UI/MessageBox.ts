/// <reference path="Control.ts"/>

namespace NextAdmin.UI {

    export class MessageBox extends Control {


        public modal: HTMLDivElement;

        public modalContent: Container;

        public image?: Image;

        public body: HTMLDivElement;

        public bodyLayout: HorizontalFlexLayout;

        public title: Title;

        public text: HTMLDivElement;

        public footer: HTMLDivElement;

        public footerSeparator: Separator;

        public options: MessageBoxOptions;

        private _desktopButtonToolbar: Toolbar;

        private _button = new Array<Button>();


        public static style = `
        .next-admin-msgbox-container { 
            position:fixed;
            left:0px;
            top:0px;
            width:100%;
            height:100%;
            z-index:10000;
        }
        .next-admin-msgbox-modal{
            position:relative;
            min-height:70px;
            width:100%;
            margin:0 auto;
            top:50%;
            transform:perspective(1px) translateY(-50%);
        }
        .next-admin-msgbox-modal-content {
            position:relative;
            display:flex;
            flex-direction:column;
            padding:30px;

            @media (max-width: 1024px) {
                padding-left:20px;
                padding-right:20px;
            }
            @media (max-width: 768px) {
                padding-left:10px;
                padding-right:10px;
            }

            .next-admin-msgbox-modal-content-stretch{
                flex-grow:1;

                .next-admin-msgbox-modal-content-body {
                    margin-bottom:20px;
                    max-height:50vh;
                    overflow:auto;
                    position:relative;
                    color:#444;
                }

            }
        }
        .next-admin-msgbox-modal-footer {
            position:relative;
            padding-top:10px;
        }

        .next-admin-msgbox-container.default{
            background:rgba(0,0,0,0.1);
            .next-admin-msgbox-modal{
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 100px rgba(0,0,0,0.4);
            }

        }
        .next-admin-msgbox-container.modern{
            background:rgba(0,0,0,0.2);
            .next-admin-msgbox-modal-content{
                border-radius:20px;
                background:rgba(255,255,255,1);
                box-shadow:0px 0px 100px rgba(0,0,0,0.4);
                @media (max-width: 512px) {
                    border-radius:10px;
                }
            }
        }

        `;

        public constructor(options: MessageBoxOptions) {
            super('div', {
                style: MessageBoxStyle.modern,
                displayMode: MessageBoxDisplayMode.auto,
                openAnimation: 'fadeIn',
                closeAnimation: 'fadeOut',
                ...options
            } as MessageBoxOptions);
            Style.append("MessageBox", MessageBox.style);

            if (this.options.parentContainer == null) {
                this.options.parentContainer = document.body;
            }

            this.element.classList.add('next-admin-msgbox-container');

            this.modal = this.element.appendHTML('div', (modal) => {
                modal.classList.add('next-admin-msgbox-modal');

                this.modalContent = modal.appendControl(new Container(), (container) => {
                    container.body.classList.add('next-admin-msgbox-modal-content');

                    this.bodyLayout = container.body.appendControl(new NextAdmin.UI.HorizontalFlexLayout(), (bodyLayout) => {

                        if (options.imageSrc) {
                            this.image = bodyLayout.appendControl(new Image({
                                src: options.imageSrc,
                                style: NextAdmin.UI.ImageStyle.lightBordered,
                                width: '160px',
                                height: '120px',
                                css: { minWidth:'160px', margin: 'auto auto', marginRight: '10px' }
                            }));
                        }

                        this.body = bodyLayout.appendHTML('div', (stretchContainer) => {
                            stretchContainer.classList.add('next-admin-msgbox-modal-content-stretch');
                            stretchContainer.appendHTML('div', (centeredContainer) => {
                                centeredContainer.centerVertically();
                                centeredContainer.style.top = '45%';

                                if (!NextAdmin.String.isNullOrEmpty(this.options.title)) {
                                    this.title = centeredContainer.appendControl(new NextAdmin.UI.Title({
                                        size: NextAdmin.UI.TitleSize.medium,
                                        style: NextAdmin.UI.TitleStyle.darkGreyThin,
                                        text: this.options.title,
                                    }));
                                }

                                this.text = centeredContainer.appendHTML('div', (body) => {
                                    body.classList.add('next-admin-msgbox-modal-content-body');
                                    body.style.overflow = 'auto';
                                    if (UserAgent.isDesktop()) {
                                        body.appendPerfectScrollbar();
                                    }
                                    if (this.options.text) {
                                        body.innerHTML = this.options.text;
                                    }
                                });
                            });

                        });
                    });

                    this.footer = container.body.appendHTML('div', (footer) => {
                        footer.classList.add('next-admin-msgbox-modal-footer');
                        this._desktopButtonToolbar = footer.appendControl(new Toolbar(), (footerToolbar) => {
                            footerToolbar.element.style.cssFloat = 'right';
                        });
                        if (this.isMobileDisplayModeEnabled()) {
                            this._desktopButtonToolbar.hide();
                        }
                    });
                    if (this.options.buttons) {
                        for (let button of this.options.buttons) {
                            this.appendButton(button);
                        }
                    }
                });
            });
            this.setStyle(this.options.style);
        }

        appendButton(button: Button) {

            if (this.isMobileDisplayModeEnabled()) {
                this.footer.appendHTML('div', (btnContainer) => {
                    btnContainer.style.padding = '5px';
                    button.element.style.width = '100%';
                    this._button.add(btnContainer.appendControl(button));
                });
            }
            else {
                this._button.add(this._desktopButtonToolbar.appendControl(button));
            }
        }

        prependButton(button: Button) {
            if (this.isMobileDisplayModeEnabled()) {
                this.footer.appendHTML('div', (btnContainer) => {
                    btnContainer.style.padding = '5px';
                    button.element.style.width = '100%';
                    this._button.add(btnContainer.prependControl(button));
                });
            }
            else {
                this._button.add(this._desktopButtonToolbar.prependControl(button));
            }
        }

        isMobileDisplayModeEnabled() {
            return (this.options.displayMode == MessageBoxDisplayMode.auto && window.innerWidth < 512) || this.options.displayMode == MessageBoxDisplayMode.mobile;
        }

        getButtons(): Array<Button> {
            return this._button;
        }

        startSpin() {
            this.modal.startSpin();
        }

        private _currentStyle?: string;
        setStyle(style?: MessageBoxStyle) {
            if (this._currentStyle) {
                this.element.classList.remove(this._currentStyle);
            }
            switch (style) {
                default:
                case MessageBoxStyle.default:
                    this._currentStyle = 'default';
                    break;
                case MessageBoxStyle.modern:
                    this._currentStyle = 'modern';
                    break;
            }
            this.element.classList.add(this._currentStyle);
        }

        public async close() {
            if (this.element.parentElement == null) {
                return;
            }
            await this.element.anim(this.options.closeAnimation, {
                animationSpeed: AnimationSpeed.faster,
                onEndAnimation: () => {
                    this.element.remove();
                }
            });
        }

        public async open() {
            if (this.element.parentElement != null)
                return;

            this.options.parentContainer.appendChild(this.element);
            await this.element.anim(this.options.openAnimation, { animationSpeed: AnimationSpeed.faster });
        }

        public async openToast(displayDuration = 1000) {
            if (!this.getButtons()?.length) {
                this.appendButton(new NextAdmin.UI.Button({
                    text: Resources.closeIcon + ' ' + Resources.close,
                    action: () => {
                        this.close();
                    }
                }));
            }
            await this.open();
            await Timer.sleep(displayDuration);
            await this.close();
        }


        public static createOk(title: string, message?: string, okAction?: any, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                displayMode: MessageBoxDisplayMode.desktop,
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

        public static createUnknownError(okAction?: any, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: Resources.error,
                text: Resources.unknownError,
                parentContainer: parentContainer,
                displayMode: MessageBoxDisplayMode.desktop,
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



        public static createToast(title: string, message: string, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                displayMode: MessageBoxDisplayMode.desktop,
                parentContainer: parentContainer
            });
            if (parentContainer != null) {
                messageBox.openToast();
            }
            return messageBox;
        }


        public static createLoadingBox(title = Resources.loading, message = Resources.pleaseWait, cancelAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                displayMode: MessageBoxDisplayMode.desktop,
                buttons: cancelAction ? [new Button({
                    text: Resources.cancel, action: () => {
                        cancelAction(messageBox);
                        messageBox.close();
                    }
                })] : null
            });
            messageBox.bodyLayout.prependHTML('div', (spinerContainer) => {
                spinerContainer.style.width = '120px';
                spinerContainer.style.height = '120px';
                spinerContainer.style.margin = 'auto auto';
                spinerContainer.startSpin();
            });
            if (parentContainer != null) {
                messageBox.open();
            }
            return messageBox;
        }

        public static createYesNo(title: string, message?: string, yesAction?: (msgBox: MessageBox) => void, noAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                displayMode: MessageBoxDisplayMode.desktop,
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


        public static createYesCancel(title: string, message?: string, yesAction?: (msgBox: MessageBox) => void, cancelAction?: (msgBox: MessageBox) => void, parentContainer = document.body): MessageBox {
            let messageBox = new MessageBox({
                title: title,
                text: message,
                parentContainer: parentContainer,
                displayMode: MessageBoxDisplayMode.desktop,
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

        title?: string;

        text?: string;

        imageSrc?: string;

        buttons?: Array<Button>;

        parentContainer?: Element;

        style?: MessageBoxStyle;

        openAnimation?: string;

        closeAnimation?: string;

        displayMode?: MessageBoxDisplayMode;

    }


    export enum MessageBoxStyle {
        default = 0,
        modern = 1
    }

    export enum MessageBoxDisplayMode {
        auto,
        desktop,
        mobile,
    }


}