namespace NextAdmin {

    export class QueryString {


        public static fromURL(): any {
            return QueryString.parseURL(document.location.href);
        }

        public static parseURL(url: string): any {
            let urlParts = url.split('?');
            if (urlParts.length < 2) {
                return null;
            }
            return QueryString.parseQuery(urlParts[1]);
        }


        public static parseQuery(queryString: string): any {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return query;
        }


        public static encodeQuery(obj: any): string {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            return str.join("&");
        }
    }
}