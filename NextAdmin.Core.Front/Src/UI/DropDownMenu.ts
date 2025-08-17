
/// <reference path="Button.ts"/>

namespace NextAdmin.UI {

    export class DropDownMenu extends Control {


        public options: DropDownMenuOptions;

        public dropDownButton: Button;

        public static onCreated = new EventHandler<DropDownMenu, DropDownButtonOptions>();

        public static style = '.next-admin-drop-down-menu{border-radius: 4px;background:#fefefe;border:1px solid #ccc;position:fixed;z-index:2000;left:0px;bottom:0px;height:fit-content;box-shadow:0px 1px 1px rgba(0,0,0,0.4)}';

        onOpen = new EventHandler<DropDownMenu, HTMLElement>();

        onClose = new EventHandler<DropDownMenu, HTMLElement>();

        protected items = Array<Control | HTMLElement>();

        public constructor(options?: DropDownMenuOptions) {
            super('div', {
                dropDownWidth: '250px',
                maxDropDownHeight: '400px',
                parentContainer: document.body,
                ...options
            } as DropDownMenuOptions);
            Style.append("DropDownButton", DropDownMenu.style);
            this.element.style.position = 'fixed';
            this.element.classList.add('next-admin-drop-down-menu');
            this.element.style.maxHeight = this.options.maxDropDownHeight;
            this.element.style.overflow = 'auto';
            this.element.style.width = this.options.dropDownWidth;
            this.element.addEventListener('wheel', (ev) => {
                //removed because blocking scroll since perfect scrollbar was remoed
                /*
                ev.stopPropagation();
                ev.preventDefault();
                */
            })
            if (UserAgent.isDesktop()) {
                //this.element.appendPerfectScrollbar();
            }

            if (this.options.items != null) {
                for (let dropDownItem of this.options.items) {
                    this.addElement(dropDownItem);
                }
            }

            this._onClickOutside = (event) => {//test close on click for device which not fire mousedown events...

                if (this.element.parentElement == null)
                    return;
                let elementToTest = event.target as Node;
                let isOutside = true;
                do {
                    if (elementToTest == this.element) {
                        isOutside = false;
                        break;
                    }
                    elementToTest = elementToTest.parentNode;
                } while (elementToTest);
                if (isOutside) {//click outside
                    this.close();
                }
            };

            DropDownMenu.onCreated.dispatch(this, this.options);
        }

        public closeOnClickOutside = true;

        private _onClickOutside;


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
            this.element.appendHTML('div', (dropDownItemContainer) => {
                if (dropDownItem instanceof Control) {
                    dropDownItemContainer.appendControl(dropDownItem);
                    if (dropDownItem instanceof DropDownButton) {
                        this.applyButtonItemStyle(dropDownItem);
                        if (!dropDownItem.dropDownPosition) {
                            dropDownItem.dropDownPosition = NextAdmin.UI.DropDownPosition.downRight;
                        }
                        if (!dropDownItem.options.openOnHover) {
                            dropDownItem.openOnHover();
                        }
                        dropDownItem.dropDown.onOpen.subscribe(() => {
                            for (let item of this.items.where(a => a != dropDownItem && a instanceof DropDownButton)) {
                                (<DropDownButton>item).closeDropDown();
                            }
                        });
                    }
                    else if (dropDownItem instanceof Button) {
                        this.applyButtonItemStyle(dropDownItem);
                        dropDownItem.onActionExecuted.subscribe(() => {
                            this.close();
                        });
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
                        style: ButtonStyle.noBg,
                        action: (btn) => {
                            this.close();
                            dropDownItem.action(this, btn);
                        }
                    }), (dropDownItemButton) => {
                        this.applyButtonItemStyle(dropDownItemButton);
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
            this.items.add(item);
            return item;
        }

        getItems() {
            return this.items;
        }

        protected applyButtonItemStyle(buttonItem: Button) {
            if (buttonItem.getColorStyle() == null || buttonItem.getColorStyle() == ButtonStyle.default) {
                buttonItem.setColorStyle(NextAdmin.UI.ButtonStyle.noBg);
            }
            buttonItem.element.style.width = '100%';
            buttonItem.element.style.textAlign = 'left';
            buttonItem.element.addEventListener('pointerover', (btnItem) => {
                buttonItem.element.style.background = 'rgba(245,245,245,1)';
            });
            buttonItem.element.addEventListener('pointerleave', (btnItem) => {
                buttonItem.element.style.background = 'unset';
            });

        }

        clearItems() {
            this.element.innerHTML = '';
        }


        addItems(itms: MenuItem[]): DropDownMenu {
            for (let item of itms) {
                this.addElement(item);
            }
            return this;
        }

        isOpen() {
            return this.element.parentElement != null;
        }


        private _hasRegisteredEventOnClickOutside = false;

        open(x: string, y: string) {
            this.element.style.left = x;
            this.element.style.top = y;
            if (this.element.parentElement == null) {
                this.options.parentContainer.appendChild(this.element);
                this.onOpen.dispatch(this, this.element);
                setTimeout(() => {
                    if (!this._hasRegisteredEventOnClickOutside) {
                        document.addEventListener('pointerdown', this._onClickOutside);
                        document.addEventListener('click', this._onClickOutside);
                        document.addEventListener('touchstart', this._onClickOutside);
                        this._hasRegisteredEventOnClickOutside = true;
                    }
                }, 1);
            }
        }


        close() {
            if (!this.isOpen())
                return;
            this.element.remove();
            document.removeEventListener('pointerdown', this._onClickOutside);
            document.removeEventListener('click', this._onClickOutside);
            document.removeEventListener('touchstart', this._onClickOutside);
            this._hasRegisteredEventOnClickOutside = false;
            this.onClose.dispatch(this, this.element);
        }


    }



    export interface DropDownMenuOptions extends ButtonOptions {

        items?: Array<MenuItem | Button | HTMLElement>;

        dropDownWidth?: string;

        maxDropDownHeight?: string;

        parentContainer?: HTMLElement;

    }



}

