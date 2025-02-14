
/// <reference path="Button.ts"/>

namespace NextAdmin.UI {

    export class DropDownButton extends Button {


        public options: DropDownButtonOptions;

        public dropDown: DropDownMenu;

        public static onCreated = new EventHandler<DropDownButton, DropDownButtonOptions>();

        public dropDownPosition: DropDownPosition;


        public constructor(options?: DropDownButtonOptions) {
            super({
                dropDownWidth: '250px',
                maxDropDownHeight: '400px',
                dropDownParentContainer: document.body,
                action: (btn, event) => {
                    this.toggleDropDown();
                },
                ...options
            } as DropDownButtonOptions);
            this.dropDownPosition = this.options.dropDownPosition;
            //Style.append("DropDownButton", DropDownButton.style);
            this.dropDown = new DropDownMenu({
                items: this.options.items,
                dropDownWidth: this.options.dropDownWidth,
                maxDropDownHeight: this.options.maxDropDownHeight,
                parentContainer: this.options.dropDownParentContainer
            });
            if (this.options.openOnHover) {
                this.openOnHover();
            }
            DropDownButton.onCreated.dispatch(this, this.options);
            this.element.addEventListener('pointerdown', (ev) => {
                ev.stopPropagation();
                ev.stopImmediatePropagation();
            });
        }

        public openOnHover() {
            if (UserAgent.isMobile())
                return;
            let overDropDown = false;
            this.dropDown.element.addEventListener('pointerenter', () => {
                overDropDown = true;
            });
            this.dropDown.element.addEventListener('pointerleave', () => {
                overDropDown = false;
                this.closeDropDown();
            });

            this.element.addEventListener('pointerenter', () => {
                this.openDropDown();
            });
            this.element.addEventListener('pointerleave', () => {
                setTimeout(() => {
                    if (!overDropDown) {
                        this.closeDropDown();
                    }
                }, 200);
            });
        }

        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement {
            return this.dropDown.addElement(dropDownItem);
        }

        addItem(dropDownItem: MenuItem): Button {
            return this.dropDown.addItem(dropDownItem);
        }

        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement {
            this.dropDown.addElement(elementOrControl);
            if (configAction) {
                configAction(elementOrControl);
            }
            return elementOrControl;
        }

        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.appendControl(document.createElement(html), setControlPropertiesAction);
        }

        clearItems() {
            this.dropDown.clearItems();
        }

        addItems(itms: MenuItem[]): DropDownButton {
            this.dropDown.addItems(itms);
            return this;
        }

        toggleDropDown() {
            if (this.isDropDownOpen()) {
                this.closeDropDown();
            }
            else {
                this.openDropDown();
            }
        }

        isDropDownOpen(): boolean {
            return this.dropDown.isOpen();
        }


        openDropDown() {
            if (this.options.onOpeningDropDown) {
                let args = { dropDown: this.dropDown } as OpeningDropDownArgs;
                this.options.onOpeningDropDown(this, args);
                if (args.cancel) {
                    return;
                }
            }


            let dropDownPosition = this.dropDownPosition;
            if (dropDownPosition == null) {
                let rightSpace = window.innerWidth - this.element.getBoundingClientRect().left;
                dropDownPosition = rightSpace > 400 ? NextAdmin.UI.DropDownPosition.down : NextAdmin.UI.DropDownPosition.downLeft;
            }
            
            this.dropDown.open('0px', '0px');
            this.dropDown.element.style.visibility = 'hidden';
            setTimeout(() => {
                this.dropDown.element.style.visibility = 'visible';
                let buttonBoundings = this.element.getBoundingClientRect();
                let x = 0;
                let y = 0;
                switch (dropDownPosition) {
                    default:
                    case DropDownPosition.downRight:
                        y = buttonBoundings.y - 1;
                        x = buttonBoundings.x + buttonBoundings.width;
                        break;
                    case DropDownPosition.downLeft:
                        y = buttonBoundings.y - 1;
                        x = buttonBoundings.x - this.dropDown.element.offsetWidth;
                        break;
                    case DropDownPosition.upRight:
                        y = buttonBoundings.y + buttonBoundings.height - this.dropDown.element.offsetHeight;
                        x = buttonBoundings.x + buttonBoundings.width;
                        break;
                    case DropDownPosition.upLeft:
                        y = buttonBoundings.y + buttonBoundings.height - this.dropDown.element.offsetHeight;
                        x = buttonBoundings.x - this.dropDown.element.offsetWidth;
                        break;
                    case DropDownPosition.down:
                        y = buttonBoundings.y + buttonBoundings.height - 1;
                        x = buttonBoundings.x;
                        break;
                    case DropDownPosition.up:
                        y = buttonBoundings.y - this.dropDown.element.offsetHeight;
                        x = buttonBoundings.x;
                        break;
                }
                this.dropDown.open(x + 'px', y + 'px');
            });
        }

        setDropDownPosition(position: DropDownPosition) {
            this.dropDownPosition = position;
        }

        closeDropDown() {
            this.dropDown.close();
        }

    }



    export interface DropDownButtonOptions extends ButtonOptions {

        items?: Array<MenuItem | Button | HTMLElement>;

        dropDownWidth?: string;

        maxDropDownHeight?: string;

        dropDownPosition?: DropDownPosition;

        openOnHover?: boolean;

        dropDownParentContainer?: HTMLElement;

        onOpeningDropDown?: (dropDown: DropDownButton, args: OpeningDropDownArgs) => void;

    }

    export interface MenuItem {

        text?: string;

        action?: (menu: Control, button: Button) => void;

    }


    export interface OpeningDropDownArgs {

        dropDown: DropDownMenu;

        cancel?: boolean;

    }


    export enum DropDownPosition {
        downRight,
        downLeft,
        upRight,
        upLeft,
        down,
        up,
    }




}

