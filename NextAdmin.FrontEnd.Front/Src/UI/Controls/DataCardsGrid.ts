namespace NextAdmin.UI {

    export class DataCardsGrid<TData> extends CardsGrid {


        protected dataset = new Array<TData>();

        options: DataCardsGridOptions<TData>;

        private _isFullyLoaded = false;

        constructor(options?: DataCardsGridOptions<TData>) {
            super({
                paginItemCount: 50,
                ...options
            } as DataCardsGridOptions<TData>);



        }

        cardFactory(data: TData): NextAdmin.UI.Control {
            if (this.options.cardFactory) {
                return this.options.cardFactory(data);
            }
            throw Error('Not implemented');
        }

        protected async retrieveDataset(take?: number, skip?: number): Promise<Array<TData>> {
            if (this.options.retrieveDatasetFunc) {
                return await this.options.retrieveDatasetFunc(take, skip);
            }
            throw Error('Not implemented');
        }

        clear() {
            this.dataset = new Array<TData>();
            this.body.innerHTML = '';
            this._isFullyLoaded = false;
        }

        setDataset(dataset?: Array<TData>) {
            this.clear();
            this.addDataset(dataset);
        }

        getDataset() {
            return this.dataset;
        }

        addDataset(dataset?: Array<TData>) {
            if (!dataset?.length) {
                return;
            }
            for (let data of dataset) {
                let card = this.cardFactory(data);
                card['_data'] = data;
                this.dataset.add(data);
                this.appendCard(card);
            }
        }

        private _isLoading = false;
        public async load(take = this.options.paginItemCount, skip?: number): Promise<Array<TData>> {
            this._isLoading = true;
            let spinerContainer = this.body.appendHTML('div', (spinerContainer) => {
                spinerContainer.style.height = '200px';
                spinerContainer.style.width = '100%';
                spinerContainer.startSpin();
            });
            let items = await this.retrieveDataset(take, skip);
            spinerContainer.remove();
            if (!skip) {
                this.setDataset(items);
            } else {
                this.addDataset(items);
            }
            if (take == null || (take && (items?.length ?? 0) < take)) {
                this._isFullyLoaded = true;
            }
            this._isLoading = false;
            return items;
        }

        public enableScrollLoading(scrollElement?: HTMLElement) {
            scrollElement = window as any as HTMLElement;
            let lastLoadedItemCount = -1;
            let timer = new NextAdmin.Timer();
            scrollElement.addEventListener('scroll', () => {
                timer.throttle(async () => {
                    if (!this._isLoading && !this._isFullyLoaded && lastLoadedItemCount != 0 && window.scrollY + window.innerHeight > document.body.offsetHeight - 500) {
                        let items = await this.load(this.options.paginItemCount, this.dataset?.length);
                        lastLoadedItemCount = items?.length ?? 0;
                    }
                }, 10);
            });
        }


    }

    export interface DataCardsGridOptions<TData> extends CardsGridOptions {

        paginItemCount?: number;

        cardFactory?: (data: TData) => NextAdmin.UI.Control;

        retrieveDatasetFunc?: (take?: number, skip?: number) => Promise<Array<TData>>;

    }

    export interface DataCardsGridOptions_ extends DataCardsGridOptions<any> {

    }



}