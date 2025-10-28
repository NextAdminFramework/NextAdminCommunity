namespace NextAdmin.UI {

    export class ImageSelect extends LabelFormControl {

        imagesGrid: NextAdmin.UI.CardsGrid;

        options: ImageSelectOptions;

        constructor(options?: ImageSelectOptions) {
            super({
                imagesSize: NextAdmin.UI.ImageCardSize.ultraSmall_1_1,
                imageStyle: NextAdmin.UI.ImageCardStyle.imageShadowedBorderRadiusBTextCenter,
                ...options
            });

            this.imagesGrid = this.controlContainer.appendControl(new NextAdmin.UI.CardsGrid({ isItemsCentered: false, css: { width: '100%' } }));
            if (this.options.items?.length) {
                this.setItems(this.options.items);
            }
        }

        setItems(items?: Array<ImageSelectItem>, fireChange?: boolean) {
            if (!items?.length) {
                this.imagesGrid.clear();
                return;
            }

            for (let valueItem of items) {
                this.imagesGrid.appendCard(new NextAdmin.UI.ImageCard({
                    imageSrc: valueItem.imageSrc,
                    outsideDescription: valueItem.label,
                    size: this.options.imagesSize,
                    style: this.options.imageStyle,
                    css: { cursor: 'pointer' }
                }), (card) => {
                    card['_value'] = valueItem.value;
                    card.element.addEventListener('click', () => {
                        this.setValue(card['_value'], true);
                    });
                });
            }
            let selectedItem = items.firstOrDefault(a => a.selected);
            if (selectedItem) {
                this.setValue(selectedItem.value, fireChange);
            }
        }

        private _currentValue?: any;
        setValue(value?: string | number, fireChange?: boolean) {
            let previousValue = this._currentValue;
            let cards = this.imagesGrid.getCards() as Array<NextAdmin.UI.ImageCard>;
            for (let card of cards) {
                if (card['_value'] == value) {
                    card.displayAsSelected();
                } else {
                    card.displayAsUnselected();
                }
            }
            this._currentValue = value;
            if (fireChange) {
                this.onValueChanged.dispatch(this, {
                    previousValue: previousValue,
                    value: value
                });
            }
        }

        getValue(): string | number {
            return this._currentValue;
        }

    }

    export interface ImageSelectOptions extends LabelFormControlOptions {

        items?: Array<ImageSelectItem>;

        imagesSize?: ImageCardSize;

        imageStyle?: ImageCardStyle;
    }

    export interface ImageSelectItem extends SelectItem {


        imageSrc?: string;


    }


}