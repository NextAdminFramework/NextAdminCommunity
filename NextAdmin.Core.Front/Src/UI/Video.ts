namespace NextAdmin.UI {

    export class Video extends Control {

        options: VideoOptions;

        video: HTMLVideoElement;

        public static style = `

        .next-admin-video-container {

            width:100%;
            height:100%;

            .next-admin-video{
                width:100%;
                height:100%;
                object-fit:contain;
            }

            .next-admin-video.next-admin-video-light-border{
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            }
            .next-admin-video.next-admin-video-white-border{
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow:0px 0px 2px rgba(0,0,0,0.25);
            }
        }

        `;

        constructor(options?: VideoOptions) {
            super('div', {
                style: VideoStyle.none,
                displayMode: VideoDisplayMode.contain,
                isAutoplay: true,
                isMuted: true,
                isLoop: true,
                hasControls: false,
                ...options
            } as VideoOptions);

            Style.append("NextAdmin.UI.Video", Video.style);
            this.element.classList.add('next-admin-video-container');
            if (this.options.width) {
                this.element.style.width = this.options.width;
            }
            if (this.options.height) {
                this.element.style.height = this.options.height;
            }

            this.video = this.element.appendHTML('video', (video) => {
                video.classList.add('next-admin-video');
                video.autoplay = this.options.isAutoplay;
                video.muted = this.options.isMuted;
                video.loop = this.options.isLoop;
                video.controls = this.options.hasControls;
            });
            if (Array.isArray(this.options.src)) {
                for (let src of this.options.src) {
                    this.addSource(src);
                }
            } else if (this.options.src) {
                this.addSource(this.options.src)
            }

            this.setStyle(this.options.style);
            this.setDisplayMode(this.options.displayMode);
        }

        addSource(src?: string) {
            this.video.appendHTML('source', (source) => {
                source.src = src;
            });
        }

        setStyle(style?: VideoStyle) {
            switch (style) {
                default:
                case VideoStyle.none:
                    break;
                case VideoStyle.lightBordered:
                    this.video.classList.add('next-admin-video-light-border');
                    break;
                case VideoStyle.whiteBordered:
                    this.video.classList.add('next-admin-video-white-border');
                    break;
            }
        }

        setDisplayMode(displayMode: VideoDisplayMode) {
            switch (displayMode) {
                default:
                case VideoDisplayMode.contain:
                    this.video.style.objectFit = 'contain'
                    break;
                case VideoDisplayMode.cover:
                    this.video.style.objectFit = 'cover'
                    break;
                case VideoDisplayMode.stretch:
                    this.video.style.objectFit = 'fill'
                    break;
            }
        }


    }

    export interface VideoOptions extends ControlOptions {

        width?: string;

        height?: string;

        isAutoplay?: boolean;

        isMuted?: boolean;

        isLoop?: boolean;

        hasControls?: boolean;

        src?: string | Array<string>;

        style?: VideoStyle;

        displayMode?: VideoDisplayMode;

    }

    export enum VideoStyle {
        none,
        lightBordered,
        whiteBordered
    }

    export enum VideoDisplayMode {
        contain,
        cover,
        stretch
    }

}