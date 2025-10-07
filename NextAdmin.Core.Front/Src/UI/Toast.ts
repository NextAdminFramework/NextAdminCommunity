namespace NextAdmin.UI {

    export class Toast extends NextAdmin.UI.Control {

        options: ToastOptions;

        toast: HTMLDivElement;

        public static style = `
            .next-admin-toast-container{
                position:fixed;
                left:0px;
                top:0px;
                width:100%;
                z-index:999999;
                pointer-events: none;

                .next-admin-toast{
                    margin:0 auto;
                    margin-top:10vh;
                    width:fit-content;
                    min-width:200px;
                    text-align:center;
                    pointer-events: auto;
                    background:#fff;
                    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.25);
                    padding:20px;
                    border-radius:16px;
                }
                .next-admin-toast-green{
                    background:#90EE90;
                }
                .next-admin-toast-blue{
                    background:#87CEFA;
                }
                .next-admin-toast-red{
                    background:#DC143C;
                }

            }

        `;

        constructor(options?: ToastOptions) {
            super('div', {
                style: ToastStyle.green,
                ...options
            } as ToastOptions);
            NextAdmin.Style.append('NextAdmin.UI.Toast', Toast.style);
            this.element.classList.add('next-admin-toast-container');

            this.toast = this.element.appendHTML('div', (toast) => {
                toast.classList.add('next-admin-toast');
            });
            this.setText(this.options.text);
            this.setStyle(this.options.style);
        }

        setText(text?: string) {
            this.toast.innerHTML = text ?? '';
        }

        setStyle(style?: ToastStyle) {
            switch (style) {
                default:
                case ToastStyle.green:
                    this.toast.classList.add('next-admin-toast-green');
                    break;
                case ToastStyle.blue:
                    this.toast.classList.add('next-admin-toast-blue');
                    break;
                case ToastStyle.red:
                    this.toast.classList.add('next-admin-toast-red');
                    break;
            }
        }

        async show(options?: ToastShowOptions) {
            options = {
                duration: 2000,
                openAnimation: 'fadeInDown',
                openAnimationOptions: { animationSpeed: AnimationSpeed.faster },
                closeAnimation: 'fadeOutUp',
                closeAnimationOptions: { animationSpeed: AnimationSpeed.faster },
                container: document.body,
                ...options
            };
            options.container.appendControl(this);
            await this.element.anim(options.openAnimation, options.openAnimationOptions);
            if (!options.duration) {
                return;
            }
            await NextAdmin.Timer.sleep(options.duration);
            await this.element.anim(options.closeAnimation, options.closeAnimationOptions);
            this.element.remove();
        }

        public static createSuccess(text?: string): Toast {
            let toast = new Toast({ text: text, style: ToastStyle.green });
            toast.show();
            return toast;
        }

        public static createError(text?: string): Toast {
            let toast = new Toast({ text: text, style: ToastStyle.red });
            toast.show();
            return toast;
        }

    }

    export enum ToastStyle {
        green,
        blue,
        red,
    }

    export interface ToastOptions extends ControlOptions {

        text?: string;

        style?: ToastStyle;

    }

    export interface ToastShowOptions {

        duration?: number;

        container?: HTMLElement;

        openAnimation?: string;

        openAnimationOptions: NextAdmin.AnimationOptions;

        closeAnimation?: string;

        closeAnimationOptions?: NextAdmin.AnimationOptions;

    }

}