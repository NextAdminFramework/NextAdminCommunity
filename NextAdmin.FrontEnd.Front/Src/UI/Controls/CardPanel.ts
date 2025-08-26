namespace NextAdmin.UI {

    export class CardPanel extends Control {

        public static style = `

        .next-admin-card-panel{
            min-height:50px;
            margin-top:20px;
            margin-bottom:20px;
            box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            border-radius:10px;
            padding:20px;
        }
        .next-admin-card-panel.responsive{
            @media (max-width: 768px) {
                padding:10px;
            }
        }
        
        .next-admin-card-panel.light-bg-large-font{
            background:#f9f9f9;
            font-size:16px;
            color:#444;
            line-height:28px;
        }
        
        .next-admin-card-panel.light-bg-large-font.responsive{
            @media (max-width: 768px) {
                font-size:14px;
                line-height:20px;
            }
        }

        `;


        options: CardPanelOptions;

        constructor(options?: CardPanelOptions) {
            super('div', {
                isResponsive: true,
                style: CardPanelStyle.lightBackgroundLargeFont,
                ...options
            } as CardPanelOptions);
            Style.append('NextAdmin.UI.CardPanel', CardPanel.style);
            this.element.classList.add('next-admin-card-panel');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }
            this.setStyle(this.options.style);

        }

        setStyle(style?: CardPanelStyle) {

            switch (style) {
                case CardPanelStyle.lightBackgroundLargeFont:
                    this.element.classList.add('light-bg-large-font');
                    break;
                default:
                case CardPanelStyle.none:
                    break;
            }

        }


    }

    export interface CardPanelOptions extends ControlOptions {

        isResponsive?: boolean;

        style?: CardPanelStyle;

    }

    export enum CardPanelStyle {
        none,
        lightBackgroundLargeFont
    }

}