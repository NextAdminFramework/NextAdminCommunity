namespace NextAdmin.UI {

    export class AnimatedHoverText extends NextAdmin.UI.Control {

        hoverCenterredContainer: HTMLElement;

        hoverText: HTMLElement;

        underLine: HTMLDivElement;

        public static style = `
        .next-admin-hover-text{

            position:relative;
            pointer-events: none;
            width:100%;
            color:#fff;
            text-shadow:0px 0px 4px rgba(0,0,0,0.9);
            transition: transform 0.9s;

            .next-admin-hover-text-centered-container{
                width:fit-content;
            }

            .next-admin-hover-text-underline{
                height:2px;
                width:0%;
                background-color:#ffffff;
                box-shadow:0px 0px 2px rgba(0,0,0,0.5);
                transition: all 0.4s;
            }
            .next-admin-hover-text-underline-visible{
                width:100%;
            }

            .next-admin-hover-text-content{
                font-size:22px;
                height:26px;
                overflow:hidden;
                visibility:hidden;
                display:block;
            }

            .next-admin-hover-text-content-visible{
                visibility:visible;
            }

            .next-admin-hover-text-content-text{
                display:block;
                margin-top:22px;
                transform: scale(0.5);
                transition: all 0.4s;
            }

            .next-admin-hover-text-content-visible .next-admin-hover-text-content-text{
                margin-top:0px;
                transform: scale(1);
            }
        }
        `;

        options: AnimatedHoverTextOptions;

        constructor(options?: AnimatedHoverTextOptions) {
            super('div', {
                ...options
            } as AnimatedHoverTextOptions);

            Style.append('NextAdmin.UI.AnimatedHoverText', AnimatedHoverText.style);
            this.element.classList.add('next-admin-hover-text');
            this.element.appendHTML('div', (centeredContainer) => {
                centeredContainer.classList.add('next-admin-hover-text-centered-container');
                centeredContainer.centerHorizontally();
                this.hoverCenterredContainer = centeredContainer.appendHTML('div', (hoverText) => {
                    hoverText.classList.add('next-admin-hover-text-content');
                    this.hoverText = hoverText.appendHTML('div', (hoverTextText) => {
                        hoverTextText.classList.add('next-admin-hover-text-content-text');
                    });
                });
                this.underLine = centeredContainer.appendHTML('div', (underLine) => {
                    underLine.classList.add('next-admin-hover-text-underline');
                    underLine.centerHorizontally();
                });

            });
            if (this.options.text) {
                this.setText(this.options.text);
            }
            if (this.options.color) {
                this.setColor(this.options.color);
            }
        }

        setText(text?: string) {
            this.hoverText.innerHTML = text ?? '';
        }

        getText(): string {
            return this.hoverText.innerHTML;
        }

        setColor(color: string) {
            this.hoverText.style.color = color;
            this.underLine.style.backgroundColor = color;
        }

        private _isHovertextVisible = false;
        public async animDisplayText() {
            this._isHovertextVisible = true;
            if (!this.underLine.classList.contains('next-admin-hover-text-underline-visible')) {
                this.underLine.classList.add('next-admin-hover-text-underline-visible');
            }
            await NextAdmin.Timer.sleep(400);
            if (!this._isHovertextVisible) {
                return;
            }
            if (!this.hoverCenterredContainer.classList.contains('next-admin-hover-text-content-visible')) {
                this.hoverCenterredContainer.classList.add('next-admin-hover-text-content-visible');
            }
        }

        public async animHideText() {
            this._isHovertextVisible = false;
            this.hoverCenterredContainer.classList.remove('next-admin-hover-text-content-visible');
            await NextAdmin.Timer.sleep(400);
            if (this._isHovertextVisible) {
                return;
            }
            this.underLine.classList.remove('next-admin-hover-text-underline-visible');
        }

    }


    export interface AnimatedHoverTextOptions extends ControlOptions {

        text?: string;

        color?: string;

    }

}