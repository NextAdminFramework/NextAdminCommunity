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
                multiFramePlayingMode: MultiFramePlayingMode.auto,
                frameDuration:1000,
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
                if (Array.isArray(this.options.src)) {
                    image.src = this.options.src[0];
                } else {
                    image.src = this.options.src;
                }
            });

            this.setStyle(this.options.style);
            this.setDisplayMode(this.options.displayMode);
            if (Array.isArray(this.options.src)) {
                if (this.options.multiFramePlayingMode == MultiFramePlayingMode.auto) {
                    this.startPlayFrames();
                } else if (this.options.multiFramePlayingMode == MultiFramePlayingMode.onHover) {
                    this.element.addEventListener('mouseenter', () => {
                        this.startPlayFrames();
                    });
                    this.element.addEventListener('mouseleave', () => {
                        this.stopPlayFrames();
                    });
                }
            }
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

        private _isMultiFramePlaying = false;

        async startPlayFrames(srcs?: Array<string>, frameDuration?: number) {
            if (this._isMultiFramePlaying) {
                return;
            }
            if (frameDuration == null) {
                frameDuration = this.options.frameDuration;
            }
            if (srcs == null && Array.isArray(this.options.src)) {
                srcs = this.options.src as Array<string>;
            }
            if (srcs == null) {
                return;
            }
            this._isMultiFramePlaying = true;
            let i = 0;
            let isFirstImage = true;
            while (this._isMultiFramePlaying) {
                this.image.src = srcs[i];
                await NextAdmin.Timer.sleep(frameDuration);
                i++;
                if (i == (srcs.length)) {
                    i = 0;
                }
                isFirstImage = false;
            }
        }

        stopPlayFrames() {
            this._isMultiFramePlaying = false;
        }

        public dispose() {
            this._isMultiFramePlaying = false;
        }
    }

    export interface ImageOptions extends ControlOptions{

        width?: string;

        height?: string;

        src?: string | Array<string>;

        frameDuration?: number;

        multiFramePlayingMode?: MultiFramePlayingMode;

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

    export enum MultiFramePlayingMode {
        manual,
        auto,
        onHover
    }

}