namespace NextAdmin.UI {

    export class ImageCard extends NextAdmin.UI.Control {

        options: ImageCardOptions;

        element: HTMLDivElement;

        card: HTMLAnchorElement;

        cardImage: HTMLDivElement;

        imageTitle?: HTMLDivElement;

        textContainer?: HTMLDivElement;

        descriptionTitle?: HTMLDivElement;

        description?: HTMLDivElement;

        animatedHoverText: AnimatedHoverText;


        public static style = `

        .next-admin-image-card-wrapper{
            display:inline-block;
            width:fit-content;
            position:relative;
        }

        .next-admin-image-card{
            display:block;
            cursor:pointer;
            overflow: hidden;
            position:relative;
        }

        .next-admin-image-card-image{
            width:100%;
            height:100%;
            display:block;
            position:relative;
            transition: transform 0.9s;
        }

        .next-admin-image-card-title{
            position:absolute;
            pointer-events: none;
            font-size:34px;
            font-weight:bold;
            width:100%;
            top:6%;
            padding-left:20px;
            padding-right:20px;
            color:#fff;
            text-shadow:0px 0px 2px rgba(0,0,0,0.75)
        }

        .next-admin-image-card-image:hover{
            transform: scale(1.1);
        }

        .next-admin-image-card-light-bordered {
            border:1px solid #e6e6e6;
        }
        .next-admin-image-card-border-radius{
            border-radius:16px;
            box-shadow:0px 0px 20px rgba(0,0,0,0.25);
        }

        .next-admin-image-card-extra-small-1-1{
            width:200px;
            height:200px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }
        .next-admin-image-card-wrapper.responsive .next-admin-image-card-extra-small-1-1{
            @media (max-width: 1024px) {
                width:160px;
                height:160px;
            }
            @media (max-width: 768px) {
                width:140px;
                height:140px;
            }
            @media (max-width: 400px) {
                width:100px;
                height:100px;
            }
        }

        .next-admin-image-card-small-1-1 {
            width:300px;
            height:300px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }

        .next-admin-image-card-small-4-3 {
            width:300px;
            height:225px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }

        .next-admin-image-card-small-3-4 {
            width:225px;
            height:300px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }

        .next-admin-image-card-small-9-16 {
            width:168px;
            height:300px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }

        .next-admin-image-card-medium-1-1 {
            width:400px;
            height:400px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }

        .next-admin-image-card-medium-4-3 {
            width:400px;
            height:300px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }

        .next-admin-image-card-medium-3-4 {
            width:300px;
            height:400px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }

        .next-admin-image-card-medium-9-16 {
            width:225px;
            height:400px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }

        .next-admin-image-card-large-1-1 {
            width:600px;
            height:600px;
        }

        .next-admin-image-card-large-4-3 {
            width:600px;
            height:450px;
        }

        .next-admin-image-card-large-3-4 {
            width:600;
            height:450;
        }

        .next-admin-image-card-large-9-16 {
            width:337px;
            height:600px;
        }

        .next-admin-image-card-outside-text{

            padding-top:10px;

            .next-admin-image-card-outside-title{
                font-size:14px;
                color:#999;
            }

            .next-admin-image-card-outside-description{
                font-size:14px;
                color:#444;
            }
        }

        `;

        constructor(options?: ImageCardOptions) {
            super('div', {
                size: ImageCardSize.medium_4_3,
                style: ImageCardStyle.fullImageLightBordered,
                isResponsive: true,
                ...options
            } as ImageCardOptions);

            NextAdmin.Style.append('Eshop.UI.Card', ImageCard.style);
            this.element.classList.add('next-admin-image-card-wrapper');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }
            this.card = this.element.appendHTML('a', (card) => {
                card.classList.add('next-admin-image-card');
                if (this.options.backgroundColor) {
                    card.style.background = this.options.backgroundColor;
                }

                this.cardImage = card.appendHTML('div', (imageContainer) => {
                    imageContainer.classList.add('next-admin-image-card-image');
                });
                this.imageTitle = card.appendHTML('div', (title) => {
                    title.classList.add('next-admin-image-card-title');
                });

                this.animatedHoverText = card.appendControl(new AnimatedHoverText({
                    css: {
                        position: 'absolute',
                        bottom: '6%'
                    }
                }));

            });

            this.textContainer = this.element.appendHTML('div', (textContainer) => {
                textContainer.classList.add('next-admin-image-card-outside-text');
                this.descriptionTitle = textContainer.appendHTML('div', (description) => {
                    description.classList.add('next-admin-image-card-outside-title');
                });
                this.description = textContainer.appendHTML('div', (description) => {
                    description.classList.add('next-admin-image-card-outside-description');
                });
            });


            this.setSize(this.options.size);
            this.setStyle(this.options.style);
            if (this.options.imageUrl) {
                this.setBackground(this.options.imageUrl);
            }
            if (this.options.imageTitle) {
                this.setImageTitle(this.options.imageTitle);
            }
            if (this.options.outsideTitle) {
                this.setDescriptionTitle(this.options.outsideTitle);
            }
            if (this.options.outsideDescription) {
                this.setDescription(this.options.outsideDescription);
            }
            if (this.options.imageHoverText) {
                this.setHoverText(this.options.imageHoverText);
            }
            this.element.addEventListener('pointerenter', () => {
                if (!NextAdmin.String.isNullOrEmpty(this.animatedHoverText.getText())) {
                    this.animatedHoverText.animDisplayText();
                }
            });
            this.element.addEventListener('pointerleave', () => {
                if (!NextAdmin.String.isNullOrEmpty(this.animatedHoverText.getText())) {
                    this.animatedHoverText.animHideText();
                }
            });
            if (this.options.href) {
                this.card.href = this.options.href;
            }

        }

        public setImageTitle(title?: string) {
            this.imageTitle.innerHTML = title ?? '';
        }

        public setDescriptionTitle(title?: string) {
            this.descriptionTitle.innerHTML = title ?? '';
        }

        public setDescription(title?: string) {
            this.description.innerHTML = title ?? '';
        }

        public setHoverText(hoverText?: string) {
            this.animatedHoverText.setText(hoverText);
        }




        public setSize(size: ImageCardSize) {
            switch (size) {
                default:
                case ImageCardSize.extraSmall_1_1:
                    this.card.classList.add('next-admin-image-card-extra-small-1-1');
                    break;
                case ImageCardSize.small_1_1:
                    this.card.classList.add('next-admin-image-card-small-1-1');
                    break;
                case ImageCardSize.small_4_3:
                    this.card.classList.add('next-admin-image-card-small-4-3');
                    break;
                case ImageCardSize.small_3_4:
                    this.card.classList.add('next-admin-image-card-small-3-4');
                    break;
                case ImageCardSize.small_9_16:
                    this.card.classList.add('next-admin-image-card-small-9-16');
                    break;

                case ImageCardSize.medium_1_1:
                    this.card.classList.add('next-admin-image-card-medium-1-1');
                    break;
                case ImageCardSize.medium_4_3:
                    this.card.classList.add('next-admin-image-card-medium-4-3');
                    break;
                case ImageCardSize.medium_3_4:
                    this.card.classList.add('next-admin-image-card-medium-3-4');
                    break;
                case ImageCardSize.medium_9_16:
                    this.card.classList.add('next-admin-image-card-medium-9-16');
                    break;

                case ImageCardSize.large_1_1:
                    this.card.classList.add('next-admin-image-card-large-1-1');
                    break;
                case ImageCardSize.large_4_3:
                    this.card.classList.add('next-admin-image-card-large-4-3');
                    break;
                case ImageCardSize.large_3_4:
                    this.card.classList.add('next-admin-image-card-medium-3-4');
                    break;
                case ImageCardSize.large_9_16:
                    this.card.classList.add('next-admin-image-card-large-9-16');
                    break;
            }
        }

        public setStyle(style: ImageCardStyle) {
            switch (style) {
                default:
                case ImageCardStyle.fullImageLightBordered:
                    this.card.classList.add('next-admin-image-card-light-bordered');
                    break;
                case ImageCardStyle.fullImageShadowedBorderRadius:
                    this.card.classList.add('next-admin-image-card-border-radius');
                    break;
            }
        }

        public setBackground(url?: string) {
            if (url) {
                this.cardImage.style.background = 'url("' + url + '")';
                this.cardImage.style.backgroundSize = 'cover';
                this.cardImage.style.backgroundRepeat = 'no-repeat';
                this.cardImage.style.backgroundPosition = 'center';

            }
            else {
                this.cardImage.style.background = 'unset';
            }
        }

    }

    export interface ImageCardOptions extends NextAdmin.UI.ControlOptions {

        size?: ImageCardSize;

        style?: ImageCardStyle;

        imageUrl?: string;

        backgroundColor?: string;

        imageTitle?: string;

        imageHoverText?: string;

        outsideTitle?: string;

        outsideDescription?: string;

        href?: string;

        isResponsive?: boolean;

        action?: (card: ImageCard) => void;

    }


    export enum ImageCardSize {
        extraSmall_1_1,
        small_1_1,
        small_4_3,
        small_3_4,
        small_9_16,

        medium_1_1,
        medium_4_3,
        medium_3_4,
        medium_9_16,

        large_1_1,
        large_4_3,
        large_3_4,
        large_9_16,
    }

    export enum ImageCardStyle {
        fullImageLightBordered,
        fullImageShadowedBorderRadius,
    }

}