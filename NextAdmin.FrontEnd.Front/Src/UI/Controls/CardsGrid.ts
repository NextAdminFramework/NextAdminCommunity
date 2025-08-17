namespace NextAdmin.UI {

    export class CardsGrid extends NextAdmin.UI.Control {

        options: CardsGridOptions;

        header: HTMLDivElement;

        body: HTMLDivElement;

        footer: HTMLDivElement;

        public static style = `

        .next-admin-cards-grid{
            .next-admin-cards-grid-body{
                display:flex;
                flex-flow:wrap;
                place-content:center;
            }
        }

        `;

        constructor(options?: CardsGridOptions) {
            super('div', {
                margin:'10px',
                ...options
            } as CardsGridOptions);
            NextAdmin.Style.append('NextAdmin.UI.CardsGrid', CardsGrid.style);
            this.element.classList.add('next-admin-cards-grid');

            this.header = this.element.appendHTML('div');
            this.body = this.element.appendHTML('div', (body) => {
                body.classList.add('next-admin-cards-grid-body');
            });
            this.footer = this.element.appendHTML('div');

        }


        appendCard<TCard extends Control>(card: TCard, controlOption?: (card: TCard) => void) {
            this.body.appendControl(card, controlOption);
            card.element.style.margin = this.options.margin;
        }


        clear() {
            this.body.innerHTML = '';
        }

    }


    export interface CardsGridOptions extends NextAdmin.UI.ControlOptions {

        margin?: string;

    }
    
    export class CardsDataGrid<TData> extends CardsGrid {


        protected dataset = new Array<TData>();


        cardFactory(data: TData): NextAdmin.UI.Control {
            throw Error('Not implemented');
        }

        clear() {
            this.dataset = [];
            this.body.innerHTML = '';
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


    }


}