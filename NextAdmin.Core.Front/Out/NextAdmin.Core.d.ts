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
        static animate(element: HTMLElement, animation: string, options?: AnimationOptions): void;
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
    anim(animation: string, options?: NextAdmin.AnimationOptions): any;
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
interface Date {
    /**Retourne le nombre total de jour depuis l'an 0*/
    getTotalDays(): any;
    getWeek(): any;
    addDays(days: number): Date;
    addMonths(days: number): Date;
    addYears(years: number): Date;
    clone(): Date;
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
        unsubscribeAll(): void;
        dispatch(): void;
        isSubscribed(fn: () => void): boolean;
    }
    class EventHandler<TSender, TArgs> implements IEvent {
        private _subscriptions;
        subscribe(fn: (sender: TSender, args: TArgs) => void): (sender: TSender, args: TArgs) => void;
        unsubscribe(fn: (sender: TSender, args: TArgs) => void): void;
        unsubscribeAll(): void;
        dispatch(sender: TSender, args?: TArgs): void;
        isSubscribed(fn: (sender: TSender, args: TArgs) => void): boolean;
    }
    class AsyncEventHandler<TSender, TArgs> implements IEvent {
        private _subscriptions;
        subscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void;
        unsubscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void;
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
        navigateToUrl(url?: string, updateNavigatorHistory?: boolean): Promise<void>;
        getPageInfoFromUrl(url?: string): {
            pageName?: string;
            pageData?: any;
        };
        refresh(): Promise<void>;
        navigateTo(pageName: string, parameters?: any, updateBrowserUrl?: boolean, force?: boolean): Promise<NextAdmin.UI.Page>;
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
        defaultPage?: string;
        pageContainer?: HTMLElement;
        enableSpaLinkNavigation?: boolean;
    }
    var Navigation: NavigationController;
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
        throttle(callBack: () => void, delay: number): void;
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
        _isReadOnlyEnabled?: boolean;
        _readOnlyMessage?: string;
        constructor(options: DataControllerBaseOptions);
        displayDataErrors(action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        enableReadOnly(message?: string): void;
        disableReadOnly(): void;
        clearErrors(): void;
        bindToForm(form: NextAdmin.UI.IForm, autoExecuteAction?: boolean): void;
        save(args?: SaveDataArgs): Promise<SaveDataResult>;
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
        ensureUpToDate(action: (data: any) => void): void;
    }
    class DataController_ extends DataController<any> {
    }
    class LocalDataController<T> extends NextAdmin.Business.DataController<T> {
        constructor(options: any);
    }
    interface SaveDataArgs extends DataControllerActionArgs {
        onGetResponse?: (result: SaveDataResult) => void;
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
        onStartLoadData: EventHandler<DatasetController_, any[]>;
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
    }
    interface SaveDatasetArgs extends DataControllerActionArgs {
        onGetResponse?: (result: SaveDatasetResult) => void;
    }
}
declare namespace NextAdmin.Business {
    class EntityDataController<T> extends DataController<T> {
        static onEntityChanged: EventHandler<EntityDataController_, EntityChangedArgs>;
        onLoadingEntity: EventHandler<EntityDataController_, Models.GetEntityArgs>;
        options: EntityDataControllerOptions;
        entityLockKey?: string;
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
    class EntityDatasetController extends DatasetController_ {
        options: EntityDatasetControllerOptions;
        constructor(options: EntityDatasetControllerOptions);
        displayDataErrors(dataset: Array<any>, action: DataControllerActionType, resultError: ResultErrors, defaultErrorMessage?: string, okAction?: () => void): UI.MessageBox;
        displayHTTPError(response: Services.HttpResponse, endDisplayFunc: () => void): void;
        buildQuery(): NextAdmin.Models.GetEntitiesArgs;
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
        clone(): EntityDatasetController;
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
        columnToSelectNames?: Array<string>;
        isSelectDistinctQuery?: boolean;
        orderColumnNames?: Array<any>;
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
        columnToSelectNames?: Array<string>;
        isSelectDistinctQuery?: boolean;
        orderColumnNames?: Array<any>;
        skipRecordCount?: number;
        takeRecordCount?: number;
    }
}
declare namespace NextAdmin.Models {
    interface SignUpUserArgs {
        email: string;
        password: string;
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
        a: string;
        back: string;
        warning: string;
        error: string;
        unknownError: string;
        success: string;
        search: string;
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
        overwriteData: string;
        a: string;
        back: string;
        warning: string;
        error: string;
        unknownError: string;
        success: string;
        search: string;
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
    interface CssDeclaration {
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
        static GreenOne: string;
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
        private _currentStyle;
        setColorStyle(style: ButtonStyle): void;
        getColorStyle(): ButtonStyle;
        static getColorStyleClass(style: ButtonStyle): "next-admin-btn-default" | "next-admin-btn-blue" | "next-admin-btn-light-blue" | "next-admin-btn-green" | "next-admin-btn-red" | "next-admin-btn-bg-white" | "next-admin-btn-bg-light-grey" | "next-admin-btn-bg-grey" | "next-admin-btn-bg-black" | "next-admin-btn-bg-blue" | "next-admin-btn-bg-green" | "next-admin-btn-bg-red" | "next-admin-btn-no-bg" | "next-admin-btn-no-bg-white" | "next-admin-btn-no-bg-dark-blue" | "next-admin-btn-no-bg-blue" | "next-admin-btn-no-bg-red";
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
        red = 4,
        bgWhite = 5,
        bgLightGrey = 6,
        bgGrey = 7,
        bgBlack = 8,
        bgBlue = 9,
        bgGreen = 10,
        bgRed = 11,
        noBg = 12,
        noBgWhite = 13,
        noBgBlue = 14,
        noBgDarkBlue = 15,
        noBgRed = 16
    }
    enum ButtonSize {
        extraSmall = 0,
        small = 1,
        medium = 2,
        large = 3
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
        onClose?: (modal: NextAdmin.UI.Modal, args: CloseModalArgs) => void;
    }
    enum ModalSize {
        small = 0,
        smallFitContent = 1,
        medium = 2,
        mediumFitContent = 3,
        mediumLarge = 4,
        large = 5
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
        width?: string;
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
        hasFooterCloseButton?: boolean;
        canSave?: boolean;
        canDelete?: boolean;
        canCancel?: boolean;
        onDataSaved?: (sender: DataFormModal_, args: NextAdmin.Business.SaveDataResult) => void;
        onDataDeleted?: (sender: DataFormModal_, data: any) => void;
        onInitialize?: (sender: DataFormModal_, args: InitializeArgs) => void;
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
    interface InitializeArgs {
        data: any;
        dataState: Business.DataState;
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
        setLabelFromPropertyInfo?: boolean;
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
        controlsDictionary: Dictionary<HTMLElement | Control>;
        protected _columnCount: number;
        protected _rowCount: number;
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
        removeItem(col: number, row: number): void;
        clear(): void;
        getItems(): FormLayoutItem[];
        getPrintableElement(options?: any): HTMLTableElement;
        unbindControls(): void;
        bindControls(updateControlValueFromData?: boolean): void;
        getRow(rowIndex: number): HTMLTableRowElement;
        getCell(col: number, row: number): HTMLTableCellElement;
        getControl(col: number, row: number): NextAdmin.UI.Control;
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
        onDrawCell: EventHandler<DataGridCell_, any>;
        onDrawRow: EventHandler<DataGrid_, DataGridRow<T>>;
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
        appendData(): any;
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
        setControl(control: FormControl): void;
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
        formModalFactory?: (dataName: string, options?: DataFormModalOptions) => DataFormModal_;
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
        toolTip?: string;
        defaultOrdering?: ColumnOrdering;
        queryble?: boolean;
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
        disable = 0,
        local = 1,
        server = 2
    }
    export enum DataOrderingMode {
        disable = 0,
        local = 1,
        server = 2
    }
    export enum DataSearchMode {
        disable = 0,
        local = 1,
        server = 2
    }
    export enum DataLoadingMode {
        disable = 0,
        selectColumns = 1,
        selectAll = 2
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
    }
    export {};
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
        top = "top"
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
        setLabel(text: string): Input;
        getLabel(): string;
        setValue(value: any, fireChange?: boolean): void;
        getValue(): any;
        enable(): void;
        disable(): void;
    }
    interface InputOptions extends LabelFormControlOptions {
        inputType?: InputType;
        decimalCount?: number;
        placeHolder?: string;
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
        constructor(options?: FlexLayoutOptions);
    }
    class VerticalFlexLayout extends FlexLayout {
        constructor(options?: FlexLayoutOptions);
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
    class GridFormPanel<T> extends Control {
        options: GridFormPanelOptions;
        grid: DataGrid<T>;
        formPanel: FormPanel;
        static style: string;
        constructor(options?: GridFormPanelOptions);
    }
    interface GridFormPanelOptions extends ControlOptions {
        gridOption?: DataGridOptions_;
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
        style?: LinkStyle;
        action?: (link: Link) => void;
    }
    enum LinkStyle {
        blue = 0,
        dark = 1,
        white = 2
    }
}
declare namespace NextAdmin.UI {
    class MenuModal extends Modal {
        options: MenuModalOptions;
        mainContainer: HTMLDivElement;
        constructor(options: MenuModalOptions);
        addItems(itms: MenuItem[]): MenuModal;
        addItem(dropDownItem: MenuItem): Button;
        appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, configAction?: (control: TElement) => void): TElement;
        appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        addElement(dropDownItem: MenuItem | Control | HTMLElement): Control | HTMLElement;
    }
    interface MenuModalOptions extends ModalOptions {
        text?: string;
        hasBackButton?: boolean;
        items?: Array<MenuItem | Button | HTMLElement>;
    }
}
declare namespace NextAdmin.UI {
    class MessageBox extends Control {
        modal: HTMLDivElement;
        modalContent: HTMLDivElement;
        image?: HTMLImageElement;
        header: HTMLHeadingElement;
        body: HTMLParagraphElement;
        footer: HTMLDivElement;
        options: MessageBoxOptions;
        private _desktopButtonToolbar;
        private _button;
        static onCreated: EventHandler<MessageBox, MessageBoxOptions>;
        static style: string;
        constructor(options: MessageBoxOptions);
        appendButton(button: Button): void;
        prependButton(button: Button): void;
        getButtons(): Array<Button>;
        startSpin(): void;
        private static _previousBodyOverflow;
        close(): void;
        open(): void;
        static createOk(title: string, message: string, okAction?: any, parentContainer?: HTMLElement): MessageBox;
        static createLoading(title?: string, message?: string, cancelAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
        static createYesNo(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, noAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
        static createYesCancel(title: string, message: string, yesAction?: (msgBox: MessageBox) => void, cancelAction?: (msgBox: MessageBox) => void, parentContainer?: HTMLElement): MessageBox;
    }
    interface MessageBoxOptions extends ControlOptions {
        title: string;
        text?: string;
        imageUrl?: string;
        buttons?: Array<Button>;
        parentContainer?: Element;
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
        navigateTo(args: NavigateToArgs): Promise<void>;
        navigateFrom(args: NavigateFromArgs): Promise<void>;
        endNavigateFrom(): void;
        dispose(): void;
        isActivePage(): boolean;
        bindEvent<TSender, TArgs>(eventHandler: EventHandler<TSender, TArgs>, eventAction: (sender: TSender, args: TArgs) => void): void;
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
        innerHTML: string;
        maxWidth?: string;
        minHeight?: string;
    }
}
interface HTMLElement {
    setPopover(innerHTML: string, parentElement?: HTMLElement): NextAdmin.UI.Popover;
    removePopover(): any;
}
declare namespace NextAdmin.UI {
    class Progress extends LabelFormControl {
        static defaultStyle?: InputStyle;
        progress: HTMLProgressElement;
        options: ProgressOptions;
        progressLabelContainer: HTMLElement;
        static style: string;
        static onCreated: EventHandler<Input, InputOptions>;
        constructor(options?: ProgressOptions);
        setLabel(text: string): Progress;
        setValue(value?: number, fireChange?: boolean): void;
        updateValueLabel(): void;
        getValue(): number;
    }
    interface ProgressOptions extends LabelFormControlOptions {
        min?: number;
        max?: number;
        progressLabelValueFunc?: (progress: Progress) => string;
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
        static onCreated: EventHandler<Select, SelectOptions>;
        private _previousValue?;
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
        removeItemByValue(value: string): void;
        clearItems(): void;
        clearAll(): void;
        setPlaceholder(text: string): Select;
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
        isNumeric?: boolean;
        valueType?: SelectValueType;
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
    enum SelectValueType {
        string = 0,
        number = 1,
        date = 2
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
        addItems(selectItems: Array<SelectItem>): Array<Button>;
        addItem(selectItem: SelectItem): Button;
        removeItem(value?: any): void;
        getItemButton(value?: any): Button;
        clearItems(): void;
        clearAll(): void;
        setPropertyInfo(ropertyInfo?: NextAdmin.Business.DataPropertyInfo): void;
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
        autoFill?: boolean;
        onAddButton?: (sender: SelectDropDownButton, args: AddButtonArgs) => void;
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
        disable = 0,
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
        style: TextStyle;
        size: TextSize;
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
        grey = 4,
        darkGrey = 5,
        dark = 6,
        black = 7
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
        setValue(value: any): void;
        getValue(): any;
    }
    interface TextAreaOptions extends LabelFormControlOptions {
        displayMode?: TextAreaDisplayMode;
        style?: TextAreaStyle | any;
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
        large = 0,
        medium = 1
    }
    enum TitleStyle {
        lightGrey = 0,
        darkGrey = 1,
        dark = 2,
        thinLightGrey = 3,
        thinDarkGrey = 4,
        thinDark = 5,
        thinUltraLightGrey = 6
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
