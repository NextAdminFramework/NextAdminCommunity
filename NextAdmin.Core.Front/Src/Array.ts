

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

    removeAt(index: number);

    contains(element: T): boolean;

    distinct(): Array<T>;

    distinctBy(keySelector: (key: T) => string | number): Array<T>;

    groupBy<TResult = T>(grouper: (key: T) => string | number, mapper?: (element: T) => TResult): { [key: string]: TResult[] };

    groupByArray<TResult = T>(grouper: (key: T) => string | number, mapper?: (element: T) => TResult): Array<{ name: string, items: Array<T> }>;

    insert(index: number, element: T): Array<T>;

    select<TOut>(selector: (element: T, index: number) => TOut): Array<TOut>;

    selectAsync<TOut>(selector: (element: T, index: number) => Promise<TOut>): Promise<Array<TOut>>;

    orderBy(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): Array<T>;

    orderByDescending(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): Array<T>;

    aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any;

    sum(transform?: (value?: T, index?: number, list?: T[]) => number): number;

    cast<U>(): Array<U>;

    replace(oldElement: any, newElement: any);

    first(): T
    first(predicate: (value?: T, index?: number, list?: T[]) => boolean): T
    first(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;

    firstOrDefault(): T
    firstOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T
    firstOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;

    last(): T
    last(predicate: (value?: T, index?: number, list?: T[]) => boolean): T
    last(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;


    lastOrDefault(): T
    lastOrDefault(predicate: (value?: T, index?: number, list?: T[]) => boolean): T
    lastOrDefault(predicate?: (value?: T, index?: number, list?: T[]) => boolean): T;


    min(): number
    min(selector: (value: T, index: number, array: T[]) => number): number
    min(selector?: (value: T, index: number, array: T[]) => number): number;

    max(): number
    max(selector: (value: T, index: number, array: T[]) => number): number
    max(selector?: (value: T, index: number, array: T[]) => number): number;

    average(): number
    average(transform: (value?: T, index?: number, list?: T[]) => any): number
    average(transform?: (value?: T, index?: number, list?: T[]) => any): number;

    count(): number
    count(predicate: (value?: T, index?: number, list?: T[]) => boolean): number
    count(predicate?: (value?: T, index?: number, list?: T[]) => boolean): number;

    toFlatArray(action: (element: T) => Array<T>): Array<T>;

    toDictionary(key: ((data: T) => string) | string): NextAdmin.Dictionary<T>;

}
try {

    const ArrayCompareFunc = <T>(
        a: T,
        b: T,
        _keySelector: (key: T) => any,
        descending?: boolean
    ): number => {
        const sortKeyA = _keySelector(a)
        const sortKeyB = _keySelector(b)
        if (sortKeyA > sortKeyB) {
            return !descending ? 1 : -1
        } else if (sortKeyA < sortKeyB) {
            return !descending ? -1 : 1
        } else {
            return 0
        }
    }

    const ArrayKeyComparer = <T>(
        _keySelector: (key: T) => any,
        descending?: boolean
    ): ((a: T, b: T) => number) => (a: T, b: T) =>
            ArrayCompareFunc(a, b, _keySelector, descending);


    Array.prototype.orderBy = function (keySelector: (key) => any, comparer = ArrayKeyComparer(keySelector, false)) {
        return this.sort(comparer);
    };


    Array.prototype.orderByDescending = function (keySelector: (key) => any, comparer = ArrayKeyComparer(keySelector, true)) {
        return this.sort(comparer);
    };


    Array.prototype.clear = function () {
        while (this.length > 0) {
            this.pop();
        }
    };

    Array.prototype.replace = function (oldElement: any, newElement: any) {
        let _this = this as Array<any>;
        for (let i = 0; i < this.length; i++) {
            if (_this[i] == oldElement) {
                _this.insert(i, newElement);
                _this.removeAt(i+1);
            }
        }
    };

    Array.prototype.clone = function () {
        return [...this];
    };

    Array.prototype.take = function (amount) {
        return this.slice(0, Math.max(0, amount));
    };

    Array.prototype.skip = function (amount) {
        return this.slice(Math.max(0, amount));
    };

    Array.prototype.where = function (predicate) {
        return this.filter(predicate);
    };

    Array.prototype.add = function (element) {
        this.push(element);
        return this;
    };

    Array.prototype.addRange = function (elements: []) {
        this.push(...elements);
        return this;
    };

    Array.prototype.remove = function (element) {
        return this.indexOf(element) !== -1
            ? (this.removeAt(this.indexOf(element)), true)
            : false
    };

    Array.prototype.removeRange = function (elements: []) {
        if (elements) {
            for (let element of elements) {
                this.remove(element);
            }
        }
        return this;
    };

    Array.prototype.removeAt = function (index: number) {
        this.splice(index, 1)
    };


    Array.prototype.contains = function (element) {
        return this.some(x => x === element)
    };

    Array.prototype.distinct = function () {
        return this.where((value, index, iter) => iter.indexOf(value) === index);
    };

    Array.prototype.distinctBy = function (keySelector: (key: any) => string | number) {
        const groups = this.groupBy(keySelector)
        return Object.keys(groups).reduce((res, key) => {
            res.add(groups[key][0])
            return res
        }, new Array());
    };

    Array.prototype.groupBy = function (grouper, mapper?) {
        const initialValue = {}
        if (!mapper) {
            mapper = val => <any>val;
        }
        return this.aggregate((ac, v) => {
            const key = grouper(v)
            const existingGroup = ac[key]
            const mappedValue = mapper(v)
            if (existingGroup) {
                existingGroup.push(mappedValue)
            } else {
                ac[key] = [mappedValue]
            }
            return ac
        }, initialValue)
    };


    Array.prototype.groupByArray = function (grouper, mapper?) {
        let result = this.groupBy(grouper, mapper);
        let groupArray = new Array<{ name: string, items: [] }>();
        for (let groupName in result) {
            groupArray.add({ name: groupName, items: result[groupName] });
        }
        return groupArray;
    };




    Array.prototype.insert = function (index, element) {
        if (index < 0 || index > this.length) {
            throw new Error('Index is out of range.')
        }
        this.splice(index, 0, element);
        return this;
    };

    Array.prototype.select = function (selector) {
        return this.map(selector);
    };

    Array.prototype.selectAsync = function (selector) {
        return Promise.all(this.map(selector));
    };


    Array.prototype.first = function (predicate?: (value?, index?, list?: []) => boolean) {
        if (this.length > 0) {
            return predicate ? this.where(predicate).first() : this[0]
        } else {
            throw new Error(
                'InvalidOperationException: The source sequence is empty.'
            )
        }
    };

    Array.prototype.firstOrDefault = function (predicate?: (value?, index?, list?: []) => boolean) {
        if (this.length == 0)
            return null;
        if (!predicate)
            return this[0];
        let elements = this.where(predicate);
        if (elements.length == 0)
            return null;
        return elements[0];
    };

    Array.prototype.last = function (predicate?: (value?, index?, list?: []) => boolean) {
        if (this.length > 0) {
            return predicate ? this.where(predicate).last() : this[this.length - 1]
        } else {
            throw new Error(
                'InvalidOperationException: The source sequence is empty.'
            )
        }
    };

    Array.prototype.lastOrDefault = function (predicate?: (value?, index?, list?: []) => boolean) {
        if (this.length == 0)
            return null;
        if (!predicate)
            return this[this.length - 1];
        let elements = this.where(predicate);
        if (elements.length == 0)
            return null;
        return elements[elements.length - 1];
    };

    Array.prototype.min = function (selector?: (value, index: number, array: []) => number) {
        const id = x => x
        return Math.min(...this.map(selector || id));
    };

    Array.prototype.max = function (selector?: (value, index: number, array: []) => number) {
        const id = x => x
        return Math.max(...this.map(selector || id));
    };

    Array.prototype.average = function (transform?: (value?: any, index?: number, list?: any[]) => any): number {
        return this.sum(transform) / this.count(transform);
    }


    Array.prototype.count = function (predicate?: (value?, index?: number, list?: []) => boolean) {
        return predicate ? this.where(predicate).length : this.length
    };


    Array.prototype.aggregate = function (accumulator, initialValue) {
        return this.reduce(accumulator, initialValue);
    };

    Array.prototype.sum = function (transform?) {
        return transform ? this.select(transform).sum() : this.aggregate((ac, v) => (ac += +v), 0);
    };

    Array.prototype.cast = function () {
        return this;
    };


    Array.prototype.toFlatArray = function (action: (element: any) => []) {
        let cloneArray = (<[]>this).clone();
        let finalArray = [];
        while (cloneArray.length > 0) {
            let firstElement = cloneArray[0]
            cloneArray.removeAt(0);
            finalArray.push(firstElement);
            let children = action(firstElement);
            if (children != null) {
                cloneArray.addRange(children);
            }
        }
        return finalArray;
    };


    Array.prototype.toDictionary = function (key: (data: any) => string | string): NextAdmin.Dictionary<any> {

        let dictionary = new NextAdmin.Dictionary();
        if (typeof key === 'string') {
            for (let item of this) {
                dictionary.add(item[key] + '', item);
            }
        }
        else {
            for (let item of this) {
                dictionary.add(key(item), item);
            }
        }
        return dictionary;
    };

}
catch
{

}
