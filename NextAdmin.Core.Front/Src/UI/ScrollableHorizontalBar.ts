namespace NextAdmin.UI {

    export class ScrollableHorizontalBar extends FlexLayout {

        buttonLeftArrow: Button;

        buttonRightArrow: Button;

        scrollableArea: HTMLElement;

        options: ScrollableHorizontalBarOptions;

        public static style = `
            .scrollable-horizontal-bar-scrollable-area{
                overflow: auto;
            }
            .scrollable-horizontal-bar-scrollable-area::-webkit-scrollbar{
                display: none;
            }
        `;
        ;

        constructor(options?: ScrollableHorizontalBarOptions) {
            super({
                direction: FlexLayoutDirection.horizontal,
                scrollOffset: 50,
                displayArrowsAbsolute: false,
                autoUpdateButtonsArrowsState: false,
                ...options
            } as ScrollableHorizontalBarOptions);
            this.element.style.width = 'unset';
            Style.append('NextAdmin.UI.ScrollableHorizontalBar', ScrollableHorizontalBar.style);
            if (this.options.displayArrowsAbsolute) {
                this.element.style.position = 'relative';
            }
            if (this.options.autoUpdateButtonsArrowsState) {
                this.element.style.position = 'relative';
                this.element.appendControl(new ResisingContainer(), (rsContaoner) => {
                    rsContaoner.element.style.position = 'absolute';
                    rsContaoner.element.style.left = '0px';
                    rsContaoner.element.style.width = '100%';
                    rsContaoner.element.style.height = '0%';
                    rsContaoner.element.style.visibility = 'hidden';
                    rsContaoner.onSizeChanged.subscribe(() => {
                        this.updateButtonsState();
                    });
                });
            }

            this.buttonLeftArrow = super.appendControl(new NextAdmin.UI.Button({
                text: Resources.iconCaretLeft,
                style: ButtonStyle.noBgDarkBlue,
                action: () => {
                    this.scrollableArea.scrollBy(-this.options.scrollOffset, 0);
                    this.updateButtonsState();
                }
            }), (buttonLeftArrow) => {
                buttonLeftArrow.element.style.height = '100%';
                buttonLeftArrow.element.style.visibility = 'hidden';
                if (this.options.displayArrowsAbsolute) {
                    buttonLeftArrow.element.style.position = 'absolute';
                    buttonLeftArrow.element.style.left = '0px';
                    buttonLeftArrow.element.style.backgroundColor = '#fff';
                }

            });

            this.scrollableArea = super.appendHTMLStretch('div', (scrollableArea) => {
                scrollableArea.classList.add('scrollable-horizontal-bar-scrollable-area');
                let startTouch: Touch;
                let startTouchScrollLeft: number;
                let startTouchScrollTop: number;
                scrollableArea.addEventListener('touchstart', (ev) => {
                    scrollableArea.scrollBy({ left: 0, top: 0 });
                    let touch = [...ev.touches].firstOrDefault();
                    if (touch) {
                        startTouch = touch;
                        startTouchScrollLeft = this.scrollableArea.scrollLeft
                        startTouchScrollTop = this.scrollableArea.scrollTop
                    }

                });
                scrollableArea.addEventListener('touchmove', (ev) => {
                    let touch = [...ev.touches].firstOrDefault();
                    if (touch && startTouch) {
                        this.scrollableArea.scrollTo(startTouchScrollLeft + startTouch.clientX - touch.clientX, startTouchScrollTop + startTouch.clientY - touch.clientY);
                        this.updateButtonsState();
                    }
                });
                scrollableArea.addEventListener('touchend', (args) => {
                    startTouch = null;
                });
            });

            this.buttonRightArrow = super.appendControl(new NextAdmin.UI.Button({
                text: Resources.iconCaretRight,
                style: ButtonStyle.noBgDarkBlue,
                action: () => {
                    this.scrollableArea.scrollBy(this.options.scrollOffset, 0);
                    this.updateButtonsState();
                }
            }), (buttonRightArrow) => {
                buttonRightArrow.element.style.height = '100%';
                buttonRightArrow.element.style.visibility = 'hidden';
                if (this.options.displayArrowsAbsolute) {
                    buttonRightArrow.element.style.position = 'absolute';
                    buttonRightArrow.element.style.right = '0px';
                    buttonRightArrow.element.style.backgroundColor = '#fff';
                }

            });

            if (this.options.maxWidth) {
                this.setMaxWidth(this.options.maxWidth);
            }
            else {
                this.element.style.maxWidth = '100%';
            }
        }

        public appendControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            return this.scrollableArea.addChild(elementOrControl, setControlPropertiesAction);
        }

        public prependControl<TElement extends Control | HTMLElement>(elementOrControl: TElement, setControlPropertiesAction?: (control: TElement) => void): TElement {
            return this.scrollableArea.addChildFirst(elementOrControl, setControlPropertiesAction);
        }

        public appendHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.scrollableArea.appendHTML(html, setControlPropertiesAction);
        }

        public prependHTML<K extends keyof HTMLElementTagNameMap>(html: K, setControlPropertiesAction?: (control: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K] {
            return this.scrollableArea.prependHTML(html, setControlPropertiesAction);
        }

        private _maxWidth: number;
        public setMaxWidth(maxWidth: number) {
            this.element.style.maxWidth = maxWidth + 'px';
            this._maxWidth = maxWidth;
            this.updateButtonsState();
        }

        public updateButtonsState() {
            let maxWidth = this._maxWidth ?? this.element.clientWidth;
            if (this.element.clientWidth < maxWidth && maxWidth > 0) {
                this.buttonLeftArrow.element.style.display = 'none';
                this.buttonRightArrow.element.style.display = 'none';
            }
            else {
                this.buttonLeftArrow.element.style.display = '';
                this.buttonRightArrow.element.style.display = '';


                if (this.scrollableArea.scrollLeft == 0) {
                    this.buttonLeftArrow.element.style.visibility = 'hidden';
                }
                else {
                    this.buttonLeftArrow.element.style.visibility = '';
                }
                if (this.scrollableArea.scrollLeft + this.scrollableArea.clientWidth >= this.scrollableArea.scrollWidth) {
                    this.buttonRightArrow.element.style.visibility = 'hidden';
                }
                else {
                    this.buttonRightArrow.element.style.visibility = '';
                }

            }
        }


    }

    export interface ScrollableHorizontalBarOptions extends FlexLayoutOptions {

        maxWidth?: number;

        scrollOffset?: number;

        displayArrowsAbsolute?: boolean;

        autoUpdateButtonsArrowsState?: boolean;

    }


}