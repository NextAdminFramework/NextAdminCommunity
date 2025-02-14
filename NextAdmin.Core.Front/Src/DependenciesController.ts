namespace NextAdmin {

    export class DependenciesController {

        public static registeredDependencies = {};


        /**
         * 
         * @param dependencies
         * @param ready
         * @param fastLoading indicate the way to load dependency. 
         * if set to true, all dependencies will be loaded simultaniously, and appended as element in given order,
         * this method is more powerfull but have issus for style that should reload data like background or fonts.
         * if set to false, data will be loaded as normal resource, it avoid issue, but it's less faster because all query are done one by one
         */
        public static load(dependencies: Array<DependencyInfo | string>, ready?: () => void, fastLoading?: boolean): Promise<Dictionary<DependencyInfo>> {

            let depenciesToLoad = this.preparDependencies(dependencies);

            return new Promise((resolve, reject) => {
                if (depenciesToLoad.length == 0) {
                    if (ready) {
                        ready();
                    }
                    resolve(depenciesToLoad.toDictionary('key'));
                    return;
                }
                if (fastLoading) {
                    for (let dependency of depenciesToLoad) {
                        console.log('loading : ' + dependency.url);
                        fetch(dependency.url).then(response => {
                            response.text().then((content) => {
                                dependency.content = content;
                                if (depenciesToLoad.firstOrDefault(a => a.content == null) == null) {
                                    for (let dependency of depenciesToLoad) {
                                        if (dependency.type == DependencyType.script) {
                                            Script.append(dependency.key, dependency.content);
                                        }
                                        else if (dependency.type == DependencyType.style) {
                                            Style.append(dependency.key, dependency.content);
                                        }
                                        else if (dependency.type == DependencyType.typeScript) {
                                            TypeScript.append(dependency.key, dependency.content);
                                        }
                                        if (ready) {
                                            ready();
                                        }
                                        resolve(depenciesToLoad.toDictionary('key'));
                                    }
                                }
                            });
                        });
                    }
                }
                else {
                    let loadedDependencyDictionary = new Dictionary<DependencyInfo>();
                    let loadDependency = (dependency: DependencyInfo) => {
                        let endLoad = () => {
                            loadedDependencyDictionary.add(depenciesToLoad[0].key, depenciesToLoad[0]);
                            depenciesToLoad.removeAt(0);
                            if (depenciesToLoad.length > 0) {
                                loadDependency(depenciesToLoad[0]);
                            }
                            else {//end
                                if (ready) {
                                    ready();
                                }
                                resolve(loadedDependencyDictionary);
                            }
                        };
                        if (dependency.type == DependencyType.script) {
                            Script.load(dependency.url, dependency.key).then(() => endLoad());
                        }
                        else if (dependency.type == DependencyType.style) {
                            Style.load(dependency.url, dependency.key).then(() => endLoad());
                        }
                        else if (dependency.type == DependencyType.typeScript) {
                            TypeScript.load(dependency.url, dependency.key).then(() => endLoad());
                        }
                        else {
                            fetch(dependency.url).then(response => {
                                response.text().then((content) => {
                                    dependency.content = content;
                                    endLoad();
                                });
                            });

                        }

                    };
                    loadDependency(depenciesToLoad[0]);
                }
            });
        }


        public static preparDependencies(dependencies: Array<DependencyInfo | string>, keepOnlyNotLoadedDependencyes = true): Array<DependencyInfo> {
            let output = new Array<DependencyInfo>();
            for (let dependencyInfo of dependencies) {
                if (typeof dependencyInfo === 'string') {
                    dependencyInfo = {
                        url: dependencyInfo
                    } as DependencyInfo;
                }
                dependencyInfo.key = dependencyInfo.key == null ? dependencyInfo.url : dependencyInfo.key;
                if (dependencyInfo.type == null) {
                    if (dependencyInfo.url.endsWith('.js')) {
                        dependencyInfo.type = DependencyType.script;
                    }
                    else if (dependencyInfo.url.endsWith('.ts')) {
                        dependencyInfo.type = DependencyType.typeScript;
                    }
                    else if (dependencyInfo.url.endsWith('.css')) {
                        dependencyInfo.type = DependencyType.style;
                    }
                }
                if (keepOnlyNotLoadedDependencyes == null || !DependenciesController.exist(dependencyInfo.key)) {
                    output.add(dependencyInfo);
                }
            }
            return output;
        }



        public static unloadRange(dependencies: Array<DependencyInfo | string>) {
            for (let dependency of dependencies) {
                let key = null;
                if (typeof dependency === 'string') {
                    key = dependency;
                }
                else {
                    key = dependency.key ?? dependency.url;
                }
                DependenciesController.unload(key);
            }
        }

        public static unload(key: string) {
            let dependency = <HTMLElement>DependenciesController.registeredDependencies[key];
            if (dependency != null) {
                dependency.remove();
                delete DependenciesController.registeredDependencies[key];
            }
        }


        public static exist(key: string) {
            return DependenciesController.registeredDependencies[key] != null;
        }

    }


    export interface DependencyInfo {

        key?: string;

        url: string;

        content?: string;

        type?: DependencyType;

    }


    export enum DependencyType {
        style,
        script,
        typeScript
    }



}