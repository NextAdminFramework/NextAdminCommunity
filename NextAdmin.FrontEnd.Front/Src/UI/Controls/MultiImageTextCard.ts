namespace NextAdmin.UI {

    export class MultiImageTextCard extends Control {

        options: TextMultiImagesCardOptions;

        cardBody: NextAdmin.UI.HorizontalFlexLayout;

        imageViewer: SliderImageViewer;

        public static style = `

        .next-admin-multi-image-text-card{

            padding-top:50px;
            padding-bottom:50px;

            .multi-image-text-card-body{

                border-radius:20px;
                box-shadow: 0px 0px 50px rgba(0,0,0,0.05);
                background:#fff;
                position:relative;

                .multi-image-text-card-images-viewer{
                    width:600px;
                    min-width:600px;
                    height:400px;
                    @media (max-width: 1280px) {
                        width:512px;
                        min-width:512;
                        height:337px;
                    }
                    @media (max-width: 1024px) {
                        width:400px;
                        min-width:400px;
                        height:300px;
                    }
                    @media (max-width: 768px) {
                        width:300px;
                        min-width:300px;
                        height:200px;
                    }
                    @media (max-width: 450px) {
                        width:170px;
                        min-width:170px;
                        height:120px;
                    }
                }
                .multi-image-text-card-images-viewer.responsive{
                    @media (max-width: 1280px) {
                        width:512px;
                        min-width:512;
                        height:337px;
                    }
                    @media (max-width: 1024px) {
                        width:400px;
                        min-width:400px;
                        height:300px;
                    }
                    @media (max-width: 768px) {
                        width:300px;
                        min-width:300px;
                        height:200px;
                    }
                    @media (max-width: 450px) {
                        width:170px;
                        min-width:170px;
                        height:120px;
                    }
                }
            }
        }

        `;

        constructor(options?: TextMultiImagesCardOptions) {
            super('div', {

                ...options
            } as TextMultiImagesCardOptions);

            Style.append('NextAdmin.UI.TextMultiImagesCard', MultiImageTextCard.style);
            this.element.classList.add('next-admin-multi-image-text-card');

            this.cardBody = this.element.appendControl(new NextAdmin.UI.HorizontalFlexLayout({ classes: ['multi-image-text-card-body'] }), (horizontalLayout) => {
                horizontalLayout.appendHTML('div', (leftContainer) => {
                    this.imageViewer = leftContainer.appendControl(new NextAdmin.UI.SliderImageViewer({
                        classes: ['multi-image-text-card-images-viewer'],
                        autoPlay: this.options.autoPlay,
                        page: this.options.page,
                        imageUrls: this.options.imageUrls
                    }), (slider) => {
                        slider.element.centerVertically();
                    });
                });

                horizontalLayout.appendHTMLStretch('div', (rightContainer) => {
                    rightContainer.appendHTML('div', (contentContainer) => {
                        contentContainer.style.padding = '10px';

                        contentContainer.appendControl(new NextAdmin.UI.Title({
                            htmlTag: 'h2',
                            style: NextAdmin.UI.TitleStyle.thinDarkGrey,
                            size: NextAdmin.UI.TitleSize.large,
                            text: this.options.title,
                        }));

                        contentContainer.appendControl(new NextAdmin.UI.Title({
                            htmlTag: 'h3',
                            style: NextAdmin.UI.TitleStyle.thinDarkGrey,
                            size: NextAdmin.UI.TitleSize.medium,
                            text: this.options.subTitle,
                        }));

                        contentContainer.appendControl(new NextAdmin.UI.Text({
                            htmlTag: 'p',
                            size: NextAdmin.UI.TextSize.large,
                            style: NextAdmin.UI.TextStyle.greyThin,
                            text: this.options.text,
                        }));
                        contentContainer.centerVertically();
                    });
                });
            });
        }

        dispose() {
            if (this.imageViewer) {
                this.imageViewer.dispose();
            }
        }


    }

    export interface TextMultiImagesCardOptions extends ControlOptions {

        imageUrls?: Array<string>;

        title?: string;

        subTitle?: string;

        text?: string;

        page?: Page;

        autoPlay?: boolean;

        isResponsive?: boolean;

    }
}