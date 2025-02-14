namespace NextAdmin.Services {

    export class HttpClient {

        public headerParams = {};

        public rootURL: string;

        constructor(rootURL = "") {
            this.rootURL = rootURL;
        }

        postJson(url: string, params = {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse> {
            return this.send({
                async: true,
                url: url,
                method: HttpMethod.POST,
                bodyFormat: BodyFormat.JSON,
                body: params
            }, responseAction, progressAction, beforeSend);
        }

        postForm(url: string, params = {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse> {
            return this.send({
                async: true,
                url: url,
                method: HttpMethod.POST,
                bodyFormat: BodyFormat.FORM,
                body: params
            }, responseAction, progressAction, beforeSend);
        }

        get(url: string, params = {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse> {
            return this.send({
                async: true,
                url: url,
                method: HttpMethod.GET,
                urlParams: params
            }, responseAction, progressAction, beforeSend);
        }

        async fetch(url: string, options?: FetchOptions): Promise<Response> {
            options = {
                method: options?.jsonData || options?.headerData || Object.keys(this.headerParams) ? HttpMethod.POST : HttpMethod.GET,
                cors: true,
                ...options
            } as FetchOptions;
            let finalUrl = NextAdmin.Path.combine(this.rootURL, url);
            if (options.queryArgs) {
                let arrayArgs = new Array<string>();
                for (let args in options.queryArgs) {
                    arrayArgs.push(encodeURI(args + '=' + options.queryArgs[args]));
                }
                if (arrayArgs.length > 0) {
                    finalUrl += '?' + arrayArgs.join('&');
                }
            }

            let header = {};
            if (this.headerParams) {
                NextAdmin.Copy.copyTo(this.headerParams, header);
            }
            if (options.headerData) {
                NextAdmin.Copy.copyTo(options.headerData, header);
            }

            return await fetch(finalUrl, {
                method: options.method,
                mode: options.cors ? "cors" : null,
                headers: header,
                body: options.jsonData != null ? JSON.stringify(options.jsonData) : null
            });
        }

        async fetchJson<T>(url: string, options?: FetchOptions): Promise<T> {
            let response = await this.fetch(url, options);
            if (!response.ok) {
                throw new Error('Unable to fetch ' + url + ', server return :' + response.status);
            }
            return await response.json();
        }

        async fetchText(url: string, options?: FetchOptions): Promise<string> {
            let response = await this.fetch(url, options);
            if (!response.ok) {
                throw new Error();
            }
            return await response.text();
        }

        send(request: HttpRequest, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse> {
            let xhr = new XMLHttpRequest();

            let url = NextAdmin.Path.combine(this.rootURL, request.url);
            if (request.urlParams != null) {
                let params = {};
                for (let pk in request.urlParams) {
                    let value = request.urlParams[pk];
                    if (value !== undefined && value !== null) {
                        params[pk] = value;
                    }
                }
                let queryString = new URLSearchParams(params);
                url += request.url.indexOf("?") > 0 ? "&" : "?";
                url += queryString;
            }
            xhr.open(request.method, url, request.async === null ? true : request.async);
            for (let key in this.headerParams) {
                xhr.setRequestHeader(key, this.headerParams[key]);
            }
            if (request.headerParams != null) {
                for (let key in request.headerParams) {
                    xhr.setRequestHeader(key, request.headerParams[key]);
                }
            }
            let bodyData = null;
            if (request.body != null) {
                switch (request.bodyFormat) {
                    default:
                    case BodyFormat.TEXT:
                        bodyData = request.body;
                        break;
                    case BodyFormat.JSON:
                        bodyData = JSON.stringify(request.body);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                        break;
                    case BodyFormat.FORM:
                        bodyData = new FormData();
                        for (let key in request.body) {
                            let value = request.body[key];
                            if (value !== undefined) {
                                bodyData.append(key, request.body[key]);
                            }
                        }
                        break;
                }
            }
            if (beforeSend) {
                beforeSend(xhr);
            }
            if (progressAction) {
                xhr.upload.onprogress = (args) => {
                    progressAction(args);
                };
            }
            return new Promise((resolve, reject) => {
                xhr.onload = () => {
                    let response = new HttpResponse(xhr);
                    if (responseAction != null) {
                        responseAction(response);
                    }
                    resolve(response);
                };
                xhr.onerror = () => {
                    let response = new HttpResponse(xhr);
                    if (responseAction != null) {
                        responseAction(response);
                    }
                    reject(xhr);
                };
                xhr.send(bodyData);
            });

        }
    }

    export enum HttpMethod {
        GET = "GET",
        POST = "POST"
    }

    export enum BodyFormat {
        TEXT = "TEXT",
        JSON = "JSON",
        FORM = "FORM"
    }


    export interface HttpRequest {

        async: boolean;

        url: string;

        method: HttpMethod | string;

        bodyFormat?: any;

        headerParams?: {};

        urlParams?: {};

        body?: any;

    }




    export class HttpResponse {

        text?: string;

        content?: any;

        status: number;

        success: boolean;

        xhr: XMLHttpRequest;

        constructor(xhr: XMLHttpRequest) {
            this.xhr = xhr;
            if (xhr.responseType == '' || xhr.responseType == "text" || xhr.responseType == "json") {
                this.text = xhr.responseText;
            }
            this.content = xhr.response;
            this.status = xhr.status;
            this.success = xhr.status == 200;
        }

        public parseJson<TObject>(): TObject {
            return JSON.parse(this.text);
        }

    }


    export interface FetchOptions {

        method?: HttpMethod;

        jsonData?: {};

        cors?: boolean;

        queryArgs?: Record<string, string>

        headerData?: Record<string, string>

    }


}



