/// <reference path="Control.ts"/>

namespace NextAdmin.UI {



    export class View extends Control {

        public options: ViewOptions;

        public childrenViews: Dictionary<View>;

        public childrenControls: Dictionary<Control>;

        protected data?: any;

        protected contentUrl?: string;

        public static viewsContentDictionary = new Dictionary<string>();


        public constructor(options?: ViewOptions) {
            super(options?.element ?? 'div', options);
            if (this.options.data) {
                this.data = this.options.data;
            }
            if (this.options.contentUrl != null) {
                this.contentUrl = this.options.contentUrl;
            }
        }

        public async load(contentUrl?: string, data?: any, dependencies?: Array<string | DependencyInfo>) {
            let preparedDependencies = dependencies ? DependenciesController.preparDependencies(dependencies) : [];
            await this.loadDependencies(preparedDependencies.where(a => a.type != DependencyType.script));
            if (contentUrl == null) {
                contentUrl = this.contentUrl;
            }
            if (data == null) {
                data = this.data;
            }
            if (contentUrl) {
                let viewContent = await this.loadContent(contentUrl);
                await this.parse(viewContent, data);
                this.contentUrl = contentUrl;
            }
            this.data = data;
            await this.loadDependencies(preparedDependencies.where(a => a.type == DependencyType.script));
        }

        public getData(): any {
            return this.data;
        }

        public async updateData(data?: any) {
            if (this.contentUrl == null) {
                return;
            }
            let viewContent = await this.loadContent(this.contentUrl);
            if (this.data == null) {
                this.data = {};
            }
            NextAdmin.Copy.copyTo(data, this.data);
            let scripts = this._loadedDependencies.where(a => a.type == NextAdmin.DependencyType.script);
            this.unloadDependencies(scripts);
            await this.parse(viewContent, this.data);
            await this.loadDependencies(scripts);
        }

        public async setData(data?: any) {
            if (this.contentUrl == null) {
                return;
            }
            let viewContent = await this.loadContent(this.contentUrl)
            let scripts = this._loadedDependencies.where(a => a.type == NextAdmin.DependencyType.script);
            this.unloadDependencies(scripts);
            await this.parse(viewContent, data);
            await this.loadDependencies(scripts);
            this.data = data;
        }


        public async loadContent(contentUrl: string): Promise<string> {
            let viewContent = View.viewsContentDictionary.get(contentUrl);
            if (viewContent != null) {
                return viewContent;
            }
            let response = await fetch(contentUrl);
            if (response && response.ok) {
                viewContent = await response.text();
                View.viewsContentDictionary.add(contentUrl, viewContent);
                return viewContent;
            }
            else {
                console.log('Unable to load view content:' + contentUrl);
            }
        }


        protected _loadedDependencies = [] as Array<DependencyInfo>;
        protected async loadDependencies(dependencies?: Array<DependencyInfo>) {
            if (!dependencies?.length)
                return;
            await DependenciesController.load(dependencies);
            this._loadedDependencies.addRange(dependencies);
        }

        protected unloadDependencies(dependencies?: Array<DependencyInfo>) {
            if (!dependencies?.length)
                return;
            DependenciesController.unloadRange(dependencies);
            for (let dependencie of dependencies) {
                this._loadedDependencies.remove(dependencie);
            }
        }


        public async parse(content: string, data?: any) {
            if (this.element.parentNode == null) {
                throw new Error('view must be appended to be parsed');
            }



            for (let key of content.extractTags("{{", "}}")) {
                content = content.replaceAll('{{' + key + '}}', data != null && data[key] ? data[key] : "");
            }
            content = content.replaceTags("${", "}", (value) => {
                return eval(value);
            });

            let subViewsDictionary = new NextAdmin.Dictionary<{ src: string, data?: any, attributes: {} }>();

            let parseViewTagFunc = (viewTagContent: string): string => {
                let viewSrc = viewTagContent.extractTags(":'", "'").firstOrDefault();
                if (viewSrc) {
                    viewTagContent = viewTagContent.replace(":'" + viewSrc + "'", "");
                }
                if (!viewSrc) {
                    viewSrc = viewTagContent.extractTags(':"', '"').firstOrDefault();
                    if (viewSrc) {
                        viewTagContent = viewTagContent.replace(':"' + viewSrc + '"', "");
                    }
                }
                if (!viewSrc && viewTagContent.contains(':')) {
                    viewSrc = viewTagContent.split(':').lastOrDefault();
                    if (viewSrc) {
                        viewTagContent = viewTagContent.replace(':' + viewSrc, "");
                    }
                }

                let tmpViewHtmlTag = '<div ' + viewTagContent + (viewTagContent.endsWith('>') ? '' : '>') + '</div>';
                var viewDocument = new DOMParser().parseFromString(tmpViewHtmlTag, "text/xml");
                let viewAttributes = {};

                let viewElement = viewDocument.firstElementChild;

                for (let viewAttribute of viewElement.attributes) {
                    viewAttributes[viewAttribute.name] = viewAttribute.value;
                }
                let viewId = viewElement.id;
                if (NextAdmin.String.isNullOrEmpty(viewId)) {
                    viewId = Guid.newGuid().toString();
                }
                let viewData = String.isNullOrEmpty(viewElement.innerHTML) ? {} : JSON.parse(viewElement.innerHTML);
                subViewsDictionary.add(viewId, { src: viewSrc, data: viewData, attributes: viewAttributes });
                return '<div id="' + viewId + '"></div>';
            };

            content = content.replaceTags('<view', '</view>', (viewTagContent) => {
                return parseViewTagFunc(viewTagContent);
            });
            content = content.replaceTags('<view', '>', (viewTagContent) => {
                if (viewTagContent.endsWith('/')) {
                    viewTagContent = viewTagContent.substring(0, viewTagContent.length - 1);
                }
                return parseViewTagFunc(viewTagContent);
            });

            let subControlsDictionary = new NextAdmin.Dictionary<{ src: string, options?: any, attributes: {} }>();
            let parseControlTagFunc = (controlTagContent: string): string => {
                let controlSrc = controlTagContent.extractTags(":'", "'").firstOrDefault();
                if (controlSrc) {
                    controlTagContent = controlTagContent.replace(":'" + controlSrc + "'", "");
                }
                if (!controlSrc) {
                    controlSrc = controlTagContent.extractTags(':"', '"').firstOrDefault();
                    if (controlSrc) {
                        controlTagContent = controlTagContent.replace(':"' + controlSrc + '"', "");
                    }
                }
                if (!controlSrc && controlTagContent.contains(':')) {
                    controlSrc = controlTagContent.split(':').lastOrDefault();
                    if (controlSrc) {
                        controlTagContent = controlTagContent.replace(':' + controlSrc, "");
                    }
                }

                let tmpViewHtmlTag = '<div ' + controlTagContent + (controlTagContent.endsWith('>') ? '' : '>') + '</div>';
                var viewDocument = new DOMParser().parseFromString(tmpViewHtmlTag, "text/xml");
                let controlAttributes = {};

                let controlElement = viewDocument.firstElementChild;

                for (let viewAttribute of controlElement.attributes) {
                    controlAttributes[viewAttribute.name] = viewAttribute.value;
                }
                let viewId = controlElement.id;
                if (NextAdmin.String.isNullOrEmpty(viewId)) {
                    viewId = Guid.newGuid().toString();
                }
                let controlOption = String.isNullOrEmpty(controlElement.innerHTML) ? {} : JSON.parse(controlElement.innerHTML);
                subControlsDictionary.add(viewId, { src: controlSrc, options: controlOption, attributes: controlAttributes });
                return '<span id="' + viewId + '"></span>';
            };
            content = content.replaceTags('<control', '</control>', (controlTagContent) => {
                return parseControlTagFunc(controlTagContent);
            });
            content = content.replaceTags('<control', '>', (controlTagContent) => {
                if (controlTagContent.endsWith('/')) {
                    controlTagContent = controlTagContent.substring(0, controlTagContent.length - 1);
                }
                return parseControlTagFunc(controlTagContent);
            });
            content = content.replaceTags('<echo:', '>', (echoScript) => {
                if (echoScript.endsWith('/')) {
                    echoScript = echoScript.substring(0, echoScript.length - 1);
                }
                let echoResult = '';
                eval('echoResult = ' + echoScript);
                return echoResult;
            });

            this.element.innerHTML = content;
            if (this.element.childElementCount == 1) {
                let rootViewElement = this.element.firstElementChild;
                rootViewElement['_control'] = this;
                for (let attribute of this.element.attributes) {
                    rootViewElement.setAttribute(attribute.name, attribute.value);
                }
                this.element.parentElement.replaceChild(rootViewElement, this.element);
                this.element = rootViewElement as HTMLElement;

            }

            this.childrenViews = new Dictionary<View>();
            for (let subViewKeyValue of subViewsDictionary.getKeysValues()) {
                let subViewElement = document.getElementById(subViewKeyValue.key);
                if (subViewElement == null) {
                    throw new Error('unable to find sub view element');
                }
                let htmlContentSrc = '';
                let view: View;
                let viewOption = { element: subViewElement, id: subViewKeyValue.key };
                if (subViewKeyValue.value.src.contains('@')) {//view with view class
                    let viewSrcParts = subViewKeyValue.value.src.split('@');
                    htmlContentSrc = viewSrcParts[1] + '.html';
                    await TypeScript.load(viewSrcParts[1] + '.ts');
                    eval('view = new ' + viewSrcParts[0] + '(viewOption);')
                }
                else {
                    if (subViewKeyValue.value.src.endsWith('.html')) {
                        htmlContentSrc = subViewKeyValue.value.src;
                        view = new View(viewOption);
                    }
                    else {
                        eval('view = new ' + subViewKeyValue.value.src + '(viewOption);')
                    }
                }

                for (let attributeName in subViewKeyValue.value.attributes) {
                    view.element.setAttribute(attributeName, subViewKeyValue.value.attributes[attributeName]);
                }
                this.childrenViews.add(subViewKeyValue.key, view);
                await view.load(htmlContentSrc, subViewKeyValue.value.data);
            }

            this.childrenControls = new Dictionary<Control>();
            for (let controlKeyValue of subControlsDictionary.getKeysValues()) {
                let controlElement = document.getElementById(controlKeyValue.key);
                if (controlElement == null) {
                    throw new Error('unable to find sub control element');
                }
                let controlSrcParts = controlKeyValue.value.src.split('@');
                if (controlSrcParts.length == 2) {
                    let scriptUrl = controlSrcParts[1];
                    await TypeScript.load(scriptUrl);
                }
                let controlClassName = controlSrcParts[0];
                let controlOptions = { id: controlKeyValue.key, ...controlKeyValue.value.options };
                let control: Control;
                eval('control = new ' + controlClassName + '(controlOptions);')
                for (let attributeName in controlKeyValue.value.attributes) {
                    control.element.setAttribute(attributeName, controlKeyValue.value.attributes[attributeName]);
                }
                controlElement.parentElement.replaceChild(control.element, controlElement);
                this.childrenControls.add(controlKeyValue.key, control);
            }

        }


    }


    export interface ViewOptions extends ControlOptions {

        element?: HTMLElement;

        contentUrl?: any;

        data?: any;
    }

}

interface HTMLElement {


    appendView<TView extends NextAdmin.UI.View>(view: TView, configAction?: (control: TView) => void): Promise<TView>;
    appendView(src: string, viewOption?: NextAdmin.UI.ViewOptions, configAction?: (control: NextAdmin.UI.View) => void): Promise<NextAdmin.UI.View>;

}


try {

    HTMLElement.prototype.appendView = async function (p1: any, p2?: any, p3?: any): Promise<NextAdmin.UI.View> {

        let view: NextAdmin.UI.View;
        if (p1 instanceof (NextAdmin.UI.View)) {
            view = p1 as NextAdmin.UI.View;
            let configAction = p2 as (control: NextAdmin.UI.View) => void;
            (this as HTMLElement).appendControl(view);
            await view.load();
            if (configAction != null) {
                configAction(view);
            }
        }
        else {
            let src = p1 as string;
            let viewOption = p2 as NextAdmin.UI.ViewOptions;
            let configAction = p3 as (control: NextAdmin.UI.View) => void;

            let htmlContentSrc = '';

            if (src.contains('@')) {//view with view class
                let viewSrcParts = src.split('@');
                let viewClassName = viewSrcParts[0];
                htmlContentSrc = viewSrcParts[1] + '.html';
                let classExist = false;
                eval('classExist = typeof ' + viewClassName + ' != "undefined"');
                if (!classExist) {
                    await NextAdmin.TypeScript.load(viewSrcParts[1] + '.ts');
                }
                eval('view = new ' + viewClassName + '(viewOption);')
            }
            else {
                if (src.endsWith('.html')) {
                    htmlContentSrc = src;
                    view = new NextAdmin.UI.View(viewOption);
                }
                else {
                    eval('view = new ' + src + '(viewOption);')
                }
            }
            (this as HTMLElement).appendControl(view);
            await view.load(htmlContentSrc, viewOption?.data);
            if (configAction != null) {
                configAction(view);
            }
        }
        return view;
    };

}
catch
{

}