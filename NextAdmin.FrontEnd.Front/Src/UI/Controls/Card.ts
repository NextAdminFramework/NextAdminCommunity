namespace NextAdmin.UI {

    export class Card extends Control {

        public static style = `

        .next-admin-card{
            width:100%;
            min-height:50px;
            margin-top:20px;
            margin-bottom:20px;
            box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            border-radius:10px;

            .card-image{
                height:100%;
                min-height:100px;
                width:200px;
                min-width:200px;
                max-width:200px;
            }

            .card-body{
                padding:10px;
            }
        }
        .next-admin-card.responsive{

            @media (max-width: 768px) {
                .card-image{
                    height:100%;
                    min-height:164px;
                    width:128px;
                    min-width:128px;
                    max-width:128px;
                }
            }
        }


        `;

        title: NextAdmin.UI.Title;

        body: HTMLDivElement;

        textContainer: HTMLDivElement;

        footer: HTMLDivElement;

        options: CardOptions;

        constructor(options?: CardOptions) {
            super('div', {
                imageSize: 'cover',
                imagePosition: 'center center',
                isResponsive: true,
                ...options
            } as PinsCardOptions);
            Style.append('NextAdmin.UI.Card', Card.style);
            this.element.classList.add('next-admin-card');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }

            this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout(), (layout) => {

                if (this.options.imageUrl) {
                    layout.appendHTML('div', (imageContainer) => {
                        imageContainer.classList.add('card-image');
                        imageContainer.style.background = 'url("' + this.options.imageUrl + '")';
                        imageContainer.style.backgroundColor = '#f5f5f5';
                        imageContainer.style.backgroundSize = this.options.imageSize;
                        imageContainer.style.backgroundRepeat = 'no-repeat';
                        imageContainer.style.backgroundPosition = this.options.imagePosition;
                    });
                }

                layout.appendHTML('div', (cardBody) => {
                    cardBody.classList.add('card-body');

                    cardBody.appendControl(new NextAdmin.UI.VerticalFlexLayout(), (bodyLayout) => {

                        this.body = bodyLayout.appendHTMLStretch('div', (stretchContainer) => {

                            if (this.options.title) {
                                this.title = stretchContainer.appendControl(new NextAdmin.UI.Title({
                                    size: NextAdmin.UI.TitleSize.medium,
                                    text: this.options.title
                                }));
                            }
                            if (this.options.text) {
                                this.textContainer = stretchContainer.appendHTML('div', (textContainer) => {
                                    textContainer.innerHTML = this.options.text;
                                });
                            }
                            if (this.options.content) {
                                stretchContainer.appendChild(this.options.content);
                            }
                        });

                        this.footer = bodyLayout.appendHTML('div', (footer) => {

                        });

                    });

                });

            });

        }

    }

    export interface CardOptions extends ControlOptions {

        imageUrl?: string;

        imageSize?: string;

        imagePosition?: string;

        title?: string;

        text?: string;

        content?: HTMLElement;

        isResponsive?: boolean;

    }

}