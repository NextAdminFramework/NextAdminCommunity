namespace NextAdmin {


    export class Path {

        public static getFileExtension(fileNameOrExtension: string):string {
            if (fileNameOrExtension == null) {
                return '';
            }
            return (fileNameOrExtension.contains(".") ? fileNameOrExtension.split(".")[1] : fileNameOrExtension).toLocaleLowerCase();
        }

        public static getFileName(fullPath: string):string {
            if (fullPath == null) {
                return '';
            }
            if (!fullPath.contains('/')) {
                return fullPath;
            }
            return fullPath.substring(fullPath.lastIndexOf("/") + 1);
        }

        public static getFileNameWithoutExtension(fileNameWithExtension: string) {

            fileNameWithExtension = this.getFileName(fileNameWithExtension);
            let extensionIndox = fileNameWithExtension.lastIndexOf('.');
            if (extensionIndox < 0) {
                return fileNameWithExtension;
            }
            return fileNameWithExtension.substr(0, extensionIndox);
        }


        public static isImage(fileNameOrExtension: string) {
            var fileExtension = Path.getFileExtension(fileNameOrExtension);
            return (fileExtension == "png" || fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "gif" || fileExtension == "bmp");
        }

        public static isAudio(fileNameOrExtension: string) {
            var fileExtension = Path.getFileExtension(fileNameOrExtension);
            return (fileExtension == "mp3" || fileExtension == "flac" || fileExtension == "wma");
        }

        public static isVideo(fileNameOrExtension: string) {
            var fileExtension = Path.getFileExtension(fileNameOrExtension);
            return (fileExtension == "mp4" || fileExtension == "mkv" || fileExtension == "webm");
        }

        /**
         * Return parent directory path with name (full path)
         * @param fullPath
         */
        public static getDirectoryName(fullPath?: string): string {
            if (String.isNullOrEmpty(fullPath) || !fullPath.contains('/'))
                return '';
            return fullPath.substring(0, fullPath.lastIndexOf("/"));
        }


        public static combine(str1?: string, str2?: string): string {

            str1 = (str1 ?? '').replaceAll('\\','/');
            str2 = (str2 ?? '').replaceAll('\\', '/');
            if (NextAdmin.String.isNullOrEmpty(str2)) {
                return str1;
            }
            if (NextAdmin.String.isNullOrEmpty(str1)) {
                return str2;
            }
            if (str1.endsWith('/')) {
                str1 = str1.substr(0, str1.length - 1);
            }
            if (str2.startsWith('/')) {
                str2 = str2.substr(1, str2.length);
            }
            return str1 + '/' + str2;
        }


    }


}