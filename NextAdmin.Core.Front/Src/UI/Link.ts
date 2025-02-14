namespace NextAdmin.UI {


    export class Link extends Control {

        options: LinkOptions;

        element: HTMLAnchorElement;

        public onActionExecuting = new EventHandler<Link, any>();

        public onActionExecuted = new EventHandler<Link, any>();

        action: (link: Link) => void;

        public static style = `
        .next-admin-link{
            cursor:pointer;
            color:` + DefaultStyle.BlueOne + `;
            text-shadow: 0px 0px 2px rgba(0,0,0,0.40);
            text-decoration:none;
        }
        .next-admin-link:hover{
            text-decoration: underline;
        }
        .next-admin-link-disabled{
            color:eee;
            cursor:unset;
            text-decoration: none;
        }
        .next-admin-link-active{
            text-decoration:underline;
        }

        `;

        constructor(options: LinkOptions) {
            super(options.htmlTag ?? 'a', { ...options });
            NextAdmin.Style.append('NextAdmin.UI.Link', Link.style);
            this.element.classList.add('next-admin-link');
            if (this.options.text) {
                this.element.innerHTML = this.options.text;
            }
            if (this.options.popover) {
                this.element.setPopover(this.options.popover);
            }
            if (this.options.action) {
                this.action = this.options.action;
            }
            this.element.addEventListener('click', (event) => {
                if (this.isEnable()) {
                    this.executeAction();
                }
            });
            if (this.options.href) {
                this.element.href = this.options.href;
            }
        }


        public isEnable() {
            return !this.element.classList.contains('next-admin-link-disabled');
        }

        public enable() {
            if (!this.isEnable()) {
                this.element.classList.remove('next-admin-link-disabled');
            }
        }

        public disable() {
            if (this.isEnable()) {
                this.element.classList.add('next-admin-link-disabled');
            }
        }

        public executeAction() {
            this.onActionExecuting.dispatch(this, this.action);
            if (this.action != null) {
                this.action(this);
            }
            this.onActionExecuted.dispatch(this, this.action);
        }

        setText(text: string): Link {
            this.element.innerHTML = text;
            return this;
        }

        getText(): string {
            return this.element.innerHTML;
        }

        setActive(value = true) {
            if (value && !this.element.classList.contains('next-admin-link-active')) {
                this.element.classList.add('next-admin-link-active');
            }
            else if (!value && this.element.classList.contains('next-admin-link-active')) {
                this.element.classList.remove('next-admin-link-active');
            }
        }

        public startSpin(): { spinnerContainer: HTMLDivElement, spinner: HTMLImageElement } {
            return this.element.startSpin('rgba(255,255,255,0.5)', 20);
        }

        public stopSpin() {
            this.element.stopSpin();
        }


    }

    export interface LinkOptions extends ControlOptions {

        text?: string;

        popover?: string;

        htmlTag?: string;

        href?: string;

        action?: (link: Link) => void;
    }

}