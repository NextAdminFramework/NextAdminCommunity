namespace NextAdmin {


    export class Script {


        public static append(key: string, value: string): HTMLScriptElement {
            let script = DependenciesController.registeredDependencies[key];
            if (script == null) {
                script = document.createElement("script") as HTMLScriptElement;
                script.type = 'text/javascript';
                script.text = value;
                DependenciesController.registeredDependencies[key] = script;
                document.head.appendChild(script);
            }
            return script;
        }

        public static load(url: string, key?: string, loadAsModule?: boolean): Promise<HTMLScriptElement> {
            if (key == null) {
                key = url;
            }
            let script = DependenciesController.registeredDependencies[key] as HTMLScriptElement;
            return new Promise((resolve, reject) => {
                if (script == null) {
                    let script = document.createElement("script") as HTMLScriptElement;
                    if (loadAsModule) {
                        script.type = 'module';
                    }
                    script.addEventListener('load', () => {
                        script['_loaded'] = true;
                        resolve(script);
                    });
                    script.src = url;
                    DependenciesController.registeredDependencies[key] = script;
                    document.head.appendChild(script);
                }
                else {
                    if (script['_loaded']) {
                        resolve(script);
                    }
                    else {
                        script.addEventListener('load', () => {
                            resolve(script);
                        });
                    }
                }
            });
        }


        public static remove(key: string) {
            let script = <HTMLScriptElement>DependenciesController.registeredDependencies[key];
            if (script != null) {
                script.remove();
                delete DependenciesController.registeredDependencies[key];
            }
        }

        public static exist(key: string) {
            return DependenciesController.registeredDependencies[key] != null;
        }


    }


}