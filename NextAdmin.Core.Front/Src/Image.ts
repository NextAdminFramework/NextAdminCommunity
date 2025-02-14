
namespace NextAdmin {
    export class Image {

        public static createBase64EmptyImage(width: number, height: number, format = 'png') {
            let imageData = new ImageData(width, height);
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.putImageData(imageData, 0, 0);
            return canvas.toDataURL(format);
        }

        public static resizeImage(base64Data: string, maxWidth: number, maxHeight: number, targetType: string, resultAction: (b64ImageResult: string) => void) {
            let image = document.createElement('img');
            image.onload = () => {

                let targetSize = Image.computeResizedImageSize(image.width, image.height, maxWidth, maxHeight);

                let canvas = document.createElement('canvas');
                canvas.width = targetSize.Width;
                canvas.height = targetSize.Height;
                image.width = targetSize.Width;
                image.height = targetSize.Height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, targetSize.Width, targetSize.Height);
                let result = canvas.toDataURL(targetType);
                resultAction(result);
            };
            image.src = base64Data;
        }

        public static computeResizedImageSize(imageWidth: number, imageHeight: number, maxWidth: number, maxHeight: number) {

            if (imageWidth > imageHeight) {
                if (imageWidth > maxWidth) {
                    imageHeight *= maxWidth / imageWidth;
                    imageWidth = maxWidth;
                }
            }
            else {
                if (imageHeight > maxHeight) {
                    imageWidth *= maxHeight / imageHeight;
                    imageHeight = maxHeight;
                }
            }
            return { Width: imageWidth, Height: imageHeight };
        }

        public static getSize(src: string): Promise<Size> {
            return new Promise<Size>((response) => {
                document.body.appendHTML('img', (img) => {
                    img.style.position = 'fixed';
                    img.style.display = 'none';
                    img.addEventListener('load', () => {
                        let size = { width: img.width, height: img.height };
                        img.remove();
                        response(size);
                    });
                    img.src = src;
                })
            });
        }


    }

    export interface Size {

        width: number;

        height: number;
    }


}