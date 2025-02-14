namespace NextAdmin {

    export class FileExplorer {

        public static openFileExplorer(onFilesSelectedAction: (files: Array<File>) => void, mulipleFiles: boolean = false, extensions?: string[]) {

            let browseFileInput = document.createElement('input');
            browseFileInput.type = 'file';
            document.body.appendChild(browseFileInput);
            if (extensions != null && extensions.length > 0) {
                let extensionsAsString = '';
                let i = 0;
                for (let extension of extensions) {
                    if (i > 0) {
                        extensionsAsString += ','
                    }
                    if (extension.indexOf('.') != 0) {
                        extensionsAsString += '.';
                    }
                    extensionsAsString += extension;
                    i++;
                }
                browseFileInput.setAttribute('accept', extensionsAsString);
            }
            if (mulipleFiles) {
                browseFileInput.setAttribute('multiple', 'multiple');
            }
            browseFileInput.addEventListener('change', () => {
                let files = new Array<File>();
                for (let i = 0; i < browseFileInput.files.length; i++) {
                    let file = browseFileInput.files[i];
                    if (extensions != null && extensions.length > 0) {
                        let extension = Path.getFileExtension(file.name);
                        if (extensions.firstOrDefault(e => e.replace('.', '') == extension) == null) {
                            continue;
                        }
                    }
                    files.push(file);
                }
                onFilesSelectedAction(files);
            });
            browseFileInput.click();
            setTimeout(() => {
                browseFileInput.remove();
            }, 10);

        }


    }



}