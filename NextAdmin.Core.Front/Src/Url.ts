namespace NextAdmin {

    export class Url {

        raw?: string;

        domain?: string;

        isHttps?: boolean;

        strPath?: string;

        path?: string[];

        queryString?: string;

        parameters?: Dictionary<string[]>;


        constructor(url: string) {
            this.parse(url);
        }

        public static parse(url?: string): Url {
            return new Url(url ?? window.location.href);
        }

        parse(url: string) {
            this.raw = url;
            this.isHttps = url.startsWith('https');
            this.strPath = this.isHttps ? url.replace('https://', '') : url.replace('http://', '');
            this.path = this.strPath.split('/');
            this.domain = this.path.firstOrDefault();
            let lastPathPart = this.path.lastOrDefault();
            this.parameters = new Dictionary<string[]>();
            this.queryString = null;
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

        toString(): string {
            return this.raw;
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

        removeParamter(parameter?: string) {
            //prefer to use l.search if you have a location/link object
            var urlparts = this.raw.split('?');
            if (urlparts.length >= 2) {

                var prefix = encodeURIComponent(parameter) + '=';
                var pars = urlparts[1].split(/[&;]/g);

                //reverse iteration as may be destructive
                for (var i = pars.length; i-- > 0;) {
                    //idiom for string.startsWith
                    if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                        pars.splice(i, 1);
                    }
                }

                let newUrl = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
                this.parse(newUrl);
            }
        }
    }

}