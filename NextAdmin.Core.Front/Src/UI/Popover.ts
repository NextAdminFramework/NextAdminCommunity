namespace NextAdmin.UI {

    export class Popover extends Control {

        public modal: HTMLElement;

        public options: PopoverOptions;

        public onClose = new EventHandler<any, CloseModalArgs>();

        public static style = '.next-admin-popover { padding:5px;border-radius:5px;background:#fff;position:fixed;z-index:9999;border:1px solid #ccc;font-size:12px }'
            + '.next-admin-popover::before {content:" ";position:absolute;top: 50%; right: 100%;margin-top:-11px;border-width:11px;border-style:solid;border-color: transparent #ccc transparent transparent;}'
            + '.next-admin-popover::after {content:" ";position:absolute;top: 50%; right: 100%;margin-top:-10px;border-width:10px;border-style:solid;border-color: transparent #fff transparent transparent;}';

        public static onCreated = new EventHandler<Popover, PopoverOptions>();

        public constructor(options?: PopoverOptions) {
            super('div', options);
            if (this.options.removeOnClose == null) {
                this.options.removeOnClose = true;
            }
            if (this.options.popOnHover === undefined) {
                this.options.popOnHover = true;
            }

            if (this.options.parentElement == null) {
                this.options.parentElement = document.body;
            }
            this.element.style.pointerEvents = 'none';
            Style.append('Popover', Popover.style);
            this.element.classList.add('next-admin-popover');

            this.element.style.maxWidth = this.options.maxWidth != null ? this.options.maxWidth : '250px;'
            this.element.style.minHeight = this.options.minHeight != null ? this.options.minHeight : '25px;'

            if (this.options.innerHTML != null) {
                this.element.innerHTML = this.options.innerHTML;
            }
            if (this.options.popOnHover && this.options.popElement != null) {
                this.startPopOnHover();
            }
            Popover.onCreated.dispatch(this, this.options);
        }


        private _pointerEnter = null;
        private _pointerLeave = null;
        startPopOnHover() {
            if (this._pointerEnter == null) {
                this.options.popElement.addEventListener('pointerenter', this._pointerEnter = () => {
                    this.open();
                });
                this.options.popElement.addEventListener('pointerleave', this._pointerLeave = () => {
                    this.close();
                });
            }
        }

        stopPopOnHover() {
            if (this._pointerEnter != null) {
                this.options.popElement.removeEventListener('pointerenter', this._pointerEnter);
            }
            this._pointerEnter = null;
            if (this._pointerLeave != null) {
                this.options.popElement.removeEventListener('pointerleave', this._pointerLeave);
            }
            this._pointerLeave = null;
        }

        _isOpen = false;

        open(options: { popElement?: HTMLElement, offsetX?: number, offsetY?: number } = {}) {
            options = { popElement: this.options.popElement, offsetX: 0, offsetY: 0, ...options };
            if (this._isOpen) {
                return;
            }

            if (this.element.parentElement == null) {
                this.options.parentElement.appendChild(this.element);
            }
            this.element.style.display = '';

            if (options.popElement != null) {
                let popElementBounding = options.popElement.getBoundingClientRect();
                options.offsetX += popElementBounding.right;
                options.offsetY += popElementBounding.top + (popElementBounding.height / 2);
            }
            this.element.style.left = options.offsetX + 10 + 'px';
            this.element.style.top = options.offsetY - (this.element.offsetHeight / 2) + 'px';

            if (this.options.openAnimation != null) {
                this.element.anim(this.options.openAnimation, { animationSpeed: AnimationSpeed.faster });
            }
            this._isOpen = true;
        }

        setPosition(x: number, y: number) {
            this.element.style.left = x + 10 + 'px';
            this.element.style.top = y - (this.element.offsetHeight / 2) + 'px';
        }

        close() {
            if (!this._isOpen)
                return;
            let closeArgs = {} as CloseModalArgs;
            this.onClose.dispatch(this, closeArgs);
            if (closeArgs.cancel) {
                return;
            }
            this._isOpen = false;
            let endCloseFunc = () => {
                if (this.options.removeOnClose) {
                    this.element.remove();
                }
                else {
                    this.element.style.display = 'none';
                }
            };

            if (this.options.closeAnimation != null) {
                this.element.anim(this.options.closeAnimation, {
                    animationSpeed: AnimationSpeed.faster,
                    onEndAnimation: () => {
                        endCloseFunc();
                    }
                });
            }
            else {
                endCloseFunc();
            }
        }

    }



    export interface PopoverOptions extends ControlOptions {

        parentElement?: HTMLElement;

        popElement?: HTMLElement;

        popOnHover?: boolean;

        removeOnClose?: boolean;

        openAnimation?: string;

        closeAnimation?: string;

        innerHTML: string;

        maxWidth?: string;

        minHeight?: string;

    }



}


interface HTMLElement {


    setPopover(innerHTML: string, parentElement?: HTMLElement): NextAdmin.UI.Popover;

    removePopover();

}


try {


    HTMLElement.prototype.setPopover = function (innerHTML: string, parentElement?: HTMLElement): NextAdmin.UI.Popover {
        (this as HTMLElement).removePopover();
        this['_popover'] = new NextAdmin.UI.Popover({ innerHTML: innerHTML, popElement: this, parentElement: parentElement });
        return this['_popover'];
    };

    HTMLElement.prototype.removePopover = function () {
        let popover = this['_popover'] as NextAdmin.UI.Popover;
        if (popover == null) {
            return;
        }
        popover.close();
        popover.stopPopOnHover();
    };

}
catch
{

}


