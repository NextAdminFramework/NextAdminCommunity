/// <reference path="../EventHandler .ts" />

namespace NextAdmin.UI {


    export class Control implements IControl {

        element: HTMLElement;

        options: ControlOptions;

        public static onCreated = new EventHandler<Control, any>();


        constructor(htmlElement: HTMLElement | string, options?: ControlOptions) {
            if (options == null) {
                options = {};
            }
            if (typeof htmlElement == 'string') {
                this.element = document.createElement(htmlElement);
            }
            else {
                this.element = htmlElement;
            }
            this.element['_control'] = this;
            this.element.setAttribute('control-type', this.constructor.name);
            this.options = options;
            if (this.options.id) {
                this.element.id = this.options.id;
            }
            if (this.options.disabled) {
                setTimeout(() => {
                    this.disable();
                },1);
            }
            if (this.options.toolTip) {
                setTimeout(() => {
                    this.setTooltip(this.options.toolTip);
                }, 1);
            }
            if (this.options.hidden) {
                this.hide();
            }
            if (this.options.classes) {
                this.element.classList.add(...this.options.classes);
            }

            if (this.options.css) {
                NextAdmin.Copy.copyTo(this.options.css, this.element.style);
            }
            Control.onCreated.dispatch(this, this.options);
        }

        public isEnable() {
            return this.element.isEnable();
        }

        public enable() {
            this.element.enable();
        }

        public disable() {
            this.element.disable();
        }

        private _tooltipValue = null;
        setTooltip(value?: string) {
            if (value != null) {
                this.element.setPopover(value, this.element);
            }
            else {
                this.element.removePopover();
            }
            this._tooltipValue = value;
        }

        getToolTip(): string {
            return this._tooltipValue;
        }

        public changeEnableStateOnControlsRequiredValueChanged(condition: () => boolean, ...controls: Array<FormControl>) {
            this.disable();
            setTimeout(() => {
                if (condition()) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            }, 20);//use timeout in the case of value is setted by option.value
            for (let control of controls) {
                control.onValueChanged.subscribe((sender, args) => {
                    if (condition()) {
                        this.enable();
                    }
                    else {
                        this.disable();
                    }
                });
            }
        }

        startSpin() {
            this.element.startSpin('rgba(255,255,255,0.5)', 20);
        }

        stopSpin() {
            this.element.stopSpin();
        }

        hide() {
            this.element.style.display = 'none';
        }

        display() {
            this.element.style.display = '';
            console.log('display');
        }

        dispose() {
            this.element.remove();
        }
    }

    export interface ControlOptions {

        css?: CssDeclaration;

        id?: string;

        classes?: Array<string>;

        disabled?: boolean;

        hidden?: boolean;

        toolTip?: string;

    }


    export interface CssDeclaration {

        alignContent?: string;
        alignItems?: string;
        alignSelf?: string;
        alignmentBaseline?: string;
        all?: string;
        animation?: string;
        animationDelay?: string;
        animationDirection?: string;
        animationDuration?: string;
        animationFillMode?: string;
        animationIterationCount?: string;
        animationName?: string;
        animationPlayState?: string;
        animationTimingFunction?: string;
        backfaceVisibility?: string;
        background?: string;
        backgroundAttachment?: string;
        backgroundClip?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundOrigin?: string;
        backgroundPosition?: string;
        backgroundPositionX?: string;
        backgroundPositionY?: string;
        backgroundRepeat?: string;
        backgroundSize?: string;
        baselineShift?: string;
        blockSize?: string;
        border?: string;
        borderBlockEnd?: string;
        borderBlockEndColor?: string;
        borderBlockEndStyle?: string;
        borderBlockEndWidth?: string;
        borderBlockStart?: string;
        borderBlockStartColor?: string;
        borderBlockStartStyle?: string;
        borderBlockStartWidth?: string;
        borderBottom?: string;
        borderBottomColor?: string;
        borderBottomLeftRadius?: string;
        borderBottomRightRadius?: string;
        borderBottomStyle?: string;
        borderBottomWidth?: string;
        borderCollapse?: string;
        borderColor?: string;
        borderImage?: string;
        borderImageOutset?: string;
        borderImageRepeat?: string;
        borderImageSlice?: string;
        borderImageSource?: string;
        borderImageWidth?: string;
        borderInlineEnd?: string;
        borderInlineEndColor?: string;
        borderInlineEndStyle?: string;
        borderInlineEndWidth?: string;
        borderInlineStart?: string;
        borderInlineStartColor?: string;
        borderInlineStartStyle?: string;
        borderInlineStartWidth?: string;
        borderLeft?: string;
        borderLeftColor?: string;
        borderLeftStyle?: string;
        borderLeftWidth?: string;
        borderRadius?: string;
        borderRight?: string;
        borderRightColor?: string;
        borderRightStyle?: string;
        borderRightWidth?: string;
        borderSpacing?: string;
        borderStyle?: string;
        borderTop?: string;
        borderTopColor?: string;
        borderTopLeftRadius?: string;
        borderTopRightRadius?: string;
        borderTopStyle?: string;
        borderTopWidth?: string;
        borderWidth?: string;
        bottom?: string;
        boxShadow?: string;
        boxSizing?: string;
        breakAfter?: string;
        breakBefore?: string;
        breakInside?: string;
        captionSide?: string;
        caretColor?: string;
        clear?: string;
        clip?: string;
        clipPath?: string;
        clipRule?: string;
        color?: string;
        colorInterpolation?: string;
        colorInterpolationFilters?: string;
        columnCount?: string;
        columnFill?: string;
        columnGap?: string;
        columnRule?: string;
        columnRuleColor?: string;
        columnRuleStyle?: string;
        columnRuleWidth?: string;
        columnSpan?: string;
        columnWidth?: string;
        columns?: string;
        content?: string;
        counterIncrement?: string;
        counterReset?: string;
        cssFloat?: string;
        cssText?: string;
        cursor?: string;
        direction?: string;
        display?: string;
        dominantBaseline?: string;
        emptyCells?: string;
        fill?: string;
        fillOpacity?: string;
        fillRule?: string;
        filter?: string;
        flex?: string;
        flexBasis?: string;
        flexDirection?: string;
        flexFlow?: string;
        flexGrow?: string;
        flexShrink?: string;
        flexWrap?: string;
        float?: string;
        floodColor?: string;
        floodOpacity?: string;
        font?: string;
        fontFamily?: string;
        fontFeatureSettings?: string;
        fontKerning?: string;
        fontSize?: string;
        fontSizeAdjust?: string;
        fontStretch?: string;
        fontStyle?: string;
        fontSynthesis?: string;
        fontVariant?: string;
        fontVariantCaps?: string;
        fontVariantEastAsian?: string;
        fontVariantLigatures?: string;
        fontVariantNumeric?: string;
        fontVariantPosition?: string;
        fontWeight?: string;
        gap?: string;
        glyphOrientationVertical?: string;
        grid?: string;
        gridArea?: string;
        gridAutoColumns?: string;
        gridAutoFlow?: string;
        gridAutoRows?: string;
        gridColumn?: string;
        gridColumnEnd?: string;
        gridColumnGap?: string;
        gridColumnStart?: string;
        gridGap?: string;
        gridRow?: string;
        gridRowEnd?: string;
        gridRowGap?: string;
        gridRowStart?: string;
        gridTemplate?: string;
        gridTemplateAreas?: string;
        gridTemplateColumns?: string;
        gridTemplateRows?: string;
        height?: string;
        hyphens?: string;
        imageOrientation?: string;
        imageRendering?: string;
        inlineSize?: string;
        justifyContent?: string;
        justifyItems?: string;
        justifySelf?: string;
        left?: string;
        letterSpacing?: string;
        lightingColor?: string;
        lineBreak?: string;
        lineHeight?: string;
        listStyle?: string;
        listStyleImage?: string;
        listStylePosition?: string;
        listStyleType?: string;
        margin?: string;
        marginBlockEnd?: string;
        marginBlockStart?: string;
        marginBottom?: string;
        marginInlineEnd?: string;
        marginInlineStart?: string;
        marginLeft?: string;
        marginRight?: string;
        marginTop?: string;
        marker?: string;
        markerEnd?: string;
        markerMid?: string;
        markerStart?: string;
        mask?: string;
        maskComposite?: string;
        maskImage?: string;
        maskPosition?: string;
        maskRepeat?: string;
        maskSize?: string;
        maskType?: string;
        maxBlockSize?: string;
        maxHeight?: string;
        maxInlineSize?: string;
        maxWidth?: string;
        minBlockSize?: string;
        minHeight?: string;
        minInlineSize?: string;
        minWidth?: string;
        objectFit?: string;
        objectPosition?: string;
        opacity?: string;
        order?: string;
        orphans?: string;
        outline?: string;
        outlineColor?: string;
        outlineOffset?: string;
        outlineStyle?: string;
        outlineWidth?: string;
        overflow?: string;
        overflowAnchor?: string;
        overflowWrap?: string;
        overflowX?: string;
        overflowY?: string;
        overscrollBehavior?: string;
        overscrollBehaviorBlock?: string;
        overscrollBehaviorInline?: string;
        overscrollBehaviorX?: string;
        overscrollBehaviorY?: string;
        padding?: string;
        paddingBlockEnd?: string;
        paddingBlockStart?: string;
        paddingBottom?: string;
        paddingInlineEnd?: string;
        paddingInlineStart?: string;
        paddingLeft?: string;
        paddingRight?: string;
        paddingTop?: string;
        pageBreakAfter?: string;
        pageBreakBefore?: string;
        pageBreakInside?: string;
        paintOrder?: string;
        perspective?: string;
        perspectiveOrigin?: string;
        placeContent?: string;
        placeItems?: string;
        placeSelf?: string;
        pointerEvents?: string;
        position?: string;
        quotes?: string;
        resize?: string;
        right?: string;
        rotate?: string;
        rowGap?: string;
        rubyAlign?: string;
        rubyPosition?: string;
        scale?: string;
        scrollBehavior?: string;
        shapeRendering?: string;
        stopColor?: string;
        stopOpacity?: string;
        stroke?: string;
        strokeDasharray?: string;
        strokeDashoffset?: string;
        strokeLinecap?: string;
        strokeLinejoin?: string;
        strokeMiterlimit?: string;
        strokeOpacity?: string;
        strokeWidth?: string;
        tabSize?: string;
        tableLayout?: string;
        textAlign?: string;
        textAlignLast?: string;
        textAnchor?: string;
        textCombineUpright?: string;
        textDecoration?: string;
        textDecorationColor?: string;
        textDecorationLine?: string;
        textDecorationStyle?: string;
        textEmphasis?: string;
        textEmphasisColor?: string;
        textEmphasisPosition?: string;
        textEmphasisStyle?: string;
        textIndent?: string;
        textJustify?: string;
        textOrientation?: string;
        textOverflow?: string;
        textRendering?: string;
        textShadow?: string;
        textTransform?: string;
        textUnderlinePosition?: string;
        top?: string;
        touchAction?: string;
        transform?: string;
        transformBox?: string;
        transformOrigin?: string;
        transformStyle?: string;
        transition?: string;
        transitionDelay?: string;
        transitionDuration?: string;
        transitionProperty?: string;
        transitionTimingFunction?: string;
        translate?: string;
        unicodeBidi?: string;
        userSelect?: string;
        verticalAlign?: string;
        visibility?: string;

    }

    export enum ControlStyle {
        default,
        modern
    }


}