namespace NextAdmin {

    export class Dictionary<T>
    {
        constructor(obj?: any) {
            if (obj) {
                Object.assign(this, obj);
            }
        }



        public set(key: string, value: T) {
            this[key] = value;
        }

        public get(key: string): T {
            return this[key];
        }

        public add(key: string, value: T) {
            if (this[key] !== undefined) {
                throw Error('Item already exist');
            }
            this[key] = value;
        }

        public tryAdd(key: string, value: T) {
            if (this[key] !== undefined) {
                false;
            }
            this[key] = value;
            return true;
        }

        public getKeys(): Array<string> {
            let keys = new Array<string>();
            for (let key in this) {
                keys.push(key);
            }
            return keys;
        }

        public getValues(): Array<T> {
            let values = new Array<T>();
            for (let key in this) {
                values.push(this[key] as any as T);
            }
            return values;
        }

        public getKeysValues(): { key: string, value: T }[] {
            let keysValues = new Array<any>();
            for (let key in this) {
                keysValues.push({
                    key: key,
                    value: this[key]
                });
            }
            return keysValues;
        }

        public remove(key: string) {
            delete this[key];
        }

        public clear() {
            for (let key in this) {
                delete this[key];
            }
        }

        public clone(): Dictionary<T> {
            return new Dictionary<T>(this);
        }


    }
}