namespace NextAdmin.UI {

    export class Title extends NextAdmin.UI.Control {

        options: TitleOptions;


        public static style = `
        .next-admin-title {
            margin-top:5px;
            margin-bottom:5px;
        }

        .next-admin-title-thin-ultra-light-grey{
            font-weight:100;
            color:#bbb;
        }

        .next-admin-title-thin-light-grey{
            font-weight:100;
            color:#999;
        }
        .next-admin-title-light-grey {
            color:#999;
        }

        .next-admin-title-thin-grey {
            font-weight:100;
            color:#777;
        }
        .next-admin-title-grey{
            color:#777;
        }

        .next-admin-title-thin-dark-grey {
            font-weight:100;
            color:#444;
        }
        .next-admin-title-dark-grey {
            color:#444;
        }

        .next-admin-title-thin-dark {
            font-weight:100;
            color:#222;
        }
        .next-admin-title-dark {
            color:#222;
        }

        .next-admin-title-large {
            font-size:36px;
        }
        .next-admin-title-medium {
            font-size:24px;
        }
        .next-admin-title-small {
            font-size:20px;
        }
        .next-admin-title-ultra-small{
            font-size:16px;
        }
        @media (max-width: 1280px) {
            .next-admin-title-responsive.next-admin-title-large {
                font-size:32px;
            }
            .next-admin-title-responsive.next-admin-title-medium {
                font-size:20px;
            }
            .next-admin-title-responsive.next-admin-title-small {
                font-size:18px;
            }
        }
        @media (max-width: 1024px) {
            .next-admin-title-responsive.next-admin-title-large {
                font-size:28px;
            }
            .next-admin-title-responsive.next-admin-title-medium {
                font-size:18px;
            }
            .next-admin-title-responsive.next-admin-title-small {
                font-size:16px;
            }
            .next-admin-title-responsive.next-admin-title-small {
                font-size:14px;
            }
        }
        @media (max-width: 768px) {
            .next-admin-title-responsive.next-admin-title-large {
                font-size:24px;
            }
            .next-admin-title-responsive.next-admin-title-medium {
                font-size:16px;
            }
            .next-admin-title-responsive.next-admin-title-small {
                font-size:14px;
            }
        }
        `;

        constructor(options?: TitleOptions) {
            super(options?.htmlTag ?? 'h1', {
                isResponsive: true,
                size: TitleSize.large,
                style: TitleStyle.greyThin,
                ...options
            } as TitleOptions);

            Style.append('NextAdmin.UI.Title', Title.style);
            this.element.classList.add('next-admin-title');
            if (this.options.isResponsive) {
                this.element.classList.add('next-admin-title-responsive');
            }
            this.setStyle(this.options.style);
            this.setSize(this.options.size);
            this.setText(this.options.text);
        }

        setText(text?: string) {
            this.element.innerHTML = text ?? '';
        }

        setStyle(style?: TitleStyle) {
            switch (style) {
                case TitleStyle.ultraLightGreyThin:
                    this.element.classList.add('next-admin-title-thin-ultra-light-grey');
                    break;

                case TitleStyle.lightGrey:
                    this.element.classList.add('next-admin-title-light-grey');
                    break;
                case TitleStyle.lightGreyThin:
                    this.element.classList.add('next-admin-title-thin-light-grey');
                    break;

                default:
                case TitleStyle.greyThin:
                    this.element.classList.add('next-admin-title-thin-grey');
                    break;
                case TitleStyle.grey:
                    this.element.classList.add('next-admin-title-grey');
                    break;

                case TitleStyle.darkGrey:
                    this.element.classList.add('next-admin-title-dark-grey');
                    break;
                case TitleStyle.darkGreyThin:
                    this.element.classList.add('next-admin-title-thin-dark-grey');
                    break;
                case TitleStyle.dark:
                    this.element.classList.add('next-admin-title-dark');
                    break;
                case TitleStyle.darkThin:
                    this.element.classList.add('next-admin-title-thin-dark');
                    break;
            }
        }


        setSize(size?: TitleSize) {
            switch (size) {
                default:
                case TitleSize.large:
                    this.element.classList.add('next-admin-title-large');
                    break;
                case TitleSize.medium:
                    this.element.classList.add('next-admin-title-medium');
                    break;
                case TitleSize.small:
                    this.element.classList.add('next-admin-title-small');
                    break;
                case TitleSize.ultraSmall:
                    this.element.classList.add('next-admin-title-ultra-small');
                    break;
            }
        }

    }

    export interface TitleOptions extends ControlOptions {

        htmlTag?: string;

        isResponsive?: boolean;

        size?: TitleSize;

        style?: TitleStyle;

        text?: string;

    }

    export enum TitleSize {
        large,
        medium,
        small,
        ultraSmall
    }


    export enum TitleStyle {
        ultraLightGreyThin,
        lightGrey,
        lightGreyThin,
        grey,
        greyThin,
        darkGrey,
        darkGreyThin,
        dark,
        darkThin,

    }

}