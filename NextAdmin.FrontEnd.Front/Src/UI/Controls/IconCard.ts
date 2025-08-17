namespace NextAdmin.UI {

    export class IconCard extends Control {

        public static style = `

        .next-admin-icon-card{
            width:140px;
            height:140px;
            display:inline-block;
            position:relative;

            .icon-card-icon-and-label{
                width:120px;
                height:120px;
                margin:10px;
                display:block;
                position:absolute;

                .icon-card-icon{
                    background:#fff;
                    border-radius:4px;
                    box-shadow:0px 0px 2px rgba(0,0,0,0.25);
                    width:84px;
                    height:84px;
                    margin-left:18px;
                    font-size:40px;
                    color:#444;
                    text-align:center;
                    line-height:84px;
                    cursor:pointer;
                }
                .icon-card-icon:hover{
                    box-shadow:inset 0px 0px 2px rgba(0,0,0,0.25);

                }
                .icon-card-icon-label{
                    height:36px;
                    text-align:center;
                    padding-top:5px;
                }
            }

            @media screen and (max-width: 440px) {
                width:120px;
                height:120px;
                .icon-card-icon-and-label{
                    margin:0px;
                }
            }
        }
        `;


        options: IconCardOptions;

        constructor(options?: IconCardOptions) {
            super('div', {
                ...options
            } as PinsCardOptions);
            Style.append('next-admin-icon-card', IconCard.style);
            this.element.classList.add('next-admin-icon-card');

            this.element.appendHTML('div', (iconAndLabel) => {
                iconAndLabel.classList.add('icon-card-icon-and-label');

                iconAndLabel.appendHTML('div', async (icon) => {
                    icon.classList.add('icon-card-icon');
                    if (this.options.imageUrl) {
                        icon.style.backgroundImage = 'url(' + this.options.imageUrl + ')';
                        icon.style.backgroundRepeat = 'no-repeat';
                        icon.style.backgroundSize = 'cover';
                    }
                    else if (this.options.icon) {
                        icon.innerHTML = this.options.icon;
                        icon.style.backgroundColor = '#f0f0f0';
                    }
                    icon.addEventListener('click', () => {
                        if (this.options.action) {
                            this.options.action();
                        }
                    });
                });
                iconAndLabel.appendHTML('div', (span) => {
                    span.classList.add('icon-card-icon-label');
                    span.innerHTML = this.options.text;
                });
            });
        }

    }

    export interface IconCardOptions extends ControlOptions {

        icon?: string;

        imageUrl?: string;

        text?: string;

        action?: ()=>void;

    }

}