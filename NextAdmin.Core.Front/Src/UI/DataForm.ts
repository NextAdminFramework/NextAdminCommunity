/// <reference path="Control.ts"/>

namespace NextAdmin.UI {


    export class DataForm extends Control implements IForm {

        saveButton: Button;

        deleteButton: Button;

        cancelButton: Button;

        footerToolBar: Toolbar;

        dataController: NextAdmin.Business.DataController_;

        header: HTMLDivElement;

        body: HTMLDivElement;

        footer: HTMLDivElement;

        options: FormOptions;

        public static style = '.next-admin-form { border:1px solid #ccc;padding-left:5px;padding-right:5px} .next-admin-form-header{border-bottom:1px solid #ccc;padding:5px} .next-admin-form-footer{border-top:1px solid #ccc;padding:5px;min-height:24px}';

        constructor(options?: FormOptions) {
            super('div', {
                dataController: options.dataController == null ? NextAdmin.Business.DataController_.factory(options.dataName) : options.dataController
                , ...options
            } as FormOptions);
            this.dataController = this.options.dataController;

            Style.append('Form', DataForm.style);
            this.element.classList.add('next-admin-form');

            this.header = this.element.appendHTML('div', (header) => {
                header.classList.add('next-admin-form-header');
                if (this.options.label) {
                    header.innerHTML = this.options.label;
                }
            });

            this.body = this.element.appendHTML('div', (body) => {



            });


            this.footer = this.element.appendHTML('div', (footer) => {

                footer.classList.add('next-admin-form-footer');

                footer.appendControl(new NextAdmin.UI.Toolbar(), (toolbar) => {
                    toolbar.element.style.cssFloat = 'right';

                    toolbar.appendControl(this.cancelButton = new Button({
                        text: Resources.refreshIcon + ' ' + Resources.cancel, action: () => {
                            this.dataController.cancel();
                        }
                    }));
                    this.deleteButton = new Button({ text: Resources.deleteIcon + ' ' + Resources.delete });
                    toolbar.appendControl(this.saveButton = new Button({
                        text: Resources.saveIcon + ' ' + Resources.save,
                        style: ButtonStyle.green,
                        action: () => {
                            this.dataController.save();
                        }
                    }));
                });

            });

            this.dataController.bindToForm(this);

            if (this.options.label) {
                this.header.innerHTML = this.options.label;
            }

        }


        enableReadOnly() {

        }

        disableReadOnly() {

        }


    }


    export interface FormOptions extends ControlOptions {

        dataController?: NextAdmin.Business.DataController_;

        label?: string;

        dataName?: string;

        dataPrimaryKey?: any;

    }

}