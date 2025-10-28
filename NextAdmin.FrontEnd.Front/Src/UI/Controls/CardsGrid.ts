namespace NextAdmin.UI {

    export class CardsGrid extends NextAdmin.UI.Control {

        options: CardsGridOptions;

        header: HTMLDivElement;

        body: HTMLDivElement;

        footer: HTMLDivElement;

        private _cards = new Array<Control>();

        public static style = `

        .next-admin-cards-grid{
            .next-admin-cards-grid-body{
                display:flex;
                flex-flow:wrap;
            }
            .next-admin-cards-grid-body.items-centered{
                place-content:center;
            }
        }

        `;

        constructor(options?: CardsGridOptions) {
            super('div', {
                margin: '10px',
                isItemsCentered: true,
                ...options
            } as CardsGridOptions);
            NextAdmin.Style.append('NextAdmin.UI.CardsGrid', CardsGrid.style);
            this.element.classList.add('next-admin-cards-grid');

            this.header = this.element.appendHTML('div');
            this.body = this.element.appendHTML('div', (body) => {
                body.classList.add('next-admin-cards-grid-body');
                if (this.options.isItemsCentered) {
                    body.classList.add('items-centered');
                }
            });
            this.footer = this.element.appendHTML('div');

        }


        appendCard<TCard extends Control>(card: TCard, controlOption?: (card: TCard) => void): TCard {
            this.body.appendControl(card, controlOption);
            this._cards.add(card);
            card.element.style.margin = this.options.margin;
            return card;
        }

        getCards(): Array<Control> {
            return this._cards;
        }

        appendControl<TControl extends NextAdmin.UI.IControl>(control: TControl, configAction?: (control: TControl) => void): TControl {
            return this.body.appendControl(control, configAction);
        }


        clear() {
            this._cards.clear();
            this.body.innerHTML = '';
        }

    }


    export interface CardsGridOptions extends NextAdmin.UI.ControlOptions {

        margin?: string;

        isItemsCentered?: boolean;

    }

    export class CardsDataGrid<TData> extends CardsGrid {


        protected dataset = new Array<TData>();

        options: CardsDataGridOptions;

        private _isFullyLoaded = false;

        constructor(options?: CardsDataGridOptions) {
            super({
                paginItemCount: 50,
                ...options
            } as CardsDataGridOptions);



        }


        cardFactory(data: TData): NextAdmin.UI.Control {
            throw Error('Not implemented');
        }

        protected async retrieveDataset(take?: number, skip?: number): Promise<Array<TData>> {
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

    export interface CardsDataGridOptions extends CardsGridOptions {

        paginItemCount?: number;

    }


}