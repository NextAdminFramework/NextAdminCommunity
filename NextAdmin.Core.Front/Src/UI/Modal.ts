/// <reference path="Control.ts"/>
/// <reference path="Toolbar.ts"/>

namespace NextAdmin.UI {

    export class Modal extends Control {

        public static defaultStyle?: ModalStyle;

        public modal: HTMLElement;

        public header: HTMLDivElement;

        public leftHeader: HTMLDivElement;

        public rightHeader: HTMLDivElement;

        public title: HTMLElement;

        public buttonClose: HTMLDivElement;

        public buttonFullScreen: HTMLDivElement;

        public buttonMinimize: HTMLDivElement;

        public body: HTMLDivElement;

        public footer: HTMLDivElement;

        public leftFooter: HTMLDivElement;

        public rightFooter: HTMLDivElement;

        public options: ModalOptions;

        public onClose = new EventHandler<any, CloseModalArgs>();

        public onClosed = new EventHandler<any, CloseModalArgs>();

        public onOpen = new EventHandler<any, any>();

        public onOpened = new EventHandler<any, any>();

        public onTitleChanged = new EventHandler<Modal, string>();

        protected _minimizedButton: Button;

        public static style = '.next-admin-modal-btn-close{border-top-right-radius:4px}'
            + '.next-admin-modal-toolbar-button{ display:inline-block;float:right;font-size:20px;height:32px;width:32px;text-align:center;cursor:pointer }'
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-ultra-large{ margin:0 auto;margin-top:4vh;width:80%;height:95%; } }'
            + '@media (max-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-ultra-large{ margin:0 auto;margin-top:0vh;width:100%;height:100%; } .next-admin-modal-autosizing.next-admin-modal-ultra-large .next-admin-modal-button-full-screen{display:none} }'

            + '@media (max-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-large{ margin:0 auto;margin-top:0vh;width:100%;height:100%; } }'
            + '@media (min-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-large{ margin:0 auto;margin-top:5vh;width:90%;height:90%; } }'
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-large{ margin:0 auto;margin-top:5vh;width:80%;height:90%;max-width:1400px } }'

            + '@media (max-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium-large{ margin:0 auto;margin-top:0vh;width:100%;height:100%; } }'
            + '@media (min-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium-large{ margin:0 auto;margin-top:5vh;width:90%;height:90%; } }'
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-medium-large{ margin:0 auto;margin-top:5vh;width:70%;height:90%;max-width:1200px } }'

            + '@media (max-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium{ margin:0 auto;margin-top:0vh;width:100%;height:100%; } }'
            + '@media (min-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium{ margin:0 auto;margin-top:5vh;width:70%;height:90%; } }'
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-medium{ margin:0 auto;margin-top:5vh;width:50%;height:90%;max-width:900px } }'

            + '@media (max-width: 600px) { .next-admin-modal-autosizing.next-admin-modal-small{ margin:0 auto;margin-top:0vh;width:100%;height:100%; } }'
            + '@media (min-width: 600px) { .next-admin-modal-autosizing.next-admin-modal-small{ margin:0 auto;margin-top:5vh;width:70%;height:90%; } }'
            + '@media (min-width: 900px) { .next-admin-modal-autosizing.next-admin-modal-small{ margin:0 auto;margin-top:5vh;width:50%;height:90%; } }'
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-small{ margin:0 auto;margin-top:5vh;width:35%;height:90%;max-width:600px } }'


            + '.next-admin-modal-autosizing.next-admin-modal-small-fit-content{ top:50%;transform:perspective(1px) translateY(-50%) }'
            + '@media (max-width: 600px) { .next-admin-modal-autosizing.next-admin-modal-small-fit-content{ margin:auto auto;width:100%; } }'
            + '@media (min-width: 600px) { .next-admin-modal-autosizing.next-admin-modal-small-fit-content{ margin:auto auto;width:70%; } }'//small modal
            + '@media (min-width: 900px) { .next-admin-modal-autosizing.next-admin-modal-small-fit-content{ margin:auto auto;width:50%; } }'//small modal
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-small-fit-content{ margin:auto auto;width:35%;max-width:600px } }'//small modal


            + '.next-admin-modal-autosizing.next-admin-modal-medium-fit-content{ top:50%;transform:perspective(1px) translateY(-50%) }'
            + '@media (max-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium-fit-content{ margin:auto auto;width:100%; } }'
            + '@media (min-width: 800px) { .next-admin-modal-autosizing.next-admin-modal-medium-fit-content{ margin:auto auto;width:80%; } }'//small modal
            + '@media (min-width: 1280px) { .next-admin-modal-autosizing.next-admin-modal-medium-fit-content{ margin:auto auto;width:50%;max-width:900px } }'//small modal

            + '.next-admin-modal .next-admin-panel-header{border-radius:0px;border-top:0px;border-left:0px;border-right:0px;} .next-admin-modal .next-admin-panel-footer{border-radius:0px;border-bottom:0px;border-left:0px;border-right:0px;} .next-admin-modal .next-admin-panel-body{border-left:0px;border-right:0px;border-bottom:0px}'
            + '.next-admin-modal-full-screen{ margin:0 auto !important;margin-top:0vh !important;width:100% !important;height:100% !important;max-width:unset !important; }'//large screens;
            + `

            .next-admin-modal-backdrop{
                position:fixed;
                top:0px;
                left:0px;
                width:100%;
                height:100%;
                z-index:9999;
            }

            .next-admin-modal{
                max-height:100%;
                position:relative;
                display:flex;
                flex-direction:column;
                box-shadow:0px 0px 4px rgba(0,0,0,0.4);
                border-radius: 4px;
                .next-admin-modal-body {
                    position:relative;
                }
            }

            .next-admin-modal-left-header{
                padding:8px;
            }

            .next-admin-modal-right-header{
                padding:8px;
            }

            .modal-btn-hover{
                text-shadow:0px 0px 2px rgba(0,0,0,0.2);
                font-weight:bold;
            }
            
            .next-admin-modal-default{

                background:rgba(255,255,255,1);

                .next-admin-modal-header{
                    width:100%;
                    border-bottom:1px solid rgba(0,0,0,0.2);
                    color:#222;
                }

                .next-admin-modal-footer{
                    width:100%;
                    border-top:1px solid rgba(0,0,0,0.2);
                }
            }       

            .next-admin-modal-modern{

                background:#fff;
                box-shadow:0px 0px 100px rgba(0,0,0,0.2);
                border-radius: 8px;
                border:1px solid #ddd;
                
                .next-admin-modal-header{
                    width:100%;
                    color:#222;
                }

                .next-admin-modal-body{
                    background:#fff;
                }

                .next-admin-modal-footer{
                    width:100%;
                }
                .next-admin-modal-left-footer{
                    padding:5px;
                }
                .next-admin-modal-right-footer{
                    padding:5px;
                }
            }

            .btn-modal-active{
                border:1px solid #12101d;
            }

            .next-admin-modal-body .ps__rail-y{
                z-index:10;
            }            
            `;
        public static onCreated = new EventHandler<Modal, ModalOptions>();

        public constructor(options?: ModalOptions) {
            super('div', {
                style: Modal.defaultStyle,
                canChangeScreenMode: (options == null || (options.size != ModalSize.smallFitContent && options.size != ModalSize.mediumFitContent)) && NextAdmin.UserAgent.isDesktop(),
                parentElement: document.body,
                size: ModalSize.ultraLarge,
                hasBodyOverflow: true,
                removeOnClose: true,
                canClose: true,
                hasHeader: true,
                hasFooter: true,
                openAnimation: 'zoomIn',
                closeAnimation: 'zoomOut',
                minimizeAnimation: 'fadeOutDown',
                maximizeAnimation: 'fadeInUp',
                canMoveAndResize: NextAdmin.UserAgent.isDesktop() && (options == null || (options.size != ModalSize.smallFitContent && options.size != ModalSize.mediumFitContent)),
                minModalManualSizingWidth: options == null || options.size != ModalSize.smallFitContent ? 400 : 50,
                minModalManualSizingHeight: options == null || options.size != ModalSize.smallFitContent ? 400 : 50,
                canModalManualSizingOverlapBrowserWindow: document.body.style.overflow == 'hidden',
                ...options
            } as ModalOptions);
            if (this.options.canMinimize && Modal.getMinimizedModalToolbar().element.parentElement == null) {
                this.options.canMinimize = false;
            }
            if (this.options.blockBackgroundEvents === undefined && !this.options.canMinimize) {
                this.options.blockBackgroundEvents = true;
            }

            Style.append('Modal', Modal.style);
            this.element.classList.add('next-admin-modal-backdrop');
            if (this.options.backdropColor) {
                this.element.style.background = this.options.backdropColor;
                this.element.anim('fadeIn', { animationSpeed: AnimationSpeed.faster });
            }


            this.modal = this.element.appendHTML('div', (modal) => {
                modal.classList.add('next-admin-modal');
                modal.classList.add('next-admin-modal-autosizing');

                modal.addEventListener('pointerdown', () => {
                    this.passToTop();
                });


                this.header = modal.appendHTML('div', (header) => {
                    header.classList.add('next-admin-modal-header');
                    if (!this.options.hasHeader) {
                        header.style.display = 'none';
                    }

                    header.appendHTML('table', (table) => {
                        table.style.width = '100%';
                        table.style.borderSpacing = '0px';
                        table.appendHTML('tr', (tr) => {
                            this.leftHeader = tr.appendHTML('td', (leftheader) => {
                                leftheader.classList.add('next-admin-modal-left-header');

                                this.title = leftheader.appendHTML('span', (title) => {
                                    title.style.marginLeft = '10px';
                                    //title.style.fontWeight = 'bold';
                                }) as HTMLElement;

                            });
                            this.rightHeader = tr.appendHTML('td', (rightHeader) => {
                                rightHeader.classList.add('next-admin-modal-right-header');

                                this.buttonClose = rightHeader.appendHTML('div', (buttonClose) => {
                                    buttonClose.innerHTML = '✕';
                                    buttonClose.classList.add('next-admin-modal-toolbar-button');
                                    buttonClose.classList.add('next-admin-modal-btn-close');

                                    buttonClose.addEventListener('pointerenter', () => {
                                        buttonClose.classList.add('modal-btn-hover');
                                    });
                                    buttonClose.addEventListener('pointerleave', () => {
                                        buttonClose.classList.remove('modal-btn-hover');
                                    });
                                    buttonClose.addEventListener('pointerdown', (e) => {
                                        e.stopPropagation();
                                    });

                                    buttonClose.addEventListener('click', () => {
                                        this.close();
                                    });
                                    if (!this.options.canClose) {
                                        buttonClose.style.display = 'none';
                                    }

                                }) as HTMLDivElement;


                                this.buttonFullScreen = rightHeader.appendHTML('div', (buttonFullScreen) => {
                                    buttonFullScreen.innerHTML = '⛶';
                                    buttonFullScreen.classList.add('next-admin-modal-toolbar-button');
                                    buttonFullScreen.classList.add('next-admin-modal-button-full-screen');
                                    buttonFullScreen.addEventListener('pointerenter', () => {
                                        buttonFullScreen.classList.add('modal-btn-hover');
                                    });
                                    buttonFullScreen.addEventListener('pointerleave', () => {
                                        buttonFullScreen.classList.remove('modal-btn-hover');
                                    });
                                    buttonFullScreen.addEventListener('pointerdown', (e) => {
                                        e.stopPropagation();
                                    });
                                    buttonFullScreen.addEventListener('click', () => {
                                        this.toggleFullScreen();
                                    });

                                    if (this.options.canChangeScreenMode != true) {
                                        buttonFullScreen.style.display = 'none';
                                    }
                                }) as HTMLDivElement;

                                this.buttonMinimize = rightHeader.appendHTML('div', (buttonMinimize) => {
                                    buttonMinimize.innerHTML = '-';
                                    buttonMinimize.classList.add('next-admin-modal-toolbar-button');
                                    buttonMinimize.addEventListener('pointerenter', () => {
                                        buttonMinimize.classList.add('modal-btn-hover');
                                    });
                                    buttonMinimize.addEventListener('pointerleave', () => {
                                        buttonMinimize.classList.remove('modal-btn-hover');
                                    });
                                    buttonMinimize.addEventListener('pointerdown', (e) => {
                                        e.stopPropagation();
                                    });
                                    buttonMinimize.addEventListener('click', () => {
                                        this.minimize();
                                    });

                                    if (!this.options.canMinimize) {
                                        buttonMinimize.style.display = 'none';
                                    }
                                }) as HTMLDivElement;

                            });

                        });
                    });
                }) as HTMLDivElement;

                this.body = modal.appendHTML('div', (body) => {
                    body.classList.add('next-admin-modal-body');
                    body.style.width = '100%';
                    body.style.flexGrow = '1';
                    if (this.options.hasBodyOverflow) {
                        //body.appendPerfectScrollbar();
                        body.style.overflow = 'auto';
                    }
                }) as HTMLDivElement;

                this.footer = modal.appendHTML('div', (footer) => {
                    footer.classList.add('next-admin-modal-footer');
                    if (!this.options.hasFooter) {
                        footer.style.display = 'none';
                    }
                    footer.appendHTML('table', (table) => {
                        table.style.width = '100%';
                        table.appendHTML('tr', (tr) => {
                            this.leftFooter = tr.appendHTML('td', (leftFooter) => {
                                leftFooter.classList.add('next-admin-modal-left-footer');
                            });
                            this.rightFooter = tr.appendHTML('td', (rightFooter) => {
                                rightFooter.classList.add('next-admin-modal-right-footer');
                            });

                        });
                    });
                }) as HTMLDivElement;
            });

            this.setSize(this.options.size);
            this.setStyle(this.options.style);

            if (this.options.startFullScreen) {
                this.enableFullScreen();
            }
            if (this.options.canMoveAndResize) {
                this.enableMoveAndResize();
            }
            if (!this.options.blockBackgroundEvents) {
                this.element.style.pointerEvents = 'none';
                this.modal.style.pointerEvents = 'all';
            }
            if (this.options.title) {
                this.setTitle(this.options.title);
            }
            Modal.onCreated.dispatch(this, this.options);
        }


        protected _key: string;
        public getKey(): string {
            return this._key;
        }


        private _currentModalSizeClass = null;
        public setSize(size: ModalSize) {
            if (this._currentModalSizeClass) {
                this.modal.classList.remove(this._currentModalSizeClass);
            }
            switch (size) {
                case ModalSize.small:
                    this._currentModalSizeClass = 'next-admin-modal-small';
                    break;
                case ModalSize.smallFitContent:
                    this._currentModalSizeClass = 'next-admin-modal-small-fit-content';
                    break;
                case ModalSize.medium:
                    this._currentModalSizeClass = 'next-admin-modal-medium';
                    break;
                default:
                case ModalSize.mediumFitContent:
                    this._currentModalSizeClass = 'next-admin-modal-medium-fit-content';
                    break;
                case ModalSize.mediumLarge:
                    this._currentModalSizeClass = 'next-admin-modal-medium-large';
                    break;
                case ModalSize.large:
                    this._currentModalSizeClass = 'next-admin-modal-large';
                    break;
                case ModalSize.ultraLarge:
                    this._currentModalSizeClass = 'next-admin-modal-ultra-large';
                    break;
            }
            this.modal.classList.add(this._currentModalSizeClass);
        }

        public setStyle(style?: ModalStyle) {
            switch (style) {
                default:
                case ModalStyle.default:
                    this.modal.classList.add('next-admin-modal-default');
                    break;
                case ModalStyle.modern:
                    this.modal.classList.add('next-admin-modal-modern');
                    break;
            }
        }



        public static startTopZIndex = 1000;
        private static _minimizedModalToolbar: Toolbar;
        public static getMinimizedModalToolbar() {
            if (Modal._minimizedModalToolbar == null) {
                Modal._minimizedModalToolbar = new Toolbar();
            }
            return Modal._minimizedModalToolbar;
        }

        public static activModals = new Array<Modal>();
        private static registerModal(modal: Modal) {
            if (modal.isRegistered()) {
                return;
            }
            let modalToolbar = Modal.getMinimizedModalToolbar();
            modalToolbar.appendControl(new UI.Button({
                text: modal.getTitle(),
                action: (btn) => {
                    modalToolbar.element.querySelectorAll('.btn-modal-active').forEach(otherBtn => otherBtn.classList.remove('btn-modal-active'));
                    if (!modal.isOpen()) {
                        modal.maximize();
                    }
                    else {
                        if (Modal.activModals.max(e => e.getZIndex()) == modal.getZIndex()) {
                            modal.minimize();
                        }
                        else {
                            modal.passToTop();
                        }
                    }
                }
            }), (btn) => {
                modal._minimizedButton = btn;
                modalToolbar.element.querySelectorAll('.btn-modal-active').forEach(otherBtn => otherBtn.classList.remove('btn-modal-active'));
                btn.element.classList.add('btn-modal-active');
            });
            Modal.activModals.add(modal);
        }

        private static unRegisterModal(modal: Modal) {
            Modal.activModals.remove(modal);
            Modal.getMinimizedModalToolbar().removeControl(modal._minimizedButton);
        }

        public static getRegisteredModal(key?: string) {
            return Modal.activModals.firstOrDefault(e => e.getKey() == key);;
        }


        private _documentPointerMoveEvent: any;
        private _documentPointerUpEvent: any;
        enableMoveAndResize() {

            this.modal.disableUserSelection();
            let initModalManualSizing = () => {

                let boundingRect = this.modal.getBoundingClientRect();

                this.modal.classList.remove('next-admin-modal-autosizing');
                this.modal.style.marginLeft = (boundingRect.left / window.innerWidth) * 100 + 'vw';
                this.modal.style.width = (boundingRect.width / window.innerWidth) * 100 + 'vw';
                this.modal.style.minWidth = this.options.minModalManualSizingWidth + 'px';
                this.modal.style.marginRight = '';

                this.modal.style.marginTop = (boundingRect.top / window.innerHeight) * 100 + 'vh';
                this.modal.style.height = (boundingRect.height / window.innerHeight) * 100 + 'vh';
                this.modal.style.minHeight = this.options.minModalManualSizingHeight + 'px';
                this.modal.style.marginBottom = '';
            }


            let startPointerPosition: {
                x: number,
                y: number
            };
            let startModalClientRect: DOMRect;


            let disabler: HTMLDivElement;


            let startMoveOrResize = (args: PointerEvent) => {
                startPointerPosition = { x: args.clientX, y: args.clientY };
                startModalClientRect = this.modal.getBoundingClientRect();

                disabler = this.body.appendHTML('div', (disabler) => {
                    disabler.style.position = 'absolute';
                    disabler.style.left = '0px';
                    disabler.style.top = '0px';
                    disabler.style.width = '100%';
                    disabler.style.height = '100%';

                });
            };

            let isDragging = false;
            let isResizeRight = false;
            let isResizeLeft = false;
            let isResizeTop = false;
            let isResizeBottom = false;

            this.header.addEventListener('pointerdown', (args) => {
                if (args.button == 0 && !this._isFullScreen) {
                    startMoveOrResize(args);
                    isDragging = true;
                }
            });


            this.modal.appendHTML('div', (resizeHandLeft) => {
                resizeHandLeft.style.position = 'absolute';
                resizeHandLeft.style.left = this.options.canModalManualSizingOverlapBrowserWindow ? '-2px' : '0px';
                resizeHandLeft.style.top = '0px';
                resizeHandLeft.style.height = '100%';
                resizeHandLeft.style.width = '4px';
                resizeHandLeft.style.cursor = 'ew-resize';
                resizeHandLeft.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeLeft = true;
                    }
                });
            });

            this.modal.appendHTML('div', (resizeHandRight) => {
                resizeHandRight.style.position = 'absolute';
                resizeHandRight.style.right = this.options.canModalManualSizingOverlapBrowserWindow ? '-2px' : '0px';
                resizeHandRight.style.top = '0px';
                resizeHandRight.style.height = '100%';
                resizeHandRight.style.width = '4px';
                resizeHandRight.style.cursor = 'ew-resize';
                resizeHandRight.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeRight = true;
                    }
                });
            });

            this.modal.appendHTML('div', (resizeHandleTop) => {
                resizeHandleTop.style.position = 'absolute';
                resizeHandleTop.style.left = '0px';
                resizeHandleTop.style.top = this.options.canModalManualSizingOverlapBrowserWindow ? '-2px' : '0px';
                resizeHandleTop.style.height = '4px';
                resizeHandleTop.style.width = '100%';
                resizeHandleTop.style.cursor = 'ns-resize';
                resizeHandleTop.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeTop = true;
                    }
                });
            });

            this.modal.appendHTML('div', (resizeHandleBottom) => {
                resizeHandleBottom.style.position = 'absolute';
                resizeHandleBottom.style.left = '0px';
                resizeHandleBottom.style.bottom = this.options.canModalManualSizingOverlapBrowserWindow ? '-2px' : '0px';
                resizeHandleBottom.style.height = '4px';
                resizeHandleBottom.style.width = '100%';
                resizeHandleBottom.style.cursor = 'ns-resize';
                resizeHandleBottom.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeBottom = true;
                    }
                });
            });


            this.modal.appendHTML('div', (resizeHandCornerTopLeft) => {
                resizeHandCornerTopLeft.style.position = 'absolute';
                resizeHandCornerTopLeft.style.left = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerTopLeft.style.top = this.options.canModalManualSizingOverlapBrowserWindow ? '-3x' : '0px';
                resizeHandCornerTopLeft.style.height = '6px';
                resizeHandCornerTopLeft.style.width = '6px';
                resizeHandCornerTopLeft.style.cursor = 'nwse-resize';
                resizeHandCornerTopLeft.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeTop = true;
                        isResizeLeft = true;
                    }
                });
            });

            this.modal.appendHTML('div', (resizeHandCornerTopRight) => {
                resizeHandCornerTopRight.style.position = 'absolute';
                resizeHandCornerTopRight.style.right = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerTopRight.style.top = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerTopRight.style.height = '6px';
                resizeHandCornerTopRight.style.width = '6px';
                resizeHandCornerTopRight.style.cursor = 'nesw-resize';
                resizeHandCornerTopRight.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeTop = true;
                        isResizeRight = true;
                    }
                });
            });


            this.modal.appendHTML('div', (resizeHandCornerBottomLeft) => {
                resizeHandCornerBottomLeft.style.position = 'absolute';
                resizeHandCornerBottomLeft.style.left = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerBottomLeft.style.bottom = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerBottomLeft.style.height = '6px';
                resizeHandCornerBottomLeft.style.width = '6px';
                resizeHandCornerBottomLeft.style.cursor = 'nesw-resize';
                resizeHandCornerBottomLeft.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeBottom = true;
                        isResizeLeft = true;
                    }
                });
            });

            this.modal.appendHTML('div', (resizeHandCornerBottomRight) => {
                resizeHandCornerBottomRight.style.position = 'absolute';
                resizeHandCornerBottomRight.style.right = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerBottomRight.style.bottom = this.options.canModalManualSizingOverlapBrowserWindow ? '-3px' : '0px';
                resizeHandCornerBottomRight.style.height = '6px';
                resizeHandCornerBottomRight.style.width = '6px';
                resizeHandCornerBottomRight.style.cursor = 'nwse-resize';
                resizeHandCornerBottomRight.addEventListener('pointerdown', (args) => {
                    if (args.button == 0 && !this._isFullScreen) {
                        startMoveOrResize(args);
                        isResizeBottom = true;
                        isResizeRight = true;
                    }
                });
            });


            document.addEventListener('pointerup', this._documentPointerUpEvent = (args: PointerEvent) => {
                isDragging = false;
                isResizeLeft = false;
                isResizeRight = false;
                isResizeTop = false;
                isResizeBottom = false;
                startPointerPosition = null;
                if (disabler != null) {
                    disabler.remove();
                    disabler = null;
                }
            });


            document.addEventListener('pointermove', this._documentPointerMoveEvent = (args: PointerEvent) => {
                if (isDragging || isResizeLeft || isResizeRight || isResizeTop || isResizeBottom) {
                    if (this.modal.classList.contains('next-admin-modal-autosizing')) {//start move modal
                        initModalManualSizing();
                    }
                }
                if (startPointerPosition == null) {
                    return;
                }

                let distanceX = args.clientX - startPointerPosition.x;
                let distanceY = args.clientY - startPointerPosition.y;

                let distancePercentX = distanceX / window.innerWidth * 100;
                let distancePercentY = distanceY / window.innerHeight * 100;

                let originalModalPercentX = startModalClientRect.left / window.innerWidth * 100;
                let originalModalPercentY = startModalClientRect.top / window.innerHeight * 100;

                let originalModalPercentWidth = startModalClientRect.width / window.innerWidth * 100;
                let originalModalPercentHeight = startModalClientRect.height / window.innerHeight * 100;

                let minModalManualSizingScreenPercentSize = this.options.minModalManualSizingWidth / window.innerWidth * 100;
                let minModalManualSizingScreenPercentHeight = this.options.minModalManualSizingHeight / window.innerHeight * 100;

                if (isDragging) {
                    let newModalPercentX = originalModalPercentX + distancePercentX;
                    let newModalPercentY = originalModalPercentY + distancePercentY;
                    if (!this.options.canModalManualSizingOverlapBrowserWindow) {
                        if (newModalPercentX < 0) {
                            newModalPercentX = 0;
                        }
                        if (newModalPercentX + originalModalPercentWidth > 100) {
                            newModalPercentX = 100 - originalModalPercentWidth;
                        }
                        if (newModalPercentY < 0) {
                            newModalPercentY = 0;
                        }
                        if (newModalPercentY + originalModalPercentHeight > 100) {
                            newModalPercentY = 100 - originalModalPercentHeight;
                        }
                    }
                    if (args.clientX < window.innerWidth && args.clientX > 0) {
                        this.modal.style.marginLeft = newModalPercentX + 'vw';
                    }
                    if (args.clientY < window.innerHeight && args.clientY > 0) {
                        this.modal.style.marginTop = newModalPercentY + 'vh';
                    }
                }
                if (isResizeLeft) {
                    let newModalPercentX = originalModalPercentX + distancePercentX;
                    if (newModalPercentX < 0) {
                        newModalPercentX = 0;
                    }
                    let newModalPercentWidth = originalModalPercentWidth + (originalModalPercentX - newModalPercentX);
                    if (newModalPercentWidth < minModalManualSizingScreenPercentSize) {
                        newModalPercentX = newModalPercentX - (minModalManualSizingScreenPercentSize - newModalPercentWidth);
                        newModalPercentWidth = minModalManualSizingScreenPercentSize;
                    }
                    this.modal.style.marginLeft = newModalPercentX + 'vw';
                    this.modal.style.width = newModalPercentWidth + 'vw';
                }
                if (isResizeRight) {
                    let newModalPercentWidth = originalModalPercentWidth + distancePercentX;
                    if (newModalPercentWidth + originalModalPercentX > 100) {
                        newModalPercentWidth = 100 - originalModalPercentX;
                    }
                    if (newModalPercentWidth < minModalManualSizingScreenPercentSize) {
                        newModalPercentWidth = minModalManualSizingScreenPercentSize;
                    }
                    this.modal.style.width = newModalPercentWidth + 'vw';
                }
                if (isResizeTop) {
                    let newModalPercentY = originalModalPercentY + distancePercentY;
                    if (newModalPercentY < 0) {
                        newModalPercentY = 0;
                    }
                    let newModalPercentHeight = originalModalPercentHeight + (originalModalPercentY - newModalPercentY);
                    if (newModalPercentHeight < minModalManualSizingScreenPercentHeight) {
                        newModalPercentY = newModalPercentY - (minModalManualSizingScreenPercentHeight - newModalPercentHeight);
                        newModalPercentHeight = minModalManualSizingScreenPercentHeight;
                    }
                    this.modal.style.marginTop = newModalPercentY + 'vh';
                    this.modal.style.height = newModalPercentHeight + 'vh';
                }

                if (isResizeBottom) {
                    let newModalPercentHeight = originalModalPercentHeight + distancePercentY;
                    if (newModalPercentHeight + originalModalPercentY > 100) {
                        newModalPercentHeight = 100 - originalModalPercentY;
                    }
                    if (newModalPercentHeight < minModalManualSizingScreenPercentSize) {
                        newModalPercentHeight = minModalManualSizingScreenPercentSize;
                    }
                    this.modal.style.height = newModalPercentHeight + 'vh';
                }
            });

        }


        private _previousManualSizingValues: any;
        private _isFullScreen = false;
        enableFullScreen() {
            if (this._isFullScreen)
                return;
            if (!this.modal.classList.contains('next-admin-modal-autosizing')) {
                this._previousManualSizingValues = {};
                this._previousManualSizingValues.marginLeft = this.modal.style.marginLeft;
                this._previousManualSizingValues.width = this.modal.style.width;
                this._previousManualSizingValues.minWidth = this.modal.style.minWidth;
                this._previousManualSizingValues.marginRight = this.modal.style.marginRight;
                this._previousManualSizingValues.marginTop = this.modal.style.marginTop;
                this._previousManualSizingValues.height = this.modal.style.height;
                this._previousManualSizingValues.minHeight = this.modal.style.minHeight;
                this._previousManualSizingValues.marginBottom = this.modal.style.marginBottom;
                this.modal.style.marginLeft = '';
                this.modal.style.width = '';
                this.modal.style.minWidth = '';
                this.modal.style.marginRight = '';
                this.modal.style.marginTop = '';
                this.modal.style.height = '';
                this.modal.style.minHeight = '';
                this.modal.style.marginBottom = '';
                this.modal.classList.add('next-admin-modal-autosizing');
            }
            this.modal.classList.add('next-admin-modal-full-screen');

            this._isFullScreen = true;
        }

        disableFullScreen() {
            if (!this._isFullScreen)
                return;
            this.modal.classList.remove('next-admin-modal-full-screen');
            if (this._previousManualSizingValues != null) {
                for (let key in this._previousManualSizingValues) {
                    this.modal.style[key] = this._previousManualSizingValues[key];
                }
                this.modal.classList.remove('next-admin-modal-autosizing')
                this._previousManualSizingValues = null;
            }
            this._isFullScreen = false;
        }

        public isInFullscreen(): boolean {
            return this._isFullScreen;
        }

        toggleFullScreen() {
            if (!this._isFullScreen) {
                this.enableFullScreen();
            }
            else {
                this.disableFullScreen();
            }
        }


        passToTop() {
            if (Modal.activModals.length == 0) {
                this.setZIndex(Modal.startTopZIndex);
            }
            else {
                this.setZIndex(Modal.activModals.max(e => e.getZIndex()) + 1);
            }
            if (this._minimizedButton && !this._minimizedButton.element.classList.contains('btn-modal-active')) {
                this._minimizedButton.element.classList.add('btn-modal-active');
            }
        }

        isRegistered() {
            return Modal.activModals.contains(this);
        }


        private _previousBodyOverflow = null;
        private _isOpen = false;
        open(args?: any) {
            if (this.element.parentElement == null) {
                this.options.parentElement.appendChild(this.element);
            }
            this.passToTop();
            if (this.isOpen()) {
                return;
            }
            this._isOpen = true;
            this.element.style.display = '';
            this.onOpen.dispatch(this, args);
            this._previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            if (this.options.openAnimation != null) {
                this.modal.anim(this.options.openAnimation, {
                    animationSpeed: AnimationSpeed.faster, onEndAnimation: () => {
                        this.onOpened.dispatch(this, args);
                    }
                });
            }
            else {
                this.onOpened.dispatch(this, args);
            }
            if (this.options.canMinimize) {
                Modal.registerModal(this);
            }
        }

        close(args?: CloseModalArgs) {
            if (args == null) {
                args = {};
            }
            this.onClose.dispatch(this, args);
            if (this.options.onClose) {
                this.options.onClose(this, args);
            }
            if (args.cancel) {
                return;
            }
            if (this._documentPointerMoveEvent != null) {
                document.removeEventListener('pointermove', this._documentPointerMoveEvent);
            }
            if (this._documentPointerUpEvent != null) {
                document.removeEventListener('pointermove', this._documentPointerUpEvent);
            }
            document.body.style.overflow = this._previousBodyOverflow;
            let endCloseFunc = () => {
                this._isOpen = false;
                if (this.options.removeOnClose) {
                    this.element.remove();
                }
                else {
                    this.element.style.display = 'none';
                }
                this.onClosed.dispatch(this, args);
            };

            if (this.options.closeAnimation != null) {
                if (this.options.backdropColor) {
                    this.element.anim('fadeOut', {
                        animationSpeed: AnimationSpeed.faster,
                    });
                }
                this.modal.anim(this.options.closeAnimation, {
                    animationSpeed: AnimationSpeed.faster,
                    onEndAnimation: () => {
                        endCloseFunc();
                    }
                });
            }
            else {
                endCloseFunc();
            }
            if (this.options.canMinimize) {
                Modal.unRegisterModal(this);
            }
        }


        minimize() {
            let endMinimizeFunc = () => {
                this._isOpen = false;
                if (this._minimizedButton) {
                    this._minimizedButton.element.classList.remove('btn-modal-active');
                }
                if (this.options.removeOnClose) {
                    this.element.remove();
                }
                else {
                    this.element.style.display = 'none';
                }
            };

            if (this.options.closeAnimation != null) {
                this.element.anim(this.options.minimizeAnimation, {
                    animationSpeed: AnimationSpeed.faster,
                    onEndAnimation: () => {
                        endMinimizeFunc();
                    }
                });
            }
            else {
                endMinimizeFunc();
            }
        }

        maximize() {
            if (this.isOpen()) {
                return;
            }
            if (this.element.parentElement == null) {
                this.options.parentElement.appendChild(this.element);
            }
            this._isOpen = true;
            this.element.style.display = '';
            if (this.options.openAnimation != null) {
                this.element.anim(this.options.maximizeAnimation, { animationSpeed: AnimationSpeed.faster });
            }
            this.passToTop();
        }

        isOpen() {
            return this._isOpen;
        }

        setZIndex(zIndex: any) {
            this.element.style.zIndex = zIndex;
        }

        getZIndex(): number {
            return parseInt(this.element.style.zIndex);
        }

        getTitle(): string {
            return this.title.innerHTML;
        }

        setTitle(title: string) {
            let maxTitleLenght = UserAgent.isDesktop() ? 50 : 30;
            if (title.startsWith('<i')) {
                maxTitleLenght += 30;
            }
            if (title && title.length > maxTitleLenght) {
                title = title.substring(0, maxTitleLenght) + '...'
            }
            this.title.innerHTML = title;
            if (this._minimizedButton != null) {
                this._minimizedButton.setText(title);
            }
            this.onTitleChanged.dispatch(this, title);
        }


        public startSpin() {
            this.modal.startSpin('rgba(255,255,255,0.5)', 50);
        }

        public stopSpin() {
            this.modal.stopSpin();
        }

        public bindEvent<TSender, TArgs>(eventHandler: EventHandler<TSender, TArgs>, eventAction: (sender: TSender, args: TArgs) => void) {
            if (this.isOpen()) {
                eventHandler.subscribe(eventAction);
            }
            this.onOpen.subscribe(() => {
                if (!eventHandler.isSubscribed(eventAction)) {
                    eventHandler.subscribe(eventAction);
                }
            });
            this.onClosed.subscribe(() => {
                eventHandler.unsubscribe(eventAction);
            });
        }


    }



    export interface ModalOptions extends ControlOptions {

        parentElement?: HTMLElement;

        size?: ModalSize;

        hasBodyOverflow?: boolean;

        removeOnClose?: boolean;

        openAnimation?: string;

        closeAnimation?: string;

        minimizeAnimation?: string;

        maximizeAnimation?: string;

        canChangeScreenMode?: boolean;//allow to passe to full screen and invert

        startFullScreen?: boolean;

        canMinimize?: boolean;

        canClose?: boolean;

        blockBackgroundEvents?: boolean;

        canMoveAndResize?: boolean;

        minModalManualSizingWidth?: number;

        minModalManualSizingHeight?: number;

        canModalManualSizingOverlapBrowserWindow?: boolean;

        backdropColor?: string;

        title?: string;

        style?: ModalStyle | any;

        hasHeader?: boolean;

        hasFooter?: boolean;

        onClose?: (modal: NextAdmin.UI.Modal, args: CloseModalArgs) => void;

    }


    export enum ModalSize {
        small,
        smallFitContent,
        medium,
        mediumFitContent,
        mediumLarge,
        large,
        ultraLarge,
    }


    export interface CloseModalArgs {

        cancel?: boolean;

    }

    export enum ModalStyle {
        default,
        modern
    }


}

