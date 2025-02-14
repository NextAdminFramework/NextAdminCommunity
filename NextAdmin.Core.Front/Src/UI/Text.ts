namespace NextAdmin.UI {

    export class Text extends NextAdmin.UI.Control {

        options: TextOptions;


        public static style = `

        .next-admin-text{

        }

        .next-admin-text-light-grey-thin{
            color:#999;
            font-weight:100;
        }
        .next-admin-text-grey-thin{
            color:#777;
            font-weight:100;
        }
        .next-admin-text-dark-grey-thin{
            color:#444;
            font-weight:100;
        }
        .next-admin-text-dark-thin{
            color:#222;
            font-weight:100;
        }
        .next-admin-text-light-grey{
            color:#999;
        }
        .next-admin-text-grey-thin{
            color:#777;
        }
        .next-admin-text-dark-grey{
            color:#444;
        }
        .next-admin-text-dark{
            color:#222;
        }
        .next-admin-text-black{
            color:#000;
        }

        .next-admin-text-medium {
            font-size:14px;
        }
        .next-admin-text-medium-responsive {
            @media (max-width: 768px) {
                font-size:12px;
            }
        }
        .next-admin-text-large {
            font-size:20px;
        }
        .next-admin-text-large.responsive{
            @media (max-width: 1280px) {
                font-size:18px;
            }
            @media (max-width: 1024px) {
                font-size:16px;
            }
            @media (max-width: 768px) {
                font-size:14px;
            }
        }

        `;

        constructor(options?: TextOptions) {
            super(options?.htmlTag ?? 'div', {
                isResponsive: true,
                size: TextSize.medium,
                style: TextStyle.dark,
                ...options
            } as TextOptions);

            Style.append('NextAdmin.UI.Text', Text.style);
            this.element.classList.add('next-admin-text');
            if (this.options.isResponsive) {
                this.element.classList.add('responsive');
            }
            this.setStyle(this.options.style);
            this.setSize(this.options.size);
            this.setText(this.options.text);
        }

        setText(text?: string) {
            this.element.innerHTML = text ?? '';
        }

        setSize(style?: TextSize) {
            switch (style) {
                default:
                case TextSize.medium:
                    this.element.classList.add('next-admin-text-medium');
                    break;
                case TextSize.large:
                    this.element.classList.add('next-admin-text-large');
                    break;
            }
        }

        setStyle(style?: TextStyle) {
            switch (style) {
                default:
                case TextStyle.dark:
                    this.element.classList.add('next-admin-text-dark');
                    break;
                case TextStyle.black:
                    this.element.classList.add('next-admin-text-black');
                    break;
                case TextStyle.lightGreyThin:
                    this.element.classList.add('next-admin-text-light-grey-thin');
                    break;
                case TextStyle.greyThin:
                    this.element.classList.add('next-admin-text-grey-thin');
                    break;
                case TextStyle.darkGreyThin:
                    this.element.classList.add('next-admin-text-dark-grey-thin');
                    break;
                case TextStyle.lightGrey:
                    this.element.classList.add('next-admin-text-light-grey');
                    break;
                case TextStyle.grey:
                    this.element.classList.add('next-admin-text-grey');
                    break;
                case TextStyle.darkGrey:
                    this.element.classList.add('next-admin-text-dark-grey');
                    break;
            }
        }

    }

    export interface TextOptions extends ControlOptions {

        htmlTag?: string;

        isResponsive?: boolean;

        style: TextStyle;

        size: TextSize;

        text?: string;

    }


    export enum TextSize {
        medium,
        large,
    }

    export enum TextStyle {
        lightGreyThin,
        greyThin,
        darkGreyThin,
        lightGrey,
        grey,
        darkGrey,
        dark,
        black
    }

}