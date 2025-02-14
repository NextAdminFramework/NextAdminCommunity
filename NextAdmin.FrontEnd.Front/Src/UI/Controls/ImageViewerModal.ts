


namespace NextAdmin.UI {

    export class ImageViewerModal extends NoUiModal {

        options: ImageViewerModalOptions;

        constructor(options: ImageViewerModalOptions) {
            super({
                size: NextAdmin.UI.ModalSize.large,
                ...options,
            });

            this.body.appendControl(new Slider({
                navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBgWhite,
                imagesSize: 'contain',
                imagePosition: 'center center',
                imageUrls: this.options.imageUrls,
                css: { height:'100%' }
            }));
        }

    }


    export interface ImageViewerModalOptions extends ModalOptions {

        imageUrls?: Array<string>;

    }


}