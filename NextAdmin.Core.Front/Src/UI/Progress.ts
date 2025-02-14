namespace NextAdmin.UI {


    export class Progress extends LabelFormControl {

        public static defaultStyle?: InputStyle;

        public progress: HTMLProgressElement;

        public options: ProgressOptions;

        public progressLabelContainer: HTMLElement;

        public static style = `

            .next-admin-progress { 
                height:25px;
                width:100%;
                top:50%;
            }

            `;

        public static onCreated = new EventHandler<Input, InputOptions>();

        constructor(options?: ProgressOptions) {
            super({
                style: Input.defaultStyle,
                max:100,
                progressLabelValueFunc: () => {
                    return (this.getValue() + ' / ' + this.options.max).toString();
                },
                ...options
            } as ProgressOptions);

            Style.append("Progress", Progress.style);
            this.controlContainer.style.display = 'flex';
            this.controlContainer.style.alignItems = 'center';
            this.controlContainer.style.position = 'relative';
            this.progress = this.controlContainer.appendHTML('progress');
            this.progress.classList.add('next-admin-progress');
            if (this.options.min) {
                this.progress.setAttribute('min', this.options.min.toString());
            }
            if (this.options.max) {
                this.progress.setAttribute('max', this.options.max.toString());
            }
            this.progressLabelContainer = this.controlContainer.appendHTML('div', (progressLabelContainer) => {
                progressLabelContainer.style.position = 'absolute';
                progressLabelContainer.style.left = '0px';
                progressLabelContainer.style.top = '0px';
                progressLabelContainer.style.width = '100%';
                progressLabelContainer.style.height = '100%';
                progressLabelContainer.style.verticalAlign = 'middle';
                progressLabelContainer.style.textAlign = 'center';
                progressLabelContainer.style.color = '#fff';
                progressLabelContainer.style.fontWeight = 'bolder';
                progressLabelContainer.style.fontSize = '12px';
                progressLabelContainer.style.paddingTop = '4px';
                progressLabelContainer.style.textShadow = '0px 0px 2px rgba(0,0,0,1)';
            });
        }


        public setLabel(text: string): Progress {
            this.label.innerHTML = text;
            if (text) {
                this.label.style.display = '';
                this.labelContainer.style.display = '';
            }
            else {
                this.labelContainer.style.display = 'none';
                this.label.style.display = 'none';
            }
            return this;
        }


        setValue(value?: number, fireChange?: boolean) {
            this.progress.value = value ?? 0;
            if (fireChange) {
                this.onValueChanged.dispatch(this, { value: value, origin: ChangeOrigin.code });
            }
            this.updateValueLabel();
        }

        updateValueLabel() {
            this.progressLabelContainer.innerHTML = this.options.progressLabelValueFunc(this);
        }

        getValue(): number {
            return Number(this.progress.value);
        }


    }


    export interface ProgressOptions extends LabelFormControlOptions {

        min?: number;

        max?: number;

        progressLabelValueFunc?: (progress: Progress) => string;
    }


}