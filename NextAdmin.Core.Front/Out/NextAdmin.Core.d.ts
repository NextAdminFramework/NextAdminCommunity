declare namespace NextAdmin {
    class Style {
        static append(key: string, value: string): void;
        static load(url: string, key?: string): Promise<HTMLLinkElement>;
        static exist(key: string): boolean;
    }
}
declare namespace NextAdmin {
    class Animation {
        static playingAnimationElements: Array<HTMLElement>;
        static animateStyle: string;
        static registerStyle(): void;
        static animate(element: HTMLElement, animation: string, options?: AnimationOptions): Promise<void>;
    }
    interface AnimationOptions {
        onEndAnimation?: () => void;
        animationSpeed?: AnimationSpeed;
    }
    enum AnimationSpeed {
        slow = "slow",
        slower = "slower",
        fast = "fast",
        faster = "faster"
    }
}
interface HTMLElement {
    anim(animation: string, options?: NextAdmin.AnimationOptions): Promise<void>;
}
interface Array<T> {
    clear(): void;
    clone(): Array<T>;
    take(amount: number): Array<T>;
    skip(amount: number): Array<T>;
    where(predicate: (value?: T, index?: number, list?: T[]) => boolean): Array<T>;
    add(element: T): Array<T>;
    addRange(elements: T[]): Array<T>;
    remove(element: T): boolean;
    removeRange(element: T[]): T[];
    removeAt(index: number): any;
    contains(element: T): boolean;
    distinct(): Array<T>;
    distinctBy(keySelector: (key: T) => string | number): Array<T>;
    groupBy<TResult = T>(grouper: (key: T) => string | number, mapper?: (element: T) => TResult): {
        [key: string]: TResult[];
    };
    groupByArray<TResult = T>(grouper: (key: T) => string | number, mapper?: (element: T) => TResult): Array<{
        name: string;
        items: Array<T>;
    }>;
    insert(index: number, element: T): Array<T>;
    select<TOut>(selector: (element: T, index: number) => TOut): Array<TOut>;
    selectAsync<TOut>(selector: (element: T, index: number) => Promise<TOut>): Promise<Array<TOut>>;
    orderBy(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): Array<T>;
    orderByDescending(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): Array<T>;
    aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any;
    sum(transform?: (value?: T, index?: number, list?: T[]) => number): number;
    cast<U>(): Array<U>;
    replace(oldElement: any, newElement: any): any;
    first(): T;
    first(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    first(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;
    firstOrDefault(): T;
    firstOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    firstOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;
    last(): T;
    last(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    last(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;
    lastOrDefault(): T;
    lastOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T;
    lastOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;
    min(): number;
    min(selector: (value: T, index: number, array: T[]) => number): number;
    min(selector?: (value: T, index: number, array: T[]) => number): number;
    max(): number;
    max(selector: (value: T, index: number, array: T[]) => number): number;
    max(selector?: (value: T, index: number, array: T[]) => number): number;
    average(): number;
    average(transform: (value?: T, index?: number, list?: T[]) => any): number;
    average(transform?: (value?: T, index?: number, list?: T[]) => any): number;
    count(): number;
    count(predicate: (value?: T, index?: number, list?: T[]) => boolean): number;
    count(predicate?: (value?: T, index?: number, list?: T[]) => boolean): number;
    toFlatArray(action: (element: T) => Array<T>): Array<T>;
    toDictionary(key: ((data: T) => string) | string): NextAdmin.Dictionary<T>;
}
declare namespace NextAdmin {
    class CSV {
        static parse(csvStrData: string, delimiter?: string): string[][];
    }
}
declare namespace NextAdmin {
    class Cookies {
        static get(cname: string): string;
        static set(name: string, value: string, days?: number): void;
        static delete(name: string): void;
    }
}
declare namespace NextAdmin {
    class Copy {
        static copyTo(source: any, target: any): void;
        static clone<T>(objectToClone: T): T;
    }
}
declare namespace NextAdmin {
    interface CssDeclaration {
        width?: string;
        alignContent?: string;
        alignItems?: string;
        alignSelf?: string;
        alignmentBaseline?: string;
        all?: string;
        animation?: string;
        animationDelay?: string;
        animationDirection?: string;
        animationDuration?: string;
        animationFillMode?: string;
        animationIterationCount?: string;
        animationName?: string;
        animationPlayState?: string;
        animationTimingFunction?: string;
        backfaceVisibility?: string;
        background?: string;
        backgroundAttachment?: string;
        backgroundClip?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundOrigin?: string;
        backgroundPosition?: string;
        backgroundPositionX?: string;
        backgroundPositionY?: string;
        backgroundRepeat?: string;
        backgroundSize?: string;
        baselineShift?: string;
        blockSize?: string;
        border?: string;
        borderBlockEnd?: string;
        borderBlockEndColor?: string;
        borderBlockEndStyle?: string;
        borderBlockEndWidth?: string;
        borderBlockStart?: string;
        borderBlockStartColor?: string;
        borderBlockStartStyle?: string;
        borderBlockStartWidth?: string;
        borderBottom?: string;
        borderBottomColor?: string;
        borderBottomLeftRadius?: string;
        borderBottomRightRadius?: string;
        borderBottomStyle?: string;
        borderBottomWidth?: string;
        borderCollapse?: string;
        borderColor?: string;
        borderImage?: string;
        borderImageOutset?: string;
        borderImageRepeat?: string;
        borderImageSlice?: string;
        borderImageSource?: string;
        borderImageWidth?: string;
        borderInlineEnd?: string;
        borderInlineEndColor?: string;
        borderInlineEndStyle?: string;
        borderInlineEndWidth?: string;
        borderInlineStart?: string;
        borderInlineStartColor?: string;
        borderInlineStartStyle?: string;
        borderInlineStartWidth?: string;
        borderLeft?: string;
        borderLeftColor?: string;
        borderLeftStyle?: string;
        borderLeftWidth?: string;
        borderRadius?: string;
        borderRight?: string;
        borderRightColor?: string;
        borderRightStyle?: string;
        borderRightWidth?: string;
        borderSpacing?: string;
        borderStyle?: string;
        borderTop?: string;
        borderTopColor?: string;
        borderTopLeftRadius?: string;
        borderTopRightRadius?: string;
        borderTopStyle?: string;
        borderTopWidth?: string;
        borderWidth?: string;
        bottom?: string;
        boxShadow?: string;
        boxSizing?: string;
        breakAfter?: string;
        breakBefore?: string;
        breakInside?: string;
        captionSide?: string;
        caretColor?: string;
        clear?: string;
        clip?: string;
        clipPath?: string;
        clipRule?: string;
        color?: string;
        colorInterpolation?: string;
        colorInterpolationFilters?: string;
        columnCount?: string;
        columnFill?: string;
        columnGap?: string;
        columnRule?: string;
        columnRuleColor?: string;
        columnRuleStyle?: string;
        columnRuleWidth?: string;
        columnSpan?: string;
        columnWidth?: string;
        columns?: string;
        content?: string;
        counterIncrement?: string;
        counterReset?: string;
        cssFloat?: string;
        cssText?: string;
        cursor?: string;
        direction?: string;
        display?: string;
        dominantBaseline?: string;
        emptyCells?: string;
        fill?: string;
        fillOpacity?: string;
        fillRule?: string;
        filter?: string;
        flex?: string;
        flexBasis?: string;
        flexDirection?: string;
        flexFlow?: string;
        flexGrow?: string;
        flexShrink?: string;
        flexWrap?: string;
        float?: string;
        floodColor?: string;
        floodOpacity?: string;
        font?: string;
        fontFamily?: string;
        fontFeatureSettings?: string;
        fontKerning?: string;
        fontSize?: string;
        fontSizeAdjust?: string;
        fontStretch?: string;
        fontStyle?: string;
        fontSynthesis?: string;
        fontVariant?: string;
        fontVariantCaps?: string;
        fontVariantEastAsian?: string;
        fontVariantLigatures?: string;
        fontVariantNumeric?: string;
        fontVariantPosition?: string;
        fontWeight?: string;
        gap?: string;
        glyphOrientationVertical?: string;
        grid?: string;
        gridArea?: string;
        gridAutoColumns?: string;
        gridAutoFlow?: string;
        gridAutoRows?: string;
        gridColumn?: string;
        gridColumnEnd?: string;
        gridColumnGap?: string;
        gridColumnStart?: string;
        gridGap?: string;
        gridRow?: string;
        gridRowEnd?: string;
        gridRowGap?: string;
        gridRowStart?: string;
        gridTemplate?: string;
        gridTemplateAreas?: string;
        gridTemplateColumns?: string;
        gridTemplateRows?: string;
        height?: string;
        hyphens?: string;
        imageOrientation?: string;
        imageRendering?: string;
        inlineSize?: string;
        justifyContent?: string;
        justifyItems?: string;
        justifySelf?: string;
        left?: string;
        letterSpacing?: string;
        lightingColor?: string;
        lineBreak?: string;
        lineHeight?: string;
        listStyle?: string;
        listStyleImage?: string;
        listStylePosition?: string;
        listStyleType?: string;
        margin?: string;
        marginBlockEnd?: string;
        marginBlockStart?: string;
        marginBottom?: string;
        marginInlineEnd?: string;
        marginInlineStart?: string;
        marginLeft?: string;
        marginRight?: string;
        marginTop?: string;
        marker?: string;
        markerEnd?: string;
        markerMid?: string;
        markerStart?: string;
        mask?: string;
        maskComposite?: string;
        maskImage?: string;
        maskPosition?: string;
        maskRepeat?: string;
        maskSize?: string;
        maskType?: string;
        maxBlockSize?: string;
        maxHeight?: string;
        maxInlineSize?: string;
        maxWidth?: string;
        minBlockSize?: string;
        minHeight?: string;
        minInlineSize?: string;
        minWidth?: string;
        objectFit?: string;
        objectPosition?: string;
        opacity?: string;
        order?: string;
        orphans?: string;
        outline?: string;
        outlineColor?: string;
        outlineOffset?: string;
        outlineStyle?: string;
        outlineWidth?: string;
        overflow?: string;
        overflowAnchor?: string;
        overflowWrap?: string;
        overflowX?: string;
        overflowY?: string;
        overscrollBehavior?: string;
        overscrollBehaviorBlock?: string;
        overscrollBehaviorInline?: string;
        overscrollBehaviorX?: string;
        overscrollBehaviorY?: string;
        padding?: string;
        paddingBlockEnd?: string;
        paddingBlockStart?: string;
        paddingBottom?: string;
        paddingInlineEnd?: string;
        paddingInlineStart?: string;
        paddingLeft?: string;
        paddingRight?: string;
        paddingTop?: string;
        pageBreakAfter?: string;
        pageBreakBefore?: string;
        pageBreakInside?: string;
        paintOrder?: string;
        perspective?: string;
        perspectiveOrigin?: string;
        placeContent?: string;
        placeItems?: string;
        placeSelf?: string;
        pointerEvents?: string;
        position?: string;
        quotes?: string;
        resize?: string;
        right?: string;
        rotate?: string;
        rowGap?: string;
        rubyAlign?: string;
        rubyPosition?: string;
        scale?: string;
        scrollBehavior?: string;
        shapeRendering?: string;
        stopColor?: string;
        stopOpacity?: string;
        stroke?: string;
        strokeDasharray?: string;
        strokeDashoffset?: string;
        strokeLinecap?: string;
        strokeLinejoin?: string;
        strokeMiterlimit?: string;
        strokeOpacity?: string;
        strokeWidth?: string;
        tabSize?: string;
        tableLayout?: string;
        textAlign?: string;
        textAlignLast?: string;
        textAnchor?: string;
        textCombineUpright?: string;
        textDecoration?: string;
        textDecorationColor?: string;
        textDecorationLine?: string;
        textDecorationStyle?: string;
        textEmphasis?: string;
        textEmphasisColor?: string;
        textEmphasisPosition?: string;
        textEmphasisStyle?: string;
        textIndent?: string;
        textJustify?: string;
        textOrientation?: string;
        textOverflow?: string;
        textRendering?: string;
        textShadow?: string;
        textTransform?: string;
        textUnderlinePosition?: string;
        top?: string;
        touchAction?: string;
        transform?: string;
        transformBox?: string;
        transformOrigin?: string;
        transformStyle?: string;
        transition?: string;
        transitionDelay?: string;
        transitionDuration?: string;
        transitionProperty?: string;
        transitionTimingFunction?: string;
        translate?: string;
        unicodeBidi?: string;
        userSelect?: string;
        verticalAlign?: string;
        visibility?: string;
        whiteSpace?: string;
    }
}
interface Date {
    /**Retourne le nombre total de jour depuis l'an 0*/
    getTotalDays(): any;
    getWeek(): any;
    truncateToDate(): any;
    truncateToHour(): any;
    truncateToMinute(): any;
    addSeconds(seconds: number): Date;
    addMinutes(minutes: number): Date;
    addHours(hours: number): Date;
    addDays(days: number): Date;
    addMonths(days: number): Date;
    addYears(years: number): Date;
    clone(): Date;
    toLocalShortTimeString(timeSeparator?: string): string;
    toLocalDateTimeString(): string;
    toISODateString(): string;
    toUTCDate(): Date;
    isToday(): boolean;
}
declare namespace NextAdmin {
    class DateTime {
        static now(): Date;
        static firstDayOfYear(): Date;
        static firstDayOfMonth(): Date;
    }
}
declare namespace NextAdmin {
    class DependenciesController {
        static registeredDependencies: {};
        /**
         *
         * @param dependencies
         * @param ready
         * @param fastLoading indicate the way to load dependency.
         * if set to true, all dependencies will be loaded simultaniously, and appended as element in given order,
         * this method is more powerfull but have issus for style that should reload data like background or fonts.
         * if set to false, data will be loaded as normal resource, it avoid issue, but it's less faster because all query are done one by one
         */
        static load(dependencies: Array<DependencyInfo | string>, ready?: () => void, fastLoading?: boolean): Promise<Dictionary<DependencyInfo>>;
        static preparDependencies(dependencies: Array<DependencyInfo | string>, keepOnlyNotLoadedDependencyes?: boolean): Array<DependencyInfo>;
        static unloadRange(dependencies: Array<DependencyInfo | string>): void;
        static unload(key: string): void;
        static exist(key: string): boolean;
    }
    interface DependencyInfo {
        key?: string;
        url: string;
        content?: string;
        type?: DependencyType;
    }
    enum DependencyType {
        style = 0,
        script = 1,
        typeScript = 2
    }
}
declare namespace NextAdmin {
    class Dictionary<T> {
        constructor(obj?: any);
        set(key: string, value: T): void;
        get(key: string): T;
        containsKey(key: string): boolean;
        add(key: string, value: T): void;
        tryAdd(key: string, value: T): boolean;
        getKeys(): Array<string>;
        getValues(): Array<T>;
        getKeysValues(): {
            key: string;
            value: T;
        }[];
        remove(key: string): void;
        clear(): void;
        clone(): Dictionary<T>;
    }
}
declare namespace NextAdmin {
    interface IEvent {
        subscribe(fn: () => any): void;
        unsubscribe(fn: () => any): void;
    }
    class EventHandlerBase implements IEvent {
        private _subscriptions;
        subscribe(fn: () => void): void;
        unsubscribe(fn: () => void): void;
        subscribeOnce(fn: () => void): () => void;
        unsubscribeAll(): void;
        dispatch(): void;
        isSubscribed(fn: () => void): boolean;
    }
    class EventHandler<TSender, TArgs> implements IEvent {
        private _subscriptions;
        subscribe(fn: (sender: TSender, args: TArgs) => void): (sender: TSender, args: TArgs) => void;
        unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
        subscribeOnce(fn: (sender: TSender, args: TArgs) => void): (sender: TSender, args: TArgs) => void;
        unsubscribeAll(): void;
        dispatch(sender: TSender, args?: TArgs): void;
        isSubscribed(fn: (sender: TSender, args: TArgs) => void): boolean;
    }
    class AsyncEventHandler<TSender, TArgs> implements IEvent {
        private _subscriptions;
        subscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void;
        unsubscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void;
        subscribeOnce(fn: (sender: TSender, args: TArgs) => Promise<void>): (sender: TSender, args: TArgs) => void;
        unsubscribeAll(): void;
        dispatch(sender: TSender, args?: TArgs): Promise<void>;
    }
}
declare namespace NextAdmin {
    class FileExplorer {
        static openFileExplorer(onFilesSelectedAction: (files: Array<File>) => void, mulipleFiles?: boolean, extensions?: string[]): void;
    }
}
interface File {
    getDataAsBase64Url(): Promise<string>;
    getDataAsArrayBuffer(): Promise<ArrayBuffer>;
}
declare namespace NextAdmin {
    class Guid {
        private _guid;
        constructor(guid?: string);
        toString(): string;
        static newGuid(): Guid;
        static createStrGuid(): string;
    }
}
interface HTMLElement {
    onSizeChanged(callBack: () => void): ResizeObserver;
    onDoubleClick(callBack: () => void): any;
    addStyle(style: CSSStyleDeclaration): any;
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
    centerVertically(): any;
    centerHorizontally(): any;
    center(): any;
    centerContentVertically(): any;
    centerContentHorizontally(): any;
    centerContent(): any;
    disableUserSelection(): any;
    hideScrollbar(): any;
    setBackgroundImage(imageUrl: string, cover?: boolean): any;
    isInViewport(): boolean;
    disable(): HTMLElement;
    getChildrenElements(): Array<HTMLElement>;
    getDescendantsChildrenElements(): Array<HTMLElement>;
    enable(): any;
    isEnable(): boolean;
    trigger(eventName: string): any;
    getControl(): NextAdmin.UI.Control;
    addScreenMaxWidthStyle(screenMaxSize: number, style: NextAdmin.CssDeclaration): any;
    addScreenMinWidthStyle(screenMaxSize: number, style: NextAdmin.CssDeclaration): any;
}
interface Node {
    addEventsListener(eventsNames: string, listener: (this: HTMLElement, ev: any) => any, options?: boolean | AddEventListenerOptions): (this: HTMLElement, ev: any) => any;
    removeEventsListener(eventsNames: string, listener: any): any;
}
interface HTMLTableElement {
    fixHeader(onDrawHeaderAction?: (cell: HTMLElement) => void): any;
}
declare namespace NextAdmin {
    class Image {
        static createBase64EmptyImage(width: number, height: number, format?: string): string;
        static resizeImage(base64Data: string, maxWidth: number, maxHeight: number, targetType: string, resultAction: (b64ImageResult: string) => void): void;
        static computeResizedImageSize(imageWidth: number, imageHeight: number, maxWidth: number, maxHeight: number): {
            Width: number;
            Height: number;
        };
        static getSize(src: string): Promise<Size>;
    }
    interface Size {
        width: number;
        height: number;
    }
}
declare namespace NextAdmin {
    class Logger {
        events: LogEvent[];
        logError(message: string): Logger;
        logWarning(message: string): Logger;
        logInfo(message: string): Logger;
        throwError(message: string): void;
        buildTrace(): string;
        static getEventTypeColor(eventType: LogEventType): string;
    }
    interface LogEvent {
        date: Date;
        message: string;
        type: LogEventType;
    }
    enum LogEventType {
        Info = 0,
        Warning = 1,
        Error = 2
    }
}
declare namespace NextAdmin {
    class NavigationController {
        private _pages;
        private _previousPage;
        private _currentPage;
        onNavigate: EventHandler<NavigationController, NavigationArgs>;
        onAddPage: EventHandler<NavigationController, UI.Page>;
        onPageChanged: EventHandler<NavigationController, UI.Page>;
        options: NavigationControllerOptions;
        pageContainer: HTMLElement;
        constructor(options?: NavigationControllerOptions);
        addPage(page: UI.Page, key?: string): void;
        getInstantiatedPages(): Array<UI.Page>;
        getPage(pageName: string): Promise<UI.Page>;
        getCurrentPage(): UI.Page;
        getCurrentPageName(): string;
        getPreviousPage(): UI.Page;
        getPreviousPageName(): string;
        navigateToUrl(url?: string, updateNavigatorState?: UpdateNavigatorState): Promise<void>;
        getPageInfoFromUrl(url?: string): {
            pageName?: string;
            pageData?: any;
        };
        refreshPage(reload?: boolean): Promise<void>;
        navigateBack(): Promise<NextAdmin.UI.Page>;
        navigateBackOrDefault(defaultPageName?: string): Promise<NextAdmin.UI.Page>;
        navigateTo(pageName: string, parameters?: any, navigatorHistoryAction?: UpdateNavigatorState, force?: boolean): Promise<NextAdmin.UI.Page>;
        updateNavigatorHistory(pageName: string, parameters?: {}, psuhState?: boolean): void;
        protected displayMode?: DisplayMode;
        getDisplayMode(): DisplayMode;
        setDisplayMode(displayMode?: DisplayMode): Promise<void>;
        static getDisplayMode(): DisplayMode;
    }
    enum DisplayMode {
        desktop = 1,
        mobile = 2
    }
    interface NavigationArgs {
        previousPage: UI.Page;
        nextPage: UI.Page;
        cancelNavigation: boolean;
    }
    interface PageInfo {
        /**Common name of the page, used for navigation */
        name?: string;
        factory?: (options: UI.PageOptions) => UI.Page;
        /**NextAdmin.UI.Page object class name used to instanciate page */
        className?: string;
        /**Url of page Html content */
        contentUrl?: string;
        /**Url of the script conatining page class */
        scriptUrl?: string;
        /**List of dependencies loaded and unload when navigate to page */
        dependencies?: Array<string | DependencyInfo>;
    }
    interface NavigationControllerOptions {
        pages?: PageInfo[];
        defaultPageName?: string;
        pagesContainer?: HTMLElement;
        isSinglePageApplicationNavigationEnabled?: boolean;
    }
    var Navigation: NavigationController;
    enum UpdateNavigatorState {
        none = 0,
        pushState = 1,
        replaceState = 2
    }
    const CacheKey: string;
}
declare namespace NextAdmin {
    class Numeric {
        static pad(number: number, digitCount: number): string;
    }
}
interface Number {
    toStringDigit(digitCount: number): string;
}
declare namespace NextAdmin {
    class Path {
        static getFileExtension(fileNameOrExtension: string): string;
        static getFileName(fullPath: string): string;
        static getFileNameWithoutExtension(fileNameWithExtension: string): string;
        static isImage(fileNameOrExtension: string): boolean;
        static isAudio(fileNameOrExtension: string): boolean;
        static isVideo(fileNameOrExtension: string): boolean;
        /**
         * Return parent directory path with name (full path)
         * @param fullPath
         */
        static getDirectoryName(fullPath?: string): string;
        static combine(str1?: string, str2?: string): string;
    }
}
declare namespace NextAdmin {
    class PerfectScrollbarHandler {
        private static _perfectScrollBarLoaded;
        static ensurePerfectScrollbarLoaded(): void;
        static append(element: HTMLElement): Promise<PerfectScrollbar>;
    }
}
declare namespace PerfectScrollbar {
    interface Options {
        handlers?: string[];
        maxScrollbarLength?: number;
        minScrollbarLength?: number;
        scrollingThreshold?: number;
        scrollXMarginOffset?: number;
        scrollYMarginOffset?: number;
        suppressScrollX?: boolean;
        suppressScrollY?: boolean;
        swipeEasing?: boolean;
        useBothWheelAxes?: boolean;
        wheelPropagation?: boolean;
        wheelSpeed?: number;
    }
}
declare class PerfectScrollbar {
    constructor(element: string | HTMLElement, options?: PerfectScrollbar.Options);
    update(): void;
    destroy(): void;
    reach: {
        x: 'start' | 'end' | null;
        y: 'start' | 'end' | null;
    };
}
interface HTMLElement {
    appendPerfectScrollbar(): Promise<PerfectScrollbar>;
}
declare namespace NextAdmin {
    class QueryString {
        static fromURL(): any;
        static parseURL(url: string): any;
        static parseQuery(queryString: string): any;
        static encodeQuery(obj: any): string;
    }
}
declare namespace NextAdmin {
    class ResourcesManager {
        get(key: string): any;
        addResources(...resources: Array<{}>): any;
    }
}
declare namespace NextAdmin {
    class Script {
        static append(key: string, value: string): HTMLScriptElement;
        static load(url: string, key?: string, loadAsModule?: boolean): Promise<HTMLScriptElement>;
        static remove(key: string): void;
        static exist(key: string): boolean;
    }
}
declare namespace NextAdmin {
    class Serialization {
        static parseJsonAsync<T>(data: string, result?: ((result: T) => any)): void;
        static fromJsonBase64<T>(data: string): T;
    }
}
declare namespace NextAdmin {
    class Spinner {
        static createDefault(size?: number): HTMLImageElement;
    }
}
interface HTMLElement {
    startSpin(background?: string, size?: number, animation?: string): {
        spinnerContainer: HTMLDivElement;
        spinner: HTMLImageElement;
    };
    stopSpin(): any;
}
declare namespace NextAdmin {
    class String {
        static isNullOrEmptyString(str: any): boolean;
        static isNullOrEmpty(str: string): boolean;
        static isNullOrWhiteSpace(str: string): boolean;
        static isString(value: any): boolean;
        static nl2br(str: string): string;
    }
}
interface String {
    isNumeric(): any;
    hexColorToRGBA(alpha: number): any;
    toDigit(digitCount: number): string;
    decodeHTML(): string;
    decodeBase64Utf8(str: string): string;
    isoDateToFRDate(): string;
    removeDiacritics(): string;
    replaceAll(search: string, replace: string): string;
    replaceAllRegExp(regExp: RegExp, replace: string): string;
    firstCharToLower(): string;
    firstCharToUpper(): string;
    contains(search: string): boolean;
    extractTags(startDelimiter: string, endDelimiter: string): Array<string>;
    removeTags(startDelimiter: string, endDelimiter: string): string;
    replaceTags(startDelimiter: string, endDelimiter: string, replaceAction: (tagContent: string) => string): string;
    nl2br(): string;
    getHashCode(): number;
}
declare namespace NextAdmin {
    class Timer {
        private _timerHandler;
        callBack?: () => void;
        onExecute: EventHandler<Timer, any>;
        private _executeAtNextTickCallBacks;
        constructor(callBack?: () => void);
        private _onExecute;
        executeAtNextTick(callBack: () => void, replaceOtherCallBack?: boolean): void;
        throttle(callBack: () => void, delay: number, restartTimer?: boolean): void;
        start(delay: number): void;
        stop(): void;
        isRuning(): boolean;
        static sleep(delay: number): Promise<number>;
    }
}
declare namespace NextAdmin {
    class TypeScript {
        static append(key: string, content: string): HTMLScriptElement;
        static load(url: string, key?: string): Promise<HTMLScriptElement>;
        static remove(key: string): void;
        static exist(key: string): boolean;
    }
}
declare namespace NextAdmin {
    class Url {
        raw?: string;
        domain?: string;
        isHttps?: boolean;
        strPath?: string;
        path?: string[];
        queryString?: string;
        parameters?: Dictionary<string[]>;
        constructor(src: string);
        getParameter(key: string): string;
        getParameters(key: string): Array<string>;
        static parse(url?: string): Url;
    }
}
declare namespace NextAdmin {
    class UserAgent {
        static isSafari(): boolean;
        static isChrome(): boolean;
        static isFireFox(): boolean;
        static isEdge(): boolean;
        static isIE11(): boolean;
        static isIE10OrOlder(): boolean;
        static isAndroid(): boolean;
        static isIOS(): boolean;
        static isIPad(): boolean;
        static isIPhone(): boolean;
        static isMobile(): boolean;
        static isDesktop(): boolean;
    }
}
declare namespace NextAdmin.Business {
    class DataControllerBase<T> {
        options: DataControllerBaseOptions;
        constructor(options: DataControllerBaseOptions);
        getDataPropertyInfoFromPath(dataName: string, path: string): DataPropertyInfo;
        getDataName(): string;
        getDataPrimaryKeyName(): string;
        getDataPropertyInfo_(dataName: string, propertyName: string): DataPropertyInfo;
        getDataPropertyInfo(property: ((dataDef: T) => any) | string): DataPropertyInfo;
        getDataInfo(dataName?: string): DataInfo;
        getDataPropertyInfos(dataName?: string): Array<DataPropertyInfo>;
        getDataDisplayName(dataName?: string): string;
        getDataDisplayValue(data: any): string;
        getDataPropertyPaths(dataName?: string, exploreJoinedData?: boolean, includeForeignKey?: boolean): Array<{
            label: string;
            path: string;
        }>;
        getDataPrimaryKeyValue(data: any): any;
        isDataUpToDate(): boolean;
        save(args?: DataControllerActionArgs): Promise<any>;
        displayDefaultError(result: Result): void;
        askUserToSaveDataIfNeededAndExecuteAction(continueAction: (dataSaved: boolean) => void, cancelAction?: () => void): void;
        private _dataDef;
        getDataDef(): T;
        getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string;
    }
    class DataControllerBase_ extends DataControllerBase<any> {
    }
    interface DataControllerBaseOptions {
        dataName: string;
        dataPrimaryKeyName?: string;
        dataInfos?: Dictionary<DataInfo>;
        updateDataFromServerAfterSave?: boolean;
    }
    interface SaveDataResult extends ResultErrors {
        success: boolean;
        message?: string;
        newData?: any;
    }
    interface Result {
        message?: string;
        code?: string;
        success: boolean;
    }
    interface ResultErrors extends Result {
        errors?: Array<DataError>;
        warnings?: Array<DataError>;
    }
    interface DeleteDataResult extends ResultErrors {
    }
    interface LoadDataResult extends Result {
        data?: any;
    }
    interface DataError {
        dataName?: string;
        dataDisplayName?: string;
        dataId?: string;
        propertyName: string;
        propertyDisplayName: string;
        message: string;
        errorCode: string;
    }
    interface SaveDatasetResult extends ResultErrors {
        message?: string;
        newDataset?: Array<any>;
    }
    interface LoadDatasetResult extends Result {
        dataset?: Array<any>;
    }
    interface DataInfo {
        name: string;
        displayName?: string;
        displayPropertiesNames?: string[];
        propertyInfos?: Record<string, DataPropertyInfo> | {};
    }
    interface DataPropertyInfo {
        dataName: string;
        name: string;
        displayName?: string;
        type?: string;
        isPrimaryKey?: boolean;
        isRequired?: boolean;
        values?: Models.ValueItem[];
        foreignDataName?: string;
        foreignDataRelationName?: string;
        isQueryable?: boolean;
    }
    interface DataChangedEventArgs {
        previousData: any;
        newData: any;
        newDataState: DataState;
    }
    interface DataStateChangedEventArgs {
        previousState: DataState;
        newState: DataState;
    }
    enum DataErrorType {
        unknow = 0,
        emptyValue = 1,
        invalidValue = 2
    }
    enum DataState {
        append = 0,
        edited = 1,
        serialized = 2,
        deleted = 3
    }
    enum DataControllerActionType {
        append = 0,
        load = 1,
        save = 2,
        delete = 3
    }
    class DataStateHelper {
        static getDataState(data: any): DataState;
        static setDataState(data: any, state: DataState): void;
    }
    interface DataControllerActionArgs {
        displayErrors?: boolean;
    }
}
declare namespace NextAdmin.Business {
    class DataController<T> extends DataControllerBase<T> {
        static factory: (dataName: string) => DataController_;
        options: DataControllerOptions;
        form: NextAdmin.UI.IForm;
        bindedControls: Dictionary<UI.FormControl>;
        data: T;
        private _originalData;
        appendAction: (actionResult: (result: LoadDataResult) => void) => void;
        loadAction: (args: any, actionResult: (result: LoadDataResult) => void) => void;
        saveAction: (data: any, actionResult: (result: SaveDataResult) => void) => void;
        deleteAction: (data: any, actionResult: (result: DeleteDataResult) => void) => void;
        cancelAction: (data: any) => void;
        onDataChanged: EventHandler<DataController_, DataChangedEventArgs>;
        onDataLoaded: EventHandler<DataController_, LoadDataResult>;
        onDataAppended: EventHandler<DataController_, LoadDataResult>;
        onDataDeleted: EventHandler<DataController_, T>;
        onDataSaved: EventHandler<DataController_, SaveDataResult>;
        onControlChanged: EventHandler<UI.IFormControl, UI.ValueChangeEventArgs>;
        onDataStateChanged: EventHandler<DataController_, DataStateChangedEventArgs>;
        onStartChangeData: AsyncEventHandler<DataController_, DataChangedEventArgs>;
        onStartSaveData: AsyncEventHandler<DataController_, SaveDataEventArgs>;
        onControlBinded: EventHandler<DataController_, UI.IFormControl>;
        onReadOnlyChanged: EventHandler<DataController_, boolean>;
        protected _isReadOnlyEnabled?: boolean;
        protected _readOnlyMessage?: string;
        constructor(options: DataControllerOptions);
        displayDataErrors(action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        enableReadOnly(message?: string): void;
        disableReadOnly(): void;
        clearErrors(): void;
        bindToForm(form: NextAdmin.UI.IForm, autoExecuteAction?: boolean): void;
        save(args?: SaveDataArgs): Promise<SaveDataResult>;
        getValidationErrors(checkRequiredFields?: boolean): Array<DataError>;
        delete(args?: DeleteDataArgs): Promise<DeleteDataResult>;
        cancel(): void;
        private _bindControl;
        bindControl(formControl: UI.IFormControl, property: ((dataDef: T) => any) | string): void;
        unbindControl(formControl: UI.IFormControl): void;
        getControl<TControl extends UI.FormControl>(property: ((dataDef: T) => any) | string): TControl;
        load(dataId?: any, args?: LoadDataArgs): Promise<LoadDataResult>;
        append(args?: LoadDataArgs): Promise<LoadDataResult>;
        setData(data: any, state?: DataState): Promise<void>;
        setDataPropertyValue(dataDefPropertyAction: (dataDef: T) => any, value?: any, fireChange?: boolean): void;
        updateControlValueFromData(propertyName: string): void;
        updateDataValueFromControl(control: UI.IFormControl): void;
        getDataDisplayValue(data?: T): string;
        getDataPrimaryKeyValue(data?: T): any;
        getPrimaryKeyValue(): any;
        getData(): T;
        getOriginalData(): T;
        protected controlChanged(control: UI.IFormControl, args: UI.ValueChangeEventArgs): void;
        fireChange(): void;
        getDataState(): DataState;
        setDataState(state: DataState): void;
        clear(): void;
        isDataUpToDate(): boolean;
        ensureSerilized(action: (data: any) => void): void;
        ensureUpToDate(action: (data: any) => void, cancelAction?: () => void): void;
    }
    class DataController_ extends DataController<any> {
    }
    class LocalDataController<T> extends NextAdmin.Business.DataController<T> {
        constructor(options: any);
    }
    interface DataControllerOptions extends DataControllerBaseOptions {
        saveDataRequiredMessage?: string;
    }
    interface SaveDataArgs extends DataControllerActionArgs {
        onGetResponse?: (result: SaveDataResult) => void;
        preCheckRequiredFields?: boolean;
    }
    interface LoadDataArgs extends DataControllerActionArgs {
        onGetResponse?: (result: LoadDataResult) => void;
    }
    interface DeleteDataArgs extends DataControllerActionArgs {
        onGetResponse?: (result: DeleteDataResult) => void;
    }
    interface SaveDataEventArgs {
        data: any;
        dataState: any;
        errors: Array<DataError>;
        warnings: Array<DataError>;
        message?: string;
        cancel?: boolean;
    }
}
declare namespace NextAdmin.Business {
    class DatasetController<T> extends DataControllerBase<T> {
        static factory: (dataName: string) => DatasetController_;
        dataset: Array<any>;
        loadAction: (resultDataset: (result: LoadDatasetResult) => void) => void;
        saveAction: (dataset: Array<any>, resultDataset?: (result: SaveDatasetResult) => void) => void;
        appendAction: (resultDataset?: (result: LoadDataResult) => void) => void;
        onStartRequest: EventHandler<DatasetController_, any[]>;
        onEndRequest: EventHandler<DatasetController_, any[]>;
        onStartLoadData: AsyncEventHandler<DatasetController_, any[]>;
        onDataLoaded: EventHandler<DatasetController_, LoadDatasetResult>;
        onDataAdded: EventHandler<DatasetController_, LoadDatasetResult>;
        onStartSaveData: EventHandler<DatasetController_, any[]>;
        onDataSaved: EventHandler<DatasetController_, SaveDatasetResult>;
        onDataDeleted: EventHandler<DatasetController_, SaveDatasetResult>;
        onStartAppeningData: EventHandler<DatasetController_, any[]>;
        onDataAppened: EventHandler<DatasetController_, LoadDataResult>;
        onDataCleared: EventHandler<DatasetController_, any[]>;
        onDataChanged: EventHandler<DatasetController_, DataChangedArgs>;
        options: DataControllerOptions;
        constructor(options: DataControllerOptions);
        displayDataErrors(dataset: Array<T>, action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        load(args?: LoadDatasetArgs): Promise<LoadDatasetResult>;
        loadAdd(args?: LoadDatasetArgs): Promise<LoadDatasetResult>;
        save(args?: SaveDatasetArgs): Promise<SaveDatasetResult>;
        deleteItems(items: Array<any>, args?: SaveDatasetArgs): Promise<SaveDatasetResult>;
        append(args?: LoadDatasetArgs): Promise<LoadDataResult>;
        clear(): void;
        getDataItemById(id: any): any;
        displayLostDataMessageIfNeededAndExecuteAction(actionToExecute: () => void): void;
        isDataUpToDate(): boolean;
        ensureUpToDate(action: (dataset: any[]) => void): void;
        take(count?: number): void;
        skip(count: number): void;
        orderBy(...columns: {
            name: string;
            desc?: boolean;
        }[]): void;
        select(...columns: string[]): void;
        distinct(value?: boolean): void;
        where(query: string, ...values: any[]): void;
        search(searchPropertyNames: string[], seacrhValue?: string): void;
        setQuery(queryData: Models.Query): void;
        getQuery(): Models.Query;
        clone(): DatasetController_;
    }
    class DatasetController_ extends DatasetController<any> {
    }
    interface DataChangedArgs {
        previousDataset?: Array<any>;
        newDataset?: Array<any>;
    }
    interface DataControllerOptions extends DataControllerBaseOptions {
        columnsToSelect?: Array<string>;
    }
    interface LoadDatasetArgs extends DataControllerActionArgs {
        onGetResponse?: (result: LoadDatasetResult) => void;
        dataState?: Business.DataState;
    }
    interface SaveDatasetArgs extends DataControllerActionArgs {
        onGetResponse?: (result: SaveDatasetResult) => void;
    }
}
declare namespace NextAdmin.Business {
    class EntityDataController<T> extends DataController<T> {
        static onEntityChanged: EventHandler<EntityDataController_, EntityChangedArgs>;
        onStartLoadEntity: EventHandler<EntityDataController_, Models.GetEntityArgs>;
        options: EntityDataControllerOptions;
        entityLockKey?: string;
        isDataMostRecentOverwritingAllowed: boolean;
        private _entityLockInfo?;
        constructor(options: EntityDataControllerOptions);
        displayDataErrors(action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        getEntityInfo(): Business.EntityInfo<T>;
        getEntityLockInfo(): Models.LockInfo;
        tryLockEntity(): Promise<Models.LockInfo>;
        tryUnlockEntity(): Promise<boolean>;
        isEntityLocked(): boolean;
        displayHTTPError(response: Services.HttpResponse, endDisplayFunc: () => void): void;
        dispatchEntityChanged(args: EntityChangedArgs): void;
    }
    class EntityDataController_ extends EntityDataController<any> {
    }
    interface EntityDataControllerOptions extends DataControllerBaseOptions {
        entityClient: Services.EntityClient;
        dataInfos?: EntityInfos;
        entityLockKey?: string;
    }
    interface EntityChangedArgs {
        entityName: string;
        previousEntity: any;
        newEntity: any;
        previousEntityState: DataState;
        newEntityState: DataState;
    }
}
declare namespace NextAdmin.Business {
    class EntityDatasetController<T> extends DatasetController<T> {
        options: EntityDatasetControllerOptions;
        onStartLoadEntities: EventHandler<EntityDatasetController_, Models.GetEntityArgs>;
        constructor(options: EntityDatasetControllerOptions);
        displayDataErrors(dataset: Array<any>, action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        getEntityInfo(): Business.EntityInfo<T>;
        displayHTTPError(response: Services.HttpResponse, endDisplayFunc: () => void): void;
        buildSelectQuery(): NextAdmin.Models.GetEntitiesArgs;
        private _take?;
        take(count?: number): void;
        private _skip?;
        skip(count: number): void;
        private _orderBy?;
        orderBy(...columns: {
            name: string;
            desc?: boolean;
        }[]): void;
        private _columnsToSelect?;
        select(...columns: string[]): void;
        private _distinct?;
        distinct(value?: boolean): void;
        private _where;
        private _whereValues;
        where(query: string, ...values: any[]): this;
        private _searchWhere;
        private _searchValues;
        search(searchPropertyNames: string[], seacrhValue?: string): void;
        setQuery(queryData: Models.Query): void;
        getQuery(): Models.Query;
        clone(): EntityDatasetController<T>;
    }
    class EntityDatasetController_ extends EntityDatasetController<any> {
    }
    interface EntityDatasetControllerOptions extends DataControllerOptions {
        entityClient: Services.EntityClient;
        dataInfos?: EntityInfos;
    }
}
declare namespace NextAdmin.Business {
    class QueryBuilder {
        query: Models.Query;
        writeQueryMode?: WriteQueryMode;
        constructor(query?: Models.Query, writeQueryMode?: WriteQueryMode);
        clone(): QueryBuilder;
        orderBy(...fields: Array<string>): QueryBuilder;
        skip(n: number): QueryBuilder;
        take(n: number): QueryBuilder;
        select(...fields: Array<string>): QueryBuilder;
        distinct(value?: boolean): QueryBuilder;
        where(query: string, ...args: Array<any>): QueryBuilder;
        whereIn(clumn: string, ...args: Array<any>): QueryBuilder;
        whereNotIn(clumn: string, ...args: Array<any>): QueryBuilder;
        search(search: string, ...clumns: string[]): QueryBuilder;
        searchMany(searches: string[], clumns: string[], mode?: SearchManyMode): QueryBuilder;
        whereContains(clumn: string, search: string, invariantCase?: boolean): QueryBuilder;
        whereNotContains(clumn: string, search: string, invariantCase?: boolean): QueryBuilder;
        whereStartsWith(clumn: string, search: string, invariantCase?: boolean): QueryBuilder;
        whereStartsNotWith(clumn: string, search: string, invariantCase?: boolean): QueryBuilder;
        whereEndsWith(clumn: string, search: string, invariantCase?: boolean): QueryBuilder;
        whereIsNullOrEmpty(clumn: string): QueryBuilder;
        whereIsNotNullOrEmpty(clumn: string): QueryBuilder;
    }
    enum SearchManyMode {
        and = 0,
        or = 1
    }
    enum WriteQueryMode {
        instanciateNewQueryPerCommand = 0,
        keepOriginalQuery = 1
    }
}
declare namespace NextAdmin.Business {
    class DbSetHandler<TEntity extends {}> extends QueryBuilder {
        entityName: string;
        entityClient: Services.EntityClient;
        constructor(entityName: string, entityClient: Services.EntityClient, query?: Models.Query, writeQueryMode?: WriteQueryMode);
        select(...fields: Array<string>): DbSetHandler<TEntity>;
        distinct(value?: boolean): DbSetHandler<TEntity>;
        where(query: string, ...args: Array<any>): DbSetHandler<TEntity>;
        whereIn(clumn: string, ...args: Array<any>): DbSetHandler<TEntity>;
        whereNotIn(clumn: string, ...args: Array<any>): DbSetHandler<TEntity>;
        search(search: string, ...clumns: string[]): DbSetHandler<TEntity>;
        searchMany(searches: string[], clumns: string[], mode?: SearchManyMode): DbSetHandler<TEntity>;
        orderBy(...fields: Array<string>): DbSetHandler<TEntity>;
        skip(n: number): DbSetHandler<TEntity>;
        take(n: number): DbSetHandler<TEntity>;
        clone(): DbSetHandler<TEntity>;
        toArray(parameters?: Record<string, any>): Promise<Array<TEntity>>;
        first(parameters?: Record<string, any>): Promise<TEntity>;
        addOrUpdate(entity: TEntity | any, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntityResponse<TEntity>>;
        addOrUpdateRange(entities: Array<TEntity | any>, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntitiesResponse<TEntity>>;
        create(parameters?: Record<string, any>): Promise<TEntity>;
        delete(id?: any, parameters?: Record<string, any>): Promise<NextAdmin.Models.UpdateEntitiesResponse>;
        deleteRange(ids?: Array<any>, parameters?: Record<string, any>): Promise<NextAdmin.Models.SaveEntitiesResponse<TEntity>>;
        get(id?: any, parameters?: Record<string, any>, detailToLoadNames?: Array<string>): Promise<TEntity>;
        count(): Promise<number>;
        sum(member: string): Promise<number>;
        min(propertyName?: string): Promise<number>;
        max(propertyName?: string): Promise<number>;
    }
    class EntityDbSetHandler<TEntity> extends DbSetHandler<TEntity> {
        entityInfo: EntityInfo<TEntity>;
        constructor(entityInfo: EntityInfo_, entityClient: Services.EntityClient, query?: Models.Query, writeQueryMode?: WriteQueryMode);
        clone(): EntityDbSetHandler<TEntity>;
        getPropertyName(dataDefPropertyAction: (dataDef: TEntity) => any): any;
        toArray_<TProp>(property: (dataDef: TEntity) => TProp, parameters?: Record<string, any>): Promise<Array<TProp>>;
        first_<TProp>(property: (dataDef: TEntity) => TProp, parameters?: Record<string, any>): Promise<TProp>;
        select(...fields: Array<string>): EntityDbSetHandler<TEntity>;
        distinct(value?: boolean): EntityDbSetHandler<TEntity>;
        where(query: string, ...args: Array<any>): EntityDbSetHandler<TEntity>;
        orderBy(...fields: Array<string>): EntityDbSetHandler<TEntity>;
        skip(n: number): EntityDbSetHandler<TEntity>;
        take(n: number): EntityDbSetHandler<TEntity>;
        where_(property: (dataDef: TEntity) => any, operator: string, value?: any): EntityDbSetHandler<TEntity>;
        whereIn_(property: (dataDef: TEntity) => any, ...args: Array<any>): EntityDbSetHandler<TEntity>;
        whereNotIn_(property: (dataDef: TEntity) => any, ...args: Array<any>): EntityDbSetHandler<TEntity>;
        whereContains_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity>;
        whereNotContains_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity>;
        whereStartsWith_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity>;
        whereEndsWith_(property: (dataDef: TEntity) => any, search: string, invariantCase?: boolean): EntityDbSetHandler<TEntity>;
        whereIsNullOrEmpty_(property: (dataDef: TEntity) => any): EntityDbSetHandler<TEntity>;
        whereIsNotNullOrEmpty_(property: (dataDef: TEntity) => any): EntityDbSetHandler<TEntity>;
        search_(search?: string, ...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity>;
        searchMany_(searches: string[], properties: Array<(dataDef: TEntity) => any>, mode?: SearchManyMode): EntityDbSetHandler<TEntity>;
        orderBy_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity>;
        orderByDesc_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity>;
        select_(...properties: Array<(dataDef: TEntity) => any>): EntityDbSetHandler<TEntity>;
        selectMany_(properties: (dataDef: TEntity) => Array<any>): EntityDbSetHandler<TEntity>;
        getRange(ids: Array<any>, dataDefPropertyAction?: (dataDef: TEntity) => any, parameters?: Record<string, any>): Promise<Array<TEntity>>;
        min_(property: (dataDef: TEntity) => any): Promise<number>;
        max_(property: (dataDef: TEntity) => any): Promise<number>;
        sum_(property: (dataDef: TEntity) => any): Promise<number>;
    }
}
declare namespace NextAdmin.Business {
    class EntityHelper {
        static getLinkedEntities(entityClient: Services.EntityClient, entittyInfos: EntityInfos, entityName: string, entityPrimaryKey: string): Promise<Array<LinkedEntitiesInfo>>;
    }
    interface LinkedEntitiesInfo {
        entityInfo: EntityInfo_;
        entities: Array<any>;
    }
}
declare namespace NextAdmin.Business {
    class EntityInfos extends Dictionary<EntityInfo_> {
        constructor(entitiesInfo?: Array<Models.EntityInfo>);
        getEntityPrimaryKey(entityName: string): string;
        getMemberInfo(entityName: string, memberName: string): DataPropertyInfo;
    }
    class EntityInfo<T> implements DataInfo {
        name: string;
        tableName?: string;
        displayName?: string;
        displayPropertiesNames: string[];
        entityParentNames: string[];
        propertyInfos: Dictionary<DataPropertyInfo>;
        constructor(data: Models.EntityInfo);
        private _dataDef;
        private getEntityDef;
        getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string;
        getPropertyNames(dataDefPropertyAction: (dataDef: T) => Array<any>): Array<string>;
        getPropertyInfo(dataDefPropertyAction: (dataDef: T) => any): DataPropertyInfo;
        private _primaryKey;
        getPrimaryKey(): string;
    }
    class EntityInfo_ extends EntityInfo<any> {
    }
}
declare namespace NextAdmin.Models {
    interface ApiResponse<T = void> {
        isSuccess?: boolean;
        code: string;
        message: string;
        exception: any;
        data: T;
    }
    enum ApiResponseCode {
        Success = "Success",
        AuthError = "AuthError",
        PermissionLevelError = "PermissionLevelError",
        SQLError = "SQLError",
        ValidationError = "ValidationError"
    }
}
declare namespace NextAdmin.Models {
    interface AuthTokenResponse extends NextAdmin.Models.ApiResponse {
        token: string;
        user: User;
        dayValidity?: number;
        userType: string;
    }
}
declare namespace NextAdmin.Models {
    interface EntityArgs {
        entityName: string;
        customActionName?: string;
        customActionArgs?: {};
        parameters?: Record<string, any>;
    }
    interface GetEntitiesArgs extends EntityArgs, Query {
        whereQuery?: string;
        whereQueryArgs?: Array<any>;
        selectQueries?: Array<string>;
        isSelectDistinctQuery?: boolean;
        orderByQueries?: Array<any>;
        skipRecordCount?: number;
        takeRecordCount?: number;
    }
    interface GetEntityArgs extends EntityArgs {
        entityId?: any;
        lockKey?: string;
        detailToLoadNames?: Array<string>;
    }
    interface SaveEntityArgs extends EntityArgs {
        entity: any;
        lockKey?: string;
        conflictAction?: ConflictAction;
    }
    interface SaveEntitiesArgs extends EntityArgs {
        entitiesToAddOrUpdate?: Array<any>;
        entitiesToDeleteIds?: Array<any>;
    }
    enum ConflictAction {
        overwrite = 0,
        cancel = 1
    }
}
declare namespace NextAdmin.Models {
    interface EntityMemberInfo {
        memberName: string;
        memberDisplayName: string;
        memberType: string;
        isPrimaryKey: boolean;
        isRequired: boolean;
        memberValues?: ValueItem[];
        foreignEntityName?: string;
        foreignEntityRelationName?: string;
        isQueryable?: boolean;
    }
    interface EntityInfo {
        entityName: string;
        entityTableName?: string;
        entityDisplayName?: string;
        entityParentNames: string[];
        displayMembersNames: string[];
        membersInfos: {};
    }
}
declare namespace NextAdmin.Models {
    interface GetEntityResponse extends NextAdmin.Models.ApiResponse {
        entity: any;
        lockInfo?: LockInfo;
    }
    interface LockInfo {
        creationDate?: string;
        expirationDate?: string;
        ownerName?: string;
        isOwner: boolean;
    }
    interface GetEntitiesResponse extends NextAdmin.Models.ApiResponse {
        entities: Array<any>;
    }
    interface UpdateEntitiesResponse extends NextAdmin.Models.ApiResponse {
        errors: EntityError[];
        warings: EntityError[];
        updateInfos: UpdateEntityInfo[];
    }
    interface SaveEntityResponse<T> extends UpdateEntitiesResponse {
        entity: T;
    }
    interface SaveEntityResponse_ extends SaveEntityResponse<any> {
    }
    interface SaveEntitiesResponse<T> extends UpdateEntitiesResponse {
        entities: Array<T>;
    }
    interface SaveEntitiesResponse_ extends SaveEntitiesResponse<any> {
    }
    interface DeleteEntityResponse extends UpdateEntitiesResponse {
    }
    interface EntityError {
        entityName: string;
        entityId: any;
        memberName: string;
        message: string;
        errorCode: string;
    }
    interface UpdateEntityInfo {
        entityName: string;
        entityId: any;
        actionType: UpdateEntityActionType;
    }
    enum UpdateEntityActionType {
        create = 1,
        update = 2,
        delete = 3
    }
}
declare namespace NextAdmin.Models {
    interface Query {
        whereQuery?: string;
        whereQueryArgs?: Array<any>;
        selectQueries?: Array<string>;
        isSelectDistinctQuery?: boolean;
        orderByQueries?: Array<any>;
        skipRecordCount?: number;
        takeRecordCount?: number;
    }
}
declare namespace NextAdmin.Models {
    interface SignUpUserArgs {
        email: string;
        password: string;
        verificationCode?: string;
    }
}
declare namespace NextAdmin.Models {
    interface User {
        id: string;
        userName: string;
        culture?: string;
        password?: string;
    }
}
declare namespace NextAdmin.Models {
    interface UserResponse extends NextAdmin.Models.ApiResponse {
        user: User;
        userType: string;
    }
}
declare namespace NextAdmin.Models {
    interface ValueItem {
        value: string;
        label?: string;
        displayOrder?: number;
    }
}
declare namespace NextAdmin {
    class ResourcesBase extends ResourcesManager {
        refreshIcon: string;
        backIcon: string;
        addIcon: string;
        downloadIcon: string;
        printIcon: string;
        saveIcon: string;
        deleteIcon: string;
        removeIcon: string;
        clearIcon: string;
        openIcon: string;
        checkIcon: string;
        cogIcon: string;
        searchIcon: string;
        iconCaretDown: string;
        iconCaretLeft: string;
        iconCaretRight: string;
        menuIcon: string;
        keyIcon: string;
        emailIcon: string;
        lockIcon: string;
        noDataIcon: string;
        copyIcon: string;
        dragIcon: string;
        closeIcon: string;
        linkIcon: string;
        warningIcon: string;
    }
}
declare namespace NextAdmin {
    class NextAdminIcons extends NextAdmin.ResourcesBase {
        addIcon: string;
        downloadIcon: string;
        printIcon: string;
        saveIcon: string;
        deleteIcon: string;
        removeIcon: string;
        closeIcon: string;
        clearIcon: string;
        checkIcon: string;
        cogIcon: string;
        openIcon: string;
        refreshIcon: string;
        searchIcon: string;
        menuIcon: string;
        iconCaretDown: string;
        iconCaretLeft: string;
        iconCaretRight: string;
        keyIcon: string;
        emailIcon: string;
        lockIcon: string;
        noDataIcon: string;
        copyIcon: string;
        dragIcon: string;
        backIcon: string;
        linkIcon: string;
        warningIcon: string;
    }
}
declare namespace NextAdmin {
    class ResourcesEn extends ResourcesBase {
        save: string;
        delete: string;
        deleteEntry: string;
        stopUseEntry: string;
        remove: string;
        deleteMulti: string;
        yes: string;
        no: string;
        cancel: string;
        refresh: string;
        add: string;
        overwriteDataTitle: string;
        overwriteDataMessage: string;
        overwriteData: string;
        saveNotAllowed: string;
        overwriteDataNotAllowedMessage: string;
        a: string;
        back: string;
        warning: string;
        error: string;
        unknownError: string;
        success: string;
        search: string;
        saveLastModification: string;
        lostDataNotSavedMessage: string;
        formDeleteMessageTitle: string;
        formDeleteMessage: string;
        formSaveRequiredTitle: string;
        formSaveRequiredMessage: string;
        requiredField: string;
        saveAndContinue: string;
        discardAndContinue: string;
        actions: string;
        menu: string;
        systemViewName: string;
        createNewView: string;
        editView: string;
        deleteView: string;
        setAsDefaultView: string;
        addColumn: string;
        addOperator: string;
        addFunction: string;
        addFilterValue: string;
        isNotNull: string;
        isNull: string;
        contains: string;
        addValue: string;
        viewEditor: string;
        viewName: string;
        defaultView: string;
        defaultUserViewName: string;
        columnName: string;
        control: string;
        editable: string;
        columnLabel: string;
        columnOrdering: string;
        manualOrderingColumn: string;
        columnSize: string;
        auto: string;
        filterQuery: string;
        unableToDeleteDataMessage: string;
        defaultDeleteError: string;
        validate: string;
        validateNew: string;
        export: string;
        dataExportConfig: string;
        format: string;
        fieldName: string;
        label: string;
        filterName: string;
        filters: string;
        userFilters: string;
        realName: string;
        print: string;
        generateDocument: string;
        printAll: string;
        printSelection: string;
        valueFormat: string;
        rawValue: string;
        displayValue: string;
        columns: string;
        all: string;
        visible: string;
        selection: string;
        data: string;
        list: string;
        primaryKey: string;
        linkTo: string;
        rowCount: string;
        columnCount: string;
        appendControl: string;
        fillAllFieldsMessage: string;
        addNewItems: string;
        addNewItemsText: string;
        open: string;
        openEntry: string;
        newEntry: string;
        start: string;
        end: string;
        min: string;
        max: string;
        standardListExport: string;
        clearFilter: string;
        loading: string;
        close: string;
        pleaseWait: string;
        unauthorizedAction: string;
        filterConfiguration: string;
        configure: string;
        dataSelector: string;
        valueSelector: string;
        multiValuesSelector: string;
        signIn: string;
        signUp: string;
        confirmEmail: string;
        login: string;
        password: string;
        rememberMe: string;
        noAccount: string;
        haveAnAccount: string;
        createAccount: string;
        forgottenPassword: string;
        recoverPassword: string;
        recoverMyPassword: string;
        invalidPassword: string;
        invalidEmail: string;
        unableToSendEmail: string;
        userAlreadyExist: string;
        confirmationCode: string;
        confirmationCodeMessage: string;
        invalidCredentials: string;
        readOnlyMode: string;
        readOnlyDefaultMessage: string;
        error_passwordAreNotSame: string;
        error_invalidPassword: string;
        passwordChanged: string;
        newPassword: string;
        newPasswordRepeat: string;
        currentPassword: string;
        changePasswordModalTitle: string;
        changeEmailModalTitle: string;
        newEmail: string;
        noDataAvailable: string;
        copy: string;
        errprMaximumPublishedProject: string;
        unamed: string;
        emailSent: string;
        recoverPasswordSuccess: string;
        recoverPasswordInvalidEmail: string;
        recoverPasswordDefaultError: string;
        newData: string;
        restorDataTitle: string;
        restorDataMessage: string;
        clearDataMessage: string;
    }
    var Resources: ResourcesEn;
}
declare namespace NextAdmin {
    class ResourcesFr extends ResourcesEn {
        save: string;
        delete: string;
        deleteEntry: string;
        stopUseEntry: string;
        remove: string;
        deleteMulti: string;
        yes: string;
        refresh: string;
        no: string;
        cancel: string;
        add: string;
        overwriteDataTitle: string;
        overwriteDataMessage: string;
        saveNotAllowed: string;
        overwriteDataNotAllowedMessage: string;
        overwriteData: string;
        a: string;
        back: string;
        warning: string;
        error: string;
        unknownError: string;
        success: string;
        search: string;
        saveLastModification: string;
        lostDataNotSavedMessage: string;
        formDeleteMessageTitle: string;
        formDeleteMessage: string;
        formSaveRequiredTitle: string;
        formSaveRequiredMessage: string;
        requiredField: string;
        saveAndContinue: string;
        discardAndContinue: string;
        actions: string;
        menu: string;
        systemViewName: string;
        createNewView: string;
        editView: string;
        deleteView: string;
        setAsDefaultView: string;
        addColumn: string;
        addOperator: string;
        addValue: string;
        addFunction: string;
        addFilterValue: string;
        isNotNull: string;
        isNull: string;
        contains: string;
        viewEditor: string;
        viewName: string;
        defaultView: string;
        defaultUserViewName: string;
        columnName: string;
        control: string;
        editable: string;
        columnOrdering: string;
        manualOrderingColumn: string;
        columnLabel: string;
        columnSize: string;
        auto: string;
        filterQuery: string;
        unableToDeleteDataMessage: string;
        defaultDeleteError: string;
        validate: string;
        validateNew: string;
        export: string;
        dataExportConfig: string;
        format: string;
        fieldName: string;
        label: string;
        filterName: string;
        filters: string;
        userFilters: string;
        realName: string;
        print: string;
        generateDocument: string;
        printAll: string;
        printSelection: string;
        valueFormat: string;
        rawValue: string;
        displayValue: string;
        columns: string;
        all: string;
        visible: string;
        selection: string;
        data: string;
        list: string;
        primaryKey: string;
        linkTo: string;
        rowCount: string;
        columnCount: string;
        appendControl: string;
        fillAllFieldsMessage: string;
        addNewItems: string;
        addNewItemsText: string;
        open: string;
        openEntry: string;
        newEntry: string;
        start: string;
        end: string;
        min: string;
        max: string;
        standardListExport: string;
        loading: string;
        pleaseWait: string;
        unauthorizedAction: string;
        close: string;
        filterConfiguration: string;
        configure: string;
        dataSelector: string;
        valueSelector: string;
        multiValuesSelector: string;
        clearFilter: string;
        iconCaretDown: string;
        iconCaretLeft: string;
        menuIcon: string;
        signIn: string;
        signUp: string;
        confirmEmail: string;
        login: string;
        password: string;
        rememberMe: string;
        noAccount: string;
        haveAnAccount: string;
        forgottenPassword: string;
        createAccount: string;
        keyIcon: string;
        invalidPassword: string;
        invalidEmail: string;
        unableToSendEmail: string;
        userAlreadyExist: string;
        confirmationCode: string;
        confirmationCodeMessage: string;
        invalidCredentials: string;
        readOnlyMode: string;
        readOnlyDefaultMessage: string;
        error_passwordAreNotSame: string;
        error_invalidPassword: string;
        passwordChanged: string;
        newPassword: string;
        newPasswordRepeat: string;
        currentPassword: string;
        changePasswordModalTitle: string;
        changeEmailModalTitle: string;
        newEmail: string;
        noDataAvailable: string;
        noDataIcon: string;
        copyIcon: string;
        copy: string;
        errprMaximumPublishedProject: string;
        unamed: string;
        recoverPassword: string;
        recoverMyPassword: string;
        emailSent: string;
        recoverPasswordSuccess: string;
        recoverPasswordInvalidEmail: string;
        recoverPasswordDefaultError: string;
        newData: string;
        restorDataTitle: string;
        restorDataMessage: string;
        clearDataMessage: string;
    }
}
declare namespace NextAdmin.Services {
    class HttpClient {
        headerParams: {};
        rootURL: string;
        constructor(rootURL?: string);
        postJson(url: string, params?: {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse>;
        postForm(url: string, params?: {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse>;
        get(url: string, params?: {}, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse>;
        fetch(url: string, options?: FetchOptions): Promise<Response>;
        fetchJson<T>(url: string, options?: FetchOptions): Promise<T>;
        fetchText(url: string, options?: FetchOptions): Promise<string>;
        send(request: HttpRequest, responseAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent) => void, beforeSend?: (xhr: XMLHttpRequest) => void): Promise<HttpResponse>;
    }
    enum HttpMethod {
        GET = "GET",
        POST = "POST"
    }
    enum BodyFormat {
        TEXT = "TEXT",
        JSON = "JSON",
        FORM = "FORM"
    }
    interface HttpRequest {
        async: boolean;
        url: string;
        method: HttpMethod | string;
        bodyFormat?: any;
        headerParams?: {};
        urlParams?: {};
        body?: any;
    }
    class HttpResponse {
        text?: string;
        content?: any;
        status: number;
        success: boolean;
        xhr: XMLHttpRequest;
        constructor(xhr: XMLHttpRequest);
        parseJson<TObject>(): TObject;
    }
    interface FetchOptions {
        method?: HttpMethod;
        jsonData?: {};
        cors?: boolean;
        queryArgs?: Record<string, string>;
        headerData?: Record<string, string>;
    }
}
declare namespace NextAdmin.Services {
    class EntityClient extends HttpClient {
        static onEntiesUpdated: EventHandler<any, Dictionary<EntityUpdatedInfo>>;
        static dispatchEntitiesUpdated(sender: any, mainEntities?: Array<{
            name: string;
            entities: Array<any>;
        }>, updateInfos?: Array<Models.UpdateEntityInfo>): void;
        authTokenName?: string;
        constructor(rootServiceURL?: string, authTokenName?: string, authToken?: string);
        setAuthToken(authToken: string): void;
        tryLockEntity(entityName: string, entityId: string, lockKey: string): Promise<NextAdmin.Models.ApiResponse<Models.LockInfo>>;
        tryUnlockEntity(entityName: string, entityId: string, lockKey: string): Promise<NextAdmin.Models.ApiResponse<boolean>>;
        getEntity(args: NextAdmin.Models.GetEntityArgs, responseAction?: (response: NextAdmin.Models.GetEntityResponse) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntityResponse>;
        createEntity(args: NextAdmin.Models.EntityArgs, responseAction?: (response: NextAdmin.Models.GetEntityResponse) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntityResponse>;
        saveEntity(saveEntityArgs: NextAdmin.Models.SaveEntityArgs, responseAction?: (response: NextAdmin.Models.SaveEntityResponse_) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.SaveEntityResponse_>;
        deleteEntity(args: NextAdmin.Models.GetEntityArgs, responseAction?: (response: NextAdmin.Models.UpdateEntitiesResponse) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.UpdateEntitiesResponse>;
        getEntities(args: NextAdmin.Models.GetEntitiesArgs, responseAction?: (response: NextAdmin.Models.GetEntitiesResponse) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.GetEntitiesResponse>;
        countEntities(args: NextAdmin.Models.GetEntitiesArgs, responseAction?: (response: NextAdmin.Models.ApiResponse<number>) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.ApiResponse<number>>;
        sumEntities(args: NextAdmin.Models.GetEntitiesArgs, responseAction?: (response: NextAdmin.Models.ApiResponse<number>) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.ApiResponse<number>>;
        minEntities(args: NextAdmin.Models.GetEntitiesArgs): Promise<NextAdmin.Models.ApiResponse<number>>;
        maxEntities(args: NextAdmin.Models.GetEntitiesArgs): Promise<NextAdmin.Models.ApiResponse<number>>;
        saveEntities(args: NextAdmin.Models.SaveEntitiesArgs, responseAction?: (response: NextAdmin.Models.SaveEntitiesResponse_) => void, errorAction?: (response: HttpResponse) => void, progressAction?: (progressArgs: ProgressEvent<XMLHttpRequestEventTarget>) => void): Promise<NextAdmin.Models.SaveEntitiesResponse_>;
        getEntityUserRight(entityName?: string, entityId?: string): Promise<number>;
    }
    interface EntityUpdatedInfo {
        entityName: string;
        entityUpdatedInfos?: Array<Models.UpdateEntityInfo>;
        entities?: Array<any>;
    }
}
declare namespace NextAdmin.Services {
    class UserClient extends HttpClient {
        authTokenName?: string;
        constructor(rootServiceURL?: string, authTokenName?: string);
        recoverPassword(userName: string): Promise<NextAdmin.Models.ApiResponse>;
        changePassword(newPassword: string, authToken?: string): Promise<NextAdmin.Models.ApiResponse>;
        authUser(userName: string, password: string, rememberTokeninCookies?: boolean): Promise<NextAdmin.Models.AuthTokenResponse>;
        getUserByToken(authToken?: string): Promise<NextAdmin.Models.User>;
        getUserByLogin(userName: string, password: string): Promise<NextAdmin.Models.UserResponse>;
        setUserCulture(culture?: string, authToken?: string): Promise<boolean>;
        getCurrentAuthToken(): string;
        deleteCurrentAuthToken(): void;
    }
}
declare namespace NextAdmin.UI {
    class Control implements IControl {
        element: HTMLElement;
        options: ControlOptions;
        static onCreated: EventHandler<Control, any>;
        constructor(htmlElement: HTMLElement | string, options?: ControlOptions);
        isEnable(): boolean;
        enable(): void;
        disable(): void;
        private _tooltipValue;
        setTooltip(value?: string): void;
        getToolTip(): string;
        changeEnableStateOnControlsRequiredValueChanged(condition: () => boolean, ...controls: Array<FormControl>): void;
        startSpin(): void;
        stopSpin(): void;
        hide(): void;
        display(): void;
        isVisible(): boolean;
        dispose(): void;
    }
    interface ControlOptions {
        css?: CssDeclaration;
        id?: string;
        classes?: Array<string>;
        disabled?: boolean;
        hidden?: boolean;
        toolTip?: string;
    }
    enum ControlStyle {
        default = 0,
        modern = 1
    }
}
declare namespace NextAdmin.UI {
    class AspectRatioContainer extends NextAdmin.UI.Control {
        options: AspectRatioLayoutOptions;
        imageRatio: HTMLImageElement;
        body: HTMLDivElement;
        constructor(options: AspectRatioLayoutOptions);
    }
    interface AspectRatioLayoutOptions extends NextAdmin.UI.ControlOptions {
        width?: number;
        height?: number;
    }
}
declare namespace NextAdmin.UI {
    class DefaultStyle {
        static RequiredFieldBackground: string;
        static SelectedRowBackground: string;
        static HoveredRowBackground: string;
        static RedOne: string;
        static BlueOne: string;
        static BlueTwo: string;
        static BlueGreenOne: string;
        static GreenOne: string;
        static GreenTwo: string;
        static OrangeOne: string;
        static YellowOne: string;
        static LightGrey: string;
        static Grey: string;
        static DarkModalBackdrop: string;
    }
}
declare namespace NextAdmin.UI {
    class Button extends Control implements IActionControl {
        element: HTMLButtonElement;
        options: ButtonOptions;
        action: (btn: Button, event?: MouseEvent) => void;
        static onCreated: EventHandler<Button, ButtonOptions>;
        onActionExecuting: EventHandler<Button, any>;
        onActionExecuted: EventHandler<Button, any>;
        static style: string;
        constructor(options?: ButtonOptions);
        private _currentSizeClass?;
        setSize(size?: ButtonSize): void;
        private _currentStyle;
        setStyle(style: ButtonStyle): void;
        getColorStyle(): ButtonStyle;
        static getColorStyleClass(style: ButtonStyle): "next-admin-btn-default" | "next-admin-btn-blue" | "next-admin-btn-light-blue" | "next-admin-btn-green" | "next-admin-btn-light-green" | "next-admin-btn-red" | "next-admin-btn-bg-white" | "next-admin-btn-bg-light-grey" | "next-admin-btn-bg-grey" | "next-admin-btn-bg-black" | "next-admin-btn-bg-blue" | "next-admin-btn-bg-green" | "next-admin-btn-bg-red" | "next-admin-btn-no-bg" | "next-admin-btn-no-bg-white" | "next-admin-btn-no-bg-light-grey" | "next-admin-btn-no-bg-dark-blue" | "next-admin-btn-no-bg-blue" | "next-admin-btn-no-bg-red";
        private _isPressed;
        press(disbaleClick?: boolean): void;
        release(): void;
        executeAction(event?: MouseEvent): void;
        setText(text: string): Button;
        getText(): string;
        private _badge;
        setBadge(options?: ButtonBadgeOptions): void;
        startSpin(): {
            spinnerContainer: HTMLDivElement;
            spinner: HTMLImageElement;
        };
        stopSpin(): void;
    }
    interface ButtonOptions extends ControlOptions {
        text?: string;
        action?: (btn: Button, event?: MouseEvent) => void;
        size?: ButtonSize;
        style?: ButtonStyle;
        stopClickEventPropagation?: boolean;
        popover?: string;
        htmlTag?: string;
    }
    enum ButtonStyle {
        default = 0,
        lightBlue = 1,
        blue = 2,
        green = 3,
        lightgreen = 4,
        red = 5,
        bgWhite = 6,
        bgLightGrey = 7,
        bgGrey = 8,
        bgBlack = 9,
        bgBlue = 10,
        bgGreen = 11,
        bgRed = 12,
        noBg = 13,
        noBgLightGrey = 14,
        noBgWhite = 15,
        noBgBlue = 16,
        noBgDarkBlue = 17,
        noBgRed = 18
    }
    enum ButtonSize {
        extraSmall = 0,
        small = 1,
        medium = 2,
        mediumResponsive = 3,
        large = 4,
        largeResponsive = 5
    }
    interface ButtonBadgeOptions {
        text?: string;
        backgroundColor?: string;
    }
}
declare namespace NextAdmin.UI {
    class Toolbar extends Control {
        row: HTMLTableRowElement;
        options: ToolbarOptions;
        onItemsChanged: EventHandler<Toolbar, (HTMLElement | Control)[]>;
        static style: string;
        static onCreated: EventHandler<Toolbar, any>;
        items: (HTMLElement | Control)[];
        constructor(options?: ToolbarOptions);
        protected addItem(item: Control | HTMLElement): void;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElement) => void): HTMLElementTagNameMap[K];
        prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        insertControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, index: number, setControlPropertiesAction?: (control: TElement) => void): TElement;
        removeControl<TElement extends Control | HTMLElement>(elementOrControl: TElement): void;
        clear(): void;
    }
    interface ToolbarOptions extends ControlOptions {
        items?: Array<Control | HTMLElement>;
        alignItemsTop?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class Modal extends Control {
        static defaultStyle?: ModalStyle;
        modal: HTMLElement;
        header: HTMLDivElement;
        leftHeader: HTMLDivElement;
        rightHeader: HTMLDivElement;
        title: HTMLElement;
        buttonClose: HTMLDivElement;
        buttonFullScreen: HTMLDivElement;
        buttonMinimize: HTMLDivElement;
        body: HTMLDivElement;
        footer: HTMLDivElement;
        leftFooter: HTMLDivElement;
        rightFooter: HTMLDivElement;
        options: ModalOptions;
        onClose: EventHandler<any, CloseModalArgs>;
        onClosed: EventHandler<any, CloseModalArgs>;
        onOpen: EventHandler<any, any>;
        onOpened: EventHandler<any, any>;
        onTitleChanged: EventHandler<Modal, string>;
        protected _minimizedButton: Button;
        static style: string;
        static onCreated: EventHandler<Modal, ModalOptions>;
        constructor(options?: ModalOptions);
        protected _key: string;
        getKey(): string;
        private _currentModalSizeClass;
        setSize(size: ModalSize): void;
        setStyle(style?: ModalStyle): void;
        static startTopZIndex: number;
        private static _minimizedModalToolbar;
        static getMinimizedModalToolbar(): Toolbar;
        static activModals: Modal[];
        private static registerModal;
        private static unRegisterModal;
        static getRegisteredModal(key?: string): Modal;
        private _documentPointerMoveEvent;
        private _documentPointerUpEvent;
        enableMoveAndResize(): void;
        private _previousManualSizingValues;
        private _isFullScreen;
        enableFullScreen(): void;
        disableFullScreen(): void;
        isInFullscreen(): boolean;
        toggleFullScreen(): void;
        passToTop(): void;
        isRegistered(): boolean;
        private _previousBodyOverflow;
        private _isOpen;
        open(args?: any): void;
        close(args?: CloseModalArgs): void;
        minimize(): void;
        maximize(): void;
        isOpen(): boolean;
        setZIndex(zIndex: any): void;
        getZIndex(): number;
        getTitle(): string;
        setTitle(title: string): void;
        startSpin(): void;
        stopSpin(): void;
        bindEvent<TSender, TArgs>(eventHandler: EventHandler<TSender, TArgs>, eventAction: (sender: TSender, args: TArgs) => void): void;
    }
    interface ModalOptions extends ControlOptions {
        parentElement?: HTMLElement;
        size?: ModalSize;
        hasBodyOverflow?: boolean;
        removeOnClose?: boolean;
        openAnimation?: string;
        closeAnimation?: string;
        minimizeAnimation?: string;
        maximizeAnimation?: string;
        canChangeScreenMode?: boolean;
        startFullScreen?: boolean;
        canMinimize?: boolean;
        canClose?: boolean;
        blockBackgroundEvents?: boolean;
        canMoveAndResize?: boolean;
        minModalManualSizingWidth?: number;
        minModalManualSizingHeight?: number;
        canModalManualSizingOverlapBrowserWindow?: boolean;
        backdropColor?: string;
        title?: string;
        style?: ModalStyle | any;
        hasHeader?: boolean;
        hasFooter?: boolean;
        closeOnClickOutside?: boolean;
        onClose?: (modal: NextAdmin.UI.Modal, args: CloseModalArgs) => void;
    }
    enum ModalSize {
        small = 0,
        smallFitContent = 1,
        medium = 2,
        mediumFitContent = 3,
        mediumLarge = 4,
        large = 5,
        ultraLarge = 6
    }
    interface CloseModalArgs {
        cancel?: boolean;
    }
    enum ModalStyle {
        default = 0,
        modern = 1
    }
}
declare namespace NextAdmin.UI {
    class ChangePasswordModal extends NextAdmin.UI.Modal {
        options: ChangePasswordModalOptions;
        constructor(options?: ChangePasswordModalOptions);
    }
    interface ChangePasswordModalOptions extends NextAdmin.UI.ModalOptions {
        userClient?: NextAdmin.Services.UserClient;
    }
}
declare namespace NextAdmin.UI {
    class FormControl extends Control implements IFormControl {
        onValueChanged: EventHandler<IFormControl, ValueChangeEventArgs>;
        static onCreated: EventHandler<FormControl, FormControlOptions>;
        options: FormControlOptions;
        constructor(elementType?: string, options?: FormControlOptions);
        enable(): void;
        disable(): void;
        isEnable(): boolean;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        getLabel(): string;
        setLabel(label: string): void;
        setError(message: string): void;
        displayAsRequired(): void;
        displayAsNotRequired(): void;
        getPrintableElement(options?: any): HTMLElement;
        getDisplayValue(): string;
        protected _dataController?: NextAdmin.Business.DataController_;
        protected _bindedPropertyName?: string;
        /**
         * Should not be called
         * @param dataController
         * @param propertyName
         */
        setDataController(dataController: NextAdmin.Business.DataController_, propertyName: string): void;
        getDataController(): NextAdmin.Business.DataController_;
        getBindedPropertyName(): string;
        protected _propertyInfo: NextAdmin.Business.DataPropertyInfo;
        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo): void;
        getPropertyInfo(): NextAdmin.Business.DataPropertyInfo;
    }
    interface FormControlOptions extends ControlOptions {
        onValueChanged?: (control: FormControl, args: ValueChangeEventArgs) => void;
        value?: any;
        required?: boolean;
        disabled?: boolean;
        propertyInfo?: NextAdmin.Business.DataPropertyInfo;
    }
}
declare namespace NextAdmin.UI {
    class LabelFormControl extends FormControl {
        element: HTMLTableElement;
        label: HTMLLabelElement;
        asterisk: HTMLLabelElement;
        labelContainer: HTMLTableCellElement;
        controlContainer: HTMLTableCellElement;
        options: LabelFormControlOptions;
        static defaultLabelWidth: string;
        static style: string;
        static onCreated: EventHandler<LabelFormControl, LabelFormControlOptions>;
        constructor(options?: LabelFormControlOptions);
        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo): void;
        setLabelWidth(width: string): void;
        /**
       * Add addon at the right of the control
       * @param addon
       */
        addRightAddon<TAddon extends string | HTMLElement | Control | FormControlAddon>(addon: TAddon): TAddon;
        /**
         * Add addon at the left of the input
         * @param addon
         */
        addLeftAddon<TAddon extends string | HTMLElement | Control | FormControlAddon>(addon: TAddon): TAddon;
        private appendAddonCell;
        getFormControlAddon(addon: FormControlAddon): NextAdmin.UI.Control;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        setLabel(text: string): LabelFormControl;
        getLabel(): string;
        private _errorMessage;
        setError(message?: string): void;
        private _tooltipMessage;
        setTooltip(message?: string): void;
        displayAsRequired(): void;
        displayAsNotRequired(): void;
        protected _disabled: boolean;
        isEnable(): boolean;
        enable(): void;
        disable(): void;
        getToolTip(): string;
    }
    interface LabelFormControlOptions extends FormControlOptions {
        label?: string;
        labelPosition?: FormControlLabelPosition;
        labelWidth?: string;
        leftAddons?: Array<string | HTMLElement | Control | FormControlAddon>;
        rightAddons?: Array<string | HTMLElement | Control | FormControlAddon>;
    }
    enum FormControlAddon {
        clipboardCopy = 1
    }
    enum FormControlLabelPosition {
        left = "left",
        top = "top",
        hidden = "hidden"
    }
}
declare namespace NextAdmin.UI {
    class Input extends LabelFormControl {
        static defaultStyle?: InputStyle;
        input: HTMLInputElement;
        options: InputOptions;
        static style: string;
        static onCreated: EventHandler<Input, InputOptions>;
        constructor(options?: InputOptions);
        setStyle(style?: InputStyle): void;
        setSize(size?: InputSize): void;
        displayAsRequired(): void;
        displayAsNotRequired(): void;
        setError(message?: string): void;
        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo): void;
        setPlaceholder(text: string): Input;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        enable(): void;
        disable(): void;
    }
    interface InputOptions extends LabelFormControlOptions {
        inputType?: InputType;
        decimalCount?: number;
        placeholder?: string;
        style?: InputStyle | any;
        size?: InputSize;
        inlineGrid?: boolean;
        outputNullIfEmpty?: boolean;
    }
    enum InputType {
        button = "button",
        checkbox = "checkbox",
        color = "color",
        date = "date",
        datetimeLocal = "datetime-local",
        email = "email",
        file = "file",
        hidden = "hidden",
        image = "image",
        month = "month",
        number = "number",
        password = "password",
        radio = "radio",
        range = "range",
        reset = "reset",
        search = "search",
        submit = "submit",
        tel = "tel",
        text = "text",
        time = "time",
        url = "url",
        week = "week"
    }
    enum InputStyle {
        default = 0,
        modern = 1,
        noBackground = 2
    }
    enum InputSize {
        medium = 0,
        large = 1,
        ultraLarge = 2
    }
}
declare namespace NextAdmin.UI {
    class Checkbox extends Input {
        constructor(options?: InputOptions);
        getValue(): boolean;
        isChecked(): boolean;
    }
}
declare namespace NextAdmin.UI {
    class Collapsible extends Control {
        header: HTMLDivElement;
        title: HTMLElement;
        caret: HTMLElement;
        collapsableContainer: HTMLDivElement;
        body: HTMLDivElement;
        options: CollapsibleOptions;
        onOpen: EventHandlerBase;
        onClose: EventHandlerBase;
        private _isOpen;
        private _isAnimating;
        static style: string;
        constructor(options?: CollapsibleOptions);
        toggle(): Promise<void>;
        open(animate?: boolean): Promise<void>;
        close(): Promise<void>;
        setContent(content?: string | Control | HTMLElement): void;
    }
    interface CollapsibleOptions extends ControlOptions {
        title?: string;
        content?: string | Control | HTMLElement;
        isOpen?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class CollapsibleFilter<T> extends NextAdmin.UI.Control {
        options: CollapsibleFilterOptions;
        collapsible: Collapsible;
        formLayout: FormLayout_;
        grid: DataGrid<T>;
        timer: Timer;
        constructor(options?: CollapsibleFilterOptions);
        addView(viewName: string, items?: Array<FormLayoutViewItem>, active?: boolean): FormLayoutView;
        addItem<TElement extends Control | HTMLElement>(item: FormLayoutControlItem<TElement>): TElement;
        updateSearch(throttle?: number): void;
        updateQuery(queryBuilder: Business.QueryBuilder): Business.QueryBuilder;
    }
    interface CollapsibleFilterOptions extends ControlOptions {
        throttle?: number;
        grid?: DataGrid_;
        items?: Array<FormLayoutControlItem<any>>;
        title?: string;
        isOpen?: boolean;
        onUpdateQuery?: (queryBuilder: Business.QueryBuilder) => Business.QueryBuilder;
        autoUdateSearch?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class Container extends Control {
        options: ContainerOptions;
        body?: HTMLDivElement;
        constructor(options?: ContainerOptions);
    }
    interface ContainerOptions extends ControlOptions {
        maxWidth?: string;
    }
}
declare namespace NextAdmin.UI {
    class DataForm extends Control implements IForm {
        saveButton: Button;
        deleteButton: Button;
        cancelButton: Button;
        footerToolBar: Toolbar;
        dataController: NextAdmin.Business.DataController_;
        header: HTMLDivElement;
        body: HTMLDivElement;
        footer: HTMLDivElement;
        options: FormOptions;
        static style: string;
        constructor(options?: FormOptions);
        enableReadOnly(): void;
        disableReadOnly(): void;
    }
    interface FormOptions extends ControlOptions {
        dataController?: NextAdmin.Business.DataController_;
        label?: string;
        dataName?: string;
        dataPrimaryKey?: any;
    }
}
declare namespace NextAdmin.UI {
    class DataFormModal<T> extends Modal implements IForm {
        rightFooterToolBar: Toolbar;
        footerCloseButton: Button;
        saveButton: Button;
        deleteButton: Button;
        cancelButton: Button;
        validateButton: NextAdmin.UI.Button;
        options: DataFormModalOptions;
        dataController: NextAdmin.Business.DataController<T>;
        onValidate: EventHandler<DataFormModal<T>, T>;
        onEndOpen: EventHandler<DataFormModal<T>, T>;
        onInitialize: AsyncEventHandler<DataFormModal<T>, InitializeArgs<T>>;
        originalData?: T;
        static Style: string;
        static onCreated: EventHandler<DataFormModal_, DataFormModalOptions>;
        static formModalByDataNameFactory?: (dataName: string, options?: DataFormModalOptions) => DataFormModal_;
        static createUnique<TFormModal extends DataFormModal_>(className: string, options?: DataFormModalOptions): TFormModal;
        static createUniqueByDataName<TFormModal extends DataFormModal_>(dataName: string, options?: DataFormModalOptions): TFormModal;
        static getUnique<TFormModal extends DataFormModal_>(formModal: TFormModal, formModalDataPrimaryKey?: string): TFormModal;
        constructor(options: DataFormModalOptions);
        validate(): Promise<boolean>;
        computeKey(dataPrimaryKey: any): string;
        getKey(): string;
        open(openArgs?: FormModalOpenArgs<T>): Promise<void>;
        protected initialize(data: T, dataState?: Business.DataState): Promise<void>;
        protected beforeSave(args?: Business.SaveDataEventArgs): Promise<void>;
        close(args?: CloseFormModalArgs): void;
        enableReadOnly(): void;
        disableReadOnly(): void;
        getData(): T;
        getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string;
    }
    class DataFormModal_ extends DataFormModal<any> {
    }
    interface DataFormModalOptions extends ModalOptions, FormOptions {
        dataName?: string;
        dataPrimaryKey?: any;
        isDetailFormModal?: boolean;
        isRequiredFieldPreCheckEnabled?: boolean;
        hasValidateButton?: boolean;
        hasFooterCloseButton?: boolean;
        canSave?: boolean;
        canDelete?: boolean;
        canCancel?: boolean;
        onDataSaved?: (sender: DataFormModal_, args: NextAdmin.Business.SaveDataResult) => void;
        onDataDeleted?: (sender: DataFormModal_, data: any) => void;
        onInitialize?: (sender: DataFormModal_, args: InitializeArgs_) => void;
    }
    interface FormModalOpenArgs<T> {
        data?: T;
        dataState?: NextAdmin.Business.DataState;
        dataPrimaryKey?: any;
        appendNewData?: boolean;
        onDataLoaded?: (data: T) => void;
    }
    interface FormModalOpenArgs_ extends FormModalOpenArgs<any> {
    }
    interface CloseFormModalArgs extends CloseModalArgs {
        chackDataState?: boolean;
    }
    interface InitializeArgs_ {
        data: any;
        dataState: Business.DataState;
    }
    interface InitializeArgs<T> {
        data: T;
        dataState: Business.DataState;
    }
}
declare namespace NextAdmin.UI {
    class FormLayout<T> extends NextAdmin.UI.Control {
        static defaultViewName: string;
        options: FormLayoutOptions;
        table: HTMLTableElement;
        firstRow: HTMLTableRowElement;
        rows: HTMLTableRowElement[];
        onDrowCell: EventHandler<FormLayout_, {
            cell: HTMLTableCellElement;
            options: FormLayoutItem;
            control: Control;
        }>;
        dataController?: NextAdmin.Business.DataController<T>;
        protected _columnCount: number;
        protected _rowCount: number;
        protected _controlsDictionary: Dictionary<HTMLElement | Control>;
        protected _itemsDictionary: Dictionary<FormLayoutItem>;
        protected _cellsDictionary: Dictionary<HTMLTableCellElement>;
        protected _viewsDictionary: Dictionary<FormLayoutView>;
        protected _activeViewName?: string;
        static style: string;
        constructor(options?: FormLayoutOptions);
        setStyle(style?: FormLayoutStyle): void;
        initialize(colCount: number, rowCount: number, items?: Array<FormLayoutItem>): void;
        getView(viewName: string): FormLayoutView;
        addView(viewName: string, items?: Array<FormLayoutViewItem>, active?: boolean): FormLayoutView;
        addViewItems(viewName: string, items?: Array<FormLayoutViewItem>): FormLayoutView;
        addViewItem(viewName: string, item: FormLayoutViewItem): FormLayoutView;
        setActiveView(viewName: string): void;
        getActiveView(): FormLayoutView;
        enableResponsiveMode(getActivViewFunc: (formLayout: FormLayout_) => string): void;
        setColumnCount(columnCount: number): void;
        setRowCount(rowCount: number): void;
        setColumnWidth(columnIndex: number, width: string): void;
        addItem<TElement extends Control | HTMLElement>(item: FormLayoutControlItem<TElement>): TElement;
        removeItemByPosition(col: number, row: number): void;
        removeItem(itemId: string, tryDispose?: boolean): void;
        moveItem(itemId: string, targetCol: number, targetRow: number, disposeTargetPositionControl?: boolean): void;
        setFormControlPosition(property: string, col: number, row: number): void;
        clear(): void;
        getItems(): FormLayoutItem[];
        getItem(id?: string): FormLayoutItem;
        getControl(id?: string): Control | HTMLElement;
        getControlByPosition(col: number, row: number): NextAdmin.UI.Control;
        getFormControlItem(property: ((dataDef: T) => any) | string): FormLayoutItem;
        getItemByPosition(col: number, row: number): FormLayoutItem;
        getPrintableElement(options?: any): HTMLTableElement;
        getControls(): Array<NextAdmin.UI.Control>;
        getFormControls(): Array<NextAdmin.UI.Control>;
        unbindControls(): void;
        bindControls(updateControlValueFromData?: boolean): void;
        getRow(rowIndex: number): HTMLTableRowElement;
        getCell(col: number, row: number): HTMLTableCellElement;
        getCells(): Array<HTMLTableCellElement>;
        getRowCount(): number;
        getColumnCount(): number;
    }
    class FormLayout_ extends FormLayout<any> {
    }
    interface FormLayoutOptions extends ControlOptions {
        columnCount?: number;
        rowCount?: number;
        items?: FormLayoutItem[];
        dataController?: NextAdmin.Business.DataController_;
        style?: FormLayoutStyle;
        isResponsive?: boolean;
    }
    enum FormLayoutStyle {
        thinLabels = 0
    }
    interface FormLayoutViewItem {
        id?: string;
        col: number;
        row: number;
        colSpan?: number;
        rowSpan?: number;
        labelWidth?: string;
    }
    interface FormLayoutItem extends FormLayoutViewItem {
        html?: string;
        useDefaultControl?: boolean;
        propertyName?: string;
        controlType?: string;
        controlOption?: {};
        control?: IControl | HTMLElement;
        configAction?: (control: IControl | Element) => void;
    }
    interface FormLayoutView {
        name: string;
        items?: Array<FormLayoutViewItem>;
    }
    interface FormLayoutControlItem<TControl extends Control | HTMLElement> extends FormLayoutItem {
        control?: TControl;
        configAction?: (control: TControl) => void;
    }
}
declare namespace NextAdmin.UI {
    export class DataGrid<T> extends FormControl {
        static defaultStyle?: TableStyle;
        columns: DataGridColumn[];
        actionColumn: DataGridColumn;
        rows: DataGridRow<T>[];
        rowDictionary: {};
        onRenderCell: EventHandler<DataGridCell<T>, any>;
        onRenderRow: EventHandler<DataGrid_, DataGridRow<T>>;
        onSelectedRowsChanged: EventHandler<DataGrid_, DataGridRow<T>[]>;
        onRowSelected: EventHandler<DataGrid_, DataGridRow<T>>;
        onRowUnselected: EventHandler<DataGrid_, DataGridRow<T>>;
        onRowRemoved: EventHandler<DataGrid_, DataGridRow<T>>;
        onRowAdded: EventHandler<DataGrid_, DataGridRow<T>>;
        onAddingData: EventHandler<DataGrid_, {
            data: any;
            state: Business.DataState;
        }>;
        onRemovingData: EventHandler<DataGrid_, {
            cancel?: boolean;
            data: any;
        }>;
        onAddingDataset: EventHandler<DataGrid_, any[]>;
        onLoading: EventHandler<DataGrid_, any[]>;
        onSaving: EventHandler<DataGrid_, any[]>;
        onValueChanged: EventHandler<DataGrid_, ValueChangeEventArgs>;
        onFormModalCreated: EventHandler<DataFormModal_, any>;
        onDatasetChanged: EventHandler<DataGrid_, any[]>;
        onViewsUpdated: EventHandler<DataGrid_, GridViewOptions[]>;
        onUpdateWhereQuery: EventHandler<DataGrid_, Business.QueryBuilder>;
        onViewChanged: EventHandler<DataGrid_, GridViewOptions>;
        onDoubleClickRow: EventHandler<DataGridRow_, MouseEvent>;
        onOpenContextMenu: EventHandler<DataGrid_, OpenContextMenuArgs>;
        onFilterValueChanged: EventHandler<DataGrid_, {
            filterName?: string;
            filter?: FormControl;
            changeArgs: ValueChangeEventArgs;
        }>;
        onColumnOrderChanged: EventHandler<DataGridColumn, ColumnOrdering>;
        onColumnFilterSearchValueChanged: EventHandler<DataGridColumn, string>;
        onColumnFilterSelectedValuesChanged: EventHandler<DataGridColumn, any[]>;
        currentDraggingRow?: DataGridRow<T>;
        currentHovredRow?: DataGridRow<T>;
        headerRow: HTMLTableRowElement;
        tHead: HTMLTableSectionElement;
        tFoot: HTMLTableSectionElement;
        tBody: HTMLTableSectionElement;
        table: HTMLTableElement;
        tableContainer: HTMLDivElement;
        layout: FlexLayout;
        leftHeader: HTMLDivElement;
        rightHeader: HTMLDivElement;
        topBar: HTMLDivElement;
        bottomBar: HTMLDivElement;
        stretchContainer: HTMLDivElement;
        toolBar: Toolbar;
        buttonAdd: Button;
        buttonSave: Button;
        actionMenuDropDownButton: DropDownButton;
        buttonMultiDelete: Button;
        buttonRefresh: Button;
        searchBox: Input;
        viewSelect: Select;
        exportButton: Button;
        generateReportButton: DropDownButton;
        filtersContainer: HTMLDivElement;
        viewFiltersLayout: CollapsibleFilter<T>;
        options: DataGridOptions_;
        datasetController?: Business.DatasetController<T>;
        noDataMessageContainer: HTMLElement;
        emptyArea: HTMLDivElement;
        protected _masterFormController: Business.DataController_;
        protected _currentView: GridViewOptions;
        protected _foreignKeyName?: string;
        protected _suspendUpdateDataFromDataController?: boolean;
        static onCreated: EventHandler<DataGrid_, DataGridOptions_>;
        static onCreating: EventHandler<DataGrid_, DataGridOptions_>;
        static style: string;
        constructor(options?: DataGridOptions<T>);
        openData(row: DataGridRow<T>): void;
        appendData(): Promise<T>;
        load(options?: DataGridLoadOptions): Promise<Array<T>>;
        isMultiDeleteEnabled(): boolean;
        isMultiSelectEnabled(): boolean;
        hasDragAndDropEnabled(): boolean;
        protected initilizeDragAndDrop(): void;
        protected startDragRow(row: DataGridRow_): void;
        protected dragRow(pointerX: number, pointerY: number): void;
        protected dropRow(): void;
        /**
         * Return all rows in tbody
         * @returns
         */
        getRows(): Array<DataGridRow<T>>;
        /**
         * Return only rows binded to data
         * @returns
         */
        getDataRows(): Array<DataGridRow<T>>;
        setStyle(style?: TableStyle): void;
        refreshSelectView(): void;
        deleteRows(rows: Array<DataGridRow<T>>): void;
        initializeViews(): void;
        protected _disabled: boolean;
        disable(): void;
        enable(): void;
        isEnable(): boolean;
        setView(view?: GridViewOptions, load?: boolean): void;
        getFilter(filterName?: string): FormControl;
        getFilters(): Array<{
            filterName?: string;
            filter: FormControl;
        }>;
        getColumn(columnName?: string): DataGridColumn;
        updateWhereQuery(view?: GridViewOptions): void;
        getCurrentView(): GridViewOptions;
        setViewById(viewId: string, load?: boolean): void;
        setError(errors: string | Array<NextAdmin.Business.DataError>): void;
        private enableSearch;
        setSearchValue(searchValue?: string, load?: boolean): void;
        setDataController(dataController: NextAdmin.Business.DataController_, propertyName: string): void;
        /**
         * This function is used to synchronize grid with master form, and perform separated data loading
         * @param masterController
         * @param detailForeignKey
         * @param masterPrimaryKey
         */
        bindToMasterController(masterController: NextAdmin.Business.DataController_, detailForeignKey: string, masterPrimaryKey?: string): void;
        bindToTab(tab: Tab, masterController: NextAdmin.Business.DataController_, detailForeignKey: string, masterPrimaryKey?: string): void;
        private _createdModals;
        createModal(data?: any): DataFormModal_;
        addColumn(options: DataGridColumnOptions_): DataGridColumn;
        private addActionColumn;
        getRowOrderPropertyName(): string;
        addDataItem(data: any, state?: NextAdmin.Business.DataState, fireChange?: boolean): DataGridRow_;
        insertDataItem(data: any, previousRow: DataGridRow_, state?: Business.DataState, fireChange?: boolean): DataGridRow_;
        addDataset(dataSet: Array<any>, state?: Business.DataState, fireChange?: boolean): Array<DataGridRow_>;
        setDataset(dataSet: Array<any>, state?: Business.DataState, tryPreserveSelectionAndScroll?: boolean, fireChange?: boolean): void;
        private _previousScrollTop;
        protected enableScrollLoading(): void;
        removeRows(rows: Array<DataGridRow_>, fireChange?: boolean): void;
        removeRow(row: DataGridRow_, fireChange?: boolean): void;
        removeRowById(rowId: string, fireChange?: boolean): void;
        getRowById(rowId: string): DataGridRow_;
        getRowByData(data: any): DataGridRow_;
        /**
         * Require to be binded to datasetform
         * @param dataId
         */
        getRowByDataId(dataId: any): DataGridRow_;
        getDataset(): Array<T>;
        createActionColumnCellToolbar(cellControl: DataGridCell_, options?: ActionToolbarOptions): Toolbar;
        downRow(row: DataGridRow_): void;
        upRow(row: DataGridRow_): void;
        getMaxRowOrder(): number;
        getMinRowOrder(): number;
        updateRowsOrder(): void;
        clear(fireChange?: boolean): void;
        selectRow(row: DataGridRow_, dispatch?: boolean): void;
        rowDoubleClicked(row: DataGridRow_, e: MouseEvent): void;
        openContextMenu(e: MouseEvent): OpenContextMenuArgs;
        getSelectedDataRows(): Array<DataGridRow<T>>;
        getSelectedRows(): Array<DataGridRow<T>>;
        unselectRow(row: DataGridRow_, dispatch?: boolean): void;
        unselectRows(dispatch?: boolean, rows?: Array<DataGridRow_>): void;
        private _orderingColumnInfo;
        orderBy(column?: DataGridColumn, ordering?: ColumnOrdering, load?: boolean): void;
        updateLocalRowsOrder(): void;
        getOrderingColumnInfo(): OrderingColumnInfo;
        reRender(): void;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): T[];
        private _suspendChanging;
        fireChange(): void;
        exportData(options?: DataGridExportOptions): void;
        getFullDataset(response: (dataset: Array<any>) => void, loadAllColumns?: boolean, loadSelectedRow?: boolean): void;
        print(options?: DataGridPrintOptions): void;
        getPrintableElement(options?: DataGridPrintOptions): HTMLElement;
        getPropertyName(dataDefPropertyAction: (dataDef: T) => any): string;
    }
    export class DataGrid_ extends DataGrid<any> {
    }
    class DataGridColumn {
        grid: DataGrid_;
        headerColumnCell: HTMLTableHeaderCellElement;
        headerColumnCaptionElement: HTMLSpanElement;
        headerColumnOrderInfoElement: HTMLSpanElement;
        headerColumnSearchFilter: NextAdmin.UI.DropDownButton;
        headerColumnToolbar: NextAdmin.UI.Toolbar;
        searchBox?: NextAdmin.UI.Input;
        searchGrid?: DataGrid_;
        options: DataGridColumnOptions_;
        cells: DataGridCell_[];
        isActionColumn: boolean;
        filterQuery?: string;
        filterArgs?: Array<any>;
        timer: NextAdmin.Timer;
        constructor(grid: DataGrid_, th: HTMLTableHeaderCellElement, options: DataGridColumnOptions_);
        getDropDownSearchFilter(): NextAdmin.UI.DropDownButton;
        getNumberSearchFilter(): NextAdmin.UI.DropDownButton;
        getEnumSearchFilter(): NextAdmin.UI.DropDownButton;
        getDateSearchFilter(): NextAdmin.UI.DropDownButton;
        getTextSearchFilter(): NextAdmin.UI.DropDownButton;
        setSearchValue(value?: string, fireLoad?: boolean): void;
        setFilteredValues(selectValues: Array<any>): void;
        updateHeaderColor(): void;
        private _propertyInfo;
        tryGetPropertyInfo(): NextAdmin.Business.DataPropertyInfo;
        isSearchable(): boolean;
        isOrderable(): boolean;
        isQueryble(): boolean;
    }
    export class DataGridRow<T> extends Control {
        data: T;
        element: HTMLTableRowElement;
        grid: DataGrid<T>;
        cells: DataGridCell_[];
        cellActionToolbar: DataGridCell<T>;
        rowId: string;
        private _selected;
        constructor(grid: DataGrid_);
        select(addSelectStyle?: boolean): void;
        unselect(removeSelectStyle?: boolean): void;
        isSelected(): boolean;
        setData(data: any, fireChange?: boolean): void;
        setDataPropertyValue(dataDefPropertyAction: (dataDef: T) => any, value?: any, fireChange?: boolean): void;
        getControl(propertyName: string): UI.FormControl;
        getDataPKValue(): any;
        getCellByIndex(index: number): DataGridCell_;
        getCellByPropertyName(name: string): DataGridCell_;
    }
    export class DataGridRow_ extends DataGridRow<any> {
    }
    export class DataGridCell<T> extends Control {
        value: any;
        control?: FormControl;
        grid: DataGrid<T>;
        column: DataGridColumn;
        row: DataGridRow<T>;
        element: HTMLTableCellElement;
        propertyInfo: NextAdmin.Business.DataPropertyInfo;
        constructor(grid: DataGrid_, column: DataGridColumn, row: DataGridRow_);
        initControl(): void;
        setFormControl(control: FormControl): void;
        setValue(value: any, updateData?: boolean): void;
        setData(value: any): void;
        getValue(): any;
    }
    export class DataGridCell_ extends DataGridCell<any> {
    }
    export class ExportModal extends Modal {
        constructor(grid: DataGrid_);
    }
    export class FilterGridLayout extends FormLayout_ {
        dataInfos: Array<NextAdmin.Business.DataInfo>;
        startConfiguration(grid: DataGrid_, onChanged?: () => void): void;
    }
    export interface DeletingArgs {
        rowHandler: any;
    }
    export interface DataGridOptions<T> extends TableOptions, FormControlOptions {
        rowsBordered?: boolean;
        columnsBordered?: boolean;
        deleteMode?: DataDeleteMode;
        orderingMode?: DataOrderingMode;
        searchMode?: DataSearchMode;
        loadingMode?: DataLoadingMode;
        reorderingRowMode?: DataGridReorderingRowMode;
        additionalSearchProperties?: string[];
        orderPropertyName?: string;
        synchronizeDataWithFormModal?: boolean;
        formModalFactory?: (dataName: string, options?: DataFormModalOptions, data?: T) => DataFormModal_;
        /** if set to true, use row data instead of load data from server */
        openFormModalWithRowData?: boolean;
        datasetController?: NextAdmin.Business.DatasetController_;
        dataName?: string;
        selectDataPrimaryKey?: boolean;
        /** enable scroll loading, require datasetform and maxBody height*/
        paginItemCount?: number;
        columns?: DataGridColumnOption<T>[];
        hasActionColumn?: boolean;
        actionColumnWidth?: string;
        renderActionColumnCell?: (cell: DataGridCell<T>) => void;
        page?: Page;
        canSave?: boolean;
        canRefresh?: boolean;
        canAdd?: boolean;
        hasActionMenu?: boolean;
        hasTopBar?: boolean;
        hasHeader?: boolean;
        actionMenuItems?: MenuItem[];
        canExport?: boolean;
        canPrint?: boolean;
        canEdit?: boolean;
        enableDoubleClickOpenModal?: boolean;
        /** VIEWS */
        canSelectView?: boolean;
        canDiscoverSchema?: boolean;
        defaultViewId?: string;
        views?: GridViewOptions[];
        reports?: DataGridReportOptions[];
        openAction?: (row: DataGridRow<T>) => void;
        refreshAction?: (grid: DataGrid<T>) => void;
        addAction?: (grid: DataGrid<T>) => void;
        deleteAction?: (grid: DataGrid<T>, rows: Array<DataGridRow<T>>) => void;
        hasContextMenu?: boolean;
        onOpenContextMenu?: (grid: DataGrid<T>, args: OpenContextMenuArgs) => void;
        onFormModalCreated?: (grid: DataGrid<T>, args: {
            modal: DataFormModal_;
            data: any;
        }) => void;
        onSelectedRowsChanged?: (grid: DataGrid<T>, args: DataGridRow<T>[]) => void;
        onUpdateWhereQuery?: (grid: DataGrid<T>, args: Business.QueryBuilder) => void;
        style?: TableStyle | any;
        displayNoDataMessage?: boolean;
        minHeight?: string;
        isAutoLoaded?: boolean;
        buttonAddText?: string;
    }
    export interface DataGridOptions_ extends DataGridOptions<any> {
    }
    export interface DataGridViewColumnOptions {
        label?: string;
        propertyName?: string;
        selectQuery?: string;
        useDefaultControl?: boolean;
        width?: string;
        maxWidth?: string;
        minWidth?: string;
        cellCss?: CssDeclaration;
        headerCss?: CssDeclaration;
        toolTip?: string;
        defaultOrdering?: ColumnOrdering;
        queryable?: boolean;
        hidden?: boolean;
        searchable?: boolean;
        customDrawCellScript?: string;
        /** Allow user to change row order */
        orderable?: boolean;
    }
    export interface DataGridColumnOption<T> extends DataGridViewColumnOptions {
        controlFactory?: (cell: DataGridCell<T>) => FormControl;
        onRenderCell?: (cell: DataGridCell<T>, value: any) => string | Control | HTMLElement | void;
        orderingFunc?: (rowData: T, dataset: Array<T>) => number | string;
    }
    export interface DataGridColumnOptions_ extends DataGridColumnOption<any> {
    }
    export interface ActionToolbarOptions {
        hasDeleteButton?: boolean;
        hasOrderingButtons?: boolean;
        hasOpenModalButton?: boolean;
        hasDragAndDropHandle?: boolean;
    }
    export interface GridViewOptions {
        name: string;
        id: string;
        displayOrder?: number;
        isUserView?: boolean;
        orderPropertyName?: string;
        columns: DataGridViewColumnOptions[];
        filters?: FormLayoutItem[];
        filterQuery?: string;
        filterQueryValues?: any[];
    }
    export enum ColumnOrdering {
        ascending = 0,
        descending = 1
    }
    export interface OrderingColumnInfo {
        column: DataGridColumn;
        ordering: ColumnOrdering;
    }
    export enum DataDeleteMode {
        disabled = 0,
        local = 1,
        server = 2
    }
    export enum DataOrderingMode {
        disabled = 0,
        local = 1,
        server = 2
    }
    export enum DataSearchMode {
        disabled = 0,
        local = 1,
        server = 2
    }
    export enum DataLoadingMode {
        disabled = 0,
        query = 1,
        rawData = 2
    }
    export enum DataGridReorderingRowMode {
        buttons = 0,
        dragAndDropHandle = 1,
        all = 2
    }
    export interface DataGridExportOptions {
        exportFormat?: string;
        exportSelectedDataOnly?: boolean;
        exportVisibleColumnOnly?: boolean;
        exportColumnsDisplayNames?: boolean;
        exportFormatedValues?: boolean;
    }
    export interface DataGridPrintOptions {
        dataset?: Array<any>;
        useControlDisplayValue?: boolean;
    }
    export interface DataGridReportOptions {
        label: string;
        action?: (grid: DataGrid_, dataPrimaryKeys: any[]) => void;
    }
    export interface OpenContextMenuArgs {
        selectedDataRows: DataGridRow_[];
        selectedRows: DataGridRow_[];
        event: MouseEvent;
        dropDownMenu: DropDownMenu;
        isOnlyDataRowSelected: boolean;
    }
    export interface DataGridLoadOptions {
        updateOnlyIfDataChanged?: boolean;
        tryPreserveSelectionAndScroll?: boolean;
        updateQuery?: boolean;
        fireChange?: boolean;
        onPreparDataset?: (dataset?: Array<any>) => Array<any>;
    }
    export {};
}
declare namespace NextAdmin.UI {
    class InputSelect extends Input {
        dropDown: HTMLDivElement;
        openDropDownButton: Button;
        dropDownTable: Table;
        onDropdownOpening: EventHandler<InputSelect, DropDownOpeningArgs>;
        onDropdownOpen: EventHandler<InputSelect, HTMLElement>;
        onDropdownClose: EventHandler<InputSelect, HTMLElement>;
        options: InputSelectOptions;
        timer: Timer;
        protected _selectedItem: HTMLTableRowElement;
        protected _customValueItem: HTMLTableRowElement;
        static style: string;
        static onCreated: EventHandler<InputSelect, InputSelectOptions>;
        constructor(options?: InputSelectOptions);
        private _onClickOutside;
        toggleDropDown(): void;
        getItemValue(rowElement: HTMLTableRowElement): any;
        getItem(value: any): HTMLTableRowElement;
        protected onInputKeyDown(event: KeyboardEvent): void;
        selectItem(value: any): void;
        cancelSelect(): void;
        onInputValueChanging(val: string): void;
        load(endSearchAction?: (searchResult: Array<SelectItem>) => void): void;
        distantSearch(searchValue: string, endSearchAction?: (searchResult: Array<SelectItem>) => void): void;
        localSearch(searchValue: string): void;
        openDropDown(): void;
        closeDropDown(): void;
        getItems(): Array<HTMLTableRowElement>;
        getFilteredItems(): Array<HTMLTableRowElement>;
        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo): void;
        addSelectItems(items: SelectItem[]): void;
        setSelectItems(items: SelectItem[]): void;
        addSelectItem(item: SelectItem): void;
        removeItem(rowElement: HTMLTableRowElement): void;
        getItemsValues(): Array<string>;
        addItem(value: string | number, label?: any, selected?: boolean): HTMLTableRowElement;
        addItems<T>(dataset: Array<T>, captionFunc: (data: T) => string, valueFunc?: (data: T) => string): Array<HTMLTableRowElement>;
        setItems<T>(dataset: Array<T>, captionFunc: (data: T) => string, valueFunc?: (data: T) => string): Array<HTMLTableRowElement>;
        clearAll(): void;
        clearItems(): void;
        protected updateValue(value: any): void;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        Enable(): void;
        Disable(): void;
        startSpin(): void;
        stopSpin(): void;
    }
    interface InputSelectOptions extends InputOptions, SelectOptions {
        canAddCustomValue?: boolean;
        canSearchData?: boolean;
        searchAction?: (searchValue: string, searchResultAction: (searchResult: Array<SelectItem>) => void) => void;
        maxDropDownHeight?: string;
        displayDropdownButton?: boolean;
        autoFill?: boolean;
        resetSearchAtOpen?: boolean;
        usePerfectScrollbar?: boolean;
        localOrdering?: boolean;
        throttle?: number;
        size?: InputSize;
        onDropdownOpen?: (sender: InputSelect, args: HTMLElement) => void;
    }
    interface DropDownOpeningArgs {
        dropDown: HTMLElement;
        cancel?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class DataSelect extends InputSelect {
        dropDownMenuButton?: DropDownButton;
        options: DataSelectOptions;
        static onCreated: EventHandler<DataSelect, DataSelectOptions>;
        datasetController: NextAdmin.Business.DatasetController_;
        constructor(options?: DataSelectOptions);
        protected onOpeningDropdownMenu(args: OpeningDropDownArgs): void;
        deleteData(dataPrimaryKey?: string, displayError?: boolean): Promise<void>;
        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo): void;
        setValue(value: any, fireChange?: boolean): void;
        getItemValueData<TData>(itemValue?: any): Promise<TData>;
        getDisplayValue(): string;
        disable(): void;
        enable(): void;
    }
    interface DataSelectOptions extends InputSelectOptions {
        datasetController?: NextAdmin.Business.DatasetController_;
        dataName?: string;
        displayPropertiesNames?: string[];
        itemDisplayValueFunc?: (item: any) => string;
        searchPropertiesNames?: string[];
        previewValueFunc?: (value: string) => string;
        formModalFactory?: (dataName: string, modalOption?: NextAdmin.UI.DataFormModalOptions) => DataFormModal_;
        allowNullValue?: boolean;
        searchItemsCount?: number;
        orderBy?: Array<{
            name: string;
            desc?: boolean;
        }>;
        canAddData?: boolean;
        canEditData?: boolean;
        hasDropDownMenu?: boolean;
        onStartLoadData?: (sender: DataSelect) => void;
    }
}
declare namespace NextAdmin.UI {
    class DropDownButton extends Button {
        options: DropDownButtonOptions;
        dropDown: DropDownMenu;
        static onCreated: EventHandler<DropDownButton, DropDownButtonOptions>;
        dropDownPosition: DropDownPosition;
        constructor(options?: DropDownButtonOptions);
        openOnHover(): void;
        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement;
        addItem(dropDownItem: MenuItem): Button;
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement;
        prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        getItems(): (HTMLElement | Control)[];
        clearItems(): void;
        addItems(itms: MenuItem[]): DropDownButton;
        toggleDropDown(): void;
        isDropDownOpen(): boolean;
        openDropDown(): void;
        setDropDownPosition(position: DropDownPosition): void;
        closeDropDown(): void;
    }
    interface DropDownButtonOptions extends ButtonOptions {
        items?: Array<MenuItem | Button | HTMLElement>;
        dropDownWidth?: string;
        maxDropDownHeight?: string;
        dropDownPosition?: DropDownPosition;
        openOnHover?: boolean;
        dropDownParentContainer?: HTMLElement;
        onOpeningDropDown?: (dropDown: DropDownButton, args: OpeningDropDownArgs) => void;
    }
    interface MenuItem {
        text?: string;
        action?: (menu: Control, button: Button) => void;
    }
    interface OpeningDropDownArgs {
        dropDown: DropDownMenu;
        cancel?: boolean;
    }
    enum DropDownPosition {
        downRight = 0,
        downLeft = 1,
        upRight = 2,
        upLeft = 3,
        down = 4,
        up = 5
    }
}
declare namespace NextAdmin.UI {
    class DropDownMenu extends Control {
        options: DropDownMenuOptions;
        dropDownButton: Button;
        static onCreated: EventHandler<DropDownMenu, DropDownButtonOptions>;
        static style: string;
        onOpen: EventHandler<DropDownMenu, HTMLElement>;
        onClose: EventHandler<DropDownMenu, HTMLElement>;
        protected items: (HTMLElement | Control)[];
        constructor(options?: DropDownMenuOptions);
        closeOnClickOutside: boolean;
        private _onClickOutside;
        addItem(dropDownItem: MenuItem): Button;
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement;
        getItems(): (HTMLElement | Control)[];
        protected applyButtonItemStyle(buttonItem: Button): void;
        clearItems(): void;
        addItems(itms: MenuItem[]): DropDownMenu;
        isOpen(): boolean;
        private _hasRegisteredEventOnClickOutside;
        open(x: string, y: string): void;
        close(): void;
    }
    interface DropDownMenuOptions extends ButtonOptions {
        items?: Array<MenuItem | Button | HTMLElement>;
        dropDownWidth?: string;
        maxDropDownHeight?: string;
        parentContainer?: HTMLElement;
    }
}
declare namespace NextAdmin.UI {
    class FlexLayout extends Control {
        static style: string;
        options: FlexLayoutOptions;
        constructor(options?: FlexLayoutOptions);
        setDirection(direction: FlexLayoutDirection): void;
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        appendControlStretch<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        appendHTMLStretch<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        prependControlStretch<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        prependHTMLStretch<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
    }
    interface FlexLayoutOptions extends ControlOptions {
        direction?: FlexLayoutDirection;
    }
    enum FlexLayoutDirection {
        vertical = 0,
        horizontal = 1
    }
    class HorizontalFlexLayout extends FlexLayout {
        options: HorizontalFlexLayoutOptions;
        constructor(options?: HorizontalFlexLayoutOptions);
        setResponsiveMode(responsiveMode?: HorizontalLayoutResponsiveMode): void;
    }
    interface HorizontalFlexLayoutOptions extends FlexLayoutOptions {
        responsiveMode?: HorizontalLayoutResponsiveMode;
    }
    class VerticalFlexLayout extends FlexLayout {
        constructor(options?: FlexLayoutOptions);
    }
    enum HorizontalLayoutResponsiveMode {
        disabled = 0,
        small = 512,
        medium = 768,
        large = 1024
    }
}
declare namespace NextAdmin.UI {
    class FormModal<T> extends NextAdmin.UI.Modal {
        protected data?: T;
        options: FormModalOptions<T>;
        form: HTMLDivElement;
        formControls: Dictionary<FormControl>;
        validateButton: Button;
        static style: string;
        constructor(options?: FormModalOptions<T>);
        open(args?: OpenFormModalArgs): void;
        updateValidateButtonState(): void;
        validate(): Promise<void>;
        appendFormControl<TControl extends FormControl>(dataPropertyName: string, formControl: TControl, configAction?: (control: TControl) => void): void;
        bindControl(formControl: FormControl, dataPropertyName?: string): void;
        setData(data?: T, fireChange?: boolean): void;
        updateControlsFromData(fireChange?: boolean): void;
        updateDataFromControls(): void;
        getData(): T;
    }
    interface FormModalOptions<T> extends ModalOptions {
        data?: any;
        onValidate?: (data?: T) => void;
        validateButtonOption?: ButtonOptions;
    }
    class FormModal_ extends FormModal<any> {
    }
    interface FormModalOptions_ extends FormModalOptions<any> {
    }
    interface OpenFormModalArgs {
        data?: any;
    }
}
declare namespace NextAdmin.UI {
    class StretchLayout extends Control {
        fixedContainer: HTMLDivElement;
        stretchContainer: HTMLDivElement;
        options: StretchLayoutOptions;
        static style: string;
        static onCreated: EventHandler<StretchLayout, StretchLayoutOptions>;
        constructor(options?: StretchLayoutOptions);
    }
    interface StretchLayoutOptions extends ControlOptions {
        type?: StretchLayoutType;
        fixedItems?: Array<HTMLElement | Control>;
        stretchItem?: HTMLElement | Control;
        stretch?: boolean;
    }
    enum StretchLayoutType {
        stretchLeft = 0,
        stretchRight = 1,
        stretchTop = 2,
        stretchBottom = 3
    }
}
declare namespace NextAdmin.UI {
    class Panel extends StretchLayout {
        options: PanelOptions;
        leftHeader: HTMLTableCellElement;
        rightHeader: HTMLTableCellElement;
        header: HTMLDivElement;
        body: HTMLDivElement;
        footer: HTMLDivElement;
        static style: string;
        static onCreated: EventHandler<Panel, PanelOptions>;
        constructor(options?: PanelOptions);
        setStyle(style?: PanelStyle): void;
    }
    interface PanelOptions extends StretchLayoutOptions {
        hasFooter?: boolean;
        hasHeader?: boolean;
        style?: PanelStyle;
    }
    enum PanelStyle {
        default = 0,
        noBorder = 1
    }
}
declare namespace NextAdmin.UI {
    class FormPanel extends Panel implements IForm {
        saveButton: Button;
        deleteButton: Button;
        cancelButton: Button;
        footerToolBar: Toolbar;
        dataController: NextAdmin.Business.DataController_;
        options: FormPanelOptions;
        constructor(options?: FormPanelOptions);
        enableReadOnly(): void;
        disableReadOnly(): void;
    }
    interface FormPanelOptions extends FormOptions, PanelOptions {
        hasFooterToolbar?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class GoogleMap extends Control {
        options: GoogleMapOptions;
        map: any;
        constructor(options?: GoogleMapOptions);
        initializeMap(): Promise<void>;
        static getGoogleMapScriptUrl(key: string): string;
    }
    interface GoogleMapOptions extends ControlOptions {
        apiKey?: string;
        height?: string;
        initialLocation?: {
            lat: number;
            lng: number;
        };
        initialZoom?: number;
    }
}
declare var google: any;
declare namespace NextAdmin.UI {
    class GridFormPanel<T> extends Control {
        options: GridFormPanelOptions;
        grid: DataGrid<T>;
        formPanel: FormPanel;
        static style: string;
        constructor(options?: GridFormPanelOptions);
    }
    interface GridFormPanelOptions extends ControlOptions {
        gridOptions?: DataGridOptions_;
        formPanelOption?: FormPanelOptions;
        onSelectedDataChanged?: (row: DataGridRow_, panel: FormPanel) => void;
        onAppendDataItem?: (sender: GridFormPanel_, data: any) => void;
    }
    class GridFormPanel_ extends GridFormPanel<any> {
    }
}
declare namespace NextAdmin.UI {
    interface IControl {
        element: HTMLElement;
        enable(): any;
        disable(): any;
        startSpin(): any;
        stopSpin(): any;
    }
    interface IDatasetControl<TData> extends IControl {
        getDataset(): Array<TData>;
    }
    interface IDatasetItemControl<TData> extends IControl {
        data?: TData;
    }
    interface IActionControl extends IControl {
        element: HTMLElement;
        action: (control: IActionControl) => void;
    }
}
declare namespace NextAdmin.UI {
    interface IForm extends IControl {
        saveButton?: UI.Button;
        deleteButton?: UI.Button;
        cancelButton?: UI.Button;
        startSpin(): any;
        stopSpin(): any;
        enableReadOnly(): any;
        disableReadOnly(): any;
    }
}
declare namespace NextAdmin.UI {
    interface IFormControl extends IControl {
        setValue(value: any, fireChange?: boolean): any;
        getValue(): any;
        setLabel(caption: string): any;
        getLabel(): string;
        setError(error: string | Array<NextAdmin.Business.DataError>): any;
        setTooltip(message?: string): any;
        getToolTip(): string;
        enable(): any;
        disable(): any;
        isEnable(): boolean;
        onValueChanged: EventHandler<IFormControl, ValueChangeEventArgs>;
        setDataController(form: NextAdmin.Business.DataController_, propertyName: string): any;
        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo): any;
        getPropertyInfo(): NextAdmin.Business.DataPropertyInfo;
        getBindedPropertyName(): string;
    }
    interface ValueChangeEventArgs {
        previousValue?: any;
        value?: any;
        origin?: ChangeOrigin;
    }
    interface ValueChangingEventArgs {
        previousValue?: any;
        newValue?: any;
        cancel?: boolean;
    }
    enum ChangeOrigin {
        user = 0,
        code = 1
    }
}
declare namespace NextAdmin.UI {
    class Image extends Control {
        options: ImageOptions;
        image: HTMLImageElement;
        static style: string;
        constructor(options?: ImageOptions);
        setStyle(style?: ImageStyle): void;
        setDisplayMode(displayMode: ImageDisplayMode): void;
        private _isMultiFramePlaying;
        startPlayFrames(srcs?: Array<string>, frameDuration?: number): Promise<void>;
        stopPlayFrames(): void;
        dispose(): void;
    }
    interface ImageOptions extends ControlOptions {
        width?: string;
        height?: string;
        src?: string | Array<string>;
        frameDuration?: number;
        multiFramePlayingMode?: MultiFramePlayingMode;
        style?: ImageStyle;
        displayMode?: ImageDisplayMode;
    }
    enum ImageStyle {
        none = 0,
        lightBordered = 1,
        whiteBordered = 2
    }
    enum ImageDisplayMode {
        contain = 0,
        cover = 1,
        stretch = 2
    }
    enum MultiFramePlayingMode {
        manual = 0,
        auto = 1,
        onHover = 2
    }
}
declare namespace NextAdmin.UI {
    class Link extends Control {
        options: LinkOptions;
        element: HTMLAnchorElement;
        onActionExecuting: EventHandler<Link, any>;
        onActionExecuted: EventHandler<Link, any>;
        action: (link: Link) => void;
        static style: string;
        constructor(options: LinkOptions);
        isEnable(): boolean;
        enable(): void;
        disable(): void;
        executeAction(): void;
        setText(text: string): Link;
        getText(): string;
        setActive(value?: boolean): void;
        setStyle(style?: LinkStyle): void;
        startSpin(): {
            spinnerContainer: HTMLDivElement;
            spinner: HTMLImageElement;
        };
        stopSpin(): void;
    }
    interface LinkOptions extends ControlOptions {
        text?: string;
        popover?: string;
        htmlTag?: string;
        href?: string;
        openInNewTab?: boolean;
        style?: LinkStyle;
        action?: (link: Link) => void;
    }
    enum LinkStyle {
        blue = 0,
        dark = 1,
        white = 2,
        grey = 3
    }
}
declare namespace NextAdmin.UI {
    class MapboxMap extends Control {
        options: MapboxMapOptions;
        map: mapboxgl.Map;
        initialLocation: LatLng;
        onMapInitialized: EventHandler<MapboxMap, mapboxgl.Map>;
        constructor(options?: MapboxMapOptions);
        initializeMap(): Promise<void>;
        getLocationFromAddress(address: string): Promise<LatLng>;
        addMarker(location: LatLng): mapboxgl.Marker;
    }
    interface MapboxMapOptions extends ControlOptions {
        mapboxAccessToken?: string;
        mapboxDependencyRootUrl?: string;
        mapboxMapStyle?: MapboxMapStyle | string;
        height?: string;
        initialLocation?: LatLng;
        initialLocationAddress?: string;
        hasMarkerToInitialLocation?: boolean;
        initialZoom?: number;
    }
    interface LatLng {
        lat: number;
        lng: number;
    }
    enum MapboxMapStyle {
        streets = "mapbox://styles/mapbox/streets-v11",
        satellite_streets = "mapbox://styles/mapbox/satellite-streets-v11",
        outdoors = "mapbox://styles/mapbox/outdoors-v11",
        light = "mapbox://styles/mapbox/light-v11",
        dark = "mapbox://styles/mapbox/dark-v11",
        satellite = "mapbox://styles/mapbox/satellite-v9",
        navigation = "mapbox://styles/mapbox/navigation-day-v1",
        navigation_night = "mapbox://styles/mapbox/navigation-night-v1"
    }
}
declare namespace GeoJSON {
    /**
    * The valid values for the "type" property of GeoJSON geometry objects.
    * https://tools.ietf.org/html/rfc7946#section-1.4
    */
    type GeoJsonGeometryTypes = "Point" | "LineString" | "MultiPoint" | "Polygon" | "MultiLineString" | "MultiPolygon" | "GeometryCollection";
    /**
     * The value values for the "type" property of GeoJSON Objects.
     * https://tools.ietf.org/html/rfc7946#section-1.4
     */
    type GeoJsonTypes = "FeatureCollection" | "Feature" | GeoJsonGeometryTypes;
    /**
     * Bounding box
     * https://tools.ietf.org/html/rfc7946#section-5
     */
    type BBox = [number, number, number, number] | [number, number, number, number, number, number];
    /**
     * A Position is an array of coordinates.
     * https://tools.ietf.org/html/rfc7946#section-3.1.1
     * Array should contain between two and three elements.
     * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
     * but the current specification only allows X, Y, and (optionally) Z to be defined.
     */
    type Position = number[];
    /**
     * The base GeoJSON object.
     * https://tools.ietf.org/html/rfc7946#section-3
     * The GeoJSON specification also allows foreign members
     * (https://tools.ietf.org/html/rfc7946#section-6.1)
     * Developers should use "&" type in TypeScript or extend the interface
     * to add these foreign members.
     */
    interface GeoJsonObject {
        /**
         * Specifies the type of GeoJSON object.
         */
        type: GeoJsonTypes;
        /**
         * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
         * https://tools.ietf.org/html/rfc7946#section-5
         */
        bbox?: BBox;
    }
    /**
     * Union of GeoJSON objects.
     */
    type GeoJSON = Geometry | Feature | FeatureCollection;
    /**
     * A geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3
     */
    interface GeometryObject extends GeoJsonObject {
        type: GeoJsonGeometryTypes;
    }
    /**
     * Union of geometry objects.
     * https://tools.ietf.org/html/rfc7946#section-3
     */
    type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;
    /**
     * Point geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.2
     */
    interface Point extends GeometryObject {
        type: "Point";
        coordinates: Position;
    }
    /**
     * MultiPoint geometry object.
     *  https://tools.ietf.org/html/rfc7946#section-3.1.3
     */
    interface MultiPoint extends GeometryObject {
        type: "MultiPoint";
        coordinates: Position[];
    }
    /**
     * LineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.4
     */
    interface LineString extends GeometryObject {
        type: "LineString";
        coordinates: Position[];
    }
    /**
     * MultiLineString geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.5
     */
    interface MultiLineString extends GeometryObject {
        type: "MultiLineString";
        coordinates: Position[][];
    }
    /**
     * Polygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.6
     */
    interface Polygon extends GeometryObject {
        type: "Polygon";
        coordinates: Position[][];
    }
    /**
     * MultiPolygon geometry object.
     * https://tools.ietf.org/html/rfc7946#section-3.1.7
     */
    interface MultiPolygon extends GeometryObject {
        type: "MultiPolygon";
        coordinates: Position[][][];
    }
    /**
     * Geometry Collection
     * https://tools.ietf.org/html/rfc7946#section-3.1.8
     */
    interface GeometryCollection extends GeometryObject {
        type: "GeometryCollection";
        geometries: Geometry[];
    }
    type GeoJsonProperties = {
        [name: string]: any;
    } | null;
    /**
     * A feature object which contains a geometry and associated properties.
     * https://tools.ietf.org/html/rfc7946#section-3.2
     */
    interface Feature<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "Feature";
        /**
         * The feature's geometry
         */
        geometry: G;
        /**
         * A value that uniquely identifies this feature in a
         * https://tools.ietf.org/html/rfc7946#section-3.2.
         */
        id?: string | number;
        /**
         * Properties associated with this feature.
         */
        properties: P;
    }
    /**
     * A collection of feature objects.
     *  https://tools.ietf.org/html/rfc7946#section-3.3
     */
    interface FeatureCollection<G extends GeometryObject | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
        type: "FeatureCollection";
        features: Array<Feature<G, P>>;
    }
}
declare namespace mapboxgl {
    let accessToken: string;
    let version: string;
    let baseApiUrl: string;
    /**
     * Number of web workers instantiated on a page with GL JS maps.
     * By default, it is set to half the number of CPU cores (capped at 6).
     */
    let workerCount: number;
    /**
     * Maximum number of images (raster tiles, sprites, icons) to load in parallel, which affects performance in raster-heavy maps.
     * 16 by default.
     */
    let maxParallelImageRequests: number;
    function supported(options?: {
        failIfMajorPerformanceCaveat?: boolean | undefined;
    }): boolean;
    /**
     * Clears browser storage used by this library. Using this method flushes the Mapbox tile cache that is managed by this library.
     * Tiles may still be cached by the browser in some cases.
     */
    function clearStorage(callback?: (err?: Error) => void): void;
    function setRTLTextPlugin(pluginURL: string, callback: (error: Error) => void, deferred?: boolean): void;
    function getRTLTextPluginStatus(): PluginStatus;
    /**
     * Initializes resources like WebWorkers that can be shared across maps to lower load
     * times in some situations. `mapboxgl.workerUrl` and `mapboxgl.workerCount`, if being
     * used, must be set before `prewarm()` is called to have an effect.
     *
     * By default, the lifecycle of these resources is managed automatically, and they are
     * lazily initialized when a Map is first created. By invoking `prewarm()`, these
     * resources will be created ahead of time, and will not be cleared when the last Map
     * is removed from the page. This allows them to be re-used by new Map instances that
     * are created later. They can be manually cleared by calling
     * `mapboxgl.clearPrewarmedResources()`. This is only necessary if your web page remains
     * active but stops using maps altogether.
     *
     * This is primarily useful when using GL-JS maps in a single page app, wherein a user
     * would navigate between various views that can cause Map instances to constantly be
     * created and destroyed.
     */
    function prewarm(): void;
    /**
     * Clears up resources that have previously been created by `mapboxgl.prewarm()`.
     * Note that this is typically not necessary. You should only call this function
     * if you expect the user of your app to not return to a Map view at any point
     * in your application.
     */
    function clearPrewarmedResources(): void;
    type PluginStatus = 'unavailable' | 'loading' | 'loaded' | 'error';
    type LngLatLike = [number, number] | LngLat | {
        lng: number;
        lat: number;
    } | {
        lon: number;
        lat: number;
    };
    type LngLatBoundsLike = LngLatBounds | [LngLatLike, LngLatLike] | [number, number, number, number] | LngLatLike;
    type PointLike = Point | [number, number];
    type Offset = number | PointLike | {
        [_: string]: PointLike;
    };
    type ExpressionName = 'array' | 'boolean' | 'collator' | 'format' | 'literal' | 'number' | 'number-format' | 'object' | 'string' | 'image' | 'to-boolean' | 'to-color' | 'to-number' | 'to-string' | 'typeof' | 'feature-state' | 'geometry-type' | 'id' | 'line-progress' | 'properties' | 'at' | 'get' | 'has' | 'in' | 'index-of' | 'length' | 'slice' | '!' | '!=' | '<' | '<=' | '==' | '>' | '>=' | 'all' | 'any' | 'case' | 'match' | 'coalesce' | 'within' | 'interpolate' | 'interpolate-hcl' | 'interpolate-lab' | 'step' | 'let' | 'var' | 'concat' | 'downcase' | 'is-supported-script' | 'resolved-locale' | 'upcase' | 'rgb' | 'rgba' | '-' | '*' | '/' | '%' | '^' | '+' | 'abs' | 'acos' | 'asin' | 'atan' | 'ceil' | 'cos' | 'e' | 'floor' | 'ln' | 'ln2' | 'log10' | 'log2' | 'max' | 'min' | 'pi' | 'round' | 'sin' | 'sqrt' | 'tan' | 'zoom' | 'heatmap-density';
    type Expression = [ExpressionName, ...any[]];
    type Anchor = 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    type DragPanOptions = {
        linearity?: number;
        easing?: (t: number) => number;
        deceleration?: number;
        maxSpeed?: number;
    };
    type InteractiveOptions = {
        around?: 'center';
    };
    /**
     * Map
     */
    class Map extends Evented {
        constructor(options?: MapboxOptions);
        addControl(control: Control | IControl, position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'): this;
        removeControl(control: Control | IControl): this;
        /**
         * Checks if a control exists on the map.
         *
         * @param {IControl} control The {@link IControl} to check.
         * @returns {boolean} True if map contains control.
         * @example
         */
        hasControl(control: IControl): boolean;
        resize(eventData?: EventData): this;
        getBounds(): LngLatBounds;
        getMaxBounds(): LngLatBounds | null;
        setMaxBounds(lnglatbounds?: LngLatBoundsLike): this;
        setMinZoom(minZoom?: number | null): this;
        getMinZoom(): number;
        setMaxZoom(maxZoom?: number | null): this;
        getMaxZoom(): number;
        setMinPitch(minPitch?: number | null): this;
        getMinPitch(): number;
        setMaxPitch(maxPitch?: number | null): this;
        getMaxPitch(): number;
        getRenderWorldCopies(): boolean;
        setRenderWorldCopies(renderWorldCopies?: boolean): this;
        project(lnglat: LngLatLike): mapboxgl.Point;
        unproject(point: PointLike): mapboxgl.LngLat;
        isMoving(): boolean;
        isZooming(): boolean;
        isRotating(): boolean;
        /**
         * Returns an array of GeoJSON Feature objects representing visible features that satisfy the query parameters.
         *
         * The properties value of each returned feature object contains the properties of its source feature. For GeoJSON sources, only string and numeric property values are supported (i.e. null, Array, and Object values are not supported).
         *
         * Each feature includes top-level layer, source, and sourceLayer properties. The layer property is an object representing the style layer to which the feature belongs. Layout and paint properties in this object contain values which are fully evaluated for the given zoom level and feature.
         *
         * Only features that are currently rendered are included. Some features will not be included, like:
         *
         * - Features from layers whose visibility property is "none".
         * - Features from layers whose zoom range excludes the current zoom level.
         * - Symbol features that have been hidden due to text or icon collision.
         *
         * Features from all other layers are included, including features that may have no visible contribution to the rendered result; for example, because the layer's opacity or color alpha component is set to 0.
         *
         * The topmost rendered feature appears first in the returned array, and subsequent features are sorted by descending z-order. Features that are rendered multiple times (due to wrapping across the antimeridian at low zoom levels) are returned only once (though subject to the following caveat).
         *
         * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple times in query results. For example, suppose there is a highway running through the bounding rectangle of a query. The results of the query will be those parts of the highway that lie within the map tiles covering the bounding rectangle, even if the highway extends into other tiles, and the portion of the highway within each map tile will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in multiple tiles due to tile buffering.
         *
         * @param pointOrBox The geometry of the query region: either a single point or southwest and northeast points describing a bounding box. Omitting this parameter (i.e. calling Map#queryRenderedFeatures with zero arguments, or with only a  options argument) is equivalent to passing a bounding box encompassing the entire map viewport.
         * @param options
         */
        queryRenderedFeatures(pointOrBox?: PointLike | [PointLike, PointLike], options?: {
            layers?: string[] | undefined;
            filter?: any[] | undefined;
        } & FilterOptions): MapboxGeoJSONFeature[];
        /**
         * Returns an array of GeoJSON Feature objects representing features within the specified vector tile or GeoJSON source that satisfy the query parameters.
         *
         * In contrast to Map#queryRenderedFeatures, this function returns all features matching the query parameters, whether or not they are rendered by the current style (i.e. visible). The domain of the query includes all currently-loaded vector tiles and GeoJSON source tiles: this function does not check tiles outside the currently visible viewport.
         *
         * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple times in query results. For example, suppose there is a highway running through the bounding rectangle of a query. The results of the query will be those parts of the highway that lie within the map tiles covering the bounding rectangle, even if the highway extends into other tiles, and the portion of the highway within each map tile will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in multiple tiles due to tile buffering.
         *
         * @param sourceID The ID of the vector tile or GeoJSON source to query.
         * @param parameters
         */
        querySourceFeatures(sourceID: string, parameters?: {
            sourceLayer?: string | undefined;
            filter?: any[] | undefined;
        } & FilterOptions): MapboxGeoJSONFeature[];
        setStyle(style: mapboxgl.Style | string, options?: {
            diff?: boolean | undefined;
            localIdeographFontFamily?: string | undefined;
        }): this;
        getStyle(): mapboxgl.Style;
        isStyleLoaded(): boolean;
        addSource(id: string, source: AnySourceData): this;
        isSourceLoaded(id: string): boolean;
        areTilesLoaded(): boolean;
        removeSource(id: string): this;
        getSource(id: string): AnySourceImpl;
        addImage(name: string, image: HTMLImageElement | ArrayBufferView | {
            width: number;
            height: number;
            data: Uint8Array | Uint8ClampedArray;
        } | ImageData | ImageBitmap, options?: {
            pixelRatio?: number | undefined;
            sdf?: boolean | undefined;
        }): void;
        updateImage(name: string, image: HTMLImageElement | ArrayBufferView | {
            width: number;
            height: number;
            data: Uint8Array | Uint8ClampedArray;
        } | ImageData | ImageBitmap): void;
        hasImage(name: string): boolean;
        removeImage(name: string): void;
        loadImage(url: string, callback: (error?: Error, result?: HTMLImageElement | ImageBitmap) => void): void;
        listImages(): string[];
        addLayer(layer: mapboxgl.AnyLayer, before?: string): this;
        moveLayer(id: string, beforeId?: string): this;
        removeLayer(id: string): this;
        getLayer(id: string): mapboxgl.AnyLayer;
        setFilter(layer: string, filter?: any[] | boolean | null, options?: FilterOptions | null): this;
        setLayerZoomRange(layerId: string, minzoom: number, maxzoom: number): this;
        getFilter(layer: string): any[];
        setPaintProperty(layer: string, name: string, value: any, klass?: string): this;
        getPaintProperty(layer: string, name: string): any;
        setLayoutProperty(layer: string, name: string, value: any): this;
        getLayoutProperty(layer: string, name: string): any;
        setLight(options: mapboxgl.Light, lightOptions?: any): this;
        getLight(): mapboxgl.Light;
        /**
         * Sets the terrain property of the style.
         *
         * @param terrain Terrain properties to set. Must conform to the [Mapbox Style Specification](https://www.mapbox.com/mapbox-gl-style-spec/#terrain).
         * If `null` or `undefined` is provided, function removes terrain.
         * @returns {Map} `this`
         * @example
         * map.addSource('mapbox-dem', {
         *     'type': 'raster-dem',
         *     'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
         *     'tileSize': 512,
         *     'maxzoom': 14
         * });
         * // add the DEM source as a terrain layer with exaggerated height
         * map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
         */
        setTerrain(terrain?: TerrainSpecification | null): this;
        getTerrain(): TerrainSpecification | null;
        showTerrainWireframe: boolean;
        /**
         *
         * @param lngLat The coordinate to query
         * @param options Optional {ElevationQueryOptions}
         * @returns The elevation in meters at mean sea level or null
         */
        queryTerrainElevation(lngLat: mapboxgl.LngLatLike, options?: ElevationQueryOptions): number | null;
        setFeatureState(feature: FeatureIdentifier | mapboxgl.MapboxGeoJSONFeature, state: {
            [key: string]: any;
        }): void;
        getFeatureState(feature: FeatureIdentifier | mapboxgl.MapboxGeoJSONFeature): {
            [key: string]: any;
        };
        removeFeatureState(target: FeatureIdentifier | mapboxgl.MapboxGeoJSONFeature, key?: string): void;
        getContainer(): HTMLElement;
        getCanvasContainer(): HTMLElement;
        getCanvas(): HTMLCanvasElement;
        loaded(): boolean;
        remove(): void;
        triggerRepaint(): void;
        showTileBoundaries: boolean;
        showCollisionBoxes: boolean;
        /**
         * Gets and sets a Boolean indicating whether the map will visualize
         * the padding offsets.
         *
         * @name showPadding
         * @type {boolean}
         * @instance
         * @memberof Map
         */
        showPadding: boolean;
        repaint: boolean;
        getCenter(): mapboxgl.LngLat;
        setCenter(center: LngLatLike, eventData?: mapboxgl.EventData): this;
        panBy(offset: PointLike, options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        panTo(lnglat: LngLatLike, options?: mapboxgl.AnimationOptions, eventdata?: mapboxgl.EventData): this;
        getZoom(): number;
        setZoom(zoom: number, eventData?: mapboxgl.EventData): this;
        zoomTo(zoom: number, options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        zoomIn(options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        zoomOut(options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        getBearing(): number;
        setBearing(bearing: number, eventData?: mapboxgl.EventData): this;
        /**
         * Returns the current padding applied around the map viewport.
         *
         * @memberof Map#
         * @returns The current padding around the map viewport.
         */
        getPadding(): PaddingOptions;
        /**
         * Sets the padding in pixels around the viewport.
         *
         * Equivalent to `jumpTo({padding: padding})`.
         *
         * @memberof Map#
         * @param padding The desired padding. Format: { left: number, right: number, top: number, bottom: number }
         * @param eventData Additional properties to be added to event objects of events triggered by this method.
         * @fires movestart
         * @fires moveend
         * @returns {Map} `this`
         * @example
         * // Sets a left padding of 300px, and a top padding of 50px
         * map.setPadding({ left: 300, top: 50 });
         */
        setPadding(padding: PaddingOptions, eventData?: EventData): this;
        rotateTo(bearing: number, options?: mapboxgl.AnimationOptions, eventData?: EventData): this;
        resetNorth(options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        resetNorthPitch(options?: mapboxgl.AnimationOptions | null, eventData?: mapboxgl.EventData | null): this;
        snapToNorth(options?: mapboxgl.AnimationOptions, eventData?: mapboxgl.EventData): this;
        getPitch(): number;
        setPitch(pitch: number, eventData?: EventData): this;
        cameraForBounds(bounds: LngLatBoundsLike, options?: CameraForBoundsOptions): CameraForBoundsResult | undefined;
        fitBounds(bounds: LngLatBoundsLike, options?: mapboxgl.FitBoundsOptions, eventData?: mapboxgl.EventData): this;
        fitScreenCoordinates(p0: PointLike, p1: PointLike, bearing: number, options?: AnimationOptions & CameraOptions, eventData?: EventData): this;
        jumpTo(options: mapboxgl.CameraOptions, eventData?: mapboxgl.EventData): this;
        /**
         * Returns position and orientation of the camera entity.
         *
         * @memberof Map#
         * @returns {FreeCameraOptions} The camera state
         */
        getFreeCameraOptions(): FreeCameraOptions;
        /**
         * FreeCameraOptions provides more direct access to the underlying camera entity.
         * For backwards compatibility the state set using this API must be representable with
         * `CameraOptions` as well. Parameters are clamped into a valid range or discarded as invalid
         * if the conversion to the pitch and bearing presentation is ambiguous. For example orientation
         * can be invalid if it leads to the camera being upside down, the quaternion has zero length,
         * or the pitch is over the maximum pitch limit.
         *
         * @memberof Map#
         * @param {FreeCameraOptions} options FreeCameraOptions object
         * @param eventData Additional properties to be added to event objects of events triggered by this method.
         * @fires movestart
         * @fires zoomstart
         * @fires pitchstart
         * @fires rotate
         * @fires move
         * @fires zoom
         * @fires pitch
         * @fires moveend
         * @fires zoomend
         * @fires pitchend
         * @returns {Map} `this`
         */
        setFreeCameraOptions(options: FreeCameraOptions, eventData?: Object): this;
        easeTo(options: mapboxgl.EaseToOptions, eventData?: mapboxgl.EventData): this;
        flyTo(options: mapboxgl.FlyToOptions, eventData?: mapboxgl.EventData): this;
        isEasing(): boolean;
        stop(): this;
        on<T extends keyof MapLayerEventType>(type: T, layer: string | ReadonlyArray<string>, listener: (ev: MapLayerEventType[T] & EventData) => void): this;
        on<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & EventData) => void): this;
        on(type: string, listener: (ev: any) => void): this;
        once<T extends keyof MapLayerEventType>(type: T, layer: string, listener: (ev: MapLayerEventType[T] & EventData) => void): this;
        once<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & EventData) => void): this;
        once(type: string, listener: (ev: any) => void): this;
        once<T extends keyof MapEventType>(type: T): Promise<MapEventType[T]>;
        off<T extends keyof MapLayerEventType>(type: T, layer: string, listener: (ev: MapLayerEventType[T] & EventData) => void): this;
        off<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & EventData) => void): this;
        off(type: string, listener: (ev: any) => void): this;
        scrollZoom: ScrollZoomHandler;
        boxZoom: BoxZoomHandler;
        dragRotate: DragRotateHandler;
        dragPan: DragPanHandler;
        keyboard: KeyboardHandler;
        doubleClickZoom: DoubleClickZoomHandler;
        touchZoomRotate: TouchZoomRotateHandler;
        touchPitch: TouchPitchHandler;
        getFog(): Fog | null;
        setFog(fog: Fog): this;
    }
    interface MapboxOptions {
        /**
         * If true, the gl context will be created with MSA antialiasing, which can be useful for antialiasing custom layers.
         * This is false by default as a performance optimization.
         */
        antialias?: boolean | undefined;
        /** If true, an attribution control will be added to the map. */
        attributionControl?: boolean | undefined;
        bearing?: number | undefined;
        /** Snap to north threshold in degrees. */
        bearingSnap?: number | undefined;
        /** The initial bounds of the map. If bounds is specified, it overrides center and zoom constructor options. */
        bounds?: LngLatBoundsLike | undefined;
        /** If true, enable the "box zoom" interaction (see BoxZoomHandler) */
        boxZoom?: boolean | undefined;
        /** initial map center */
        center?: LngLatLike | undefined;
        /**
         * The max number of pixels a user can shift the mouse pointer during a click for it to be
         * considered a valid click (as opposed to a mouse drag).
         *
         * @default 3
         */
        clickTolerance?: number | undefined;
        /**
         * If `true`, Resource Timing API information will be collected for requests made by GeoJSON
         * and Vector Tile web workers (this information is normally inaccessible from the main
         * Javascript thread). Information will be returned in a `resourceTiming` property of
         * relevant `data` events.
         *
         * @default false
         */
        collectResourceTiming?: boolean | undefined;
        /**
         * If `true`, symbols from multiple sources can collide with each other during collision
         * detection. If `false`, collision detection is run separately for the symbols in each source.
         *
         * @default true
         */
        crossSourceCollisions?: boolean | undefined;
        /** ID of the container element */
        container: string | HTMLElement;
        /**
         * If `true` , scroll zoom will require pressing the ctrl or ⌘ key while scrolling to zoom map,
         * and touch pan will require using two fingers while panning to move the map.
         * Touch pitch will require three fingers to activate if enabled.
         */
        cooperativeGestures?: boolean;
        /** String or strings to show in an AttributionControl.
         * Only applicable if options.attributionControl is `true`. */
        customAttribution?: string | string[] | undefined;
        /**
         * If `true`, the "drag to pan" interaction is enabled.
         * An `Object` value is passed as options to {@link DragPanHandler#enable}.
         */
        dragPan?: boolean | DragPanOptions | undefined;
        /** If true, enable the "drag to rotate" interaction (see DragRotateHandler). */
        dragRotate?: boolean | undefined;
        /** If true, enable the "double click to zoom" interaction (see DoubleClickZoomHandler). */
        doubleClickZoom?: boolean | undefined;
        /** If `true`, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.
         * For example, `http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60`.
         * An additional string may optionally be provided to indicate a parameter-styled hash,
         * e.g. http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60&foo=bar, where foo
         * is a custom parameter and bar is an arbitrary hash distinct from the map hash.
         * */
        hash?: boolean | string | undefined;
        /**
         * Controls the duration of the fade-in/fade-out animation for label collisions, in milliseconds.
         * This setting affects all symbol layers. This setting does not affect the duration of runtime
         * styling transitions or raster tile cross-fading.
         *
         * @default 300
         */
        fadeDuration?: number | undefined;
        /** If true, map creation will fail if the implementation determines that the performance of the created WebGL context would be dramatically lower than expected. */
        failIfMajorPerformanceCaveat?: boolean | undefined;
        /** A fitBounds options object to use only when setting the bounds option. */
        fitBoundsOptions?: FitBoundsOptions | undefined;
        /** If false, no mouse, touch, or keyboard listeners are attached to the map, so it will not respond to input */
        interactive?: boolean | undefined;
        /** If true, enable keyboard shortcuts (see KeyboardHandler). */
        keyboard?: boolean | undefined;
        /** A patch to apply to the default localization table for UI strings, e.g. control tooltips.
         * The `locale` object maps namespaced UI string IDs to translated strings in the target language;
         * see `src/ui/default_locale.js` for an example with all supported string IDs.
         * The object may specify all UI strings (thereby adding support for a new translation) or
         * only a subset of strings (thereby patching the default translation table).
         */
        locale?: {
            [key: string]: string;
        } | undefined;
        /**
         * Overrides the generation of all glyphs and font settings except font-weight keywords
         * Also overrides localIdeographFontFamily
         * @default null
         */
        localFontFamily?: string | undefined;
        /**
         * If specified, defines a CSS font-family for locally overriding generation of glyphs in the
         * 'CJK Unified Ideographs' and 'Hangul Syllables' ranges. In these ranges, font settings from
         * the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold).
         * The purpose of this option is to avoid bandwidth-intensive glyph server requests.
         *
         * @default null
         */
        localIdeographFontFamily?: string | undefined;
        /**
         * A string representing the position of the Mapbox wordmark on the map.
         *
         * @default "bottom-left"
         */
        logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | undefined;
        /** If set, the map is constrained to the given bounds. */
        maxBounds?: LngLatBoundsLike | undefined;
        /** Maximum pitch of the map. */
        maxPitch?: number | undefined;
        /** Maximum zoom of the map. */
        maxZoom?: number | undefined;
        /** Minimum pitch of the map. */
        minPitch?: number | undefined;
        /** Minimum zoom of the map. */
        minZoom?: number | undefined;
        /**
         * If true, map will prioritize rendering for performance by reordering layers
         * If false, layers will always be drawn in the specified order
         *
         * @default true
         */
        optimizeForTerrain?: boolean | undefined;
        /** If true, The maps canvas can be exported to a PNG using map.getCanvas().toDataURL();. This is false by default as a performance optimization. */
        preserveDrawingBuffer?: boolean | undefined;
        /**
         * The initial pitch (tilt) of the map, measured in degrees away from the plane of the
         * screen (0-60).
         *
         * @default 0
         */
        pitch?: number | undefined;
        /**
         * If `false`, the map's pitch (tilt) control with "drag to rotate" interaction will be disabled.
         *
         * @default true
         */
        pitchWithRotate?: boolean | undefined;
        /**
         * If `false`, the map won't attempt to re-request tiles once they expire per their HTTP
         * `cacheControl`/`expires` headers.
         *
         * @default true
         */
        refreshExpiredTiles?: boolean | undefined;
        /**
         * If `true`, multiple copies of the world will be rendered, when zoomed out.
         *
         * @default true
         */
        renderWorldCopies?: boolean | undefined;
        /**
         * If `true`, the "scroll to zoom" interaction is enabled.
         * An `Object` value is passed as options to {@link ScrollZoomHandler#enable}.
         */
        scrollZoom?: boolean | InteractiveOptions | undefined;
        /** stylesheet location */
        style?: mapboxgl.Style | string | undefined;
        /** If  true, the map will automatically resize when the browser window resizes */
        trackResize?: boolean | undefined;
        /**
         * A callback run before the Map makes a request for an external URL. The callback can be
         * used to modify the url, set headers, or set the credentials property for cross-origin requests.
         *
         * @default null
         */
        transformRequest?: TransformRequestFunction | undefined;
        /**
         * If `true`, the "pinch to rotate and zoom" interaction is enabled.
         * An `Object` value is passed as options to {@link TouchZoomRotateHandler#enable}.
         */
        touchZoomRotate?: boolean | InteractiveOptions | undefined;
        /**
         * If `true`, the "drag to pitch" interaction is enabled.
         * An `Object` value is passed as options to {@link TouchPitchHandler#enable}.
         */
        touchPitch?: boolean | InteractiveOptions | undefined;
        /** Initial zoom level */
        zoom?: number | undefined;
        /**
         * The maximum number of tiles stored in the tile cache for a given source. If omitted, the
         * cache will be dynamically sized based on the current viewport.
         *
         * @default null
         */
        maxTileCacheSize?: number | undefined;
        /**
         * If specified, map will use this token instead of the one defined in mapboxgl.accessToken.
         *
         * @default null
         */
        accessToken?: string | undefined;
        /**
         * Allows for the usage of the map in automated tests without an accessToken with custom self-hosted test fixtures.
         *
         * @default null
         */
        testMode?: boolean | undefined;
    }
    type quat = number[];
    type vec3 = number[];
    /**
     * Various options for accessing physical properties of the underlying camera entity.
     * A direct access to these properties allows more flexible and precise controlling of the camera
     * while also being fully compatible and interchangeable with CameraOptions. All fields are optional.
     * See {@Link Camera#setFreeCameraOptions} and {@Link Camera#getFreeCameraOptions}
     *
     * @param {MercatorCoordinate} position Position of the camera in slightly modified web mercator coordinates
            - The size of 1 unit is the width of the projected world instead of the "mercator meter".
            Coordinate [0, 0, 0] is the north-west corner and [1, 1, 0] is the south-east corner.
            - Z coordinate is conformal and must respect minimum and maximum zoom values.
            - Zoom is automatically computed from the altitude (z)
    * @param {quat} orientation Orientation of the camera represented as a unit quaternion [x, y, z, w]
            in a left-handed coordinate space. Direction of the rotation is clockwise around the respective axis.
            The default pose of the camera is such that the forward vector is looking up the -Z axis and
            the up vector is aligned with north orientation of the map:
            forward: [0, 0, -1]
            up:      [0, -1, 0]
            right    [1, 0, 0]
            Orientation can be set freely but certain constraints still apply
            - Orientation must be representable with only pitch and bearing.
            - Pitch has an upper limit
    */
    class FreeCameraOptions {
        constructor(position?: MercatorCoordinate, orientation?: quat);
        position: MercatorCoordinate | undefined;
        /**
         * Helper function for setting orientation of the camera by defining a focus point
         * on the map.
         *
         * @param {LngLatLike} location Location of the focus point on the map
         * @param {vec3} up Up vector of the camera is required in certain scenarios where bearing can't be deduced
         *      from the viewing direction.
         */
        lookAtPoint(location: LngLatLike, up?: vec3): void;
        /**
         * Helper function for setting the orientation of the camera as a pitch and a bearing.
         *
         * @param {number} pitch Pitch angle in degrees
         * @param {number} bearing Bearing angle in degrees
         */
        setPitchBearing(pitch: number, bearing: number): void;
    }
    type ResourceType = 'Unknown' | 'Style' | 'Source' | 'Tile' | 'Glyphs' | 'SpriteImage' | 'SpriteJSON' | 'Image';
    interface RequestParameters {
        /**
         * The URL to be requested.
         */
        url: string;
        /**
         * Use `'include'` to send cookies with cross-origin requests.
         */
        credentials?: 'same-origin' | 'include' | undefined;
        /**
         * The headers to be sent with the request.
         */
        headers?: {
            [header: string]: any;
        } | undefined;
        method?: 'GET' | 'POST' | 'PUT' | undefined;
        collectResourceTiming?: boolean | undefined;
    }
    type TransformRequestFunction = (url: string, resourceType: ResourceType) => RequestParameters;
    interface PaddingOptions {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
    interface FeatureIdentifier {
        id?: string | number | undefined;
        source: string;
        sourceLayer?: string | undefined;
    }
    /**
     * BoxZoomHandler
     */
    class BoxZoomHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        isActive(): boolean;
        enable(): void;
        disable(): void;
    }
    /**
     * ScrollZoomHandler
     */
    class ScrollZoomHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        enable(options?: InteractiveOptions): void;
        disable(): void;
        setZoomRate(zoomRate: number): void;
        setWheelZoomRate(wheelZoomRate: number): void;
    }
    /**
     * DragPenHandler
     */
    class DragPanHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        isActive(): boolean;
        enable(options?: DragPanOptions): void;
        disable(): void;
    }
    /**
     * DragRotateHandler
     */
    class DragRotateHandler {
        constructor(map: mapboxgl.Map, options?: {
            bearingSnap?: number | undefined;
            pitchWithRotate?: boolean | undefined;
        });
        isEnabled(): boolean;
        isActive(): boolean;
        enable(): void;
        disable(): void;
    }
    /**
     * KeyboardHandler
     */
    class KeyboardHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        enable(): void;
        disable(): void;
        /**
         * Returns true if the handler is enabled and has detected the start of a
         * zoom/rotate gesture.
         *
         * @returns {boolean} `true` if the handler is enabled and has detected the
         * start of a zoom/rotate gesture.
         */
        isActive(): boolean;
        /**
         * Disables the "keyboard pan/rotate" interaction, leaving the
         * "keyboard zoom" interaction enabled.
         *
         * @example
         *   map.keyboard.disableRotation();
         */
        disableRotation(): void;
        /**
         * Enables the "keyboard pan/rotate" interaction.
         *
         * @example
         *   map.keyboard.enable();
         *   map.keyboard.enableRotation();
         */
        enableRotation(): void;
    }
    /**
     * DoubleClickZoomHandler
     */
    class DoubleClickZoomHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        enable(): void;
        disable(): void;
    }
    /**
     * TouchZoomRotateHandler
     */
    class TouchZoomRotateHandler {
        constructor(map: mapboxgl.Map);
        isEnabled(): boolean;
        enable(options?: InteractiveOptions): void;
        disable(): void;
        disableRotation(): void;
        enableRotation(): void;
    }
    class TouchPitchHandler {
        constructor(map: mapboxgl.Map);
        enable(options?: InteractiveOptions): void;
        isActive(): boolean;
        isEnabled(): boolean;
        disable(): void;
    }
    interface IControl {
        onAdd(map: Map): HTMLElement;
        onRemove(map: Map): void;
        getDefaultPosition?: (() => string) | undefined;
    }
    /**
     * Control
     */
    class Control extends Evented implements IControl {
        onAdd(map: Map): HTMLElement;
        onRemove(map: Map): void;
        getDefaultPosition?: (() => string) | undefined;
    }
    /**
     * Navigation
     */
    class NavigationControl extends Control {
        constructor(options?: {
            showCompass?: boolean | undefined;
            showZoom?: boolean | undefined;
            visualizePitch?: boolean | undefined;
        });
    }
    class PositionOptions {
        enableHighAccuracy?: boolean | undefined;
        timeout?: number | undefined;
        maximumAge?: number | undefined;
    }
    /**
     * Geolocate
     */
    class GeolocateControl extends Control {
        constructor(options?: {
            positionOptions?: PositionOptions | undefined;
            fitBoundsOptions?: FitBoundsOptions | undefined;
            trackUserLocation?: boolean | undefined;
            showAccuracyCircle?: boolean | undefined;
            showUserLocation?: boolean | undefined;
            showUserHeading?: boolean | undefined;
        });
        trigger(): boolean;
    }
    /**
     * Attribution
     */
    class AttributionControl extends Control {
        constructor(options?: {
            compact?: boolean | undefined;
            customAttribution?: string | string[] | undefined;
        });
    }
    /**
     * Scale
     */
    class ScaleControl extends Control {
        constructor(options?: {
            maxWidth?: number | undefined;
            unit?: string | undefined;
        });
        setUnit(unit: 'imperial' | 'metric' | 'nautical'): void;
    }
    /**
     * FullscreenControl
     */
    class FullscreenControl extends Control {
        constructor(options?: FullscreenControlOptions | null);
    }
    interface FullscreenControlOptions {
        /**
         * A compatible DOM element which should be made full screen.
         * By default, the map container element will be made full screen.
         */
        container?: HTMLElement | null | undefined;
    }
    /**
     * Popup
     */
    class Popup extends Evented {
        constructor(options?: mapboxgl.PopupOptions);
        addTo(map: mapboxgl.Map): this;
        isOpen(): boolean;
        remove(): this;
        getLngLat(): mapboxgl.LngLat;
        /**
         * Sets the geographical location of the popup's anchor, and moves the popup to it. Replaces trackPointer() behavior.
         *
         * @param lnglat The geographical location to set as the popup's anchor.
         */
        setLngLat(lnglat: LngLatLike): this;
        /**
         * Tracks the popup anchor to the cursor position, on screens with a pointer device (will be hidden on touchscreens). Replaces the setLngLat behavior.
         * For most use cases, `closeOnClick` and `closeButton` should also be set to `false` here.
         */
        trackPointer(): this;
        /** Returns the `Popup`'s HTML element. */
        getElement(): HTMLElement;
        setText(text: string): this;
        setHTML(html: string): this;
        setDOMContent(htmlNode: Node): this;
        getMaxWidth(): string;
        setMaxWidth(maxWidth: string): this;
        /**
         * Adds a CSS class to the popup container element.
         *
         * @param {string} className Non-empty string with CSS class name to add to popup container
         *
         * @example
         * let popup = new mapboxgl.Popup()
         * popup.addClassName('some-class')
         */
        addClassName(className: string): void;
        /**
         * Removes a CSS class from the popup container element.
         *
         * @param {string} className Non-empty string with CSS class name to remove from popup container
         *
         * @example
         * let popup = new mapboxgl.Popup()
         * popup.removeClassName('some-class')
         */
        removeClassName(className: string): void;
        /**
         * Sets the popup's offset.
         *
         * @param offset Sets the popup's offset.
         * @returns {Popup} `this`
         */
        setOffset(offset?: Offset | null): this;
        /**
         * Add or remove the given CSS class on the popup container, depending on whether the container currently has that class.
         *
         * @param {string} className Non-empty string with CSS class name to add/remove
         *
         * @returns {boolean} if the class was removed return false, if class was added, then return true
         *
         * @example
         * let popup = new mapboxgl.Popup()
         * popup.toggleClassName('toggleClass')
         */
        toggleClassName(className: string): void;
    }
    interface PopupOptions {
        closeButton?: boolean | undefined;
        closeOnClick?: boolean | undefined;
        /**
         * @param {boolean} [options.closeOnMove=false] If `true`, the popup will closed when the map moves.
         */
        closeOnMove?: boolean | undefined;
        /**
         * @param {boolean} [options.focusAfterOpen=true] If `true`, the popup will try to focus the
         *   first focusable element inside the popup.
         */
        focusAfterOpen?: boolean | null | undefined;
        anchor?: Anchor | undefined;
        offset?: Offset | null | undefined;
        className?: string | undefined;
        maxWidth?: string | undefined;
    }
    interface Style {
        layers: AnyLayer[];
        sources: Sources;
        bearing?: number | undefined;
        center?: number[] | undefined;
        fog?: Fog | undefined;
        glyphs?: string | undefined;
        metadata?: any;
        name?: string | undefined;
        pitch?: number | undefined;
        light?: Light | undefined;
        sprite?: string | undefined;
        terrain?: TerrainSpecification | undefined;
        transition?: Transition | undefined;
        version: number;
        zoom?: number | undefined;
    }
    interface Transition {
        delay?: number | undefined;
        duration?: number | undefined;
    }
    interface Light {
        anchor?: 'map' | 'viewport' | undefined;
        position?: number[] | undefined;
        'position-transition'?: Transition | undefined;
        color?: string | undefined;
        'color-transition'?: Transition | undefined;
        intensity?: number | undefined;
        'intensity-transition'?: Transition | undefined;
    }
    interface Fog {
        color?: string | Expression | undefined;
        'horizon-blend'?: number | Expression | undefined;
        range?: number[] | Expression | undefined;
    }
    interface Sources {
        [sourceName: string]: AnySourceData;
    }
    type PromoteIdSpecification = {
        [key: string]: string;
    } | string;
    type AnySourceData = GeoJSONSourceRaw | VideoSourceRaw | ImageSourceRaw | CanvasSourceRaw | VectorSource | RasterSource | RasterDemSource;
    interface VectorSourceImpl extends VectorSource {
        /**
         * Sets the source `tiles` property and re-renders the map.
         *
         * @param {string[]} tiles An array of one or more tile source URLs, as in the TileJSON spec.
         * @returns {VectorTileSource} this
         */
        setTiles(tiles: ReadonlyArray<string>): VectorSourceImpl;
        /**
         * Sets the source `url` property and re-renders the map.
         *
         * @param {string} url A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<Tileset ID>`.
         * @returns {VectorTileSource} this
         */
        setUrl(url: string): VectorSourceImpl;
    }
    type AnySourceImpl = GeoJSONSource | VideoSource | ImageSource | CanvasSource | VectorSourceImpl | RasterSource | RasterDemSource;
    interface Source {
        type: 'vector' | 'raster' | 'raster-dem' | 'geojson' | 'image' | 'video' | 'canvas';
        data?: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string | undefined;
    }
    /**
     * GeoJSONSource
     */
    interface GeoJSONSourceRaw extends Source, GeoJSONSourceOptions {
        type: 'geojson';
    }
    class GeoJSONSource implements GeoJSONSourceRaw {
        type: 'geojson';
        constructor(options?: mapboxgl.GeoJSONSourceOptions);
        setData(data: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | String): this;
        getClusterExpansionZoom(clusterId: number, callback: (error: any, zoom: number) => void): this;
        getClusterChildren(clusterId: number, callback: (error: any, features: GeoJSON.Feature<GeoJSON.Geometry>[]) => void): this;
        getClusterLeaves(cluserId: number, limit: number, offset: number, callback: (error: any, features: GeoJSON.Feature<GeoJSON.Geometry>[]) => void): this;
    }
    interface GeoJSONSourceOptions {
        data?: GeoJSON.Feature<GeoJSON.Geometry> | GeoJSON.FeatureCollection<GeoJSON.Geometry> | string | undefined;
        maxzoom?: number | undefined;
        attribution?: string | undefined;
        buffer?: number | undefined;
        tolerance?: number | undefined;
        cluster?: number | boolean | undefined;
        clusterRadius?: number | undefined;
        clusterMaxZoom?: number | undefined;
        /**
         * Minimum number of points necessary to form a cluster if clustering is enabled. Defaults to `2`.
         */
        clusterMinPoints?: number | undefined;
        clusterProperties?: object | undefined;
        lineMetrics?: boolean | undefined;
        generateId?: boolean | undefined;
        promoteId?: PromoteIdSpecification | undefined;
        filter?: any;
    }
    /**
     * VideoSource
     */
    interface VideoSourceRaw extends Source, VideoSourceOptions {
        type: 'video';
    }
    class VideoSource implements VideoSourceRaw {
        type: 'video';
        constructor(options?: mapboxgl.VideoSourceOptions);
        getVideo(): HTMLVideoElement;
        setCoordinates(coordinates: number[][]): this;
    }
    interface VideoSourceOptions {
        urls?: string[] | undefined;
        coordinates?: number[][] | undefined;
    }
    /**
     * ImageSource
     */
    interface ImageSourceRaw extends Source, ImageSourceOptions {
        type: 'image';
    }
    class ImageSource implements ImageSourceRaw {
        type: 'image';
        constructor(options?: mapboxgl.ImageSourceOptions);
        updateImage(options: ImageSourceOptions): this;
        setCoordinates(coordinates: number[][]): this;
    }
    interface ImageSourceOptions {
        url?: string | undefined;
        coordinates?: number[][] | undefined;
    }
    /**
     * CanvasSource
     */
    interface CanvasSourceRaw extends Source, CanvasSourceOptions {
        type: 'canvas';
    }
    class CanvasSource implements CanvasSourceRaw {
        type: 'canvas';
        coordinates: number[][];
        canvas: string | HTMLCanvasElement;
        play(): void;
        pause(): void;
        getCanvas(): HTMLCanvasElement;
        setCoordinates(coordinates: number[][]): this;
    }
    interface CanvasSourceOptions {
        coordinates: number[][];
        animate?: boolean | undefined;
        canvas: string | HTMLCanvasElement;
    }
    type CameraFunctionSpecification<T> = {
        type: 'exponential';
        stops: Array<[number, T]>;
    } | {
        type: 'interval';
        stops: Array<[number, T]>;
    };
    type ExpressionSpecification = Array<unknown>;
    type PropertyValueSpecification<T> = T | CameraFunctionSpecification<T> | ExpressionSpecification;
    interface TerrainSpecification {
        source: string;
        exaggeration?: PropertyValueSpecification<number> | undefined;
    }
    /**
     * @see https://github.com/mapbox/tilejson-spec/tree/master/3.0.0#33-vector_layers
     */
    type SourceVectorLayer = {
        id: string;
        fields?: Record<string, string>;
        description?: string;
        minzoom?: number;
        maxzoom?: number;
        source?: string;
        source_name?: string;
    };
    interface VectorSource extends Source {
        type: 'vector';
        format?: 'pbf';
        url?: string | undefined;
        id?: string;
        name?: string;
        tiles?: string[] | undefined;
        bounds?: number[] | undefined;
        scheme?: 'xyz' | 'tms' | undefined;
        minzoom?: number | undefined;
        maxzoom?: number | undefined;
        attribution?: string | undefined;
        promoteId?: PromoteIdSpecification | undefined;
        vector_layers?: SourceVectorLayer[];
    }
    interface RasterSource extends Source {
        name?: string;
        type: 'raster';
        id?: string;
        format?: 'webp' | string;
        url?: string | undefined;
        tiles?: string[] | undefined;
        bounds?: number[] | undefined;
        minzoom?: number | undefined;
        maxzoom?: number | undefined;
        tileSize?: number | undefined;
        scheme?: 'xyz' | 'tms' | undefined;
        attribution?: string | undefined;
    }
    interface RasterDemSource extends Source {
        name?: string;
        type: 'raster-dem';
        id?: string;
        url?: string | undefined;
        tiles?: string[] | undefined;
        bounds?: number[] | undefined;
        minzoom?: number | undefined;
        maxzoom?: number | undefined;
        tileSize?: number | undefined;
        attribution?: string | undefined;
        encoding?: 'terrarium' | 'mapbox' | undefined;
    }
    /**
     * LngLat
     */
    class LngLat {
        lng: number;
        lat: number;
        constructor(lng: number, lat: number);
        /** Return a new LngLat object whose longitude is wrapped to the range (-180, 180). */
        wrap(): mapboxgl.LngLat;
        /** Return a LngLat as an array */
        toArray(): number[];
        /** Return a LngLat as a string */
        toString(): string;
        /** Returns the approximate distance between a pair of coordinates in meters
         * Uses the Haversine Formula (from R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol. 68, no. 2, 1984, p. 159) */
        distanceTo(lngLat: LngLat): number;
        toBounds(radius: number): LngLatBounds;
        static convert(input: LngLatLike): mapboxgl.LngLat;
    }
    /**
     * LngLatBounds
     */
    class LngLatBounds {
        sw: LngLatLike;
        ne: LngLatLike;
        constructor(boundsLike?: [LngLatLike, LngLatLike] | [number, number, number, number]);
        constructor(sw: LngLatLike, ne: LngLatLike);
        setNorthEast(ne: LngLatLike): this;
        setSouthWest(sw: LngLatLike): this;
        /** Check if the point is within the bounding box. */
        contains(lnglat: LngLatLike): boolean;
        /** Extend the bounds to include a given LngLat or LngLatBounds. */
        extend(obj: mapboxgl.LngLatLike | mapboxgl.LngLatBoundsLike): this;
        /** Get the point equidistant from this box's corners */
        getCenter(): mapboxgl.LngLat;
        /** Get southwest corner */
        getSouthWest(): mapboxgl.LngLat;
        /** Get northeast corner */
        getNorthEast(): mapboxgl.LngLat;
        /** Get northwest corner */
        getNorthWest(): mapboxgl.LngLat;
        /** Get southeast corner */
        getSouthEast(): mapboxgl.LngLat;
        /** Get west edge longitude */
        getWest(): number;
        /** Get south edge latitude */
        getSouth(): number;
        /** Get east edge longitude */
        getEast(): number;
        /** Get north edge latitude */
        getNorth(): number;
        /** Returns a LngLatBounds as an array */
        toArray(): number[][];
        /** Return a LngLatBounds as a string */
        toString(): string;
        /** Returns a boolean */
        isEmpty(): boolean;
        /** Convert an array to a LngLatBounds object, or return an existing LngLatBounds object unchanged. */
        static convert(input: LngLatBoundsLike): mapboxgl.LngLatBounds;
    }
    /**
     * Point
     */
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
        clone(): Point;
        add(p: Point): Point;
        sub(p: Point): Point;
        mult(k: number): Point;
        div(k: number): Point;
        rotate(a: number): Point;
        matMult(m: number): Point;
        unit(): Point;
        perp(): Point;
        round(): Point;
        mag(): number;
        equals(p: Point): boolean;
        dist(p: Point): number;
        distSqr(p: Point): number;
        angle(): number;
        angleTo(p: Point): number;
        angleWidth(p: Point): number;
        angleWithSep(x: number, y: number): number;
        static convert(a: PointLike): Point;
    }
    /**
     * MercatorCoordinate
     */
    class MercatorCoordinate {
        /** The x component of the position. */
        x: number;
        /** The y component of the position. */
        y: number;
        /**
         * The z component of the position.
         *
         * @default 0
         */
        z?: number | undefined;
        constructor(x: number, y: number, z?: number);
        /** Returns the altitude in meters of the coordinate. */
        toAltitude(): number;
        /** Returns the LngLat for the coordinate. */
        toLngLat(): LngLat;
        /**
         * Returns the distance of 1 meter in MercatorCoordinate units at this latitude.
         *
         * For coordinates in real world units using meters, this naturally provides the
         * scale to transform into MercatorCoordinates.
         */
        meterInMercatorCoordinateUnits(): number;
        /** Project a LngLat to a MercatorCoordinate. */
        static fromLngLat(lngLatLike: LngLatLike, altitude?: number): MercatorCoordinate;
    }
    /**
     * Marker
     */
    class Marker extends Evented {
        constructor(options?: mapboxgl.MarkerOptions);
        constructor(element?: HTMLElement, options?: mapboxgl.MarkerOptions);
        addTo(map: Map): this;
        remove(): this;
        getLngLat(): LngLat;
        setLngLat(lngLat: LngLatLike): this;
        getElement(): HTMLElement;
        setPopup(popup?: Popup): this;
        getPopup(): Popup;
        togglePopup(): this;
        getOffset(): PointLike;
        setOffset(offset: PointLike): this;
        setDraggable(shouldBeDraggable: boolean): this;
        isDraggable(): boolean;
        getRotation(): number;
        setRotation(rotation: number): this;
        getRotationAlignment(): Alignment;
        setRotationAlignment(alignment: Alignment): this;
        getPitchAlignment(): Alignment;
        setPitchAlignment(alignment: Alignment): this;
    }
    type Alignment = 'map' | 'viewport' | 'auto';
    interface MarkerOptions {
        /** DOM element to use as a marker. The default is a light blue, droplet-shaped SVG marker */
        element?: HTMLElement | undefined;
        /** The offset in pixels as a PointLike object to apply relative to the element's center. Negatives indicate left and up. */
        offset?: PointLike | undefined;
        /** A string indicating the part of the Marker that should be positioned closest to the coordinate set via Marker.setLngLat.
         * Options are `'center'`, `'top'`, `'bottom'`, `'left'`, `'right'`, `'top-left'`, `'top-right'`, `'bottom-left'`, and `'bottom-right'`.
         * The default value os `'center'`
         */
        anchor?: Anchor | undefined;
        /** The color to use for the default marker if options.element is not provided. The default is light blue (#3FB1CE). */
        color?: string | undefined;
        /** A boolean indicating whether or not a marker is able to be dragged to a new position on the map. The default value is false */
        draggable?: boolean | undefined;
        /**
         * The max number of pixels a user can shift the mouse pointer during a click on the marker for it to be considered a valid click
         * (as opposed to a marker drag). The default (0) is to inherit map's clickTolerance.
         */
        clickTolerance?: number | null | undefined;
        /** The rotation angle of the marker in degrees, relative to its `rotationAlignment` setting. A positive value will rotate the marker clockwise.
         * The default value is 0.
         */
        rotation?: number | undefined;
        /** `map` aligns the `Marker`'s rotation relative to the map, maintaining a bearing as the map rotates.
         * `viewport` aligns the `Marker`'s rotation relative to the viewport, agnostic to map rotations.
         * `auto` is equivalent to `viewport`.
         * The default value is `auto`
         */
        rotationAlignment?: Alignment | undefined;
        /** `map` aligns the `Marker` to the plane of the map.
         * `viewport` aligns the `Marker` to the plane of the viewport.
         * `auto` automatically matches the value of `rotationAlignment`.
         * The default value is `auto`.
         */
        pitchAlignment?: Alignment | undefined;
        /** The scale to use for the default marker if options.element is not provided.
         * The default scale (1) corresponds to a height of `41px` and a width of `27px`.
         */
        scale?: number | undefined;
    }
    type EventedListener = (object?: Object) => any;
    /**
     * Evented
     */
    class Evented {
        on(type: string, listener: EventedListener): this;
        off(type?: string | any, listener?: EventedListener): this;
        once(type: string, listener: EventedListener): this;
        fire(type: string, properties?: {
            [key: string]: any;
        }): this;
    }
    /**
     * StyleOptions
     */
    interface StyleOptions {
        transition?: boolean | undefined;
    }
    type MapboxGeoJSONFeature = GeoJSON.Feature<GeoJSON.Geometry> & {
        layer: Layer;
        source: string;
        sourceLayer: string;
        state: {
            [key: string]: any;
        };
    };
    type EventData = {
        [key: string]: any;
    };
    class MapboxEvent<TOrig = undefined> {
        type: string;
        target: Map;
        originalEvent: TOrig;
    }
    class MapMouseEvent extends MapboxEvent<MouseEvent> {
        type: 'mousedown' | 'mouseup' | 'click' | 'dblclick' | 'mousemove' | 'mouseover' | 'mouseenter' | 'mouseleave' | 'mouseout' | 'contextmenu';
        point: Point;
        lngLat: LngLat;
        preventDefault(): void;
        defaultPrevented: boolean;
    }
    type MapLayerMouseEvent = MapMouseEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
    };
    class MapTouchEvent extends MapboxEvent<TouchEvent> {
        type: 'touchstart' | 'touchend' | 'touchcancel';
        point: Point;
        lngLat: LngLat;
        points: Point[];
        lngLats: LngLat[];
        preventDefault(): void;
        defaultPrevented: boolean;
    }
    type MapLayerTouchEvent = MapTouchEvent & {
        features?: MapboxGeoJSONFeature[] | undefined;
    };
    class MapWheelEvent extends MapboxEvent<WheelEvent> {
        type: 'wheel';
        preventDefault(): void;
        defaultPrevented: boolean;
    }
    interface MapBoxZoomEvent extends MapboxEvent<MouseEvent> {
        type: 'boxzoomstart' | 'boxzoomend' | 'boxzoomcancel';
        boxZoomBounds: LngLatBounds;
    }
    type MapDataEvent = MapSourceDataEvent | MapStyleDataEvent;
    interface MapStyleDataEvent extends MapboxEvent {
        dataType: 'style';
    }
    interface MapSourceDataEvent extends MapboxEvent {
        dataType: 'source';
        isSourceLoaded: boolean;
        source: Source;
        sourceId: string;
        sourceDataType: 'metadata' | 'content';
        tile: any;
        coord: Coordinate;
    }
    interface Coordinate {
        canonical: CanonicalCoordinate;
        wrap: number;
        key: number;
    }
    interface CanonicalCoordinate {
        x: number;
        y: number;
        z: number;
        key: number;
        equals(coord: CanonicalCoordinate): boolean;
    }
    interface MapContextEvent extends MapboxEvent<WebGLContextEvent> {
        type: 'webglcontextlost' | 'webglcontextrestored';
    }
    class ErrorEvent extends MapboxEvent {
        type: 'error';
        error: Error;
    }
    /**
     * FilterOptions
     */
    interface FilterOptions {
        /**
         * Whether to check if the filter conforms to the Mapbox GL Style Specification.
         * Disabling validation is a performance optimization that should only be used
         * if you have previously validated the values you will be passing to this function.
         */
        validate?: boolean | null | undefined;
    }
    /**
     * AnimationOptions
     */
    interface AnimationOptions {
        /** Number in milliseconds */
        duration?: number | undefined;
        /**
         * A function taking a time in the range 0..1 and returning a number where 0 is the initial
         * state and 1 is the final state.
         */
        easing?: ((time: number) => number) | undefined;
        /** point, origin of movement relative to map center */
        offset?: PointLike | undefined;
        /** When set to false, no animation happens */
        animate?: boolean | undefined;
        /** If `true`, then the animation is considered essential and will not be affected by `prefers-reduced-motion`.
         * Otherwise, the transition will happen instantly if the user has enabled the `reduced motion` accesibility feature in their operating system.
         */
        essential?: boolean | undefined;
    }
    /**
     * CameraOptions
     */
    interface CameraOptions {
        /** Map center */
        center?: LngLatLike | undefined;
        /** Map zoom level */
        zoom?: number | undefined;
        /** Map rotation bearing in degrees counter-clockwise from north */
        bearing?: number | undefined;
        /** Map angle in degrees at which the camera is looking at the ground */
        pitch?: number | undefined;
        /** If zooming, the zoom center (defaults to map center) */
        around?: LngLatLike | undefined;
        /** Dimensions in pixels applied on each side of the viewport for shifting the vanishing point. */
        padding?: number | PaddingOptions | undefined;
    }
    interface CameraForBoundsOptions extends CameraOptions {
        offset?: PointLike | undefined;
        maxZoom?: number | undefined;
    }
    type CameraForBoundsResult = Required<Pick<CameraOptions, 'zoom' | 'bearing'>> & {
        /** Map center */
        center: {
            lng: number;
            lat: number;
        };
    };
    /**
     * FlyToOptions
     */
    interface FlyToOptions extends AnimationOptions, CameraOptions {
        curve?: number | undefined;
        minZoom?: number | undefined;
        speed?: number | undefined;
        screenSpeed?: number | undefined;
        maxDuration?: number | undefined;
    }
    /**
     * EaseToOptions
     */
    interface EaseToOptions extends AnimationOptions, CameraOptions {
        delayEndEvents?: number | undefined;
    }
    interface FitBoundsOptions extends mapboxgl.FlyToOptions {
        linear?: boolean | undefined;
        offset?: mapboxgl.PointLike | undefined;
        maxZoom?: number | undefined;
        maxDuration?: number | undefined;
    }
    /**
     * MapEvent
     */
    type MapEventType = {
        error: ErrorEvent;
        load: MapboxEvent;
        idle: MapboxEvent;
        remove: MapboxEvent;
        render: MapboxEvent;
        resize: MapboxEvent;
        webglcontextlost: MapContextEvent;
        webglcontextrestored: MapContextEvent;
        dataloading: MapDataEvent;
        data: MapDataEvent;
        tiledataloading: MapDataEvent;
        sourcedataloading: MapSourceDataEvent;
        styledataloading: MapStyleDataEvent;
        sourcedata: MapSourceDataEvent;
        styledata: MapStyleDataEvent;
        boxzoomcancel: MapBoxZoomEvent;
        boxzoomstart: MapBoxZoomEvent;
        boxzoomend: MapBoxZoomEvent;
        touchcancel: MapTouchEvent;
        touchmove: MapTouchEvent;
        touchend: MapTouchEvent;
        touchstart: MapTouchEvent;
        click: MapMouseEvent;
        contextmenu: MapMouseEvent;
        dblclick: MapMouseEvent;
        mousemove: MapMouseEvent;
        mouseup: MapMouseEvent;
        mousedown: MapMouseEvent;
        mouseout: MapMouseEvent;
        mouseover: MapMouseEvent;
        movestart: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        move: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        moveend: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        zoomstart: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        zoom: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        zoomend: MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
        rotatestart: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        rotate: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        rotateend: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        dragstart: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        drag: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        dragend: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        pitchstart: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        pitch: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        pitchend: MapboxEvent<MouseEvent | TouchEvent | undefined>;
        wheel: MapWheelEvent;
    };
    type MapLayerEventType = {
        click: MapLayerMouseEvent;
        dblclick: MapLayerMouseEvent;
        mousedown: MapLayerMouseEvent;
        mouseup: MapLayerMouseEvent;
        mousemove: MapLayerMouseEvent;
        mouseenter: MapLayerMouseEvent;
        mouseleave: MapLayerMouseEvent;
        mouseover: MapLayerMouseEvent;
        mouseout: MapLayerMouseEvent;
        contextmenu: MapLayerMouseEvent;
        touchstart: MapLayerTouchEvent;
        touchend: MapLayerTouchEvent;
        touchcancel: MapLayerTouchEvent;
    };
    type AnyLayout = BackgroundLayout | FillLayout | FillExtrusionLayout | LineLayout | SymbolLayout | RasterLayout | CircleLayout | HeatmapLayout | HillshadeLayout | SkyLayout;
    type AnyPaint = BackgroundPaint | FillPaint | FillExtrusionPaint | LinePaint | SymbolPaint | RasterPaint | CirclePaint | HeatmapPaint | HillshadePaint | SkyPaint;
    interface Layer {
        id: string;
        type: string;
        metadata?: any;
        ref?: string | undefined;
        source?: string | AnySourceData | undefined;
        'source-layer'?: string | undefined;
        minzoom?: number | undefined;
        maxzoom?: number | undefined;
        interactive?: boolean | undefined;
        filter?: any[] | undefined;
        layout?: AnyLayout | undefined;
        paint?: AnyPaint | undefined;
    }
    interface BackgroundLayer extends Layer {
        type: 'background';
        layout?: BackgroundLayout | undefined;
        paint?: BackgroundPaint | undefined;
    }
    interface CircleLayer extends Layer {
        type: 'circle';
        layout?: CircleLayout | undefined;
        paint?: CirclePaint | undefined;
    }
    interface FillExtrusionLayer extends Layer {
        type: 'fill-extrusion';
        layout?: FillExtrusionLayout | undefined;
        paint?: FillExtrusionPaint | undefined;
    }
    interface FillLayer extends Layer {
        type: 'fill';
        layout?: FillLayout | undefined;
        paint?: FillPaint | undefined;
    }
    interface HeatmapLayer extends Layer {
        type: 'heatmap';
        layout?: HeatmapLayout | undefined;
        paint?: HeatmapPaint | undefined;
    }
    interface HillshadeLayer extends Layer {
        type: 'hillshade';
        layout?: HillshadeLayout | undefined;
        paint?: HillshadePaint | undefined;
    }
    interface LineLayer extends Layer {
        type: 'line';
        layout?: LineLayout | undefined;
        paint?: LinePaint | undefined;
    }
    interface RasterLayer extends Layer {
        type: 'raster';
        layout?: RasterLayout | undefined;
        paint?: RasterPaint | undefined;
    }
    interface SymbolLayer extends Layer {
        type: 'symbol';
        layout?: SymbolLayout | undefined;
        paint?: SymbolPaint | undefined;
    }
    interface SkyLayer extends Layer {
        type: 'sky';
        layout?: SkyLayout | undefined;
        paint?: SkyPaint | undefined;
    }
    type AnyLayer = BackgroundLayer | CircleLayer | FillExtrusionLayer | FillLayer | HeatmapLayer | HillshadeLayer | LineLayer | RasterLayer | SymbolLayer | CustomLayerInterface | SkyLayer;
    interface CustomLayerInterface {
        /** A unique layer id. */
        id: string;
        type: 'custom';
        renderingMode?: '2d' | '3d' | undefined;
        /**
         * Optional method called when the layer has been removed from the Map with Map#removeLayer.
         * This gives the layer a chance to clean up gl resources and event listeners.
         * @param map The Map this custom layer was just added to.
         * @param gl The gl context for the map.
         */
        onRemove?(map: mapboxgl.Map, gl: WebGLRenderingContext): void;
        /**
         * Optional method called when the layer has been added to the Map with Map#addLayer.
         * This gives the layer a chance to initialize gl resources and register event listeners.
         * @param map The Map this custom layer was just added to.
         * @param gl The gl context for the map.
         */
        onAdd?(map: mapboxgl.Map, gl: WebGLRenderingContext): void;
        /**
         * Optional method called during a render frame to allow a layer to prepare resources
         * or render into a texture.
         *
         * The layer cannot make any assumptions about the current GL state and must bind a framebuffer
         * before rendering.
         * @param gl The map's gl context.
         * @param matrix The map's camera matrix. It projects spherical mercator coordinates to gl
         *               coordinates. The mercator coordinate  [0, 0] represents the top left corner of
         *               the mercator world and  [1, 1] represents the bottom right corner. When the
         *               renderingMode is  "3d" , the z coordinate is conformal. A box with identical
         *               x, y, and z lengths in mercator units would be rendered as a cube.
         *               MercatorCoordinate .fromLatLng can be used to project a  LngLat to a mercator
         *               coordinate.
         */
        prerender?(gl: WebGLRenderingContext, matrix: number[]): void;
        /**
         * Called during a render frame allowing the layer to draw into the GL context.
         *
         * The layer can assume blending and depth state is set to allow the layer to properly blend
         * and clip other layers. The layer cannot make any other assumptions about the current GL state.
         *
         * If the layer needs to render to a texture, it should implement the prerender method to do this
         * and only use the render method for drawing directly into the main framebuffer.
         *
         * The blend function is set to gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA). This expects
         * colors to be provided in premultiplied alpha form where the r, g and b values are already
         * multiplied by the a value. If you are unable to provide colors in premultiplied form you may
         * want to change the blend function to
         * gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA).
         *
         * @param gl The map's gl context.
         * @param matrix The map's camera matrix. It projects spherical mercator coordinates to gl
         *               coordinates. The mercator coordinate  [0, 0] represents the top left corner of
         *               the mercator world and  [1, 1] represents the bottom right corner. When the
         *               renderingMode is  "3d" , the z coordinate is conformal. A box with identical
         *               x, y, and z lengths in mercator units would be rendered as a cube.
         *               MercatorCoordinate .fromLatLng can be used to project a  LngLat to a mercator
         *               coordinate.
         */
        render(gl: WebGLRenderingContext, matrix: number[]): void;
    }
    interface StyleFunction {
        stops?: any[][] | undefined;
        property?: string | undefined;
        base?: number | undefined;
        type?: 'identity' | 'exponential' | 'interval' | 'categorical' | undefined;
        default?: any;
        colorSpace?: 'rgb' | 'lab' | 'hcl' | undefined;
    }
    type Visibility = 'visible' | 'none';
    interface Layout {
        visibility?: Visibility | undefined;
    }
    interface BackgroundLayout extends Layout {
    }
    interface BackgroundPaint {
        'background-color'?: string | Expression | undefined;
        'background-color-transition'?: Transition | undefined;
        'background-pattern'?: string | undefined;
        'background-pattern-transition'?: Transition | undefined;
        'background-opacity'?: number | Expression | undefined;
        'background-opacity-transition'?: Transition | undefined;
    }
    interface FillLayout extends Layout {
        'fill-sort-key'?: number | Expression | undefined;
    }
    interface FillPaint {
        'fill-antialias'?: boolean | Expression | undefined;
        'fill-opacity'?: number | StyleFunction | Expression | undefined;
        'fill-opacity-transition'?: Transition | undefined;
        'fill-color'?: string | StyleFunction | Expression | undefined;
        'fill-color-transition'?: Transition | undefined;
        'fill-outline-color'?: string | StyleFunction | Expression | undefined;
        'fill-outline-color-transition'?: Transition | undefined;
        'fill-translate'?: number[] | undefined;
        'fill-translate-transition'?: Transition | undefined;
        'fill-translate-anchor'?: 'map' | 'viewport' | undefined;
        'fill-pattern'?: string | Expression | undefined;
        'fill-pattern-transition'?: Transition | undefined;
    }
    interface FillExtrusionLayout extends Layout {
    }
    interface FillExtrusionPaint {
        'fill-extrusion-opacity'?: number | Expression | undefined;
        'fill-extrusion-opacity-transition'?: Transition | undefined;
        'fill-extrusion-color'?: string | StyleFunction | Expression | undefined;
        'fill-extrusion-color-transition'?: Transition | undefined;
        'fill-extrusion-translate'?: number[] | Expression | undefined;
        'fill-extrusion-translate-transition'?: Transition | undefined;
        'fill-extrusion-translate-anchor'?: 'map' | 'viewport' | undefined;
        'fill-extrusion-pattern'?: string | Expression | undefined;
        'fill-extrusion-pattern-transition'?: Transition | undefined;
        'fill-extrusion-height'?: number | StyleFunction | Expression | undefined;
        'fill-extrusion-height-transition'?: Transition | undefined;
        'fill-extrusion-base'?: number | StyleFunction | Expression | undefined;
        'fill-extrusion-base-transition'?: Transition | undefined;
        'fill-extrusion-vertical-gradient'?: boolean | undefined;
    }
    interface LineLayout extends Layout {
        'line-cap'?: 'butt' | 'round' | 'square' | Expression | undefined;
        'line-join'?: 'bevel' | 'round' | 'miter' | Expression | undefined;
        'line-miter-limit'?: number | Expression | undefined;
        'line-round-limit'?: number | Expression | undefined;
        'line-sort-key'?: number | Expression | undefined;
    }
    interface LinePaint {
        'line-opacity'?: number | StyleFunction | Expression | undefined;
        'line-opacity-transition'?: Transition | undefined;
        'line-color'?: string | StyleFunction | Expression | undefined;
        'line-color-transition'?: Transition | undefined;
        'line-translate'?: number[] | Expression | undefined;
        'line-translate-transition'?: Transition | undefined;
        'line-translate-anchor'?: 'map' | 'viewport' | undefined;
        'line-width'?: number | StyleFunction | Expression | undefined;
        'line-width-transition'?: Transition | undefined;
        'line-gap-width'?: number | StyleFunction | Expression | undefined;
        'line-gap-width-transition'?: Transition | undefined;
        'line-offset'?: number | StyleFunction | Expression | undefined;
        'line-offset-transition'?: Transition | undefined;
        'line-blur'?: number | StyleFunction | Expression | undefined;
        'line-blur-transition'?: Transition | undefined;
        'line-dasharray'?: number[] | Expression | undefined;
        'line-dasharray-transition'?: Transition | undefined;
        'line-pattern'?: string | Expression | undefined;
        'line-pattern-transition'?: Transition | undefined;
        'line-gradient'?: Expression | undefined;
    }
    interface SymbolLayout extends Layout {
        'symbol-placement'?: 'point' | 'line' | 'line-center' | undefined;
        'symbol-spacing'?: number | Expression | undefined;
        'symbol-avoid-edges'?: boolean | undefined;
        'symbol-z-order'?: 'viewport-y' | 'source' | undefined;
        'icon-allow-overlap'?: boolean | StyleFunction | Expression | undefined;
        'icon-ignore-placement'?: boolean | Expression | undefined;
        'icon-optional'?: boolean | undefined;
        'icon-rotation-alignment'?: 'map' | 'viewport' | 'auto' | undefined;
        'icon-size'?: number | StyleFunction | Expression | undefined;
        'icon-text-fit'?: 'none' | 'both' | 'width' | 'height' | undefined;
        'icon-text-fit-padding'?: number[] | Expression | undefined;
        'icon-image'?: string | StyleFunction | Expression | undefined;
        'icon-rotate'?: number | StyleFunction | Expression | undefined;
        'icon-padding'?: number | Expression | undefined;
        'icon-keep-upright'?: boolean | undefined;
        'icon-offset'?: number[] | StyleFunction | Expression | undefined;
        'icon-anchor'?: Anchor | StyleFunction | Expression | undefined;
        'icon-pitch-alignment'?: 'map' | 'viewport' | 'auto' | undefined;
        'text-pitch-alignment'?: 'map' | 'viewport' | 'auto' | undefined;
        'text-rotation-alignment'?: 'map' | 'viewport' | 'auto' | undefined;
        'text-field'?: string | StyleFunction | Expression | undefined;
        'text-font'?: string[] | Expression | undefined;
        'text-size'?: number | StyleFunction | Expression | undefined;
        'text-max-width'?: number | StyleFunction | Expression | undefined;
        'text-line-height'?: number | Expression | undefined;
        'text-letter-spacing'?: number | Expression | undefined;
        'text-justify'?: 'auto' | 'left' | 'center' | 'right' | Expression | undefined;
        'text-anchor'?: Anchor | StyleFunction | Expression | undefined;
        'text-max-angle'?: number | Expression | undefined;
        'text-rotate'?: number | StyleFunction | Expression | undefined;
        'text-padding'?: number | Expression | undefined;
        'text-keep-upright'?: boolean | undefined;
        'text-transform'?: 'none' | 'uppercase' | 'lowercase' | StyleFunction | Expression | undefined;
        'text-offset'?: number[] | Expression | undefined;
        'text-allow-overlap'?: boolean | undefined;
        'text-ignore-placement'?: boolean | undefined;
        'text-optional'?: boolean | undefined;
        'text-radial-offset'?: number | Expression | undefined;
        'text-variable-anchor'?: Anchor[] | undefined;
        'text-writing-mode'?: ('horizontal' | 'vertical')[] | undefined;
        'symbol-sort-key'?: number | Expression | undefined;
    }
    interface SymbolPaint {
        'icon-opacity'?: number | StyleFunction | Expression | undefined;
        'icon-opacity-transition'?: Transition | undefined;
        'icon-color'?: string | StyleFunction | Expression | undefined;
        'icon-color-transition'?: Transition | undefined;
        'icon-halo-color'?: string | StyleFunction | Expression | undefined;
        'icon-halo-color-transition'?: Transition | undefined;
        'icon-halo-width'?: number | StyleFunction | Expression | undefined;
        'icon-halo-width-transition'?: Transition | undefined;
        'icon-halo-blur'?: number | StyleFunction | Expression | undefined;
        'icon-halo-blur-transition'?: Transition | undefined;
        'icon-translate'?: number[] | Expression | undefined;
        'icon-translate-transition'?: Transition | undefined;
        'icon-translate-anchor'?: 'map' | 'viewport' | undefined;
        'text-opacity'?: number | StyleFunction | Expression | undefined;
        'text-opacity-transition'?: Transition | undefined;
        'text-color'?: string | StyleFunction | Expression | undefined;
        'text-color-transition'?: Transition | undefined;
        'text-halo-color'?: string | StyleFunction | Expression | undefined;
        'text-halo-color-transition'?: Transition | undefined;
        'text-halo-width'?: number | StyleFunction | Expression | undefined;
        'text-halo-width-transition'?: Transition | undefined;
        'text-halo-blur'?: number | StyleFunction | Expression | undefined;
        'text-halo-blur-transition'?: Transition | undefined;
        'text-translate'?: number[] | Expression | undefined;
        'text-translate-transition'?: Transition | undefined;
        'text-translate-anchor'?: 'map' | 'viewport' | undefined;
    }
    interface RasterLayout extends Layout {
    }
    interface RasterPaint {
        'raster-opacity'?: number | Expression | undefined;
        'raster-opacity-transition'?: Transition | undefined;
        'raster-hue-rotate'?: number | Expression | undefined;
        'raster-hue-rotate-transition'?: Transition | undefined;
        'raster-brightness-min'?: number | Expression | undefined;
        'raster-brightness-min-transition'?: Transition | undefined;
        'raster-brightness-max'?: number | Expression | undefined;
        'raster-brightness-max-transition'?: Transition | undefined;
        'raster-saturation'?: number | Expression | undefined;
        'raster-saturation-transition'?: Transition | undefined;
        'raster-contrast'?: number | Expression | undefined;
        'raster-contrast-transition'?: Transition | undefined;
        'raster-fade-duration'?: number | Expression | undefined;
        'raster-resampling'?: 'linear' | 'nearest' | undefined;
    }
    interface CircleLayout extends Layout {
        'circle-sort-key'?: number | Expression | undefined;
    }
    interface CirclePaint {
        'circle-radius'?: number | StyleFunction | Expression | undefined;
        'circle-radius-transition'?: Transition | undefined;
        'circle-color'?: string | StyleFunction | Expression | undefined;
        'circle-color-transition'?: Transition | undefined;
        'circle-blur'?: number | StyleFunction | Expression | undefined;
        'circle-blur-transition'?: Transition | undefined;
        'circle-opacity'?: number | StyleFunction | Expression | undefined;
        'circle-opacity-transition'?: Transition | undefined;
        'circle-translate'?: number[] | Expression | undefined;
        'circle-translate-transition'?: Transition | undefined;
        'circle-translate-anchor'?: 'map' | 'viewport' | undefined;
        'circle-pitch-scale'?: 'map' | 'viewport' | undefined;
        'circle-pitch-alignment'?: 'map' | 'viewport' | undefined;
        'circle-stroke-width'?: number | StyleFunction | Expression | undefined;
        'circle-stroke-width-transition'?: Transition | undefined;
        'circle-stroke-color'?: string | StyleFunction | Expression | undefined;
        'circle-stroke-color-transition'?: Transition | undefined;
        'circle-stroke-opacity'?: number | StyleFunction | Expression | undefined;
        'circle-stroke-opacity-transition'?: Transition | undefined;
    }
    interface HeatmapLayout extends Layout {
    }
    interface HeatmapPaint {
        'heatmap-radius'?: number | StyleFunction | Expression | undefined;
        'heatmap-radius-transition'?: Transition | undefined;
        'heatmap-weight'?: number | StyleFunction | Expression | undefined;
        'heatmap-intensity'?: number | StyleFunction | Expression | undefined;
        'heatmap-intensity-transition'?: Transition | undefined;
        'heatmap-color'?: string | StyleFunction | Expression | undefined;
        'heatmap-opacity'?: number | StyleFunction | Expression | undefined;
        'heatmap-opacity-transition'?: Transition | undefined;
    }
    interface HillshadeLayout extends Layout {
    }
    interface HillshadePaint {
        'hillshade-illumination-direction'?: number | Expression | undefined;
        'hillshade-illumination-anchor'?: 'map' | 'viewport' | undefined;
        'hillshade-exaggeration'?: number | Expression | undefined;
        'hillshade-exaggeration-transition'?: Transition | undefined;
        'hillshade-shadow-color'?: string | Expression | undefined;
        'hillshade-shadow-color-transition'?: Transition | undefined;
        'hillshade-highlight-color'?: string | Expression | undefined;
        'hillshade-highlight-color-transition'?: Transition | undefined;
        'hillshade-accent-color'?: string | Expression | undefined;
        'hillshade-accent-color-transition'?: Transition | undefined;
    }
    interface SkyLayout extends Layout {
    }
    interface SkyPaint {
        'sky-atmosphere-color'?: string | Expression | undefined;
        'sky-atmosphere-halo-color'?: string | Expression | undefined;
        'sky-atmosphere-sun'?: number[] | Expression | undefined;
        'sky-atmosphere-sun-intensity'?: number | Expression | undefined;
        'sky-gradient'?: string | Expression | undefined;
        'sky-gradient-center'?: number[] | Expression | undefined;
        'sky-gradient-radius'?: number | Expression | undefined;
        'sky-opacity'?: number | Expression | undefined;
        'sky-type'?: 'gradient' | 'atmosphere' | undefined;
    }
    type ElevationQueryOptions = {
        exaggerated: boolean;
    };
}
declare namespace NextAdmin.UI {
    class MenuModal extends Modal {
        options: MenuModalOptions;
        mainContainer: HTMLDivElement;
        footerContainer: HTMLDivElement;
        constructor(options?: MenuModalOptions);
        addItems(itms: MenuItem[]): MenuModal;
        addItem(dropDownItem: MenuItem): Button;
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement;
    }
    interface MenuModalOptions extends ModalOptions {
        text?: string;
        hasBackButton?: boolean;
        items?: Array<MenuItem | Control | HTMLElement>;
    }
}
declare namespace NextAdmin.UI {
    class MessageBox extends Control {
        modal: HTMLDivElement;
        modalContent: Container;
        image?: Image;
        body: HTMLDivElement;
        bodyLayout: HorizontalFlexLayout;
        title: Title;
        text: HTMLDivElement;
        footer: HTMLDivElement;
        footerSeparator: Separator;
        options: MessageBoxOptions;
        private _desktopButtonToolbar;
        private _button;
        static style: string;
        constructor(options: MessageBoxOptions);
        appendButton(button: Button): void;
        prependButton(button: Button): void;
        isMobileDisplayModeEnabled(): boolean;
        getButtons(): Array<Button>;
        startSpin(): void;
        private _currentStyle?;
        setStyle(style?: MessageBoxStyle): void;
        close(): Promise<void>;
        open(): Promise<void>;
        openToast(displayDuration?: number): Promise<void>;
        static createOk(title: string, message: string, okAction?: any, parentContainer?: HTMLElement): MessageBox;
        static createToast(title: string, message: string, parentContainer?: HTMLElement): MessageBox;
        static createLoadingBox(title?: string, message?: string, cancelAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
        static createYesNo(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, noAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
        static createYesCancel(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, cancelAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
    }
    interface MessageBoxOptions extends ControlOptions {
        title?: string;
        text?: string;
        imageSrc?: string;
        buttons?: Array<Button>;
        parentContainer?: Element;
        style?: MessageBoxStyle;
        openAnimation?: string;
        closeAnimation?: string;
        displayMode?: MessageBoxDisplayMode;
    }
    enum MessageBoxStyle {
        default = 0,
        modern = 1
    }
    enum MessageBoxDisplayMode {
        auto = 0,
        desktop = 1,
        mobile = 2
    }
}
declare namespace NextAdmin.UI {
    class MultiInputSelect extends InputSelect {
        options: MultiInputSelectOptions;
        constructor(options?: MultiInputSelectOptions);
        onInputKeyDown(event: KeyboardEvent): void;
        selectItem(value: string, addIfNotExist?: boolean): void;
        selectItems(values: string[], addIfNotExist?: boolean): void;
        unselectItem(value: string): void;
        protected updateValue(value: any[]): void;
        cancelSelect(): void;
        openDropDown(): void;
        private _selectedItemValues;
        setValue(value: any): void;
        getValue(): any;
        getSelectItemValues(): any[];
    }
    interface MultiInputSelectOptions extends InputSelectOptions {
        valueCharSeparator?: string;
        displayCharSeparator?: string;
        outputArray?: boolean;
        outputAllItemValuesIfNoSelect?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class NoUiModal extends NextAdmin.UI.Modal {
        options: noUiModalOptions;
        static style: string;
        constructor(options: noUiModalOptions);
    }
    interface noUiModalOptions extends ModalOptions {
    }
}
declare namespace NextAdmin.UI {
    class View extends Control {
        options: ViewOptions;
        childrenViews: Dictionary<View>;
        childrenControls: Dictionary<Control>;
        protected data?: any;
        protected contentUrl?: string;
        static viewsContentDictionary: Dictionary<string>;
        constructor(options?: ViewOptions);
        load(contentUrl?: string, data?: any, dependencies?: Array<string | DependencyInfo>): Promise<void>;
        getData(): any;
        updateData(data?: any): Promise<void>;
        setData(data?: any): Promise<void>;
        loadContent(contentUrl: string): Promise<string>;
        protected _loadedDependencies: DependencyInfo[];
        protected loadDependencies(dependencies?: Array<DependencyInfo>): Promise<void>;
        protected unloadDependencies(dependencies?: Array<DependencyInfo>): void;
        parse(content: string, data?: any): Promise<void>;
    }
    interface ViewOptions extends ControlOptions {
        element?: HTMLElement;
        contentUrl?: any;
        data?: any;
    }
}
interface HTMLElement {
    appendView<TView extends NextAdmin.UI.View>(view: TView, configAction?: (control: TView) => void): Promise<TView>;
    appendView(src: string, viewOption?: NextAdmin.UI.ViewOptions, configAction?: (control: NextAdmin.UI.View) => void): Promise<NextAdmin.UI.View>;
}
declare namespace NextAdmin.UI {
    class Page extends UI.View {
        navigationController: NavigationController;
        options: PageOptions;
        onNavigateFrom: EventHandler<Page, NavigateFromArgs>;
        onEndNavigateFrom: EventHandlerBase;
        onNavigateTo: EventHandler<Page, NavigateToArgs>;
        parameters?: any;
        static onCreated: EventHandler<Page, PageOptions>;
        constructor(options?: PageOptions);
        setParameters(parameters?: any, navigatorHistoryAction?: UpdateNavigatorState): void;
        getParameters(): any;
        navigateTo(args: NavigateToArgs): Promise<void>;
        navigateFrom(args: NavigateFromArgs): Promise<void>;
        endNavigateFrom(): void;
        dispose(): void;
        isActivePage(): boolean;
        bindEvent<TSender, TArgs>(eventHandler: EventHandler<TSender, TArgs>, eventAction: (sender: TSender, args: TArgs) => void): void;
        refresh(realod?: boolean): Promise<void>;
        getName(): string;
    }
    interface PageOptions extends ViewOptions {
        name?: string;
        container?: HTMLElement;
        disposeOnNavigateFrom?: boolean;
        pageInfo?: NextAdmin.PageInfo;
        navigationController?: NavigationController;
    }
    interface NavigateToArgs {
        previousPage: UI.Page;
        parameters: any;
        contentUrl?: string;
        dependencies?: Array<string | DependencyInfo>;
        navigatorHistoryAction?: NextAdmin.UpdateNavigatorState;
    }
    interface NavigateFromArgs {
        cancelNavigation: boolean;
        nextPage: UI.Page;
        nextPageParameters?: any;
    }
}
declare namespace NextAdmin.UI {
    class Popover extends Control {
        modal: HTMLElement;
        options: PopoverOptions;
        onClose: EventHandler<any, CloseModalArgs>;
        static style: string;
        static onCreated: EventHandler<Popover, PopoverOptions>;
        constructor(options?: PopoverOptions);
        private _pointerEnter;
        private _pointerLeave;
        startPopOnHover(): void;
        stopPopOnHover(): void;
        _isOpen: boolean;
        open(options?: {
            popElement?: HTMLElement;
            offsetX?: number;
            offsetY?: number;
        }): void;
        setPosition(x: number, y: number): void;
        close(): void;
    }
    interface PopoverOptions extends ControlOptions {
        parentElement?: HTMLElement;
        popElement?: HTMLElement;
        popOnHover?: boolean;
        removeOnClose?: boolean;
        openAnimation?: string;
        closeAnimation?: string;
        content: string;
        maxWidth?: string;
        minHeight?: string;
    }
}
interface HTMLElement {
    setPopover(content: string, parentElement?: HTMLElement): NextAdmin.UI.Popover;
    removePopover(): any;
}
declare namespace NextAdmin.UI {
    class Progress extends LabelFormControl {
        static defaultStyle?: InputStyle;
        progress: HTMLProgressElement;
        options: ProgressOptions;
        progressLabelContainer: HTMLElement;
        private _maxValue?;
        static style: string;
        static onCreated: EventHandler<Input, InputOptions>;
        constructor(options?: ProgressOptions);
        setLabel(text: string): Progress;
        setValue(value?: number, fireChange?: boolean): void;
        setMaxValue(value?: number): void;
        updateValueLabel(): void;
        getValue(): number;
    }
    interface ProgressOptions extends LabelFormControlOptions {
        min?: number;
        max?: number;
        value?: number;
        unit?: string;
        decimalCount?: number;
        progressLabelValueFunc?: (progress: Progress) => string;
    }
}
declare namespace NextAdmin.UI {
    class Range extends Input {
        options: RangeOptions;
        _valueLabel: HTMLDivElement;
        constructor(options?: RangeOptions);
        getValue(): number;
        setValue(value: number, fireChange?: boolean): void;
        appendValueLabel(): void;
        updateValueLabel(): void;
    }
    interface RangeOptions extends InputOptions {
        hasValueLabel?: boolean;
        unit?: string;
        maxValue?: number;
        minValue?: number;
        step?: number;
    }
}
declare namespace NextAdmin.UI {
    class RecoverPasswordModal extends NextAdmin.UI.Modal {
        options: RecoverPasswordModalOptions;
        loginInput: NextAdmin.UI.Input;
        sendEmailButton: NextAdmin.UI.Button;
        container: HTMLElement;
        constructor(options?: RecoverPasswordModalOptions);
        sendPasswordRecoveryEmail(): Promise<void>;
    }
    interface RecoverPasswordModalOptions extends NextAdmin.UI.ModalOptions {
        userClient?: NextAdmin.Services.UserClient;
        email?: string;
    }
}
declare namespace NextAdmin.UI {
    class ResisingContainer extends Control {
        container: HTMLDivElement;
        onSizeChanged: EventHandler<HTMLDivElement, DOMRect>;
        static onCreated: EventHandler<ResisingContainer, ControlOptions>;
        constructor();
    }
}
declare namespace NextAdmin.UI {
    class RichTextEditor extends LabelFormControl {
        static quillB64JS: string;
        static quillCSS: string;
        static defaultStyle?: RichTextEditorStyle;
        static style: string;
        quill: Quill;
        editorContainer: HTMLDivElement;
        quillContainer: HTMLDivElement;
        options: RichTextEditorOptions;
        static onCreated: EventHandler<RichTextEditor, RichTextEditorOptions>;
        constructor(options?: RichTextEditorOptions);
        setStyle(style?: RichTextEditorStyle): void;
        getLabel(): string;
        getToolbar(): HTMLDivElement;
        addToolbarButton(buttonOption: ButtonOptions, configAction?: (btn: Button) => void): Button;
        addToolbarDropDownButton(buttonOption: DropDownButtonOptions, configAction?: (btn: DropDownButton) => void): DropDownButton;
        private _value;
        private suspendChange;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): string;
        insertText(text?: string): void;
    }
    interface RichTextEditorOptions extends LabelFormControlOptions {
        label?: string;
        placeHolder?: string;
        displayToolbar?: boolean;
        style?: RichTextEditorStyle;
        inlineGrid?: boolean;
    }
    enum RichTextEditorStyle {
        default = 0,
        modern = 1,
        noBackground = 2
    }
}
/**
 * A stricter type definition would be:
 *
 *   type anyOperation ({ insert: any } | { delete: number } | { retain: number }) & OptionalAttributes;
 *
 *  But this would break a lot of existing code as it would require manual discrimination of the union types.
 */
declare type anyOperation = {
    insert?: any;
    delete?: number | undefined;
    retain?: number | undefined;
} & OptionalAttributes;
interface SourceMap {
    API: "api";
    SILENT: "silent";
    USER: "user";
}
declare type Sources = "api" | "user" | "silent";
declare interface Key {
    key: string | number;
    shortKey?: boolean | null | undefined;
    shiftKey?: boolean | null | undefined;
    altKey?: boolean | null | undefined;
    metaKey?: boolean | null | undefined;
    ctrlKey?: boolean | null | undefined;
}
declare interface StringMap {
    [key: string]: any;
}
declare interface OptionalAttributes {
    attributes?: StringMap | undefined;
}
declare type TextChangeHandler = (any: any, oldContents: any, source: Sources) => any;
declare type SelectionChangeHandler = (range: RangeStatic, oldRange: RangeStatic, source: Sources) => any;
declare type EditorChangeHandler = ((name: "text-change", any: any, oldContents: any, source: Sources) => any) | ((name: "selection-change", range: RangeStatic, oldRange: RangeStatic, source: Sources) => any);
declare interface KeyboardStatic {
    addBinding(key: Key, callback: (range: RangeStatic, context: any) => void): void;
    addBinding(key: Key, context: any, callback: (range: RangeStatic, context: any) => void): void;
}
declare type ClipboardMatcherCallback = (node: any, any: any) => any;
declare type ClipboardMatcherNode = string | number;
declare interface ClipboardStatic {
    matchers: Array<[ClipboardMatcherNode, ClipboardMatcherCallback]>;
    convert(content?: {
        html?: string | undefined;
        text?: string | undefined;
    }, formats?: StringMap): any;
    addMatcher(selectorOrNodeType: ClipboardMatcherNode, callback: ClipboardMatcherCallback): void;
    dangerouslyPasteHTML(html: string, source?: Sources): void;
    dangerouslyPasteHTML(index: number, html: string, source?: Sources): void;
}
declare interface QuillOptionsStatic {
    debug?: string | boolean | undefined;
    modules?: StringMap | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    theme?: string | undefined;
    formats?: string[] | undefined;
    bounds?: HTMLElement | string | undefined;
    scrollingContainer?: HTMLElement | string | undefined;
    strict?: boolean | undefined;
}
declare interface BoundsStatic {
    bottom: number;
    left: number;
    right: number;
    top: number;
    height: number;
    width: number;
}
declare interface RangeStatic {
    index: number;
    length: number;
}
declare class RangeStatic implements RangeStatic {
    constructor();
    index: number;
    length: number;
}
declare interface EventEmitter {
    on(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    on(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    on(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    once(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    once(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    once(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    off(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    off(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    off(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
}
declare class Quill implements EventEmitter {
    /**
     * Internal API
     */
    root: HTMLDivElement;
    clipboard: ClipboardStatic;
    scroll: any;
    keyboard: KeyboardStatic;
    constructor(container: string | Element, options?: QuillOptionsStatic);
    deleteText(index: number, length: number, source?: Sources): any;
    disable(): void;
    enable(enabled?: boolean): void;
    isEnabled(): boolean;
    getContents(index?: number, length?: number): any;
    getLength(): number;
    getText(index?: number, length?: number): string;
    insertEmbed(index: number, type: string, value: any, source?: Sources): any;
    insertText(index: number, text: string, source?: Sources): any;
    insertText(index: number, text: string, format: string, value: any, source?: Sources): any;
    insertText(index: number, text: string, formats: StringMap, source?: Sources): any;
    /**
     * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(index: number, html: string, source: Sources)
     */
    pasteHTML(index: number, html: string, source?: Sources): string;
    /**
     * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(html: string, source: Sources): void;
     */
    pasteHTML(html: string, source?: Sources): string;
    setContents(any: any, source?: Sources): any;
    setText(text: string, source?: Sources): any;
    update(source?: Sources): void;
    updateContents(any: any, source?: Sources): any;
    static readonly sources: SourceMap;
    format(name: string, value: any, source?: Sources): any;
    formatLine(index: number, length: number, source?: Sources): any;
    formatLine(index: number, length: number, format: string, value: any, source?: Sources): any;
    formatLine(index: number, length: number, formats: StringMap, source?: Sources): any;
    formatText(index: number, length: number, source?: Sources): any;
    formatText(index: number, length: number, format: string, value: any, source?: Sources): any;
    formatText(index: number, length: number, formats: StringMap, source?: Sources): any;
    formatText(range: RangeStatic, format: string, value: any, source?: Sources): any;
    formatText(range: RangeStatic, formats: StringMap, source?: Sources): any;
    getFormat(range?: RangeStatic): StringMap;
    getFormat(index: number, length?: number): StringMap;
    removeFormat(index: number, length: number, source?: Sources): any;
    blur(): void;
    focus(): void;
    getBounds(index: number, length?: number): BoundsStatic;
    getSelection(focus: true): RangeStatic;
    getSelection(focus?: false): RangeStatic | null;
    hasFocus(): boolean;
    setSelection(index: number, length: number, source?: Sources): void;
    setSelection(range: RangeStatic, source?: Sources): void;
    static debug(level: string | boolean): void;
    static import(path: string): any;
    static register(path: string, def: any, suppressWarning?: boolean): void;
    static register(defs: StringMap, suppressWarning?: boolean): void;
    static find(domNode: Node, bubble?: boolean): Quill | any;
    addContainer(classNameOrDomNode: string | Node, refNode?: Node): any;
    getModule(name: string): any;
    getIndex(blot: any): number;
    getLeaf(index: number): any;
    getLine(index: number): [any, number];
    getLines(index?: number, length?: number): any[];
    getLines(range: RangeStatic): any[];
    on(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    on(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    on(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    once(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    once(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    once(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    off(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    off(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    off(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
}
declare namespace NextAdmin.UI {
    class ScrollableHorizontalBar extends FlexLayout {
        buttonLeftArrow: Button;
        buttonRightArrow: Button;
        scrollableArea: HTMLElement;
        options: ScrollableHorizontalBarOptions;
        static style: string;
        constructor(options?: ScrollableHorizontalBarOptions);
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        private _maxWidth;
        setMaxWidth(maxWidth: number): void;
        updateButtonsState(): void;
    }
    interface ScrollableHorizontalBarOptions extends FlexLayoutOptions {
        maxWidth?: number;
        scrollOffset?: number;
        displayArrowsAbsolute?: boolean;
        autoUpdateButtonsArrowsState?: boolean;
    }
}
declare namespace NextAdmin.UI {
    class Select extends LabelFormControl {
        static defaultStyle?: SelectStyle;
        select: HTMLSelectElement;
        options: SelectOptions;
        static style: string;
        private _currentValue?;
        constructor(options?: SelectOptions);
        setStyle(style?: SelectStyle): void;
        setSize(size?: SelectSize): void;
        setPropertyInfo(propertyInfo: NextAdmin.Business.DataPropertyInfo): void;
        addSelectItem(selectItem: SelectItem): HTMLOptionElement;
        addSelectItems(selectItems: Array<SelectItem>): Array<HTMLOptionElement>;
        setSelectItems(selectItems: Array<SelectItem>): Array<HTMLOptionElement>;
        addItem(value: string | number, label?: string | number, selected?: boolean): HTMLOptionElement;
        addItems<T>(dataset: Array<T>, valueFunc: (data: T) => string, captionFunc?: (data: T) => string): Array<HTMLOptionElement>;
        setItems<T>(dataset: Array<T>, valueFunc: (data: T) => string, captionFunc?: (data: T) => string): Array<HTMLOptionElement>;
        getItems(): Array<HTMLOptionElement>;
        removeItem(item: HTMLOptionElement): void;
        removeItemByValue(value: any): void;
        clearItems(): void;
        clearAll(): void;
        setPlaceholder(text: string): Select;
        getItem(value: any): HTMLOptionElement;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        getSelectedItem(): HTMLOptionElement;
        getValueText(): string;
        displayAsRequired(): void;
        displayAsNotRequired(): void;
    }
    interface SelectOptions extends LabelFormControlOptions {
        label?: string;
        items?: Array<SelectItem>;
        autoFill?: boolean;
        style?: SelectStyle | any;
        size?: SelectSize | any;
        inlineGrid?: boolean;
        allowNullValue?: boolean;
        outputNullIfEmpty?: boolean;
    }
    interface SelectItem {
        value: string | number;
        label?: string;
        selected?: boolean;
    }
    enum SelectStyle {
        default = 0,
        modern = 1,
        noBackground = 2
    }
    enum SelectSize {
        medium = 0,
        large = 1,
        ultraLarge = 2
    }
}
declare namespace NextAdmin.UI {
    class SelectDropDownButton extends FormControl {
        options: SelectDropDownButtonOptions;
        dropDownButton: DropDownButton;
        constructor(options?: SelectDropDownButtonOptions);
        getLabel(): string;
        private _label;
        setLabel(label: string): void;
        getValueLabel(value?: any): string;
        getValue(): any;
        private _value?;
        setValue(value: any, fireChange?: boolean): void;
        setItems(selectItems: Array<SelectItem>): Array<Button>;
        getItems(): (HTMLElement | Control)[];
        addItems(selectItems: Array<SelectItem>): Array<Button>;
        addItem(selectItem: SelectItem): Button;
        removeItem(value?: any): void;
        getItemButton(value?: any): Button;
        clearItems(): void;
        clearAll(): void;
        setPropertyInfo(propertyInfo?: NextAdmin.Business.DataPropertyInfo): void;
    }
    interface AddButtonArgs {
        button: Button;
        item?: SelectItem;
    }
    interface SelectDropDownButtonOptions extends FormControlOptions {
        label?: string;
        value?: any;
        items?: Array<SelectItem>;
        style?: ButtonStyle;
        dropDownWidth?: string;
        onAddButton?: (sender: SelectDropDownButton, args: AddButtonArgs) => void;
    }
}
declare namespace NextAdmin.UI {
    class Separator extends Control {
        static style: string;
        constructor(options?: ControlOptions);
    }
}
declare namespace NextAdmin.UI {
    class Sidebar extends UI.Control {
        static sideBarJS: string;
        static sideBarJSLoaded: boolean;
        header: HTMLDivElement;
        body: HTMLDivElement;
        options: SidebarOptions;
        pagesButtonsDictionary: Dictionary<SidebarPageButton>;
        private _pageChangedAction;
        static style: string;
        constructor(options?: SidebarOptions);
        updateActivePage(activePageName: string, previousPageName?: string): void;
        setStyle(style?: SideBarStyle): void;
        addPageButton(options: SidebarPageButtonOptions): SidebarPageButton;
        dispose(): void;
    }
    interface SidebarOptions extends ControlOptions {
        navigationController?: NextAdmin.NavigationController;
        style?: SideBarStyle;
    }
    class SidebarPageButton extends Control {
        sidebar: Sidebar;
        options: SidebarPageButtonOptions;
        link: HTMLAnchorElement;
        subMenu: HTMLElement;
        caret: HTMLElement;
        constructor(sidebar: Sidebar, options: SidebarPageButtonOptions);
        activate(): void;
        desactivate(): void;
        addPageButton(options: SidebarPageButtonOptions): SidebarPageButton;
        isSubMenuOpen(): boolean;
        toggleSubMenu(): void;
        openSubMenu(): void;
        closeSubMenu(): void;
    }
    interface SidebarPageButtonOptions extends ControlOptions {
        icon?: string;
        fontSize?: string;
        text: string;
        action?: (button?: SidebarPageButton) => void;
        href?: string;
        pageName?: string;
        parent?: SidebarPageButton;
        page?: Page;
    }
    enum SideBarStyle {
        default = 0,
        darkBlueOne = 1,
        darkBlueTwo = 2
    }
}
declare function slideToggle(sideBarEl: HTMLElement, width?: number): any;
declare function slideUp(sideBarEl: HTMLElement, width?: number): any;
declare function slideDown(sideBarEl: HTMLElement, width?: number): any;
declare namespace NextAdmin.UI {
    class TabPanel extends StretchLayout {
        static defaultStyle?: TabPanelStyle;
        options: TabPanelOptions;
        tabs: Dictionary<Tab>;
        tabsButtonsBar: Toolbar;
        onActivTabChange: EventHandler<TabPanel, TabChangeEventArgs>;
        onActivTabChanged: EventHandler<TabPanel, TabEventArgs>;
        static onCreated: EventHandler<TabPanel, TabPanelOptions>;
        static style: string;
        constructor(options?: TabPanelOptions);
        setStyle(style?: TabPanelStyle): void;
        addTab(tabOptionOrLabel: TabOptions | string, configAction?: (tab: Tab) => void): Tab;
        hideTab(tabName: string): void;
        displayTab(tabName: string): void;
        removeTab(tabName: string): void;
        clearTabs(): void;
        setActiveTab(tabName: string): void;
        getActiveTab(): Tab;
        getTab(tabName: string): Tab;
        findElementParentTab(element: HTMLElement): Tab;
    }
    class Tab extends NextAdmin.UI.Control {
        button: Button;
        body: HTMLDivElement;
        isActiv: boolean;
        name: string;
        options: TabOptions;
        tabPanel: TabPanel;
        constructor(tabPanel: TabPanel, options?: TabOptions);
    }
    interface TabPanelOptions extends StretchLayoutOptions {
        tabs?: Array<TabOptions>;
        activTabName?: string;
        style?: TabPanelStyle | any;
    }
    interface TabOptions extends ControlOptions {
        label?: string;
        name: string;
        active?: boolean;
        index?: number;
    }
    interface TabChangeEventArgs extends TabEventArgs {
        cancel: boolean;
    }
    interface TabEventArgs {
        previousTab?: Tab;
        newTab: Tab;
    }
    enum TabPanelStyle {
        default = 0,
        modern = 1
    }
}
declare namespace NextAdmin.UI {
    class Table extends Control {
        static defaultStyle?: TableStyle;
        tableContainer: HTMLDivElement;
        table: HTMLTableElement;
        tHead: HTMLTableSectionElement;
        tBody: HTMLTableSectionElement;
        tFoot: HTMLTableSectionElement;
        onRowSelected: EventHandler<Table, HTMLTableRowElement>;
        onRowUnselected: EventHandler<Table, HTMLTableRowElement>;
        onSelectedRowsChanged: EventHandler<Table, HTMLTableRowElement[]>;
        onRowAdded: EventHandler<Table, HTMLTableRowElement>;
        options: TableOptions;
        static style: string;
        static onCreated: EventHandler<Table, TableOptions>;
        constructor(options?: TableOptions);
        setStyle(style?: TableStyle): void;
        addHeaderRow(...headerCellCaptions: string[]): HTMLTableRowElement;
        addBodyRow(...cellContent: string[]): HTMLTableRowElement;
        addFooterRow(): HTMLTableRowElement;
        selectRow(row: HTMLTableRowElement, fireRowSelectedEvent?: boolean): void;
        unselectRow(row: HTMLTableRowElement): void;
        unselectAll(): void;
        getSelectedRows(): Array<HTMLTableRowElement>;
        getBodyRows(): Array<HTMLTableRowElement>;
        getHeaderRows(): Array<HTMLTableRowElement>;
        getColumnCells(index: number): Array<HTMLTableCellElement>;
        clear(clearTHead?: boolean): void;
    }
    enum TableStyle {
        default = 0,
        modern = 1,
        modernNoCellPadding = 2,
        card = 3
    }
    enum RowSelectionMode {
        disabled = 0,
        singleSelect = 1,
        multiSelect = 2,
        multiSelect_CtrlShift = 3
    }
    interface TableOptions extends ControlOptions {
        rowSelectionMode?: RowSelectionMode;
        rowHoverable?: boolean;
        stretchHeight?: boolean;
        stretchWidth?: boolean;
        style?: TableStyle;
    }
}
interface HTMLTableRowElement {
    getCells(): Array<HTMLTableCellElement>;
    addCell(content?: string): HTMLTableCellElement;
}
declare namespace NextAdmin.UI {
    class Text extends NextAdmin.UI.Control {
        options: TextOptions;
        static style: string;
        constructor(options?: TextOptions);
        setText(text?: string): void;
        setSize(style?: TextSize): void;
        setStyle(style?: TextStyle): void;
    }
    interface TextOptions extends ControlOptions {
        htmlTag?: string;
        isResponsive?: boolean;
        style?: TextStyle;
        size?: TextSize;
        text?: string;
    }
    enum TextSize {
        medium = 0,
        large = 1
    }
    enum TextStyle {
        lightGreyThin = 0,
        greyThin = 1,
        darkGreyThin = 2,
        lightGrey = 3,
        lightBlue = 4,
        blue = 5,
        grey = 6,
        darkGrey = 7,
        dark = 8,
        black = 9
    }
}
declare namespace NextAdmin.UI {
    class TextArea extends LabelFormControl {
        label: HTMLLabelElement;
        textArea: HTMLTextAreaElement;
        options: TextAreaOptions;
        static onCreated: EventHandler<TextArea, TextAreaOptions>;
        static defaultStyle?: TextAreaStyle;
        static style: string;
        constructor(options?: TextAreaOptions);
        setStyle(style?: InputStyle): void;
        setPlaceholder(text: string): TextArea;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
    }
    interface TextAreaOptions extends LabelFormControlOptions {
        displayMode?: TextAreaDisplayMode;
        style?: TextAreaStyle | any;
        height?: string;
        placeholder?: string;
    }
    enum TextAreaStyle {
        default = 0,
        modern = 1
    }
    enum TextAreaDisplayMode {
        default = 0,
        stretchHeight = 1,
        fitContent = 2
    }
}
declare namespace NextAdmin.UI {
    class Title extends NextAdmin.UI.Control {
        options: TitleOptions;
        static style: string;
        constructor(options?: TitleOptions);
        setText(text?: string): void;
        setStyle(style?: TitleStyle): void;
        setSize(size?: TitleSize): void;
    }
    interface TitleOptions extends ControlOptions {
        htmlTag?: string;
        isResponsive?: boolean;
        size?: TitleSize;
        style?: TitleStyle;
        text?: string;
    }
    enum TitleSize {
        ultraLarge = 0,
        large = 1,
        medium = 2,
        small = 3,
        ultraSmall = 4
    }
    enum TitleStyle {
        ultraLightGreyThin = 0,
        lightGrey = 1,
        lightGreyThin = 2,
        grey = 3,
        greyThin = 4,
        darkGrey = 5,
        darkGreyThin = 6,
        dark = 7,
        darkThin = 8,
        black = 9
    }
}
declare namespace NextAdmin.UI {
    class Toast extends NextAdmin.UI.Control {
        options: ToastOptions;
        toast: HTMLDivElement;
        static style: string;
        constructor(options?: ToastOptions);
        setText(text?: string): void;
        setStyle(style?: ToastStyle): void;
        show(options?: ToastShowOptions): Promise<void>;
        static createSuccess(text?: string): Toast;
        static createError(text?: string): Toast;
    }
    enum ToastStyle {
        green = 0,
        blue = 1,
        red = 2
    }
    interface ToastOptions extends ControlOptions {
        text?: string;
        style?: ToastStyle;
    }
    interface ToastShowOptions {
        duration?: number;
        container?: HTMLElement;
        openAnimation?: string;
        openAnimationOptions: NextAdmin.AnimationOptions;
        closeAnimation?: string;
        closeAnimationOptions?: NextAdmin.AnimationOptions;
    }
}
declare namespace NextAdmin.UI {
    class UserInterfaceHelper {
        static noSelectStyle: string;
        static noScrollbarStyle: string;
        static DefaultNumberDecimalCount: number;
        getDefaultPropertyDisplayValue(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any): string;
        getDefaultPropertyHtmlElement(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any, onReady?: (element: HTMLElement) => void): HTMLElement;
        getDefaultPropertyHtmlElementAsync(propertyInfo?: NextAdmin.Business.DataPropertyInfo, value?: any): Promise<HTMLElement>;
        getDefaultPropertyFormControl(propertyInfo: NextAdmin.Business.DataPropertyInfo, inlineControl?: boolean): FormControl;
    }
    var Helper: UserInterfaceHelper;
}
declare namespace NextAdmin.UI {
    class Video extends Control {
        options: VideoOptions;
        video: HTMLVideoElement;
        static style: string;
        constructor(options?: VideoOptions);
        addSource(src?: string): void;
        setStyle(style?: VideoStyle): void;
        setDisplayMode(displayMode: VideoDisplayMode): void;
    }
    interface VideoOptions extends ControlOptions {
        width?: string;
        height?: string;
        isAutoplay?: boolean;
        isMuted?: boolean;
        isLoop?: boolean;
        hasControls?: boolean;
        src?: string | Array<string>;
        style?: VideoStyle;
        displayMode?: VideoDisplayMode;
    }
    enum VideoStyle {
        none = 0,
        lightBordered = 1,
        whiteBordered = 2
    }
    enum VideoDisplayMode {
        contain = 0,
        cover = 1,
        stretch = 2
    }
}
