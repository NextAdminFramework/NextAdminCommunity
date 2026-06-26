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

        isItemsCentered?: boolean;

    }
}