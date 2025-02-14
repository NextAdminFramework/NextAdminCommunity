namespace NextAdmin {


    export class Timer {

        private _timerHandler = -1;

        public callBack?: () => void;

        public onExecute = new NextAdmin.EventHandler<Timer, any>();

        private _executeAtNextTickCallBacks = new Array<() => void>();

        constructor(callBack?: () => void) {
            this.callBack = callBack;
        }


        private _onExecute() {
            if (this.callBack != null) {
                this.callBack();
            }
            for (let cb of this._executeAtNextTickCallBacks) {
                cb();
            }
            this._executeAtNextTickCallBacks.clear();
            this.onExecute.dispatch(this, null);
        }


        public executeAtNextTick(callBack: () => void, replaceOtherCallBack = true) {
            if (replaceOtherCallBack) {
                this._executeAtNextTickCallBacks.clear();
            }
            this._executeAtNextTickCallBacks.push(callBack);
        }


        public throttle(callBack: () => void, delay: number) {
            if (!this.isRuning()) {
                this.start(delay);
            }
            this.executeAtNextTick(() => {
                callBack();
                this.stop();
            }, true);
        }


        public start(delay: number) {
            this.stop();
            this._timerHandler = setInterval(() => {
                this._onExecute();
            }, delay) as any;
        }


        public stop() {
            if (this._timerHandler != -1) {
                clearInterval(this._timerHandler);
                this._timerHandler = -1;
            }
        }

        public isRuning() {
            return this._timerHandler != -1;
        }

        public static async sleep(delay: number): Promise<number> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(delay);
                }, delay);
            });
        }
    }


}
