namespace NextAdmin.UI {

    export class Image extends Control {

        options: ImageOptions;

        image: HTMLImageElement;

        public static style = `

        .next-admin-image-container {

            width:100%;
            height:100%;

            .next-admin-image{
                width:100%;
                height:100%;
                object-fit:contain;
            }

            .next-admin-image.next-admin-image-light-border{
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            }
            .next-admin-image.next-admin-image-white-border{
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            }
        }

        `;

        constructor(options?: ImageOptions) {
            super('div', {
                style: ImageStyle.none,
                displayMode: ImageDisplayMode.contain,
                ...options
            } as ImageOptions);

            Style.append("NextAdmin.UI.Image", Image.style);
            this.element.classList.add('next-admin-image-container');
            if (this.options.width) {
                this.element.style.width = this.options.width;
            }
            if (this.options.height) {
                this.element.style.height = this.options.height;
            }

            this.image = this.element.appendHTML('img', (image) => {
                image.classList.add('next-admin-image');
                image.style.width = '100%';
                image.style.height = '100%';
                //image.style.backgroundColor = '#f9f9f9';
                image.src = this.options.src;
            });

            this.setStyle(this.options.style);
            this.setDisplayMode(this.options.displayMode);
        }

        setStyle(style?: ImageStyle){
            switch (style) {
                default:
                case ImageStyle.none:
                    break;
                case ImageStyle.lightBordered:
                    this.image.classList.add('next-admin-image-light-border');
                    break;
                case ImageStyle.whiteBordered:
                    this.image.classList.add('next-admin-image-white-border');
                    break;
            }
        }

        setDisplayMode(displayMode: ImageDisplayMode) {
            switch (displayMode) {
                default:
                case ImageDisplayMode.contain:
                    this.image.style.objectFit = 'contain'
                    break;
                case ImageDisplayMode.cover:
                    this.image.style.objectFit = 'cover'
                    break;
                case ImageDisplayMode.stretch:
                    this.image.style.objectFit = 'fill'
                    break;                
            }
        }


    }

    export interface ImageOptions extends ControlOptions{

        width?: string;

        height?: string;

        src?: string;

        style?: ImageStyle;

        displayMode?: ImageDisplayMode;

    }

    export enum ImageStyle {
        none,
        lightBordered,
        whiteBordered
    }

    export enum ImageDisplayMode {
        contain,
        cover,
        stretch
    }

}