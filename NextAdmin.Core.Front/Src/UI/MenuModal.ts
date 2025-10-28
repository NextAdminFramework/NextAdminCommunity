namespace NextAdmin.UI {

    export class MenuModal extends Modal {

        options: MenuModalOptions;

        mainContainer: HTMLDivElement;

        footerContainer: HTMLDivElement;

        constructor(options?: MenuModalOptions) {
            super({
                backdropColor: DefaultStyle.DarkModalBackdrop,
                size: ModalSize.smallFitContent,
                canMoveAndResize: false,
                canMinimize: false,
                canClose: false,
                canChangeScreenMode: false,
                hasBackButton: true,

                ...options
            });
            this.modal.style.maxHeight = '80vh';
            this.leftHeader.style.fontSize = '20px';
            if (NextAdmin.String.isNullOrEmpty(this.options.title) && !this.options.canClose) {
                this.header.style.height = '3px';
            }

            this.mainContainer = this.body.appendHTML('div', (container) => {
                container.style.padding = '20px';
                if (this.options.text) {
                    container.appendHTML('p', this.options.text);
                }
            });


            if (this.options.items) {
                for (let item of this.options.items) {
                    this.addElement(item);
                }
            }

            if (this.options.hasBackButton) {
                this.addItem({
                    text: Resources.closeIcon + ' ' + Resources.close,
                    action: () => {
                        this.close();
                    }
                });

            }

            this.element.addEventListener('click', () => {
                this.close();
            });


        }


        addItems(itms: MenuItem[]): MenuModal {
            for (let item of itms) {
                this.addElement(item);
            }
            return this;
        }

        addItem(dropDownItem: MenuItem): Button {
            return this.addElement(dropDownItem) as any;
        }

        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement {
            this.addElement(elementOrControl);
            if (configAction) {
                configAction(elementOrControl);
            }
            return elementOrControl;
        }

        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.appendControl(document.createElement(html), setControlPropertiesAction);
        }

        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement {
            let item = null;
            this.mainContainer.appendHTML('div', (dropDownItemContainer) => {
                dropDownItemContainer.style.marginTop = '15px';
                if (dropDownItem instanceof Control) {
                    dropDownItemContainer.appendControl(dropDownItem);
                    if (dropDownItem instanceof DropDownButton) {
                        dropDownItem.setStyle(NextAdmin.UI.ButtonStyle.noBg);
                        dropDownItem.element.style.width = '100%';
                        dropDownItem.element.style.textAlign = 'left';
                        if (!dropDownItem.dropDownPosition) {
                            dropDownItem.dropDownPosition = NextAdmin.UI.DropDownPosition.downRight;
                        }
                        if (!dropDownItem.options.openOnHover) {
                            dropDownItem.openOnHover();
                        }
                    }
                    item = dropDownItem;
                }
                else if (dropDownItem instanceof HTMLElement) {
                    dropDownItemContainer.append(dropDownItem);
                    item = dropDownItem;
                }
                else if (dropDownItem.action) {
                    item = dropDownItemContainer.appendControl(new Button({
                        text: dropDownItem.text,
                        style: ButtonStyle.bgWhite,
                        size: ButtonSize.large,
                        css: { overflow: 'hidden' },
                        action: (btn) => {
                            this.close();
                            dropDownItem.action(this, btn);
                        }
                    }), (dropDownItemButton) => {
                        dropDownItemButton.element.style.width = '100%';
                        dropDownItemButton.element.style.textAlign = 'center';
                        dropDownItemButton.element.addEventListener('pointerover', (btnItem) => {
                            dropDownItemButton.element.style.background = 'rgba(245,245,245,1)';
                        });
                        dropDownItemButton.element.addEventListener('pointerleave', (btnItem) => {
                            dropDownItemButton.element.style.background = 'unset';
                        });
                    });
                }
                else {
                    item = dropDownItemContainer.appendHTML('div', (titelItem) => {
                        titelItem.style.fontSize = '14px';
                        titelItem.style.fontWeight = 'bold';
                        titelItem.style.textAlign = 'left';
                        titelItem.style.background = '#dee9ff';
                        titelItem.style.cursor = '';
                        titelItem.innerHTML = dropDownItem.text;
                    });
                }
            });
            return item;
        }



    }

    export interface MenuModalOptions extends ModalOptions {

        text?: string;

        hasBackButton?: boolean;

        items?: Array<MenuItem | Control | HTMLElement>;

    }

}