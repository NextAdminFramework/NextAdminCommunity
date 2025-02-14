namespace NextAdmin.UI {

    export class PinsCard extends Control {

        public static style = `

        .next-admin-pins-card{
            width:180px;
            height:180px;
            .next-admin-pins-card-pins{
                margin:0 auto;
                box-shadow:0px 0px 2px rgba(0,0,0,25);
                border-radius:100%;
                width:100px;
                height:100px;
                font-size:60px;
            }
            .next-admin-pins-card-text{
                margin-top:15px;
                text-shadow:0px 0px 2px rgba(0,0,0,0.25);
                text-align:center;
                font-size:14px;
            }
        }
        .next-admin-pins-card.responsive{
            @media (max-width: 1280px) {
                width:140px;
                height:140px;
                .next-admin-pins-card-pins{
                    width:80px;
                    height:80px;
                    font-size:45px;
                }
                .next-admin-pins-card-text{
                    margin-top:10px;
                    font-size:12px;
                }
            }
            @media (max-width: 768px) {
                width:100px;
                height:100px;
                .next-admin-pins-card-pins{
                    width:60px;
                    height:60px;
                    font-size:35px;
                }
                .next-admin-pins-card-text{
                    margin-top:6px;
                    font-size:11px;
                }
            }
        }
        `;

        options: PinsCardOptions;

        constructor(options: PinsCardOptions) {
            super('div', {
                backgroundColor: '#fff',
                iconColor: DefaultStyle.BlueTwo,
                textColor: '#777',
                isResponsive: true,
                ...options
            } as PinsCardOptions);
            Style.append('NextAdmin.UI.PinsCard', PinsCard.style);
            this.element.classList.add('next-admin-pins-card');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }
            this.element.appendHTML('div', (pins) => {
                pins.classList.add('next-admin-pins-card-pins');
                pins.style.backgroundColor = this.options.backgroundColor;
                pins.style.color = this.options.iconColor;
                pins.centerContent();
                pins.innerHTML = this.options.icon ?? '';
            });
            this.element.appendHTML('div', (text) => {
                text.classList.add('next-admin-pins-card-text');
                text.style.color = this.options.textColor;
                text.innerHTML = this.options.text ?? '';
            });

        }

    }

    export interface PinsCardOptions extends ControlOptions {

        text?: string;

        icon?: string;

        backgroundColor?: string;

        iconColor?: string;

        textColor?: string;

        isResponsive?: boolean;

    }

}