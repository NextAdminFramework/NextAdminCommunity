namespace NextAdmin {

    export class ResourcesManager {

        public get(key: string) {
            return this[key] ?? key;
        }

        public addResources(...resources: Array<{}>):any {
            for (let resource of resources) {
                for (let key in resource) {
                    let value = resource[key];
                    if (String.isString(value)) {
                        this[key] = value;
                    }
                }
            }
            return this;
        }
    }
}