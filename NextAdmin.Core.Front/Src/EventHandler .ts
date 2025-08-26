namespace NextAdmin {


    export interface IEvent {

        subscribe(fn: () => any): void;

        unsubscribe(fn: () => any): void;
    }



    export class EventHandlerBase implements IEvent {

        private _subscriptions: Array<() => any> = new Array<() => any>();

        subscribe(fn: () => void): void {
            if (fn) {
                this._subscriptions.push(fn);
            }
        }

        unsubscribe(fn: () => void): void {
            let i = this._subscriptions.indexOf(fn);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
            }
        }

        subscribeOnce(fn: () => void): () => void {
            let proxyFunc = () => {
                this.unsubscribe(proxyFunc);
                fn();
            };
            this.subscribe(proxyFunc);
            return proxyFunc;
        }

        unsubscribeAll(): void {
            this._subscriptions = new Array<() => void>();;
        }

        dispatch(): void {
            for (let handler of this._subscriptions) {
                handler();
            }
        }

        isSubscribed(fn: () => void) {
            return this._subscriptions.contains(fn);
        }

    }



    export class EventHandler<TSender, TArgs> implements IEvent {

        private _subscriptions: Array<(sender: TSender, args: TArgs) => void> = new Array<(sender: TSender, args: TArgs) => void>();

        subscribe(fn: (sender: TSender, args: TArgs) => void): (sender: TSender, args: TArgs) => void {
            if (fn) {
                this._subscriptions.push(fn);
            }
            return fn;
        }

        unsubscribe(fn: (sender: TSender, args: TArgs) => void): void {
            let i = this._subscriptions.indexOf(fn);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
            }
        }

        subscribeOnce(fn: (sender: TSender, args: TArgs) => void): (sender: TSender, args: TArgs) => void {
            let proxyFunc = (s2, args2) => {
                this.unsubscribe(proxyFunc);
                fn(s2, args2);
            };
            this.subscribe(proxyFunc);
            return proxyFunc;
        }

        unsubscribeAll(): void {
            this._subscriptions = new Array<(sender: TSender, args: TArgs) => void>();
        }

        dispatch(sender: TSender, args?: TArgs): void {
            for (let handler of this._subscriptions) {
                handler(sender, args);
            }
        }

        isSubscribed(fn: (sender: TSender, args: TArgs) => void) {
            return this._subscriptions.contains(fn);
        }
    }

    export class AsyncEventHandler<TSender, TArgs> implements IEvent {

        private _subscriptions: Array<(sender: TSender, args: TArgs) => Promise<void>> = new Array<(sender: TSender, args: TArgs) => Promise<void>>();

        subscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void {
            if (fn) {
                this._subscriptions.push(fn);
            }
        }

        unsubscribe(fn: (sender: TSender, args: TArgs) => Promise<void>): void {
            let i = this._subscriptions.indexOf(fn);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
            }
        }

        subscribeOnce(fn: (sender: TSender, args: TArgs) => Promise<void>): (sender: TSender, args: TArgs) => void {
            let proxyFunc = async (s2, args2) => {
                this.unsubscribe(proxyFunc);
                await fn(s2, args2);
            };
            this.subscribe(proxyFunc);
            return proxyFunc;
        }

        unsubscribeAll(): void {
            this._subscriptions = new Array<(sender: TSender, args: TArgs) => Promise<void>>();
        }

        async dispatch(sender: TSender, args?: TArgs): Promise<void> {
            for (let handler of this._subscriptions) {
                await handler(sender, args);
            }
        }
    }
}