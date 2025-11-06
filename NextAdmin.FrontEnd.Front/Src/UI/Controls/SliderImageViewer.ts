namespace NextAdmin.UI {

    export class SliderImageViewer extends Slider {

        options: SliderImageViewerOptions;

        hoverText: AnimatedHoverText;

        public static style = `
        .next-admin-slider-image-viewer{

            .image-viewer-slide-image{
                cursor:pointer;
                transition: all 0.9s;
            }
            .image-viewer-slide-image-zoom{
                transform: scale(0.95);
            }
            .image-viewer-slide-image-zoom:hover{
                transform: scale(1.02);
            }
        }

        `;

        constructor(options?: SliderImageViewerOptions) {
            super({
                openInFullScreenText: FrontEndResources.display,
                navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBg,
                isImageHoverZoomEnabled: true,
                imagesSize: 'contain',
                ...options
            } as SliderImageViewerOptions);
            Style.append('NextAdmin.UI.SliderImageViewer', SliderImageViewer.style);
            this.element.classList.add('next-admin-slider-image-viewer');
            this.hoverText = this.element.appendControl(new AnimatedHoverText({
                css: {
                    position: 'absolute',
                    bottom:'20%'
                },
                text: this.options.openInFullScreenText
            }));
        }

        appendSlide<TSlide extends Slide>(control: TSlide, configAction?: (control: TSlide) => void): TSlide {
            let slide = super.appendSlide(control, configAction);
            slide.element.classList.add('image-viewer-slide-image');
            if (this.options.isImageHoverZoomEnabled) {
                slide.element.classList.add('image-viewer-slide-image-zoom');
            }
            slide.element.addEventListener('pointerenter', () => {
                this.hoverText.animDisplayText();
            });
            slide.element.addEventListener('pointerleave', () => {
                this.hoverText.animHideText();
            });
            slide.element.addEventListener('click', () => {
                this.openImagesViewerModal();
            });
            return slide;
        }

        openImagesViewerModal() {
            new ImageViewerModal({ imageUrls: this.slides.where(a => a.options.imageUrl != null).select(a => a.options.imageUrl) }).open();
        }

    }


    export interface SliderImageViewerOptions extends SliderOptions {

        openInFullScreenText?: string;

        isImageHoverZoomEnabled?: boolean;

    }


}