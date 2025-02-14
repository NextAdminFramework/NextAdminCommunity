namespace NextAdmin {

    export class Url {

        raw?: string;

        domain?: string;

        isHttps?: boolean;

        strPath?: string;

        path?: string[];

        queryString?: string;

        parameters?: Dictionary<string[]>;


        constructor(src: string) {
            this.raw = src;
            this.isHttps = src.startsWith('https');
            this.strPath = this.isHttps ? src.replace('https://', '') : src.replace('http://', '');
            this.path = this.strPath.split('/');
            this.domain = this.path.firstOrDefault();
            let lastPathPart = this.path.lastOrDefault();
            this.parameters = new Dictionary<string[]>();
            if (lastPathPart.contains('?')) {
                this.path[this.path.length - 1] = lastPathPart.split('?')[0];
                this.queryString = lastPathPart.split('?')[1];
                for (let parameter of this.queryString.split('&')) {
                    let paramKeyValueArray = parameter.split('=');
                    let key = paramKeyValueArray[0];
                    let value = paramKeyValueArray.length > 0 ? paramKeyValueArray[1] : null;
                    let values = this.parameters.get(key) ?? [];
                    values.add(value);
                    this.parameters.set(key, values);
                }
            }
        }

        getParameter(key: string) {
            return this.getParameters(key).firstOrDefault();
        }

        getParameters(key: string): Array<string> {
            if (this.parameters == null) {
                return [];
            }
            return this.parameters.get(key) ?? [];
        }

        public static parse(url?: string): Url {
            return new Url(url ?? window.location.href);
        }
    }

}