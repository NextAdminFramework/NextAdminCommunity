namespace NextAdmin {


    export class Style {

        public static append(key: string, value: string) {
            if (DependenciesController.registeredDependencies[key] == null) {
                DependenciesController.registeredDependencies[key] = value;
                let style = document.createElement("style") as HTMLStyleElement;
                style.textContent = value;
                document.head.appendChild(style);
            }
        }

        public static load(url: string, key?: string): Promise<HTMLLinkElement> {
            if (key == null) {
                key = url;
            }
            let style = DependenciesController.registeredDependencies[key] as HTMLLinkElement;
            return new Promise((resolve, reject) => {
                if (style == null) {
                    let style = document.createElement("link") as HTMLLinkElement;
                    style.addEventListener('load', () => {
                        style['_loaded'] = true;
                        resolve(style);
                    });
                    DependenciesController.registeredDependencies[key] = style;
                    style.href = url;
                    style.rel = 'stylesheet';
                    document.head.appendChild(style);
                }
                else {

                    if (style['_loaded']) {
                        resolve(style);
                    }
                    else {
                        style.addEventListener('load', () => {
                            resolve(style);
                        });
                    }
                }
            });
        }

        public static exist(key: string) {
            return DependenciesController.registeredDependencies[key] != null;
        }
    }

}