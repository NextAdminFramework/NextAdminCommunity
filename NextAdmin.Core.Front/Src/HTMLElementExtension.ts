

interface HTMLElement {


    onSizeChanged(callBack: () => void): ResizeObserver;

    onDoubleClick(callBack: () => void);

    addStyle(style: CSSStyleDeclaration);


    prependHTML<K extends keyof HTMLElementTagNameMap>(elementType: K, configActionOrContent?: ((element: HTMLElementTagNameMap[K]) => void) | string): HTMLElementTagNameMap[K];
    prependHTML(elementType: string, configActionOrContent?: ((element: HTMLElement) => void) | string): HTMLElement;

    appendHTML<K extends keyof HTMLElementTagNameMap>(elementType: K, configActionOrContent?: ((element: HTMLElementTagNameMap[K]) => void) | string): HTMLElementTagNameMap[K];
    appendHTML(elementType: string, configActionOrContent?: ((element: HTMLElement) => void) | string): HTMLElement;

    insertHTMLBefore<K extends keyof HTMLElementTagNameMap>(elementType: K, configActionOrContent?: ((element: HTMLElementTagNameMap[K]) => void) | string): HTMLElementTagNameMap[K];
    insertHTMLBefore(elementType: string, configActionOrContent?: ((element: HTMLElement) => void) | string): HTMLElement;

    insertHTMLAfter<K extends keyof HTMLElementTagNameMap>(elementType: K, configActionOrContent?: ((element: HTMLElementTagNameMap[K]) => void) | string): HTMLElementTagNameMap[K];
    insertHTMLAfter(elementType: string, configActionOrContent?: ((element: HTMLElement) => void) | string): HTMLElement;

    addChild<TChild extends NextAdmin.UI.Control | HTMLElement>(control: TChild, configAction?: (control: TChild) => void): TChild;

    addChildFirst<TChild extends NextAdmin.UI.Control | HTMLElement>(control: TChild, configAction?: (control: TChild) => void): TChild;

    appendControl<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl;

    prependControl<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl;

    insertControlBefore<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl;

    insertControlAfter<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl;

    centerVertically();

    centerHorizontally();

    center();

    centerContentVertically();

    centerContentHorizontally();

    centerContent();

    disableUserSelection();

    hideScrollbar();

    setBackgroundImage(imageUrl: string, cover?: boolean);

    isInViewport(): boolean;

    disable(): HTMLElement;

    getChildrenElements(): Array<HTMLElement>;

    getDescendantsChildrenElements(): Array<HTMLElement>;

    enable();

    isEnable(): boolean;

    trigger(eventName: string);

    getControl(): NextAdmin.UI.Control;

}

interface Node {

    addEventsListener(eventsNames: string, listener: (this: HTMLElement, ev: any) => any, options?: boolean | AddEventListenerOptions): (this: HTMLElement, ev: any) => any;

    removeEventsListener(eventsNames: string, listener: any);

}


interface HTMLTableElement {

    fixHeader(onDrawHeaderAction?: (cell: HTMLElement) => void);

}


try {


    HTMLTableElement.prototype.fixHeader = function (onDrawHeaderAction?: (cell: HTMLElement) => void) {
        let table = this as HTMLTableElement;
        let thead = table.querySelector('thead');
        if (thead == null) {
            console.log('Table need thead to fix header');
            return;
        }
        let headerRow = thead.querySelector('tr');
        if (headerRow == null) {
            console.log('Table need tr in thead to fix header');
            return;
        }
        table.style.position = 'relative';

        setTimeout(function () {

            let clonedHeaderRow = headerRow.cloneNode(true) as HTMLElement;


            let headerCells = headerRow.querySelectorAll('th');
            let clonedHeaderCells = clonedHeaderRow.querySelectorAll('th');


            clonedHeaderRow.style.position = 'absolute';
            clonedHeaderRow.style.top = '0px';
            clonedHeaderRow.style.left = '0px';
            clonedHeaderRow.style.background = 'rgba(255,255,255,1)';
            clonedHeaderRow.style.boxShadow = '0px 1px 1px rgba(0,0,0,0.5)';

            thead.appendChild(clonedHeaderRow);

            for (let i = 0; i < headerCells.length; i++) {
                let headerCell = headerCells.item(i);
                let clonedHeaderCell = clonedHeaderCells.item(i);

                clonedHeaderCell.style.width = headerCell.offsetWidth + 'px';
                clonedHeaderCell.style.minWidth = headerCell.offsetWidth + 'px';
                clonedHeaderCell.style.maxWidth = headerCell.offsetWidth + 'px';

                clonedHeaderCell.style.border = '0px';
                clonedHeaderCell.style.padding = '0px';

                let cellDiv = document.createElement('div');
                cellDiv.innerHTML = clonedHeaderCell.innerHTML;
                cellDiv.style.width = '100%';
                cellDiv.style.height = '100%';
                cellDiv.style.position = 'relative';
                clonedHeaderCell.innerHTML = '';
                clonedHeaderCell.appendChild(cellDiv);
                if (onDrawHeaderAction != null) {
                    onDrawHeaderAction(cellDiv);
                }
            }

            clonedHeaderRow.style.display = 'none';


            let updateFixedHeaderFunc = () => {
                let headerClientRext = thead.getBoundingClientRect();
                if (headerClientRext.top < 0) {//fix header
                    clonedHeaderRow.style.display = '';
                    clonedHeaderRow.style.top = -headerClientRext.top + 'px';
                }
                else {//restor header at default state
                    clonedHeaderRow.style.display = 'none';
                }
            };
            document.addEventListener('scroll', () => {
                updateFixedHeaderFunc();
            });
            updateFixedHeaderFunc();
        }, 100);
    };



    HTMLElement.prototype.isInViewport = function () {
        let rect = this.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };


    HTMLElement.prototype.addStyle = function (style: CSSStyleDeclaration) {
        for (let property in style) {
            this.style[property] = style[property];
        }
    };

    HTMLElement.prototype.onSizeChanged = function (callback: any): ResizeObserver {
        try {//not working on safari and old Edge before chrome view
            var observer = new ResizeObserver(() => {
                callback();
            })
            observer.observe(this);
            return observer;
        }
        catch
        {

        }
    }

    HTMLElement.prototype.onDoubleClick = function (callback: (ev: MouseEvent) => void) {
        let lastClickTimeStamp = -1;
        (this as HTMLElement).addEventListener('click', (ev) => {
            let actualTimeStamp = Date.now();
            if (actualTimeStamp - lastClickTimeStamp < 500) {
                callback(ev);
                lastClickTimeStamp = -1;
            }
            else {
                lastClickTimeStamp = actualTimeStamp;
            }

        });
    }

    HTMLElement.prototype.addChild = function <TChild extends NextAdmin.UI.Control | HTMLElement>(child: TChild, configAction?: (control: TChild) => void) {
        if (child instanceof NextAdmin.UI.Control) {
            (this as HTMLElement).appendChild(child.element);
        }
        else {
            (this as HTMLElement).appendChild(child);
        }
        if (configAction != null) {
            configAction(child);
        }
        return child;
    };

    HTMLElement.prototype.addChildFirst = function <TChild extends NextAdmin.UI.Control | HTMLElement>(child: TChild, configAction?: (control: TChild) => void) {
        if (child instanceof NextAdmin.UI.Control) {
            (this as HTMLElement).prepend(child.element);
        }
        else {
            (this as HTMLElement).prepend(child);
        }
        if (configAction != null) {
            configAction(child);
        }
        return child;
    };

    HTMLElement.prototype.appendControl = function <TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void) {
        (this as HTMLElement).appendChild(control.element);
        if (configAction != null) {
            configAction(control);
        }
        return control;
    };

    HTMLElement.prototype.prependControl = function <TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void) {
        (this as HTMLElement).prepend(control.element);
        if (configAction != null) {
            configAction(control);
        }
        return control;
    };

    HTMLElement.prototype.insertControlBefore = function <TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void) {
        (this as HTMLElement).before(control.element);
        if (configAction != null) {
            configAction(control);
        }
        return control;
    };

    HTMLElement.prototype.insertControlAfter = function <TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void) {
        (this as HTMLElement).after(control.element);
        if (configAction != null) {
            configAction(control);
        }
        return control;
    };


    HTMLElement.prototype.prependHTML = function <K extends keyof HTMLElementTagNameMap>(elementType: K | string, configActionOrContent?: ((element: HTMLElement) => void) | string) {

        let element = document.createElement(elementType);
        if (configActionOrContent) {
            if (typeof configActionOrContent == 'string') {
                element.innerHTML = configActionOrContent;
            }
            else {
                configActionOrContent(element);
            }
        }
        this.prepend(element);
        return element;
    };

    HTMLElement.prototype.appendHTML = function <K extends keyof HTMLElementTagNameMap>(elementType: K | string, configActionOrContent?: ((element: HTMLElement) => void) | string) {

        let element = document.createElement(elementType);
        if (configActionOrContent) {
            if (typeof configActionOrContent == 'string') {
                element.innerHTML = configActionOrContent;
            }
            else {
                configActionOrContent(element);
            }
        }
        this.appendChild(element);
        return element;
    };


    HTMLElement.prototype.insertHTMLBefore = function <K extends keyof HTMLElementTagNameMap>(elementType: K | string, configActionOrContent?: ((element: HTMLElement) => void) | string) {

        let element = document.createElement(elementType);
        if (configActionOrContent) {
            if (typeof configActionOrContent == 'string') {
                element.innerHTML = configActionOrContent;
            }
            else {
                configActionOrContent(element);
            }
        }
        let _this = (this as HTMLElement);
        _this.before(element);
        return element;
    };


    HTMLElement.prototype.insertHTMLAfter = function <K extends keyof HTMLElementTagNameMap>(elementType: K | string, configActionOrContent?: ((element: HTMLElement) => void) | string) {

        let element = document.createElement(elementType);
        if (configActionOrContent) {
            if (typeof configActionOrContent == 'string') {
                element.innerHTML = configActionOrContent;
            }
            else {
                configActionOrContent(element);
            }
        }
        let _this = (this as HTMLElement);
        _this.after(element);
        return element;
    };


    HTMLElement.prototype.centerVertically = function () {
        this.style.position = 'relative';
        this.style.top = '50%';
        this.style.transform = 'perspective(1px) translateY(-50%)';
    };

    HTMLElement.prototype.centerHorizontally = function () {
        this.style.position = 'relative';
        this.style.left = '50%';
        this.style.transform = 'perspective(1px) translateX(-50%)';
    };

    HTMLElement.prototype.center = function () {
        this.style.position = 'relative';
        this.style.top = '50%';
        this.style.left = '50%';
        this.style.transform = 'perspective(1px) translateY(-50%) translateX(-50%)';
    };

    HTMLElement.prototype.centerContentVertically = function () {
        (<HTMLElement>this).style.display = 'flex';
        (<HTMLElement>this).style.alignItems = 'center';
    };

    HTMLElement.prototype.centerContentHorizontally = function () {
        (<HTMLElement>this).style.display = 'flex';
        (<HTMLElement>this).style.justifyContent = 'center';
    };

    HTMLElement.prototype.centerContent = function () {
        (<HTMLElement>this).style.display = 'flex';
        (<HTMLElement>this).style.alignItems = 'center';
        (<HTMLElement>this).style.justifyContent = 'center';
    };

    HTMLElement.prototype.disableUserSelection = function () {
        NextAdmin.Style.append('NextAdmin.NoSelect', NextAdmin.UI.UserInterfaceHelper.noSelectStyle);
        (<HTMLElement>this).classList.add('no-select');
    };

    HTMLElement.prototype.hideScrollbar = function () {
        NextAdmin.Style.append('NextAdmin.HideScrollbar', NextAdmin.UI.UserInterfaceHelper.noScrollbarStyle);
        (<HTMLElement>this).classList.add('no-scrollbar');
    };

    HTMLElement.prototype.setBackgroundImage = function (imageUrl: string, cover = true) {
        (<HTMLElement>this).style.background = 'url("' + imageUrl + '")';
        if (cover) {
            (<HTMLElement>this).style.backgroundSize = 'cover';
        }
        (<HTMLElement>this).style.backgroundRepeat = 'no-repeat';
        (<HTMLElement>this).style.backgroundPosition = 'center';
    };

    HTMLElement.prototype.getChildrenElements = function () {
        let children = [];
        for (let i = 0; i < this.children.length; i++) {
            let node = this.children[i];
            if (node instanceof HTMLElement) {
                children.add(this.children[i]);
            }
        }
        return children;
    };

    HTMLElement.prototype.getDescendantsChildrenElements = function () {
        let elementsToExplore = (this as HTMLElement).getChildrenElements();

        for (let element of elementsToExplore) {
            elementsToExplore.addRange(element.getChildrenElements());
        }
        return elementsToExplore;
    };


    HTMLElement.prototype.isEnable = function () {
        let element = this as HTMLElement;
        return element['_disableContainer'] == null;
    };


    HTMLElement.prototype.enable = function () {
        let element = this as HTMLElement;
        let disableContainer = element['_disableContainer'] as HTMLElement;
        if (disableContainer == null) {
            return;
        }
        disableContainer.remove();
        delete element['_disableContainer'];
        element['_disableContainer'] = null;
    };


    HTMLElement.prototype.disable = function () {
        let element = this as HTMLElement;
        element.style.position = 'relative';
        let disableContainer = element['_disableContainer'] as HTMLElement;
        if (disableContainer != null) {
            return disableContainer;
        }

        disableContainer = document.createElement('div');
        disableContainer.style.position = 'absolute';
        disableContainer.style.width = '100%';
        disableContainer.style.height = '100%';
        disableContainer.style.left = '0px';
        disableContainer.style.top = '0px';
        disableContainer.style.background = 'rgba(255,255,255,0.4)';
        disableContainer.style.cursor = 'not-allowed';
        disableContainer.style.zIndex = '10';
        element.appendChild(disableContainer);
        element['_disableContainer'] = disableContainer;
        return disableContainer;
    };

    HTMLElement.prototype.trigger = function (eventName) {
        this.dispatchEvent(new Event(eventName));
    };

    HTMLElement.prototype.getControl = function () {
        return this['_control'];
    };

    Node.prototype.addEventsListener = function (eventsNames, listener, options) {

        for (let eventName of eventsNames.split(" ")) {
            this.addEventListener(eventName, listener, options);
        }
        return listener;
    };

    Node.prototype.removeEventsListener = function (eventsNames, listener) {
        for (let eventName of eventsNames.split(" ")) {
            (<Node>this).removeEventListener(eventName, listener);
        }
    };
}
catch
{

}
