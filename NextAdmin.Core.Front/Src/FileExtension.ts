interface File {

    getDataAsBase64Url(): Promise<string>;

    getDataAsArrayBuffer(): Promise<ArrayBuffer>;

}


try {

    File.prototype.getDataAsBase64Url = function () {
        let file = this as File;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    File.prototype.getDataAsArrayBuffer = function () {
        let file = this as File;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
        });
    };
}
catch
{

}
