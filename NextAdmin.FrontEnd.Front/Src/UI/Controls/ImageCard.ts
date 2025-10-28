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
            overflow: hidden;
            position:relative;
            width:100%;
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
        .next-admin-image-card-no-border {
            .next-admin-image-card{
                border:0px;
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }
        .next-admin-image-card-light-bordered {
            .next-admin-image-card{
                border:1px solid #e6e6e6;
            }
        }
        .next-admin-image-card-light-bordered-text-center{
            .next-admin-image-card{
                border:1px solid #e6e6e6;
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-border-radius{
            .next-admin-image-card{
                border-radius:10%;
                box-shadow:0px 0px 20px rgba(0,0,0,0.25);
            }
        }
        .next-admin-image-card-border-radius-text-center{
            .next-admin-image-card{
                border-radius:10%;
                box-shadow:0px 0px 20px rgba(0,0,0,0.25);
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-border-radius-b{
            .next-admin-image-card{
                border-radius:10%;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.5);
            }
        }

        .next-admin-image-card-border-radius-b-text-center{
            .next-admin-image-card{
                border-radius:10%;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.5);
            }
            .next-admin-image-card-outside-title{
                text-align:center;
            }
            .next-admin-image-card-outside-description{
                text-align:center;
            }
        }

        .next-admin-image-card-wrapper.ultra-small{
            width:100px;
            .next-admin-image-card-title{
                font-size:14px;
            }
        }
        .next-admin-image-card-wrapper.extra-small{
            width:200px;
            .next-admin-image-card-title{
                font-size:16px;
            }
        }

        .next-admin-image-card-wrapper.small{
            width:300px;
            .next-admin-image-card-title{
                font-size:18px;
            }
        }
        .next-admin-image-card-wrapper.medium{
            width:400px;
            .next-admin-image-card-title{
                font-size:20px;
            }
        }
        .next-admin-image-card-wrapper.large{
            width:500px;
            .next-admin-image-card-title{
                font-size:24px;
            }
        }
        
        .next-admin-image-card-ultra-small-1-1{
            height:100px;
        }
        .next-admin-image-card-extra-small-1-1{
            height:200px;
        }

        .next-admin-image-card-small-1-1 {
            height:300px;
        }

        .next-admin-image-card-small-4-3 {
            height:225px;
        }

        .next-admin-image-card-small-3-4 {
            height:400px;
        }

        .next-admin-image-card-small-9-16 {
            height:531px;
        }

        .next-admin-image-card-medium-1-1 {
            height:400px;
        }

        .next-admin-image-card-medium-4-3 {
            height:300px;
        }

        .next-admin-image-card-medium-3-4 {
            height:532px;
        }

        .next-admin-image-card-medium-9-16 {
            height:708px;
        }

        .next-admin-image-card-large-1-1 {
            height:500px;
        }

        .next-admin-image-card-large-4-3 {
            height:375px;
        }

        .next-admin-image-card-large-3-4 {
            height:665;
        }

        .next-admin-image-card-large-9-16 {
            height:885px;
        }

        .next-admin-image-card-outside-text{
            width:100%;
            height:50px;
            padding-top:10px;
            font-size:14px;
            .next-admin-image-card-outside-title{
                text-overflow: ellipsis;
                color:#444;
            }

            .next-admin-image-card-outside-description{
                text-overflow: ellipsis;
                color:#999;
                font-size:12px;
            }
        }
        .next-admin-image-card-wrapper.small{
            .next-admin-image-card-outside-text{
                height:40px;
            }
        }

        .next-admin-image-card-wrapper.ultra-small{
            .next-admin-image-card-outside-text{
                height:20px;
            }
        }
        .next-admin-image-card-wrapper.extra-small{
            .next-admin-image-card-outside-text{
                height:30px;
            }
        }
        .next-admin-image-card-wrapper.ultra-small.responsive{
            @media (max-width: 1024px) {
                width:80px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                    .next-admin-image-card-outside-description{
                        font-size:11px;
                    }
                }
            }
            @media (max-width: 768px) {
                width:60px;
                .next-admin-image-card-outside-text{
                    padding-top:4px;
                    font-size:11px;
                }
            }
            @media (max-width: 512px) {
                width:40px;
                .next-admin-image-card-outside-text{
                    padding-top:2px;
                    font-size:10px;
                    .next-admin-image-card-outside-description{
                        font-size:9px;
                    }
                }
            }
        }


        .next-admin-image-card-wrapper.extra-small.responsive{
            @media (max-width: 1024px) {
                width:160px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                    .next-admin-image-card-outside-description{
                        font-size:11px;
                    }
                }
            }
            @media (max-width: 768px) {
                width:140px;
                .next-admin-image-card-outside-text{
                    padding-top:4px;
                    font-size:11px;
                }
            }
            @media (max-width: 512px) {
                width:100px;
                .next-admin-image-card-outside-text{
                    padding-top:2px;
                    font-size:10px;
                    .next-admin-image-card-outside-description{
                        font-size:9px;
                    }
                }
            }
        }

        .next-admin-image-card-wrapper.small.responsive{
            @media (max-width: 1024px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:13px;
                    .next-admin-image-card-outside-description{
                        font-size:12px;
                    }
                }
            }
            @media (max-width: 768px) {
                width:180px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                    .next-admin-image-card-outside-description{
                        font-size:11px;
                    }
                }
            }
            @media (max-width: 512px) {
                width:160px;
                .next-admin-image-card-outside-text{
                    padding-top:4px;
                    font-size:11px;
                    .next-admin-image-card-outside-description{
                        font-size:10px;
                    }
                }
            }
        }
        .next-admin-image-card-wrapper.medium.responsive{
            @media (max-width: 1024px) {
                width:300px;
                .next-admin-image-card-outside-text{
                    padding-top:8px;
                    font-size:14px;
                    .next-admin-image-card-outside-description{
                        font-size:12px;
                    }
                }
            }
            @media (max-width: 768px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:13px;
                    .next-admin-image-card-outside-description{
                        font-size:12px;
                    }
                }
            }
            @media (max-width: 512px) {
                width:160px;
                .next-admin-image-card-outside-text{
                    padding-top:5px;
                    font-size:12px;
                    .next-admin-image-card-outside-description{
                        font-size:11px;
                    }
                }
            }
        }
        .next-admin-image-card-wrapper.large.responsive{
            @media (max-width: 1024px) {
                width:400px;
            }
            @media (max-width: 768px) {
                width:300px;
                .next-admin-image-card-outside-text{
                    padding-top:8px;
                    font-size:13px;
                    .next-admin-image-card-outside-description{
                        font-size:12px;
                    }
                }
            }
            @media (max-width: 512px) {
                width:240px;
                .next-admin-image-card-outside-text{
                    padding-top:6px;
                    font-size:12px;
                    .next-admin-image-card-outside-description{
                        font-size:11px;
                    }
                }
            }
        }


        .next-admin-image-card-wrapper.responsive{

            .next-admin-image-card-ultra-small-1-1{
                @media (max-width: 1024px) {
                    height:80px;
                }
                @media (max-width: 768px) {
                    height:60px;
                }
                @media (max-width: 512px) {
                    height:40px;
                }
            }

            .next-admin-image-card-extra-small-1-1{
                @media (max-width: 1024px) {
                    height:160px;
                }
                @media (max-width: 768px) {
                    height:140px;
                }
                @media (max-width: 512px) {
                    height:100px;
                }
            }
            .next-admin-image-card-small-1-1 {
                @media (max-width: 1024px) {
                    height:240px;
                }
                @media (max-width: 768px) {
                    height:180px;
                }
                @media (max-width: 512px) {
                    height:160px;
                }
            }
            .next-admin-image-card-small-4-3 {
                @media (max-width: 1024px) {
                    height:180px;
                }
                @media (max-width: 768px) {
                    height:135px;
                }
                @media (max-width: 400px) {
                    height:120px;
                }
            }

            .next-admin-image-card-small-3-4 {
                @media (max-width: 1024px) {
                    height:320px;
                }
                @media (max-width: 768px) {
                    height:240px;
                }
                @media (max-width: 400px) {
                    height:212px;
                }
            }

            .next-admin-image-card-small-9-16 {
                @media (max-width: 1024px) {
                    height:424px;
                }
                @media (max-width: 768px) {
                    height:318px;
                }
                @media (max-width: 400px) {
                    height:284px;
                }
            }

            .next-admin-image-card-medium-1-1 {
                @media (max-width: 1024px) {
                    height:300px;
                }
                @media (max-width: 768px) {
                    height:240px;
                }
                @media (max-width: 400px) {
                    height:180px;
                }
            }

            .next-admin-image-card-medium-4-3 {
                @media (max-width: 1024px) {
                    height:225px;
                }
                @media (max-width: 768px) {
                    height:180px;
                }
                @media (max-width: 400px) {
                    height:135px;
                }
            }

            .next-admin-image-card-medium-3-4 {
                @media (max-width: 1024px) {
                    height:400px;
                }
                @media (max-width: 768px) {
                    height:320px;
                }
                @media (max-width: 400px) {
                    height:240px;
                }
            }

            .next-admin-image-card-medium-9-16 {
                @media (max-width: 1024px) {
                    height:531px;
                }
                @media (max-width: 768px) {
                    height:424px;
                }
                @media (max-width: 400px) {
                    height:318px;
                }
            }

            .next-admin-image-card-large-1-1 {
                @media (max-width: 1024px) {
                    height:400px;
                }
                @media (max-width: 768px) {
                    height:300px;
                }
                @media (max-width: 400px) {
                    height:240px;
                }
            }

            .next-admin-image-card-large-4-3 {
                @media (max-width: 1024px) {
                    height:300px;
                }
                @media (max-width: 768px) {
                    height:225x;
                }
                @media (max-width: 400px) {
                    height:180x;
                }
            }

            .next-admin-image-card-large-3-4 {
                @media (max-width: 1024px) {
                    height:532px;
                }
                @media (max-width: 768px) {
                    height:400px;
                }
                @media (max-width: 400px) {
                    height:320px;
                }
            }

            .next-admin-image-card-large-9-16 {
                @media (max-width: 1024px) {
                    height:708px;
                }
                @media (max-width: 768px) {
                    height:531px;
                }
                @media (max-width: 400px) {
                    height:425px;
                }
            }
        }
        .next-admin-image-card-wrapper.selected{
            .next-admin-image-card{
                box-sizing:border-box;
                box-shadow:0px 0px 0px rgba(0,0,0,0.25);
                border:1px solid ` + DefaultStyle.BlueOne + `;
            }
        }

        `;

        constructor(options?: ImageCardOptions) {
            super('div', {
                size: ImageCardSize.medium_4_3,
                style: ImageCardStyle.imageLightBorderedTextLeft,
                isResponsive: true,
                multiImageDisplayDelay:5000,
                ...options
            } as ImageCardOptions);

            NextAdmin.Style.append('Eshop.UI.Card', ImageCard.style);
            this.element.classList.add('next-admin-image-card-wrapper');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }
            this.card = this.element.appendHTML('a', (card) => {
                card.classList.add('next-admin-image-card');
                if (this.options.href || this.options.action) {
                    card.style.cursor = 'pointer';
                }

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
            if (this.options.imageSrc) {
                if (Array.isArray(this.options.imageSrc)) {
                    this.setMultiImageSrcs(this.options.imageSrc)
                } else {
                    this.setImageSrc(this.options.imageSrc);
                }
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
                case ImageCardSize.ultraSmall_1_1:
                    this.element.classList.add('ultra-small');
                    this.card.classList.add('next-admin-image-card-ultra-small-1-1');
                    break;
                case ImageCardSize.extraSmall_1_1:
                    this.element.classList.add('extra-small');
                    this.card.classList.add('next-admin-image-card-extra-small-1-1');
                    break;
                case ImageCardSize.small_1_1:
                    this.element.classList.add('small');
                    this.card.classList.add('next-admin-image-card-small-1-1');
                    break;
                case ImageCardSize.small_4_3:
                    this.element.classList.add('small');
                    this.card.classList.add('next-admin-image-card-small-4-3');
                    break;
                case ImageCardSize.small_3_4:
                    this.element.classList.add('small');
                    this.card.classList.add('next-admin-image-card-small-3-4');
                    break;
                case ImageCardSize.small_9_16:
                    this.element.classList.add('small');
                    this.card.classList.add('next-admin-image-card-small-9-16');
                    break;

                case ImageCardSize.medium_1_1:
                    this.element.classList.add('medium');
                    this.card.classList.add('next-admin-image-card-medium-1-1');
                    break;
                case ImageCardSize.medium_4_3:
                    this.element.classList.add('medium');
                    this.card.classList.add('next-admin-image-card-medium-4-3');
                    break;
                case ImageCardSize.medium_3_4:
                    this.element.classList.add('medium');
                    this.card.classList.add('next-admin-image-card-medium-3-4');
                    break;
                case ImageCardSize.medium_9_16:
                    this.element.classList.add('medium');
                    this.card.classList.add('next-admin-image-card-medium-9-16');
                    break;

                case ImageCardSize.large_1_1:
                    this.element.classList.add('large');
                    this.card.classList.add('next-admin-image-card-large-1-1');
                    break;
                case ImageCardSize.large_4_3:
                    this.element.classList.add('large');
                    this.card.classList.add('next-admin-image-card-large-4-3');
                    break;
                case ImageCardSize.large_3_4:
                    this.element.classList.add('large');
                    this.card.classList.add('next-admin-image-card-large-3-4');
                    break;
                case ImageCardSize.large_9_16:
                    this.element.classList.add('large');
                    this.card.classList.add('next-admin-image-card-large-9-16');
                    break;
            }
        }

        public setStyle(style: ImageCardStyle) {
            switch (style) {
                default:
                case ImageCardStyle.imageNoBorderTextCenter:
                    this.element.classList.add('next-admin-image-card-no-border');
                    break;

                case ImageCardStyle.imageLightBorderedTextLeft:
                    this.element.classList.add('next-admin-image-card-light-bordered');
                    break;
                case ImageCardStyle.imageLightBorderedTextCenter:
                    this.element.classList.add('next-admin-image-card-light-bordered-text-center');
                    break;


                case ImageCardStyle.imageShadowedBorderRadiusTextLeft:
                    this.element.classList.add('next-admin-image-card-border-radius');
                    break;
                case ImageCardStyle.imageShadowedBorderRadiusTextCenter:
                    this.element.classList.add('next-admin-image-card-border-text-center');
                    break;

                case ImageCardStyle.imageShadowedBorderRadiusBTextLeft:
                    this.element.classList.add('next-admin-image-card-border-radius-b');
                    break;
                case ImageCardStyle.imageShadowedBorderRadiusBTextCenter:
                    this.element.classList.add('next-admin-image-card-border-radius-b-text-center');
                    break;
            }
        }

        private _isImageAutoPlayingEnabled = true;

        private async setMultiImageSrcs(srcs: Array<string>) {
            let i = 0;
            let isFirstImage = true;
            while (this._isImageAutoPlayingEnabled) {
                if (!isFirstImage) {
                    await this.cardImage.anim('fadeOut', { animationSpeed: NextAdmin.AnimationSpeed.faster });
                }
                this.setImageSrc(srcs[i]);
                if (!isFirstImage) {
                    this.cardImage.anim('fadeIn', { animationSpeed: NextAdmin.AnimationSpeed.faster });
                }
                await NextAdmin.Timer.sleep(this.options.multiImageDisplayDelay);
                
                i++;
                if (i == (srcs.length)) {
                    i = 0;
                }
                isFirstImage = false;
            }
        }

        public setImageSrc(src?: string) {
            if (src) {
                this.cardImage.style.background = 'url("' + src + '")';
                this.cardImage.style.backgroundSize = 'cover';
                this.cardImage.style.backgroundRepeat = 'no-repeat';
                this.cardImage.style.backgroundPosition = 'center';
            }
            else {
                this.cardImage.style.background = 'unset';
            }
        }

        public displayAsSelected() {
            this.element.classList.add('selected');

        }

        public displayAsUnselected() {
            if (this.element.classList.contains('selected')) {
                this.element.classList.remove('selected');
            }
        }

        public isSelected(): boolean {
            return this.element.classList.contains('selected');
        }

        public dispose() {
            this._isImageAutoPlayingEnabled = false;
        }

    }

    export interface ImageCardOptions extends NextAdmin.UI.ControlOptions {

        size?: ImageCardSize;

        style?: ImageCardStyle;

        imageSrc?: string | Array<string>;

        multiImageDisplayDelay?: number;

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
        ultraSmall_1_1 = 1,
        extraSmall_1_1 = 100,
        small_1_1 = 300,
        small_4_3 = 301,
        small_3_4 = 302,
        small_9_16 = 303,

        medium_1_1 = 500,
        medium_4_3 = 501,
        medium_3_4 = 502,
        medium_9_16 = 503,

        large_1_1 = 700,
        large_4_3 = 701,
        large_3_4 = 702,
        large_9_16 = 703,
    }

    export enum ImageCardStyle {
        imageNoBorderTextCenter = 0,
        imageLightBorderedTextLeft = 10,
        imageLightBorderedTextCenter = 11,
        imageShadowedBorderRadiusTextLeft = 20,
        imageShadowedBorderRadiusTextCenter = 21,
        imageShadowedBorderRadiusBTextLeft = 30,
        imageShadowedBorderRadiusBTextCenter = 31,
    }

}