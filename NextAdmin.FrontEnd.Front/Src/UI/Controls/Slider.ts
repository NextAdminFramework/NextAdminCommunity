namespace NextAdmin.UI {

    export class Slider extends NextAdmin.UI.Control {

        options: SliderOptions;

        slides = new Array<Slide>();

        slidesContainer: HTMLDivElement;

        previousSlideArrowContainer: HTMLDivElement;

        nextSlideArrowContainer: HTMLDivElement;

        private _activeSlide?: Slide;


        public static style = `
        .next-admin-slider{

            position:relative;
            height:600px;

            .next-admin-slides-container{
                position:relative;
                width:100%;
                height:100%;
            }

            .next-admin-slider-left-arrow-container{
                position:absolute;
                left:0px;
                top:0px;
                width:40px;
                height:100%;
            }
            .next-admin-slider-right-arrow-container{
                position:absolute;
                right:0px;
                top:0px;
                width:40px;
                height:100%;
            }
        }
        `;

        constructor(options?: SliderOptions) {
            super('div', {
                changeSlideDelaySecond: 10,
                uiScale: 1,
                navigationButtonsStyle: NextAdmin.UI.ButtonStyle.noBg,
                ...options
            } as SliderOptions);

            Style.append('NextAdmin.UI.Slider', Slider.style);
            this.element.classList.add('next-admin-slider');

            this.slidesContainer = this.element.appendHTML('div', (slidesContainer) => {
                slidesContainer.classList.add('next-admin-slides-container');
            });

            this.previousSlideArrowContainer = this.element.appendHTML('div', (leftArrowContainer) => {
                leftArrowContainer.classList.add('next-admin-slider-left-arrow-container');
                leftArrowContainer.appendControl(new Button({
                    text: Resources.iconCaretLeft,
                    style: this.options.navigationButtonsStyle,
                    size: ButtonSize.large,
                    action: () => {
                        this.passToPreviousSlide();
                    }
                }), (btnPreviousSlide) => {
                    btnPreviousSlide.element.center();
                    (btnPreviousSlide.element.firstChild as HTMLElement).style.transform = 'scale(' + this.options.uiScale + ')';
                });
            });
            this.nextSlideArrowContainer = this.element.appendHTML('div', (rightArrowContainer) => {
                rightArrowContainer.classList.add('next-admin-slider-right-arrow-container');
                rightArrowContainer.appendControl(new Button({
                    text: Resources.iconCaretRight,
                    style: this.options.navigationButtonsStyle,
                    size: ButtonSize.large,
                    action: () => {
                        this.passToNextSlide();
                    }
                }), (btnNextSlide) => {
                    btnNextSlide.element.center();
                    (btnNextSlide.element.firstChild as HTMLElement).style.transform = 'scale(' + this.options.uiScale + ')';
                });
            });

            if (this.options.slides?.length) {
                for (let item of this.options.slides) {
                    this.addSlideItem(item);
                }
            }
            if (this.options.imageUrls?.length) {
                for (let imageUrl of this.options.imageUrls) {
                    this.addSlideItem({
                        imageUrl: imageUrl,
                        imageSize: this.options.imagesSize,
                        imagePosition: this.options.imagePosition,
                    });
                }
            }

            if (this.options.autoPlay) {
                this.startPlay();
                if (this.options.page) {
                    this.options.page.onEndNavigateFrom.subscribe(this.dispose);
                }
            }
        }


        private _updateCarousel = false;
        public async startPlay() {
            if (this._updateCarousel)
                return;
            this._updateCarousel = true;
            while (this._updateCarousel) {
                await Timer.sleep(this.options.changeSlideDelaySecond * 1000);
                this.passToNextSlide();
            }
        }

        public stopPlay() {
            this._updateCarousel = false;
        }


        addSlideItem(itemOption: SlideOptions): Slide {
            return this.appendSlide(new Slide(itemOption));
        }

        appendSlide<TSlide extends Slide>(control: TSlide, configAction?: (control: TSlide) => void): TSlide {
            this.slides.add(control);
            if (this.getActiveSlide() == null) {
                this.setActiveSlide(control);
            }
            if (configAction) {
                configAction(control);
            }
            this.updateSlideNavigationArrows();
            return control;
        }

        setActiveSlide(slide: Slide) {
            let activeItem = this.getActiveSlide();
            if (activeItem) {
                activeItem.element.remove();
            }
            this.slidesContainer.appendControl(slide);
            slide.element.anim('fadeIn', { animationSpeed: NextAdmin.AnimationSpeed.faster });
            this._activeSlide = slide;
        }

        getActiveSlide() {
            return this._activeSlide;
        }

        passToNextSlide() {
            let nextSlide = this.getNextSlide();
            if (nextSlide == null || nextSlide == this._activeSlide) {
                return;
            }
            this.setActiveSlide(nextSlide);
        }

        passToPreviousSlide() {
            let previousSlide = this.getPreviousSlide();
            if (previousSlide == null || previousSlide == this._activeSlide) {
                return;
            }
            this.setActiveSlide(previousSlide);
        }

        getNextSlide(): Slide {
            if (!this.slides?.length) {
                return null;
            }
            let activeSlide = this.getActiveSlide();
            if (activeSlide == null) {
                return null;
            }
            let nextSlideIndex = this.slides.indexOf(activeSlide) + 1;
            if (nextSlideIndex >= this.slides.length) {//last slide
                return this.slides.firstOrDefault();
            }
            return this.slides[nextSlideIndex];
        }

        getPreviousSlide(): Slide {
            if (!this.slides?.length) {
                return null;
            }
            let activeSlide = this.getActiveSlide();
            if (activeSlide == null) {
                return null;
            }
            let previousSlideIndex = this.slides.indexOf(activeSlide) - 1;
            if (previousSlideIndex < 0) {
                return this.slides.lastOrDefault();
            }
            return this.slides[previousSlideIndex];
        }

        updateSlideNavigationArrows() {
            if (this.slides.length > 1) {
                this.previousSlideArrowContainer.style.display = '';
                this.nextSlideArrowContainer.style.display = '';
            }
            else {
                this.previousSlideArrowContainer.style.display = 'none';
                this.nextSlideArrowContainer.style.display = 'none';
            }
        }

        dispose() {
            this._updateCarousel = false;
            if (this.options.page) {
                this.options.page.onEndNavigateFrom.unsubscribe(this.dispose);
            }
        }

    }

    export interface SliderOptions extends NextAdmin.UI.ControlOptions {

        slides?: SlideOptions[];

        imageUrls?: Array<string>;

        imagesSize?: string;

        imagePosition?: string;

        autoPlay?: boolean;

        page?: Page;

        changeSlideDelaySecond?: number;

        uiScale?: number;

        navigationButtonsStyle?: NextAdmin.UI.ButtonStyle;

    }

    export class Slide extends Control {

        options: SlideOptions;

        public static style = `

        .next-admin-slide{
            height:100%;
            position:relative;
        }

        `;

        constructor(options?: SlideOptions) {
            super('div', {
                imageSize: 'cover',
                imagePosition: 'center top',
                ...options
            } as SlideOptions);
            Style.append('NextAdmin.UI.Slide', Slide.style);
            this.element.classList.add('next-admin-slide');

            if (this.options.imageUrl) {
                this.element.style.background = 'url("' + this.options.imageUrl + '")';
                this.element.style.backgroundSize = this.options.imageSize;
                this.element.style.backgroundRepeat = 'no-repeat';
                this.element.style.backgroundPosition = this.options.imagePosition;
            }
            if (this.options.content) {
                this.element.appendChild(this.options.content);
            }

        }

    }

    export interface SlideOptions extends ControlOptions {

        imageUrl?: string;

        imageSize?: string;

        imagePosition?: string;

        content?: HTMLElement;

    }

    export class HeadingSlide extends Slide {

        options: HeadingSlideOptions;

        contentContainer?: Container;

        constructor(options?: HeadingSlideOptions) {
            super({
                textColor: '#ffffff',
                textAlign: 'left',
                textContainerMaxWidth: '1280px',
                ...options
            } as HeadingSlideOptions);

            this.contentContainer = this.element.appendControl(new Container({ maxWidth: this.options.textContainerMaxWidth }), (container) => {
                container.element.style.height = '100%';
                container.body.style.height = '100%';
                container.body.appendHTML('div', (content) => {
                    content.centerVertically();
                    content.style.textAlign = this.options.textAlign;
                    content.appendHTML('a', (link) => {
                        link.style.textDecoration = 'none';
                        link.style.textShadow = '0px 0px 10px rgba(0,0,0,0.75)';

                        if (this.options.targetUrl) {
                            link.href = this.options.targetUrl;
                        }
                        if (this.options.title) {
                            link.appendControl(new NextAdmin.UI.Title({
                                text: this.options.title,
                                size: NextAdmin.UI.TitleSize.ultraLarge,
                                css: { color: this.options.textColor },
                                htmlTag: 'span'
                            }));
                        }
                        link.appendHTML('br');
                        if (this.options.subTitle) {
                            link.appendControl(new NextAdmin.UI.Title({
                                text: this.options.subTitle,
                                size: NextAdmin.UI.TitleSize.medium,
                                css: { color: this.options.textColor },
                                htmlTag: 'span'
                            }));
                        }
                        if (this.options.hoverText) {
                            link.appendHTML('br');
                            link.appendControl(new AnimatedHoverText({
                                text: this.options.hoverText,
                                color: this.options.textColor,
                                css: { display: 'inline-block' }
                            }), (hoverText) => {
                                hoverText.element.style.width = 'fit-content';
                                this.element.addEventListener('pointerenter', () => {
                                    hoverText.animDisplayText();
                                });
                                this.element.addEventListener('pointerleave', () => {
                                    hoverText.animHideText();
                                });
                            });
                        }
                    });


                });

                /*
                container.body.appendHTML('a', (content) => {
                    content.centerVertically();
                    if (this.options.textColor) {
                        content.style.color = this.options.textColor;
                        content.style.textDecoration = 'none';
                        content.style.textShadow = '0px 0px 2px rgba(0,0,0,0.75)';
                    }
                    if (this.options.targetUrl) {
                        content.href = this.options.targetUrl;
                    }
                    if (this.options.title) {
                        content.appendControl(new NextAdmin.UI.Title({
                            text: this.options.title,
                            size: NextAdmin.UI.TitleSize.large,
                            css: { color: this.options.textColor, textAlign: this.options.textAlign }
                        }));
                    }
                    if (this.options.subTitle) {
                        content.appendControl(new NextAdmin.UI.Title({
                            text: this.options.subTitle,
                            size: NextAdmin.UI.TitleSize.medium,
                            css: { color: this.options.textColor, textAlign: this.options.textAlign }
                        }));
                    }
                    if (this.options.hoverText) {
                        content.appendControl(new AnimatedHoverText({
                            text: this.options.hoverText,
                            color: this.options.textColor,
                        }), (hoverText) => {
                            hoverText.element.style.width = 'fit-content';
                            this.element.addEventListener('pointerenter', () => {
                                hoverText.animDisplayText();
                            });
                            this.element.addEventListener('pointerleave', () => {
                                hoverText.animHideText();
                            });
                        });
                    }
                });*/

            });

        }

    }

    export interface HeadingSlideOptions extends SlideOptions {

        textColor?: string;

        textAlign?: string;

        textContainerMaxWidth?: string;

        title?: string;

        subTitle?: string;

        hoverText?: string;

        targetUrl?: string;

    }



}