
namespace NextAdmin.UI {

    export class MultiImageViwer extends Control {


        options: MultiImageViwerOptions;

        mainImageContainer: AspectRatioContainer;

        miniatureImagesContainer: HTMLDivElement;

        private _images = new Dictionary<MultiImageViwerImageItem>();

        private _activeImageId?: string;

        public static style = `

        .next-admin-multi-image-viewer{

            .image-viewer-main-image {
                width:100%;
                height:100%;
                object-fit: contain;
                background-color:#f9f9f9;
                border-radius:6px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
            }

            .image-viewer-image-min{
                display:inline-block;
                margin:5px;
                border-radius:6px;
                box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
                cursor:pointer;
                width:128px;
                height:128px;
            }

            .image-viewer-image-min-active {
                box-shadow: inset 0px 0px 2px rgba(0,0,0,0.5);
            }
        }
        .next-admin-multi-image-viewer-responsive{
            .image-viewer-image-min{
                @media (max-width: 1024px) {
                    width:96px;
                    height:96px;
                }
                @media (max-width: 768px) {
                    width:64px;
                    height:64px;
                }
            }
        }
        `;


        constructor(options?: MultiImageViwerOptions) {
            super('div', {
                aspectRationWidth: 1,
                aspectRationHeight: 1,
                isResponsive: true,
                canOpenInFullScreen: true,
                ...options
            } as MultiImageViwerOptions);
            Style.append('NextAdmin.UI.MultiImageViwer', MultiImageViwer.style);
            this.element.classList.add('next-admin-multi-image-viewer');
            if (this.options.isResponsive) {
                this.element.classList.add('next-admin-multi-image-viewer-responsive');
            }
            this.mainImageContainer = this.element.appendControl(new AspectRatioContainer({
                width: this.options.aspectRationWidth,
                height: this.options.aspectRationHeight
            }));
            this.miniatureImagesContainer = this.element.appendHTML('div', (miniatureImagesContainer) => {
                miniatureImagesContainer.style.marginTop = '5px';
                miniatureImagesContainer.style.display = 'none';
            });
            if (this.options.imageItems) {
                for (let imageItem of this.options.imageItems) {
                    this.addImageItem(imageItem);
                }
            }
            if (this.options.imageUrls) {
                for (let imageUrl of this.options.imageUrls) {
                    this.addImageItem({ url: imageUrl });
                }
            }
        }

        addImageItem(imageItem: MultiImageViwerImageItem) {
            let imageId = Guid.createStrGuid();
            this._images.add(imageId, imageItem);

            this.miniatureImagesContainer.appendHTML('div', (imageMin) => {
                imageMin.classList.add('image-viewer-image-min');
                imageMin.id = imageId;
                if (this.options.miniatureImageSize) {
                    imageMin.style.width = this.options.miniatureImageSize;
                    imageMin.style.height = this.options.miniatureImageSize;
                }
                imageMin.setBackgroundImage(imageItem.url)
                imageMin.addEventListener('click', () => {
                    this.setActiveImage(imageId)
                });
            });
            if (this._images.getValues().length > 1) {
                this.miniatureImagesContainer.style.display = '';
            }
            if (this._activeImageId == null) {
                this.setActiveImage(imageId);
            }
        }

        addImage(url: string) {
            this.addImageItem({ url: url })
        }

        addImages(urls: Array<string>) {
            for (let url of urls) {
                this.addImage(url);
            }
        }

        setActiveImage(imageId?: string) {
            let activeImageMin = this.getMiniatureImage(imageId);
            let imageItem = this._images.get(imageId);
            if (activeImageMin == null || imageItem == null) {
                return;
            }
            this._activeImageId = imageId;
            for (let imageMin of this.getMiniatureImages()) {
                imageMin.classList.remove('image-viewer-image-min-active');
            }
            activeImageMin.classList.add('image-viewer-image-min-active');

            this.mainImageContainer.body.innerHTML = '';

            this.mainImageContainer.body.appendHTML('img', (mainImage) => {
                mainImage.classList.add('image-viewer-main-image');
                mainImage.src = imageItem.url;
                if (this.options.canOpenInFullScreen) {
                    mainImage.style.cursor = 'pointer';
                    mainImage.addEventListener('click', () => {
                        new ImageViewerModal({ imageUrls: [imageItem.url, ...this._images.getValues().select(a => a.url).where(a => a != imageItem.url)] }).open();
                    });
                }
            });

        }

        getMiniatureImages(): Array<HTMLElement> {
            return this.miniatureImagesContainer.getChildrenElements();
        }

        getMiniatureImage(imageId: string): HTMLElement {
            return this.getMiniatureImages().firstOrDefault(a => a.id == imageId);
        }
    }


    export interface MultiImageViwerOptions extends ControlOptions {

        aspectRationWidth?: number;

        aspectRationHeight?: number;

        miniatureImageSize?: string;

        isResponsive?: boolean;

        imageItems?: Array<MultiImageViwerImageItem>;

        imageUrls?: Array<string>;

        canOpenInFullScreen?: boolean;

    }


    export interface MultiImageViwerImageItem {

        url?: string;

        description?: string;
    }



}