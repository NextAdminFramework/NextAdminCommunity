namespace NextAdmin {

    export class TypeScript {

        public static append(key: string, content: string): HTMLScriptElement {
            let script = DependenciesController.registeredDependencies[key];
            if (script == null) {
                script = document.createElement("script") as HTMLScriptElement;
                script.type = 'text/javascript';
                content = content.removeTags('/***/', '/***/');
                script.text = content;
                DependenciesController.registeredDependencies[key] = script;
                document.head.appendChild(script);
            }
            return script;
        }

        public static load(url: string, key?: string): Promise<HTMLScriptElement> {
            if (key == null) {
                key = url;
            }
            let script = DependenciesController.registeredDependencies[key] as HTMLScriptElement;
            return new Promise((resolve, reject) => {
                if (script == null) {
                    let script = document.createElement("script") as HTMLScriptElement;

                    fetch(url + '?nocahche=' + NextAdmin.Guid.newGuid().toString()).then((response) => {
                        if (response.ok) {
                            response.text().then((content) => {
                                script['_loaded'] = true;
                                script.type = 'text/javascript';
                                content = content.removeTags('/***/', '/***/');
                                script.innerHTML = content;
                                document.head.appendChild(script);
                                script.dispatchEvent(new Event('load'));
                                resolve(script);
                            });
                        }
                    });
                    DependenciesController.registeredDependencies[key] = script;
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