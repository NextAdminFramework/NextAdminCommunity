/// <reference path="LabelFormControl.ts"/>

namespace NextAdmin.UI {

    export class TextArea extends LabelFormControl {


        public label: HTMLLabelElement;

        public textArea: HTMLTextAreaElement;

        public options: TextAreaOptions;

        public static onCreated = new EventHandler<TextArea, TextAreaOptions>();

        public static defaultStyle?: TextAreaStyle;

        public static style = `


            .next-admin-textarea {
                border-radius: 4px;
                margin:0px;
                box-sizing:border-box;
                outline:0px;border:1px solid #ccc;
                font-size:14px;
                color:#444;
                padding:6px;
                width:100%;
            }

            .next-admin-textarea-modern {
                .next-admin-textarea {
                    background:#fff;
                    border:1px solid #fff;
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.25);
                    transition: 0.5s;
                }
                .next-admin-textarea:hover{
                    box-shadow: 0px 0px 2px rgba(0,0,0,0.40);
                }
                .next-admin-textarea:focus {
                    border: 1px solid #12101d;
                    text-shadow:0px 0px 2px rgba(0,0,0,0.2);
                }
            }

        `;

        constructor(options?: TextAreaOptions) {
            super({
                style: TextArea.defaultStyle,
                ...options
            });
            NextAdmin.Style.append('NextAdmin.UI.TextArea', TextArea.style);
            this.textArea = document.createElement('textarea');
            this.textArea.classList.add('next-admin-textarea');
            this.textArea.addEventListener("input", () => {
                this.onValueChanged.dispatch(this, { value: this.textArea.value } as ValueChangeEventArgs);
            });
            this.controlContainer.appendChild(this.textArea);
            if (this.options.displayMode == TextAreaDisplayMode.stretchHeight) {
                this.element.style.height = '100%';
                this.textArea.style.height = '100%';
            }
            else if (this.options.displayMode == TextAreaDisplayMode.fitContent) {
                this.textArea.addEventListener('input', () => {
                    this.textArea.style.height = "";
                    this.textArea.style.height = this.textArea.scrollHeight + "px"
                });
            }
            else if (this.options.height) {
                this.textArea.style.height = this.options.height;
            }
            this.setStyle(this.options.style);
            TextArea.onCreated.dispatch(this, this.options);
        }

        public setStyle(style?: InputStyle) {
            switch (style) {
                case InputStyle.default:
                    this.element.classList.add('next-admin-textarea-default');
                    break;
                default:
                case InputStyle.modern:
                    this.element.classList.add('next-admin-textarea-modern');
                    break;
            }
        }



        public setPlaceholder(text: string): TextArea {
            this.textArea.setAttribute('placeholder', text);
            return this;
        }


        setValue(value: any, fireChange?: boolean) {
            let previousValue = this.textArea.value;
            this.textArea.value = value ?? '';
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: value, previousValue: previousValue, origin: ChangeOrigin.code });
            }
        }

        getValue(): any {
            return this.textArea.value;
        }
    }


    export interface TextAreaOptions extends LabelFormControlOptions {

        displayMode?: TextAreaDisplayMode;

        style?: TextAreaStyle | any;

        height?: string;

    }

    export enum TextAreaStyle {
        default,
        modern
    }

    export enum TextAreaDisplayMode {
        default,
        stretchHeight,
        fitContent
    }

}