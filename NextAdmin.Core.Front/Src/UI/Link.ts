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
            /*text-shadow: 0px 0px 2px rgba(0,0,0,0.40);*/
            text-decoration:none;
        }
        .next-admin-link.blue{
            color:` + DefaultStyle.BlueOne + `;
        }
        .next-admin-link.blue:hover{
            color:'#1a66ce';
        }

        .next-admin-link.grey{
            color:#777;
        }
        .next-admin-link.grey:hover{
            color:'#999';
        }

        .next-admin-link.dark{
            color:#222;
        }
        .next-admin-link.dark:hover{
            color:#555;
        }


        .next-admin-link.white {
            color:#fff;
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
            if (this.options.openInNewTab) {
                this.element.target = '_blank';
            }
            this.setStyle(this.options.style);
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

        setStyle(style?: LinkStyle) {
            switch (style) {
                case LinkStyle.blue:
                default:
                    this.element.classList.add('blue');
                    break;
                case LinkStyle.dark:
                    this.element.classList.add('dark');
                    break;
                case LinkStyle.white:
                    this.element.classList.add('white');
                    break;
                case LinkStyle.grey:
                    this.element.classList.add('grey');
                    break;
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

        openInNewTab?: boolean;

        style?: LinkStyle;

        action?: (link: Link) => void;
    }


    export enum LinkStyle {
        blue,
        dark,
        white,
        grey,
    }


}